import { useTranslation } from 'react-i18next';
import { usePlaybackStore } from '../engine/playbackStore';

export function StepCaptionPanel() {
  const { t } = useTranslation(['playback', 'steps']);
  const step = usePlaybackStore((s) => s.getCurrentStep());
  const currentIndex = usePlaybackStore((s) => s.currentIndex);
  const total = usePlaybackStore((s) => s.steps.length);

  const text = step
    ? t(step.captionKey, {
        ns: 'steps',
        ...(step.captionParams ?? {}),
        defaultValue: step.captionKey,
      })
    : t('noStep');

  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/50 px-4 py-3">
      <p className="text-xs text-slate-500">
        {t('stepLabel', { current: Math.max(currentIndex + 1, 0), total })}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-slate-100">{text}</p>
    </div>
  );
}
