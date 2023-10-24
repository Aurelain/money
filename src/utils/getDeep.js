// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const getDeep = (object, path) => {
    if (!path) {
        return object;
    }
    path = path.replace(/\[(\d+)]/g, '.$1');
    const parts = path.split('.');
    const {length} = parts;
    for (let i = 0; i < length; i++) {
        object = object[parts[i]];
        if (typeof object !== 'object' || object === null) {
            // We cannot continue anymore.
            return i === length - 1 ? object : undefined;
        }
    }
    return object;
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default getDeep;
