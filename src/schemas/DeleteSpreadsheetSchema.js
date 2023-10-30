// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
const DeleteSpreadsheetSchema = {
    $id: 'DeleteSpreadsheetSchema',
    type: 'object',
    properties: {
        replies: {
            type: 'array',
            minItems: 1,
            maxItems: 1,
            items: {
                type: 'object',
                additionalProperties: false,
            },
        },
    },
    required: ['replies'],
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default DeleteSpreadsheetSchema;

/*
{
    "spreadsheetId": "1TfOxSoaprzG0SC69XqKn1xcoQ0iSpZhjFpBcIlqGBDg",
    "replies": [
        {}
    ]
}
*/
