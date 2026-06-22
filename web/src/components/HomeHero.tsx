import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getDemo } from '../algorithms/registry';
import { usePlaybackStore } from '../engine/playbackStore';
import { SceneRenderer } from '../visualizers/SceneRenderer';
import { ArrayBars } from '../visualizers/ArrayBars/ArrayBars';

export function HomeHero() {
  const { t } = useTranslation('common');
  const demo = getDemo('quicksort');
  const load = usePlaybackStore((s) => s.load);
  const play = usePlaybackStore((s) => s.play);
  const currentIndex = usePlaybackStore((s) => s.currentIndex);
  const isPlaying = usePlaybackStore((s) => s.isPlaying);
  const steps = usePlaybackStore((s) => s.steps);
  const scene = usePlaybackStore((s) => s.getScene());

  useEffect(() => {
    if (!demo) return;
    const initial = demo.buildInitialScene(demo.defaultInput);
    const demoSteps = demo.generateSteps(demo.defaultInput);
    load(initial, demoSteps);
    play();
  }, [demo, load, play]);

  useEffect(() => {
    if (!demo || isPlaying || steps.length === 0) return;
    if (currentIndex >= steps.length - 1) {
      const initial = demo.buildInitialScene(demo.defaultInput);
      const demoSteps = demo.generateSteps(demo.defaultInput);
      load(initial, demoSteps);
      play();
    }
  }, [currentIndex, demo, isPlaying, load, play, steps.length]);

  const arrayScene = useMemo(() => (scene?.kind === 'array' ? scene : null), [scene]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-sky-800/40 bg-gradient-to-br from-slate-900 via-slate-950 to-sky-950/30 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-widest text-sky-400">{t('heroLabel')}</p>
          <p className="text-sm text-slate-300">{t('heroCaption')}</p>
        </div>
        <Link
          to="/algo/quicksort"
          className="shrink-0 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-medium hover:bg-sky-500"
        >
          {t('heroTryIt')}
        </Link>
      </div>
      <div className="h-44 rounded-xl border border-slate-800 bg-slate-950/80">
        {arrayScene ? <ArrayBars scene={arrayScene} /> : <SceneRenderer scene={scene} visualFamily="array-bars" />}
      </div>
    </div>
  );
}
