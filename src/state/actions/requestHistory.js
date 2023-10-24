import requestApi from '../../system/requestApi.js';
import checkOffline from '../../system/checkOffline.js';
import {selectSpreadsheets} from '../selectors.js';
import {getState, setState} from '../store.js';
import SpreadsheetSchema from '../../schemas/SpreadsheetSchema.js';
import assume from '../../utils/assume.js';
import FileModifiedTimeSchema from '../../schemas/FileModifiedTimeSchema.js';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const requestHistory = async () => {
    if (checkOffline()) {
        return;
    }

    const state = getState();
    const spreadsheets = selectSpreadsheets(state);
    const modifiedTimes = {};

    let hasChanged = false;
    for (const spreadsheet of spreadsheets) {
        const {id, modified} = spreadsheet;
        const freshModified = await getFileModifiedTime(id);
        modifiedTimes[id] = freshModified;
        if (modified === freshModified) {
            console.log(`Nothing changed in ${id}!`);
            continue;
        } else {
            hasChanged = true;
        }

        const result = await getSpreadsheetData(id);
        console.log('result:', result);
    }

    if (!hasChanged) {
        return;
    }

    setState((state) => {
        const spreadsheets = selectSpreadsheets(state);
        for (const spreadsheet of spreadsheets) {
            spreadsheet.modified = modifiedTimes[spreadsheet.id];
        }
    });
};

// =====================================================================================================================
//  P R I V A T E
// =====================================================================================================================
/**
 *
 */
const getSpreadsheetData = async (spreadsheetId) => {
    const result = await requestApi(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
        searchParams: {
            includeGridData: true,
        },
        schema: SpreadsheetSchema,
    });
    const {sheets, properties} = result;
    const {title: spreadsheetTitle} = properties;
    for (const sheet of sheets) {
        console.log('sheet:', sheet);
        const {properties, data} = sheet;
        const {title} = properties;
        const longTitle = spreadsheetTitle + '.' + title;
        const {rowData} = data[0];
        assume(rowData, `Empty sheet found in ${longTitle}!`);
        const {length} = rowData;
        for (let i = 0; i < length; i++) {
            const row = rowData[i];
            const {values} = row;
            assume(values, `Empty row found in ${longTitle}!`);
            const {length: columnCount} = values;
            assume(columnCount === 4, `Unexpected column count ${columnCount} in ${longTitle}!`);
            if (i >= 1) {
                for (let j = 0; j < columnCount; j++) {
                    const {formattedValue} = values[j];
                    assume(formattedValue, `Falsy value in ${longTitle}!`);
                    let value;
                    switch (j) {
                        case 0: {
                            break;
                        }
                    }
                    if (j === 0) {
                        value = Number(formattedValue);
                        assume(value, `Falsy number in ${longTitle}!`);
                    } else {
                        value = formattedValue;
                    }
                    if (j === 3) {
                        // TODO
                        // assume(value.match());
                    }
                }
            }
        }
    }
    return result;
};

/**
 *
 */
const getFileModifiedTime = async (fileId) => {
    const result = await requestApi(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
        searchParams: {
            fields: 'modifiedTime',
        },
        schema: FileModifiedTimeSchema,
    });
    return result.modifiedTime;
};
// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default requestHistory;
