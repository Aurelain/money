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
        accountsBag[row.from] = accountsBag[row.from] || 0;
        accountsBag[row.from] -= row.value;
        accountsBag[row.to] = accountsBag[row.to] || 0;
        accountsBag[row.to] += row.value;
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

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default memoHistoryComputation;
