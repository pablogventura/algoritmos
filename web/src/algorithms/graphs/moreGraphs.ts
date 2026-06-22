import type { AlgorithmDemo, GraphScene, HighlightKind, VisualStep } from '../../types/demo';
import {
  buildAdjacency,
  buildDirectedAdjacency,
  initialGraphScene,
  type GraphInput,
} from './graphUtils';

function graphStep(
  base: GraphScene,
  patch: Partial<GraphScene>,
  captionKey: string,
  captionParams: Record<string, string | number> = {},
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

function markNodes(scene: GraphScene, visited: string[], current?: string, stack?: string[]): GraphScene['nodes'] {
  return scene.nodes.map((n) => ({
    ...n,
    state: (n.id === current
      ? 'active'
      : visited.includes(n.id)
        ? 'visited'
        : stack?.includes(n.id)
          ? 'frontier'
          : undefined) as HighlightKind | undefined,
  }));
}

export const dfsDemo: AlgorithmDemo<GraphInput, { order: string[] }> = {
  id: 'dfs',
  visualFamily: 'graph-view',
  metadata: {
    problemKey: 'algorithms.dfs.problem',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
  },
  defaultInput: {
    nodes: ['A', 'B', 'C', 'D', 'E'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'A', to: 'C' },
      { from: 'B', to: 'D' },
      { from: 'C', to: 'E' },
    ],
    start: 'A',
  },
  buildInitialScene: initialGraphScene,
  generateSteps(input) {
    const scene = initialGraphScene(input);
    const adj = buildAdjacency(input);
    const steps: VisualStep[] = [];
    const visited: string[] = [];
    const order: string[] = [];
    const stack = [input.start];

    steps.push(graphStep(scene, { queue: [...stack] }, 'steps.dfs.start', { start: input.start }));

    while (stack.length > 0) {
      const current = stack.pop()!;
      if (visited.includes(current)) continue;
      visited.push(current);
      order.push(current);
      steps.push(
        graphStep(
          scene,
          { nodes: markNodes(scene, visited, current, stack), visited: [...visited], queue: [...stack] },
          'steps.dfs.visit',
          { node: current },
        ),
      );
      for (const { to } of [...(adj.get(current) ?? [])].reverse()) {
        if (!visited.includes(to) && !stack.includes(to)) {
          stack.push(to);
          steps.push(
            graphStep(
              scene,
              { nodes: markNodes(scene, visited, current, stack), queue: [...stack] },
              'steps.dfs.push',
              { from: current, to },
            ),
          );
        }
      }
    }
    steps.push(graphStep(scene, { visited: [...visited] }, 'steps.dfs.done', { order: order.join(', ') }));
    return steps;
  },
  run(input) {
    const adj = buildAdjacency(input);
    const visited = new Set<string>();
    const order: string[] = [];
    const stack = [input.start];
    while (stack.length) {
      const u = stack.pop()!;
      if (visited.has(u)) continue;
      visited.add(u);
      order.push(u);
      for (const { to } of [...(adj.get(u) ?? [])].reverse()) {
        if (!visited.has(to)) stack.push(to);
      }
    }
    return { order };
  },
  testCases: [
    {
      name: 'line',
      input: { nodes: ['A', 'B', 'C'], edges: [{ from: 'A', to: 'B' }, { from: 'B', to: 'C' }], start: 'A' },
      expected: { order: ['A', 'B', 'C'] },
    },
    {
      name: 'fork',
      input: {
        nodes: ['A', 'B', 'C'],
        edges: [{ from: 'A', to: 'B' }, { from: 'A', to: 'C' }],
        start: 'A',
      },
      expected: { order: ['A', 'B', 'C'] },
    },
    {
      name: 'single',
      input: { nodes: ['X'], edges: [], start: 'X' },
      expected: { order: ['X'] },
    },
  ],
};

