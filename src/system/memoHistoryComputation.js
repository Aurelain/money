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
    for (const row of history) {
        registerAccount(row.from, row, accountsBag);
        accountsBag[row.from].total -= row.value;

        registerAccount(row.to, row, accountsBag);
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
    };
});

// =====================================================================================================================
//  P R I V A T E
// =====================================================================================================================
/**
 *
 */
const registerAccount = (name, {date, spreadsheetId}, accountsBag) => {
    const account = accountsBag[name];
    if (!account) {
        accountsBag[name] = {
            total: 0,
            date,
            spreadsheetId,
        };
    } else {
        if (date < account.date) {
            account.date = date;
        }
    }
};
// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default memoHistoryComputation;
