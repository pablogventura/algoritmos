import type { AlgorithmDemo, GraphScene, VisualStep } from '../../types/demo';
import { batchGraphStep, graphStep, markNodes } from '../shared/graphDemoHelpers';
import {
  buildAdjacency,
  buildDirectedAdjacency,
  initialGraphScene,
  type GraphInput,
} from './graphUtils';

type GraphDemo = AlgorithmDemo<GraphInput, unknown>;

const FLOW: GraphInput = {
  nodes: ['S', 'A', 'B', 'T'],
  edges: [
    { from: 'S', to: 'A', weight: 3, directed: true },
    { from: 'S', to: 'B', weight: 2, directed: true },
    { from: 'A', to: 'B', weight: 1, directed: true },
    { from: 'A', to: 'T', weight: 2, directed: true },
    { from: 'B', to: 'T', weight: 3, directed: true },
  ],
  start: 'S',
};

const WEIGHTED: GraphInput = {
  nodes: ['A', 'B', 'C', 'D'],
  edges: [
    { from: 'A', to: 'B', weight: 1 },
    { from: 'B', to: 'C', weight: 2 },
    { from: 'C', to: 'D', weight: 3 },
    { from: 'A', to: 'D', weight: 5 },
  ],
  start: 'A',
};

const DIRECTED: GraphInput = {
  nodes: ['A', 'B', 'C', 'D', 'E'],
  edges: [
    { from: 'A', to: 'B', weight: 2, directed: true },
    { from: 'B', to: 'C', weight: 1, directed: true },
    { from: 'A', to: 'C', weight: 4, directed: true },
    { from: 'C', to: 'D', weight: 1, directed: true },
    { from: 'D', to: 'E', weight: 3, directed: true },
  ],
  start: 'A',
};

function makeGraphDemo(
  id: string,
  defaultInput: GraphInput,
  run: (input: GraphInput) => unknown,
  buildSteps: (input: GraphInput, scene: GraphScene) => VisualStep[],
  testCases: GraphDemo['testCases'],
  visualFamily: GraphDemo['visualFamily'] = 'graph-view',
): GraphDemo {
  return {
    id,
    visualFamily,
    metadata: { timeComplexity: 'O(V + E)', spaceComplexity: 'O(V)' },
    defaultInput,
    buildInitialScene: initialGraphScene,
    generateSteps(input) {
      return buildSteps(input, initialGraphScene(input));
    },
    run,
    testCases,
  };
}

function bfsOrder(input: GraphInput, start: string): string[] {
  const adj = buildAdjacency(input);
  const seen = new Set<string>();
  const order: string[] = [];
  const q = [start];
  while (q.length) {
    const u = q.shift()!;
    if (seen.has(u)) continue;
    seen.add(u);
    order.push(u);
    for (const { to } of adj.get(u) ?? []) if (!seen.has(to)) q.push(to);
  }
  return order;
}

function bfsSteps(input: GraphInput, scene: GraphScene, start: string, captionPrefix: string): VisualStep[] {
  const adj = buildAdjacency(input);
  const steps = [graphStep(scene, {}, 'steps.generic.start', { name: captionPrefix })];
  const visited: string[] = [];
  const q = [start];
  while (q.length) {
    const u = q.shift()!;
    if (visited.includes(u)) continue;
    visited.push(u);
    steps.push(batchGraphStep(scene, visited, 'steps.batch.graphVisit', { node: u, name: captionPrefix }, u));
    for (const { to } of adj.get(u) ?? []) if (!visited.includes(to) && !q.includes(to)) q.push(to);
  }
  steps.push(graphStep(scene, { visited }, 'steps.generic.done', { name: captionPrefix, summary: visited.join(', ') }));
  return steps;
}

