import type { VisualStep } from '../../types/demo';

export interface StringInput {
  text: string;
  pattern?: string;
}

export function stringStep(
  primary: string,
  secondary: string | undefined,
  pointers: Record<string, number>,
  highlights: number[],
  captionKey: string,
  captionParams: Record<string, string | number> = {},
): VisualStep {
  return {
    captionKey,
    captionParams,
    scene: {
      kind: 'string',
      primary,
      secondary,
      pointers,
      highlights,
    },
  };
}

export function kmpSteps(text: string, pattern: string): VisualStep[] {
  if (!pattern) return [stringStep(text, pattern, {}, [], 'steps.generic.start', { name: 'KMP' })];
  const steps: VisualStep[] = [stringStep(text, pattern, {}, [], 'steps.batch.kmpStart', { n: text.length, m: pattern.length })];
  const lps = new Array(pattern.length).fill(0);
  for (let i = 1, len = 0; i < pattern.length; ) {
    if (pattern[i] === pattern[len]) lps[i++] = ++len;
    else if (len) len = lps[len - 1];
    else lps[i++] = 0;
  }
  for (let i = 0, j = 0; i < text.length; ) {
    steps.push(stringStep(text, pattern, { i, j }, [i, j], 'steps.batch.kmpCompare', { i, j, tc: text[i], pc: pattern[j] }));
    if (text[i] === pattern[j]) {
      i++;
      j++;
      if (j === pattern.length) {
        steps.push(stringStep(text, pattern, { i, j: j - 1 }, [i - j, i - 1], 'steps.batch.kmpMatch', { index: i - j }));
        j = lps[j - 1];
      }
    } else if (j) j = lps[j - 1];
    else i++;
  }
  steps.push(stringStep(text, pattern, {}, [], 'steps.generic.done', { name: 'KMP', summary: 'scan complete' }));
  return steps;
}

export function levenshteinSteps(a: string, b: string): VisualStep[] {
  const steps: VisualStep[] = [stringStep(a, b, {}, [], 'steps.batch.editStart', { n: a.length, m: b.length })];
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      steps.push(stringStep(a, b, { i: i - 1, j: j - 1 }, [i - 1, j - 1], 'steps.batch.editCell', { i, j, cost: dp[i][j] }));
    }
  }
  steps.push(stringStep(a, b, {}, [], 'steps.batch.editDone', { distance: dp[a.length][b.length] }));
  return steps;
}

export function naiveSearchSteps(text: string, pattern: string, name: string): VisualStep[] {
  const steps: VisualStep[] = [stringStep(text, pattern, {}, [], 'steps.generic.start', { name })];
  if (!pattern) return steps;
  for (let i = 0; i <= text.length - pattern.length; i++) {
    steps.push(stringStep(text, pattern, { i, j: 0 }, [i], 'steps.batch.stringWindow', { index: i, name }));
    let match = true;
    for (let j = 0; j < pattern.length; j++) {
      if (text[i + j] !== pattern[j]) {
        match = false;
        break;
      }
    }
    if (match) steps.push(stringStep(text, pattern, { i }, Array.from({ length: pattern.length }, (_, k) => i + k), 'steps.batch.stringMatch', { index: i }));
  }
  steps.push(stringStep(text, pattern, {}, [], 'steps.generic.done', { name, summary: 'done' }));
  return steps;
}
