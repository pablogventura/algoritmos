import type { AlgorithmDemo } from '../../types/demo';
import { buildTimelineScene } from '../bulk/sceneDefaults';
import { matrixPhaseSteps } from '../shared/matrixDemoHelpers';
import { timelinePhaseSteps } from '../shared/timelineDemoHelpers';
import { treeStep } from '../shared/treeDemoHelpers';

function huffmanWeight(freqs: number[]): number {
  if (freqs.length === 0) return 0;
  const heap = [...freqs].sort((a, b) => a - b);
  let total = 0;
  while (heap.length > 1) {
    const a = heap.shift()!;
    const b = heap.shift()!;
    const sum = a + b;
    total += sum;
    heap.push(sum);
    heap.sort((x, y) => x - y);
  }
  return total;
}

function modPow(base: number, exp: number, mod: number): number {
  let result = 1;
  base %= mod;
  while (exp > 0) {
    if (exp % 2) result = (result * base) % mod;
    exp = Math.floor(exp / 2);
    base = (base * base) % mod;
  }
  return result;
}

function millerRabin(n: number, rounds = 3): boolean {
  if (n < 2) return false;
  if (n === 2 || n === 3) return true;
  if (n % 2 === 0) return false;
  let d = n - 1;
  let s = 0;
  while (d % 2 === 0) {
    d /= 2;
    s++;
  }
  const witnesses = [2, 3, 5].slice(0, rounds);
  for (const a of witnesses) {
    if (a % n === 0) continue;
    let x = modPow(a, d, n);
    if (x === 1 || x === n - 1) continue;
    let composite = true;
    for (let r = 1; r < s; r++) {
      x = modPow(x, 2, n);
      if (x === n - 1) {
        composite = false;
        break;
      }
    }
    if (composite) return false;
  }
  return true;
}

function viterbiPath(obs: number[], transitions: number[][], emissions: number[][]): { path: number[]; score: number } {
  const states = transitions.length;
  const tLen = obs.length;
  const dp = Array.from({ length: tLen }, () => new Array(states).fill(-Infinity));
  const back = Array.from({ length: tLen }, () => new Array(states).fill(0));
  for (let s = 0; s < states; s++) dp[0][s] = Math.log(emissions[s][obs[0]] ?? 1e-9);
  for (let t = 1; t < tLen; t++) {
    for (let s = 0; s < states; s++) {
      for (let prev = 0; prev < states; prev++) {
        const score = dp[t - 1][prev] + Math.log(transitions[prev][s] ?? 1e-9) + Math.log(emissions[s][obs[t]] ?? 1e-9);
        if (score > dp[t][s]) {
          dp[t][s] = score;
          back[t][s] = prev;
        }
      }
    }
  }
  let bestState = 0;
  for (let s = 1; s < states; s++) if (dp[tLen - 1][s] > dp[tLen - 1][bestState]) bestState = s;
  const path = new Array(tLen).fill(0);
  path[tLen - 1] = bestState;
  for (let t = tLen - 2; t >= 0; t--) path[t] = back[t + 1][path[t + 1]];
  return { path, score: dp[tLen - 1][bestState] };
}

const DEFAULT_FREQS = [5, 9, 12, 13, 16, 45];
const VITERBI_DEFAULT = {
  observations: [0, 1, 0],
  transitions: [
    [0.7, 0.3],
    [0.4, 0.6],
  ],
  emissions: [
    [0.9, 0.1],
    [0.2, 0.8],
  ],
};

export const huffmanCodingDemo: AlgorithmDemo<{ values: number[] }, { totalBits: number }> = {
  id: 'huffman-coding',
  visualFamily: 'signal-scene',
  metadata: { timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)' },
  defaultInput: { values: DEFAULT_FREQS },
  buildInitialScene: (input) => buildTimelineScene({ labels: input.values.map(String), values: input.values }, 0, 'signal-scene'),
  generateSteps(input) {
    const freqs = [...input.values].sort((a, b) => a - b);
    const steps = [
      treeStep([], [], 'steps.keyAlgos.huffmanStart', { n: freqs.length }),
    ];
    const heap = [...freqs];
    let merge = 0;
    while (heap.length > 1) {
      const a = heap.shift()!;
      const b = heap.shift()!;
      const sum = a + b;
      heap.push(sum);
      heap.sort((x, y) => x - y);
      merge++;
      steps.push(
        treeStep(
          [
            { id: `m${merge}`, label: String(sum), x: 80 + merge * 40, y: 40 + merge * 30, state: 'active' },
          ],
          [`m${merge}`],
          'steps.keyAlgos.huffmanMerge',
          { a, b, sum, merge },
        ),
      );
    }
    steps.push(treeStep([], [], 'steps.keyAlgos.huffmanDone', { totalBits: huffmanWeight(input.values) }));
    return steps;
  },
  run: (input) => ({ totalBits: huffmanWeight(input.values) }),
  testCases: [
    { name: 'default', input: { values: DEFAULT_FREQS }, expected: { totalBits: huffmanWeight(DEFAULT_FREQS) } },
    { name: 'pair', input: { values: [1, 2] }, expected: { totalBits: huffmanWeight([1, 2]) } },
    { name: 'equal', input: { values: [4, 4, 4] }, expected: { totalBits: huffmanWeight([4, 4, 4]) } },
  ],
};

