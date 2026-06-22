import { motion, useReducedMotion } from 'framer-motion';
import type { MatrixScene } from '../../types/demo';
import { HIGHLIGHT_COLORS } from '../shared/colors';

function parseCell(key: string) {
  const [r, c] = key.split(',').map(Number);
  return { r, c };
}

export function MatrixGrid({ scene }: { scene: MatrixScene }) {
  const rows = scene.cells.length;
  const cols = scene.cells[0]?.length ?? 0;
  const cellW = Math.min(52, 380 / Math.max(cols, 1));
  const cellH = Math.min(40, 300 / Math.max(rows, 1));
  const reduceMotion = useReducedMotion();

  let depLine: { x1: number; y1: number; x2: number; y2: number } | null = null;
  if (scene.dependency) {
    const from = parseCell(scene.dependency.from);
    const to = parseCell(scene.dependency.to);
    depLine = {
      x1: from.c * cellW + cellW / 2,
      y1: from.r * cellH + cellH / 2,
      x2: to.c * cellW + cellW / 2,
      y2: to.r * cellH + cellH / 2,
    };
  }

  const svgW = cols * cellW;
  const svgH = rows * cellH;

  return (
    <div className="flex h-full min-h-[300px] w-full items-center justify-center overflow-auto p-4">
      <div className="relative inline-block">
        {depLine && (
          <svg
            className="pointer-events-none absolute inset-0 z-10"
            width={svgW}
            height={svgH}
            viewBox={`0 0 ${svgW} ${svgH}`}
          >
            <defs>
              <marker id="matrix-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#fbbf24" />
              </marker>
            </defs>
            <motion.line
              x1={depLine.x1}
              y1={depLine.y1}
              x2={depLine.x2}
              y2={depLine.y2}
              stroke="#fbbf24"
              strokeWidth={2}
              markerEnd="url(#matrix-arrow)"
              initial={{ pathLength: 0, opacity: 0.4 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.45 }}
            />
          </svg>
        )}
        {scene.cells.map((row, i) => (
          <div key={i} className="flex">
            {row.map((val, j) => {
              const key = `${i},${j}`;
              const hl = scene.highlights[key] ?? 'default';
              const isActive = hl === 'active';
              return (
                <motion.div
                  key={key}
                  animate={
                    isActive && !reduceMotion
                      ? { scale: 1.08, boxShadow: '0 0 16px rgba(56,189,248,0.45)' }
                      : { scale: 1, boxShadow: '0 0 0 rgba(0,0,0,0)' }
                  }
                  className="flex items-center justify-center border border-slate-700/80 text-xs font-mono text-slate-100"
                  style={{
                    width: cellW,
                    height: cellH,
                    backgroundColor: HIGHLIGHT_COLORS[hl],
                    opacity: scene.waveFront !== undefined && i + j > (scene.waveFront ?? 0) + 1 ? 0.35 : 1,
                  }}
                >
                  {val}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
