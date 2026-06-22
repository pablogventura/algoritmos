import type {
  DemoInput,
  TimelineMetric,
  TimelineNetworkEdge,
  TimelineNetworkNode,
  TimelineVizMode,
  VisualFamily,
} from '../../types/demo';

const NETWORK_LAYOUT: Omit<TimelineNetworkNode, 'label' | 'role'>[] = [
  { id: 'N1', x: 80, y: 60 },
  { id: 'N2', x: 320, y: 60 },
  { id: 'N3', x: 320, y: 220 },
  { id: 'N4', x: 80, y: 220 },
];

const NETWORK_EDGES: TimelineNetworkEdge[] = [
  { from: 'N1', to: 'N2' },
  { from: 'N2', to: 'N3' },
  { from: 'N3', to: 'N4' },
  { from: 'N4', to: 'N1' },
  { from: 'N1', to: 'N3' },
];

export function inferTimelineVizMode(family: VisualFamily | undefined, labels: string[]): TimelineVizMode {
  if (family === 'signal-scene') return 'signal';
  if (family === 'numeric-scene') return 'convergence';
  if (family === 'system-sim') return 'resources';
  const text = labels.join(' ').toLowerCase();
  if (/gossip|consensus|consenso|leader|paxos|raft|distrib|snapshot|map-reduce|parallel|quorum|vote|infect/.test(text)) {
    return 'network';
  }
  return 'pipeline';
}

export function buildSparkline(input: DemoInput, activeIndex: number, phases: number): number[] {
  const values = (input as { values?: number[] }).values ?? [4, 3.2, 2.5, 2.1, 1.8, 1.5];
  const progress = (activeIndex + 1) / Math.max(phases, 1);
  return values.map((v, i) => {
    const decay = Math.exp(-i * 0.35 * progress);
    const noise = Math.sin((i + activeIndex) * 0.9) * 0.08 * v;
    return Math.max(0, v * decay + noise);
  });
}

export function buildWaveform(bits: number[]): number[] {
  const samples: number[] = [];
  for (const bit of bits) {
    const level = bit ? 1 : -1;
    samples.push(level, level, level * 0.6, level * 0.2);
  }
  return samples;
}

export function buildNetworkVisual(activeIndex: number, labels: string[]): {
  nodes: TimelineNetworkNode[];
  edges: TimelineNetworkEdge[];
} {
  const sender = activeIndex % NETWORK_LAYOUT.length;
  const receiver = (activeIndex + 1) % NETWORK_LAYOUT.length;
  const nodes = NETWORK_LAYOUT.map((n, i) => ({
    ...n,
    label: labels[i]?.slice(0, 12) ?? n.id,
    role: (i === sender ? 'active' : i === receiver ? 'target' : 'idle') as TimelineNetworkNode['role'],
  }));
  const edges = NETWORK_EDGES.map((e, i) => ({
    ...e,
    active: i === activeIndex % NETWORK_EDGES.length,
  }));
  return { nodes, edges };
}

export function buildResourceSlots(input: DemoInput, activeIndex: number, labels: string[]) {
  const frames = (input as { pages?: number }).pages ?? 4;
  const slots = Array.from({ length: frames }, (_, i) => ({
    label: labels[i] ?? `F${i}`,
    filled: i <= activeIndex % frames,
    hot: i === activeIndex % frames,
  }));
  return slots;
}

export function buildTimelineMetrics(
  input: DemoInput,
  activeIndex: number,
  labels: string[],
  family?: VisualFamily,
): TimelineMetric[] {
  const values = (input as { values?: number[] }).values ?? [1, 2, 3, 4];
  const progress = ((activeIndex + 1) / Math.max(labels.length, 1)) * 100;
  if (family === 'system-sim') {
    return [
      { label: 'Step', value: activeIndex + 1, max: labels.length },
      { label: 'Load', value: Math.round(progress), max: 100, unit: '%' },
    ];
  }
  if (family === 'signal-scene') {
    const data = (input as { data?: number[] }).data ?? [1, 0, 1, 1, 0];
    const ones = data.filter(Boolean).length;
    return [
      { label: 'Symbols', value: data.length },
      { label: 'Ones', value: ones },
      { label: 'Phase', value: activeIndex + 1, max: labels.length },
    ];
  }
  return [
    { label: 'Phase', value: activeIndex + 1, max: labels.length },
    { label: 'Signal', value: values[activeIndex % values.length] ?? 0 },
  ];
}
