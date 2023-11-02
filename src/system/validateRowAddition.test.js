import validateRowAddition from './validateRowAddition.js';
import Focus from '../utils/Focus.js';

// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
const HISTORY = [
    {
        spreadsheetId: 'MySpreadsheet1',
        from: 'Admin',
        value: 0,
        to: 'AliceCard',
        product: 'Init',
        date: '2024-10-10T10:00:00+03:00',
    },
    {
        spreadsheetId: 'MySpreadsheet2',
        from: 'Admin',
        value: 0,
        to: 'BobCard',
        product: 'Init',
        date: '2025-10-10T10:00:00+03:00',
    },
];
const ROW = {
    spreadsheetId: 'MySpreadsheet1',
    from: 'AliceCard',
    value: 7,
    to: 'Carla',
    product: 'Lorem Ipsum',
    date: '2024-10-10T10:10:00+03:00',
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
            row: {...ROW, spreadsheetId: 'MySpreadsheet2'},
            history: HISTORY,
        },
        output: true,
    },
];

// =====================================================================================================================
//  R U N
// =====================================================================================================================
Focus.run(validateRowAddition, tests, {sendInputAsArguments: true});
