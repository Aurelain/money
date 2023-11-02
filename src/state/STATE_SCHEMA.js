import cloneShallow from '../utils/cloneShallow.js';
import OptionsSchema from '../schemas/OptionsSchema.js';

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
                    // The property value is actually the spreadsheet's `title+modifiedTime`
                    type: 'string',
                },
            },
        },
        importantAccounts: {
            type: 'object',
            additionalProperties: false,
            patternProperties: {
                // The property name is actually the name of an important account (e.g. "AnaCard")
                '.': {
                    // The property value is actually the mother-spreadsheet id
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
                    spreadsheetTitle: {
                        type: 'string',
                    },
                    index: {
                        type: 'number',
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
                required: ['spreadsheetId', 'spreadsheetTitle', 'from', 'value', 'to', 'product', 'date'],
            },
        },
        options: cloneShallow(OptionsSchema, '$id'),
        optionsVaultId: {
            type: 'string',
        },
        volatile: {
            type: 'object',
            additionalProperties: false,
        },
    },
    required: ['tokens', 'vaults', 'importantAccounts', 'history', 'options', 'optionsVaultId', 'volatile'],
};
