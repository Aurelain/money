import requestApi from '../../system/requestApi.js';
import checkOffline from '../../system/checkOffline.js';
import {selectHistory, selectVaults} from '../selectors.js';
import {getState, setState} from '../store.js';
import SpreadsheetSchema from '../../schemas/SpreadsheetSchema.js';
import assume from '../../utils/assume.js';
import {DATE_FORMAT, VAULT_DIR_NAME} from '../../SETTINGS.js';
import condense from '../../utils/condense.js';
import VaultsSchema from '../../schemas/VaultsSchema.js';
import SPREADSHEET1_MOCK from '../../system/SPREADSHEET1_MOCK.js';
import SPREADSHEET2_MOCK from '../../system/SPREADSHEET2_MOCK.js';
import diffShallow from '../../utils/diffShallow.js';
import objectify from '../../utils/objectify.js';

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
    const nextVaults = await discoverVaults();

    const changes = diffShallow(prevVaults, nextVaults);
    if (!changes) {
        console.log('Nothing changed.');
        return;
    }

    const prevHistory = selectHistory(state);
    const nextHistory = prevHistory.filter((item) => item.spreadsheetId in changes.unchanged);

    const historyByDate = objectify(nextHistory, 'date');
    const pendingIds = {...changes.created, ...changes.updated};

    for (const id in pendingIds) {
        const spreadsheet = await requestSpreadsheet(id);
        const rows = validateSpreadsheet(spreadsheet, id, historyByDate);
        nextHistory.push(...rows);
    }

    nextHistory.sort(compareHistoryItems);

    console.log('nextHistory:', nextHistory);

    setState((state) => {
        state.vaults = nextVaults;
        state.history = nextHistory;
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
            q: condense(`
                name contains '${VAULT_DIR_NAME}' and
                mimeType = 'application/vnd.google-apps.spreadsheet' and
                'root' in parents
            `),
            fields: 'files(id,name,modifiedTime)',
        },
        schema: VaultsSchema,
        mock: {
            files: [
                {
                    id: 'Money_Foo1',
                    name: 'Money_Foo1',
                    modifiedTime: '2023-10-24T15:08:57.627Z',
                },
                {
                    id: 'Money_Foo2',
                    name: 'Money_Foo2',
                    modifiedTime: '2023-10-24T15:08:57.627Z',
                },
            ],
        },
    });

    const vaults = {};
    for (const {id, name, modifiedTime} of result.files) {
        if (name.startsWith(VAULT_DIR_NAME)) {
            vaults[id] = modifiedTime;
        }
    }
    return vaults;
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
