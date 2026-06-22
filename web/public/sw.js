// One-shot service worker: clears Workbox caches and unregisters itself.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: 'window' });
      for (const client of clients) {
        client.postMessage({ type: 'SW_RELOAD' });
        try {
          await client.navigate(client.url);
        } catch {
          // navigate() may fail; postMessage + inline listener reloads the page.
        }
      }
    })(),
  );
});
