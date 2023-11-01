import requestApi from '../../system/requestApi.js';
import checkOffline from '../../system/checkOffline.js';
import {selectHistory, selectVaults} from '../selectors.js';
import {getState, setState} from '../store.js';
import SpreadsheetSchema from '../../schemas/SpreadsheetSchema.js';
import assume from '../../utils/assume.js';
import {ADMIN_ACCOUNT, DATE_FORMAT, VAULT_OPTIONS, VAULT_PREFIX} from '../../SETTINGS.js';
import VaultsSchema from '../../schemas/VaultsSchema.js';
import SPREADSHEET1_MOCK from '../../mocks/SPREADSHEET1_MOCK.js';
import SPREADSHEET2_MOCK from '../../mocks/SPREADSHEET2_MOCK.js';
import diffShallow from '../../utils/diffShallow.js';
import OptionsSpreadsheetSchema from '../../schemas/OptionsSpreadsheetSchema.js';
import healJson from '../../utils/healJson.js';
import OptionsSchema from '../../schemas/OptionsSchema.js';
import OPTIONS_MOCK from '../../mocks/OPTIONS_MOCK.js';
import VAULTS_MOCK from '../../mocks/VAULTS_MOCK.js';
import createOptionsSpreadsheet from '../../system/createOptionsSpreadsheet.js';
import saveOptions from '../../system/saveOptions.js';
import validateRowInHistory from '../../system/validateRowInHistory.js';
import inferOwner from '../../system/inferOwner.js';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const requestHistory = async (isForced = false) => {
    if (checkOffline()) {
        return;
    }

    const state = getState();
    const prevVaults = isForced ? {} : selectVaults(state);
    const {vaults, optionsVaultId} = await discoverVaults();

    if (!optionsVaultId) {
        await createOptionsSpreadsheet();
    }

    const changes = diffShallow(prevVaults, vaults);
    if (!changes) {
        console.log('Nothing changed.');
        return;
    }

    // Import the options from the `Money_Options` spreadsheet, if necessary:
    if (optionsVaultId && !(optionsVaultId in changes.unchanged)) {
        await loadOptions(optionsVaultId);
    }

    const pendingIds = {...changes.created, ...changes.updated};
    delete pendingIds[optionsVaultId];

    const prevHistory = selectHistory(state);
    const history = prevHistory.filter((item) => item.spreadsheetId in changes.unchanged);

    for (const id in pendingIds) {
        const spreadsheet = await requestSpreadsheet(id);
        const rows = validateSpreadsheet(spreadsheet, id);
        history.push(...rows);
    }

    const accountToSpreadsheet = linkAccountToSpreadsheet(history);
    checkAndCleanDuplicates(history, accountToSpreadsheet, vaults);
    history.sort(compareHistoryItems);
    validateHistory(history);

    setState((state) => {
        state.vaults = vaults;
        state.history = history;
    });
};

// =====================================================================================================================
//  P R I V A T E
// =====================================================================================================================
/**
 *
 */
const discoverVaults = async () => {
    const result = await requestApi('https://www.googleapis.com/drive/v3/files', {
        description: 'Discovering',
        searchParams: {
            q:
                `name contains '${VAULT_PREFIX}'` +
                ' and trashed=false' +
                " and mimeType='application/vnd.google-apps.spreadsheet'",
            fields: 'files(id,name,modifiedTime)',
        },
        schema: VaultsSchema,
        mock: VAULTS_MOCK,
    });

    const vaults = {};
    let optionsVaultId = '';
    for (const {id, name, modifiedTime} of result.files) {
        if (name.startsWith(VAULT_OPTIONS && name !== VAULT_OPTIONS)) {
            continue;
        }
        if (name.startsWith(VAULT_PREFIX)) {
            vaults[id] = name + ', ' + modifiedTime;
        }
        if (name === VAULT_OPTIONS) {
            assume(!optionsVaultId, 'Duplicate options files!');
            optionsVaultId = id;
        }
    }

    return {
        vaults,
        optionsVaultId,
    };
};

/**
 *
 */
const loadOptions = async (optionsVaultId) => {
    const response = await requestApi(`https://sheets.googleapis.com/v4/spreadsheets/${optionsVaultId}`, {
        description: 'Loading options',
        searchParams: {
            includeGridData: true,
        },
        schema: OptionsSpreadsheetSchema,
        mock: OPTIONS_MOCK,
    });

    let options;
    try {
        const firstCellValue = response.sheets[0].data[0].rowData[0].values[0].formattedValue;
        options = JSON.parse(firstCellValue);
    } catch (e) {
        options = {};
    }

    const before = JSON.stringify(options);
    healJson(options, OptionsSchema);
    const after = JSON.stringify(options);

    setState((state) => {
        state.options = options;
        state.optionsVaultId = optionsVaultId;
    });

    // console.log('before:', before);
    // console.log('after:', after);
    // TODO use `diffDeep` or something similar
    if (before !== after) {
        await saveOptions();
    }
};

