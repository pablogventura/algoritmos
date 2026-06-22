import { motion, useReducedMotion } from 'framer-motion';
import type { StringScene } from '../../types/demo';
import { HIGHLIGHT_COLORS, POINTER_COLORS } from '../shared/colors';

export function StringSceneView({ scene }: { scene: StringScene }) {
  const reduceMotion = useReducedMotion();
  const hiSet = new Set(scene.highlights);
  const pointerValues = Object.values(scene.pointers);
  const windowMin = pointerValues.length ? Math.min(...pointerValues) : null;
  const windowMax = pointerValues.length ? Math.max(...pointerValues) : null;

  const renderString = (text: string, highlights: number[], prefix: string) => (
    <div className="relative flex flex-wrap justify-center gap-1">
      {windowMin !== null && windowMax !== null && prefix === 'p' && (
        <motion.div
          className="pointer-events-none absolute -inset-x-1 rounded-lg border-2 border-dashed border-amber-400/70 bg-amber-400/5"
          style={{
            left: `${windowMin * 2.25}rem`,
            width: `${(windowMax - windowMin + 1) * 2.25}rem`,
          }}
          animate={reduceMotion ? {} : { opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      )}
      {text.split('').map((ch, i) => {
        const active = highlights.includes(i);
        return (
          <motion.span
            key={`${prefix}-${i}`}
            animate={
              active && !reduceMotion
                ? { y: [0, -3, 0], boxShadow: '0 0 12px rgba(251,191,36,0.5)' }
                : { y: 0, boxShadow: '0 0 0 rgba(0,0,0,0)' }
            }
            className="relative z-10 flex h-11 w-9 items-center justify-center rounded-md border border-slate-600 font-mono text-sm text-slate-100"
            style={{
              backgroundColor: active ? HIGHLIGHT_COLORS.active : hiSet.has(i) ? HIGHLIGHT_COLORS.compare : '#1e293b',
            }}
          >
            {ch}
          </motion.span>
        );
      })}
    </div>
  );

  return (
    <div className="flex h-full min-h-[260px] flex-col items-center justify-center gap-6 p-4">
      {renderString(scene.primary, scene.highlights, 'p')}
      {scene.secondary && renderString(scene.secondary, [], 's')}
      <div className="flex flex-wrap justify-center gap-2">
        {Object.entries(scene.pointers).map(([name, idx]) => (
          <span
            key={name}
            className="rounded-full px-2 py-0.5 text-xs font-medium"
            style={{ backgroundColor: POINTER_COLORS[name] ?? '#64748b', color: '#0f172a' }}
          >
            {name}={idx}
          </span>
        ))}
      </div>
    </div>
  );
}