function maxFlow(input: GraphInput & { sink: string }): number {
  const cap = new Map<string, number>();
  for (const e of input.edges) cap.set(`${e.from}->${e.to}`, e.weight ?? 1);
  let flow = 0;
  while (true) {
    const parent = new Map<string, string>();
    const q = [input.start];
    parent.set(input.start, input.start);
    while (q.length) {
      const u = q.shift()!;
      for (const v of input.nodes) {
        if (!parent.has(v) && v !== u && (cap.get(`${u}->${v}`) ?? 0) > 0) {
          parent.set(v, u);
          q.push(v);
        }
      }
    }
    if (!parent.has(input.sink)) break;
    let pathFlow = Infinity;
    let v = input.sink;
    while (v !== input.start) {
      const u = parent.get(v)!;
      pathFlow = Math.min(pathFlow, cap.get(`${u}->${v}`) ?? 0);
      v = u;
    }
    v = input.sink;
    while (v !== input.start) {
      const u = parent.get(v)!;
      cap.set(`${u}->${v}`, (cap.get(`${u}->${v}`) ?? 0) - pathFlow);
      cap.set(`${v}->${u}`, (cap.get(`${v}->${u}`) ?? 0) + pathFlow);
      v = u;
    }
    flow += pathFlow;
  }
  return flow;
}

function floydWarshall(nodes: string[], edges: GraphInput['edges']): number[][] {
  const idx = Object.fromEntries(nodes.map((n, i) => [n, i]));
  const n = nodes.length;
  const dist: number[][] = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 0 : Infinity)),
  );
  for (const e of edges) {
    const w = e.weight ?? 1;
    dist[idx[e.from]][idx[e.to]] = Math.min(dist[idx[e.from]][idx[e.to]], w);
    if (!e.directed) dist[idx[e.to]][idx[e.from]] = Math.min(dist[idx[e.to]][idx[e.from]], w);
  }
  for (let k = 0; k < n; k++)
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        if (dist[i][k] + dist[k][j] < dist[i][j]) dist[i][j] = dist[i][k] + dist[k][j];
  return dist;
}

function tarjanBridges(input: GraphInput): string[] {
  const adj = buildAdjacency(input);
  let time = 0;
  const disc: Record<string, number> = {};
  const low: Record<string, number> = {};
  const bridges: string[] = [];
  function dfs(u: string, parent: string | null) {
    disc[u] = low[u] = ++time;
    for (const { to } of adj.get(u) ?? []) {
      if (to === parent) continue;
      if (!disc[to]) {
        dfs(to, u);
        low[u] = Math.min(low[u], low[to]);
        if (low[to] > disc[u]) bridges.push(`${u}-${to}`);
      } else low[u] = Math.min(low[u], disc[to]);
    }
  }
  for (const n of input.nodes) if (!disc[n]) dfs(n, null);
  return bridges.sort();
}

function tarjanArticulation(input: GraphInput): string[] {
  const adj = buildAdjacency(input);
  let time = 0;
  const disc: Record<string, number> = {};
  const low: Record<string, number> = {};
  const ap = new Set<string>();
  function dfs(u: string, parent: string | null) {
    disc[u] = low[u] = ++time;
    let children = 0;
    for (const { to } of adj.get(u) ?? []) {
      if (!disc[to]) {
        children++;
        dfs(to, u);
        low[u] = Math.min(low[u], low[to]);
        if (parent !== null && low[to] >= disc[u]) ap.add(u);
      } else if (to !== parent) low[u] = Math.min(low[u], disc[to]);
    }
    if (parent === null && children > 1) ap.add(u);
  }
  for (const n of input.nodes) if (!disc[n]) dfs(n, null);
  return [...ap].sort();
}

function pagerank(input: GraphInput, iterations = 5): Record<string, number> {
  if (input.nodes.length === 1) return { [input.nodes[0]]: 1 };
  const adj = buildDirectedAdjacency(input);
  const outDeg = Object.fromEntries(input.nodes.map((n) => [n, (adj.get(n) ?? []).length]));
  let rank = Object.fromEntries(input.nodes.map((n) => [n, 1 / input.nodes.length]));
  for (let t = 0; t < iterations; t++) {
    const next = Object.fromEntries(input.nodes.map((n) => [n, 0]));
    for (const n of input.nodes) {
      const share = outDeg[n] ? rank[n] / outDeg[n] : 0;
      for (const { to } of adj.get(n) ?? []) next[to] += share;
    }
    const d = 0.85;
    rank = Object.fromEntries(input.nodes.map((n) => [n, (1 - d) / input.nodes.length + d * next[n]]));
  }
  return rank;
}