/**
 *
 */
const requestSpreadsheet = async (spreadsheetId) => {
    return await requestApi(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
        description: 'Reading spreadsheet',
        searchParams: {
            includeGridData: true,
        },
        schema: SpreadsheetSchema,
        mock: (url) => (url.includes('Money_Foo1') ? SPREADSHEET1_MOCK : SPREADSHEET2_MOCK),
    });
};

/**
 *
 */
const validateSpreadsheet = (spreadsheet, spreadsheetId) => {
    const rows = [];

    const {sheets, properties} = spreadsheet;
    const {title} = properties;
    const [sheet] = sheets;
    const {rowData} = sheet.data[0];
    const {length} = rowData;

    for (let index = 1; index < length; index++) {
        const {values} = rowData[index];

        const from = values[0].formattedValue;

        const value = Number(values[1].formattedValue);
        assume(Number.isInteger(value), `Non-integer in ${title} at row ${index}!`);
        assume(value >= 0, `Expecting non-negative value in ${title} at row ${index}!`);

        const to = values[2].formattedValue;

        const product = values[3].formattedValue;

        const date = values[4].formattedValue;
        assume(date.match(DATE_FORMAT), `Invalid date format in ${title} at row ${index}!`);

        rows.push({spreadsheetId, index, from, value, to, product, date});
    }

    return rows;
};

/**
 *
 */
const linkAccountToSpreadsheet = (history) => {
    const bag = {};
    for (const row of history) {
        const {spreadsheetId, from, to} = row;
        if (from === ADMIN_ACCOUNT) {
            bag[to] = spreadsheetId;
            // Also spawn a link for the owner, even if it may not have been mentioned
            const owner = inferOwner(to);
            bag[owner] = spreadsheetId;
        }
    }
    return bag;
};

/**
 *
 */
const checkAndCleanDuplicates = (history, accountToSpreadsheet, vaults) => {
    const byDate = {};
    const {length} = history;
    for (let index = 0; index < length; index++) {
        const row = history[index];
        const {date} = row;
        const rows = byDate[date] || [];
        rows.push({row, index});
        check(rows.length <= 2, 'Too many rows share the same date!', row, vaults);
        byDate[date] = rows;
    }
    for (const key in byDate) {
        const [entry1, entry2] = byDate[key];
        const {row: r1} = entry1;
        if (entry2) {
            const {row: r2, index} = entry2;
            const isSame = r1.from === r2.from && r1.value === r2.value && r1.to === r2.to && r1.product === r2.product;
            check(isSame, 'Two different entries share the same date!', r2, vaults);
            check(r1.spreadsheetId !== r2.spreadsheetId, 'The same entry found in the same spreadsheet!', r2, vaults);
            history.splice(index, 1); // remove the second row
        } else {
            const {spreadsheetId, from, to} = r1;
            const fromOwner = inferOwner(from);
            const toOwner = inferOwner(to);
            const fromSpreadsheet = from === ADMIN_ACCOUNT ? spreadsheetId : accountToSpreadsheet[fromOwner];
            const toSpreadsheet = accountToSpreadsheet[toOwner];
            if (fromSpreadsheet === spreadsheetId) {
                const isToValid = toSpreadsheet === spreadsheetId || !toSpreadsheet;
                check(isToValid, 'Row has no to-mirror!', r1, vaults);
            } else if (toSpreadsheet === spreadsheetId) {
                check(!fromSpreadsheet, 'Row has no from-mirror!', r1, vaults);
            } else {
                check(false, "Row doesn't belong!", r1, vaults);
            }
        }
    }
};

/**
 *
 */
const compareHistoryItems = (a, b) => {
    return a.date.localeCompare(b.date);
};

/**
 * We're acting as if each row is created right now, starting from an empty database.
 * This helps in catching some chronological errors or some accounts going below zero when they shouldn't.
 */
const validateHistory = (history) => {
    const incrementalHistory = [];
    for (const row of history) {
        validateRowInHistory(row, incrementalHistory);
        incrementalHistory.push(row);
    }
};

/**
 *
 */
const check = (condition, message, row, vaults) => {
    if (!condition) {
        console.log('row:', row);
        const {spreadsheetId, date, index} = row;
        const title = vaults[spreadsheetId].replace(/,.*/, '');
        message += ` (${title}, ${index}, ${date})`;
        throw new Error(message);
    }
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default requestHistory;
