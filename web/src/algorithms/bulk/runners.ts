import type { CatalogEntry, DemoInput } from '../../types/demo';
import type { GraphInput, MatrixInput, StringInput, TreeInput } from './sceneDefaults';

function sortValues(values: number[]): number[] {
  return [...values].sort((a, b) => a - b);
}

function radixSort(values: number[]): number[] {
  const arr = [...values];
  if (arr.length === 0) return arr;
  const max = Math.max(...arr);
  let exp = 1;
  const counting = (exp: number) => {
    const output = new Array(arr.length).fill(0);
    const count = new Array(10).fill(0);
    for (const v of arr) count[Math.floor(v / exp) % 10]++;
    for (let i = 1; i < 10; i++) count[i] += count[i - 1];
    for (let i = arr.length - 1; i >= 0; i--) {
      const idx = Math.floor(arr[i] / exp) % 10;
      output[--count[idx]] = arr[i];
    }
    for (let i = 0; i < arr.length; i++) arr[i] = output[i];
  };
  while (Math.floor(max / exp) > 0) {
    counting(exp);
    exp *= 10;
  }
  return arr;
}

function bucketSort(values: number[]): number[] {
  if (values.length === 0) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const buckets = 5;
  const b: number[][] = Array.from({ length: buckets }, () => []);
  for (const v of values) {
    const idx = max === min ? 0 : Math.min(buckets - 1, Math.floor(((v - min) / (max - min)) * buckets));
    b[idx].push(v);
  }
  return b.flatMap((x) => x.sort((a, c) => a - c));
}

function selectionSort(values: number[]): number[] {
  const arr = [...values];
  for (let i = 0; i < arr.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j++) if (arr[j] < arr[minIdx]) minIdx = j;
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  return arr;
}

function floydWarshall(matrix: number[][]): number[][] {
  if (!matrix?.length) return [[0]];
  const n = matrix.length;
  const dist = matrix.map((r) => [...r]);
  for (let k = 0; k < n; k++)
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        if (dist[i][k] + dist[k][j] < dist[i][j]) dist[i][j] = dist[i][k] + dist[k][j];
  return dist;
}

function kmpMatches(text: string, pattern: string): number[] {
  if (!pattern) return [];
  const lps = new Array(pattern.length).fill(0);
  for (let i = 1, len = 0; i < pattern.length; ) {
    if (pattern[i] === pattern[len]) lps[i++] = ++len;
    else if (len) len = lps[len - 1];
    else lps[i++] = 0;
  }
  const matches: number[] = [];
  for (let i = 0, j = 0; i < text.length; ) {
    if (text[i] === pattern[j]) {
      i++;
      j++;
      if (j === pattern.length) {
        matches.push(i - j);
        j = lps[j - 1];
      }
    } else if (j) j = lps[j - 1];
    else i++;
  }
  return matches;
}