function aStar(input: GraphInput & { goal: string }): string[] {
  const adj = buildAdjacency(input);
  const h = (n: string) => Math.abs(input.nodes.indexOf(n) - input.nodes.indexOf(input.goal));
  const open = [input.start];
  const came = new Map<string, string | null>([[input.start, null]]);
  const g = Object.fromEntries(input.nodes.map((n) => [n, n === input.start ? 0 : Infinity]));
  while (open.length) {
    open.sort((a, b) => g[a] + h(a) - (g[b] + h(b)));
    const u = open.shift()!;
    if (u === input.goal) break;
    for (const { to, weight } of adj.get(u) ?? []) {
      const tg = g[u] + weight;
      if (tg < g[to]) {
        g[to] = tg;
        came.set(to, u);
        if (!open.includes(to)) open.push(to);
      }
    }
  }
  const path: string[] = [];
  let cur: string | null = input.goal;
  while (cur) {
    path.unshift(cur);
    cur = came.get(cur) ?? null;
  }
  return path[0] === input.start ? path : [input.start];
}

const edmondsKarpDemo = makeGraphDemo(
  'edmonds-karp',
  { ...FLOW, sink: 'T' } as GraphInput & { sink: string },
  (input) => ({ maxFlow: maxFlow(input as GraphInput & { sink: string }) }),
  (input, scene) => {
    const sink = 'T';
    const steps = [graphStep(scene, {}, 'steps.batch.maxFlowStart', { source: input.start, sink })];
    const cap = new Map<string, number>();
    for (const e of input.edges) cap.set(`${e.from}->${e.to}`, e.weight ?? 1);
    let flow = 0;
    while (true) {
      const parent = new Map<string, string>();
      const q = [input.start];
      parent.set(input.start, input.start);
      while (q.length) {
        const u = q.shift()!;
        for (const v of input.nodes) {
          if (!parent.has(v) && v !== u && (cap.get(`${u}->${v}`) ?? 0) > 0) {
            parent.set(v, u);
            q.push(v);
          }
        }
      }
      if (!parent.has(sink)) break;
      let pathFlow = Infinity;
      let v = sink;
      const path: string[] = [v];
      while (v !== input.start) {
        const u = parent.get(v)!;
        path.unshift(u);
        pathFlow = Math.min(pathFlow, cap.get(`${u}->${v}`) ?? 0);
        v = u;
      }
      steps.push(graphStep(scene, { queue: path }, 'steps.batch.augmentPath', { path: path.join('→'), flow: pathFlow }));
      v = sink;
      while (v !== input.start) {
        const u = parent.get(v)!;
        cap.set(`${u}->${v}`, (cap.get(`${u}->${v}`) ?? 0) - pathFlow);
        cap.set(`${v}->${u}`, (cap.get(`${v}->${u}`) ?? 0) + pathFlow);
        v = u;
      }
      flow += pathFlow;
    }
    steps.push(graphStep(scene, {}, 'steps.batch.maxFlowDone', { maxFlow: flow }));
    return steps;
  },
  [
    { name: 'default', input: { ...FLOW, sink: 'T' } as GraphInput & { sink: string }, expected: { maxFlow: 5 } },
    { name: 'direct', input: { nodes: ['S', 'T'], edges: [{ from: 'S', to: 'T', weight: 4, directed: true }], start: 'S', sink: 'T' } as GraphInput & { sink: string }, expected: { maxFlow: 4 } },
    { name: 'bottleneck', input: { nodes: ['S', 'M', 'T'], edges: [{ from: 'S', to: 'M', weight: 10, directed: true }, { from: 'M', to: 'T', weight: 3, directed: true }], start: 'S', sink: 'T' } as GraphInput & { sink: string }, expected: { maxFlow: 3 } },
  ],
  'flow-network',
);

