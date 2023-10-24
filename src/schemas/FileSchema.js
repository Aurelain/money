
// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
const FileSchema = {
    $id: 'FileSchema',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            minLength: 1,
        },
        mimeType: {
            type: 'string',
            minLength: 1,
        },
        name: {
            type: 'string',
            minLength: 1,
        },
    },
    required: ['id', 'mimeType', 'name'],
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default FileSchema;

/*
{
    "kind": "drive#file",
    "mimeType": "application/vnd.google-apps.folder",
    "id": "1oGyE_38N9iVm1006R1FlDrBXTxGUFcGg",
    "name": "Money"
}
 */
