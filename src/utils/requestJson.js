import fetchWithLoading from './fetchWithLoading.js';
import validateJson from './validateJson.js';

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 *
 */
const requestJson = async (url, options = {}) => {
    if (options.verbose) {
        const {description, method, body} = options;
        const resolvedMethod = method || (body ? 'POST' : 'GET');
        const verboseUrl = resolvedMethod + ' ' + prettifyUrl(url);
        const groupName = description ? `${description} (${verboseUrl})` : verboseUrl;
        console.groupCollapsed(groupName);
        console.log(options);
    }

    let json;
    if (options.mock && (window.USE_MOCK || options.forceMock)) {
        if (typeof options.mock === 'function') {
            json = options.mock(url, options);
        } else {
            json = options.mock;
        }
    }

    if (!json) {
        const fetchOptions = {...options};
        delete fetchOptions.schema;
        delete fetchOptions.mock;
        delete fetchOptions.forceMock;
        delete fetchOptions.verbose;
        delete fetchOptions.description;
        json = await getJson(url, fetchOptions, options.verbose);
    }

    if (json) {
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

    if (options.verbose) {
        console.log(JSON.stringify(json, null, 4));
        console.groupEnd();
    }
    return json;
};

// =====================================================================================================================
//  P R I V A T E
// =====================================================================================================================
/**
 *
 */
const getJson = async (url, fetchOptions) => {
    if (fetchOptions.searchParams) {
        url += '?' + new URLSearchParams(fetchOptions.searchParams).toString();
        delete fetchOptions.searchParams;
    }

    if (fetchOptions.body) {
        fetchOptions.method = fetchOptions.method || 'POST';
        const {body} = fetchOptions;
        fetchOptions.body = typeof body === 'object' ? JSON.stringify(body) : body;
        fetchOptions.headers = fetchOptions.headers || {};
        fetchOptions.headers['Content-Type'] = fetchOptions.headers['Content-Type'] || 'application/json';
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
    }
    return json;
};

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
    return mainDomain + '/…/' + last;
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default requestJson;
