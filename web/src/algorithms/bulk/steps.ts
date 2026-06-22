import type { CatalogEntry, DemoInput, VisualStep } from '../../types/demo';
import { buildInitialScene, buildTimelineScene } from './sceneDefaults';
import type { MatrixInput, StringInput, TreeInput } from './sceneDefaults';
import type { GraphInput } from '../graphs/graphUtils';

export function buildBulkSteps(
  entry: CatalogEntry,
  input: DemoInput,
  result: unknown,
): VisualStep[] {
  switch (entry.visualFamily) {
    case 'array-bars':
      return arraySteps(entry, input, result);
    case 'graph-view':
    case 'flow-network':
      return graphSteps(entry, input, result);
    case 'tree-view':
      return treeSteps(entry, input, result);
    case 'matrix-grid':
      return matrixSteps(entry, input, result);
    case 'string-scene':
      return stringSteps(entry, input, result);
    default:
      return timelineSteps(entry, input, result);
  }
}

function arraySteps(entry: CatalogEntry, input: DemoInput, result: unknown): VisualStep[] {
  const values = [...(input as unknown as { values: number[] }).values];
  const steps: VisualStep[] = [
    {
      captionKey: 'steps.generic.start',
      captionParams: { name: entry.name },
      scene: { kind: 'array', values, highlights: {}, pointers: {} },
    },
  ];
  for (let i = 0; i < values.length; i++) {
    steps.push({
      captionKey: 'steps.generic.arrayScan',
      captionParams: { index: i, value: values[i], name: entry.name },
      scene: {
        kind: 'array',
        values,
        highlights: { [i]: 'active' },
        pointers: { i },
      },
    });
  }
  const out =
    result && typeof result === 'object' && 'values' in (result as object)
      ? (result as { values: number[] }).values
      : [...values].sort((a, b) => a - b);
  steps.push({
    captionKey: 'steps.generic.done',
    captionParams: { name: entry.name, summary: out.join(', ') },
    scene: {
      kind: 'array',
      values: out,
      highlights: Object.fromEntries(out.map((_, i) => [i, 'sorted'])),
      pointers: {},
    },
  });
  return steps;
}

function graphSteps(entry: CatalogEntry, input: DemoInput, result: unknown): VisualStep[] {
  const g = input as unknown as GraphInput;
  const scene = buildInitialScene('graph-view', input);
  if (scene.kind !== 'graph') return [];
  const steps: VisualStep[] = [
    {
      captionKey: 'steps.generic.start',
      captionParams: { name: entry.name },
      scene,
    },
  ];
  const order =
    result && typeof result === 'object' && 'order' in (result as object)
      ? (result as { order: string[] }).order
      : g.nodes;
  let visited: string[] = [];
  for (const node of order) {
    visited = [...visited, node];
    steps.push({
      captionKey: 'steps.generic.graphVisit',
      captionParams: { node, name: entry.name },
      scene: {
        kind: 'graph',
        nodes: scene.nodes.map((n) => ({
          ...n,
          state: n.id === node ? 'active' : visited.includes(n.id) ? 'visited' : undefined,
        })),
        edges: scene.edges.map((e) => ({
          ...e,
          state: visited.includes(e.from) && visited.includes(e.to) ? 'path' : undefined,
        })),
        queue: order.filter((x) => !visited.includes(x)),
        visited: [...visited],
      },
    });
  }
  steps.push({
    captionKey: 'steps.generic.done',
    captionParams: { name: entry.name, summary: visited.join(' → ') },
    scene: { kind: 'graph', nodes: scene.nodes, edges: scene.edges, queue: [], visited },
  });
  return steps;
}

