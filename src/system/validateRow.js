import assume from '../utils/assume.js';
import {ADMIN_ACCOUNT, PATTERN_ONLY_CHARACTERS} from '../SETTINGS.js';
import condense from '../utils/condense.js';

// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
const DATE_FORMAT = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\+\d\d:\d\d$/;
const ONLY_CHARACTERS_AND_SPACE = /^[\S ]+$/;

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const validateRow = (row) => {
    try {
        run(row);
    } catch (e) {
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
const run = (row) => {
    const {from, value, to, product, date} = row;

    assume(typeof from === 'string', 'From-account must be a string!');
    assume(from.length, 'From-account must not be empty!');
    assume(from.match(PATTERN_ONLY_CHARACTERS), 'From-account must not contain whitespace!');

    assume(Number.isInteger(value), 'Amount must be integer!');
    if (value === 0) {
        assume(from === ADMIN_ACCOUNT, 'Only an administrator may transfer zero amount!');
    } else {
        assume(value > 0, 'Amount must be positive!');
    }

    assume(typeof to === 'string', 'To-account must be a string!');
    assume(to.length, 'To-account must not be empty!');
    assume(to.match(PATTERN_ONLY_CHARACTERS), 'To-account must not contain whitespace!');
    assume(to !== ADMIN_ACCOUNT, 'To-account must not be an administrator!');
    assume(from !== to, 'From-account must differ from To-account!');

    assume(typeof product === 'string', 'Summary must be a string!');
    assume(product.length, 'Summary must not be empty!');
    assume(product.match(ONLY_CHARACTERS_AND_SPACE), 'Summary must not contain dubious whitespace!');
    assume(product === condense(product), 'Summary must not contain superfluous spaces!');

    assume(typeof date === 'string', 'Date must be a string!');
    assume(date.match(DATE_FORMAT), 'Invalid date format!');
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default validateRow;
