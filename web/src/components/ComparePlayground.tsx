import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CATALOG } from '../catalog';
import { getCatalogEntry } from '../catalog';
import type { AlgorithmDemo, DemoInput } from '../types/demo';
import { getDemoAsync } from '../lib/demoLoader';
import { buildCompareShareUrl } from '../lib/shareUrl';
import { parseArrayParam } from '../lib/urls';
import { useCompareLeftStore, useCompareRightStore } from '../engine/compareStores';
import { usePlaybackKeyboard } from '../hooks/usePlaybackKeyboard';
import { useComposedScene, useCurrentStep } from '../hooks/useComposedScene';
import { PlaybackControls } from './PlaybackControls';
import { SceneRenderer } from '../visualizers/SceneRenderer';
import { Legend } from './Legend';

function mergeInput(
  demo: AlgorithmDemo<DemoInput, unknown> | undefined,
  dataParam: string | null,
): DemoInput | null {
  if (!demo) return null;
  const base = { ...(demo.defaultInput as DemoInput) };
  if (dataParam && 'values' in base) {
    base.values = parseArrayParam(dataParam, (base.values as number[]) ?? []);
  }
  return base;
}

function ComparePane({
  side,
  algoId,
  demo,
  input,
  useStore,
}: {
  side: 'left' | 'right';
  algoId: string;
  demo: AlgorithmDemo<DemoInput, unknown>;
  input: DemoInput;
  useStore: typeof useCompareLeftStore;
}) {
  const { t } = useTranslation(['common', 'steps']);
  const entry = getCatalogEntry(algoId);
  const load = useStore((s) => s.load);
  const scene = useComposedScene(useStore);
  const currentStep = useCurrentStep(useStore);

  useEffect(() => {
    const initial = demo.buildInitialScene(input);
    const steps = demo.generateSteps(input);
    load(initial, steps);
  }, [demo, input, load]);

  if (!entry) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-200">
          {t(side === 'left' ? 'compareLeft' : 'compareRight')}: {entry.name}
        </h3>
      </div>
      <PlaybackControls useStore={useStore} />
      <div className="relative min-h-[280px] overflow-hidden rounded-xl border border-slate-700/60 bg-slate-950">
        <SceneRenderer scene={scene} visualFamily={entry.visualFamily} />
      </div>
      {currentStep && (
        <p className="min-h-[2.5rem] text-sm text-slate-300">
          {t(currentStep.captionKey, {
            ns: 'steps',
            ...(currentStep.captionParams ?? {}),
            defaultValue: currentStep.captionKey,
          })}
        </p>
      )}
    </div>
  );
}

export function ComparePlayground() {
  const { t } = useTranslation(['common', 'areas']);
  const [searchParams, setSearchParams] = useSearchParams();
  const [leftDemo, setLeftDemo] = useState<AlgorithmDemo<DemoInput, unknown> | null>(null);
  const [rightDemo, setRightDemo] = useState<AlgorithmDemo<DemoInput, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncPlayback, setSyncPlayback] = useState(true);
  const [copied, setCopied] = useState(false);
  const syncRef = useRef(false);

  const leftId = searchParams.get('left') ?? 'quicksort';
  const rightId = searchParams.get('right') ?? 'mergesort';
  const dataParam = searchParams.get('data');

  const catalogOptions = useMemo(
    () => CATALOG.filter((e) => e.status === 'ready').sort((a, b) => a.name.localeCompare(b.name)),
    [],
  );

  const sharedInput = useMemo(() => {
    const demo = leftDemo ?? rightDemo;
    return mergeInput(demo ?? undefined, dataParam);
  }, [dataParam, leftDemo, rightDemo]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([getDemoAsync(leftId), getDemoAsync(rightId)]).then(([left, right]) => {
      if (cancelled) return;
      setLeftDemo((left as AlgorithmDemo<DemoInput, unknown>) ?? null);
      setRightDemo((right as AlgorithmDemo<DemoInput, unknown>) ?? null);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [leftId, rightId]);

  usePlaybackKeyboard(useCompareLeftStore, !loading);
  usePlaybackKeyboard(useCompareRightStore, false);

  useEffect(() => {
    if (!syncPlayback) return;

    const leftUnsub = useCompareLeftStore.subscribe((state, prev) => {
      if (syncRef.current) return;
      if (state.currentIndex === prev.currentIndex && state.isPlaying === prev.isPlaying) return;

      syncRef.current = true;
      const right = useCompareRightStore.getState();
      if (state.isPlaying && !right.isPlaying) right.play();
      if (!state.isPlaying && right.isPlaying) right.pause();
      right.goTo(Math.min(state.currentIndex, right.steps.length - 1));
      syncRef.current = false;
    });

    return leftUnsub;
  }, [syncPlayback]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  const applyData = (raw: string) => {
    const next = new URLSearchParams(searchParams);
    if (raw.trim()) next.set('data', raw.trim());
    else next.delete('data');
    setSearchParams(next, { replace: true });
  };

  const copyLink = async () => {
    if (!sharedInput) return;
    await navigator.clipboard.writeText(buildCompareShareUrl(leftId, rightId, sharedInput));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <p className="text-slate-400">{t('loadingDemo')}</p>;
  }

  if (!leftDemo || !rightDemo || !sharedInput) {
    return <p className="text-red-400">{t('compareUnavailable')}</p>;
  }

  const defaultValues =
    'values' in sharedInput && Array.isArray(sharedInput.values)
      ? (sharedInput.values as number[]).join(',')
      : '';

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400">{t('compareHint')}</p>

      <div className="flex flex-wrap gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <label className="flex flex-col gap-1 text-xs text-slate-400">
          {t('compareLeft')}
          <select
            value={leftId}
            onChange={(e) => updateParam('left', e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm text-slate-100"
          >
            {catalogOptions.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-slate-400">
          {t('compareRight')}
          <select
            value={rightId}
            onChange={(e) => updateParam('right', e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm text-slate-100"
          >
            {catalogOptions.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </label>
        {'values' in sharedInput && (
          <label className="flex min-w-[200px] flex-1 flex-col gap-1 text-xs text-slate-400">
            {t('valuesLabel')}
            <input
              type="text"
              defaultValue={defaultValues}
              onBlur={(e) => applyData(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm text-slate-100"
            />
          </label>
        )}
        <label className="flex items-end gap-2 pb-1 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={syncPlayback}
            onChange={(e) => setSyncPlayback(e.target.checked)}
            className="rounded border-slate-600"
          />
          {t('compareSync')}
        </label>
        <button
          type="button"
          onClick={copyLink}
          className="self-end rounded-lg bg-slate-700 px-3 py-1.5 text-sm hover:bg-slate-600"
        >
          {copied ? t('copied') : t('shareLink')}
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ComparePane
          side="left"
          algoId={leftId}
          demo={leftDemo}
          input={sharedInput}
          useStore={useCompareLeftStore}
        />
        <ComparePane
          side="right"
          algoId={rightId}
          demo={rightDemo}
          input={sharedInput}
          useStore={useCompareRightStore}
        />
      </div>
      <Legend />
    </div>
  );
}
