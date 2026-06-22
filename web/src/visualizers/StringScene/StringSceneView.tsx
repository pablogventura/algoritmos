import type { StringScene } from '../../types/demo';
import { HIGHLIGHT_COLORS, POINTER_COLORS } from '../shared/colors';

export function StringSceneView({ scene }: { scene: StringScene }) {
  const renderString = (text: string, highlights: number[], prefix: string) => (
    <div className="flex flex-wrap gap-1">
      {text.split('').map((ch, i) => (
        <span
          key={`${prefix}-${i}`}
          className="flex h-10 w-8 items-center justify-center rounded-md border border-slate-600 font-mono text-sm"
          style={{
            backgroundColor: highlights.includes(i) ? HIGHLIGHT_COLORS.active : '#1e293b',
          }}
        >
          {ch}
        </span>
      ))}
    </div>
  );

  return (
    <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-6 p-4">
      {renderString(scene.primary, scene.highlights, 'p')}
      {scene.secondary && renderString(scene.secondary, [], 's')}
      <div className="flex flex-wrap gap-2">
        {Object.entries(scene.pointers).map(([name, idx]) => (
          <span
            key={name}
            className="rounded-full px-2 py-0.5 text-xs"
            style={{ backgroundColor: POINTER_COLORS[name] ?? '#64748b', color: '#0f172a' }}
          >
            {name}={idx}
          </span>
        ))}
      </div>
    </div>
  );
}
