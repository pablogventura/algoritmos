import { useTranslation } from 'react-i18next';
import type { StoreApi, UseBoundStore } from 'zustand';
import type { PlaybackState } from '../engine/createPlaybackStore';

type PlaybackStore = UseBoundStore<StoreApi<PlaybackState>>;

interface PlaybackControlsProps {
  useStore: PlaybackStore;
}

export function PlaybackControls({ useStore: store }: PlaybackControlsProps) {
  const { t } = useTranslation('playback');
  const isPlaying = store((s) => s.isPlaying);
  const play = store((s) => s.play);
  const pause = store((s) => s.pause);
  const stepForward = store((s) => s.stepForward);
  const stepBackward = store((s) => s.stepBackward);
  const reset = store((s) => s.reset);
  const currentIndex = store((s) => s.currentIndex);
  const steps = store((s) => s.steps);
  const speedMs = store((s) => s.speedMs);
  const setSpeed = store((s) => s.setSpeed);

  const total = steps.length;
  const label = total > 0 ? `${currentIndex + 1} / ${total}` : '0 / 0';

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-900/70 px-3 py-2">
      <button
        type="button"
        onClick={stepBackward}
        className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm hover:bg-slate-600"
        aria-label={t('stepBack')}
      >
        ◀
      </button>
      {isPlaying ? (
        <button
          type="button"
          onClick={pause}
          className="rounded-lg bg-sky-600 px-4 py-1.5 text-sm font-medium hover:bg-sky-500"
        >
          {t('pause')}
        </button>
      ) : (
        <button
          type="button"
          onClick={play}
          className="rounded-lg bg-sky-600 px-4 py-1.5 text-sm font-medium hover:bg-sky-500"
        >
          {t('play')}
        </button>
      )}
      <button
        type="button"
        onClick={stepForward}
        className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm hover:bg-slate-600"
        aria-label={t('stepForward')}
      >
        ▶|
      </button>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm hover:bg-slate-600"
      >
        {t('reset')}
      </button>
      <span className="text-sm text-slate-400">{label}</span>
      <label className="ml-auto flex items-center gap-2 text-xs text-slate-400">
        {t('speed')}
        <input
          type="range"
          min={100}
          max={1500}
          step={50}
          value={speedMs}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="w-24"
          aria-label={t('speed')}
        />
      </label>
    </div>
  );
}
