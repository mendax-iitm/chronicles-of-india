"use strict";

const CACHE_NAME = "chronicles-of-india-v10";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./assets/icon.svg",
  "./css/atlas.css",
  "./js/projection.js",
  "./js/i18n.js",
  "./js/render.js",
  "./js/timeline.js",
  "./js/panel.js",
  "./js/share.js",
  "./js/api.js",
  "./js/exam.js",
  "./js/atlas.js",
  "./data/base.js",
  "./data/regions.js",
  "./data/snapshots.js",
  "./data/places.js",
  "./data/events.js",
  "./data/journeys.js",
  "./data/rulers.js",
  "./data/divisions.js",
  "./data/corridors.js",
  "./data/modern.js",
  "./data/terrain/manifest.js"
];

const TERRAIN_TILES = [
  "./data/terrain/r0c0.jpg", "./data/terrain/r0c1.jpg", "./data/terrain/r0c2.jpg", "./data/terrain/r0c3.jpg",
  "./data/terrain/r1c0.jpg", "./data/terrain/r1c1.jpg", "./data/terrain/r1c2.jpg", "./data/terrain/r1c3.jpg",
  "./data/terrain/r2c0.jpg", "./data/terrain/r2c1.jpg", "./data/terrain/r2c2.jpg", "./data/terrain/r2c3.jpg",
  "./data/terrain/r3c0.jpg", "./data/terrain/r3c1.jpg", "./data/terrain/r3c2.jpg", "./data/terrain/r3c3.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.addAll(CORE_ASSETS);
      // Cache terrain tiles in background without blocking core install if offline
      await Promise.allSettled(TERRAIN_TILES.map((url) => cache.add(url)));
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((res) => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return res;
      }).catch(() => caches.match("./index.html"));
    })
  );
});
