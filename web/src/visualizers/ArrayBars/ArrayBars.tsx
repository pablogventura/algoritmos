import { motion, useReducedMotion } from 'framer-motion';
import type { ArrayScene } from '../../types/demo';
import { HIGHLIGHT_COLORS, POINTER_COLORS } from '../shared/colors';

interface ArrayBarsProps {
  scene: ArrayScene;
}

export function ArrayBars({ scene }: ArrayBarsProps) {
  const maxVal = Math.max(...scene.values, 1);
  const reduceMotion = useReducedMotion();
  const barCount = scene.values.length;

  return (
    <div className="flex h-full min-h-[300px] w-full flex-col items-center justify-end gap-4 p-4">
      <div className="relative h-[240px] w-full max-w-3xl">
        <svg className="pointer-events-none absolute inset-0 h-[200px] w-full" viewBox={`0 0 ${barCount * 40} 200`} preserveAspectRatio="xMidYMax meet">
          {Object.entries(scene.pointers).map(([name, index]) => {
            const x = index * 40 + 20;
            const color = POINTER_COLORS[name] ?? '#94a3b8';
            return (
              <g key={name}>
                <motion.line
                  x1={x}
                  y1={8}
                  x2={x}
                  y2={42}
                  stroke={color}
                  strokeWidth={2}
                  markerEnd="url(#ptr-arrow)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <text x={x} y={6} textAnchor="middle" fill={color} fontSize="10">
                  {name}
                </text>
              </g>
            );
          })}
          <defs>
            <marker id="ptr-arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8" />
            </marker>
          </defs>
        </svg>
        <div className="absolute bottom-0 flex h-[200px] w-full items-end justify-center gap-1 sm:gap-2">
          {scene.values.map((value, index) => {
            const highlight = scene.highlights[index] ?? 'default';
            const heightPct = (value / maxVal) * 100;
            return (
              <div key={index} className="relative flex flex-1 flex-col items-center gap-1">
                <motion.div
                  layout
                  className="w-full min-w-[8px] max-w-[48px] rounded-t-md"
                  style={{
                    height: `${Math.max(heightPct, 4)}%`,
                    backgroundColor: HIGHLIGHT_COLORS[highlight] ?? HIGHLIGHT_COLORS.default,
                  }}
                  animate={
                    highlight === 'compare' && !reduceMotion
                      ? { y: [0, -4, 0], opacity: [1, 0.85, 1] }
                      : highlight === 'active' && !reduceMotion
                        ? { scaleY: [1, 1.04, 1] }
                        : {}
                  }
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 320, damping: 26 }
                  }
                />
                <span className="text-[10px] text-slate-400">{value}</span>
              </div>
            );
          })}
        </div>
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
