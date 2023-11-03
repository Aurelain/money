import memoize from 'memoize-one';
import checkVirtual from './checkVirtual.js';
import {selectImportantAccounts} from '../state/selectors.js';
import {getState} from '../state/store.js';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const memoHistoryComputation = memoize((history) => {
    const accountsBag = {};
    const valuesBag = {};
    const productsBag = {};
    const virtualDates = {};

    // Cheat the memoization a little by getting the importantAccounts from the global state:
    addImportantAccounts(accountsBag);

    for (const row of history) {
        const {from, value, to, product, date} = row;
        registerAccount(from, accountsBag);
        registerAccount(to, accountsBag);

        valuesBag[value] = true;
        productsBag[product] = true;
        if (checkVirtual(row)) {
            virtualDates[date] = true;
            accountsBag[from].worth += value;
            accountsBag[to].worth -= value;
        } else {
            accountsBag[from].total -= value;
            accountsBag[to].total += value;
            accountsBag[from].worth -= value;
            accountsBag[to].worth += value;
        }
    }

    const accounts = Object.keys(accountsBag).sort();
    const values = Object.keys(valuesBag).sort();
    const products = Object.keys(productsBag).sort();

    return {
        accounts,
        values,
        products,
        accountsBag,
        virtualDates,
    };
});

// =====================================================================================================================
//  P R I V A T E
// =====================================================================================================================
/**
 *
 */
const addImportantAccounts = (accountsBag) => {
    const state = getState();
    const importantAccounts = selectImportantAccounts(state);
    for (const name in importantAccounts) {
        registerAccount(name, accountsBag);
    }
};

/**
 *
 */
const registerAccount = (name, accountsBag) => {
    if (!accountsBag[name]) {
        accountsBag[name] = {
            total: 0,
            worth: 0,
            owner: inferOwner(name),
        };
    }
};

/**
 *
 */
const inferOwner = (name) => {
    const {length} = name;
    for (let i = 1; i < length; i++) {
        const c = name.charAt(i);
        if (c === c.toLocaleUpperCase()) {
            return name.substring(0, i);
        }
    }
    return name;
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default memoHistoryComputation;