export const kruskalDemo: AlgorithmDemo<GraphInput, { totalWeight: number; edgeCount: number }> = {
  id: 'kruskal',
  visualFamily: 'graph-view',
  metadata: {
    problemKey: 'algorithms.kruskal.problem',
    timeComplexity: 'O(E log E)',
    spaceComplexity: 'O(V)',
  },
  defaultInput: {
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B', weight: 1 },
      { from: 'B', to: 'C', weight: 2 },
      { from: 'A', to: 'C', weight: 3 },
      { from: 'C', to: 'D', weight: 4 },
    ],
    start: 'A',
  },
  buildInitialScene: initialGraphScene,
  generateSteps(input) {
    const scene = initialGraphScene(input);
    const parent = Object.fromEntries(input.nodes.map((n) => [n, n]));
    const find = (x: string): string => (parent[x] === x ? x : (parent[x] = find(parent[x])));
    const unite = (a: string, b: string) => {
      parent[find(a)] = find(b);
    };

    const sorted = [...input.edges].sort((a, b) => (a.weight ?? 1) - (b.weight ?? 1));
    const steps = [graphStep(scene, {}, 'steps.kruskal.start', {})];
    let total = 0;
    let count = 0;

    for (const e of sorted) {
      steps.push(
        graphStep(scene, {}, 'steps.kruskal.consider', { from: e.from, to: e.to, weight: e.weight ?? 1 }),
      );
      if (find(e.from) !== find(e.to)) {
        unite(e.from, e.to);
        total += e.weight ?? 1;
        count++;
        const edges = scene.edges.map((edge) => {
          const match =
            (edge.from === e.from && edge.to === e.to) || (edge.from === e.to && edge.to === e.from);
          return match ? { ...edge, state: 'mst' as const } : edge;
        });
        steps.push(
          graphStep(scene, { edges }, 'steps.kruskal.add', { from: e.from, to: e.to, weight: e.weight ?? 1 }),
        );
      } else {
        steps.push(graphStep(scene, {}, 'steps.kruskal.skip', { from: e.from, to: e.to }));
      }
    }
    steps.push(graphStep(scene, {}, 'steps.kruskal.done', { totalWeight: total }));
    return steps;
  },
  run(input) {
    const parent = Object.fromEntries(input.nodes.map((n) => [n, n]));
    const find = (x: string): string => (parent[x] === x ? x : (parent[x] = find(parent[x])));
    const unite = (a: string, b: string) => {
      parent[find(a)] = find(b);
    };
    let total = 0;
    let count = 0;
    for (const e of [...input.edges].sort((a, b) => (a.weight ?? 1) - (b.weight ?? 1))) {
      if (find(e.from) !== find(e.to)) {
        unite(e.from, e.to);
        total += e.weight ?? 1;
        count++;
      }
    }
    return { totalWeight: total, edgeCount: count };
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
      expected: { totalWeight: 3, edgeCount: 2 },
    },
    {
      name: 'two nodes',
      input: { nodes: ['A', 'B'], edges: [{ from: 'A', to: 'B', weight: 5 }], start: 'A' },
      expected: { totalWeight: 5, edgeCount: 1 },
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
      expected: { totalWeight: 6, edgeCount: 3 },
    },
  ],
};

