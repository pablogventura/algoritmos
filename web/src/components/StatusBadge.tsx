import { useTranslation } from 'react-i18next';
import type { DemoStatus } from '../types/demo';

const styles: Record<DemoStatus, string> = {
  ready: 'bg-emerald-900/60 text-emerald-300 border-emerald-700',
  draft: 'bg-amber-900/60 text-amber-300 border-amber-700',
  planned: 'bg-slate-800 text-slate-400 border-slate-600',
};

export function StatusBadge({ status }: { status: DemoStatus }) {
  const { t } = useTranslation();
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${styles[status]}`}>
      {t(`status.${status}`)}
    </span>
  );
}
