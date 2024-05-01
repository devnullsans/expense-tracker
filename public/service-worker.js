"use strict";

const CACHE_NAME = "cache-v0";

const FILES_TO_CACHE = ["/", "/favicon.ico", "/logo192.png", "/logo512.png", "/manifest.json"];

self.addEventListener("install", (evt) => {
  evt.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE)));

  self.skipWaiting();
});

self.addEventListener("activate", (evt) => {
  evt.waitUntil(
    caches
      .keys()
      .then((keyList) =>
        Promise.all(keyList.map((key) => (key !== CACHE_NAME ? caches.delete(key) : undefined)))
      )
  );

  self.clients.claim();
});

self.addEventListener("fetch", (evt) => {
  const { pathname } = new URL(evt.request.url);

  if (pathname !== "/api") evt.respondWith(cacheCheck(evt.request));
});

async function cacheCheck(req) {
  const off = await caches.match(req);

  if (off) return off;

  const res = await fetch(req);

  if (res.ok) {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(req, res.clone());
  }

  return res;
}
