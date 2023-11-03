import requestApi from '../../system/requestApi.js';
import checkOffline from '../../system/checkOffline.js';
import APPEND_SPREADSHEET_MOCK from '../../mocks/APPEND_SPREADSHEET_MOCK.js';
import AppendSpreadsheetSchema from '../../schemas/AppendSpreadsheetSchema.js';
import {setState} from '../store.js';
import buildRowPayload from '../../system/buildRowPayload.js';
import assume from '../../utils/assume.js';
import {selectHistory} from '../selectors.js';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const appendRow = async (command, importantAccounts, defaults, meta) => {
    const rowPayload = buildRowPayload(command, importantAccounts, defaults, meta);
    const {spreadsheets, row} = rowPayload;

    // Append the rows (plural, because they may be mirrored) before contacting the cloud:
    setState((state) => {
        const {from, value, to, product, date} = row;
        for (let i = 0; i < spreadsheets.length; i++) {
            const spreadsheetId = spreadsheets[i];
            state.history.push({
                spreadsheetId,
                spreadsheetTitle: spreadsheetId, // TODO
                index: 0, // to be updated
                from,
                value,
                to,
                product,
                date,
                isMirror: i === 1,
            });
        }
    });

    if (checkOffline()) {
        return;
    }

    const vector = Object.values(row);
    for (const spreadsheetId of spreadsheets) {
        const response = await requestAppend(spreadsheetId, vector);
        const {updatedRange} = response.updates;
        const rowIndex = Number(updatedRange.match(/!A(\d+)/)[1]) - 1;
        assume(rowIndex > 1, `Unexpected row index ${rowIndex}!`);
        setState((state) => {
            const history = selectHistory(state);
            const index = history.findIndex((item) => item.spreadsheetId === spreadsheetId && item.date === row.date);
            history[index].index = rowIndex;
        });
    }
};

// =====================================================================================================================
//  P R I V A T E
// =====================================================================================================================
/**
 * https://developers.google.com/sheets/api/samples/writing#append-values
 */
const requestAppend = async (spreadsheetId, row) => {
    return await requestApi(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:E1:append`,
        {
            description: 'Appending row',
            searchParams: {
                valueInputOption: 'RAW',
            },
            body: {
                range: 'Sheet1!A1:E1',
                majorDimension: 'ROWS',
                values: [row],
            },
            schema: AppendSpreadsheetSchema,
            mock: APPEND_SPREADSHEET_MOCK,
        },
    );
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default appendRow;
