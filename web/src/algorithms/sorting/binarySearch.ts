import type { AlgorithmDemo, VisualStep, HighlightKind } from '../../types/demo';

export interface BinarySearchInput {
  values: number[];
  target: number;
}

export interface BinarySearchOutput {
  index: number;
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
    scene: {
      kind: 'array',
      values: [...values],
      highlights,
      pointers,
    },
  };
}

export const binarySearchDemo: AlgorithmDemo<BinarySearchInput, BinarySearchOutput> = {
  id: 'binary-search',
  visualFamily: 'array-bars',
  metadata: {
    problemKey: 'algorithms.binary-search.problem',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
  },
  defaultInput: { values: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], target: 23 },
  buildInitialScene(input) {
    return {
      kind: 'array',
      values: [...input.values],
      highlights: {},
      pointers: {},
    };
  },
  generateSteps(input) {
    const arr = [...input.values].sort((a, b) => a - b);
    const steps: VisualStep[] = [];
    let left = 0;
    let right = arr.length - 1;

    steps.push(
      arrayStep(arr, {}, {}, 'steps.binarySearch.start', {
        target: input.target,
        n: arr.length,
      }),
    );

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      steps.push(
        arrayStep(
          arr,
          { [mid]: 'compare', [left]: 'active', [right]: 'active' },
          { left, right, mid },
          'steps.binarySearch.compare',
          { mid, value: arr[mid], target: input.target },
        ),
      );

      if (arr[mid] === input.target) {
        steps.push(
          arrayStep(
            arr,
            { [mid]: 'found' },
            { mid },
            'steps.binarySearch.found',
            { mid, value: arr[mid] },
          ),
        );
        return steps;
      }

      if (arr[mid] < input.target) {
        steps.push(
          arrayStep(
            arr,
            Object.fromEntries(
              Array.from({ length: mid - left + 1 }, (_, i) => [left + i, 'discarded']),
            ),
            { left: mid + 1, right },
            'steps.binarySearch.right',
            { mid, nextLeft: mid + 1 },
          ),
        );
        left = mid + 1;
      } else {
        steps.push(
          arrayStep(
            arr,
            Object.fromEntries(
              Array.from({ length: right - mid + 1 }, (_, i) => [mid + i, 'discarded']),
            ),
            { left, right: mid - 1 },
            'steps.binarySearch.left',
            { mid, nextRight: mid - 1 },
          ),
        );
        right = mid - 1;
      }
    }

    steps.push(
      arrayStep(arr, {}, {}, 'steps.binarySearch.notFound', { target: input.target }),
    );
    return steps;
  },
  run(input) {
    const arr = [...input.values].sort((a, b) => a - b);
    let left = 0;
    let right = arr.length - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (arr[mid] === input.target) return { index: mid };
      if (arr[mid] < input.target) left = mid + 1;
      else right = mid - 1;
    }
    return { index: -1 };
  },
  testCases: [
    {
      name: 'found middle',
      input: { values: [1, 3, 5, 7, 9], target: 5 },
      expected: { index: 2 },
    },
    {
      name: 'not found',
      input: { values: [1, 3, 5, 7, 9], target: 4 },
      expected: { index: -1 },
    },
    {
      name: 'first element',
      input: { values: [2, 4, 6, 8], target: 2 },
      expected: { index: 0 },
    },
  ],
};
