// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
const ShortcutSchema = {
    $id: 'ShortcutSchema',
    type: 'object',
    properties: {
        shortcutDetails: {
            type: 'object',
            properties: {
                targetId: {
                    type: 'string',
                    minLength: 1,
                },
                targetMimeType: {
                    type: 'string',
                    minLength: 1,
                },
            },
            required: ['targetId', 'targetMimeType'],
        },
    },
    required: ['shortcutDetails'],
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default ShortcutSchema;

/*
{
    "shortcutDetails": {
        "targetId": "1f8dOMr676WlqI-h8cI7tVqdsnfaJI00y5aN58uidUwA",
        "targetMimeType": "application/vnd.google-apps.spreadsheet"
    }
}
 */
