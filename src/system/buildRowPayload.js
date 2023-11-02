import localizeTime from '../utils/localizeTime.js';
import {getState} from '../state/store.js';
import {selectDefaults, selectMeta} from '../state/selectors.js';
import parseCommand from './parseCommand.js';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const buildRowPayload = (command, importantAccounts) => {
    const state = getState();
    const defaults = selectDefaults(state);
    const meta = selectMeta(state);
    const digestion = parseCommand({command, defaults, meta});
    const {from, to, product} = digestion;
    const value = Number(digestion.value);
    const date = localizeTime(new Date());
    const row = {from, value, to, product, date};

    const spreadsheets = [];
    importantAccounts[from] && spreadsheets.push(importantAccounts[from]);
    importantAccounts[to] && spreadsheets.push(importantAccounts[to]);

    return {
        spreadsheets,
        row,
    };
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default buildRowPayload;