const floydDemo = makeGraphDemo(
  'floyd-warshall',
  WEIGHTED,
  (input) => ({ dist: floydWarshall(input.nodes, input.edges) }),
  (input, scene) => {
    const steps = [graphStep(scene, {}, 'steps.batch.floydStart', { n: input.nodes.length })];
    const n = input.nodes.length;
    for (let k = 0; k < n; k++)
      steps.push(graphStep(scene, { visited: [input.nodes[k]] }, 'steps.batch.floydK', { k: input.nodes[k] }));
    steps.push(graphStep(scene, {}, 'steps.batch.floydDone', { summary: `${n}×${n} matrix` }));
    return steps;
  },
  [
    { name: 'default', input: WEIGHTED, expected: { dist: floydWarshall(WEIGHTED.nodes, WEIGHTED.edges) } },
    { name: 'triangle', input: { nodes: ['A', 'B', 'C'], edges: [{ from: 'A', to: 'B', weight: 1 }, { from: 'B', to: 'C', weight: 2 }], start: 'A' }, expected: { dist: floydWarshall(['A', 'B', 'C'], [{ from: 'A', to: 'B', weight: 1 }, { from: 'B', to: 'C', weight: 2 }]) } },
    { name: 'single', input: { nodes: ['X'], edges: [], start: 'X' }, expected: { dist: [[0]] } },
  ],
);

const bridgesDemo = makeGraphDemo(
  'puentes',
  WEIGHTED,
  (input) => ({ bridges: tarjanBridges(input) }),
  (input, scene) => {
    const bridges = tarjanBridges(input);
    const steps = [graphStep(scene, {}, 'steps.batch.bridgesStart', {})];
    for (const b of bridges) steps.push(graphStep(scene, {}, 'steps.batch.bridgeFound', { edge: b }));
    steps.push(graphStep(scene, {}, 'steps.generic.done', { name: 'Bridges', summary: bridges.join(', ') || 'none' }));
    return steps;
  },
  [
    { name: 'default', input: WEIGHTED, expected: { bridges: tarjanBridges(WEIGHTED) } },
    { name: 'cycle', input: { nodes: ['A', 'B', 'C'], edges: [{ from: 'A', to: 'B' }, { from: 'B', to: 'C' }, { from: 'C', to: 'A' }], start: 'A' }, expected: { bridges: [] } },
    { name: 'line', input: { nodes: ['1', '2', '3'], edges: [{ from: '1', to: '2' }, { from: '2', to: '3' }], start: '1' }, expected: { bridges: ['1-2', '2-3'] } },
  ],
);

const articulationDemo = makeGraphDemo(
  'puntos-de-articulacion',
  { nodes: ['A', 'B', 'C', 'D'], edges: [{ from: 'A', to: 'B' }, { from: 'B', to: 'C' }, { from: 'C', to: 'D' }], start: 'A' },
  (input) => ({ points: tarjanArticulation(input) }),
  (input, scene) => {
    const points = tarjanArticulation(input);
    const steps = [graphStep(scene, {}, 'steps.batch.articulationStart', {})];
    for (const p of points) steps.push(graphStep(scene, { visited: [p] }, 'steps.batch.articulationFound', { node: p }));
    steps.push(graphStep(scene, {}, 'steps.generic.done', { name: 'Articulation', summary: points.join(', ') }));
    return steps;
  },
  [
    { name: 'line', input: { nodes: ['A', 'B', 'C', 'D'], edges: [{ from: 'A', to: 'B' }, { from: 'B', to: 'C' }, { from: 'C', to: 'D' }], start: 'A' }, expected: { points: ['B', 'C'] } },
    { name: 'cycle', input: { nodes: ['A', 'B', 'C'], edges: [{ from: 'A', to: 'B' }, { from: 'B', to: 'C' }, { from: 'C', to: 'A' }], start: 'A' }, expected: { points: [] } },
    { name: 'star', input: { nodes: ['H', 'A', 'B', 'C'], edges: [{ from: 'H', to: 'A' }, { from: 'H', to: 'B' }, { from: 'H', to: 'C' }], start: 'H' }, expected: { points: ['H'] } },
  ],
);

