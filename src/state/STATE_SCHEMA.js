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
        history: {
            type: 'array',
            items: {
                type: 'object',
                additionalProperties: false,
                properties: {
                    from: {
                        type: 'string',
                        minLength: 1,
                    },
                    value: {
                        type: 'number',
                        minimum: 1,
                    },
                    to: {
                        type: 'string',
                        minLength: 1,
                    },
                    product: {
                        type: 'string',
                        minLength: 1,
                    },
                    date: {
                        type: 'number',
                        minimum: 1,
                    },
                },
                required: ['from', 'value', 'to', 'product', 'date'],
            },
        },
        options: {
            type: 'object',
            additionalProperties: false,
            properties: {
                preferredFrom: {
                    type: 'string',
                },
            },
            required: ['preferredFrom'],
        },
        volatile: {
            type: 'object',
            additionalProperties: false,
        },
    },
    required: ['tokens', 'vaults', 'history', 'options', 'volatile'],
};
