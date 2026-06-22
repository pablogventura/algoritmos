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

function markNodes(
  scene: GraphScene,
  visited: string[],
  current?: string,
  frontier?: string[],
): GraphScene['nodes'] {
  return scene.nodes.map((n) => ({
    ...n,
    state: (n.id === current
      ? 'active'
      : visited.includes(n.id)
        ? 'visited'
        : frontier?.includes(n.id)
          ? 'frontier'
          : undefined) as HighlightKind | undefined,
  }));
}

const CC_INPUT: GraphInput = {
  nodes: ['A', 'B', 'C', 'D', 'E', 'F'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
    { from: 'D', to: 'E' },
    { from: 'E', to: 'F' },
  ],
  start: 'A',
};

export const connectedComponentsDemo: AlgorithmDemo<GraphInput, { components: string[][] }> = {
  id: 'componentes-conexas',
  visualFamily: 'graph-view',
  metadata: { timeComplexity: 'O(V + E)', spaceComplexity: 'O(V)' },
  defaultInput: CC_INPUT,
  buildInitialScene: initialGraphScene,
  generateSteps(input) {
    const scene = initialGraphScene(input);
    const adj = buildAdjacency(input);
    const steps: VisualStep[] = [graphStep(scene, {}, 'steps.connectedComponents.start', { n: input.nodes.length })];
    const visited: string[] = [];
    const components: string[][] = [];
    for (const start of input.nodes) {
      if (visited.includes(start)) continue;
      const comp: string[] = [];
      const q = [start];
      steps.push(graphStep(scene, { queue: [...q] }, 'steps.connectedComponents.new', { start }));
      while (q.length) {
        const u = q.shift()!;
        if (visited.includes(u)) continue;
        visited.push(u);
        comp.push(u);
        steps.push(
          graphStep(scene, { nodes: markNodes(scene, visited, u, q), visited: [...visited], queue: [...q] }, 'steps.connectedComponents.visit', { node: u }),
        );
        for (const { to } of adj.get(u) ?? []) if (!visited.includes(to) && !q.includes(to)) q.push(to);
      }
      components.push(comp);
      steps.push(graphStep(scene, { visited: [...visited] }, 'steps.connectedComponents.found', { size: comp.length, nodes: comp.join(', ') }));
    }
    steps.push(graphStep(scene, { visited: [...visited] }, 'steps.connectedComponents.done', { count: components.length }));
    return steps;
  },
  run(input) {
    const adj = buildAdjacency(input);
    const visited = new Set<string>();
    const components: string[][] = [];
    for (const start of input.nodes) {
      if (visited.has(start)) continue;
      const comp: string[] = [];
      const q = [start];
      while (q.length) {
        const u = q.shift()!;
        if (visited.has(u)) continue;
        visited.add(u);
        comp.push(u);
        for (const { to } of adj.get(u) ?? []) if (!visited.has(to)) q.push(to);
      }
      components.push(comp);
    }
    return { components };
  },
  testCases: [
    { name: 'two components', input: CC_INPUT, expected: { components: [['A', 'B', 'C'], ['D', 'E', 'F']] } },
    { name: 'single', input: { nodes: ['X'], edges: [], start: 'X' }, expected: { components: [['X']] } },
    { name: 'chain', input: { nodes: ['1', '2', '3'], edges: [{ from: '1', to: '2' }, { from: '2', to: '3' }], start: '1' }, expected: { components: [['1', '2', '3']] } },
  ],
};

