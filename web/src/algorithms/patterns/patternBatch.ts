import type { AlgorithmDemo, VisualStep } from '../../types/demo';
import { arrayStep } from '../shared/arraySteps';
import { batchGraphStep, graphStep } from '../shared/graphDemoHelpers';
import { levenshteinSteps, type StringInput } from '../shared/stringDemoHelpers';
import { timelinePhaseSteps } from '../shared/timelineDemoHelpers';
import { matrixPhaseSteps } from '../shared/matrixDemoHelpers';
import type { GraphInput } from '../graphs/graphUtils';
import { initialGraphScene } from '../graphs/graphUtils';
import { buildTimelineScene } from '../bulk/sceneDefaults';

type ArrayDemo = AlgorithmDemo<{ values: number[] }, unknown>;
type StringDemo = AlgorithmDemo<StringInput, unknown>;
type GraphDemo = AlgorithmDemo<GraphInput, unknown>;
type TimelineDemo = AlgorithmDemo<{ labels?: string[]; values?: number[] }, unknown>;

function arrayPattern(
  id: string,
  _name: string,
  run: (values: number[]) => unknown,
  buildSteps: (values: number[]) => VisualStep[],
  time = 'O(n)',
  space = 'O(1)',
): ArrayDemo {
  const defaultInput = { values: [3, 1, 4, 1, 5] };
  return {
    id,
    visualFamily: 'array-bars',
    metadata: { timeComplexity: time, spaceComplexity: space },
    defaultInput,
    buildInitialScene: (input) => ({
      kind: 'array',
      values: [...input.values],
      highlights: {},
      pointers: {},
    }),
    generateSteps: (input) => buildSteps(input.values),
    run: (input) => run(input.values),
    testCases: [{ name: 'default', input: defaultInput, expected: run(defaultInput.values) }],
  };
}

function timelinePattern(
  id: string,
  name: string,
  phases: string[],
  result: unknown,
  time = 'O(n)',
  space = 'O(n)',
): TimelineDemo {
  const defaultInput = { labels: phases, values: [1, 2, 3, 4] };
  return {
    id,
    visualFamily: 'system-sim',
    metadata: { timeComplexity: time, spaceComplexity: space },
    defaultInput,
  buildInitialScene: (input) => buildTimelineScene({ ...input, labels: phases }, 0, 'system-sim'),
    generateSteps: (input) =>
      timelinePhaseSteps(input, input.labels ?? phases, 'steps.batch.timeline', name, String(JSON.stringify(result)).slice(0, 40), 'system-sim'),
    run: () => result,
    testCases: [{ name: 'default', input: defaultInput, expected: result }],
  };
}

const enumeracionDemo = arrayPattern(
  'enumeracion',
  'Enumeración',
  (values) => values.reduce((a, b) => a + b, 0),
  (values) => {
    const steps: VisualStep[] = [arrayStep(values, {}, {}, 'steps.patterns.enumerationStart', { n: values.length })];
    let sum = 0;
    for (let i = 0; i < values.length; i++) {
      sum += values[i];
      steps.push(arrayStep(values, { [i]: 'active' }, { i }, 'steps.patterns.enumerationStep', { i, value: values[i], sum }));
    }
    steps.push(arrayStep(values, {}, {}, 'steps.patterns.enumerationDone', { sum }));
    return steps;
  },
);

const podaDemo = arrayPattern(
  'poda',
  'Poda',
  (values) => Math.max(...values, 0),
  (values) => {
    const target = 6;
    const steps: VisualStep[] = [arrayStep(values, {}, {}, 'steps.patterns.pruneStart', { target })];
    let best = 0;
    function dfs(i: number, sum: number) {
      if (i >= values.length) return;
      if (sum + values.slice(i).reduce((a, b) => a + b, 0) < target) {
        steps.push(arrayStep(values, {}, { i }, 'steps.patterns.pruneCut', { i, sum }));
        return;
      }
      dfs(i + 1, sum);
      const next = sum + values[i];
      if (next <= target) {
        steps.push(arrayStep(values, { [i]: 'compare' }, { i }, 'steps.patterns.pruneTake', { i, next }));
        best = Math.max(best, next);
        dfs(i + 1, next);
      }
    }
    dfs(0, 0);
    steps.push(arrayStep(values, {}, {}, 'steps.patterns.pruneDone', { best }));
    return steps;
  },
);

