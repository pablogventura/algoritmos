import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getCatalogEntry } from '../catalog';
import { AREA_BY_SLUG } from '../catalog/areas';
import { StatusBadge } from '../components/StatusBadge';
import { AlgorithmPageContent } from '../components/AlgorithmPlayground';

export function AlgorithmPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation(['common', 'areas']);
  const entry = id ? getCatalogEntry(id) : undefined;

  if (!entry) {
    return <p className="p-8 text-slate-400">Algorithm not found</p>;
  }

  const area = AREA_BY_SLUG[entry.area];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <Link to="/" className="text-sky-400 hover:underline">
          {t('nav.home', { ns: 'common' })}
        </Link>
        <span>/</span>
        {area && (
          <>
            <Link to={`/area/${area.slug}`} className="text-sky-400 hover:underline">
              {t(area.slug, { ns: 'areas' })}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-slate-300">{entry.name}</span>
      </nav>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-50">{entry.name}</h1>
        <StatusBadge status={entry.status} />
      </div>
      <AlgorithmPageContent entry={entry} />
    </div>
  );
}
