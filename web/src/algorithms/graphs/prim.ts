import type { AlgorithmDemo, GraphScene, VisualStep } from '../../types/demo';
import {
  buildAdjacency,
  initialGraphScene,
  type GraphInput,
} from './graphUtils';

export interface MstOutput {
  edges: { from: string; to: string; weight: number }[];
  totalWeight: number;
}

function graphStep(
  base: GraphScene,
  patch: Partial<GraphScene>,
  captionKey: string,
  captionParams: Record<string, string | number>,
): VisualStep {
  return {
    captionKey,
    captionParams,
    scene: {
      kind: 'graph',
      nodes: patch.nodes ?? base.nodes,
      edges: patch.edges ?? base.edges,
      queue: patch.queue ?? base.queue,
      visited: patch.visited ?? base.visited,
    },
  };
}

export const primDemo: AlgorithmDemo<GraphInput, MstOutput> = {
  id: 'prim',
  visualFamily: 'graph-view',
  metadata: {
    problemKey: 'algorithms.prim.problem',
    timeComplexity: 'O(V²) or O(E log V)',
    spaceComplexity: 'O(V)',
  },
  defaultInput: {
    nodes: ['A', 'B', 'C', 'D', 'E'],
    edges: [
      { from: 'A', to: 'B', weight: 2 },
      { from: 'A', to: 'C', weight: 3 },
      { from: 'B', to: 'C', weight: 1 },
      { from: 'B', to: 'D', weight: 4 },
      { from: 'C', to: 'D', weight: 5 },
      { from: 'C', to: 'E', weight: 6 },
      { from: 'D', to: 'E', weight: 7 },
    ],
    start: 'A',
  },
  buildInitialScene(input) {
    return initialGraphScene(input);
  },
  generateSteps(input) {
    const scene = initialGraphScene(input);
    const adj = buildAdjacency(input);
    const steps: VisualStep[] = [];
    const inMst = new Set<string>([input.start]);
    const mstEdges: MstOutput['edges'] = [];
    let totalWeight = 0;

    steps.push(
      graphStep(scene, { visited: [input.start] }, 'steps.prim.start', { start: input.start }),
    );

    while (inMst.size < input.nodes.length) {
      let best: { from: string; to: string; weight: number } | null = null;
      for (const u of inMst) {
        for (const { to, weight } of adj.get(u) ?? []) {
          if (inMst.has(to)) continue;
          if (!best || weight < best.weight) {
            best = { from: u, to, weight };
          }
        }
      }
      if (!best) break;

      inMst.add(best.to);
      mstEdges.push(best);
      totalWeight += best.weight;

      const edges = scene.edges.map((e) => {
        const isMst =
          (e.from === best!.from && e.to === best!.to) ||
          (e.from === best!.to && e.to === best!.from);
        return { ...e, state: isMst ? ('mst' as const) : e.state };
      });

      const nodes = scene.nodes.map((n) => ({
        ...n,
        state: inMst.has(n.id) ? ('visited' as const) : undefined,
      }));

      steps.push(
        graphStep(
          scene,
          { nodes, edges, visited: [...inMst] },
          'steps.prim.addEdge',
          { from: best.from, to: best.to, weight: best.weight },
        ),
      );
    }

    steps.push(
      graphStep(scene, { visited: [...inMst] }, 'steps.prim.done', { totalWeight }),
    );
    return steps;
  },
  run(input) {
    const adj = buildAdjacency(input);
    const inMst = new Set<string>([input.start]);
    const mstEdges: MstOutput['edges'] = [];
    let totalWeight = 0;

    while (inMst.size < input.nodes.length) {
      let best: { from: string; to: string; weight: number } | null = null;
      for (const u of inMst) {
        for (const { to, weight } of adj.get(u) ?? []) {
          if (inMst.has(to)) continue;
          if (!best || weight < best.weight) best = { from: u, to, weight };
        }
      }
      if (!best) break;
      inMst.add(best.to);
      mstEdges.push(best);
      totalWeight += best.weight;
    }
    return { edges: mstEdges, totalWeight };
  },
  testCases: [
    {
      name: 'triangle',
      input: {
        nodes: ['A', 'B', 'C'],
        edges: [
          { from: 'A', to: 'B', weight: 1 },
          { from: 'B', to: 'C', weight: 2 },
          { from: 'A', to: 'C', weight: 3 },
        ],
        start: 'A',
      },
      expected: {
        edges: [
          { from: 'A', to: 'B', weight: 1 },
          { from: 'B', to: 'C', weight: 2 },
        ],
        totalWeight: 3,
      },
    },
    {
      name: 'two nodes',
      input: {
        nodes: ['A', 'B'],
        edges: [{ from: 'A', to: 'B', weight: 5 }],
        start: 'A',
      },
      expected: { edges: [{ from: 'A', to: 'B', weight: 5 }], totalWeight: 5 },
    },
    {
      name: 'square',
      input: {
        nodes: ['A', 'B', 'C', 'D'],
        edges: [
          { from: 'A', to: 'B', weight: 1 },
          { from: 'B', to: 'C', weight: 2 },
          { from: 'C', to: 'D', weight: 3 },
          { from: 'A', to: 'D', weight: 4 },
        ],
        start: 'A',
      },
      expected: {
        edges: [
          { from: 'A', to: 'B', weight: 1 },
          { from: 'B', to: 'C', weight: 2 },
          { from: 'C', to: 'D', weight: 3 },
        ],
        totalWeight: 6,
      },
    },
  ],
};
