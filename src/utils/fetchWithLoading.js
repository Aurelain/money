// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
const handlers = new Map();
let ongoing = 0;

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 * A very thin wrapper around `fetch`, so we can hook into its loading status globally.
 * Listeners are called with a boolean parameter indicating whether there are any ongoing connections or not.
 */
const fetchWithLoading = async (url, options) => {
    let response;
    let error;

    ongoing++;
    if (ongoing === 1) {
        for (const [handler] of handlers) {
            handler(true);
        }
    }

    try {
        response = await fetch(url, options);
    } catch (e) {
        error = e;
    }

    ongoing--;
    if (ongoing === 0) {
        for (const [handler] of handlers) {
            handler(false);
        }
    }

    if (error) {
        throw new Error(error);
    }
    return response;
};

/**
 *
 */
const addFetchListener = (handler) => {
    handlers.set(handler, true);
};

/**
 *
 */
const removeFetchListener = (handler) => {
    handlers.delete(handler);
};

/**
 *
 */
const checkIsLoading = () => {
    return ongoing !== 0;
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export {addFetchListener, removeFetchListener, checkIsLoading};
export default fetchWithLoading;
