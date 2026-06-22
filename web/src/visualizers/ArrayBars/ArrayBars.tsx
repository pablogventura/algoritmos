import { motion, useReducedMotion } from 'framer-motion';
import type { ArrayScene } from '../../types/demo';
import { HIGHLIGHT_COLORS, POINTER_COLORS } from '../shared/colors';

interface ArrayBarsProps {
  scene: ArrayScene;
}

export function ArrayBars({ scene }: ArrayBarsProps) {
  const maxVal = Math.max(...scene.values, 1);
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex h-full min-h-[280px] w-full flex-col items-center justify-end gap-4 p-4">
      <div className="flex h-[220px] w-full max-w-3xl items-end justify-center gap-1 sm:gap-2">
        {scene.values.map((value, index) => {
          const highlight = scene.highlights[index] ?? 'default';
          const heightPct = (value / maxVal) * 100;
          return (
            <div key={index} className="flex flex-1 flex-col items-center gap-1">
              <motion.div
                layout
                className="w-full min-w-[8px] max-w-[48px] rounded-t-md"
                style={{
                  height: `${Math.max(heightPct, 4)}%`,
                  backgroundColor: HIGHLIGHT_COLORS[highlight] ?? HIGHLIGHT_COLORS.default,
                }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 300, damping: 28 }
                }
              />
              <span className="text-[10px] text-slate-400">{value}</span>
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {Object.entries(scene.pointers).map(([name, index]) => (
          <span
            key={name}
            className="rounded-full px-2 py-0.5 text-xs font-medium text-slate-900"
            style={{ backgroundColor: POINTER_COLORS[name] ?? '#94a3b8' }}
          >
            {name}={index}
          </span>
        ))}
      </div>
    </div>
  );
}
