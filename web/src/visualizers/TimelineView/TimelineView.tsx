import { motion, useReducedMotion } from 'framer-motion';
import type { TimelineScene } from '../../types/demo';

function MetricsBar({ scene }: { scene: TimelineScene }) {
  if (!scene.metrics?.length) return null;
  return (
    <div className="flex flex-wrap gap-3">
      {scene.metrics.map((m) => (
        <div key={m.label} className="min-w-[88px] rounded-lg bg-slate-900/80 px-3 py-2">
          <div className="text-[10px] uppercase tracking-wide text-slate-500">{m.label}</div>
          <div className="text-sm font-semibold text-sky-300">
            {m.value}
            {m.unit ?? ''}
            {m.max ? <span className="text-slate-500"> / {m.max}</span> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function PipelineView({ scene }: { scene: TimelineScene }) {
  const reduceMotion = useReducedMotion();
  return (
    <div className="space-y-3">
      <div className="relative flex items-stretch gap-1 overflow-x-auto pb-2">
        {scene.items.map((item, idx) => {
          const active = idx === scene.activeIndex;
          const done = idx < scene.activeIndex;
          return (
            <div key={item.id} className="relative flex min-w-[92px] flex-1 flex-col items-center">
              {idx > 0 && (
                <div className="absolute left-[-50%] top-7 h-0.5 w-full bg-slate-700">
                  {!reduceMotion && active && (
                    <motion.div
                      className="h-full bg-sky-400"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                  {done && <div className="h-full w-full bg-emerald-500/70" />}
                </div>
              )}
              <motion.div
                animate={active ? { scale: 1.06, y: -2 } : { scale: 1, y: 0 }}
                className={`relative z-10 flex h-14 w-full items-center justify-center rounded-xl border px-2 text-center text-[11px] font-medium ${
                  active
                    ? 'border-sky-400 bg-sky-500/20 text-sky-100 shadow-[0_0_20px_rgba(56,189,248,0.35)]'
                    : done
                      ? 'border-emerald-600/50 bg-emerald-500/10 text-emerald-200'
                      : 'border-slate-700 bg-slate-800/80 text-slate-400'
                }`}
              >
                {item.label}
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NetworkView({ scene }: { scene: TimelineScene }) {
  const nodes = scene.networkNodes ?? [];
  const edges = scene.networkEdges ?? [];
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const reduceMotion = useReducedMotion();

  return (
    <svg viewBox="0 0 400 280" className="h-[220px] w-full rounded-xl bg-slate-950/50">
      {edges.map((edge, i) => {
        const from = byId[edge.from];
        const to = byId[edge.to];
        if (!from || !to) return null;
        return (
          <g key={`${edge.from}-${edge.to}-${i}`}>
            <line
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={edge.active ? '#38bdf8' : '#475569'}
              strokeWidth={edge.active ? 3 : 1.5}
              strokeDasharray={edge.active ? '6 4' : undefined}
              className={edge.active && !reduceMotion ? 'viz-flow-edge' : undefined}
            />
            {edge.active && !reduceMotion && (
              <motion.circle
                r={5}
                fill="#fbbf24"
                initial={{ cx: from.x, cy: from.y }}
                animate={{ cx: to.x, cy: to.y }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              />
            )}
          </g>
        );
      })}
      {nodes.map((node) => {
        const fill =
          node.role === 'active' ? '#38bdf8' : node.role === 'target' ? '#fbbf24' : node.role === 'leader' ? '#a78bfa' : '#64748b';
        return (
          <g key={node.id}>
            <circle cx={node.x} cy={node.y} r={22} fill={fill} stroke="#0f172a" strokeWidth={2} />
            <text x={node.x} y={node.y + 4} textAnchor="middle" className="fill-slate-950 text-[10px] font-bold">
              {node.label.slice(0, 8)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function SignalView({ scene }: { scene: TimelineScene }) {
  const waveform = scene.waveform ?? [];
  const w = 360;
  const h = 80;
  const points =
    waveform.length > 1
      ? waveform
          .map((v, i) => {
            const x = (i / (waveform.length - 1)) * w;
            const y = h / 2 - v * (h / 2 - 6);
            return `${x},${y}`;
          })
          .join(' ')
      : '';

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1">
        {scene.bits.split('').map((bit, i) => (
          <motion.span
            key={i}
            animate={{
              backgroundColor: i <= scene.activeIndex % Math.max(scene.bits.length, 1) ? (bit === '1' ? '#22c55e' : '#334155') : '#1e293b',
              scale: i === scene.activeIndex % Math.max(scene.bits.length, 1) ? 1.15 : 1,
            }}
            className="flex h-7 w-5 items-center justify-center rounded font-mono text-[10px] text-slate-100"
          >
            {bit}
          </motion.span>
        ))}
      </div>
      {points && (
        <svg viewBox={`0 0 ${w} ${h}`} className="h-20 w-full rounded-lg bg-slate-950/70">
          <polyline points={points} fill="none" stroke="#34d399" strokeWidth="2" className="viz-wave-glow" />
        </svg>
      )}
    </div>
  );
}

function ConvergenceView({ scene }: { scene: TimelineScene }) {
  const data = scene.sparkline ?? [];
  const w = 360;
  const h = 100;
  const max = Math.max(...data, 1);
  const visible = Math.min(data.length, scene.activeIndex + 2);
  const points = data
    .slice(0, visible)
    .map((v, i) => {
      const x = data.length > 1 ? (i / (data.length - 1)) * w : w / 2;
      const y = h - (v / max) * (h - 10) - 5;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-28 w-full rounded-lg bg-slate-950/70 p-2">
      {[0.25, 0.5, 0.75].map((t) => (
        <line key={t} x1={0} x2={w} y1={h * t} y2={h * t} stroke="#334155" strokeDasharray="4 4" />
      ))}
      {points && <polyline points={points} fill="none" stroke="#818cf8" strokeWidth="2.5" />}
      {visible > 0 && (
        <circle
          cx={data.length > 1 ? ((visible - 1) / (data.length - 1)) * w : w / 2}
          cy={h - (data[visible - 1] / max) * (h - 10) - 5}
          r={5}
          fill="#c4b5fd"
        />
      )}
    </svg>
  );
}

function ResourcesView({ scene }: { scene: TimelineScene }) {
  const slots = scene.resourceSlots ?? [];
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {slots.map((slot) => (
        <motion.div
          key={slot.label}
          animate={{
            scale: slot.hot ? 1.05 : 1,
            borderColor: slot.hot ? '#38bdf8' : slot.filled ? '#22c55e' : '#475569',
          }}
          className={`rounded-lg border-2 p-3 text-center ${slot.filled ? 'bg-emerald-500/10' : 'bg-slate-900/50'}`}
        >
          <div className="text-[10px] uppercase text-slate-500">Frame</div>
          <div className="truncate text-xs font-medium text-slate-200">{slot.label}</div>
        </motion.div>
      ))}
    </div>
  );
}

export function TimelineView({ scene }: { scene: TimelineScene }) {
  const mode = scene.vizMode ?? 'pipeline';

  return (
    <div className="flex h-full min-h-[300px] w-full flex-col gap-4 p-4">
      <MetricsBar scene={scene} />
      {mode === 'network' && <NetworkView scene={scene} />}
      {mode === 'signal' && <SignalView scene={scene} />}
      {mode === 'convergence' && <ConvergenceView scene={scene} />}
      {mode === 'resources' && <ResourcesView scene={scene} />}
      {(mode === 'pipeline' || mode === 'resources') && <PipelineView scene={scene} />}
      {scene.messages.length > 0 && (
        <div className="max-h-28 overflow-y-auto rounded-lg border border-slate-800 bg-slate-900/80 p-3">
          <div className="mb-2 text-[10px] uppercase tracking-wide text-slate-500">Event log</div>
          {scene.messages.slice(0, scene.activeIndex + 1).map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-mono text-xs text-slate-300"
            >
              <span className="text-sky-400">{m.from}</span>
              <span className="text-slate-600"> → </span>
              <span className="text-amber-300">{m.to}</span>
              <span className="text-slate-600"> : </span>
              {m.text}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