function levenshtein(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[a.length][b.length];
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

function gcd(a: number, b: number): number {
  while (b) [a, b] = [b, a % b];
  return a;
}

function runGraphOrder(g: GraphInput): string[] {
  const adj = new Map<string, string[]>();
  for (const n of g.nodes) adj.set(n, []);
  for (const e of g.edges) {
    adj.get(e.from)?.push(e.to);
    if (!e.directed) adj.get(e.to)?.push(e.from);
  }
  const visited: string[] = [];
  const seen = new Set<string>();
  const q = [g.start];
  while (q.length) {
    const u = q.shift()!;
    if (seen.has(u)) continue;
    seen.add(u);
    visited.push(u);
    for (const v of adj.get(u) ?? []) if (!seen.has(v)) q.push(v);
  }
  for (const n of g.nodes) if (!seen.has(n)) visited.push(n);
  return visited;
}

const CUSTOM_RUNNERS: Record<string, (input: DemoInput) => unknown> = {
  'radix-sort': (i) => ({ values: radixSort((i as unknown as { values: number[] }).values) }),
  'bucket-sort': (i) => ({ values: bucketSort((i as unknown as { values: number[] }).values) }),
  'selection-algorithm': (i) => ({ values: selectionSort((i as unknown as { values: number[] }).values) }),
  'top-k-con-heap': (i) => {
    const v = [...(i as unknown as { values: number[] }).values].sort((a, b) => b - a);
    const k = Math.min(3, v.length);
    return { topK: v.slice(0, k) };
  },
  'huffman-coding': (i) => ({ totalBits: huffmanWeight((i as unknown as { values: number[] }).values) }),
  kmp: (i) => {
    const s = i as unknown as StringInput;
    return { matches: kmpMatches(s.text, s.pattern ?? '') };
  },
  'levenshtein-distance': (i) => {
    const s = i as unknown as StringInput;
    return { distance: levenshtein(s.text, s.pattern ?? '') };
  },
  rsa: () => ({ coprime: gcd(17, 11) }),
  'k-means': (i) => ({ clusters: Math.min(3, (i as unknown as { values: number[] }).values.length) }),
};

export function runAlgorithm(entry: CatalogEntry, input: DemoInput): unknown {
  if (CUSTOM_RUNNERS[entry.id]) return CUSTOM_RUNNERS[entry.id](input);

  switch (entry.visualFamily) {
    case 'array-bars': {
      const values = (input as unknown as { values: number[] }).values;
      if (entry.id.includes('search') || entry.id.includes('busqueda')) {
        const target = values[Math.floor(values.length / 2)] ?? 0;
        return { index: values.indexOf(target), target };
      }
      return { values: sortValues(values) };
    }
    case 'graph-view':
    case 'flow-network': {
      const g = input as unknown as GraphInput;
      return { order: runGraphOrder(g), nodeCount: g.nodes.length };
    }
    case 'tree-view': {
      const keys = [...(input as unknown as TreeInput).keys].sort((a, b) => a - b);
      return { keys };
    }
    case 'matrix-grid': {
      const values = (input as unknown as MatrixInput).values;
      if (entry.id.includes('floyd')) return { cells: floydWarshall(values) };
      return { cells: values, sum: values.flat().reduce((a, b) => a + b, 0) };
    }
    case 'string-scene': {
      const s = input as unknown as StringInput;
      if (entry.id.includes('levenshtein') || entry.id.includes('edit'))
        return { distance: levenshtein(s.text, s.pattern ?? 'ABC') };
      return { matches: kmpMatches(s.text, s.pattern ?? s.text.slice(0, 2)) };
    }
    case 'signal-scene': {
      const data = (input as { data?: number[] }).data ?? [1, 0, 1];
      return { ones: data.filter((x) => x === 1).length, length: data.length };
    }
    case 'system-sim': {
      const labels = (input as { labels?: string[] }).labels ?? ['P1', 'P2'];
      return { schedule: labels, slots: labels.length * 2 };
    }
    case 'numeric-scene': {
      const values = (input as { values?: number[] }).values ?? [1, 2, 3];
      return { sum: values.reduce((a, b) => a + b, 0), mean: values.reduce((a, b) => a + b, 0) / values.length };
    }
    case 'state-machine':
    default:
      return { ok: true, algorithm: entry.id };
  }
}

export function defaultTestCases(entry: CatalogEntry, input: DemoInput) {
  const expected = runAlgorithm(entry, input);
  const reversed =
    'values' in input && Array.isArray((input as { values: number[] }).values)
      ? { values: [...(input as { values: number[] }).values].reverse() }
      : input;
  const sorted =
    'values' in input && Array.isArray((input as { values: number[] }).values)
      ? { values: [...(input as { values: number[] }).values].sort((a, b) => a - b) }
      : input;
  return [
    { name: 'default', input, expected },
    { name: 'variant-a', input: reversed as DemoInput, expected: runAlgorithm(entry, reversed as DemoInput) },
    { name: 'variant-b', input: sorted as DemoInput, expected: runAlgorithm(entry, sorted as DemoInput) },
  ];
}
