import requestApi from '../../system/requestApi.js';
import checkOffline from '../../system/checkOffline.js';
import {selectVaults} from '../selectors.js';
import {getState, setState} from '../store.js';
import SpreadsheetSchema from '../../schemas/SpreadsheetSchema.js';
import assume from '../../utils/assume.js';
import {VAULT_DIR_NAME} from '../../SETTINGS.js';
import condense from '../../utils/condense.js';
import VaultsSchema from '../../schemas/VaultsSchema.js';

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
    const existingVaults = selectVaults(state);
    const freshVaults = await discoverVaults();

    let hasChanged = false;
    for (const id in freshVaults) {
        const existingModifiedTime = existingVaults[id];
        const freshModifiedTime = freshVaults[id];
        if (existingModifiedTime === freshModifiedTime) {
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
        state.vaults = freshVaults;
    });
};

// =====================================================================================================================
//  P R I V A T E
// =====================================================================================================================
/**
 *
 */
const discoverVaults = async () => {
    const result = await requestApi('https://www.googleapis.com/drive/v3/files', {
        searchParams: {
            q: condense(`
                name contains '${VAULT_DIR_NAME}' and
                mimeType = 'application/vnd.google-apps.spreadsheet' and
                'root' in parents
            `),
            fields: 'files(id,name,modifiedTime)',
        },
        schema: VaultsSchema,
        mock: mockVaults,
    });

    const vaults = {};
    for (const {id, name, modifiedTime} of result.files) {
        if (name.startsWith(VAULT_DIR_NAME)) {
            vaults[id] = modifiedTime;
        }
    }
    return vaults;
};

/**
 *
 */
const mockVaults = () => {
    return {
        files: [
            {
                id: '1zZE_PDRtZJoVNCjNQ6yu_J-lji3c1SoO0AszUmlASPE',
                name: 'Money_Foo',
                modifiedTime: '2023-10-24T15:08:57.627Z',
            },
        ],
    };
};

/**
 *
 */
const getSpreadsheetData = async (spreadsheetId) => {
    const result = await requestApi(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
        searchParams: {
            includeGridData: true,
        },
        schema: SpreadsheetSchema,
        mock: mockSpreadsheetData,
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
const mockSpreadsheetData = () => {
    return {
        properties: {
            title: 'FooSpreadsheet',
        },
        sheets: [
            {
                properties: {
                    title: 'FooSheet',
                },
                data: [
                    {
                        rowData: [
                            {
                                values: [
                                    {
                                        formattedValue: 'Value',
                                    },
                                    {
                                        formattedValue: 'To',
                                    },
                                    {
                                        formattedValue: 'Article',
                                    },
                                    {
                                        formattedValue: 'Date',
                                    },
                                ],
                            },
                            {
                                values: [
                                    {
                                        formattedValue: '2500',
                                    },
                                    {
                                        formattedValue: 'George',
                                    },
                                    {
                                        formattedValue: 'Banana',
                                    },
                                    {
                                        formattedValue: '2023-10-24T15:08:57.627Z',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    };
};
// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default requestHistory;
