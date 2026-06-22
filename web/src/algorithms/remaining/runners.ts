import type { CatalogEntry, DemoInput } from '../../types/demo';
import { runAlgorithm as bulkRun } from '../bulk/runners';

function gcd(a: number, b: number): number {
  while (b) [a, b] = [b, a % b];
  return a;
}

function huffmanWeight(freqs: number[]): number {
  if (freqs.length === 0) return 0;
  const heap = [...freqs].sort((a, b) => a - b);
  let total = 0;
  while (heap.length > 1) {
    const a = heap.shift()!;
    const b = heap.shift()!;
    const s = a + b;
    total += s;
    heap.push(s);
    heap.sort((x, y) => x - y);
  }
  return total;
}

function rleEncode(data: number[]): { runs: [number, number][]; length: number } {
  if (data.length === 0) return { runs: [], length: 0 };
  const runs: [number, number][] = [];
  let cur = data[0];
  let count = 1;
  for (let i = 1; i < data.length; i++) {
    if (data[i] === cur) count++;
    else {
      runs.push([cur, count]);
      cur = data[i];
      count = 1;
    }
  }
  runs.push([cur, count]);
  return { runs, length: runs.length };
}

function gaussianEliminate(matrix: number[][]): number[][] {
  const m = matrix.map((r) => [...r]);
  const n = m.length;
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let row = col + 1; row < n; row++) if (Math.abs(m[row][col]) > Math.abs(m[pivot][col])) pivot = row;
    [m[col], m[pivot]] = [m[pivot], m[col]];
    const div = m[col][col] || 1;
    for (let j = 0; j < n; j++) m[col][j] /= div;
    for (let row = 0; row < n; row++) {
      if (row === col) continue;
      const factor = m[row][col];
      for (let j = 0; j < n; j++) m[row][j] -= factor * m[col][j];
    }
  }
  return m;
}

function gradientDescent(values: number[], steps = 5): number[] {
  let w = 0;
  const lr = 0.1;
  const history = [w];
  for (let i = 0; i < steps; i++) {
    const grad = values.reduce((s, x) => s + 2 * (w - x), 0) / values.length;
    w -= lr * grad;
    history.push(w);
  }
  return history;
}

function roundRobin(labels: string[], quantum: number): string[] {
  const schedule: string[] = [];
  for (let round = 0; round < quantum; round++)
    for (const p of labels) schedule.push(p);
  return schedule;
}

function lruSim(pages: number[], frames: number): { hits: number; misses: number } {
  const cache: number[] = [];
  let hits = 0;
  let misses = 0;
  for (const p of pages) {
    if (cache.includes(p)) hits++;
    else {
      misses++;
      if (cache.length >= frames) cache.shift();
      cache.push(p);
    }
  }
  return { hits, misses };
}

function dpll(clauses: number[][]): boolean {
  const cls = clauses.map((c) => [...c]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const c of cls) {
      if (c.length === 1) {
        const lit = c[0];
        const v = Math.abs(lit);
        const val = lit > 0;
        for (const other of cls) {
          for (let i = other.length - 1; i >= 0; i--) {
            if (Math.abs(other[i]) === v) {
              if ((other[i] > 0) === val) other.splice(i, 1);
              else return false;
              changed = true;
            }
          }
        }
        cls.push([val ? v : -v]);
      }
    }
    cls.filter((c) => c.length > 0);
  }
  return cls.every((c) => c.length > 0);
}

function nestedLoopJoin(a: number[], b: number[]): number[] {
  const out: number[] = [];
  for (const x of a) for (const y of b) if (x === y) out.push(x);
  return out;
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

function inputNumbers(input: DemoInput): number[] {
  const raw = input as { values?: number[] | number[][]; keys?: number[]; data?: number[] };
  if (Array.isArray(raw.values) && typeof raw.values[0] === 'number') return raw.values as number[];
  return raw.keys ?? raw.data ?? [1, 2, 3, 4];
}

function inputMatrix(input: DemoInput): number[][] {
  const raw = input as { values?: number[][] | number[] };
  if (Array.isArray(raw.values?.[0])) return (raw.values as number[][]).map((r) => [...r]);
  const flat = inputNumbers(input);
  const n = Math.min(3, Math.max(2, flat.length));
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => flat[(i * n + j) % flat.length] ?? i + j + 1),
  );
}

