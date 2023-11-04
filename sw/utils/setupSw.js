import announceClients from './announceClients.js';

// =====================================================================================================================
//  D E C L A R A T I O N S
// =====================================================================================================================
let isUnregistered = false;
let currentVersion;
let currentOptions;

// =====================================================================================================================
//  P U B L I C
// =====================================================================================================================
/**
 * https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Tutorials/CycleTracker/Service_workers
 */
const setupSw = async (version, options = {}) => {
    currentVersion = version;
    currentOptions = options;

    self.skipWaiting(); // TODO find out if this is working
    self.addEventListener('install', onWorkerInstall);
    self.addEventListener('activate', onWorkerActivate);
    self.addEventListener('fetch', onWorkerFetch);
};

// =====================================================================================================================
//  P R I V A T E
// =====================================================================================================================
/**
 * Returns the current directory, without a trailing slash.
 */
const getSwHome = () => {
    return self.location.href.replace(/\/[^/]*$/, '');
};

/**
 *
 */
const onWorkerInstall = (event) => {
    // console.log('SW: Install of', currentVersion);
    self.skipWaiting(); // TODO find out if this is working
    event.waitUntil(
        (async () => {
            const cache = await caches.open(currentVersion);
            const home = getSwHome();
            const absolutePaths = [];
            const {cachedPaths = []} = currentOptions;
            for (const relativePath of cachedPaths) {
                absolutePaths.push(home + relativePath);
            }
            await cache.addAll(absolutePaths);
        })(),
    );
};

/**
 *
 */
const onWorkerActivate = (event) => {
    // console.log('SW: Activation of', currentVersion);
    event.waitUntil(
        (async () => {
            const names = await caches.keys();
            await Promise.all(
                names.map((name) => {
                    if (name !== currentVersion) {
                        return caches.delete(name);
                    }
                }),
            );
            await self.clients.claim();
            announceClients({type: 'ACTIVATED', version: currentVersion});
        })(),
    );
};

/**
 *
 */
const onWorkerFetch = (event) => {
    if (isUnregistered) {
        return;
    }

    // console.log('SW: Fetch', event.request.url);
    const {url, mode} = event.request;

    const {ignoredFetches = []} = currentOptions;
    for (const key of ignoredFetches) {
        if (url.includes(key)) {
            return;
        }
    }

    let responsePromise;
    if (mode === 'navigate') {
        responsePromise = respondToRoot();
    } else {
        responsePromise = respondToFile(url);
    }
    event.respondWith(responsePromise);
};

/**
 *
 */
const respondToRoot = async () => {
    const home = getSwHome(); // without trailing slash, e.g. https://foo.com/bar
    const cachedResponse = await caches.match(home + '/');
    const freshResponse = await fetchUrl(home + '/index.html?' + Math.random());
    if (freshResponse) {
        // console.log('We are online.');
        if (cachedResponse) {
            // console.log('We have cache.');
            const cachedText = await cachedResponse.clone().text();
            const freshText = await freshResponse.clone().text();
            if (cachedText !== freshText) {
                // console.log('Something changed!');
                isUnregistered = true;
                await self.registration.unregister();
            }
        }
        return freshResponse;
    } else {
        // console.log('We are offline!');
        return cachedResponse;
    }
};

/**
 *
 */
const fetchUrl = async (url) => {
    try {
        return await fetch(url);
    } catch (e) {
        // Nothing
    }
};

/**
 *
 */
const respondToFile = async (url) => {
    const cachedResponse = await caches.match(url);
    return cachedResponse || fetch(url);
};

// =====================================================================================================================
//  E X P O R T
// =====================================================================================================================
export default setupSw;
