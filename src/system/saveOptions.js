import {getState} from '../state/store.js';
import {selectOptions, selectOptionsVaultId} from '../state/selectors.js';
import checkOffline from './checkOffline.js';
import updateRangeInSpreadsheet from './updateRangeInSpreadsheet.js';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const saveOptions = async () => {
    if (checkOffline()) {
        return;
    }

    const state = getState();
    const options = selectOptions(state);
    const optionsVaultId = selectOptionsVaultId(state);
    await updateRangeInSpreadsheet(optionsVaultId, 'Sheet1!A1', [[JSON.stringify(options, null, 4)]]);
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default saveOptions;