export const cycleDetectionDemo: AlgorithmDemo<GraphInput, { hasCycle: boolean }> = {
  id: 'deteccion-de-ciclos',
  visualFamily: 'graph-view',
  metadata: { timeComplexity: 'O(V + E)', spaceComplexity: 'O(V)' },
  defaultInput: {
    nodes: ['A', 'B', 'C', 'D'],
    edges: [{ from: 'A', to: 'B' }, { from: 'B', to: 'C' }, { from: 'C', to: 'A' }, { from: 'C', to: 'D' }],
    start: 'A',
  },
  buildInitialScene: initialGraphScene,
  generateSteps(input) {
    const scene = initialGraphScene(input);
    const adj = buildAdjacency(input);
    const steps: VisualStep[] = [graphStep(scene, {}, 'steps.cycleDetection.start', {})];
    const visited = new Set<string>();
    let found = false;
    function dfs(u: string, parent: string | null): boolean {
      visited.add(u);
      steps.push(graphStep(scene, { nodes: markNodes(scene, [...visited], u), visited: [...visited] }, 'steps.cycleDetection.visit', { node: u }));
      for (const { to } of adj.get(u) ?? []) {
        if (to === parent) continue;
        if (visited.has(to)) {
          found = true;
          steps.push(graphStep(scene, { nodes: markNodes(scene, [...visited], to), visited: [...visited] }, 'steps.cycleDetection.backEdge', { from: u, to }));
          return true;
        }
        if (dfs(to, u)) return true;
      }
      return false;
    }
    for (const n of input.nodes) if (!visited.has(n)) dfs(n, null);
    steps.push(graphStep(scene, { visited: [...visited] }, 'steps.cycleDetection.done', { hasCycle: found ? 1 : 0 }));
    return steps;
  },
  run(input) {
    const adj = buildAdjacency(input);
    const visited = new Set<string>();
    function dfs(u: string, parent: string | null): boolean {
      visited.add(u);
      for (const { to } of adj.get(u) ?? []) {
        if (to === parent) continue;
        if (visited.has(to)) return true;
        if (dfs(to, u)) return true;
      }
      return false;
    }
    for (const n of input.nodes) if (!visited.has(n) && dfs(n, null)) return { hasCycle: true };
    return { hasCycle: false };
  },
  testCases: [
    { name: 'cycle', input: { nodes: ['A', 'B', 'C'], edges: [{ from: 'A', to: 'B' }, { from: 'B', to: 'C' }, { from: 'C', to: 'A' }], start: 'A' }, expected: { hasCycle: true } },
    { name: 'tree', input: { nodes: ['A', 'B'], edges: [{ from: 'A', to: 'B' }], start: 'A' }, expected: { hasCycle: false } },
    { name: 'self loop via undirected', input: { nodes: ['A', 'B', 'C'], edges: [{ from: 'A', to: 'B' }, { from: 'B', to: 'C' }, { from: 'C', to: 'A' }], start: 'A' }, expected: { hasCycle: true } },
  ],
};

