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
        aliases: {
            type: 'object',
            patternProperties: {
                '.': {
                    type: 'string',
                },
            },
        },
        formulas: {
            type: 'array',
            items: {
                type: 'string',
            },
        },
    },
    required: ['defaults', 'aliases', 'formulas'],
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
    "aliases": {
        "Foo": "a"
    },
    "formulas": [
        "Foo+Bar"
    ]
}
*/
