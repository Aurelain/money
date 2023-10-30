// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
const BatchUpdateSchema = {
    $id: 'BatchUpdateSchema',
    type: 'object',
    properties: {
        replies: {
            type: 'array',
            minItems: 1,
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
export default BatchUpdateSchema;

/*
{
    "spreadsheetId": "1c_VIhcRrYVOsMFHT9hi6HNXR5mZ7FILNjknEGLS2Zeo",
    "replies": [
        {},
        {}
    ]
}
*/
