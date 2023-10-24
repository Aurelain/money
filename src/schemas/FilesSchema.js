import cloneShallow from '../utils/cloneShallow.js';
import FileSchema from './FileSchema.js';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
const FilesSchema = {
    $id: 'FilesSchema',
    type: 'object',
    properties: {
        files: {
            type: 'array',
            items: cloneShallow(FileSchema, '$id'),
        },
    },
    required: ['files'],
};
// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default FilesSchema;
/*
{
    "kind": "drive#fileList",
    "incompleteSearch": false,
    "files": [
        {
            "kind": "drive#file",
            "mimeType": "application/vnd.google-apps.folder",
            "id": "1oGyE_38N9iVm10N6R1FlDrBXTxGUFcGg",
            "name": "Money"
        }
    ]
}
 */