export const bellmanFordDemo: AlgorithmDemo<GraphInput, { distances: Record<string, number> }> = {
  id: 'bellman-ford',
  visualFamily: 'graph-view',
  metadata: {
    problemKey: 'algorithms.bellman-ford.problem',
    timeComplexity: 'O(VE)',
    spaceComplexity: 'O(V)',
  },
  defaultInput: {
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B', weight: 1, directed: true },
      { from: 'B', to: 'C', weight: -2, directed: true },
      { from: 'A', to: 'C', weight: 4, directed: true },
      { from: 'C', to: 'D', weight: 3, directed: true },
    ],
    start: 'A',
  },
  buildInitialScene: initialGraphScene,
  generateSteps(input) {
    const scene = initialGraphScene(input);
    const dist: Record<string, number> = Object.fromEntries(input.nodes.map((n) => [n, 1e9]));
    dist[input.start] = 0;
    const steps = [graphStep(scene, {}, 'steps.bellmanFord.start', { start: input.start })];

    for (let round = 0; round < input.nodes.length - 1; round++) {
      steps.push(graphStep(scene, {}, 'steps.bellmanFord.round', { round: round + 1 }));
      for (const e of input.edges) {
        const w = e.weight ?? 1;
        if (dist[e.from] + w < dist[e.to]) {
          dist[e.to] = dist[e.from] + w;
          steps.push(
            graphStep(scene, {}, 'steps.bellmanFord.relax', {
              from: e.from,
              to: e.to,
              weight: w,
              newDist: dist[e.to],
            }),
          );
        }
      }
    }
    steps.push(graphStep(scene, {}, 'steps.bellmanFord.done', {}));
    return steps;
  },
  run(input) {
    const dist: Record<string, number> = Object.fromEntries(input.nodes.map((n) => [n, 1e9]));
    dist[input.start] = 0;
    for (let i = 0; i < input.nodes.length - 1; i++) {
      for (const e of input.edges) {
        const w = e.weight ?? 1;
        if (dist[e.from] + w < dist[e.to]) dist[e.to] = dist[e.from] + w;
      }
    }
    const out: Record<string, number> = {};
    for (const n of input.nodes) out[n] = dist[n] >= 1e9 ? -1 : dist[n];
    return { distances: out };
  },
  testCases: [
    {
      name: 'negative edge',
      input: {
        nodes: ['A', 'B', 'C'],
        edges: [
          { from: 'A', to: 'B', weight: 1, directed: true },
          { from: 'B', to: 'C', weight: -2, directed: true },
        ],
        start: 'A',
      },
      expected: { distances: { A: 0, B: 1, C: -1 } },
    },
    {
      name: 'simple',
      input: {
        nodes: ['A', 'B'],
        edges: [{ from: 'A', to: 'B', weight: 5, directed: true }],
        start: 'A',
      },
      expected: { distances: { A: 0, B: 5 } },
    },
    {
      name: 'unreachable',
      input: { nodes: ['A', 'B'], edges: [], start: 'A' },
      expected: { distances: { A: 0, B: -1 } },
    },
  ],
};

export const topologicalSortDemo: AlgorithmDemo<GraphInput, { order: string[] }> = {
  id: 'orden-topologico',
  visualFamily: 'graph-view',
  metadata: {
    problemKey: 'algorithms.topological-sort.problem',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
  },
  defaultInput: {
    nodes: ['A', 'B', 'C', 'D', 'E'],
    edges: [
      { from: 'A', to: 'B', directed: true },
      { from: 'A', to: 'C', directed: true },
      { from: 'B', to: 'D', directed: true },
      { from: 'C', to: 'D', directed: true },
      { from: 'D', to: 'E', directed: true },
    ],
    start: 'A',
  },
  buildInitialScene: initialGraphScene,
  generateSteps(input) {
    const scene = initialGraphScene(input);
    const adj = buildDirectedAdjacency(input);
    const indegree = Object.fromEntries(input.nodes.map((n) => [n, 0]));
    for (const e of input.edges) indegree[e.to]++;

    const queue = input.nodes.filter((n) => indegree[n] === 0);
    const order: string[] = [];
    const steps = [graphStep(scene, { queue: [...queue] }, 'steps.topologicalSort.start', {})];

    while (queue.length) {
      const u = queue.shift()!;
      order.push(u);
      steps.push(
        graphStep(scene, { queue: [...queue], visited: [...order] }, 'steps.topologicalSort.dequeue', { node: u }),
      );
      for (const { to } of adj.get(u) ?? []) {
        indegree[to]--;
        if (indegree[to] === 0) {
          queue.push(to);
          steps.push(graphStep(scene, { queue: [...queue] }, 'steps.topologicalSort.enqueue', { to }));
        }
      }
    }
    steps.push(graphStep(scene, { visited: order }, 'steps.topologicalSort.done', { order: order.join(', ') }));
    return steps;
  },
  run(input) {
    const adj = buildDirectedAdjacency(input);
    const indegree = Object.fromEntries(input.nodes.map((n) => [n, 0]));
    for (const e of input.edges) indegree[e.to]++;
    const queue = input.nodes.filter((n) => indegree[n] === 0);
    const order: string[] = [];
    while (queue.length) {
      const u = queue.shift()!;
      order.push(u);
      for (const { to } of adj.get(u) ?? []) {
        if (--indegree[to] === 0) queue.push(to);
      }
    }
    return { order };
  },
  testCases: [
    {
      name: 'dag',
      input: {
        nodes: ['A', 'B', 'C'],
        edges: [
          { from: 'A', to: 'B', directed: true },
          { from: 'A', to: 'C', directed: true },
        ],
        start: 'A',
      },
      expected: { order: ['A', 'B', 'C'] },
    },
    {
      name: 'chain',
      input: {
        nodes: ['A', 'B', 'C'],
        edges: [
          { from: 'A', to: 'B', directed: true },
          { from: 'B', to: 'C', directed: true },
        ],
        start: 'A',
      },
      expected: { order: ['A', 'B', 'C'] },
    },
    {
      name: 'single',
      input: { nodes: ['X'], edges: [], start: 'X' },
      expected: { order: ['X'] },
    },
  ],
};