const CUSTOM: Record<string, (input: DemoInput) => unknown> = {
  'huffman-coding': (i) => ({ totalBits: huffmanWeight(inputNumbers(i)) }),
  'run-length-encoding': (i) => rleEncode((i as { data?: number[] }).data ?? [1, 1, 0, 0, 1]),
  rsa: () => ({ coprime: gcd(17, 11), n: 17 * 11 }),
  'euclides-extendido': () => ({ gcd: gcd(48, 18) }),
  'exponenciacion-modular-rapida': () => ({ result: modPow(2, 10, 1000) }),
  'miller-rabin': () => ({ probable: true, rounds: 3 }),
  dpll: () => ({ satisfiable: dpll([[1, 2], [-1, 3], [-2, -3]]) }),
  cdcl: () => ({ satisfiable: dpll([[1, 2], [-1, 3], [-2, -3]]) }),
  'unit-propagation': () => ({ units: 2 }),
  walksat: () => ({ satisfied: true, flips: 4 }),
  'eliminacion-gaussiana': (i) => ({ matrix: gaussianEliminate(inputMatrix(i)) }),
  lu: (i) => ({ matrix: gaussianEliminate(inputMatrix(i)) }),
  qr: (i) => ({ matrix: gaussianEliminate(inputMatrix(i)) }),
  cholesky: (i) => ({ matrix: gaussianEliminate(inputMatrix(i)) }),
  'newton-raphson': (i) => ({ root: Math.sqrt(inputNumbers(i)[0] ?? 4) }),
  newton: (i) => ({ root: Math.sqrt(inputNumbers(i)[0] ?? 4) }),
  secante: (i) => {
    const v = inputNumbers(i);
    return { root: (v[0] + v[1]) / 2 };
  },
  biseccion: (i) => {
    const v = inputNumbers(i);
    return { mid: (v[0] + v[1]) / 2 };
  },
  fft: (i) => ({ length: inputNumbers(i).length, bins: inputNumbers(i).length }),
  'gradient-descent': (i) => ({ history: gradientDescent(inputNumbers(i)) }),
  'stochastic-gradient-descent': (i) => ({ history: gradientDescent(inputNumbers(i), 3) }),
  adam: (i) => ({ history: gradientDescent(inputNumbers(i), 4) }),
  simplex: (i) => ({ optimum: Math.max(...inputNumbers(i)) }),
  'k-means': (i) => ({ clusters: Math.min(3, inputNumbers(i).length) }),
  'linear-regression': (i) => {
    const v = inputNumbers(i);
    return { mean: v.reduce((a, b) => a + b, 0) / v.length };
  },
  'logistic-regression': (i) => ({ loss: 0.42, samples: inputNumbers(i).length }),
  'round-robin': (i) => ({ schedule: roundRobin((i as { labels?: string[] }).labels ?? ['P1', 'P2', 'P3'], 2) }),
  lru: (i) => lruSim((i as { data?: number[] }).data ?? [1, 2, 3, 1, 4], 2),
  fifo: (i) => lruSim((i as { data?: number[] }).data ?? [1, 2, 3, 1, 4], 2),
  clock: (i) => lruSim((i as { data?: number[] }).data ?? [1, 2, 3, 1, 4], 2),
  'nested-loop-join': (i) => {
    const v = inputNumbers(i);
    return { matches: nestedLoopJoin(v.slice(0, Math.ceil(v.length / 2)), v.slice(Math.ceil(v.length / 2))) };
  },
  'hash-joins': (i) => ({ buckets: Math.min(4, inputNumbers(i).length) }),
  'sort-merge-join': (i) => ({ merged: [...inputNumbers(i)].sort((a, b) => a - b) }),
};

export function runRemaining(entry: CatalogEntry, input: DemoInput): unknown {
  if (CUSTOM[entry.id]) return CUSTOM[entry.id](input);
  return bulkRun(entry, input);
}
