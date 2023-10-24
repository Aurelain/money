import requestJson from '../utils/requestJson.js';
import {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET} from '../SETTINGS.js';
import {getState, setState} from '../state/store.js';
import {selectAccessToken, selectExpirationTimestamp, selectRefreshToken} from '../state/selectors.js';
import OauthRefreshSchema from '../schemas/OauthRefreshSchema.js';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 * A wrapper around `requestJson()` whose sole purpose is to embellish the request with authorization.
 */
const requestApi = async (url, options = {}) => {
    const accessToken = await getAccessToken();

    // Ensure url safety (e.g. `en.romanian#holiday@group.v.calendar.google.com`)
    url = url.replaceAll('#', '%23');

    const result = await requestJson(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return result;
};

// =====================================================================================================================
//  P R I V A T E
// =====================================================================================================================
/**
 *
 */
const getAccessToken = async () => {
    const state = getState();
    if (Date.now() < selectExpirationTimestamp(state)) {
        // Tokens are still valid
        return selectAccessToken(state);
    } else {
        // Tokens expired
        const refreshToken = selectRefreshToken(state);
        console.log('refreshToken:', refreshToken);
        return await refreshTokens(refreshToken);
    }
};

/**
 *
 */
const refreshTokens = async (refreshToken) => {
    // This is the same endpoint as the one for the initial login, but with different parameters and schema.
    const freshTokens = await requestJson('https://oauth2.googleapis.com/token', {
        body: {
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
        },
        schema: OauthRefreshSchema,
    });

    setState((state) => {
        state.tokens.accessToken = freshTokens.access_token;
        state.tokens.expirationTimestamp = Date.now() + freshTokens.expires_in * 1000;
    });

    return freshTokens.access_token;
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default requestApi;
