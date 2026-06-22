import { motion, useReducedMotion } from 'framer-motion';
import type { GraphScene } from '../../types/demo';
import { HIGHLIGHT_COLORS } from '../shared/colors';

interface GraphViewProps {
  scene: GraphScene;
}

function nodePos(scene: GraphScene, id: string) {
  const n = scene.nodes.find((x) => x.id === id);
  return n ? { x: n.x, y: n.y } : { x: 0, y: 0 };
}

export function GraphView({ scene }: GraphViewProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative flex h-full min-h-[320px] w-full items-center justify-center p-2">
      <svg viewBox="0 0 400 320" className="h-full max-h-[380px] w-full max-w-2xl">
        <defs>
          <filter id="node-glow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {scene.edges.map((edge, i) => {
          const from = nodePos(scene, edge.from);
          const to = nodePos(scene, edge.to);
          const color = HIGHLIGHT_COLORS[edge.state ?? 'default'];
          const mx = (from.x + to.x) / 2;
          const my = (from.y + to.y) / 2;
          const active = edge.state === 'path' || edge.state === 'mst' || edge.state === 'frontier';
          return (
            <g key={`${edge.from}-${edge.to}-${i}`}>
              <motion.line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={color}
                strokeWidth={active ? 3.5 : 2}
                strokeDasharray={active && !reduceMotion ? '8 6' : undefined}
                animate={active && !reduceMotion ? { strokeDashoffset: [0, -28] } : {}}
                transition={active && !reduceMotion ? { duration: 1.2, repeat: Infinity, ease: 'linear' } : {}}
              />
              {edge.weight !== undefined && (
                <text x={mx} y={my - 6} textAnchor="middle" className="fill-slate-400 text-[10px]">
                  {edge.weight}
                </text>
              )}
            </g>
          );
        })}
        {scene.nodes.map((node) => {
          const fill = HIGHLIGHT_COLORS[node.state ?? 'default'];
          const pulse = node.state === 'active' || node.state === 'frontier';
          return (
            <g key={node.id}>
              {pulse && !reduceMotion && (
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={26}
                  fill="none"
                  stroke={fill}
                  strokeWidth={2}
                  animate={{ r: [24, 32], opacity: [0.6, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                />
              )}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={22}
                fill={fill}
                stroke="#1e293b"
                strokeWidth={2}
                filter={pulse ? 'url(#node-glow)' : undefined}
                animate={pulse && !reduceMotion ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                transition={{ duration: 0.8, repeat: pulse ? Infinity : 0 }}
                style={{ transformOrigin: `${node.x}px ${node.y}px` }}
              />
              <text
                x={node.x}
                y={node.y + 4}
                textAnchor="middle"
                className="fill-slate-900 text-xs font-bold"
              >
                {node.label}
              </text>
              {node.distance !== undefined && (
                <text x={node.x} y={node.y + 36} textAnchor="middle" className="fill-slate-300 text-[10px]">
                  d={node.distance}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {(scene.queue.length > 0 || scene.visited.length > 0) && (
        <div className="absolute bottom-4 left-4 rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs text-slate-300 shadow-lg">
          {scene.queue.length > 0 && (
            <div>
              <span className="text-amber-300">Queue</span> [{scene.queue.join(', ')}]
            </div>
          )}
          {scene.visited.length > 0 && (
            <div>
              <span className="text-cyan-300">Visited</span> [{scene.visited.join(', ')}]
            </div>
          )}
        </div>
      )}
    </div>
  );
}
