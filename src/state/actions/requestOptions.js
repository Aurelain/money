import requestApi from '../../system/requestApi.js';
import checkOffline from '../../system/checkOffline.js';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const requestOptions = async () => {
    if (checkOffline()) {
        return;
    }
    return;
    const result = await requestOptionsEndpoint();
    console.log('result:', result);
};

// =====================================================================================================================
//  P R I V A T E
// =====================================================================================================================
/**
 *
 */
const requestOptionsEndpoint = async () => {
    return await requestApi('https://www.googleapis.com/drive/v3/files', {
        searchParams: {
            spaces: 'appDataFolder',
        },
    });
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default requestOptions;
