const CACHE_NAME = 'microtoolstack-cache-v1';
const urlsToCache = [
  '/',
  '/assets/css/style.css',
  '/assets/css/components.css',
  '/assets/js/app.js',
  '/assets/js/theme.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
