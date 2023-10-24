export default {
    $id: 'STATE_SCHEMA',
    type: 'object',
    additionalProperties: false,
    properties: {
        tokens: {
            type: 'object',
            additionalProperties: false,
            properties: {
                accessToken: {
                    type: 'string',
                },
                refreshToken: {
                    type: 'string',
                },
                expirationTimestamp: {
                    type: 'number',
                },
            },
            required: ['accessToken', 'refreshToken', 'expirationTimestamp'],
        },
        vaults: {
            type: 'object',
            additionalProperties: false,
            patternProperties: {
                // The property name is actually the spreadsheet's `id`
                '.': {
                    // The property value is actually the spreadsheet's `modifiedTime`
                    type: 'string',
                    minLength: 1,
                },
            },
        },
        spreadsheets: {
            type: 'array',
            items: {
                type: 'object',
                additionalProperties: false,
                properties: {
                    id: {
                        type: 'string',
                        minLength: 1,
                    },
                    modified: {
                        type: 'string',
                    },
                },
                required: ['id', 'modified'],
            },
        },
        volatile: {
            type: 'object',
            additionalProperties: false,
        },
    },
    required: ['tokens', 'vaults', 'spreadsheets', 'volatile'],
};