export const millerRabinDemo: AlgorithmDemo<{ values: number[] }, { probable: boolean; rounds: number }> = {
  id: 'miller-rabin',
  visualFamily: 'signal-scene',
  metadata: { timeComplexity: 'O(k log³ n)', spaceComplexity: 'O(1)' },
  defaultInput: { values: [561, 2, 3, 5] },
  buildInitialScene: (input) =>
    buildTimelineScene({ labels: ['witness 2', 'witness 3', 'witness 5'], values: input.values }, 0, 'signal-scene'),
  generateSteps(input) {
    const n = input.values[0] ?? 561;
    return timelinePhaseSteps(
      input,
      [`n=${n}`, 'write n-1 as 2^s·d', 'test witness 2', 'test witness 3', 'probably prime'],
      'steps.keyAlgos.millerRabin',
      'Miller-Rabin',
      millerRabin(n) ? 'probable' : 'composite',
      'signal-scene',
    );
  },
  run: (input) => {
    const n = input.values[0] ?? 561;
    const rounds = Math.min(3, Math.max(1, input.values.length - 1));
    return { probable: millerRabin(n, rounds), rounds };
  },
  testCases: [
    { name: 'carmichael', input: { values: [561, 2, 3, 5] }, expected: { probable: false, rounds: 3 } },
    { name: 'prime', input: { values: [997, 2, 3] }, expected: { probable: true, rounds: 2 } },
    { name: 'small', input: { values: [17, 2] }, expected: { probable: true, rounds: 1 } },
  ],
};

export const viterbiDemo: AlgorithmDemo<
  { observations: number[]; transitions: number[][]; emissions: number[][] },
  { path: number[]; score: number }
> = {
  id: 'viterbi',
  visualFamily: 'matrix-grid',
  metadata: { timeComplexity: 'O(T·S²)', spaceComplexity: 'O(T·S)' },
  defaultInput: VITERBI_DEFAULT,
  buildInitialScene: (input) => ({
    kind: 'matrix',
    cells: input.transitions.map((row, i) => [...row, input.emissions[i][input.observations[0] ?? 0] ?? 0]),
    highlights: {},
  }),
  generateSteps(input) {
    const matrix = input.transitions.map((row, i) => [...row, input.emissions[i][input.observations[0] ?? 0] ?? 0]);
    return matrixPhaseSteps(matrix, 'Viterbi', ['init t=0', 't=1', 't=2', 'backtrack', 'best path']);
  },
  run: (input) => viterbiPath(input.observations, input.transitions, input.emissions),
  testCases: [
    {
      name: 'default',
      input: VITERBI_DEFAULT,
      expected: viterbiPath(VITERBI_DEFAULT.observations, VITERBI_DEFAULT.transitions, VITERBI_DEFAULT.emissions),
    },
    {
      name: 'single',
      input: { observations: [1], transitions: [[0.5, 0.5], [0.5, 0.5]], emissions: [[0.1, 0.9], [0.8, 0.2]] },
      expected: viterbiPath([1], [[0.5, 0.5], [0.5, 0.5]], [[0.1, 0.9], [0.8, 0.2]]),
    },
    {
      name: 'repeat',
      input: { observations: [0, 0], transitions: [[0.9, 0.1], [0.2, 0.8]], emissions: [[0.8, 0.2], [0.3, 0.7]] },
      expected: viterbiPath([0, 0], [[0.9, 0.1], [0.2, 0.8]], [[0.8, 0.2], [0.3, 0.7]]),
    },
  ],
};

export const KEY_ALGO_DEMOS = {
  'huffman-coding': huffmanCodingDemo,
  'miller-rabin': millerRabinDemo,
  viterbi: viterbiDemo,
};