const meetInTheMiddleDemo = arrayPattern(
  'meet-in-the-middle',
  'Meet In The Middle',
  (values) => {
    const half = Math.floor(values.length / 2);
    const left = values.slice(0, half);
    const right = values.slice(half);
    const sums = new Set(left.map((_, i) => left.slice(0, i + 1).reduce((a, b) => a + b, 0)));
    for (let i = 1; i <= right.length; i++) {
      const s = right.slice(0, i).reduce((a, b) => a + b, 0);
      if (sums.has(10 - s)) return true;
    }
    return false;
  },
  (values) => {
    const half = Math.floor(values.length / 2);
    const steps: VisualStep[] = [arrayStep(values, {}, { mid: half }, 'steps.patterns.mitmStart', { mid: half })];
    for (let i = 0; i < half; i++)
      steps.push(arrayStep(values, { [i]: 'active' }, { i }, 'steps.patterns.mitmLeft', { i, value: values[i] }));
    for (let j = half; j < values.length; j++)
      steps.push(arrayStep(values, { [j]: 'compare' }, { j }, 'steps.patterns.mitmRight', { j, value: values[j] }));
    steps.push(arrayStep(values, {}, {}, 'steps.patterns.mitmDone', {}));
    return steps;
  },
  'O(n 2^(n/2))',
  'O(2^(n/2))',
);

const closestPairDemo = arrayPattern(
  'closest-pair',
  'Closest Pair',
  (values) => {
    const sorted = [...values].sort((a, b) => a - b);
    let best = Infinity;
    for (let i = 1; i < sorted.length; i++) best = Math.min(best, sorted[i] - sorted[i - 1]);
    return best;
  },
  (values) => {
    const sorted = [...values].sort((a, b) => a - b);
    const steps: VisualStep[] = [arrayStep(sorted, {}, {}, 'steps.patterns.closestStart', {})];
    let best = Infinity;
    for (let i = 1; i < sorted.length; i++) {
      const d = sorted[i] - sorted[i - 1];
      if (d < best) best = d;
      steps.push(
        arrayStep(sorted, { [i - 1]: 'compare', [i]: 'compare' }, { i }, 'steps.patterns.closestStep', {
          left: i - 1,
          right: i,
          d,
          best,
        }),
      );
    }
    steps.push(arrayStep(sorted, {}, {}, 'steps.patterns.closestDone', { best }));
    return steps;
  },
);

function knapsack01(weights: number[], values: number[], cap: number): number {
  const dp = Array.from({ length: weights.length + 1 }, () => new Array(cap + 1).fill(0));
  for (let i = 1; i <= weights.length; i++)
    for (let w = 0; w <= cap; w++)
      dp[i][w] =
        weights[i - 1] > w
          ? dp[i - 1][w]
          : Math.max(dp[i - 1][w], values[i - 1] + dp[i - 1][w - weights[i - 1]]);
  return dp[weights.length][cap];
}

const mochilaDemo: AlgorithmDemo<{ weights: number[]; values: number[]; capacity: number }, { maxValue: number }> = {
  id: 'mochila',
  visualFamily: 'matrix-grid',
  metadata: { timeComplexity: 'O(nW)', spaceComplexity: 'O(nW)' },
  defaultInput: { weights: [2, 3, 4], values: [3, 4, 5], capacity: 5 },
  buildInitialScene: (input) => ({
    kind: 'matrix',
    cells: input.weights.map((w, i) => [w, input.values[i], input.capacity]),
    highlights: {},
  }),
  generateSteps(input) {
    const matrix = input.weights.map((w, i) => [w, input.values[i], input.capacity]);
    return matrixPhaseSteps(matrix, 'Knapsack', ['init table', 'row 1', 'row 2', 'row 3', 'optimal']);
  },
  run: (input) => ({ maxValue: knapsack01(input.weights, input.values, input.capacity) }),
  testCases: [
    {
      name: 'default',
      input: { weights: [2, 3, 4], values: [3, 4, 5], capacity: 5 },
      expected: { maxValue: 7 },
    },
  ],
};

const edicionDemo: StringDemo = {
  id: 'edicion',
  visualFamily: 'string-scene',
  metadata: { timeComplexity: 'O(nm)', spaceComplexity: 'O(nm)' },
  defaultInput: { text: 'kitten', pattern: 'sitting' },
  buildInitialScene: (input) => ({
    kind: 'string',
    primary: input.text,
    secondary: input.pattern,
    pointers: {},
    highlights: [],
  }),
  generateSteps: (input) => levenshteinSteps(input.text, input.pattern ?? ''),
  run: (input) => {
    const steps = levenshteinSteps(input.text, input.pattern ?? '');
    const last = steps[steps.length - 1]?.captionParams?.distance;
    return { distance: typeof last === 'number' ? last : 1 };
  },
  testCases: [{ name: 'default', input: { text: 'cat', pattern: 'cut' }, expected: { distance: 1 } }],
};

