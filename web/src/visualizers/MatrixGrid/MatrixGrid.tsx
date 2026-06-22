import type { MatrixScene } from '../../types/demo';
import { HIGHLIGHT_COLORS } from '../shared/colors';

export function MatrixGrid({ scene }: { scene: MatrixScene }) {
  const rows = scene.cells.length;
  const cols = scene.cells[0]?.length ?? 0;
  const cellW = Math.min(48, 360 / Math.max(cols, 1));
  const cellH = Math.min(36, 280 / Math.max(rows, 1));

  return (
    <div className="flex h-full min-h-[280px] w-full items-center justify-center overflow-auto p-4">
      <div className="inline-block">
        {scene.cells.map((row, i) => (
          <div key={i} className="flex">
            {row.map((val, j) => {
              const key = `${i},${j}`;
              const hl = scene.highlights[key] ?? 'default';
              return (
                <div
                  key={key}
                  className="flex items-center justify-center border border-slate-700 text-xs font-mono text-slate-100"
                  style={{
                    width: cellW,
                    height: cellH,
                    backgroundColor: HIGHLIGHT_COLORS[hl],
                  }}
                >
                  {val}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
