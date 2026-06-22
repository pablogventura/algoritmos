import { usePlaybackStore } from '../engine/playbackStore';

export function ProgressStrip() {
  const currentIndex = usePlaybackStore((s) => s.currentIndex);
  const steps = usePlaybackStore((s) => s.steps);
  const goTo = usePlaybackStore((s) => s.goTo);

  if (steps.length === 0) return null;

  return (
    <div className="flex gap-0.5 overflow-x-auto rounded-lg bg-slate-900/40 p-2">
      {steps.map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => goTo(i)}
          className={`h-2 min-w-[4px] flex-1 rounded-sm transition-colors ${
            i <= currentIndex ? 'bg-sky-500' : 'bg-slate-700'
          } ${i === currentIndex ? 'ring-1 ring-white' : ''}`}
          aria-label={`Step ${i + 1}`}
        />
      ))}
    </div>
  );
}
