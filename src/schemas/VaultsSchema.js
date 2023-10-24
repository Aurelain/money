// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
const VaultsSchema = {
    $id: 'VaultsSchema',
    type: 'object',
    properties: {
        files: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        minLength: 1,
                    },
                    name: {
                        type: 'string',
                        minLength: 1,
                    },
                    modifiedTime: {
                        type: 'string',
                        minLength: 1,
                    },
                },
                required: ['id', 'name', 'modifiedTime'],
            },
        },
    },
    required: ['files'],
};
// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default VaultsSchema;
/*
{
    "files": [
        {
            "id": "1zZE_PDRtZJoVNCjNQ6yu_J-lji3c1SoO0AszUmlASPE",
            "name": "Money_Foo",
            "modifiedTime": "2023-10-24T15:08:57.627Z"
        }
    ]
}
 */
