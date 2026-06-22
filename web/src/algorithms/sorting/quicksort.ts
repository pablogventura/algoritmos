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

export const quicksortDemo: AlgorithmDemo<SortInput, SortOutput> = {
  id: 'quicksort',
  visualFamily: 'array-bars',
  metadata: {
    problemKey: 'algorithms.quicksort.problem',
    timeComplexity: 'O(n log n) avg',
    spaceComplexity: 'O(log n)',
  },
  defaultInput: { values: [38, 27, 43, 3, 9, 82, 10] },
  buildInitialScene(input) {
    return { kind: 'array', values: [...input.values], highlights: {}, pointers: {} };
  },
  generateSteps(input) {
    const arr = [...input.values];
    const steps: VisualStep[] = [];

    function partition(low: number, high: number): number {
      const pivot = arr[high];
      steps.push(
        arrayStep(
          arr,
          { [high]: 'pivot' },
          { pivot: high },
          'steps.quicksort.choosePivot',
          { index: high, value: pivot },
        ),
      );
      let i = low - 1;
      for (let j = low; j < high; j++) {
        steps.push(
          arrayStep(
            arr,
            { [j]: 'compare', [high]: 'pivot' },
            { i, j, pivot: high },
            'steps.quicksort.compare',
            { j, value: arr[j], pivot },
          ),
        );
        if (arr[j] <= pivot) {
          i++;
          if (i !== j) {
            [arr[i], arr[j]] = [arr[j], arr[i]];
            steps.push(
              arrayStep(
                arr,
                { [i]: 'active', [j]: 'active', [high]: 'pivot' },
                { i, j, pivot: high },
                'steps.quicksort.swap',
                { i, j },
              ),
            );
          }
        }
      }
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      steps.push(
        arrayStep(
          arr,
          { [i + 1]: 'sorted' },
          { pivot: i + 1 },
          'steps.quicksort.pivotPlaced',
          { index: i + 1, value: arr[i + 1] },
        ),
      );
      return i + 1;
    }

    function sort(low: number, high: number) {
      if (low >= high) return;
      const pi = partition(low, high);
      sort(low, pi - 1);
      sort(pi + 1, high);
    }

    steps.push(arrayStep(arr, {}, {}, 'steps.quicksort.start', { n: arr.length }));
    sort(0, arr.length - 1);
    steps.push(
      arrayStep(
        arr,
        Object.fromEntries(arr.map((_, i) => [i, 'sorted'])),
        {},
        'steps.quicksort.done',
        {},
      ),
    );
    return steps;
  },
  run(input) {
    const arr = [...input.values];
    function partition(a: number[], low: number, high: number) {
      const pivot = a[high];
      let i = low - 1;
      for (let j = low; j < high; j++) {
        if (a[j] <= pivot) {
          i++;
          [a[i], a[j]] = [a[j], a[i]];
        }
      }
      [a[i + 1], a[high]] = [a[high], a[i + 1]];
      return i + 1;
    }
    function sort(a: number[], low: number, high: number) {
      if (low < high) {
        const pi = partition(a, low, high);
        sort(a, low, pi - 1);
        sort(a, pi + 1, high);
      }
    }
    sort(arr, 0, arr.length - 1);
    return { values: arr };
  },
  testCases: [
    { name: 'basic', input: { values: [3, 1, 4, 1, 5] }, expected: { values: [1, 1, 3, 4, 5] } },
    { name: 'sorted', input: { values: [1, 2, 3] }, expected: { values: [1, 2, 3] } },
    { name: 'reverse', input: { values: [5, 4, 3] }, expected: { values: [3, 4, 5] } },
  ],
};
