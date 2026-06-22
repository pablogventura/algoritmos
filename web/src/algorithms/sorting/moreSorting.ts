import type { AlgorithmDemo } from '../../types/demo';
import { arrayStep, type SortInput, type SortOutput } from '../shared/arraySteps';

export interface LinearSearchInput {
  values: number[];
  target: number;
}

export interface LinearSearchOutput {
  index: number;
}

export const linearSearchDemo: AlgorithmDemo<LinearSearchInput, LinearSearchOutput> = {
  id: 'linear-search-con-centinela',
  visualFamily: 'array-bars',
  metadata: {
    problemKey: 'algorithms.linear-search.problem',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
  },
  defaultInput: { values: [4, 2, 7, 1, 9, 3, 8], target: 9 },
  buildInitialScene(input) {
    return { kind: 'array', values: [...input.values], highlights: {}, pointers: {} };
  },
  generateSteps(input) {
    const arr = [...input.values];
    const steps = [arrayStep(arr, {}, {}, 'steps.linearSearch.start', { target: input.target, n: arr.length })];
    for (let i = 0; i < arr.length; i++) {
      steps.push(
        arrayStep(
          arr,
          { [i]: 'compare' },
          { i },
          'steps.linearSearch.compare',
          { i, value: arr[i], target: input.target },
        ),
      );
      if (arr[i] === input.target) {
        steps.push(arrayStep(arr, { [i]: 'found' }, { i }, 'steps.linearSearch.found', { i }));
        return steps;
      }
    }
    steps.push(arrayStep(arr, {}, {}, 'steps.linearSearch.notFound', { target: input.target }));
    return steps;
  },
  run(input) {
    const idx = input.values.indexOf(input.target);
    return { index: idx };
  },
  testCases: [
    { name: 'found', input: { values: [1, 2, 3, 4], target: 3 }, expected: { index: 2 } },
    { name: 'not found', input: { values: [1, 2, 3], target: 5 }, expected: { index: -1 } },
    { name: 'first', input: { values: [9, 1, 2], target: 9 }, expected: { index: 0 } },
  ],
};

export const quickselectDemo: AlgorithmDemo<SortInput, { value: number }> = {
  id: 'quickselect',
  visualFamily: 'array-bars',
  metadata: {
    problemKey: 'algorithms.quickselect.problem',
    timeComplexity: 'O(n) avg',
    spaceComplexity: 'O(1)',
  },
  defaultInput: { values: [7, 10, 4, 3, 20, 15] },
  buildInitialScene(input) {
    return { kind: 'array', values: [...input.values], highlights: {}, pointers: {} };
  },
  generateSteps(input) {
    const arr = [...input.values];
    const k = Math.floor(arr.length / 2);
    const steps = [arrayStep(arr, {}, {}, 'steps.quickselect.start', { k, n: arr.length })];

    function partition(low: number, high: number): number {
      const pivot = arr[high];
      steps.push(arrayStep(arr, { [high]: 'pivot' }, { pivot: high }, 'steps.quickselect.pivot', { value: pivot }));
      let i = low - 1;
      for (let j = low; j < high; j++) {
        steps.push(arrayStep(arr, { [j]: 'compare', [high]: 'pivot' }, { i, j }, 'steps.quickselect.compare', { j, value: arr[j] }));
        if (arr[j] <= pivot) {
          i++;
          if (i !== j) {
            [arr[i], arr[j]] = [arr[j], arr[i]];
            steps.push(arrayStep(arr, { [i]: 'active', [j]: 'active' }, { i, j }, 'steps.quickselect.swap', { i, j }));
          }
        }
      }
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      return i + 1;
    }

    function select(low: number, high: number, kk: number) {
      if (low >= high) return;
      const pi = partition(low, high);
      steps.push(arrayStep(arr, { [pi]: 'found' }, { pivot: pi }, 'steps.quickselect.placed', { index: pi, value: arr[pi] }));
      if (pi === kk) return;
      if (kk < pi) select(low, pi - 1, kk);
      else select(pi + 1, high, kk);
    }

    select(0, arr.length - 1, k);
    steps.push(arrayStep(arr, { [k]: 'found' }, { k }, 'steps.quickselect.done', { k, value: arr[k] }));
    return steps;
  },
  run(input) {
    const arr = [...input.values];
    const k = Math.floor(arr.length / 2);
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
    function select(a: number[], low: number, high: number, kk: number): number {
      if (low === high) return a[low];
      const pi = partition(a, low, high);
      if (pi === kk) return a[pi];
      if (kk < pi) return select(a, low, pi - 1, kk);
      return select(a, pi + 1, high, kk);
    }
    return { value: select(arr, 0, arr.length - 1, k) };
  },
  testCases: [
    { name: 'median', input: { values: [3, 1, 4, 1, 5] }, expected: { value: 3 } },
    { name: 'single', input: { values: [42] }, expected: { value: 42 } },
    { name: 'two', input: { values: [2, 1] }, expected: { value: 2 } },
  ],
};

