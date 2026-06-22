import type { TimelineScene } from '../../types/demo';

export function TimelineView({ scene }: { scene: TimelineScene }) {
  const maxEnd = Math.max(...scene.items.map((i) => i.end), 10);

  return (
    <div className="flex h-full min-h-[280px] w-full flex-col gap-4 p-4">
      {scene.bits && (
        <div className="rounded-lg bg-slate-900 p-3 font-mono text-xs tracking-widest text-emerald-400">
          {scene.bits}
        </div>
      )}
      <div className="space-y-2">
        {scene.items.map((item, idx) => (
          <div key={item.id} className="flex items-center gap-2 text-xs">
            <span className="w-16 shrink-0 text-slate-400">{item.label}</span>
            <div className="relative h-6 flex-1 rounded bg-slate-800">
              <div
                className="absolute top-0 h-full rounded"
                style={{
                  left: `${(item.start / maxEnd) * 100}%`,
                  width: `${((item.end - item.start) / maxEnd) * 100}%`,
                  backgroundColor: item.color ?? (idx === scene.activeIndex ? '#38bdf8' : '#64748b'),
                  opacity: idx <= scene.activeIndex ? 1 : 0.4,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      {scene.messages.length > 0 && (
        <div className="max-h-24 overflow-y-auto rounded-lg bg-slate-900/80 p-2 text-xs text-slate-300">
          {scene.messages.slice(0, scene.activeIndex + 1).map((m, i) => (
            <div key={i}>
              {m.from} → {m.to}: {m.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