export const bidirectionalSearchDemo: AlgorithmDemo<GraphInput & { goal: string }, { path: string[] }> = {
  id: 'bidirectional-search',
  visualFamily: 'graph-view',
  metadata: { timeComplexity: 'O(b^(d/2))', spaceComplexity: 'O(b^(d/2))' },
  defaultInput: {
    nodes: ['S', 'A', 'B', 'C', 'T'],
    edges: [
      { from: 'S', to: 'A', directed: true },
      { from: 'S', to: 'B', directed: true },
      { from: 'A', to: 'C', directed: true },
      { from: 'B', to: 'C', directed: true },
      { from: 'C', to: 'T', directed: true },
    ],
    start: 'S',
    goal: 'T',
  },
  buildInitialScene(input) {
    return initialGraphScene(input);
  },
  generateSteps(input) {
    const scene = initialGraphScene(input);
    const adj = buildDirectedAdjacency(input);
    const rev = new Map<string, string[]>();
    for (const id of input.nodes) rev.set(id, []);
    for (const e of input.edges) rev.get(e.to)?.push(e.from);
    const steps: VisualStep[] = [graphStep(scene, {}, 'steps.bidirectional.start', { start: input.start, goal: input.goal })];
    const fromStart = new Map<string, string | null>([[input.start, null]]);
    const fromGoal = new Map<string, string | null>([[input.goal, null]]);
    let frontierS = [input.start];
    let frontierG = [input.goal];
    let meet = '';
    while (frontierS.length && frontierG.length && !meet) {
      const nextS: string[] = [];
      for (const u of frontierS) {
        steps.push(graphStep(scene, { nodes: markNodes(scene, [...fromStart.keys()], u, frontierS), queue: [...frontierS] }, 'steps.bidirectional.forward', { node: u }));
        for (const v of (adj.get(u) ?? []).map((x) => x.to)) {
          if (!fromStart.has(v)) {
            fromStart.set(v, u);
            nextS.push(v);
            if (fromGoal.has(v)) {
              meet = v;
              break;
            }
          }
        }
        if (meet) break;
      }
      frontierS = nextS;
      if (meet) break;
      const nextG: string[] = [];
      for (const u of frontierG) {
        steps.push(graphStep(scene, { nodes: markNodes(scene, [...fromGoal.keys()], u, frontierG), queue: [...frontierG] }, 'steps.bidirectional.backward', { node: u }));
        for (const v of rev.get(u) ?? []) {
          if (!fromGoal.has(v)) {
            fromGoal.set(v, u);
            nextG.push(v);
            if (fromStart.has(v)) {
              meet = v;
              break;
            }
          }
        }
        if (meet) break;
      }
      frontierG = nextG;
    }
    const path = reconstructPath(fromStart, fromGoal, meet || input.start);
    steps.push(graphStep(scene, { visited: path }, 'steps.bidirectional.done', { path: path.join(' → ') }));
    return steps;
  },
  run(input) {
    const adj = buildDirectedAdjacency(input);
    const rev = new Map<string, string[]>();
    for (const id of input.nodes) rev.set(id, []);
    for (const e of input.edges) rev.get(e.to)?.push(e.from);
    const fromStart = new Map<string, string | null>([[input.start, null]]);
    const fromGoal = new Map<string, string | null>([[input.goal, null]]);
    let frontierS = [input.start];
    let frontierG = [input.goal];
    let meet = '';
    while (frontierS.length && frontierG.length && !meet) {
      const nextS: string[] = [];
      for (const u of frontierS) {
        for (const v of (adj.get(u) ?? []).map((x) => x.to)) {
          if (!fromStart.has(v)) {
            fromStart.set(v, u);
            nextS.push(v);
            if (fromGoal.has(v)) {
              meet = v;
              break;
            }
          }
        }
        if (meet) break;
      }
      frontierS = nextS;
      if (meet) break;
      const nextG: string[] = [];
      for (const u of frontierG) {
        for (const v of rev.get(u) ?? []) {
          if (!fromGoal.has(v)) {
            fromGoal.set(v, u);
            nextG.push(v);
            if (fromStart.has(v)) {
              meet = v;
              break;
            }
          }
        }
        if (meet) break;
      }
      frontierG = nextG;
    }
    return { path: reconstructPath(fromStart, fromGoal, meet || input.start) };
  },
  testCases: [
    {
      name: 'path exists',
      input: { nodes: ['S', 'A', 'T'], edges: [{ from: 'S', to: 'A', directed: true }, { from: 'A', to: 'T', directed: true }], start: 'S', goal: 'T' },
      expected: { path: ['S', 'A', 'T'] },
    },
    {
      name: 'same node',
      input: { nodes: ['X'], edges: [], start: 'X', goal: 'X' },
      expected: { path: ['X'] },
    },
    {
      name: 'direct',
      input: { nodes: ['A', 'B'], edges: [{ from: 'A', to: 'B', directed: true }], start: 'A', goal: 'B' },
      expected: { path: ['A', 'B'] },
    },
  ],
};

function reconstructPath(
  fromStart: Map<string, string | null>,
  fromGoal: Map<string, string | null>,
  meet: string,
): string[] {
  const left: string[] = [];
  let cur: string | null = meet;
  while (cur) {
    left.unshift(cur);
    cur = fromStart.get(cur) ?? null;
  }
  const right: string[] = [];
  cur = fromGoal.get(meet) ?? null;
  while (cur) {
    right.push(cur);
    cur = fromGoal.get(cur) ?? null;
  }
  return [...left, ...right];
}

