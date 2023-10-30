import requestApi from '../../system/requestApi.js';
import checkOffline from '../../system/checkOffline.js';
import localizeTime from '../../utils/localizeTime.js';
import APPEND_SPREADSHEET_MOCK from '../../mocks/APPEND_SPREADSHEET_MOCK.js';
import AppendSpreadsheetSchema from '../../schemas/AppendSpreadsheetSchema.js';
import {getState, setState} from '../store.js';
import {selectDefaults, selectHistory, selectMeta} from '../selectors.js';
import parseCommand from '../../system/parseCommand.js';
import memoHistoryComputation from '../../system/memoHistoryComputation.js';
import buildRowPayload from '../../system/buildRowPayload.js';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const updateRow = async (focusedDate, command) => {
    const {spreadsheetId, row} = buildRowPayload(command);
    /*
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

    if (checkOffline()) {
        return;
    }

    const response = await requestAppend(spreadsheetId, row);
    console.log('response:', response);
    */
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default updateRow;
