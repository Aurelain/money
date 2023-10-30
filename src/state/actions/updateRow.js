import checkOffline from '../../system/checkOffline.js';
import {getState, setState} from '../store.js';
import {selectHistory} from '../selectors.js';
import buildRowPayload from '../../system/buildRowPayload.js';
import assume from '../../utils/assume.js';
import updateRangeInSpreadsheet from '../../system/updateRangeInSpreadsheet.js';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const updateRow = async (focusedDate, command) => {
    const state = getState();
    const history = selectHistory(state);
    const historyIndex = history.findIndex((item) => item.date === focusedDate);
    const existingRow = history[historyIndex];

    const {spreadsheetId, row} = buildRowPayload(command);
    assume(spreadsheetId === existingRow.spreadsheetId, 'The edit is too radical! Consider deletion instead.');

    const [from, value, to, product] = row;
    setState((state) => {
        Object.assign(state.history[historyIndex], {
            from,
            value,
            to,
            product,
        });
    });

    if (checkOffline()) {
        return;
    }

    // Overwrite date:
    row[row.length - 1] = existingRow.date;

    const rowNumber = existingRow.index + 1;
    const range = `Sheet1!A${rowNumber}:E${rowNumber}`;
    await updateRangeInSpreadsheet(spreadsheetId, range, [row]);
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default updateRow;