export const boruvkaDemo: AlgorithmDemo<GraphInput, { weight: number }> = {
  id: 'boruvka',
  visualFamily: 'graph-view',
  metadata: { timeComplexity: 'O(E log V)', spaceComplexity: 'O(V + E)' },
  defaultInput: {
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B', weight: 1 },
      { from: 'B', to: 'C', weight: 2 },
      { from: 'C', to: 'D', weight: 3 },
      { from: 'A', to: 'D', weight: 4 },
    ],
    start: 'A',
  },
  buildInitialScene: initialGraphScene,
  generateSteps(input) {
    const scene = initialGraphScene(input);
    const parent = new Map(input.nodes.map((n) => [n, n]));
    const steps: VisualStep[] = [graphStep(scene, {}, 'steps.boruvka.start', {})];
    let total = 0;
    let components = input.nodes.length;
    while (components > 1) {
      const best = new Map<string, { from: string; to: string; weight: number }>();
      for (const e of input.edges) {
        const a = find(parent, e.from);
        const b = find(parent, e.to);
        if (a === b) continue;
        for (const [comp, edge] of [
          [a, { from: e.from, to: e.to, weight: e.weight ?? 1 }],
          [b, { from: e.to, to: e.from, weight: e.weight ?? 1 }],
        ] as const) {
          const cur = best.get(comp);
          if (!cur || edge.weight < cur.weight) best.set(comp, edge);
        }
      }
      if (best.size === 0) break;
      for (const edge of best.values()) {
        const a = find(parent, edge.from);
        const b = find(parent, edge.to);
        if (a === b) continue;
        union(parent, a, b);
        total += edge.weight;
        components--;
        steps.push(
          graphStep(scene, {}, 'steps.boruvka.add', { from: edge.from, to: edge.to, weight: edge.weight, components }),
        );
      }
    }
    steps.push(graphStep(scene, {}, 'steps.boruvka.done', { totalWeight: total }));
    return steps;
  },
  run(input) {
    const parent = new Map(input.nodes.map((n) => [n, n]));
    let total = 0;
    let components = input.nodes.length;
    while (components > 1) {
      const best = new Map<string, { from: string; to: string; weight: number }>();
      for (const e of input.edges) {
        const a = find(parent, e.from);
        const b = find(parent, e.to);
        if (a === b) continue;
        for (const [comp, edge] of [
          [a, { from: e.from, to: e.to, weight: e.weight ?? 1 }],
          [b, { from: e.to, to: e.from, weight: e.weight ?? 1 }],
        ] as const) {
          const cur = best.get(comp);
          if (!cur || edge.weight < cur.weight) best.set(comp, edge);
        }
      }
      if (best.size === 0) break;
      for (const edge of best.values()) {
        const a = find(parent, edge.from);
        const b = find(parent, edge.to);
        if (a === b) continue;
        union(parent, a, b);
        total += edge.weight;
        components--;
      }
    }
    return { weight: total };
  },
  testCases: [
    { name: 'square', input: { nodes: ['A', 'B', 'C', 'D'], edges: [{ from: 'A', to: 'B', weight: 1 }, { from: 'B', to: 'C', weight: 2 }, { from: 'C', to: 'D', weight: 3 }, { from: 'A', to: 'D', weight: 4 }], start: 'A' }, expected: { weight: 6 } },
    { name: 'triangle', input: { nodes: ['A', 'B', 'C'], edges: [{ from: 'A', to: 'B', weight: 1 }, { from: 'B', to: 'C', weight: 2 }, { from: 'A', to: 'C', weight: 3 }], start: 'A' }, expected: { weight: 3 } },
    { name: 'two nodes', input: { nodes: ['X', 'Y'], edges: [{ from: 'X', to: 'Y', weight: 5 }], start: 'X' }, expected: { weight: 5 } },
  ],
};

