const SW_CLEANUP_KEY = 'algoviz-sw-cleanup-v2';

export async function clearLegacyServiceWorker(): Promise<void> {
  if (typeof window === 'undefined' || localStorage.getItem(SW_CLEANUP_KEY) === 'done') {
    return;
  }

  try {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
    }
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    }
    localStorage.setItem(SW_CLEANUP_KEY, 'done');
  } catch {
    // Best-effort cleanup only.
  }
}