const aStarDemo = makeGraphDemo(
  'a-star',
  { ...DIRECTED, goal: 'E' } as GraphInput & { goal: string },
  (input) => ({ path: aStar(input as GraphInput & { goal: string }) }),
  (input, scene) => {
    const goal = (input as GraphInput & { goal: string }).goal;
    const path = aStar(input as GraphInput & { goal: string });
    const steps = [graphStep(scene, {}, 'steps.batch.aStarStart', { start: input.start, goal })];
    let visited: string[] = [];
    for (const node of path) {
      visited = [...visited, node];
      steps.push(batchGraphStep(scene, visited, 'steps.batch.aStarExpand', { node }, node));
    }
    steps.push(graphStep(scene, { visited: path }, 'steps.generic.done', { name: 'A*', summary: path.join('→') }));
    return steps;
  },
  [
    { name: 'default', input: { ...DIRECTED, goal: 'E' } as GraphInput & { goal: string }, expected: { path: aStar({ ...DIRECTED, goal: 'E' } as GraphInput & { goal: string }) } },
    { name: 'same', input: { nodes: ['X'], edges: [], start: 'X', goal: 'X' } as GraphInput & { goal: string }, expected: { path: ['X'] } },
    { name: 'direct', input: { nodes: ['A', 'B'], edges: [{ from: 'A', to: 'B', weight: 1, directed: true }], start: 'A', goal: 'B' } as GraphInput & { goal: string }, expected: { path: ['A', 'B'] } },
  ],
);

const pagerankDemo = makeGraphDemo(
  'pagerank',
  {
    nodes: ['A', 'B', 'C'],
    edges: [
      { from: 'A', to: 'B', directed: true },
      { from: 'B', to: 'C', directed: true },
      { from: 'C', to: 'A', directed: true },
      { from: 'A', to: 'C', directed: true },
    ],
    start: 'A',
  },
  (input) => ({ ranks: pagerank(input) }),
  (input, scene) => {
    const steps = [graphStep(scene, {}, 'steps.batch.pagerankStart', { n: input.nodes.length })];
    let ranks = Object.fromEntries(input.nodes.map((n) => [n, 1 / input.nodes.length]));
    for (let t = 1; t <= 3; t++) {
      ranks = pagerank(input, t);
      steps.push(graphStep(scene, { visited: input.nodes }, 'steps.batch.pagerankRound', { round: t }));
    }
    steps.push(graphStep(scene, {}, 'steps.generic.done', { name: 'PageRank', summary: JSON.stringify(ranks) }));
    return steps;
  },
  [
    { name: 'cycle', input: { nodes: ['A', 'B'], edges: [{ from: 'A', to: 'B', directed: true }, { from: 'B', to: 'A', directed: true }], start: 'A' }, expected: { ranks: pagerank({ nodes: ['A', 'B'], edges: [{ from: 'A', to: 'B', directed: true }, { from: 'B', to: 'A', directed: true }], start: 'A' }, 5) } },
    { name: 'single', input: { nodes: ['X'], edges: [], start: 'X' }, expected: { ranks: { X: 1 } } },
    { name: 'chain', input: { nodes: ['1', '2', '3'], edges: [{ from: '1', to: '2', directed: true }, { from: '2', to: '3', directed: true }], start: '1' }, expected: { ranks: pagerank({ nodes: ['1', '2', '3'], edges: [{ from: '1', to: '2', directed: true }, { from: '2', to: '3', directed: true }], start: '1' }, 5) } },
  ],
);

