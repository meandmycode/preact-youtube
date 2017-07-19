/* globals serviceWorkerOption */
const fetchAndCache = (cache, request) => fetch(request).then(response => {

    if (response.ok !== true) throw new Error(response.statusText);

    cache.put(request, response.clone());

    return response;

});

self.addEventListener('install', event => {

    const installation = caches.open('app')
        .then(cache => cache.addAll(serviceWorkerOption.assets));

    event.waitUntil(installation);

});

self.addEventListener('fetch', event => {

    const url = new URL(event.request.url);

    if (url.hostname !== location.hostname) return;

    const response = caches.match(event.request)
        .then(response => response || caches.match('/spa.html'));

    event.respondWith(response);

});

self.addEventListener('fetch', event => {

    const url = new URL(event.request.url);

    if (url.hostname !== 'www.googleapis.com') return;

    const response = caches.open(url.hostname).then(cache => {

        return cache.match(event.request).then(cacheResponse => {

            return cacheResponse || fetchAndCache(cache, event.request);

        });

    });

    event.respondWith(response);

});