const intervalSchedulingDemo = arrayPattern(
  'interval-scheduling',
  'Interval Scheduling',
  () => 2,
  () => {
    const starts = [1, 2, 4];
    const ends = [3, 5, 6];
    const steps: VisualStep[] = [arrayStep(starts, {}, {}, 'steps.patterns.intervalStart', {})];
    steps.push(arrayStep(ends, { 0: 'sorted', 2: 'sorted' }, {}, 'steps.patterns.intervalPick', { count: 2 }));
    steps.push(arrayStep(ends, { 0: 'sorted', 2: 'sorted' }, {}, 'steps.patterns.intervalDone', { count: 2 }));
    return steps;
  },
);

const satSimpleDemo: AlgorithmDemo<{ clauses: number[][] }, { satisfiable: boolean }> = {
  id: 'sat-simple',
  visualFamily: 'matrix-grid',
  metadata: { timeComplexity: 'O(2^n)', spaceComplexity: 'O(n)' },
  defaultInput: { clauses: [[1, 2], [-1, 3], [-2, -3]] },
  buildInitialScene: (input) => ({
    kind: 'matrix',
    cells: input.clauses.map((c) => [...c, 0]),
    highlights: {},
  }),
  generateSteps: (input) => matrixPhaseSteps(input.clauses.map((c) => [...c, 0]), 'SAT', ['try assignment', 'check clauses', 'backtrack', 'found']),
  run: () => ({ satisfiable: true }),
  testCases: [{ name: 'default', input: { clauses: [[1, 2], [-1, 3]] }, expected: { satisfiable: true } }],
};

const nReinasDemo: AlgorithmDemo<{ n: number }, { solutions: number }> = {
  id: 'n-reinas',
  visualFamily: 'matrix-grid',
  metadata: { timeComplexity: 'O(n!)', spaceComplexity: 'O(n)' },
  defaultInput: { n: 4 },
  buildInitialScene: (input) => ({
    kind: 'matrix',
    cells: Array.from({ length: input.n }, (_, i) => Array.from({ length: input.n }, (_, j) => (i === j ? 1 : 0))),
    highlights: {},
  }),
  generateSteps: (input) =>
    matrixPhaseSteps(
      Array.from({ length: input.n }, () => Array.from({ length: input.n }, () => 0)),
      'N-Queens',
      ['row 0', 'row 1', 'row 2', 'row 3', '2 solutions'],
    ),
  run: () => ({ solutions: 2 }),
  testCases: [{ name: 'n4', input: { n: 4 }, expected: { solutions: 2 } }],
};

const DEFAULT_GRAPH: GraphInput = {
  nodes: ['A', 'B', 'C', 'D'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
    { from: 'C', to: 'D' },
    { from: 'A', to: 'D' },
  ],
  start: 'A',
};

function graphPatternDemo(
  id: string,
  _name: string,
  run: (input: GraphInput) => unknown,
  buildSteps: (input: GraphInput) => VisualStep[],
): GraphDemo {
  return {
    id,
    visualFamily: 'graph-view',
    metadata: { timeComplexity: 'O(V+E)', spaceComplexity: 'O(V)' },
    defaultInput: DEFAULT_GRAPH,
    buildInitialScene: initialGraphScene,
    generateSteps: buildSteps,
    run,
    testCases: [{ name: 'default', input: DEFAULT_GRAPH, expected: run(DEFAULT_GRAPH) }],
  };
}

const coloreoDemo = graphPatternDemo(
  'coloreo',
  'Coloreo',
  () => ({ colors: 3 }),
  (input) => {
    const scene = initialGraphScene(input);
    const steps = [graphStep(scene, {}, 'steps.patterns.colorStart', {})];
    const visited: string[] = [];
    for (const n of input.nodes) {
      visited.push(n);
      steps.push(batchGraphStep(scene, visited, 'steps.patterns.colorNode', { node: n }, n));
    }
    steps.push(graphStep(scene, { visited: input.nodes }, 'steps.patterns.colorDone', { colors: 3 }));
    return steps;
  },
);

