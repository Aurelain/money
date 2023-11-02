import requestApi from '../../system/requestApi.js';
import checkOffline from '../../system/checkOffline.js';
import {getState, setState} from '../store.js';
import {selectHistory} from '../selectors.js';
import DELETE_SPREADSHEET_MOCK from '../../mocks/DELETE_SPREADSHEET_MOCK.js';
import DeleteSpreadsheetSchema from '../../schemas/DeleteSpreadsheetSchema.js';
import assume from '../../utils/assume.js';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const deleteRow = async (date) => {
    const state = getState();
    const history = selectHistory(state);
    const candidatesForDeletion = history.filter((item) => item.date === date);

    // Delete the rows (plural, because they may be mirrored) before contacting the cloud:
    setState((state) => {
        state.volatile.focusedDate = '';
        state.history = state.history.filter((item) => item.date !== date);
    });

    if (checkOffline()) {
        return;
    }

    for (const {spreadsheetId, index} of candidatesForDeletion) {
        assume(index > 1, `Unexpected row index ${index}!`); // fail-safe
        await requestDeletion(spreadsheetId, index);
        // TODO: assimilate any fresh changes that came from the cloud
    }
};

// =====================================================================================================================
//  P R I V A T E
// =====================================================================================================================
/**
 *
 */
const requestDeletion = async (spreadsheetId, index) => {
    return await requestApi(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
        description: 'Deleting row',
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
