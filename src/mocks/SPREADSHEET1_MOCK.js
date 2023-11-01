import {ADMIN_ACCOUNT, CREDIT_KEYWORD} from '../SETTINGS.js';

// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
const DATA = [
    ['From', 'Amount', 'To', 'Summary', 'Date'],
    [ADMIN_ACCOUNT, 0, 'Liam', 'Init', '2023-10-25T06:01:22+03:00'],
    [ADMIN_ACCOUNT, 0, 'Aiden', 'Init', '2023-10-25T06:02:22+03:00'],
    [ADMIN_ACCOUNT, 0, 'Harper', 'Init', '2023-10-25T06:03:22+03:00'],
    [ADMIN_ACCOUNT, 0, 'Lucas', 'Init', '2023-10-25T06:04:22+03:00'],
    [ADMIN_ACCOUNT, 0, 'Elizabeth', 'Init', '2023-10-25T06:05:22+03:00'],
    [ADMIN_ACCOUNT, 0, 'Henry', 'Init', '2023-10-25T06:06:22+03:00'],
    [ADMIN_ACCOUNT, 0, 'Chloe', 'Init', '2023-10-25T06:07:22+03:00'],
    [ADMIN_ACCOUNT, 0, 'Mason', 'Init', '2023-10-25T06:08:22+03:00'],
    [ADMIN_ACCOUNT, 0, 'Ella', 'Init', '2023-10-25T06:09:22+03:00'],
    [ADMIN_ACCOUNT, 0, 'Michael', 'Init', '2023-10-25T06:10:22+03:00'],
    [ADMIN_ACCOUNT, 0, 'Avery', 'Init', '2023-10-25T06:11:22+03:00'],
    [ADMIN_ACCOUNT, 0, 'Jackson', 'Init', '2023-10-25T06:12:22+03:00'],
    [ADMIN_ACCOUNT, 0, 'Abigail', 'Init', '2023-10-25T06:13:22+03:00'],
    [ADMIN_ACCOUNT, 0, 'William', 'Init', '2023-10-25T06:14:22+03:00'],
    [ADMIN_ACCOUNT, 0, 'Sofia', 'Init', '2023-10-25T06:15:22+03:00'],
    [ADMIN_ACCOUNT, 0, 'Ethan', 'Init', '2023-10-25T06:16:22+03:00'],
    [ADMIN_ACCOUNT, 0, 'Madison', 'Init', '2023-10-25T06:17:22+03:00'],
    [ADMIN_ACCOUNT, 0, 'Aria', 'Init', '2023-10-25T06:19:22+03:00'],
    [ADMIN_ACCOUNT, 0, 'Emma', 'Init', '2023-10-25T06:22:22+03:00'],
    [ADMIN_ACCOUNT, 0, 'James', 'Init', '2023-10-25T06:23:22+03:00'],
    [ADMIN_ACCOUNT, 0, 'Noah', 'Init', '2023-10-25T06:26:22+03:00'],
    [ADMIN_ACCOUNT, 0, 'Isabella', 'Init', '2023-10-25T06:33:22+03:00'],
    [ADMIN_ACCOUNT, 0, 'Benjamin', 'Init', '2023-10-25T06:38:22+03:00'],
    ['Monica', 3200, 'Liam', 'Coconut', '2023-10-25T07:48:59+03:00'],
    ['Razvan', 1700, 'Aiden', 'Pear', '2023-10-25T08:25:14+03:00'],
    ['Camelia', 2200, 'Harper', 'Raspberry', '2023-10-25T09:11:27+03:00'],
    ['Sorin', 4300, 'Lucas', 'Blackberry', '2023-10-25T10:37:09+03:00'],
    ['Cristina', 3100, 'Elizabeth', 'Cantaloupe', '2023-10-25T11:56:38+03:00'],
    ['Vlad', 2300, 'Henry', 'Grapefruit', '2023-10-25T12:19:44+03:00'],
    ['Loredana', 2000, 'Chloe', 'Plum', '2023-10-25T13:45:52+03:00'],
    ['Robert', 4000, 'Mason', 'Lime', '2023-10-25T14:20:07+03:00'],
    ['Alina', 2900, 'Ella', 'Apricot', '2023-10-25T15:38:29+03:00'],
    ['Ionut', 2500, 'Michael', 'Nectarine', '2023-10-25T16:55:36+03:00'],
    ['Raluca', 2700, 'Avery', 'Cranberry', '2023-10-25T17:32:59+03:00'],
    ['Stefan', 3500, 'Jackson', 'Raisin', '2023-10-25T18:51:15+03:00'],
    ['Foo', 0, 'Abigail', 'Fig', '2023-10-25T19:28:47+03:00'],
    ['Raul', 3200, 'William', 'Melon', '2023-10-25T20:46:08+03:00'],
    ['Andreea', 2600, 'Sofia', 'Papaya', '2023-10-25T21:13:22+03:00'],
    ['Catalin', 1800, 'Ethan', 'Dragon Fruit', '2023-10-25T22:32:40+03:00'],
    ['Elena', 2100, 'Madison', 'Guava', '2023-10-25T23:01:57+03:00'],
    ['Bogdan', 2800, 'Liam', 'Litchi', '2023-10-26T00:25:22+03:00'],
    ['Mihaela', 2200, 'Aria', 'Passion Fruit', '2023-10-26T01:45:38+03:00'],
    ['Silvia', 3000, 'Liam', 'Peach', '2023-10-26T11:43:25+03:00'],
    ['Doru', 2600, 'Emma', 'Mango', '2023-10-26T12:15:48+03:00'],
    ['Georgiana', 2500, 'James', 'Cherry', '2023-10-26T13:37:55+03:00'],
    ['Daniela', 1900, 'Mason', 'Blackberry', '2023-10-26T15:28:59+03:00'],
    ['Marian', 2800, 'Harper', 'Strawberry', '2023-10-26T16:51:03+03:00'],
    ['Marina', 3400, 'Noah', 'Grapes', '2023-10-26T17:19:15+03:00'],
    ['Ciprian', 2700, 'Chloe', 'Pomegranate', '2023-10-26T18:37:46+03:00'],
    ['Lavinia', 2100, 'Sofia', 'Grapes', '2023-10-27T05:15:38+03:00'],
    ['Cipriana', 3100, 'Lucas', 'Cherry', '2023-10-27T06:35:02+03:00'],
    ['Ilinca', 1700, 'Madison', 'Lemon', '2023-10-27T07:02:37+03:00'],
    ['Ionela', 2500, 'Ethan', 'Watermelon', '2023-10-27T08:25:16+03:00'],
    ['Alexandru', 2800, 'Aria', 'Banana', '2023-10-27T09:44:57+03:00'],
    ['Roxana', 3200, 'Isabella', 'Apple', '2023-10-27T10:12:34+03:00'],
    ['Vladimir', 2600, 'Aiden', 'Orange', '2023-10-27T11:39:47+03:00'],
    ['Cornelia', 3000, 'Henry', 'Grapefruit', '2023-10-27T12:04:57+03:00'],
    ['Adina', 3600, 'Ella', 'Plum', '2023-10-27T13:28:22+03:00'],
    ['Marius', 2300, 'Chloe', 'Lime', '2023-10-27T14:55:41+03:00'],
    ['Gabriela', 2200, 'Benjamin', 'Apricot', '2023-10-27T15:21:52+03:00'],
    ['Valeria', 2400, 'Noah', 'Raspberry', '2023-10-27T16:43:47+03:00'],
    // Custom:
    [ADMIN_ACCOUNT, 0, 'AnaCard', 'Init', '2024-10-19T16:41:47+03:00'],
    [ADMIN_ACCOUNT, 0, 'Geta', 'Init', '2024-10-20T16:41:47+03:00'],
    ['God', 250, 'AnaCard', 'Lottery', '2024-10-21T16:41:47+03:00'],
    ['Geta', 100, 'Penny', 'Diverse', '2024-10-28T16:43:47+03:00'],
    ['Geta', 100, 'Ana', CREDIT_KEYWORD, '2024-10-29T16:43:47+03:00'],
    ['AnaCard', 150, 'Geta', CREDIT_KEYWORD, '2024-11-01T16:43:47+02:00'],
    ['AnaCard', 10, 'Ava', 'Test', '2024-12-20T16:41:47+03:00'],
    ['Ana', 20, 'Ella', 'Credit', '2024-12-21T16:41:47+03:00'],
];

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
const SPREADSHEET1_MOCK = {
    properties: {
        title: 'FooSpreadsheet1',
    },
    sheets: [
        {
            properties: {
                sheetId: 0,
            },
            data: [
                {
                    rowData: DATA.map((row) => ({
                        values: [
                            {
                                formattedValue: row[0].toString(),
                            },
                            {
                                formattedValue: row[1].toString(),
                            },
                            {
                                formattedValue: row[2].toString(),
                            },
                            {
                                formattedValue: row[3].toString(),
                            },
                            {
                                formattedValue: row[4].toString(),
                            },
                        ],
                    })),
                },
            ],
        },
    ],
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default SPREADSHEET1_MOCK;
