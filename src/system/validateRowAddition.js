import assume from '../utils/assume.js';
import checkVirtual from './checkVirtual.js';
import {CREDIT_CARD_MARK} from '../SETTINGS.js';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 * Assumptions:
 *      - the row is already validated, including its `spreadsheetId`
 *      - the history is already validated and sorted by date
 */
const validateRowAddition = (row, importantAccounts, history) => {
    try {
        run(row, importantAccounts, history);
    } catch (e) {
        // console.error(e);
        return e.message;
    }
    return true;
};

// =====================================================================================================================
//  P R I V A T E
// =====================================================================================================================
/**
 *
 */
const run = (row, importantAccounts, history) => {
    const {spreadsheetId, from, value, to, date} = row;

    // Validate `from` and `to` in the context of the whole history:
    const isAllowed = importantAccounts[from] === spreadsheetId || importantAccounts[to] === spreadsheetId;
    assume(isAllowed, 'At least one of the accounts must be known!');

    // Validate `value` in the context of the whole history:
    if (!checkVirtual(row) && !from.includes(CREDIT_CARD_MARK)) {
        const fromTotal = computeTotal(from, history);
        if (importantAccounts[from]) {
            assume(fromTotal - value >= 0, `Account ${from} must not become negative!`);
        }
    }

    // Validate `date` in the context of the whole history:
    if (history.length) {
        const previousRow = history.at(-1);
        const maxDate = previousRow.date;
        if (maxDate === date) {
            // A duplicate row is about to be added
            assume(checkIdentical(previousRow, row), 'Two different entries share the same date!');
            assume(spreadsheetId !== previousRow.spreadsheetId, 'Already added to this spreadsheet!');
            assume(history.at(-2)?.date !== date, 'Row added to many times!');
        } else {
            assume(date > maxDate, `The date should be greater than ${maxDate}!`);
        }
    }
};

/**
 *
 */
const computeTotal = (account, history) => {
    let total = 0;
    for (const row of history) {
        const {from, value, to, isMirror} = row;
        if (isMirror) {
            continue;
        }

        if (from !== account && to !== account) {
            continue; // we're not interested in this row, as it doesn't touch our target account
        }
        if (checkVirtual(row)) {
            continue; // virtual transactions don't change the total
        }
        total += (from === account ? -1 : 1) * value;
    }
    return total;
};

/**
 *
 */
const checkIdentical = (r1, r2) => {
    return r1.from === r2.from && r1.value === r2.value && r1.to === r2.to && r1.product === r2.product;
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default validateRowAddition;
