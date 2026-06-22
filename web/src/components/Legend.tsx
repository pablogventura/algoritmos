import { useTranslation } from 'react-i18next';
import { HIGHLIGHT_COLORS } from '../visualizers/shared/colors';

const LEGEND_KEYS = ['compare', 'active', 'sorted', 'found', 'pivot', 'visited', 'frontier', 'path', 'mst'];

export function Legend() {
  const { t } = useTranslation(['legend', 'common']);

  return (
    <aside className="rounded-xl border border-slate-700/60 bg-slate-900/50 p-3">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {t('legend', { ns: 'common' })}
      </h3>
      <ul className="space-y-1.5">
        {LEGEND_KEYS.map((key) => (
          <li key={key} className="flex items-center gap-2 text-xs text-slate-300">
            <span
              className="h-3 w-3 shrink-0 rounded-sm"
              style={{ backgroundColor: HIGHLIGHT_COLORS[key] }}
            />
            {t(key)}
          </li>
        ))}
      </ul>
    </aside>
  );
}
