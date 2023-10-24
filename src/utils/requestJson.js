import fetchWithLoading from './fetchWithLoading.js';
import validateJson from './validateJson.js';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const requestJson = async (url, options = {}) => {
    const fetchOptions = {...options};
    delete fetchOptions.schema;

    if (fetchOptions.searchParams) {
        url += '?' + new URLSearchParams(fetchOptions.searchParams).toString();
        delete fetchOptions.searchParams;
    }

    if (fetchOptions.body) {
        fetchOptions.method = fetchOptions.method || 'POST';
        fetchOptions.body = JSON.stringify(fetchOptions.body);
        fetchOptions.headers = {...fetchOptions.headers};
        fetchOptions.headers['Content-Type'] = 'application/json';
    }

    if (fetchOptions.headers) {
        const headers = new Headers();
        for (const key in fetchOptions.headers) {
            headers.append(key, fetchOptions.headers[key]);
        }
        fetchOptions.headers = headers;
    }

    let response;
    try {
        response = await fetchWithLoading(url, fetchOptions);
    } catch (e) {
        throw new Error(`Failed to fetch ${prettifyUrl(url)}!`);
    }

    const text = await response.text();
    let json;
    if (text) {
        try {
            json = JSON.parse(text);
        } catch (e) {
            throw new Error(`Cannot parse json from ${prettifyUrl(url)}! ${e.message}`);
        }
        const {error} = json;
        if (error) {
            let message;
            if (typeof error === 'string') {
                message = error;
            } else if (error.message) {
                message = error.message;
            } else {
                message = JSON.stringify(error);
            }
            throw new Error(prettifyUrl(url) + ': ' + message);
        }
    }

    if (options.schema) {
        try {
            validateJson(json, options.schema);
        } catch (e) {
            throw new Error(`Unexpected reply from ${prettifyUrl(url)}: ${e.message}`);
        }
    }

    return json;
};

// =====================================================================================================================
//  P R I V A T E
// =====================================================================================================================
/**
 *
 */
const prettifyUrl = (url) => {
    url = url.replace(/^https?:\/\//, '');
    const urlParts = url.split('/');
    let last = urlParts.pop();
    last = last.replace(/[?#].*/, '');
    const first = urlParts.shift();
    const domainParts = first.split('.');
    const mainDomain = domainParts.at(-2) || first;
    return last + '@' + mainDomain;
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default requestJson;
