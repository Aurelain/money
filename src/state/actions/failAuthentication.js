import {setState} from '../store.js';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const failAuthentication = () => {
    setState((state) => {
        state.volatile.isAuthenticated = false;
    });
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default failAuthentication;