export const countingSortDemo: AlgorithmDemo<SortInput, SortOutput> = {
  id: 'counting-sort',
  visualFamily: 'array-bars',
  metadata: {
    problemKey: 'algorithms.counting-sort.problem',
    timeComplexity: 'O(n + k)',
    spaceComplexity: 'O(k)',
  },
  defaultInput: { values: [4, 2, 2, 8, 3, 3, 1] },
  buildInitialScene(input) {
    return { kind: 'array', values: [...input.values], highlights: {}, pointers: {} };
  },
  generateSteps(input) {
    const arr = [...input.values];
    const max = Math.max(...arr);
    const count = new Array(max + 1).fill(0);
    const steps = [arrayStep(arr, {}, {}, 'steps.countingSort.start', { n: arr.length })];

    for (let i = 0; i < arr.length; i++) {
      count[arr[i]]++;
      steps.push(arrayStep(arr, { [i]: 'active' }, { i }, 'steps.countingSort.count', { value: arr[i], count: count[arr[i]] }));
    }

    const output: number[] = [];
    for (let v = 0; v <= max; v++) {
      while (count[v] > 0) {
        output.push(v);
        count[v]--;
        steps.push(arrayStep(output, { [output.length - 1]: 'sorted' }, {}, 'steps.countingSort.place', { value: v }));
      }
    }
    steps.push(arrayStep(output, Object.fromEntries(output.map((_, i) => [i, 'sorted'])), {}, 'steps.countingSort.done', {}));
    return steps;
  },
  run(input) {
    const max = Math.max(...input.values);
    const count = new Array(max + 1).fill(0);
    for (const v of input.values) count[v]++;
    const out: number[] = [];
    for (let v = 0; v <= max; v++) while (count[v]-- > 0) out.push(v);
    return { values: out };
  },
  testCases: [
    { name: 'basic', input: { values: [4, 2, 2, 1] }, expected: { values: [1, 2, 2, 4] } },
    { name: 'sorted', input: { values: [1, 2, 3] }, expected: { values: [1, 2, 3] } },
    { name: 'duplicates', input: { values: [3, 3, 3] }, expected: { values: [3, 3, 3] } },
  ],
};

export const heapsortDemo: AlgorithmDemo<SortInput, SortOutput> = {
  id: 'heapsort',
  visualFamily: 'array-bars',
  metadata: {
    problemKey: 'algorithms.heapsort.problem',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
  },
  defaultInput: { values: [12, 11, 13, 5, 6, 7] },
  buildInitialScene(input) {
    return { kind: 'array', values: [...input.values], highlights: {}, pointers: {} };
  },
  generateSteps(input) {
    const arr = [...input.values];
    const steps = [arrayStep(arr, {}, {}, 'steps.heapsort.start', { n: arr.length })];

    function heapify(n: number, i: number) {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      if (left < n && arr[left] > arr[largest]) largest = left;
      if (right < n && arr[right] > arr[largest]) largest = right;
      if (largest !== i) {
        steps.push(arrayStep(arr, { [i]: 'compare', [largest]: 'active' }, { i, largest }, 'steps.heapsort.heapify', { i, largest }));
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        heapify(n, largest);
      }
    }

    for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) heapify(arr.length, i);

    for (let end = arr.length - 1; end > 0; end--) {
      [arr[0], arr[end]] = [arr[end], arr[0]];
      steps.push(arrayStep(arr, { [end]: 'sorted', [0]: 'pivot' }, { end }, 'steps.heapsort.extract', { end, value: arr[end] }));
      heapify(end, 0);
    }
    steps.push(arrayStep(arr, Object.fromEntries(arr.map((_, i) => [i, 'sorted'])), {}, 'steps.heapsort.done', {}));
    return steps;
  },
  run(input) {
    const arr = [...input.values];
    function heapify(a: number[], n: number, i: number) {
      let largest = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n && a[l] > a[largest]) largest = l;
      if (r < n && a[r] > a[largest]) largest = r;
      if (largest !== i) {
        [a[i], a[largest]] = [a[largest], a[i]];
        heapify(a, n, largest);
      }
    }
    for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) heapify(arr, arr.length, i);
    for (let end = arr.length - 1; end > 0; end--) {
      [arr[0], arr[end]] = [arr[end], arr[0]];
      heapify(arr, end, 0);
    }
    return { values: arr };
  },
  testCases: [
    { name: 'basic', input: { values: [4, 1, 3, 2] }, expected: { values: [1, 2, 3, 4] } },
    { name: 'reverse', input: { values: [3, 2, 1] }, expected: { values: [1, 2, 3] } },
    { name: 'single', input: { values: [1] }, expected: { values: [1] } },
  ],
};