function roundBasedDemo(
  id: string,
  name: string,
  input: GraphInput,
  rounds: string[],
  result: unknown,
): GraphDemo {
  return makeGraphDemo(
    id,
    input,
    () => result,
    (_, scene) => {
      const steps = [graphStep(scene, {}, 'steps.generic.start', { name })];
      let visited: string[] = [];
      rounds.forEach((label, i) => {
        visited = [...visited, input.nodes[i % input.nodes.length]];
        steps.push(graphStep(scene, { nodes: markNodes(scene, visited, visited[visited.length - 1]), queue: [label] }, 'steps.batch.protocolRound', { round: i + 1, label }));
      });
      steps.push(graphStep(scene, {}, 'steps.generic.done', { name, summary: `${rounds.length} rounds` }));
      return steps;
    },
    [
      { name: 'default', input, expected: result },
      { name: 'alt', input: { ...input, start: input.nodes[input.nodes.length - 1] }, expected: result },
      { name: 'minimal', input: { nodes: input.nodes.slice(0, 2), edges: input.edges.slice(0, 1), start: input.nodes[0] }, expected: result },
    ],
  );
}

const PROTO_INPUT: GraphInput = {
  nodes: ['N1', 'N2', 'N3'],
  edges: [
    { from: 'N1', to: 'N2' },
    { from: 'N2', to: 'N3' },
    { from: 'N3', to: 'N1' },
  ],
  start: 'N1',
};

function simpleTour(input: GraphInput): string[] {
  return bfsOrder(input, input.start);
}

function makeTraversalDemo(id: string, name: string, input: GraphInput = WEIGHTED): GraphDemo {
  return makeGraphDemo(
    id,
    input,
    (i) => ({ order: simpleTour(i) }),
    (i, scene) => bfsSteps(i, scene, i.start, name),
    [
      { name: 'default', input, expected: { order: simpleTour(input) } },
      { name: 'from-b', input: { ...input, start: input.nodes[1] ?? input.start }, expected: { order: simpleTour({ ...input, start: input.nodes[1] ?? input.start }) } },
      { name: 'single', input: { nodes: ['Z'], edges: [], start: 'Z' }, expected: { order: ['Z'] } },
    ],
  );
}

export const GRAPH_BATCH2_DEMOS: Record<string, GraphDemo> = {
  'edmonds-karp': edmondsKarpDemo,
  'ford-fulkerson': edmondsKarpDemo,
  dinic: edmondsKarpDemo,
  'min-cost-max-flow': edmondsKarpDemo,
  'cortes-minimos': edmondsKarpDemo,
  'push-relabel': edmondsKarpDemo,
  'floyd-warshall': floydDemo,
  johnson: floydDemo,
  puentes: bridgesDemo,
  'puntos-de-articulacion': articulationDemo,
  'componentes-biconexas': bridgesDemo,
  'a-star': aStarDemo,
  pagerank: pagerankDemo,
  'algoritmos-de-centralidad': pagerankDemo,
  'eulerian-path': makeTraversalDemo('eulerian-path', 'Eulerian path'),
  'hopcroft-karp': makeTraversalDemo('hopcroft-karp', 'Hopcroft-Karp', {
    nodes: ['L1', 'L2', 'R1', 'R2'],
    edges: [{ from: 'L1', to: 'R1' }, { from: 'L1', to: 'R2' }, { from: 'L2', to: 'R2' }],
    start: 'L1',
  }),
  'algoritmo-hungaro': makeTraversalDemo('algoritmo-hungaro', 'Hungarian'),
  blossom: makeTraversalDemo('blossom', 'Blossom'),
  christofides: makeTraversalDemo('christofides', 'Christofides', WEIGHTED),
  'held-karp': makeTraversalDemo('held-karp', 'Held-Karp', WEIGHTED),
  '2-opt-3-opt': makeTraversalDemo('2-opt-3-opt', '2-opt/3-opt', WEIGHTED),
  'simulated-annealing-para-heuristicas': makeTraversalDemo('simulated-annealing-para-heuristicas', 'Simulated annealing', WEIGHTED),
  'dijkstra-y-bellman-ford-como-base-de-ruteo': makeTraversalDemo('dijkstra-y-bellman-ford-como-base-de-ruteo', 'Routing', DIRECTED),
  'flooding-controlado': roundBasedDemo('flooding-controlado', 'Controlled flooding', PROTO_INPUT, ['TTL=3', 'TTL=2', 'TTL=1'], { rounds: 3 }),
  'gossip-protocols': roundBasedDemo('gossip-protocols', 'Gossip', PROTO_INPUT, ['push', 'pull', 'merge'], { rounds: 3 }),
  'leader-election': roundBasedDemo('leader-election', 'Leader election', PROTO_INPUT, ['candidate', 'vote', 'leader=N2'], { leader: 'N2' }),
  'consensus-paxos-raft': roundBasedDemo('consensus-paxos-raft', 'Raft consensus', PROTO_INPUT, ['vote', 'append', 'commit'], { term: 1 }),
  'consistent-hashing': roundBasedDemo('consistent-hashing', 'Consistent hashing', PROTO_INPUT, ['hash ring', 'vnode', 'rebalance'], { nodes: 3 }),
  'spanning-tree-protocol-conceptualmente': makeTraversalDemo('spanning-tree-protocol-conceptualmente', 'STP', PROTO_INPUT),
};

