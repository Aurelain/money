import localizeTime from '../utils/localizeTime.js';
import {getState} from '../state/store.js';
import {selectDefaults, selectHistory, selectMeta} from '../state/selectors.js';
import parseCommand from './parseCommand.js';
import memoHistoryComputation from './memoHistoryComputation.js';

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
    const history = selectHistory(state);
    const {accountsBag} = memoHistoryComputation(history);
    const spreadsheetId = getHostSpreadsheetId(digestion, accountsBag);
    const {from, to, product} = digestion;
    const value = Number(digestion.value);
    const date = localizeTime(new Date());
    return {
        spreadsheetId,
        row: [from, value, to, product, date],
    };
};

// =====================================================================================================================
//  P R I V A T E
// =====================================================================================================================
/**
 *
 */
const getHostSpreadsheetId = ({from, to}, accountsBag) => {
    let winner;
    const fromAccountDate = accountsBag[from]?.date;
    if (!fromAccountDate) {
        winner = to;
    } else {
        const toAccountDate = accountsBag[to]?.date;
        if (!toAccountDate) {
            winner = from;
        } else {
            winner = fromAccountDate <= toAccountDate ? from : to;
        }
    }
    return accountsBag[winner].spreadsheetId;
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default buildRowPayload;
