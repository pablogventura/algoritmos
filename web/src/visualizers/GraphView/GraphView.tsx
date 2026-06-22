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
  return (
    <div className="flex h-full min-h-[320px] w-full items-center justify-center p-2">
      <svg viewBox="0 0 400 320" className="h-full max-h-[360px] w-full max-w-2xl">
        {scene.edges.map((edge, i) => {
          const from = nodePos(scene, edge.from);
          const to = nodePos(scene, edge.to);
          const color = HIGHLIGHT_COLORS[edge.state ?? 'default'];
          const mx = (from.x + to.x) / 2;
          const my = (from.y + to.y) / 2;
          return (
            <g key={`${edge.from}-${edge.to}-${i}`}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={color}
                strokeWidth={edge.state === 'mst' || edge.state === 'path' ? 3 : 2}
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
          return (
            <g key={node.id}>
              <circle cx={node.x} cy={node.y} r={22} fill={fill} stroke="#1e293b" strokeWidth={2} />
              <text
                x={node.x}
                y={node.y + 4}
                textAnchor="middle"
                className="fill-slate-900 text-xs font-bold"
              >
                {node.label}
              </text>
              {node.distance !== undefined && (
                <text
                  x={node.x}
                  y={node.y + 36}
                  textAnchor="middle"
                  className="fill-slate-300 text-[10px]"
                >
                  d={node.distance}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {(scene.queue.length > 0 || scene.visited.length > 0) && (
        <div className="absolute bottom-4 left-4 rounded-lg bg-slate-800/90 px-3 py-2 text-xs text-slate-300">
          {scene.queue.length > 0 && <div>Queue: [{scene.queue.join(', ')}]</div>}
          {scene.visited.length > 0 && <div>Visited: [{scene.visited.join(', ')}]</div>}
        </div>
      )}
    </div>
  );
}
