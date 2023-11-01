import memoize from 'memoize-one';

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
    const virtualAccounts = {};
    for (const row of history) {
        registerAccount(row.from, row, accountsBag, virtualAccounts);
        accountsBag[row.from].total -= row.value;

        registerAccount(row.to, row, accountsBag, virtualAccounts);
        accountsBag[row.to].total += row.value;

        valuesBag[row.value] = true;
        productsBag[row.product] = true;
    }

    const accounts = Object.keys(accountsBag).sort();
    const values = Object.keys(valuesBag).sort();
    const products = Object.keys(productsBag).sort();

    return {
        accounts,
        values,
        products,
        accountsBag,
        virtualAccounts,
    };
});

// =====================================================================================================================
//  P R I V A T E
// =====================================================================================================================
/**
 *
 */
const registerAccount = (name, row, accountsBag, virtualAccounts) => {
    const {date, spreadsheetId} = row;
    const account = accountsBag[name];
    if (!account) {
        const owner = inferOwner(name);
        accountsBag[name] = {
            total: 0,
            date,
            spreadsheetId,
            owner,
        };
        if (owner !== name) {
            virtualAccounts[owner] = true;
        }
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
