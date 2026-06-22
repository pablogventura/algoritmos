import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getCatalogByArea } from '../catalog';
import { AREA_BY_SLUG } from '../catalog/areas';
import { StatusBadge } from '../components/StatusBadge';

export function AreaPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation(['common', 'areas']);
  const area = slug ? AREA_BY_SLUG[slug] : undefined;
  const items = slug ? getCatalogByArea(slug) : [];

  if (!area) {
    return <p className="p-8 text-slate-400">Area not found</p>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link to="/" className="text-sm text-sky-400 hover:underline">
        ← {t('nav.home', { ns: 'common' })}
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-slate-50">
        {t(area.slug, { ns: 'areas' })}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        {t('areaProgress', {
          ready: items.filter((e) => e.status === 'ready').length,
          total: items.length,
        })}
      </p>
      <ul className="mt-6 divide-y divide-slate-800 rounded-xl border border-slate-800">
        {items.map((entry) => (
          <li key={entry.id}>
            <Link
              to={`/algo/${entry.id}`}
              className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-slate-900/80"
            >
              <div>
                <span className="font-medium text-slate-100">{entry.name}</span>
                <p className="text-xs text-slate-500">{entry.visualFamily}</p>
              </div>
              <StatusBadge status={entry.status} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
