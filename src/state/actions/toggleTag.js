import {getState, setState} from '../store.js';
import {selectHistory} from '../selectors.js';
import checkOffline from '../../system/checkOffline.js';
import condense from '../../utils/condense.js';
import updateRangeInSpreadsheet from '../../system/updateRangeInSpreadsheet.js';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const toggleTag = async (date, tag) => {
    const state = getState();
    const history = selectHistory(state);
    const indexes = findIndexes(history, date);

    setState((state) => {
        for (const index of indexes) {
            state.history[index].product = toggleInSummary(state.history[index].product, tag);
        }
    });

    if (checkOffline()) {
        return;
    }

    const freshHistory = selectHistory(getState());
    for (const index of indexes) {
        const item = freshHistory[index];
        const values = [item.from, item.value, item.to, item.product, item.date];
        const rowNumber = item.index + 1;
        const range = `Sheet1!A${rowNumber}:E${rowNumber}`;
        await updateRangeInSpreadsheet(item.spreadsheetId, range, [values]);
    }
};

// =====================================================================================================================
//  P R I V A T E
// =====================================================================================================================
/**
 *
 */
const findIndexes = (history, date) => {
    const indexes = [];
    for (let i = 0; i < history.length; i++) {
        if (history[i].date === date) {
            indexes.push(i);
        }
    }
    return indexes;
};

/**
 *
 */
const toggleInSummary = (summary, tag) => {
    let parts = condense(summary).split(' ');
    if (parts.includes(tag)) {
        parts = parts.filter((item) => item !== tag);
    } else {
        parts.push(tag);
    }
    return parts.join(' ');
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default toggleTag;
