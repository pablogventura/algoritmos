import type { CatalogEntry, DemoInput, SceneState, VisualFamily } from '../../types/demo';
import { layoutGraph, type GraphInput } from '../graphs/graphUtils';

export type { GraphInput };

export interface StringInput {
  text: string;
  pattern?: string;
}

export interface MatrixInput {
  values: number[][];
}

export interface TreeInput {
  keys: number[];
}

export interface TimelineInput {
  labels: string[];
}

const DEFAULT_ARRAY = [38, 27, 43, 3, 9, 82, 10];
const DEFAULT_GRAPH: GraphInput = {
  nodes: ['A', 'B', 'C', 'D', 'E'],
  edges: [
    { from: 'A', to: 'B', weight: 2 },
    { from: 'A', to: 'C', weight: 4 },
    { from: 'B', to: 'D', weight: 3, directed: true },
    { from: 'C', to: 'D', weight: 1, directed: true },
    { from: 'D', to: 'E', weight: 5, directed: true },
  ],
  start: 'A',
};

export function defaultInputFor(entry: CatalogEntry): DemoInput {
  switch (entry.visualFamily) {
    case 'array-bars':
      return { values: [...DEFAULT_ARRAY] };
    case 'graph-view':
    case 'flow-network':
      return { ...DEFAULT_GRAPH, edges: DEFAULT_GRAPH.edges.map((e) => ({ ...e })) };
    case 'tree-view':
      return { keys: [8, 3, 10, 1, 6, 14, 4] };
    case 'matrix-grid':
      return {
        values: [
          [0, 3, 1],
          [3, 0, 2],
          [1, 2, 0],
        ],
      };
    case 'string-scene':
      return { text: 'ABABDABAC', pattern: 'ABAB' };
    case 'state-machine':
      return { states: ['S0', 'S1', 'S2'], active: 0 };
    case 'numeric-scene':
      return { values: [1, 2, 3, 4, 5] };
    case 'system-sim':
      return { labels: ['P1', 'P2', 'P3'], pages: 4 };
    case 'signal-scene':
      return { data: [1, 0, 1, 1, 0, 1], values: [5, 9, 12, 13, 16, 45], labels: ['A', 'B', 'C'] };
    default:
      return { values: [...DEFAULT_ARRAY] };
  }
}

export function buildInitialScene(family: VisualFamily, input: DemoInput): SceneState {
  switch (family) {
    case 'array-bars': {
      const values = (input as unknown as { values: number[] }).values;
      return { kind: 'array', values: [...values], highlights: {}, pointers: {} };
    }
    case 'graph-view':
    case 'flow-network': {
      const g = input as unknown as GraphInput;
      const { nodes, edges } = layoutGraph(g.nodes, g.edges);
      return { kind: 'graph', nodes, edges, queue: [], visited: [] };
    }
    case 'tree-view': {
      const keys = (input as unknown as TreeInput).keys;
      const nodes = keys.slice(0, 1).map((k) => ({
        id: String(k),
        label: String(k),
        x: 200,
        y: 40,
        state: 'active' as const,
      }));
      return { kind: 'tree', nodes, highlights: [] };
    }
    case 'matrix-grid': {
      const values = (input as unknown as MatrixInput).values;
      return { kind: 'matrix', cells: values.map((r) => [...r]), highlights: {} };
    }
    case 'string-scene': {
      const s = input as unknown as StringInput;
      return { kind: 'string', primary: s.text, secondary: s.pattern, pointers: {}, highlights: [] };
    }
    case 'state-machine':
    case 'numeric-scene':
    case 'system-sim':
    case 'signal-scene':
    default:
      return buildTimelineScene(input, 0);
  }
}

export function buildTimelineScene(input: DemoInput, activeIndex: number): SceneState {
  const labels = (input as unknown as TimelineInput).labels ?? ['Step 1', 'Step 2', 'Step 3', 'Step 4'];
  const data = (input as { data?: number[] }).data ?? [1, 0, 1, 1, 0];
  return {
    kind: 'timeline',
    items: labels.map((label, i) => ({
      id: String(i),
      label,
      start: i * 2,
      end: i * 2 + 2,
      color: i === activeIndex ? '#38bdf8' : '#64748b',
    })),
    messages: labels.map((label) => ({
      from: 'A',
      to: 'B',
      text: label,
    })),
    bits: data.map((b) => (b ? '1' : '0')).join(''),
    activeIndex,
  };
}

export const COMPLEXITY_BY_FAMILY: Record<VisualFamily, { time: string; space: string }> = {
  'array-bars': { time: 'O(n log n)', space: 'O(1)' },
  'graph-view': { time: 'O(V + E)', space: 'O(V)' },
  'tree-view': { time: 'O(log n)', space: 'O(n)' },
  'matrix-grid': { time: 'O(n²)', space: 'O(n²)' },
  'string-scene': { time: 'O(n)', space: 'O(1)' },
  'flow-network': { time: 'O(V E)', space: 'O(V)' },
  'state-machine': { time: 'O(n)', space: 'O(n)' },
  'numeric-scene': { time: 'O(n³)', space: 'O(n²)' },
  'system-sim': { time: 'O(n)', space: 'O(n)' },
  'signal-scene': { time: 'O(n log n)', space: 'O(n)' },
};
