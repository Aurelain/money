import localizeTime from '../utils/localizeTime.js';
import parseCommand from './parseCommand.js';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const buildRowPayload = (command, importantAccounts, defaults, meta) => {
    const digestion = parseCommand(command, defaults, meta);
    const {from, to, product} = digestion;
    const value = Number(digestion.value);
    const date = localizeTime(new Date());
    const row = {from, value, to, product, date};

    const spreadsheets = [];
    const motherFrom = importantAccounts[from];
    const motherTo = importantAccounts[to];

    motherFrom && spreadsheets.push(motherFrom);
    motherTo && motherTo !== motherFrom && spreadsheets.push(motherTo);

    return {
        spreadsheets,
        row,
    };
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default buildRowPayload;
