import {ADMIN_ACCOUNT, CREDIT_CARD_MARK, VIRTUAL_KEYWORD} from '../SETTINGS.js';
import assume from '../utils/assume.js';

// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
const DEFAULT_BIRTH = {
    spreadsheetId: '',
    date: '0000-00-00T00:00:00+00:00',
};
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
    const {spreadsheetId, from, value, to, product, date} = row;
    const births = collectBirths(history);
    const fromBirth = births[from] || DEFAULT_BIRTH;
    const toBirth = births[to] || DEFAULT_BIRTH;

    // Validate `from` and `to` in the context of the whole history:
    if (from === ADMIN_ACCOUNT) {
        // This is a birth row.
        assume(!births[to], `Account "${to}" has already been born!`);
    } else {
        // This is a normal row.
        const isAllowed = fromBirth.spreadsheetId === spreadsheetId || toBirth.spreadsheetId === spreadsheetId;
        assume(isAllowed, 'At least one of the accounts must be native to the spreadsheet!');
    }

    // Validate `value` in the context of the whole history:
    if (!product.includes(VIRTUAL_KEYWORD) && !from.includes(CREDIT_CARD_MARK)) {
        const fromTotal = computeTotal(from, history);
        if (births[from]) {
            assume(fromTotal - value >= 0, `The account "${from}" is not allowed to become negative!`);
        }
    }

    // Validate `date` in the context of the whole history:
    const maxBirth = fromBirth.date > toBirth.date ? fromBirth.date : toBirth.date;
    assume(date >= maxBirth, `The date should be greater than ${maxBirth}`);
};

/**
 *
 */
const collectBirths = (history) => {
    const births = {};
    for (const row of history) {
        const {spreadsheetId, from, to, date} = row;
        if (from === ADMIN_ACCOUNT) {
            births[to] = {
                spreadsheetId,
                date,
            };
        }
    }
    return births;
};

/**
 *
 */
const computeTotal = (account, history) => {
    let total = 0;
    for (const row of history) {
        const {from, value, to, product} = row;
        if (from !== account && to !== account) {
            continue; // we're not interested in this row, as it doesn't touch our target account
        }
        if (product.includes(VIRTUAL_KEYWORD)) {
            continue; // virtual transactions don't change the total
        }
        total += (from === account ? -1 : 1) * value;
    }
    return total;
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default validateRowAddition;
