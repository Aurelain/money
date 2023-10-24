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
        spreadsheetIds: {
            type: 'array',
            items: {
                type: 'string',
            },
        },
        volatile: {
            type: 'object',
            additionalProperties: false,
        },
    },
    required: ['tokens', 'spreadsheetIds', 'volatile'],
};
