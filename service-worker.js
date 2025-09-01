const CACHE_NAME = 'in-transit-cache-v1';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/scripts/scripts.js',
  '/styles/styles.css',
  '/assets/cities.yaml',
  'https://cdn.jsdelivr.net/npm/js-yaml/+esm'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }
      return fetch(event.request).then(fetchResponse => {
        const clone = fetchResponse.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return fetchResponse;
      }).catch(() => caches.match('/index.html'));
    })
  );
});
