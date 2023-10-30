import requestApi from './requestApi.js';
import UpdateSpreadsheetSchema from '../schemas/UpdateSpreadsheetSchema.js';
import UPDATE_SPREADSHEET_MOCK from '../mocks/UPDATE_SPREADSHEET_MOCK.js';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const updateRangeInSpreadsheet = async (spreadsheetId, range, values) => {
    return await requestApi(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`, {
        description: 'Updating range',
        searchParams: {
            valueInputOption: 'RAW',
        },
        method: 'PUT',
        body: {
            range,
            majorDimension: 'ROWS',
            values,
        },
        schema: UpdateSpreadsheetSchema,
        mock: UPDATE_SPREADSHEET_MOCK,
    });
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default updateRangeInSpreadsheet;