function find(parent: Map<string, string>, x: string): string {
  if (parent.get(x) !== x) parent.set(x, find(parent, parent.get(x)!));
  return parent.get(x)!;
}

function union(parent: Map<string, string>, a: string, b: string): void {
  parent.set(find(parent, a), find(parent, b));
}

export const fordFulkersonDemo: AlgorithmDemo<GraphInput & { sink: string }, { maxFlow: number }> = {
  id: 'ford-fulkerson',
  visualFamily: 'flow-network',
  metadata: { timeComplexity: 'O(E · maxFlow)', spaceComplexity: 'O(V + E)' },
  defaultInput: {
    nodes: ['S', 'A', 'B', 'T'],
    edges: [
      { from: 'S', to: 'A', weight: 3, directed: true },
      { from: 'S', to: 'B', weight: 2, directed: true },
      { from: 'A', to: 'B', weight: 1, directed: true },
      { from: 'A', to: 'T', weight: 2, directed: true },
      { from: 'B', to: 'T', weight: 3, directed: true },
    ],
    start: 'S',
    sink: 'T',
  },
  buildInitialScene: initialGraphScene,
  generateSteps(input) {
    const scene = initialGraphScene(input);
    const cap = new Map<string, number>();
    for (const e of input.edges) cap.set(`${e.from}->${e.to}`, e.weight ?? 1);
    const steps: VisualStep[] = [graphStep(scene, {}, 'steps.fordFulkerson.start', { source: input.start, sink: input.sink })];
    let flow = 0;
    while (true) {
      const parent = bfsAugment(input.nodes, cap, input.start, input.sink);
      if (!parent.has(input.sink)) break;
      let pathFlow = Infinity;
      let v = input.sink;
      const path: string[] = [v];
      while (v !== input.start) {
        const u = parent.get(v)!;
        path.unshift(u);
        pathFlow = Math.min(pathFlow, cap.get(`${u}->${v}`) ?? 0);
        v = u;
      }
      steps.push(graphStep(scene, { queue: path }, 'steps.fordFulkerson.path', { path: path.join('→'), flow: pathFlow }));
      v = input.sink;
      while (v !== input.start) {
        const u = parent.get(v)!;
        cap.set(`${u}->${v}`, (cap.get(`${u}->${v}`) ?? 0) - pathFlow);
        cap.set(`${v}->${u}`, (cap.get(`${v}->${u}`) ?? 0) + pathFlow);
        v = u;
      }
      flow += pathFlow;
    }
    steps.push(graphStep(scene, {}, 'steps.fordFulkerson.done', { maxFlow: flow }));
    return steps;
  },
  run(input) {
    const cap = new Map<string, number>();
    for (const e of input.edges) cap.set(`${e.from}->${e.to}`, e.weight ?? 1);
    let flow = 0;
    while (true) {
      const parent = bfsAugment(input.nodes, cap, input.start, input.sink);
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
    return { maxFlow: flow };
  },
  testCases: [
    { name: 'classic', input: { nodes: ['S', 'A', 'B', 'T'], edges: [{ from: 'S', to: 'A', weight: 3, directed: true }, { from: 'S', to: 'B', weight: 2, directed: true }, { from: 'A', to: 'T', weight: 2, directed: true }, { from: 'B', to: 'T', weight: 3, directed: true }], start: 'S', sink: 'T' }, expected: { maxFlow: 4 } },
    { name: 'direct', input: { nodes: ['S', 'T'], edges: [{ from: 'S', to: 'T', weight: 7, directed: true }], start: 'S', sink: 'T' }, expected: { maxFlow: 7 } },
    { name: 'bottleneck', input: { nodes: ['S', 'M', 'T'], edges: [{ from: 'S', to: 'M', weight: 10, directed: true }, { from: 'M', to: 'T', weight: 4, directed: true }], start: 'S', sink: 'T' }, expected: { maxFlow: 4 } },
  ],
};

function bfsAugment(
  nodes: string[],
  cap: Map<string, number>,
  source: string,
  _sink: string,
): Map<string, string> {
  const parent = new Map<string, string>();
  const q = [source];
  parent.set(source, source);
  while (q.length) {
    const u = q.shift()!;
    for (const v of nodes) {
      if (v === u) continue;
      if (!parent.has(v) && (cap.get(`${u}->${v}`) ?? 0) > 0) {
        parent.set(v, u);
        q.push(v);
      }
    }
  }
  return parent;
}

export const kosarajuDemo: AlgorithmDemo<GraphInput, { components: string[][] }> = {
  id: 'componentes-fuertemente-conexas',
  visualFamily: 'graph-view',
  metadata: { timeComplexity: 'O(V + E)', spaceComplexity: 'O(V + E)' },
  defaultInput: {
    nodes: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B', directed: true },
      { from: 'B', to: 'C', directed: true },
      { from: 'C', to: 'A', directed: true },
      { from: 'C', to: 'D', directed: true },
    ],
    start: 'A',
  },
  buildInitialScene: initialGraphScene,
  generateSteps(input) {
    const scene = initialGraphScene(input);
    const adj = buildDirectedAdjacency(input);
    const rev = new Map<string, string[]>();
    for (const id of input.nodes) rev.set(id, []);
    for (const e of input.edges) rev.get(e.to)?.push(e.from);
    const steps: VisualStep[] = [graphStep(scene, {}, 'steps.kosaraju.start', {})];
    const order: string[] = [];
    const seen = new Set<string>();
    function dfs1(u: string) {
      seen.add(u);
      for (const { to } of adj.get(u) ?? []) if (!seen.has(to)) dfs1(to);
      order.push(u);
    }
    for (const n of input.nodes) if (!seen.has(n)) dfs1(n);
    steps.push(graphStep(scene, {}, 'steps.kosaraju.finishOrder', { order: order.join(', ') }));
    const components: string[][] = [];
    seen.clear();
    for (let i = order.length - 1; i >= 0; i--) {
      const start = order[i];
      if (seen.has(start)) continue;
      const comp: string[] = [];
      const stack = [start];
      while (stack.length) {
        const u = stack.pop()!;
        if (seen.has(u)) continue;
        seen.add(u);
        comp.push(u);
        steps.push(graphStep(scene, { nodes: markNodes(scene, [...seen], u), visited: [...seen] }, 'steps.kosaraju.assign', { node: u }));
        for (const v of rev.get(u) ?? []) if (!seen.has(v)) stack.push(v);
      }
      components.push(comp);
    }
    steps.push(graphStep(scene, { visited: components.flat() }, 'steps.kosaraju.done', { count: components.length }));
    return steps;
  },
  run(input) {
    const adj = buildDirectedAdjacency(input);
    const rev = new Map<string, string[]>();
    for (const id of input.nodes) rev.set(id, []);
    for (const e of input.edges) rev.get(e.to)?.push(e.from);
    const order: string[] = [];
    const seen = new Set<string>();
    function dfs1(u: string) {
      seen.add(u);
      for (const { to } of adj.get(u) ?? []) if (!seen.has(to)) dfs1(to);
      order.push(u);
    }
    for (const n of input.nodes) if (!seen.has(n)) dfs1(n);
    const components: string[][] = [];
    seen.clear();
    for (let i = order.length - 1; i >= 0; i--) {
      const start = order[i];
      if (seen.has(start)) continue;
      const comp: string[] = [];
      const stack = [start];
      while (stack.length) {
        const u = stack.pop()!;
        if (seen.has(u)) continue;
        seen.add(u);
        comp.push(u);
        for (const v of rev.get(u) ?? []) if (!seen.has(v)) stack.push(v);
      }
      components.push(comp);
    }
    return { components: normalizeSCC(components) };
  },
  testCases: [
    { name: 'two scc', input: { nodes: ['A', 'B', 'C', 'D'], edges: [{ from: 'A', to: 'B', directed: true }, { from: 'B', to: 'C', directed: true }, { from: 'C', to: 'A', directed: true }, { from: 'C', to: 'D', directed: true }], start: 'A' }, expected: { components: [['A', 'B', 'C'], ['D']] } },
    { name: 'single', input: { nodes: ['X'], edges: [], start: 'X' }, expected: { components: [['X']] } },
    { name: 'chain', input: { nodes: ['1', '2', '3'], edges: [{ from: '1', to: '2', directed: true }, { from: '2', to: '3', directed: true }], start: '1' }, expected: { components: [['1'], ['2'], ['3']] } },
  ],
};

