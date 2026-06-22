const SW_CLEANUP_KEY = 'algoviz-sw-cleanup-v3';

export async function clearLegacyServiceWorker(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      if (registrations.length > 0) {
        await Promise.all(registrations.map((registration) => registration.unregister()));
      }
    }
    if ('caches' in window) {
      const keys = await caches.keys();
      if (keys.length > 0) {
        await Promise.all(keys.map((key) => caches.delete(key)));
      }
    }
    localStorage.setItem(SW_CLEANUP_KEY, 'done');
  } catch {
    // Best-effort cleanup only.
  }
}

export function clearLegacyServiceWorkerWithTimeout(timeoutMs = 1500): Promise<void> {
  return Promise.race([
    clearLegacyServiceWorker(),
    new Promise<void>((resolve) => {
      setTimeout(resolve, timeoutMs);
    }),
  ]);
}