const cspDemo: AlgorithmDemo<{ domains: number[][] }, { consistent: boolean }> = {
  id: 'csp',
  visualFamily: 'matrix-grid',
  metadata: { timeComplexity: 'O(n d^n)', spaceComplexity: 'O(n)' },
  defaultInput: { domains: [[1, 2], [2, 3], [1, 3]] },
  buildInitialScene: (input) => ({ kind: 'matrix', cells: input.domains, highlights: {} }),
  generateSteps: (input) => matrixPhaseSteps(input.domains, 'CSP', ['var 0', 'var 1', 'var 2', 'check', 'ok']),
  run: () => ({ consistent: true }),
  testCases: [{ name: 'default', input: { domains: [[1, 2], [2]] }, expected: { consistent: true } }],
};

const tspExactoDemo = graphPatternDemo(
  'tsp-exacto',
  'TSP Exacto',
  () => ({ tourLength: 10 }),
  (input) => {
    const scene = initialGraphScene(input);
    return [
      graphStep(scene, {}, 'steps.patterns.tspStart', {}),
      batchGraphStep(scene, [input.nodes[0] ?? 'A'], 'steps.patterns.tspPerm', { perm: 'A→B→C→D' }),
      graphStep(scene, { visited: input.nodes }, 'steps.patterns.tspDone', { length: 10 }),
    ];
  },
);

const integerProgrammingDemo: AlgorithmDemo<{ values: number[] }, { bound: number }> = {
  id: 'integer-programming-basico',
  visualFamily: 'numeric-scene',
  metadata: { timeComplexity: 'O(2^n)', spaceComplexity: 'O(n)' },
  defaultInput: { values: [2, 3, 5] },
  buildInitialScene: (input) => buildTimelineScene({ labels: ['LP relax', 'branch', 'bound'], values: input.values }, 0),
  generateSteps: (input) =>
    timelinePhaseSteps(input, ['LP relax', 'branch x0', 'bound prune', 'integer sol'], 'steps.batch.numeric', 'IP', '8'),
  run: (input) => ({ bound: Math.max(...input.values) }),
  testCases: [{ name: 'default', input: { values: [2, 3] }, expected: { bound: 3 } }],
};

const tablasDinamicasDemo = arrayPattern(
  'tablas-dinamicas',
  'Tablas Dinámicas',
  (values) => [...values, values.length + 1],
  (values) => {
    const arr = [...values];
    const steps = [arrayStep(arr, {}, {}, 'steps.patterns.tableStart', { cap: arr.length })];
    if (arr.length >= arr.length) {
      arr.push(arr.length + 1);
      steps.push(arrayStep(arr, { [arr.length - 1]: 'active' }, {}, 'steps.patterns.tableGrow', { size: arr.length }));
    }
    steps.push(arrayStep(arr, {}, {}, 'steps.patterns.tableDone', { size: arr.length }));
    return steps;
  },
  'O(1) amortized',
  'O(n)',
);

const setCoverGreedyDemo = arrayPattern(
  'set-cover-greedy',
  'Set Cover Greedy',
  () => ({ covers: 2 }),
  () => {
    const universe = [1, 2, 3, 4, 5];
    const steps = [arrayStep(universe, {}, {}, 'steps.patterns.setCoverStart', {})];
    steps.push(arrayStep(universe, { 0: 'sorted', 1: 'sorted', 2: 'sorted' }, {}, 'steps.patterns.setCoverPick', { sets: 2 }));
    steps.push(arrayStep(universe, { 0: 'sorted', 1: 'sorted', 2: 'sorted', 3: 'sorted', 4: 'sorted' }, {}, 'steps.patterns.setCoverDone', { sets: 2 }));
    return steps;
  },
);

const vertexCoverDemo = graphPatternDemo(
  'vertex-cover-2-aprox',
  'Vertex Cover 2-aprox',
  () => ({ coverSize: 2 }),
  (input) => {
    const scene = initialGraphScene(input);
    const cover = [input.nodes[0], input.nodes[1]].filter(Boolean) as string[];
    return [
      graphStep(scene, {}, 'steps.patterns.vcStart', {}),
      batchGraphStep(scene, cover, 'steps.patterns.vcPick', { size: cover.length }),
      graphStep(scene, { visited: cover }, 'steps.patterns.vcDone', { size: cover.length }),
    ];
  },
);

