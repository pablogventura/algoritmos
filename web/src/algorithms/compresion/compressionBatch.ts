import type { AlgorithmDemo, VisualStep } from '../../types/demo';
import { stringStep, type StringInput } from '../shared/stringDemoHelpers';

function compressDemo(
  id: string,
  _name: string,
  run: (text: string) => unknown,
  buildSteps: (text: string) => VisualStep[],
): AlgorithmDemo<StringInput, unknown> {
  const defaultInput = { text: 'ABABABA' };
  return {
    id,
    visualFamily: 'string-scene',
    metadata: { timeComplexity: 'O(n)', spaceComplexity: 'O(n)' },
    defaultInput,
    buildInitialScene: (input) => ({
      kind: 'string',
      primary: input.text,
      pointers: {},
      highlights: [],
    }),
    generateSteps: (input) => buildSteps(input.text),
    run: (input) => run(input.text),
    testCases: [{ name: 'default', input: defaultInput, expected: run(defaultInput.text) }],
  };
}

function lz77Run(text: string) {
  const tokens: string[] = [];
  let i = 0;
  while (i < text.length) {
    let bestLen = 0;
    let bestDist = 0;
    for (let j = Math.max(0, i - 8); j < i; j++) {
      let len = 0;
      while (i + len < text.length && text[j + len] === text[i + len]) len++;
      if (len > bestLen) {
        bestLen = len;
        bestDist = i - j;
      }
    }
    if (bestLen > 0) {
      tokens.push(`(${bestDist},${bestLen})`);
      i += bestLen;
    } else {
      tokens.push(text[i]);
      i++;
    }
  }
  return { tokens: tokens.join(' ') };
}

const lz77Demo = compressDemo('lz77', 'LZ77', lz77Run, (text) => {
  const steps: VisualStep[] = [stringStep(text, undefined, {}, [], 'steps.compression.lz77Start', { n: text.length })];
  let i = 0;
  while (i < text.length) {
    steps.push(stringStep(text, undefined, { i }, [i], 'steps.compression.lz77Window', { i, char: text[i] }));
    i++;
    if (i >= text.length) break;
  }
  steps.push(stringStep(text, undefined, {}, [], 'steps.compression.lz77Done', { summary: lz77Run(text).tokens }));
  return steps;
});

function lz78Run(text: string) {
  const dict: string[] = [''];
  const codes: number[] = [];
  let w = '';
  for (const c of text) {
    const wc = w + c;
    if (dict.includes(wc)) w = wc;
    else {
      codes.push(dict.indexOf(w));
      dict.push(wc);
      w = c;
    }
  }
  if (w) codes.push(dict.indexOf(w));
  return { codes: codes.join(',') };
}

const lz78Demo = compressDemo('lz78', 'LZ78', lz78Run, (text) => {
  const steps: VisualStep[] = [stringStep(text, undefined, {}, [], 'steps.compression.lz78Start', {})];
  for (let i = 0; i < text.length; i++)
    steps.push(stringStep(text, undefined, { i }, [i], 'steps.compression.lz78Step', { i, char: text[i] }));
  steps.push(stringStep(text, undefined, {}, [], 'steps.compression.lz78Done', { summary: lz78Run(text).codes }));
  return steps;
});

function lzwRun(text: string) {
  const dict = new Map<string, number>();
  for (let i = 0; i < 256; i++) dict.set(String.fromCharCode(i), i);
  let next = 256;
  const codes: number[] = [];
  let w = '';
  for (const c of text) {
    const wc = w + c;
    if (dict.has(wc)) w = wc;
    else {
      codes.push(dict.get(w)!);
      dict.set(wc, next++);
      w = c;
    }
  }
  if (w) codes.push(dict.get(w)!);
  return { codes: codes.join(',') };
}

const lzwDemo = compressDemo('lzw', 'LZW', lzwRun, (text) => {
  const steps: VisualStep[] = [stringStep(text, undefined, {}, [], 'steps.compression.lzwStart', {})];
  for (let i = 0; i < text.length; i++)
    steps.push(stringStep(text, undefined, { i }, [i], 'steps.compression.lzwStep', { i, char: text[i] }));
  steps.push(stringStep(text, undefined, {}, [], 'steps.compression.lzwDone', { summary: lzwRun(text).codes }));
  return steps;
});

export const COMPRESSION_EXTRA_DEMOS = {
  lz77: lz77Demo,
  lz78: lz78Demo,
  lzw: lzwDemo,
};