export const kosarajuNamedDemo: AlgorithmDemo<GraphInput, { components: string[][] }> = {
  ...kosarajuDemo,
  id: 'kosaraju',
};

function normalizeSCC(components: string[][]): string[][] {
  return components
    .map((component) => [...component].sort())
    .sort((a, b) => a.join(',').localeCompare(b.join(',')));
}

function tarjanSCC(input: GraphInput): string[][] {
  const adj = buildDirectedAdjacency(input);
  const index = new Map<string, number>();
  const low = new Map<string, number>();
  const stack: string[] = [];
  const onStack = new Set<string>();
  const components: string[][] = [];
  let idx = 0;

  function strongConnect(v: string) {
    index.set(v, idx);
    low.set(v, idx);
    idx++;
    stack.push(v);
    onStack.add(v);
    for (const { to } of adj.get(v) ?? []) {
      if (!index.has(to)) {
        strongConnect(to);
        low.set(v, Math.min(low.get(v)!, low.get(to)!));
      } else if (onStack.has(to)) {
        low.set(v, Math.min(low.get(v)!, index.get(to)!));
      }
    }
    if (low.get(v) === index.get(v)) {
      const comp: string[] = [];
      while (true) {
        const w = stack.pop()!;
        onStack.delete(w);
        comp.push(w);
        if (w === v) break;
      }
      components.push(comp);
    }
  }

  for (const n of input.nodes) if (!index.has(n)) strongConnect(n);
  return normalizeSCC(components);
}