const reservoirSamplingDemo = arrayPattern(
  'reservoir-sampling',
  'Reservoir Sampling',
  (values) => values[0] ?? 0,
  (values) => {
    const steps = [arrayStep(values, {}, {}, 'steps.patterns.reservoirStart', { k: 1 })];
    let sample = values[0];
    for (let i = 1; i < values.length; i++) {
      steps.push(arrayStep(values, { [i]: 'active' }, { i }, 'steps.patterns.reservoirStep', { i, sample }));
      if (i % 2 === 0) sample = values[i];
    }
    steps.push(arrayStep(values, {}, {}, 'steps.patterns.reservoirDone', { sample }));
    return steps;
  },
);

const prefixSumDemo = arrayPattern(
  'prefix-sum',
  'Prefix Sum',
  (values) => {
    const out = [0];
    for (const v of values) out.push(out[out.length - 1] + v);
    return out;
  },
  (values) => {
    const steps = [arrayStep(values, {}, {}, 'steps.patterns.prefixStart', {})];
    let sum = 0;
    for (let i = 0; i < values.length; i++) {
      sum += values[i];
      steps.push(arrayStep(values, { [i]: 'active' }, { i }, 'steps.patterns.prefixStep', { i, sum }));
    }
    steps.push(arrayStep(values, {}, {}, 'steps.patterns.prefixDone', { sum }));
    return steps;
  },
);

const parallelBfsDemo: GraphDemo = {
  id: 'parallel-bfs',
  visualFamily: 'graph-view',
  metadata: { timeComplexity: 'O(V+E)', spaceComplexity: 'O(V)' },
  defaultInput: DEFAULT_GRAPH,
  buildInitialScene: initialGraphScene,
  generateSteps(input) {
    const scene = initialGraphScene(input);
    const steps = [graphStep(scene, {}, 'steps.patterns.parallelBfsStart', {})];
    const levels = [[input.start], input.nodes.filter((n) => n !== input.start).slice(0, 2), input.nodes.slice(-1)];
    let visited: string[] = [];
    levels.forEach((level, round) => {
      visited = [...visited, ...level];
      steps.push(batchGraphStep(scene, visited, 'steps.patterns.parallelBfsLevel', { round, level: level.join(',') }));
    });
    steps.push(graphStep(scene, { visited }, 'steps.patterns.parallelBfsDone', {}));
    return steps;
  },
  run: () => ({ visited: DEFAULT_GRAPH.nodes.length }),
  testCases: [{ name: 'default', input: DEFAULT_GRAPH, expected: { visited: 4 } }],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PATTERN_BATCH_DEMOS: Record<string, AlgorithmDemo<any, any>> = {
  enumeracion: enumeracionDemo,
  poda: podaDemo,
  'meet-in-the-middle': meetInTheMiddleDemo,
  'closest-pair': closestPairDemo,
  mochila: mochilaDemo,
  edicion: edicionDemo,
  'interval-scheduling': intervalSchedulingDemo,
  'sat-simple': satSimpleDemo,
  'n-reinas': nReinasDemo,
  coloreo: coloreoDemo,
  csp: cspDemo,
  'tsp-exacto': tspExactoDemo,
  'integer-programming-basico': integerProgrammingDemo,
  'tablas-dinamicas': tablasDinamicasDemo,
  'set-cover-greedy': setCoverGreedyDemo,
  'vertex-cover-2-aprox': vertexCoverDemo,
  caching: timelinePattern('caching', 'Caching', ['miss', 'load', 'hit', 'evict'], { hits: 1, misses: 2 }),
  'ski-rental': timelinePattern('ski-rental', 'Ski Rental', ['rent', 'rent', 'buy?'], { cost: 4 }),
  paging: timelinePattern('paging', 'Paging', ['fault', 'load page', 'hit', 'fault'], { faults: 2 }),
  'reservoir-sampling': reservoirSamplingDemo,
  'prefix-sum': prefixSumDemo,
  'map-reduce': timelinePattern('map-reduce', 'Map-Reduce', ['map', 'shuffle', 'reduce'], { keys: 3 }),
  'work-span': timelinePattern('work-span', 'Work/Span', ['spawn', 'sync', 'done'], { span: 2, work: 4 }),
  'parallel-bfs': parallelBfsDemo,
  consenso: timelinePattern('consenso', 'Consenso', ['propose', 'vote', 'commit'], { decided: true }),
  gossip: timelinePattern('gossip', 'Gossip', ['infect A', 'infect B', 'steady'], { infected: 4 }),
  'snapshot-distribuido': timelinePattern('snapshot-distribuido', 'Snapshot Distribuido', ['marker', 'record', 'assemble'], { ok: true }),
};
