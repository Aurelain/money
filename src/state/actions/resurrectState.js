import localforage from 'localforage';
import {setState} from '../store.js';
import {STORE_KEY, USE_MOCK} from '../../SETTINGS.js';
import healJson, {healedCount} from '../../utils/healJson.js';
import STATE_SCHEMA from '../STATE_SCHEMA.js';
import STATE_MOCK from '../STATE_MOCK.js';
import {selectAccessToken} from '../selectors.js';

// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
const MOCK = USE_MOCK && STATE_MOCK;

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const resurrectState = async () => {
    const stored = USE_MOCK ? MOCK : (await localforage.getItem(STORE_KEY)) || {};
    // console.log('stored:', stored);

    try {
        healJson(stored, STATE_SCHEMA);
    } catch (e) {
        console.warn(e);
        return;
    }

    const isHealed = healedCount !== 0;
    // delete stored.tokens;

    setState((state) => {
        for (const key in stored) {
            state[key] = stored[key];
        }
        state.volatile.isAuthenticated = Boolean(selectAccessToken(state)); // ugly :(
        state.volatile.isHealed = isHealed;
        // state.volatile.focusedDate = '2023-10-30T12:36:20+02:00';
    });
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default resurrectState;
