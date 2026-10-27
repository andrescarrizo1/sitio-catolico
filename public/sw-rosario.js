// Service Worker para el Santo Rosario Interactivo (Scope: /rosario/)
const CACHE_NAME = 'rosario-v1.0.2';

const ASSETS_TO_CACHE = [
  '/rosario/',
  '/rosario/como-rezar/',
  '/rosario/misterios-de-hoy/',
  '/favicon.svg',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia Network-First con fallback a caché:
// Intenta primero red para asegurar que siempre se reciban los hashes de CSS más recientes.
// Solo si no hay internet (offline), responde con el caché local.
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // En localhost o si no es navegación bajo /rosario/, no interceptar
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
    return;
  }

  if (url.origin === self.location.origin && url.pathname.startsWith('/rosario')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  }
});
