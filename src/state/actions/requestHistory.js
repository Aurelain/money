import requestApi from '../../system/requestApi.js';
import checkOffline from '../../system/checkOffline.js';
import {selectHistory, selectVaults} from '../selectors.js';
import {getState, setState} from '../store.js';
import SpreadsheetSchema from '../../schemas/SpreadsheetSchema.js';
import assume from '../../utils/assume.js';
import {DATE_FORMAT, VAULT_OPTIONS, VAULT_PREFIX} from '../../SETTINGS.js';
import VaultsSchema from '../../schemas/VaultsSchema.js';
import SPREADSHEET1_MOCK from '../../mocks/SPREADSHEET1_MOCK.js';
import SPREADSHEET2_MOCK from '../../mocks/SPREADSHEET2_MOCK.js';
import diffShallow from '../../utils/diffShallow.js';
import objectify from '../../utils/objectify.js';
import OptionsSpreadsheetSchema from '../../schemas/OptionsSpreadsheetSchema.js';
import healJson from '../../utils/healJson.js';
import OptionsSchema from '../../schemas/OptionsSchema.js';
import OPTIONS_MOCK from '../../mocks/OPTIONS_MOCK.js';
import VAULTS_MOCK from '../../mocks/VAULTS_MOCK.js';
import createOptionsSpreadsheet from '../../system/createOptionsSpreadsheet.js';

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

    const historyByDate = objectify(history, 'date');
    for (const id in pendingIds) {
        const spreadsheet = await requestSpreadsheet(id);
        const rows = validateSpreadsheet(spreadsheet, id, historyByDate);
        history.push(...rows);
    }

    history.sort(compareHistoryItems);

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
            vaults[id] = modifiedTime;
        }
        if (name === VAULT_OPTIONS) {
            assume(!optionsVaultId, 'Duplicate options files!');
            optionsVaultId = id;
        }
    }
    console.log('vaults: ' + JSON.stringify(vaults, null, 4));

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

    healJson(options, OptionsSchema);

    setState((state) => {
        state.options = options;
        state.optionsVaultId = optionsVaultId;
    });

    // TODO write to cloud
};

/**
 *
 */
const requestSpreadsheet = async (spreadsheetId) => {
    return await requestApi(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
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
const validateSpreadsheet = (spreadsheet, spreadsheetId, historyByDate) => {
    const rows = [];

    const {sheets, properties} = spreadsheet;
    const {title} = properties;
    const {rowData} = sheets[0].data[0];
    const {length} = rowData;

    for (let i = 1; i < length; i++) {
        const {values} = rowData[i];

        const from = values[0].formattedValue;

        const value = Number(values[1].formattedValue);
        assume(Number.isInteger(value), `Non-integer in ${title} at row ${i}!`);
        assume(value > 0, `Expecting positive value in ${title} at row ${i}!`);

        const to = values[2].formattedValue;

        const product = values[3].formattedValue;

        const date = values[4].formattedValue;
        assume(date.match(DATE_FORMAT), `Invalid date format in ${title} at row ${i}!`);

        const item = {
            spreadsheetId,
            from,
            value,
            to,
            product,
            date,
        };

        if (date in historyByDate) {
            assume(!diffShallow(historyByDate[date], item), `Conflicts for date ${date} in ${title} at row ${i}!`);
        } else {
            historyByDate[date] = item;
            rows.push(item);
        }
    }

    return rows;
};

/**
 *
 */
const compareHistoryItems = (a, b) => {
    return a.date.localeCompare(b.date);
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default requestHistory;
