import requestApi from '../../system/requestApi.js';
import checkOffline from '../../system/checkOffline.js';
import {getState, setState} from '../store.js';
import {selectHistory} from '../selectors.js';
import DELETE_SPREADSHEET_MOCK from '../../mocks/DELETE_SPREADSHEET_MOCK.js';
import DeleteSpreadsheetSchema from '../../schemas/DeleteSpreadsheetSchema.js';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const deleteRow = async (date) => {
    const state = getState();
    const history = selectHistory(state);
    const historyIndex = history.findIndex((item) => item.date === date);
    const {spreadsheetId, index} = history[historyIndex];

    setState((state) => {
        state.volatile.focusedDate = '';
        state.history.splice(historyIndex, 1);
    });

    if (checkOffline()) {
        return;
    }
    await requestDeletion(spreadsheetId, index);
};

// =====================================================================================================================
//  P R I V A T E
// =====================================================================================================================
/**
 *
 */
const requestDeletion = async (spreadsheetId, index) => {
    return await requestApi(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
        body: {
            requests: [
                {
                    deleteDimension: {
                        range: {
                            // sheetId, // this seems to be optional
                            dimension: 'ROWS',
                            startIndex: index,
                            endIndex: index + 1,
                        },
                    },
                },
            ],
        },
        schema: DeleteSpreadsheetSchema,
        mock: DELETE_SPREADSHEET_MOCK,
    });
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default deleteRow;
