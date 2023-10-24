import requestApi from '../../system/requestApi.js';
import checkOffline from '../../system/checkOffline.js';
import {selectSpreadsheetIds} from '../selectors.js';
import {getState} from '../store.js';
import SpreadsheetSchema from '../../schemas/SpreadsheetSchema.js';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const requestHistory = async () => {
    if (checkOffline()) {
        return;
    }

    const state = getState();
    const spreadsheetIds = selectSpreadsheetIds(state);

    for (const spreadsheetId of spreadsheetIds) {
        const result = await getSpreadsheet(spreadsheetId);
        console.log('result:', result);
    }

    // setState((state) => {
    //     state.events = events;
    // });
};

// =====================================================================================================================
//  P R I V A T E
// =====================================================================================================================
/**
 *
 */
const getSpreadsheet = async (spreadsheetId) => {
    const result = await requestApi(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
        searchParams: {
            includeGridData: true,
        },
        schema: SpreadsheetSchema,
    });
    return result;
};
// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default requestHistory;
