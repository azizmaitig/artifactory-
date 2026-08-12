// Gallery root service worker — pwa-gallery ticket 09 prototype.
// Root-scoped per 04: the gallery index gets its own SW (scoped to /), separate
// from per-artifact SWs. Runs the 06 pattern: NEVER precache the navigation URL;
// navigation = network-first with cached copy fallback (offline index).
const CACHE = 'gallery-v1';
const FALLBACK = './index.html?v=1';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('gallery-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(FALLBACK, copy));
          return res;
        })
        .catch(() => caches.match(FALLBACK))
    );
    return;
  }
  e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request)));
});
