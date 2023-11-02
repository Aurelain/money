import requestApi from '../../system/requestApi.js';
import checkOffline from '../../system/checkOffline.js';
import APPEND_SPREADSHEET_MOCK from '../../mocks/APPEND_SPREADSHEET_MOCK.js';
import AppendSpreadsheetSchema from '../../schemas/AppendSpreadsheetSchema.js';
import {setState} from '../store.js';
import buildRowPayload from '../../system/buildRowPayload.js';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const appendRow = async (command) => {
    return;
    const rowPayload = buildRowPayload(command);
    const {spreadsheetId, row} = rowPayload;
    const [from, value, to, product, date] = row;

    let historyIndex;
    setState((state) => {
        historyIndex = state.history.length;
        state.history.push({
            spreadsheetId,
            index: 0, // to be updated
            from,
            value,
            to,
            product,
            date,
        });
    });

    if (checkOffline()) {
        return;
    }

    const response = await requestAppend(spreadsheetId, row);
    const {updatedRange} = response.updates;
    const rowIndex = Number(updatedRange.match(/!A(\d+)/)[1]) - 1;
    setState((state) => {
        state.history[historyIndex].index = rowIndex;
    });
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
