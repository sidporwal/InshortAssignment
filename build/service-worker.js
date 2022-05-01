/* eslint-disable no-restricted-globals */
const CACHE_NAME = "PWA_COVID_APP";

const urlsToCache = ["/api/covidData"];
let updateTIme = null;

// Install a service worker
self.addEventListener("install", (event) => {
  // Perform install steps
  console.log("[SW] install event!");
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("Opened cache");
      updateTIme = +new Date();
      return cache.addAll(urlsToCache);
    })
  );
});

// Update a service worker
self.addEventListener("activate", (event) => {
  console.log("[SW] activated!");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Cache and return requests
self.addEventListener("fetch", (event) => {
  if (event.request.url.indexOf("/api/covidData") > -1) {
    event.respondWith(
      caches.match(event.request.url).then((cachedResponse) => {
        const currentTime = +new Date();
        // Check if request has been cached for more than 2 mins
        if (cachedResponse && currentTime - updateTIme <= 120000) {
          return cachedResponse;
        }
        return fetch(event.request).then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            updateTIme = +new Date();
            cache.put(event.request.url, response.clone());
            return response;
          });
        });
      })
    );
  }
});
