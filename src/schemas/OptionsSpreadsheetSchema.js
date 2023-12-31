// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
const OptionsSpreadsheetSchema = {
    $id: 'OptionsSpreadsheetSchema',
    type: 'object',
    properties: {
        sheets: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    data: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                rowData: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            values: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        formattedValue: {
                                                            type: 'string',
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                required: ['data'],
            },
        },
    },
    required: ['sheets'],
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default OptionsSpreadsheetSchema;

/*
{
    "spreadsheetId": "1TfOxSoaprzG0SC69XqKn1xcoQYiSpZhjFpBcIlqGBDg",
    "properties": {
        "title": "FooSpreadsheet",
        "locale": "en_US",
        "autoRecalc": "ON_CHANGE",
        "timeZone": "Europe/Bucharest",
        "defaultFormat": {
            "backgroundColor": {
                "red": 1,
                "green": 1,
                "blue": 1
            },
            "padding": {
                "top": 2,
                "right": 3,
                "bottom": 2,
                "left": 3
            },
            "verticalAlignment": "BOTTOM",
            "wrapStrategy": "OVERFLOW_CELL",
            "textFormat": {
                "foregroundColor": {},
                "fontFamily": "arial,sans,sans-serif",
                "fontSize": 10,
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "foregroundColorStyle": {
                    "rgbColor": {}
                }
            },
            "backgroundColorStyle": {
                "rgbColor": {
                    "red": 1,
                    "green": 1,
                    "blue": 1
                }
            }
        },
        "spreadsheetTheme": {
            "primaryFontFamily": "Arial",
            "themeColors": [
                {
                    "colorType": "TEXT",
                    "color": {
                        "rgbColor": {}
                    }
                },
                {
                    "colorType": "BACKGROUND",
                    "color": {
                        "rgbColor": {
                            "red": 1,
                            "green": 1,
                            "blue": 1
                        }
                    }
                },
                {
                    "colorType": "ACCENT1",
                    "color": {
                        "rgbColor": {
                            "red": 0.25882354,
                            "green": 0.52156866,
                            "blue": 0.95686275
                        }
                    }
                },
                ...
                {
                    "colorType": "LINK",
                    "color": {
                        "rgbColor": {
                            "red": 0.06666667,
                            "green": 0.33333334,
                            "blue": 0.8
                        }
                    }
                }
            ]
        }
    },
    "sheets": [
        {
            "properties": {
                "sheetId": 0,
                "title": "FooSheet",
                "index": 0,
                "sheetType": "GRID",
                "gridProperties": {
                    "rowCount": 1000,
                    "columnCount": 26
                }
            },
            "data": [
                {
                    "rowData": [
                        {
                            "values": [
                                {
                                    "userEnteredValue": {
                                        "numberValue": 2500
                                    },
                                    "effectiveValue": {
                                        "numberValue": 2500
                                    },
                                    "formattedValue": "2500",
                                    "effectiveFormat": {
                                        "backgroundColor": {
                                            "red": 1,
                                            "green": 1,
                                            "blue": 1
                                        },
                                        "padding": {
                                            "top": 2,
                                            "right": 3,
                                            "bottom": 2,
                                            "left": 3
                                        },
                                        "horizontalAlignment": "RIGHT",
                                        "verticalAlignment": "BOTTOM",
                                        "wrapStrategy": "OVERFLOW_CELL",
                                        "textFormat": {
                                            "foregroundColor": {},
                                            "fontFamily": "Arial",
                                            "fontSize": 10,
                                            "bold": false,
                                            "italic": false,
                                            "strikethrough": false,
                                            "underline": false,
                                            "foregroundColorStyle": {
                                                "rgbColor": {}
                                            }
                                        },
                                        "hyperlinkDisplayType": "PLAIN_TEXT",
                                        "backgroundColorStyle": {
                                            "rgbColor": {
                                                "red": 1,
                                                "green": 1,
                                                "blue": 1
                                            }
                                        }
                                    }
                                },
                                {
                                    "userEnteredValue": {
                                        "stringValue": "God"
                                    },
                                    "effectiveValue": {
                                        "stringValue": "God"
                                    },
                                    "formattedValue": "God",
                                    "effectiveFormat": {
                                        "backgroundColor": {
                                            "red": 1,
                                            "green": 1,
                                            "blue": 1
                                        },
                                        "padding": {
                                            "top": 2,
                                            "right": 3,
                                            "bottom": 2,
                                            "left": 3
                                        },
                                        "horizontalAlignment": "LEFT",
                                        "verticalAlignment": "BOTTOM",
                                        "wrapStrategy": "OVERFLOW_CELL",
                                        "textFormat": {
                                            "foregroundColor": {},
                                            "fontFamily": "Arial",
                                            "fontSize": 10,
                                            "bold": false,
                                            "italic": false,
                                            "strikethrough": false,
                                            "underline": false,
                                            "foregroundColorStyle": {
                                                "rgbColor": {}
                                            }
                                        },
                                        "hyperlinkDisplayType": "PLAIN_TEXT",
                                        "backgroundColorStyle": {
                                            "rgbColor": {
                                                "red": 1,
                                                "green": 1,
                                                "blue": 1
                                            }
                                        }
                                    }
                                },
                                ...
                            ]
                        },
                        ...
                    ],
                    "rowMetadata": [
                        {
                            "pixelSize": 21
                        },
                        ...
                    ],
                    "columnMetadata": [
                        {
                            "pixelSize": 100
                        },
                        {
                            "pixelSize": 123
                        },
                        {
                            "pixelSize": 129
                        },
                        {
                            "pixelSize": 100
                        },
                        ...
                    ]
                }
            ]
        },
        ...
    ],
    "spreadsheetUrl": "https://docs.google.com/spreadsheets/d/1TfOxSoaprzG00C69XqKn1xcoQYiSpZhjFpBcIlqGBDg/edit"
}
 */
