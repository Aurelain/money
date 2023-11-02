import validateRowAddition from './validateRowAddition.js';
import Focus from '../utils/Focus.js';

// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
const IMPORTANT_ACCOUNTS = {
    AliceCard: 'MySpreadsheet1',
    BobCC: 'MySpreadsheet2',
};
const HISTORY = [
    {
        spreadsheetId: 'MySpreadsheet1',
        from: 'Admin',
        value: 100,
        to: 'AliceCard',
        product: 'Init',
        date: '2024-10-10T10:00:00+03:00',
    },
    {
        spreadsheetId: 'MySpreadsheet2',
        from: 'Admin',
        value: 0,
        to: 'BobCC',
        product: 'Init',
        date: '2026-10-10T10:00:00+03:00',
    },
    {
        spreadsheetId: 'MySpreadsheet2',
        from: 'BobCC',
        value: 3,
        to: 'AliceCard',
        product: 'Three',
        date: '2026-10-10T11:00:00+03:00',
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
            importantAccounts: IMPORTANT_ACCOUNTS,
            history: HISTORY,
        },
        output: true,
    },
    // -----------------------------------------------------------------------------------------------------------------
    {
        importance: 1,
        input: {
            row: {...ROW, from: 'Foo', to: 'Bar'},
            importantAccounts: IMPORTANT_ACCOUNTS,
            history: HISTORY,
        },
        output: 'REGEX:.',
    },
    // -----------------------------------------------------------------------------------------------------------------
    {
        importance: 1,
        input: {
            row: {...ROW, value: 200},
            importantAccounts: IMPORTANT_ACCOUNTS,
            history: HISTORY,
        },
        output: 'REGEX:.',
    },
    // -----------------------------------------------------------------------------------------------------------------
    {
        importance: 1,
        input: {
            row: {...ROW, spreadsheetId: 'MySpreadsheet2', from: 'BobCC', value: 100},
            importantAccounts: IMPORTANT_ACCOUNTS,
            history: HISTORY,
        },
        output: true,
    },
    // -----------------------------------------------------------------------------------------------------------------
    {
        importance: 1,
        input: {
            row: {...ROW, date: '2023-10-10T10:10:00+03:00'},
            importantAccounts: IMPORTANT_ACCOUNTS,
            history: HISTORY,
        },
        output: 'REGEX:.',
    },
    // -----------------------------------------------------------------------------------------------------------------
    {
        importance: 1,
        input: {
            row: {...ROW, date: '2025-10-10T10:10:00+03:00'},
            importantAccounts: IMPORTANT_ACCOUNTS,
            history: HISTORY,
        },
        output: 'REGEX:.',
    },
    // -----------------------------------------------------------------------------------------------------------------
    {
        importance: 1,
        input: {
            row: {
                spreadsheetId: 'MySpreadsheet1',
                from: 'BobCC',
                value: 3,
                to: 'AliceCard',
                product: 'Three',
                date: '2026-10-10T11:00:00+03:00',
            },
            importantAccounts: IMPORTANT_ACCOUNTS,
            history: HISTORY,
        },
        output: true,
    },
    // -----------------------------------------------------------------------------------------------------------------
    {
        importance: 1,
        input: {
            row: {
                spreadsheetId: 'MySpreadsheet2',
                from: 'BobCC',
                value: 3,
                to: 'AliceCard',
                product: 'Three',
                date: '2026-10-10T11:00:00+03:00',
            },
            importantAccounts: IMPORTANT_ACCOUNTS,
            history: HISTORY,
        },
        output: 'REGEX:.',
    },
];

// =====================================================================================================================
//  R U N
// =====================================================================================================================
Focus.run(validateRowAddition, tests, {sendInputAsArguments: true});
