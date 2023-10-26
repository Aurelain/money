import memoize from 'memoize-one';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 * Creates a memoizator (https://en.wikipedia.org/wiki/Memoization).
 * This memoizator can then be used (later-on) to filter out the falsy arguments.
 * @return {function(...any)}
 */
const memo = () => {
    return memoize((...args) => {
        return args.filter((item) => item);
    });
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default memo;
