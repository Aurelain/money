// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
const NewSpreadsheetSchema = {
    $id: 'NewSpreadsheetSchema',
    type: 'object',
    properties: {
        spreadsheetId: {
            type: 'string',
            minLength: 1,
        },
    },
    required: ['spreadsheetId'],
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default NewSpreadsheetSchema;

/*
{
    "spreadsheetId": "1xgRcF203ltewvo3u-klzAhoX7Izg2jjA8wgzoLv51LQ",
    "properties": {
        "title": "Untitled spreadsheet",
        "locale": "en_US",
        "autoRecalc": "ON_CHANGE",
        "timeZone": "Etc/GMT",
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
                ...
            ]
        }
    },
    "sheets": [
        {
            "properties": {
                "sheetId": 0,
                "title": "Sheet1",
                "index": 0,
                "sheetType": "GRID",
                "gridProperties": {
                    "rowCount": 1000,
                    "columnCount": 26
                }
            }
        }
    ],
    "spreadsheetUrl": "https://docs.google.com/spreadsheets/d/1xgRcF203ltewvo3u-klzAhoX7Izg2jjA8wgzoLv51LQ/edit"
} */
