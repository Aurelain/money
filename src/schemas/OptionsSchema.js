// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
const OptionsSchema = {
    $id: 'OptionsSchema',
    type: 'object',
    additionalProperties: false,
    properties: {
        defaults: {
            type: 'object',
            additionalProperties: false,
            properties: {
                from: {
                    type: 'string',
                },
                value: {
                    type: 'string',
                },
                to: {
                    type: 'string',
                },
                product: {
                    type: 'string',
                },
            },
            required: ['from', 'value', 'to', 'product'],
        },
        meta: {
            type: 'object',
            patternProperties: {
                '.': {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                        alias: {
                            type: 'string',
                        },
                        suffix: {
                            type: 'string',
                        },
                        owner: {
                            type: 'string',
                        },
                    },
                    required: ['alias', 'suffix', 'owner'],
                },
            },
        },
        formulas: {
            type: 'array',
            items: {
                type: 'object',
                additionalProperties: false,
                properties: {
                    label: {
                        type: 'string',
                    },
                    operations: {
                        type: 'string',
                    },
                },
                required: ['label', 'operations'],
            },
        },
    },
    required: ['defaults', 'meta', 'formulas'],
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default OptionsSchema;

/*
{
    "defaults": {
        "from": "Foo",
        "value": "100",
        "to": "Bar",
        "product": "Misc"
    },
    "meta": {
        "Foo": {
            "alias": "f",
            "suffix": "👪"
        }
    },
    "formulas": [
        "Foo+Bar"
    ]
}
*/
