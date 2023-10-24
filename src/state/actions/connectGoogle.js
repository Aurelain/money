import {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET} from '../../SETTINGS.js';
import embedScriptFile from '../../utils/embedScriptFile.js';
import assume from '../../utils/assume.js';
import {setState} from '../store.js';
import validateJson from '../../utils/validateJson.js';
import requestJson from '../../utils/requestJson.js';
import OauthCodeSchema from '../../schemas/OauthCodeSchema.js';
import OauthTokenSchema from '../../schemas/OauthTokenSchema.js';
import requestHistory from './requestHistory.js';

// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
let currentResolve;
const SCOPES = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/spreadsheets',
];

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const connectGoogle = async () => {
    await embedScriptFile('https://accounts.google.com/gsi/client');
    const initCodeClient = window.google?.accounts?.oauth2?.initCodeClient;
    assume(typeof initCodeClient === 'function', 'Invalid gis library!');

    return new Promise((resolve) => {
        currentResolve = resolve;

        // https://developers.google.com/identity/oauth2/web/guides/use-code-model
        const client = initCodeClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: SCOPES.join(' '),
            ux_mode: 'popup',
            access_type: 'offline',
            callback: onCodeReceived,
        });
        client.requestCode();
    });
};

// =====================================================================================================================
//  P R I V A T E
// =====================================================================================================================
/**
 *
 */
const onCodeReceived = async (codeClientResponse) => {
    validateJson(codeClientResponse, OauthCodeSchema);

    const tokensFromGoogle = await requestJson('https://oauth2.googleapis.com/token', {
        method: 'POST',
        body: {
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            code: codeClientResponse.code,
            grant_type: 'authorization_code',
            redirect_uri: window.location.origin,
        },
        schema: OauthTokenSchema,
    });

    console.log('tokensFromGoogle:', tokensFromGoogle);

    setState((state) => {
        state.tokens = {
            accessToken: tokensFromGoogle.access_token,
            refreshToken: tokensFromGoogle.refresh_token,
            expirationTimestamp: Date.now() + tokensFromGoogle.expires_in * 1000,
        };
        state.volatile.isAuthenticated = true;
    });

    await requestHistory();

    currentResolve();
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default connectGoogle;
