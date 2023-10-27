import requestApi from '../../system/requestApi.js';
import {getState} from '../store.js';
import {selectOptions} from '../selectors.js';
import condense from '../../utils/condense.js';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const saveOptions = async () => {
    return;
    const state = getState();
    const options = selectOptions(state);

    const response = await createOptions({foo: 'bar'});
    console.log('response:', response);

    /*
    const bodyText = JSON.stringify(options);
    console.log('bodyText:', bodyText);

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Content-Length', bodyText.length.toString());
    console.log('headers: ' + JSON.stringify(headers, null, 4));

    const response = await fetchWithLoading(
        'https://www.googleapis.com/upload/drive/v3/files?spaces=appDataFolder&uploadType=media',
        {
            method: 'POST',
            body: 'foo',
            headers,
        },
    );
    console.log('response:', response);

     */
};

// =====================================================================================================================
//  P R I V A T E
// =====================================================================================================================
/**
 *
 */
const createOptions = async (options) => {
    const {contentType, body} = composeMultipart(options);
    return await requestApi('https://www.googleapis.com/upload/drive/v3/files', {
        searchParams: {
            // spaces: 'appDataFolder',
            uploadType: 'multipart',
        },
        headers: {
            ['Content-Type']: contentType,
            ['Content-Length']: body.length,
        },
        body,
        // forceMock: true,
        // mock: {},
    });
};

/**
 * Note: To create it inside the hidden app storage, use `"parents": ["appDataFolder"]`
 */
const composeMultipart = (options) => {
    const boundary = Math.random().toString().substring(2);
    const body = `
--${boundary}
Content-Type: application/json

{
  "name": "options.txt",
  "mimeType": "text/plain"
}
--${boundary}
Content-Type: text/plain

${JSON.stringify(options)}
--${boundary}--
`.trim();

    return {
        contentType: `multipart/related; boundary=${boundary}`,
        body,
    };
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default saveOptions;
