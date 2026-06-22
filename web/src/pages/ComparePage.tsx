import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ComparePlayground } from '../components/ComparePlayground';
import { COMPARE_PRESETS } from '../engine/compareStores';

export function ComparePage() {
  const { t } = useTranslation('common');

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <nav className="mb-4 text-sm text-slate-500">
        <Link to="/" className="text-sky-400 hover:underline">
          {t('nav.home')}
        </Link>
        <span> / </span>
        <span className="text-slate-300">{t('compareTitle')}</span>
      </nav>
      <h1 className="mb-2 text-2xl font-bold text-slate-50">{t('compareTitle')}</h1>
      <p className="mb-4 text-sm text-slate-400">{t('compareSubtitle')}</p>

      <div className="mb-6 flex flex-wrap gap-2">
        {COMPARE_PRESETS.map(({ left, right }) => (
          <Link
            key={`${left}-${right}`}
            to={`/compare?left=${left}&right=${right}`}
            className="rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-1.5 text-xs text-slate-300 hover:border-sky-700"
          >
            {left} vs {right}
          </Link>
        ))}
      </div>

      <ComparePlayground />
    </div>
  );
}
