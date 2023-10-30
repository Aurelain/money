import requestApi from '../../system/requestApi.js';
import checkOffline from '../../system/checkOffline.js';
import localizeTime from '../../utils/localizeTime.js';
import APPEND_SPREADSHEET_MOCK from '../../mocks/APPEND_SPREADSHEET_MOCK.js';
import AppendSpreadsheetSchema from '../../schemas/AppendSpreadsheetSchema.js';
import {getState, setState} from '../store.js';
import {selectDefaults, selectHistory, selectMeta} from '../selectors.js';
import parseCommand from '../../system/parseCommand.js';
import memoHistoryComputation from '../../system/memoHistoryComputation.js';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const appendRow = async (command) => {
    const state = getState();
    const defaults = selectDefaults(state);
    const meta = selectMeta(state);
    const digestion = parseCommand({command, defaults, meta});
    const history = selectHistory(state);
    const {accountsBag} = memoHistoryComputation(history);
    const spreadsheetId = getHostSpreadsheetId(digestion, accountsBag);
    const {from, to, product} = digestion;
    let value = Number(digestion.value);
    const date = localizeTime(new Date());
    const row = [from, value, to, product, date];

    if (checkOffline()) {
        return;
    }

    setState((state) => {
        state.history.push({
            spreadsheetId,
            from,
            value,
            to,
            product,
            date,
        });
    });

    const response = await requestAppend(spreadsheetId, row);
    console.log('response:', response);
};

// =====================================================================================================================
//  P R I V A T E
// =====================================================================================================================
/**
 *
 */
const requestAppend = async (spreadsheetId, row) => {
    return await requestApi(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:E1:append`,
        {
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

/**
 *
 */
const getHostSpreadsheetId = ({from, to}, accountsBag) => {
    let winner;
    const fromAccountDate = accountsBag[from]?.date;
    if (!fromAccountDate) {
        winner = to;
    } else {
        const toAccountDate = accountsBag[to]?.date;
        if (!toAccountDate) {
            winner = from;
        } else {
            winner = fromAccountDate <= toAccountDate ? from : to;
        }
    }
    return accountsBag[winner].spreadsheetId;
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default appendRow;
