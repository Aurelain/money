import requestApi from '../../system/requestApi.js';
import checkOffline from '../../system/checkOffline.js';
import {selectHistory, selectImportantAccounts, selectOptionsVaultId, selectVaults} from '../selectors.js';
import {getState, setState} from '../store.js';
import SpreadsheetSchema from '../../schemas/SpreadsheetSchema.js';
import assume from '../../utils/assume.js';
import {VAULT_OPTIONS, VAULT_PREFIX} from '../../SETTINGS.js';
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
import validateRowAddition from '../../system/validateRowAddition.js';
import validateRow from '../../system/validateRow.js';
import condense from '../../utils/condense.js';

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

    // TODO: uncomment the following line
    // const pendingIds = {...changes.created, ...changes.updated};
    // delete pendingIds[optionsVaultId];

    // TODO: comment the following lines. We had to force all transactions to be re-read, regardless of change status.
    const pendingIds = {...vaults};
    delete pendingIds[optionsVaultId];
    changes.unchanged = {}; // act as if everything changed

    const prevImportantAccounts = selectImportantAccounts(state);
    const importantAccounts = {};
    for (const name in prevImportantAccounts) {
        const motherId = prevImportantAccounts[name];
        if (motherId in changes.unchanged) {
            importantAccounts[name] = motherId;
        }
    }

    const prevHistory = selectHistory(state);
    const history = prevHistory.filter((item) => item.spreadsheetId in changes.unchanged);

    for (const id in pendingIds) {
        const spreadsheet = await requestSpreadsheet(id);
        const {roster, rows} = parseSpreadsheet(spreadsheet, id);
        history.push(...rows);
        for (const item of roster) {
            assume(!importantAccounts[item], `Account ${item} is already hosted someplace else!`);
            importantAccounts[item] = id;
        }
    }

    history.sort(compareHistoryItems);
    validateAndUpdateMirrors(history, importantAccounts);
    validateHistory(history, importantAccounts);

    setState((state) => {
        state.vaults = vaults;
        state.importantAccounts = importantAccounts;
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
        if (name.startsWith(VAULT_OPTIONS) && name !== VAULT_OPTIONS) {
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
const parseSpreadsheet = (spreadsheet, spreadsheetId) => {
    const rows = [];

    const {sheets, properties} = spreadsheet;
    const {title: spreadsheetTitle} = properties;
    const [sheet] = sheets;
    const {rowData} = sheet.data[0];
    const {length} = rowData;

    const roster = parseRoster(rowData, spreadsheetTitle);

    // Skip the roster and the headers, so start at 2:
    for (let index = 2; index < length; index++) {
        const {values} = rowData[index];
        const from = values[0].formattedValue;
        const value = Number(values[1].formattedValue);
        const to = values[2].formattedValue;
        const product = values[3].formattedValue;
        const date = values[4].formattedValue;
        const row = {spreadsheetId, spreadsheetTitle, index, from, value, to, product, date};
        const validation = validateRow(row);
        assume(validation === true, validation + ` (${spreadsheetTitle}, row ${index}, ${date})`);
        rows.push(row);
    }

    return {roster, rows};
};

/**
 *
 */
const parseRoster = (rowData, spreadsheetTitle) => {
    const firstCell = rowData[0].values[0];
    let rosterText = firstCell.formattedValue || '';
    rosterText = rosterText.replace(/,/g, ' ');
    rosterText = condense(rosterText);
    const roster = rosterText.split(' ');
    assume(roster.length > 0, `No hosted accounts in ${spreadsheetTitle}!`);
    return roster;
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
const validateHistory = (history, importantAccounts) => {
    const incrementalHistory = [];
    for (const row of history) {
        if (row.isMirror) {
            continue;
        }

        const validation = validateRowAddition(row, importantAccounts, incrementalHistory);
        check(validation === true, validation, row);
        incrementalHistory.push(row);
    }
};

/**
 *
 */
const validateAndUpdateMirrors = (history, importantAccounts) => {
    for (let i = 0; i < history.length; i++) {
        const row = history[i];
        const {from, to, date} = row;
        const fromMother = importantAccounts[from];
        const toMother = importantAccounts[to];
        if (fromMother && toMother && fromMother !== toMother) {
            const nextRow = history[i + 1];
            check(nextRow?.date === date, 'Expecting mirror!', row);
            nextRow.isMirror = true;
            i++; // skip next item, which is certain to be a mirror
        }
    }
};

/**
 * A custom version of `assume()`.
 */
const check = (condition, message, row) => {
    if (!condition) {
        console.log('Row:', row);
        const {spreadsheetTitle, date, index} = row;
        message += ` (${spreadsheetTitle}, ${index}, ${date})`;
        throw new Error(message);
    }
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default requestHistory;
