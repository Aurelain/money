import {VAULT_DIR_NAME} from '../../SETTINGS.js';
import requestApi from '../../system/requestApi.js';
import checkOffline from '../../system/checkOffline.js';
import FilesSchema from '../../schemas/FilesSchema.js';
import assume from '../../utils/assume.js';
import ShortcutSchema from '../../schemas/ShortcutSchema.js';
import {setState} from '../store.js';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const discoverVault = async () => {
    if (checkOffline()) {
        return;
    }

    const vaultId = await getVaultId();
    const spreadsheetIds = await getSpreadsheetIds(vaultId);

    setState((state) => {
        state.spreadsheets = spreadsheetIds.map((id) => ({
            id,
            modified: '', // will force an update of each spreadsheet's data
        }));
    });
};

// =====================================================================================================================
//  P R I V A T E
// =====================================================================================================================
/**
 *
 */
const getVaultId = async () => {
    const result = await requestApi('https://www.googleapis.com/drive/v3/files', {
        searchParams: {
            q: `name = '${VAULT_DIR_NAME}'`,
        },
        schema: FilesSchema,
    });

    const {files} = result;
    assume(files.length > 0, 'Cannot find vault!');
    assume(files.length < 2, 'Too many vaults!');
    return files[0].id;
};

/**
 *
 */
const getSpreadsheetIds = async (vaultId) => {
    const result = await requestApi('https://www.googleapis.com/drive/v3/files', {
        searchParams: {
            q: `parents in '${vaultId}' and trashed = false`,
        },
        schema: FilesSchema,
    });

    const ids = [];
    for (const file of result.files) {
        const {id, mimeType} = file;
        switch (mimeType) {
            case 'application/vnd.google-apps.spreadsheet': {
                ids.push(id);
                break;
            }
            case 'application/vnd.google-apps.shortcut': {
                const targetId = await resolveShortcut(id);
                ids.push(targetId);
                break;
            }
            default:
                throw new Error('Unexpected file type in vault!');
        }
    }

    assume(ids.length, 'No files in vault!');
    return ids;
};

/**
 *
 */
const resolveShortcut = async (shortcutId) => {
    const result = await requestApi(`https://www.googleapis.com/drive/v3/files/${shortcutId}`, {
        searchParams: {
            fields: 'shortcutDetails',
        },
        schema: ShortcutSchema,
    });
    const {targetId, targetMimeType} = result.shortcutDetails;
    assume(targetMimeType === 'application/vnd.google-apps.spreadsheet', 'Unexpected shortcut type!');
    return targetId;
};
// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default discoverVault;