export const tarjanDemo: AlgorithmDemo<GraphInput, { components: string[][] }> = {
  id: 'tarjan',
  visualFamily: 'graph-view',
  metadata: { timeComplexity: 'O(V + E)', spaceComplexity: 'O(V)' },
  defaultInput: kosarajuDemo.defaultInput,
  buildInitialScene: initialGraphScene,
  generateSteps(input) {
    const scene = initialGraphScene(input);
    const components = tarjanSCC(input);
    const steps: VisualStep[] = [graphStep(scene, {}, 'steps.tarjan.start', {})];
    const seen: string[] = [];
    for (const comp of components) {
      for (const u of comp) {
        seen.push(u);
        steps.push(graphStep(scene, { nodes: markNodes(scene, seen, u), visited: [...seen] }, 'steps.tarjan.pop', { node: u }));
      }
      steps.push(graphStep(scene, { visited: [...seen] }, 'steps.tarjan.component', { size: comp.length }));
    }
    steps.push(graphStep(scene, { visited: components.flat() }, 'steps.tarjan.done', { count: components.length }));
    return steps;
  },
  run: (input) => ({ components: tarjanSCC(input) }),
  testCases: kosarajuDemo.testCases,
};

export const REST_GRAPH_DEMOS = {
  'componentes-conexas': connectedComponentsDemo,
  'deteccion-de-ciclos': cycleDetectionDemo,
  'bidirectional-search': bidirectionalSearchDemo,
  boruvka: boruvkaDemo,
  'ford-fulkerson': fordFulkersonDemo,
  'componentes-fuertemente-conexas': kosarajuDemo,
  kosaraju: kosarajuNamedDemo,
  tarjan: tarjanDemo,
};
