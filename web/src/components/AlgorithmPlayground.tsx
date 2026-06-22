import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getDemo } from '../algorithms/registry';
import type { CatalogEntry } from '../types/demo';
import { runTestCases } from '../engine/TestRunner';
import { usePlaybackStore } from '../engine/playbackStore';
import { PlaybackControls } from './PlaybackControls';
import { StepCaptionPanel } from './StepCaptionPanel';
import { ProgressStrip } from './ProgressStrip';
import { Legend } from './Legend';
import { SceneRenderer } from '../visualizers/SceneRenderer';
import { appUrl } from '../lib/urls';

interface AlgorithmPlaygroundProps {
  entry: CatalogEntry;
}

export function AlgorithmPlayground({ entry }: AlgorithmPlaygroundProps) {
  const { t } = useTranslation(['common', 'algorithms']);
  const demo = getDemo(entry.id);
  const load = usePlaybackStore((s) => s.load);
  const scene = usePlaybackStore((s) => s.getScene());
  const [testResults, setTestResults] = useState<ReturnType<typeof runTestCases> | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!demo) return;
    const initial = demo.buildInitialScene(demo.defaultInput);
    const steps = demo.generateSteps(demo.defaultInput);
    load(initial, steps);
  }, [demo, load]);

  const problemText = useMemo(() => {
    return t(`${entry.id}.problem`, { ns: 'algorithms', defaultValue: '' });
  }, [entry.id, t]);

  if (!demo) return null;

  const runTests = () => setTestResults(runTestCases(demo));
  const passed = testResults?.filter((r) => r.passed).length ?? 0;

  const copyLink = async () => {
    await navigator.clipboard.writeText(appUrl(`/algo/${entry.id}`));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <PlaybackControls />
      <div className="grid gap-3 lg:grid-cols-[1fr_200px]">
        <div className="relative min-h-[340px] overflow-hidden rounded-xl border border-slate-700/60 bg-slate-950">
          <SceneRenderer scene={scene} visualFamily={entry.visualFamily} />
        </div>
        <Legend />
      </div>
      <StepCaptionPanel />
      <ProgressStrip />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={runTests}
          className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm hover:bg-slate-600"
        >
          {t('runTests')}
        </button>
        <button
          type="button"
          onClick={copyLink}
          className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm hover:bg-slate-600"
        >
          {copied ? t('copied') : t('shareLink')}
        </button>
        {testResults && (
          <span className={`text-sm ${passed === testResults.length ? 'text-emerald-400' : 'text-red-400'}`}>
            {t('testsPassed', { passed, total: testResults.length })}
          </span>
        )}
      </div>
      <details className="rounded-xl border border-slate-700/40 bg-slate-900/30 px-4 py-2">
        <summary className="cursor-pointer text-sm text-slate-400">{t('complexity')}</summary>
        <dl className="mt-2 grid grid-cols-2 gap-2 text-sm">
          <dt className="text-slate-500">{t('time')}</dt>
          <dd>{demo.metadata.timeComplexity}</dd>
          <dt className="text-slate-500">{t('space')}</dt>
          <dd>{demo.metadata.spaceComplexity}</dd>
          {problemText && (
            <>
              <dt className="text-slate-500">{t('problem')}</dt>
              <dd className="col-span-1">{problemText}</dd>
            </>
          )}
        </dl>
      </details>
    </div>
  );
}

export function PlannedPreview({ entry }: { entry: CatalogEntry }) {
  const { t } = useTranslation();

  return (
    <div className="rounded-xl border border-dashed border-slate-600 bg-slate-900/40 p-8 text-center">
      <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-slate-800 text-3xl">
        {entry.visualFamily === 'graph-view' ? '◉' : '▮'}
      </div>
      <h2 className="text-lg font-semibold text-slate-200">{t('plannedTitle')}</h2>
      <p className="mt-2 text-sm text-slate-400">{t('plannedBody', { metaphor: entry.visualMetaphor })}</p>
      <p className="mt-4 text-xs text-slate-500">{t('visualFamily')}: {entry.visualFamily}</p>
    </div>
  );
}

export function AlgorithmPageContent({ entry }: { entry: CatalogEntry }) {
  if (entry.status === 'ready' && getDemo(entry.id)) {
    return <AlgorithmPlayground entry={entry} />;
  }
  return <PlannedPreview entry={entry} />;
}
