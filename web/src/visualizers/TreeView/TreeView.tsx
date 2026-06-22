import type { TreeScene } from '../../types/demo';
import { HIGHLIGHT_COLORS } from '../shared/colors';

export function TreeView({ scene }: { scene: TreeScene }) {
  const byId = Object.fromEntries(scene.nodes.map((n) => [n.id, n]));

  return (
    <div className="flex h-full min-h-[300px] w-full items-center justify-center p-4">
      <svg viewBox="0 0 400 320" className="h-full max-h-[360px] w-full">
        {scene.nodes.map((node) => {
          if (node.parentId && byId[node.parentId]) {
            const p = byId[node.parentId];
            return (
              <line
                key={`e-${node.id}`}
                x1={p.x}
                y1={p.y}
                x2={node.x}
                y2={node.y}
                stroke="#475569"
                strokeWidth={2}
              />
            );
          }
          return null;
        })}
        {scene.nodes.map((node) => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r={20}
              fill={HIGHLIGHT_COLORS[node.state ?? (scene.highlights.includes(node.id) ? 'active' : 'default')]}
              stroke="#1e293b"
              strokeWidth={2}
            />
            <text x={node.x} y={node.y + 4} textAnchor="middle" className="fill-slate-900 text-[10px] font-bold">
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
