import memoize from 'memoize-one';
import checkVirtual from './checkVirtual.js';
import collectBirths from '../state/actions/collectBirths.js';

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
    for (const row of history) {
        registerAccount(row.from, row, accountsBag);
        accountsBag[row.from].total -= row.value;

        registerAccount(row.to, row, accountsBag);
        accountsBag[row.to].total += row.value;

        valuesBag[row.value] = true;
        productsBag[row.product] = true;
        if (checkVirtual(row)) {
            virtualDates[row.date] = true;
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
        births: collectBirths(history),
    };
});

// =====================================================================================================================
//  P R I V A T E
// =====================================================================================================================
/**
 *
 */
const registerAccount = (name, row, accountsBag) => {
    const {date, spreadsheetId} = row;
    const account = accountsBag[name];
    if (!account) {
        accountsBag[name] = {
            total: 0,
            date,
            spreadsheetId,
            owner: inferOwner(name),
        };
    } else {
        if (date < account.date) {
            account.date = date;
        }
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
