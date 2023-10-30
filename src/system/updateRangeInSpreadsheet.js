import requestApi from './requestApi.js';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const updateRangeInSpreadsheet = async (spreadsheetId, range, values) => {
    return await requestApi(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`, {
        searchParams: {
            valueInputOption: 'RAW',
        },
        method: 'PUT',
        body: {
            range,
            majorDimension: 'ROWS',
            values,
        },
        // schema: AppendSpreadsheetSchema,
        // mock: APPEND_SPREADSHEET_MOCK,
    });
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default updateRangeInSpreadsheet;
