import {setState} from '../store.js';
import saveOptions from '../../system/saveOptions.js';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const toggleFavorite = async (category, name) => {
    setState((state) => {
        if (state.options.defaults[category] === name) {
            state.options.defaults[category] = '';
        } else {
            state.options.defaults[category] = name;
        }
    });

    await saveOptions();
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default toggleFavorite;