export const unionFindDemo: AlgorithmDemo<GraphInput, { components: number }> = {
  id: 'union-find-disjoint-set-union',
  visualFamily: 'graph-view',
  metadata: {
    problemKey: 'algorithms.union-find.problem',
    timeComplexity: 'O(α(n)) amortized',
    spaceComplexity: 'O(n)',
  },
  defaultInput: {
    nodes: ['1', '2', '3', '4', '5'],
    edges: [
      { from: '1', to: '2' },
      { from: '3', to: '4' },
      { from: '2', to: '3' },
    ],
    start: '1',
  },
  buildInitialScene: initialGraphScene,
  generateSteps(input) {
    const scene = initialGraphScene(input);
    const parent = Object.fromEntries(input.nodes.map((n) => [n, n]));
    const find = (x: string): string => (parent[x] === x ? x : (parent[x] = find(parent[x])));
    const unite = (a: string, b: string) => {
      parent[find(a)] = find(b);
    };
    const countComponents = () => new Set(input.nodes.map((n) => find(n))).size;

    const steps = [graphStep(scene, {}, 'steps.unionFind.start', { components: input.nodes.length })];
    for (const e of input.edges) {
      steps.push(graphStep(scene, {}, 'steps.unionFind.consider', { from: e.from, to: e.to }));
      if (find(e.from) !== find(e.to)) {
        unite(e.from, e.to);
        steps.push(
          graphStep(scene, {}, 'steps.unionFind.unite', {
            from: e.from,
            to: e.to,
            components: countComponents(),
          }),
        );
      } else {
        steps.push(graphStep(scene, {}, 'steps.unionFind.skip', { from: e.from, to: e.to }));
      }
    }
    steps.push(graphStep(scene, {}, 'steps.unionFind.done', { components: countComponents() }));
    return steps;
  },
  run(input) {
    const parent = Object.fromEntries(input.nodes.map((n) => [n, n]));
    const find = (x: string): string => (parent[x] === x ? x : (parent[x] = find(parent[x])));
    const unite = (a: string, b: string) => {
      parent[find(a)] = find(b);
    };
    for (const e of input.edges) {
      if (find(e.from) !== find(e.to)) unite(e.from, e.to);
    }
    return { components: new Set(input.nodes.map((n) => find(n))).size };
  },
  testCases: [
    {
      name: 'merge all',
      input: {
        nodes: ['1', '2', '3'],
        edges: [
          { from: '1', to: '2' },
          { from: '2', to: '3' },
        ],
        start: '1',
      },
      expected: { components: 1 },
    },
    {
      name: 'separate',
      input: { nodes: ['A', 'B'], edges: [], start: 'A' },
      expected: { components: 2 },
    },
    {
      name: 'partial',
      input: {
        nodes: ['1', '2', '3', '4'],
        edges: [{ from: '1', to: '2' }],
        start: '1',
      },
      expected: { components: 3 },
    },
  ],
};
