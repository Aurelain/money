// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
const UpdateSpreadsheetSchema = {
    $id: 'UpdateSpreadsheetSchema',
    type: 'object',
    properties: {
        updatedRows: {
            type: 'number',
            minimum: 1,
        },
    },
    required: ['updatedRows'],
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default UpdateSpreadsheetSchema;

/*
{
    "spreadsheetId": "10fOxSoaprzG0SC69XqKn1xcoQYiSpZhjFpBcIlqGBDg",
    "updatedRange": "Sheet1!A6:E6",
    "updatedRows": 1,
    "updatedColumns": 5,
    "updatedCells": 5
}
*/
