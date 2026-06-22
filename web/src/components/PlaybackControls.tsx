import { useTranslation } from 'react-i18next';
import { usePlaybackStore } from '../engine/playbackStore';

export function PlaybackControls() {
  const { t } = useTranslation('playback');
  const {
    isPlaying,
    play,
    pause,
    stepForward,
    stepBackward,
    reset,
    currentIndex,
    steps,
    speedMs,
    setSpeed,
  } = usePlaybackStore();

  const total = steps.length;
  const label = total > 0 ? `${currentIndex + 1} / ${total}` : '0 / 0';

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-900/70 px-3 py-2">
      <button
        type="button"
        onClick={stepBackward}
        className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm hover:bg-slate-600"
        aria-label={t('playback.stepBack')}
      >
        ◀
      </button>
      {isPlaying ? (
        <button
          type="button"
          onClick={pause}
          className="rounded-lg bg-sky-600 px-4 py-1.5 text-sm font-medium hover:bg-sky-500"
        >
          {t('playback.pause')}
        </button>
      ) : (
        <button
          type="button"
          onClick={play}
          className="rounded-lg bg-sky-600 px-4 py-1.5 text-sm font-medium hover:bg-sky-500"
        >
          {t('playback.play')}
        </button>
      )}
      <button
        type="button"
        onClick={stepForward}
        className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm hover:bg-slate-600"
        aria-label={t('playback.stepForward')}
      >
        ▶|
      </button>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm hover:bg-slate-600"
      >
        {t('playback.reset')}
      </button>
      <span className="text-sm text-slate-400">{label}</span>
      <label className="ml-auto flex items-center gap-2 text-xs text-slate-400">
        {t('playback.speed')}
        <input
          type="range"
          min={100}
          max={1500}
          step={50}
          value={speedMs}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="w-24"
        />
      </label>
    </div>
  );
}
