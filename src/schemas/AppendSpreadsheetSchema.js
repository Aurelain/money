// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
const AppendSpreadsheetSchema = {
    $id: 'AppendSpreadsheetSchema',
    type: 'object',
    properties: {
        updates: {
            type: 'object',
            properties: {
                updatedRange: {
                    type: 'string',
                    pattern: '^Sheet1!A\\d+:E\\d+$',
                },
                updatedRows: {
                    const: 1,
                },
            },
            required: ['updatedRange', 'updatedRows'],
        },
    },
    required: ['updates'],
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default AppendSpreadsheetSchema;

/*
{
    "spreadsheetId": "1zZE_PDRtZJoVNCjNQ6yu_J-lji3c1SoO0AszUmlASPE",
    "tableRange": "Sheet1!A1:E2",
    "updates": {
        "spreadsheetId": "1zZE_PDRtZJoVNCjNQ6yu_J-lji3c1SoO0AszUmlASPE",
        "updatedRange": "Sheet1!A3:E3",
        "updatedRows": 1,
        "updatedColumns": 5,
        "updatedCells": 5
    }
}
*/
