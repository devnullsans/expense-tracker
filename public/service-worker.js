'use strict';

// Update cache names any time any of the cached files change.
// const CACHE_NAME = 'api-cache';
const CACHE_NAME = 'cache-v0';

// Add list of files to cache here.
const FILES_TO_CACHE = [
  '/',
  '/global.css',
  '/build/bundle.css',
  '/build/bundle.js',
  '/favicon.png',
  '/manifest.json'
];

self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] Install');

  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline pages');
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  console.log('[ServiceWorker] Activate');
  // Remove previous cached data from disk.
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );

  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  console.log('[ServiceWorker] Fetch', evt.request);

  const { pathname } = new URL(evt.request.url);

  if (pathname === '/api') {
    evt.respondWith(fetchFirst(evt.request));
  } else {
    evt.respondWith(cacheFirst(evt.request));
  }
});

async function fetchFirst(req) {
  try {
    const res = await fetch(req);
    if (!res.ok) {
      throw new Error(`Error: ${res.status} ${res.statusText} ${res.url}`);
    }
    const cache = await caches.open(CACHE_NAME);
    await cache.put(req.url, res.clone());
    return res;
  } catch (err) {
    console.info('fetchFirst', err);
    const off = await caches.match(req);
    if (off == null) {
      const res = new Response(null, { status: 404 });
      return res;
    }
    return off;
  }
}

async function cacheFirst(req) {
  try {
    const off = await caches.match(req);
    if (off == null) {
      return await fetchFirst(req);
    }
    return off;
  } catch (err) {
    console.info('cacheFirst', err);
    const off = await caches.match(req);
    if (off == null) {
      const res = new Response(null, { status: 404 });
      return res;
    }
    return off;
  }
}