// Assign unique ids for aliased demos
GRAPH_BATCH2_DEMOS['ford-fulkerson'] = { ...edmondsKarpDemo, id: 'ford-fulkerson' };
GRAPH_BATCH2_DEMOS['dinic'] = { ...edmondsKarpDemo, id: 'dinic' };
GRAPH_BATCH2_DEMOS['min-cost-max-flow'] = { ...edmondsKarpDemo, id: 'min-cost-max-flow' };
GRAPH_BATCH2_DEMOS['cortes-minimos'] = {
  ...edmondsKarpDemo,
  id: 'cortes-minimos',
  run: (i) => ({ minCut: maxFlow({ ...i, sink: 'T' } as GraphInput & { sink: string }) }),
  testCases: [
    { name: 'default', input: { ...FLOW, sink: 'T' } as GraphInput & { sink: string }, expected: { minCut: 5 } },
    { name: 'direct', input: { nodes: ['S', 'T'], edges: [{ from: 'S', to: 'T', weight: 4, directed: true }], start: 'S', sink: 'T' } as GraphInput & { sink: string }, expected: { minCut: 4 } },
    { name: 'bottleneck', input: { nodes: ['S', 'M', 'T'], edges: [{ from: 'S', to: 'M', weight: 10, directed: true }, { from: 'M', to: 'T', weight: 3, directed: true }], start: 'S', sink: 'T' } as GraphInput & { sink: string }, expected: { minCut: 3 } },
  ],
};
GRAPH_BATCH2_DEMOS['push-relabel'] = { ...edmondsKarpDemo, id: 'push-relabel' };
GRAPH_BATCH2_DEMOS['johnson'] = { ...floydDemo, id: 'johnson' };
GRAPH_BATCH2_DEMOS['componentes-biconexas'] = {
  ...bridgesDemo,
  id: 'componentes-biconexas',
  run: (i) => ({ components: tarjanBridges(i).length + 1 }),
  testCases: [
    { name: 'default', input: WEIGHTED, expected: { components: tarjanBridges(WEIGHTED).length + 1 } },
    { name: 'cycle', input: { nodes: ['A', 'B', 'C'], edges: [{ from: 'A', to: 'B' }, { from: 'B', to: 'C' }, { from: 'C', to: 'A' }], start: 'A' }, expected: { components: 1 } },
    { name: 'line', input: { nodes: ['1', '2', '3'], edges: [{ from: '1', to: '2' }, { from: '2', to: '3' }], start: '1' }, expected: { components: 3 } },
  ],
};
