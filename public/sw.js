const CACHE = 'awaken-drills-v5.4.5';
const CORE = [
  '/',
  '/index.html',
  '/css/app.css',
  '/js/engine.mjs',
  '/js/app.mjs',
  '/manifest.webmanifest',
  '/assets/icon-192.png',
  '/assets/icon-512.png',
  '/assets/apple-touch-icon.png',
  '/assets/logo.png',
  '/assets/logo-awaken.png',
  '/assets/favicon-32.png',
  '/assets/favicon.ico'
];

const ORIGINAL_REMOTE_ASSETS = [
  'https://www.myinstants.com/media/sounds/boxing-bell.mp3',
  'https://www.myinstants.com/media/sounds/im-gonna-smash-your-boy.mp3',
  'https://www.myinstants.com/media/sounds/faaah.mp3',
  'https://www.myinstants.com/media/sounds/dry-fart_3.mp3'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(CORE);
    await Promise.allSettled(ORIGINAL_REMOTE_ASSETS.map(async url => {
      const response = await fetch(url, { mode: 'no-cors', cache: 'no-cache' });
      await cache.put(url, response);
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith((async () => {
    const cached = await caches.match(event.request);
    if (cached) return cached;
    try {
      const response = await fetch(event.request);
      if (response.ok || response.type === 'opaque') {
        const cache = await caches.open(CACHE);
        cache.put(event.request, response.clone()).catch(() => {});
      }
      return response;
    } catch {
      return cached || Response.error();
    }
  })());
});
