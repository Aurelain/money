// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
const DATA = [
    ['Ava', '', '', '', ''],
    ['From', 'Amount', 'To', 'Summary', 'Date'],
    ['Gabriel', 1500, 'Ava', 'Blueberry', '2023-10-24T22:18:47+03:00'],
    ['AnaCard', 10, 'Ava', 'Test', '2023-10-27T17:41:53+03:00'],
];

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
const SPREADSHEET2_MOCK = {
    properties: {
        title: 'Money_Foo2',
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
export default SPREADSHEET2_MOCK;
