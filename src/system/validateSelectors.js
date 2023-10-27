// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const validateSelectors = ({from, value, to, product}) => {
    if (!from || !value || !to || !product) {
        return false;
    }

    if (from === to) {
        return false;
    }

    value = Number(value);
    if (!Number.isInteger(value) || value <= 0) {
        return false;
    }

    return true;
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default validateSelectors;
