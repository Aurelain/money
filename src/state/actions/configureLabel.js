import {getState, setState} from '../store.js';
import saveOptions from '../../system/saveOptions.js';
import condense from '../../utils/condense.js';
import {selectMeta} from '../selectors.js';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const configureLabel = async (label) => {
    const state = getState();
    const meta = selectMeta(state);
    const entry = meta[label];
    const suggestion = entry ? `${entry.alias},${entry.suffix}` : '';
    const reply = prompt(`Configure "${label}"\nSyntax: alias,suffix`, suggestion);
    if (reply === null) {
        return;
    }

    setState((state) => {
        let [alias = '', suffix = ''] = reply.split(',');
        alias = condense(alias);
        suffix = condense(suffix);
        if (!alias && !suffix) {
            delete state.options.meta[label];
        } else {
            state.options.meta[label] = {alias, suffix};
        }
    });

    await saveOptions();
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default configureLabel;
