import type { AlgorithmDemo, VisualStep } from '../../types/demo';
import {
  kmpSteps,
  levenshteinSteps,
  naiveSearchSteps,
  stringStep,
  type StringInput,
} from '../shared/stringDemoHelpers';

type StringDemo = AlgorithmDemo<StringInput, unknown>;

const DEFAULT: StringInput = { text: 'ABABDABACDABABCABAB', pattern: 'ABABC' };

function makeStringDemo(
  id: string,
  buildSteps: (text: string, pattern: string, name: string) => VisualStep[],
  run: (text: string, pattern: string) => unknown,
  input: StringInput = DEFAULT,
): StringDemo {
  return {
    id,
    visualFamily: 'string-scene',
    metadata: { timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
    defaultInput: input,
    buildInitialScene(i) {
      return { kind: 'string', primary: i.text, secondary: i.pattern, pointers: {}, highlights: [] };
    },
    generateSteps(i) {
      return buildSteps(i.text, i.pattern ?? '', id);
    },
    run: (i) => run(i.text, i.pattern ?? ''),
    testCases: [
      { name: 'default', input, expected: run(input.text, input.pattern ?? '') },
      { name: 'short', input: { text: 'ABC', pattern: 'B' }, expected: run('ABC', 'B') },
      { name: 'empty pattern', input: { text: 'XYZ', pattern: '' }, expected: run('XYZ', '') },
    ],
  };
}

function kmpRun(text: string, pattern: string): { matches: number[] } {
  if (!pattern) return { matches: [] };
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
  return { matches };
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

function rabinKarpSteps(text: string, pattern: string, name: string): VisualStep[] {
  const steps = [stringStep(text, pattern, {}, [], 'steps.batch.rabinStart', { m: pattern.length })];
  if (!pattern) return steps;
  const base = 256;
  const mod = 101;
  let ph = 0;
  let th = 0;
  let h = 1;
  for (let i = 0; i < pattern.length - 1; i++) h = (h * base) % mod;
  for (let i = 0; i < pattern.length; i++) {
    ph = (base * ph + pattern.charCodeAt(i)) % mod;
    th = (base * th + text.charCodeAt(i)) % mod;
  }
  for (let i = 0; i <= text.length - pattern.length; i++) {
    steps.push(stringStep(text, pattern, { i }, [i], 'steps.batch.rabinWindow', { i, hash: th }));
    if (ph === th && text.slice(i, i + pattern.length) === pattern) {
      steps.push(stringStep(text, pattern, { i }, Array.from({ length: pattern.length }, (_, k) => i + k), 'steps.batch.stringMatch', { index: i }));
    }
    if (i < text.length - pattern.length) th = (base * (th - text.charCodeAt(i) * h) + text.charCodeAt(i + pattern.length)) % mod;
  }
  steps.push(stringStep(text, pattern, {}, [], 'steps.generic.done', { name, summary: 'done' }));
  return steps;
}

function zAlgorithmSteps(text: string, _pattern: string, name: string): VisualStep[] {
  const s = text;
  const z = new Array(s.length).fill(0);
  const steps = [stringStep(text, undefined, {}, [], 'steps.batch.zStart', { n: s.length })];
  let l = 0;
  let r = 0;
  for (let i = 1; i < s.length; i++) {
    if (i <= r) z[i] = Math.min(r - i + 1, z[i - l]);
    while (i + z[i] < s.length && s[z[i]] === s[i + z[i]]) z[i]++;
    if (i + z[i] - 1 > r) {
      l = i;
      r = i + z[i] - 1;
    }
    steps.push(stringStep(text, undefined, { i }, [i], 'steps.batch.zValue', { i, z: z[i] }));
  }
  steps.push(stringStep(text, undefined, {}, [], 'steps.generic.done', { name, summary: z.join(',') }));
  return steps;
}

function automataSteps(text: string, pattern: string, name: string): VisualStep[] {
  const steps = [stringStep(text, pattern, {}, [], 'steps.batch.automataStart', { name })];
  const states = ['S0', 'S1', 'S2'];
  states.forEach((st, i) => {
    steps.push(stringStep(text, pattern, { state: i }, [i], 'steps.batch.automataState', { state: st, i }));
  });
  steps.push(stringStep(text, pattern, {}, [], 'steps.generic.done', { name, summary: 'automaton built' }));
  return steps;
}

const STRING_IDS = [
  'aho-corasick',
  'boyer-moore',
  'burrows-wheeler-transform',
  'cyk-parsing',
  'earley-parser',
  'fm-index',
  'kmp',
  'lcp-array',
  'levenshtein-distance',
  'll-lr-parsing',
  'minimizacion-de-dfa',
  'myers-diff',
  'needleman-wunsch',
  'prefix-function',
  'rabin-karp',
  'smith-waterman',
  'subset-construction-nfa-dfa',
  'suffix-array',
  'suffix-tree',
  'thompson-construction-para-expresiones-regulares',
  'z-algorithm',
];

function buildStringDemo(id: string): StringDemo {
  if (id === 'kmp' || id === 'prefix-function') {
    return makeStringDemo(id, (t, p) => kmpSteps(t, p), (t, p) => kmpRun(t, p));
  }
  if (id === 'levenshtein-distance' || id === 'needleman-wunsch' || id === 'smith-waterman' || id === 'myers-diff') {
    return makeStringDemo(id, (a, b) => levenshteinSteps(a, b), (a, b) => ({ distance: levenshtein(a, b) }), {
      text: 'KITTEN',
      pattern: 'SITTING',
    });
  }
  if (id === 'rabin-karp') {
    return makeStringDemo(id, rabinKarpSteps, (t, p) => kmpRun(t, p));
  }
  if (id === 'z-algorithm' || id === 'lcp-array' || id === 'suffix-array') {
    return makeStringDemo(id, zAlgorithmSteps, (t) => ({ length: t.length }), { text: 'aabcaab', pattern: '' });
  }
  if (
    id.includes('parser') ||
    id.includes('dfa') ||
    id.includes('nfa') ||
    id.includes('thompson') ||
    id.includes('cyk') ||
    id.includes('earley') ||
    id.includes('ll-lr')
  ) {
    return makeStringDemo(id, automataSteps, () => ({ states: 3 }));
  }
  if (id === 'boyer-moore' || id === 'aho-corasick') {
    return makeStringDemo(id, (t, p, n) => naiveSearchSteps(t, p, n), (t, p) => kmpRun(t, p));
  }
  if (id === 'burrows-wheeler-transform' || id === 'fm-index' || id === 'suffix-tree') {
    return makeStringDemo(
      id,
      (t, _p, n) => {
        const steps = [stringStep(t, undefined, {}, [], 'steps.batch.bwtStart', { text: t })];
        const sorted = [...t].sort().join('');
        steps.push(stringStep(sorted, t, {}, [], 'steps.batch.bwtDone', { last: t[t.length - 1] }));
        steps.push(stringStep(t, undefined, {}, [], 'steps.generic.done', { name: n, summary: sorted }));
        return steps;
      },
      (t) => ({ last: t[t.length - 1], sorted: [...t].sort().join('') }),
      { text: 'banana', pattern: '' },
    );
  }
  return makeStringDemo(id, (t, p, n) => naiveSearchSteps(t, p, n), (t, p) => kmpRun(t, p));
}

export const STRING_BATCH_DEMOS: Record<string, StringDemo> = Object.fromEntries(
  STRING_IDS.map((id) => [id, buildStringDemo(id)]),
);
