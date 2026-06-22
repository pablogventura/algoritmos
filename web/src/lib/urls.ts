const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function appUrl(path: string, params?: Record<string, string | number>): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const url = `${BASE}${normalized}`;
  if (!params || Object.keys(params).length === 0) return url;
  const search = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)]),
  );
  return `${url}?${search.toString()}`;
}

export function parseArrayParam(value: string | null, fallback: number[]): number[] {
  if (!value) return fallback;
  const parsed = value
    .split(',')
    .map((s) => Number(s.trim()))
    .filter((n) => !Number.isNaN(n));
  return parsed.length > 0 ? parsed : fallback;
}
