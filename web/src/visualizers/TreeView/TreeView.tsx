import { motion, useReducedMotion } from 'framer-motion';
import type { TreeScene } from '../../types/demo';
import { HIGHLIGHT_COLORS } from '../shared/colors';

export function TreeView({ scene }: { scene: TreeScene }) {
  const byId = Object.fromEntries(scene.nodes.map((n) => [n.id, n]));
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex h-full min-h-[300px] w-full items-center justify-center p-4">
      <svg viewBox="0 0 400 320" className="h-full max-h-[380px] w-full">
        {scene.nodes.map((node) => {
          if (node.parentId && byId[node.parentId]) {
            const p = byId[node.parentId];
            const highlighted = scene.highlights.includes(node.id) || scene.highlights.includes(node.parentId);
            return (
              <motion.line
                key={`e-${node.id}`}
                x1={p.x}
                y1={p.y}
                x2={node.x}
                y2={node.y}
                stroke={highlighted ? '#38bdf8' : '#475569'}
                strokeWidth={highlighted ? 3 : 2}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.35 }}
              />
            );
          }
          return null;
        })}
        {scene.nodes.map((node) => {
          const active = scene.highlights.includes(node.id);
          const fill = HIGHLIGHT_COLORS[node.state ?? (active ? 'active' : 'default')];
          return (
            <g key={node.id}>
              {active && !reduceMotion && (
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={24}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  animate={{ r: [22, 30], opacity: [0.5, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
              )}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={20}
                fill={fill}
                stroke="#1e293b"
                strokeWidth={2}
                animate={active && !reduceMotion ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                transition={{ duration: 0.6 }}
                style={{ transformOrigin: `${node.x}px ${node.y}px` }}
              />
              <text x={node.x} y={node.y + 4} textAnchor="middle" className="fill-slate-900 text-[10px] font-bold">
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
