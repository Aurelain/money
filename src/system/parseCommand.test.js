import parseCommand from './parseCommand.js';
import Focus from '../utils/Focus.js';

// =====================================================================================================================
//  T E S T S
// =====================================================================================================================
const tests = [
    // -----------------------------------------------------------------------------------------------------------------
    {
        importance: 1,
        input: {
            command: '',
            defaults: {
                from: '',
                value: '',
                to: '',
                product: '',
            },
            meta: {},
        },
        output: {
            from: '',
            value: '',
            to: '',
            product: '',
        },
    },
    // -----------------------------------------------------------------------------------------------------------------
    {
        importance: 1,
        input: {
            command: '',
            defaults: {
                from: 'Foo',
                value: '100',
                to: 'Bar',
                product: 'Diverse',
            },
            meta: {},
        },
        output: {
            from: 'Foo',
            value: '100',
            to: 'Bar',
            product: 'Diverse',
        },
    },
    // -----------------------------------------------------------------------------------------------------------------
    {
        importance: 1,
        input: {
            command: 'hello',
            defaults: {
                from: 'Foo',
                value: '100',
                to: 'Bar',
                product: 'Diverse',
            },
            meta: {},
        },
        output: {
            from: 'Hello',
            value: '100',
            to: 'Bar',
            product: 'Diverse',
        },
    },
    // -----------------------------------------------------------------------------------------------------------------
    {
        importance: 1,
        input: {
            command: '5',
            defaults: {
                from: 'Foo',
                value: '100',
                to: 'Bar',
                product: 'Diverse',
            },
            meta: {},
        },
        output: {
            from: 'Foo',
            value: '5',
            to: 'Bar',
            product: 'Diverse',
        },
    },
    // -----------------------------------------------------------------------------------------------------------------
    {
        importance: 1,
        input: {
            command: '5 lorem ipsum dolor',
            defaults: {
                from: 'Foo',
                value: '100',
                to: 'Bar',
                product: 'Diverse',
            },
            meta: {},
        },
        output: {
            from: 'Foo',
            value: '5',
            to: 'Lorem',
            product: 'Ipsum Dolor',
        },
    },
    // -----------------------------------------------------------------------------------------------------------------
    {
        importance: 1,
        input: {
            command: 'lorem ipsum dolor sit amet',
            defaults: {
                from: 'Foo',
                value: '100',
                to: 'Bar',
                product: 'Diverse',
            },
            meta: {},
        },
        output: {
            from: 'Lorem',
            value: 'Ipsum',
            to: 'Dolor',
            product: 'Sit Amet',
        },
    },
    // -----------------------------------------------------------------------------------------------------------------
    {
        importance: 1,
        input: {
            command: 'a 200 b c 5 6',
            defaults: {
                from: 'Foo',
                value: '100',
                to: 'Bar',
                product: 'Diverse',
            },
            meta: {
                Lorem: {
                    alias: 'a',
                },
                Ipsum: {
                    alias: 'b',
                },
                Dolor: {
                    alias: 'c',
                },
                Sit: {
                    alias: '5',
                },
                Amet: {
                    alias: '6',
                },
            },
        },
        output: {
            from: 'Lorem',
            value: '200',
            to: 'Ipsum',
            product: 'Dolor Sit Amet',
        },
    },
];

// =====================================================================================================================
//  R U N
// =====================================================================================================================
Focus.run(parseCommand, tests, {});
