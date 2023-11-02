import validateRowAddition from './validateRowAddition.js';
import Focus from '../utils/Focus.js';
import {ADMIN_ACCOUNT} from '../SETTINGS.js';

// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
const HISTORY = [
    {
        spreadsheetId: 'MySpreadsheet1',
        from: ADMIN_ACCOUNT,
        value: 100,
        to: 'AliceCard',
        product: 'Init',
        date: '2024-10-10T10:00:00+03:00',
    },
    {
        spreadsheetId: 'MySpreadsheet2',
        from: ADMIN_ACCOUNT,
        value: 0,
        to: 'BobCC',
        product: 'Init',
        date: '2026-10-10T10:00:00+03:00',
    },
];
const ROW = {
    spreadsheetId: 'MySpreadsheet1',
    from: 'AliceCard',
    value: 7,
    to: 'Carla',
    product: 'Lorem Ipsum',
    date: '2027-10-10T10:10:00+03:00',
};

// =====================================================================================================================
//  T E S T S
// =====================================================================================================================
const tests = [
    // -----------------------------------------------------------------------------------------------------------------
    {
        importance: 1,
        input: {
            row: {...ROW},
            history: HISTORY,
        },
        output: true,
    },
    // -----------------------------------------------------------------------------------------------------------------
    {
        importance: 1,
        input: {
            row: {...ROW, from: ADMIN_ACCOUNT},
            history: HISTORY,
        },
        output: true,
    },
    // -----------------------------------------------------------------------------------------------------------------
    {
        importance: 1,
        input: {
            row: {...ROW, from: ADMIN_ACCOUNT, to: 'AliceCard'},
            history: HISTORY,
        },
        output: 'REGEX:.',
    },
    // -----------------------------------------------------------------------------------------------------------------
    {
        importance: 1,
        input: {
            row: {...ROW, from: 'Foo', to: 'Bar'},
            history: HISTORY,
        },
        output: 'REGEX:.',
    },
    // -----------------------------------------------------------------------------------------------------------------
    {
        importance: 1,
        input: {
            row: {...ROW, value: 101},
            history: HISTORY,
        },
        output: 'REGEX:.',
    },
    // -----------------------------------------------------------------------------------------------------------------
    {
        importance: 1,
        input: {
            row: {...ROW, spreadsheetId: 'MySpreadsheet2', from: 'BobCC', value: 100},
            history: HISTORY,
        },
        output: true,
    },
    // -----------------------------------------------------------------------------------------------------------------
    {
        importance: 1,
        input: {
            row: {...ROW, date: '2023-10-10T10:10:00+03:00'},
            history: HISTORY,
        },
        output: 'REGEX:.',
    },
    // -----------------------------------------------------------------------------------------------------------------
    {
        importance: 1,
        input: {
            row: {...ROW, date: '2025-11-10T10:10:00+03:00', to: 'BobCC'},
            history: HISTORY,
        },
        output: 'REGEX:.',
    },
];

// =====================================================================================================================
//  R U N
// =====================================================================================================================
Focus.run(validateRowAddition, tests, {sendInputAsArguments: true});
