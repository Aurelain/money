import {setState} from '../state/store.js';
import requestApi from './requestApi.js';
import NewSpreadsheetSchema from '../schemas/NewSpreadsheetSchema.js';
import NEW_SPREADSHEET_MOCK from '../mocks/NEW_SPREADSHEET_MOCK.js';
import {VAULT_OPTIONS} from '../SETTINGS.js';
import healJson from '../utils/healJson.js';
import OptionsSchema from '../schemas/OptionsSchema.js';
import UpdateSpreadsheetSchema from '../schemas/UpdateSpreadsheetSchema.js';
import UPDATE_SPREADSHEET_MOCK from '../mocks/UPDATE_SPREADSHEET_MOCK.js';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const createOptionsSpreadsheet = async () => {
    const {spreadsheetId} = await createSpreadsheet();
    const options = healJson({}, OptionsSchema, {verbose: false});
    await updateSpreadsheet(spreadsheetId, options);
    setState((state) => {
        state.optionsVaultId = spreadsheetId;
    });
};

// =====================================================================================================================
//  P R I V A T E
// =====================================================================================================================
/**
 *
 */
const createSpreadsheet = async () => {
    return await requestApi('https://sheets.googleapis.com/v4/spreadsheets', {
        description: 'Creating options',
        method: 'POST',
        schema: NewSpreadsheetSchema,
        mock: NEW_SPREADSHEET_MOCK,
    });
};

/**
 *
 */
const updateSpreadsheet = async (spreadsheetId, options) => {
    return await requestApi(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
        description: 'Renaming options',
        method: 'POST',
        body: {
            requests: [
                {
                    updateSpreadsheetProperties: {
                        properties: {
                            title: VAULT_OPTIONS,
                        },
                        fields: 'title',
                    },
                },
                {
                    updateCells: {
                        rows: [
                            {
                                values: [
                                    {
                                        userEnteredValue: {
                                            stringValue: JSON.stringify(options, null, 4),
                                        },
                                    },
                                ],
                            },
                        ],
                        fields: '*',
                        start: {
                            columnIndex: 0,
                            rowIndex: 0,
                            sheetId: 0,
                        },
                    },
                },
            ],
        },
        schema: UpdateSpreadsheetSchema,
        mock: UPDATE_SPREADSHEET_MOCK,
    });
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default createOptionsSpreadsheet;