function treeSteps(entry: CatalogEntry, input: DemoInput, result: unknown): VisualStep[] {
  const keys = (input as unknown as TreeInput).keys;
  const steps: VisualStep[] = [
    {
      captionKey: 'steps.generic.start',
      captionParams: { name: entry.name },
      scene: buildInitialScene('tree-view', input),
    },
  ];
  const nodes = keys.map((k, i) => ({
    id: String(k),
    label: String(k),
    x: 60 + (i % 5) * 70,
    y: 40 + Math.floor(i / 5) * 60,
    parentId: i > 0 ? String(keys[Math.floor((i - 1) / 2)]) : undefined,
    state: 'active' as const,
  }));
  for (let i = 1; i <= keys.length; i++) {
    steps.push({
      captionKey: 'steps.generic.treeInsert',
      captionParams: { key: keys[i - 1], name: entry.name },
      scene: { kind: 'tree', nodes: nodes.slice(0, i), highlights: [String(keys[i - 1])] },
    });
  }
  const summary =
    result && typeof result === 'object' && 'keys' in (result as object)
      ? (result as { keys: number[] }).keys.join(', ')
      : keys.join(', ');
  steps.push({
    captionKey: 'steps.generic.done',
    captionParams: { name: entry.name, summary },
    scene: { kind: 'tree', nodes, highlights: nodes.map((n) => n.id) },
  });
  return steps;
}

function matrixSteps(entry: CatalogEntry, input: DemoInput, result: unknown): VisualStep[] {
  const values = (input as unknown as MatrixInput).values.map((r) => [...r]);
  const steps: VisualStep[] = [
    {
      captionKey: 'steps.generic.start',
      captionParams: { name: entry.name },
      scene: { kind: 'matrix', cells: values, highlights: {} },
    },
  ];
  for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < values[i].length; j++) {
      steps.push({
        captionKey: 'steps.generic.matrixCell',
        captionParams: { row: i, col: j, value: values[i][j], name: entry.name },
        scene: {
          kind: 'matrix',
          cells: values,
          highlights: { [`${i},${j}`]: 'active' },
        },
      });
    }
  }
  const out =
    result && typeof result === 'object' && 'cells' in (result as object)
      ? (result as { cells: number[][] }).cells
      : values;
  steps.push({
    captionKey: 'steps.generic.done',
    captionParams: { name: entry.name, summary: `${values.length}x${values[0]?.length ?? 0}` },
    scene: { kind: 'matrix', cells: out, highlights: {} },
  });
  return steps;
}

function stringSteps(entry: CatalogEntry, input: DemoInput, result: unknown): VisualStep[] {
  const s = input as unknown as StringInput;
  const steps: VisualStep[] = [
    {
      captionKey: 'steps.generic.start',
      captionParams: { name: entry.name },
      scene: { kind: 'string', primary: s.text, secondary: s.pattern, pointers: {}, highlights: [] },
    },
  ];
  const patLen = s.pattern?.length ?? 1;
  for (let i = 0; i <= s.text.length - patLen; i++) {
    steps.push({
      captionKey: 'steps.generic.stringWindow',
      captionParams: { index: i, name: entry.name },
      scene: {
        kind: 'string',
        primary: s.text,
        secondary: s.pattern,
        pointers: { i, j: i + patLen - 1 },
        highlights: Array.from({ length: patLen }, (_, k) => i + k),
      },
    });
  }
  const matches =
    result && typeof result === 'object' && 'matches' in (result as object)
      ? (result as { matches: number[] }).matches.length
      : 0;
  steps.push({
    captionKey: 'steps.generic.done',
    captionParams: { name: entry.name, summary: String(matches) },
    scene: { kind: 'string', primary: s.text, secondary: s.pattern, pointers: {}, highlights: [] },
  });
  return steps;
}

function timelineSteps(entry: CatalogEntry, input: DemoInput, _result: unknown): VisualStep[] {
  const labels = (input as { labels?: string[] }).labels ?? ['Phase 1', 'Phase 2', 'Phase 3'];
  const steps: VisualStep[] = [];
  for (let i = 0; i < labels.length; i++) {
    steps.push({
      captionKey: 'steps.generic.timeline',
      captionParams: { phase: labels[i], step: i + 1, name: entry.name },
      scene: buildTimelineScene(input, i, entry.visualFamily),
    });
  }
  steps.push({
    captionKey: 'steps.generic.done',
    captionParams: { name: entry.name, summary: labels.join(' → ') },
    scene: buildTimelineScene(input, labels.length - 1, entry.visualFamily),
  });
  return steps;
}
