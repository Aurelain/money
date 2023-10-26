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
                },
            },
        },
        history: {
            type: 'array',
            items: {
                type: 'object',
                additionalProperties: false,
                properties: {
                    spreadsheetId: {
                        type: 'string',
                    },
                    from: {
                        type: 'string',
                    },
                    value: {
                        type: 'number',
                    },
                    to: {
                        type: 'string',
                    },
                    product: {
                        type: 'string',
                    },
                    date: {
                        type: 'string',
                    },
                },
                required: ['spreadsheetId', 'from', 'value', 'to', 'product', 'date'],
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
