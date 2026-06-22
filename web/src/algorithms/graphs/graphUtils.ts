import type { GraphEdgeView, GraphNodeView } from '../../types/demo';

export interface GraphInput {
  nodes: string[];
  edges: { from: string; to: string; weight?: number; directed?: boolean }[];
  start: string;
}

export function layoutGraph(
  nodeIds: string[],
  edgeList: GraphInput['edges'],
): { nodes: GraphNodeView[]; edges: GraphEdgeView[] } {
  const n = nodeIds.length;
  const radius = Math.max(90, n * 22);
  const cx = 200;
  const cy = 160;

  const nodes: GraphNodeView[] = nodeIds.map((id, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    return {
      id,
      label: id,
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  });

  const edges: GraphEdgeView[] = edgeList.map((e) => ({
    from: e.from,
    to: e.to,
    weight: e.weight,
    directed: e.directed ?? false,
  }));

  return { nodes, edges };
}

export function buildAdjacency(input: GraphInput): Map<string, { to: string; weight: number }[]> {
  const adj = new Map<string, { to: string; weight: number }[]>();
  for (const id of input.nodes) adj.set(id, []);
  for (const e of input.edges) {
    const w = e.weight ?? 1;
    adj.get(e.from)?.push({ to: e.to, weight: w });
    if (!e.directed) {
      adj.get(e.to)?.push({ to: e.from, weight: w });
    }
  }
  return adj;
}

export function buildDirectedAdjacency(
  input: GraphInput,
): Map<string, { to: string; weight: number }[]> {
  const adj = new Map<string, { to: string; weight: number }[]>();
  for (const id of input.nodes) adj.set(id, []);
  for (const e of input.edges) {
    adj.get(e.from)?.push({ to: e.to, weight: e.weight ?? 1 });
  }
  return adj;
}

export function initialGraphScene(input: GraphInput) {
  const { nodes, edges } = layoutGraph(input.nodes, input.edges);
  return {
    kind: 'graph' as const,
    nodes,
    edges,
    queue: [] as string[],
    visited: [] as string[],
  };
}
