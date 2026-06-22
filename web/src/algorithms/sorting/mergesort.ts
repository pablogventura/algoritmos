import type { AlgorithmDemo, VisualStep, HighlightKind } from '../../types/demo';

export interface SortInput {
  values: number[];
}

export interface SortOutput {
  values: number[];
}

function arrayStep(
  values: number[],
  highlights: Partial<Record<number, HighlightKind>>,
  pointers: Record<string, number>,
  captionKey: string,
  captionParams: Record<string, string | number>,
): VisualStep {
  return {
    captionKey,
    captionParams,
    scene: { kind: 'array', values: [...values], highlights, pointers },
  };
}

export const mergesortDemo: AlgorithmDemo<SortInput, SortOutput> = {
  id: 'mergesort',
  visualFamily: 'array-bars',
  metadata: {
    problemKey: 'algorithms.mergesort.problem',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
  },
  defaultInput: { values: [38, 27, 43, 3, 9, 82, 10] },
  buildInitialScene(input) {
    return { kind: 'array', values: [...input.values], highlights: {}, pointers: {} };
  },
  generateSteps(input) {
    const arr = [...input.values];
    const steps: VisualStep[] = [];
    const temp = [...arr];

    function merge(left: number, mid: number, right: number) {
      steps.push(
        arrayStep(
          arr,
          Object.fromEntries(
            Array.from({ length: right - left + 1 }, (_, k) => [left + k, 'active']),
          ),
          { left, mid, right },
          'steps.mergesort.mergeStart',
          { left, mid, right },
        ),
      );
      let i = left;
      let j = mid + 1;
      let k = left;
      while (i <= mid && j <= right) {
        steps.push(
          arrayStep(
            arr,
            { [i]: 'compare', [j]: 'compare' },
            { i, j },
            'steps.mergesort.compare',
            { leftVal: arr[i], rightVal: arr[j] },
          ),
        );
        if (arr[i] <= arr[j]) {
          temp[k++] = arr[i++];
        } else {
          temp[k++] = arr[j++];
        }
      }
      while (i <= mid) temp[k++] = arr[i++];
      while (j <= right) temp[k++] = arr[j++];
      for (let x = left; x <= right; x++) arr[x] = temp[x];
      steps.push(
        arrayStep(
          arr,
          Object.fromEntries(
            Array.from({ length: right - left + 1 }, (_, idx) => [left + idx, 'sorted']),
          ),
          { left, right },
          'steps.mergesort.merged',
          { left, right },
        ),
      );
    }

    function sort(left: number, right: number) {
      if (left >= right) return;
      const mid = Math.floor((left + right) / 2);
      steps.push(
        arrayStep(arr, { [mid]: 'pivot' }, { mid }, 'steps.mergesort.split', { left, mid, right }),
      );
      sort(left, mid);
      sort(mid + 1, right);
      merge(left, mid, right);
    }

    steps.push(arrayStep(arr, {}, {}, 'steps.mergesort.start', { n: arr.length }));
    sort(0, arr.length - 1);
    steps.push(
      arrayStep(
        arr,
        Object.fromEntries(arr.map((_, i) => [i, 'sorted'])),
        {},
        'steps.mergesort.done',
        {},
      ),
    );
    return steps;
  },
  run(input) {
    const arr = [...input.values];
    function merge(a: number[], l: number, m: number, r: number) {
      const left = a.slice(l, m + 1);
      const right = a.slice(m + 1, r + 1);
      let i = 0;
      let j = 0;
      let k = l;
      while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) a[k++] = left[i++];
        else a[k++] = right[j++];
      }
      while (i < left.length) a[k++] = left[i++];
      while (j < right.length) a[k++] = right[j++];
    }
    function sort(a: number[], l: number, r: number) {
      if (l < r) {
        const m = Math.floor((l + r) / 2);
        sort(a, l, m);
        sort(a, m + 1, r);
        merge(a, l, m, r);
      }
    }
    sort(arr, 0, arr.length - 1);
    return { values: arr };
  },
  testCases: [
    { name: 'basic', input: { values: [3, 1, 4, 1, 5] }, expected: { values: [1, 1, 3, 4, 5] } },
    { name: 'single', input: { values: [42] }, expected: { values: [42] } },
    { name: 'duplicates', input: { values: [2, 2, 1] }, expected: { values: [1, 2, 2] } },
  ],
};
