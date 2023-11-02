import {ADMIN_ACCOUNT, CREDIT_CARD_MARK} from '../SETTINGS.js';
import assume from '../utils/assume.js';
import checkVirtual from './checkVirtual.js';
import collectBirths from '../state/actions/collectBirths.js';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 * Assumptions:
 *      - the row is already validated, including its `spreadsheetId`
 *      - the history is already validated and sorted by date
 */
const validateRowAddition = (row, history) => {
    try {
        run(row, history);
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
const run = (row, history) => {
    const {spreadsheetId, from, value, to, date} = row;
    const births = collectBirths(history);
    const fromBirth = births[from];
    const toBirth = births[to];

    // Validate `from` and `to` in the context of the whole history:
    if (from === ADMIN_ACCOUNT) {
        // This is a birth row.
        assume(!births[to], `Account ${to} has already been born!`);
    } else {
        // This is a normal row.
        const isAllowed = fromBirth === spreadsheetId || toBirth === spreadsheetId;
        assume(isAllowed, 'At least one of the accounts must be native to the spreadsheet!');
    }

    // Validate `value` in the context of the whole history:
    if (!checkVirtual(row) && !from.includes(CREDIT_CARD_MARK)) {
        const fromTotal = computeTotal(from, history);
        if (births[from]) {
            assume(fromTotal - value >= 0, `Account ${from} is not allowed to become negative!`);
        }
    }

    // Validate `date` in the context of the whole history:
    if (history.length) {
        const previousRow = history.at(-1);
        const maxBirth = previousRow.date;
        if (maxBirth === date) {
            // A duplicate row is about to be added
            assume(checkIdentical(previousRow, row), 'Two different entries share the same date!');
            assume(spreadsheetId !== previousRow.spreadsheetId, 'Already added to this spreadsheet!');
            assume(history.at(-2)?.date !== date, 'Row added to many times!');
        } else {
            assume(date > maxBirth, `The date should be greater than ${maxBirth}!`);
        }
    }
};

/**
 *
 */
const computeTotal = (account, history) => {
    let total = 0;
    for (const row of history) {
        const {from, value, to} = row;
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
