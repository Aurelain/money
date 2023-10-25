import requestApi from '../../system/requestApi.js';
import checkOffline from '../../system/checkOffline.js';
import {selectVaults} from '../selectors.js';
import {getState, setState} from '../store.js';
import SpreadsheetSchema from '../../schemas/SpreadsheetSchema.js';
import assume from '../../utils/assume.js';
import {DATE_FORMAT, VAULT_DIR_NAME} from '../../SETTINGS.js';
import condense from '../../utils/condense.js';
import VaultsSchema from '../../schemas/VaultsSchema.js';
import SPREADSHEET_MOCK from '../../system/SPREADSHEET_MOCK.js';

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
    const existingVaults = selectVaults(state);
    const freshVaults = await discoverVaults();

    const history = [];
    const historyByDate = {};
    let hasChanged = false;
    for (const id in freshVaults) {
        if (!isForced) {
            const existingModifiedTime = existingVaults[id];
            const freshModifiedTime = freshVaults[id];
            if (existingModifiedTime === freshModifiedTime) {
                console.log(`Nothing changed in ${id}!`);
                continue;
            }
        }

        hasChanged = true;
        const spreadsheet = await requestSpreadsheet(id);
        const rows = validateSpreadsheet(spreadsheet, id, historyByDate);
        history.push(...rows);
    }

    if (!hasChanged) {
        return;
    }
    console.log('history:', history);

    setState((state) => {
        state.vaults = freshVaults;
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
                    id: 'Money_Foo',
                    name: 'Money_Foo',
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
        mock: SPREADSHEET_MOCK,
    });
};

/**
 *
 */
const validateSpreadsheet = (spreadsheet, spreadsheetId, historyByDate) => {
    const rows = [];

    const {sheets, properties} = spreadsheet;
    const {title: spreadsheetTitle} = properties;

    for (const sheet of sheets) {
        const {properties, data} = sheet;
        const {title} = properties;
        const longTitle = spreadsheetTitle + '.' + title;
        const {rowData} = data[0];
        assume(rowData, `Empty sheet found in ${longTitle}!`);
        const {length} = rowData;

        for (let i = 0; i < length; i++) {
            const row = rowData[i];
            const {values} = row;
            assume(values, `Empty row found in ${longTitle}!`);
            const {length: columnCount} = values;
            assume(columnCount === 4, `Unexpected column count in ${longTitle} at row ${i}!`);
            for (let j = 0; j < columnCount; j++) {
                const {formattedValue} = values[j];
                assume(formattedValue, `Falsy formatted value in ${longTitle} at row ${i}!`);
            }
        }

        for (let i = 1; i < length; i++) {
            const {values} = rowData[i];
            const value = Number(values[0].formattedValue);
            assume(Number.isInteger(value), `Non-integer in ${longTitle} at row ${i}!`);
            const to = values[1].formattedValue;
            const product = values[2].formattedValue;
            const date = values[3].formattedValue;
            assume(date.match(DATE_FORMAT), `Invalid date format in ${longTitle} at row ${i}!`);

            rows.push({
                spreadsheetId,
                sheet: title,
                to,
                product,
                date,
            });
        }
    }

    return rows;
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default requestHistory;
