import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AREAS } from '../catalog/areas';
import { CATALOG, countByStatus } from '../catalog';
import { StatusBadge } from '../components/StatusBadge';
import { HomeHero } from '../components/HomeHero';

export function HomePage() {
  const { t } = useTranslation(['common', 'areas']);
  const [query, setQuery] = useState('');
  const ready = countByStatus('ready');
  const total = CATALOG.length;

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return CATALOG.filter(
      (e) => e.name.toLowerCase().includes(q) || e.id.includes(q),
    ).slice(0, 12);
  }, [query]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <section className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
          {t('siteName')}
        </h1>
        <p className="mt-2 text-slate-400">{t('tagline')}</p>
        <p className="mt-4 text-sm text-sky-400">{t('progress', { ready, total })}</p>
        <div className="mx-auto mt-6 max-w-2xl">
          <HomeHero />
        </div>
        <div className="mx-auto mt-6 max-w-md">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
          />
          {query && (
            <ul className="mt-2 rounded-xl border border-slate-700 bg-slate-900 text-left">
              {filtered.length === 0 ? (
                <li className="px-4 py-3 text-sm text-slate-500">{t('noResults')}</li>
              ) : (
                filtered.map((e) => (
                  <li key={e.id}>
                    <Link
                      to={`/algo/${e.id}`}
                      className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-slate-800"
                    >
                      <span>{e.name}</span>
                      <StatusBadge status={e.status} />
                    </Link>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {AREAS.map((area) => {
          const items = CATALOG.filter((e) => e.area === area.slug);
          const areaReady = items.filter((e) => e.status === 'ready').length;
          const pct = items.length ? Math.round((areaReady / items.length) * 100) : 0;
          return (
            <Link
              key={area.slug}
              to={`/area/${area.slug}`}
              className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-5 transition hover:border-sky-700/50 hover:bg-slate-900"
            >
              <h2 className="font-semibold text-slate-100 group-hover:text-sky-300">
                {t(area.slug, { ns: 'areas' })}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {t('areaProgress', { ready: areaReady, total: items.length })}
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-sky-500 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
