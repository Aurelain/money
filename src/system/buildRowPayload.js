import localizeTime from '../utils/localizeTime.js';
import {getState} from '../state/store.js';
import {selectDefaults, selectHistory, selectMeta} from '../state/selectors.js';
import parseCommand from './parseCommand.js';
import memoHistoryComputation from './memoHistoryComputation.js';
import {ADMIN_ACCOUNT} from '../SETTINGS.js';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const buildRowPayload = (command) => {
    const state = getState();
    const defaults = selectDefaults(state);
    const meta = selectMeta(state);
    const digestion = parseCommand({command, defaults, meta});
    const {from, to, product} = digestion;
    const value = Number(digestion.value);
    const date = localizeTime(new Date());
    const row = {from, value, to, product, date};

    const spreadsheets = [];
    const history = selectHistory(state);
    const {births} = memoHistoryComputation(history);
    if (from === ADMIN_ACCOUNT) {
        // TODO
    } else {
        births[from] && spreadsheets.push(births[from]);
        births[to] && spreadsheets.push(births[to]);
    }

    return {
        spreadsheets,
        row,
    };
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default buildRowPayload;
