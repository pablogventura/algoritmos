import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AlgorithmDemo, CatalogEntry, DemoInput } from '../types/demo';
import { parseArrayParam } from '../lib/urls';

interface DemoInputPanelProps {
  entry: CatalogEntry;
  demo: AlgorithmDemo<DemoInput, unknown>;
  onApply: (input: DemoInput) => void;
}

export function DemoInputPanel({ entry, demo, onApply }: DemoInputPanelProps) {
  const { t } = useTranslation('common');
  const defaultValues = (demo.defaultInput as { values?: number[] }).values ?? [];
  const [valuesText, setValuesText] = useState(defaultValues.join(', '));
  const [targetText, setTargetText] = useState(String((demo.defaultInput as { target?: number }).target ?? ''));

  if (entry.visualFamily !== 'array-bars') return null;

  const apply = () => {
    const values = parseArrayParam(valuesText.replace(/\s+/g, ''), defaultValues);
    const input: DemoInput = { values };
    const target = Number(targetText);
    if (!Number.isNaN(target) && targetText.trim()) input.target = target;
    onApply(input);
  };

  const hasTarget = 'target' in demo.defaultInput;

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-3">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">{t('inputPanel')}</p>
      <label className="block text-xs text-slate-400">
        {t('valuesLabel')}
        <input
          type="text"
          value={valuesText}
          onChange={(e) => setValuesText(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 font-mono text-sm text-slate-100"
        />
      </label>
      {hasTarget && (
        <label className="mt-2 block text-xs text-slate-400">
          {t('targetLabel')}
          <input
            type="number"
            value={targetText}
            onChange={(e) => setTargetText(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm text-slate-100"
          />
        </label>
      )}
      <button
        type="button"
        onClick={apply}
        className="mt-3 rounded-lg bg-sky-600 px-3 py-1.5 text-sm font-medium hover:bg-sky-500"
      >
        {t('applyInput')}
      </button>
    </div>
  );
}
