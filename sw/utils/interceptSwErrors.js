import announceClients from './announceClients.js';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const interceptSwErrors = () => {
    self.addEventListener('error', onError, true);
    self.addEventListener('unhandledrejection', onUnhandledRejection, true);
};

// =====================================================================================================================
//  P R I V A T E
// =====================================================================================================================
/**
 *
 */
const onError = (event) => {
    panic(event.type, event);
};

/**
 *
 */
const onUnhandledRejection = (event) => {
    panic(event.type, event.reason);
};

/**
 *
 */
const panic = (type, {message, stack}) => {
    announceClients({type: 'PANIC', panic: {type, message, stack}});
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
interceptSwErrors();
