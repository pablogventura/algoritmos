import type { AlgorithmDemo, GraphScene, VisualStep, HighlightKind } from '../../types/demo';
import {
  buildDirectedAdjacency,
  initialGraphScene,
  type GraphInput,
} from './graphUtils';

export interface ShortestPathOutput {
  distances: Record<string, number>;
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

export const dijkstraDemo: AlgorithmDemo<GraphInput, ShortestPathOutput> = {
  id: 'dijkstra',
  visualFamily: 'graph-view',
  metadata: {
    problemKey: 'algorithms.dijkstra.problem',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
  },
  defaultInput: {
    nodes: ['A', 'B', 'C', 'D', 'E'],
    edges: [
      { from: 'A', to: 'B', weight: 4, directed: true },
      { from: 'A', to: 'C', weight: 2, directed: true },
      { from: 'B', to: 'C', weight: 1, directed: true },
      { from: 'B', to: 'D', weight: 5, directed: true },
      { from: 'C', to: 'D', weight: 8, directed: true },
      { from: 'C', to: 'E', weight: 10, directed: true },
      { from: 'D', to: 'E', weight: 2, directed: true },
    ],
    start: 'A',
  },
  buildInitialScene(input) {
    return initialGraphScene(input);
  },
  generateSteps(input) {
    const scene = initialGraphScene(input);
    const adj = buildDirectedAdjacency(input);
    const steps: VisualStep[] = [];
    const dist: Record<string, number> = {};
    const visited: string[] = [];
    const INF = 1e9;

    for (const n of input.nodes) dist[n] = INF;
    dist[input.start] = 0;

    steps.push(
      graphStep(scene, { visited: [] }, 'steps.dijkstra.start', { start: input.start }),
    );

    for (let round = 0; round < input.nodes.length; round++) {
      let u: string | null = null;
      let best = INF;
      for (const n of input.nodes) {
        if (!visited.includes(n) && dist[n] < best) {
          best = dist[n];
          u = n;
        }
      }
      if (u === null || best === INF) break;

      visited.push(u);
      const nodes = scene.nodes.map((n) => ({
        ...n,
        state: (n.id === u ? 'active' : visited.includes(n.id) ? 'visited' : undefined) as
          | HighlightKind
          | undefined,
        distance: dist[n.id] >= INF ? '∞' : dist[n.id],
      }));

      steps.push(
        graphStep(scene, { nodes, visited: [...visited] }, 'steps.dijkstra.select', {
          node: u,
          dist: dist[u],
        }),
      );

      for (const { to, weight } of adj.get(u) ?? []) {
        if (visited.includes(to)) continue;
        const alt = dist[u] + weight;
        if (alt < dist[to]) {
          dist[to] = alt;
          const edges = scene.edges.map((e) => ({
            ...e,
            state:
              e.from === u && e.to === to ? ('path' as const) : e.state,
          }));
          steps.push(
            graphStep(
              scene,
              {
                nodes: nodes.map((n) => ({
                  ...n,
                  distance: dist[n.id] >= INF ? '∞' : dist[n.id],
                })),
                edges,
                visited: [...visited],
              },
              'steps.dijkstra.relax',
              { from: u, to, weight, newDist: alt },
            ),
          );
        }
      }
    }

    const finalDistances: Record<string, number> = {};
    for (const n of input.nodes) {
      finalDistances[n] = dist[n] >= INF ? -1 : dist[n];
    }

    steps.push(
      graphStep(scene, { visited: [...visited] }, 'steps.dijkstra.done', {
        start: input.start,
      }),
    );
    return steps;
  },
  run(input) {
    const adj = buildDirectedAdjacency(input);
    const dist: Record<string, number> = {};
    const visited = new Set<string>();
    const INF = 1e9;
    for (const n of input.nodes) dist[n] = INF;
    dist[input.start] = 0;

    for (let round = 0; round < input.nodes.length; round++) {
      let u: string | null = null;
      let best = INF;
      for (const n of input.nodes) {
        if (!visited.has(n) && dist[n] < best) {
          best = dist[n];
          u = n;
        }
      }
      if (u === null || best === INF) break;
      visited.add(u);
      for (const { to, weight } of adj.get(u) ?? []) {
        if (dist[u] + weight < dist[to]) dist[to] = dist[u] + weight;
      }
    }

    const distances: Record<string, number> = {};
    for (const n of input.nodes) distances[n] = dist[n] >= INF ? -1 : dist[n];
    return { distances };
  },
  testCases: [
    {
      name: 'simple path',
      input: {
        nodes: ['A', 'B', 'C'],
        edges: [
          { from: 'A', to: 'B', weight: 1, directed: true },
          { from: 'B', to: 'C', weight: 2, directed: true },
        ],
        start: 'A',
      },
      expected: { distances: { A: 0, B: 1, C: 3 } },
    },
    {
      name: 'direct edge shorter',
      input: {
        nodes: ['A', 'B', 'C'],
        edges: [
          { from: 'A', to: 'B', weight: 5, directed: true },
          { from: 'A', to: 'C', weight: 2, directed: true },
          { from: 'B', to: 'C', weight: 1, directed: true },
        ],
        start: 'A',
      },
      expected: { distances: { A: 0, B: 5, C: 2 } },
    },
    {
      name: 'unreachable',
      input: {
        nodes: ['A', 'B'],
        edges: [],
        start: 'A',
      },
      expected: { distances: { A: 0, B: -1 } },
    },
  ],
};
