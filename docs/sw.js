(() => {
  // sw/utils/announceClients.js
  var announceClients = (message) => {
    self.clients.matchAll().then(function(clients) {
      if (clients) {
        for (const client of clients) {
          client.postMessage(message);
        }
      }
    });
  };
  var announceClients_default = announceClients;

  // sw/utils/interceptSwErrors.js
  var interceptSwErrors = () => {
    self.addEventListener("error", onError, true);
    self.addEventListener("unhandledrejection", onUnhandledRejection, true);
  };
  var onError = (event) => {
    panic(event.type, event);
  };
  var onUnhandledRejection = (event) => {
    panic(event.type, event.reason);
  };
  var panic = (type, { message, stack }) => {
    announceClients_default({ type: "PANIC", panic: { type, message, stack } });
  };
  interceptSwErrors();

  // sw/utils/setupSw.js
  var isUnregistered = false;
  var currentVersion;
  var currentOptions;
  var setupSw = async (version, options = {}) => {
    currentVersion = version;
    currentOptions = options;
    self.skipWaiting();
    self.addEventListener("install", onWorkerInstall);
    self.addEventListener("activate", onWorkerActivate);
    self.addEventListener("fetch", onWorkerFetch);
  };
  var getSwHome = () => {
    return self.location.href.replace(/\/[^/]*$/, "");
  };
  var onWorkerInstall = (event) => {
    self.skipWaiting();
    event.waitUntil(
      (async () => {
        const cache = await caches.open(currentVersion);
        const home = getSwHome();
        const absolutePaths = [];
        const { cachedPaths = [] } = currentOptions;
        for (const relativePath of cachedPaths) {
          absolutePaths.push(home + relativePath);
        }
        await cache.addAll(absolutePaths);
      })()
    );
  };
  var onWorkerActivate = (event) => {
    event.waitUntil(
      (async () => {
        const names = await caches.keys();
        await Promise.all(
          names.map((name) => {
            if (name !== currentVersion) {
              return caches.delete(name);
            }
          })
        );
        await self.clients.claim();
        announceClients_default({ type: "ACTIVATED", version: currentVersion });
      })()
    );
  };
  var onWorkerFetch = (event) => {
    if (isUnregistered) {
      return;
    }
    const { url, mode } = event.request;
    const { ignoredFetches = [] } = currentOptions;
    for (const key of ignoredFetches) {
      if (url.includes(key)) {
        return;
      }
    }
    let responsePromise;
    if (mode === "navigate") {
      responsePromise = respondToRoot();
    } else {
      responsePromise = respondToFile(url);
    }
    event.respondWith(responsePromise);
  };
  var respondToRoot = async () => {
    const home = getSwHome();
    const cachedResponse = await caches.match(home + "/");
    const freshResponse = await fetchUrl(home + "/index.html?" + Math.random());
    if (freshResponse) {
      if (cachedResponse) {
        const cachedText = await cachedResponse.clone().text();
        const freshText = await freshResponse.clone().text();
        if (cachedText !== freshText) {
          isUnregistered = true;
          await self.registration.unregister();
        }
      }
      return freshResponse;
    } else {
      return cachedResponse;
    }
  };
  var fetchUrl = async (url) => {
    try {
      return await fetch(url);
    } catch (e) {
    }
  };
  var respondToFile = async (url) => {
    const cachedResponse = await caches.match(url);
    return cachedResponse || new Response(null, { status: 404 });
  };
  var setupSw_default = setupSw;

  // sw/sw.js
  var CACHED_PATHS = ["/","/index.html","/js/main-QHmO3ebi.js","/js/main-QHmO3ebi.js.map","/manifest.json","/meta/192.png","/meta/512.png","/meta/apple-splash-1080-2340.png","/meta/dot.png","/meta/money-1024.png","/meta/money.png","/meta/money.svg"];
  var IGNORED_FETCHES = [
    "googleapis",
    // https://oauth2.googleapis.com/token
    "google",
    // https://accounts.google.com/gsi/client
    "dot.png"
    // ./meta/dot.png
  ];
  var run = async () => {
    const version = JSON.stringify(CACHED_PATHS);
    await setupSw_default(version, {
      cachedPaths: CACHED_PATHS,
      ignoredFetches: IGNORED_FETCHES
    });
  };
  run();
})();
//# sourceMappingURL=sw.js.map
