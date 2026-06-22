import type { AlgorithmDemo } from '../../types/demo';
import { arrayStep, type SortInput, type SortOutput } from '../shared/arraySteps';

function sortedCopy(values: number[]): number[] {
  return [...values].sort((a, b) => a - b);
}

export const selectionSortDemo: AlgorithmDemo<SortInput, SortOutput> = {
  id: 'selection-algorithm',
  visualFamily: 'array-bars',
  metadata: { timeComplexity: 'O(n²)', spaceComplexity: 'O(1)' },
  defaultInput: { values: [64, 25, 12, 22, 11] },
  buildInitialScene(input) {
    return { kind: 'array', values: [...input.values], highlights: {}, pointers: {} };
  },
  generateSteps(input) {
    const arr = [...input.values];
    const steps = [arrayStep(arr, {}, {}, 'steps.selectionSort.start', { n: arr.length })];
    for (let i = 0; i < arr.length - 1; i++) {
      let minIdx = i;
      steps.push(arrayStep(arr, { [i]: 'active' }, { i, min: minIdx }, 'steps.selectionSort.select', { i }));
      for (let j = i + 1; j < arr.length; j++) {
        steps.push(
          arrayStep(arr, { [j]: 'compare', [minIdx]: 'active' }, { i, j, min: minIdx }, 'steps.selectionSort.compare', {
            j,
            value: arr[j],
            minValue: arr[minIdx],
          }),
        );
        if (arr[j] < arr[minIdx]) minIdx = j;
      }
      if (minIdx !== i) {
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        steps.push(arrayStep(arr, { [i]: 'sorted' }, { i }, 'steps.selectionSort.swap', { i, min: minIdx }));
      } else {
        steps.push(arrayStep(arr, { [i]: 'sorted' }, { i }, 'steps.selectionSort.placed', { i }));
      }
    }
    steps.push(arrayStep(arr, {}, {}, 'steps.selectionSort.done', {}));
    return steps;
  },
  run: (input) => ({ values: selectionSortRun(input.values) }),
  testCases: [
    { name: 'default', input: { values: [3, 1, 2] }, expected: { values: [1, 2, 3] } },
    { name: 'sorted', input: { values: [1, 2, 3] }, expected: { values: [1, 2, 3] } },
    { name: 'reverse', input: { values: [3, 2, 1] }, expected: { values: [1, 2, 3] } },
  ],
};

function selectionSortRun(values: number[]): number[] {
  const arr = [...values];
  for (let i = 0; i < arr.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j++) if (arr[j] < arr[minIdx]) minIdx = j;
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  return arr;
}

export const radixSortDemo: AlgorithmDemo<SortInput, SortOutput> = {
  id: 'radix-sort',
  visualFamily: 'array-bars',
  metadata: { timeComplexity: 'O(d·n)', spaceComplexity: 'O(n + k)' },
  defaultInput: { values: [170, 45, 75, 90, 802, 24, 2, 66] },
  buildInitialScene(input) {
    return { kind: 'array', values: [...input.values], highlights: {}, pointers: {} };
  },
  generateSteps(input) {
    const arr = [...input.values];
    const steps = [arrayStep(arr, {}, {}, 'steps.radixSort.start', { n: arr.length })];
    if (arr.length === 0) return steps;
    const max = Math.max(...arr);
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      steps.push(arrayStep(arr, {}, { exp }, 'steps.radixSort.digit', { exp }));
      const output = new Array(arr.length).fill(0);
      const count = new Array(10).fill(0);
      for (const v of arr) count[Math.floor(v / exp) % 10]++;
      for (let i = 1; i < 10; i++) count[i] += count[i - 1];
      for (let i = arr.length - 1; i >= 0; i--) {
        const digit = Math.floor(arr[i] / exp) % 10;
        output[--count[digit]] = arr[i];
        steps.push(
          arrayStep(arr, { [i]: 'active' }, { i, digit }, 'steps.radixSort.place', { i, digit, value: arr[i] }),
        );
      }
      for (let i = 0; i < arr.length; i++) arr[i] = output[i];
      steps.push(arrayStep(arr, {}, { exp }, 'steps.radixSort.passDone', { exp }));
    }
    steps.push(arrayStep(arr, {}, {}, 'steps.radixSort.done', {}));
    return steps;
  },
  run: (input) => ({ values: radixSortRun(input.values) }),
  testCases: [
    { name: 'default', input: { values: [29, 14, 5] }, expected: { values: [5, 14, 29] } },
    { name: 'single', input: { values: [42] }, expected: { values: [42] } },
    { name: 'duplicates', input: { values: [3, 1, 3] }, expected: { values: [1, 3, 3] } },
  ],
};

function radixSortRun(values: number[]): number[] {
  const arr = [...values];
  if (arr.length === 0) return arr;
  const max = Math.max(...arr);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const output = new Array(arr.length).fill(0);
    const count = new Array(10).fill(0);
    for (const v of arr) count[Math.floor(v / exp) % 10]++;
    for (let i = 1; i < 10; i++) count[i] += count[i - 1];
    for (let i = arr.length - 1; i >= 0; i--) {
      const idx = Math.floor(arr[i] / exp) % 10;
      output[--count[idx]] = arr[i];
    }
    for (let i = 0; i < arr.length; i++) arr[i] = output[i];
  }
  return arr;
}

export const bucketSortDemo: AlgorithmDemo<SortInput, SortOutput> = {
  id: 'bucket-sort',
  visualFamily: 'array-bars',
  metadata: { timeComplexity: 'O(n + k) avg', spaceComplexity: 'O(n)' },
  defaultInput: { values: [0.42, 0.32, 0.23, 0.52, 0.25, 0.47, 0.51] },
  buildInitialScene(input) {
    return { kind: 'array', values: input.values.map((v) => Math.round(v * 100)), highlights: {}, pointers: {} };
  },
  generateSteps(input) {
    const scaled = input.values.map((v) => Math.round(v * 100));
    const arr = [...scaled];
    const steps = [arrayStep(arr, {}, {}, 'steps.bucketSort.start', { n: arr.length })];
    const buckets = 5;
    const b: number[][] = Array.from({ length: buckets }, () => []);
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    for (let i = 0; i < arr.length; i++) {
      const idx =
        max === min ? 0 : Math.min(buckets - 1, Math.floor(((arr[i] - min) / (max - min)) * buckets));
      b[idx].push(arr[i]);
      steps.push(arrayStep(arr, { [i]: 'active' }, { i, bucket: idx }, 'steps.bucketSort.scatter', { i, bucket: idx }));
    }
    const out = b.flatMap((bucket, bi) => {
      bucket.sort((a, c) => a - c);
      steps.push(arrayStep(arr, {}, { bucket: bi }, 'steps.bucketSort.sortBucket', { bucket: bi }));
      return bucket;
    });
    steps.push(arrayStep(out, {}, {}, 'steps.bucketSort.done', {}));
    return steps;
  },
  run: (input) => ({ values: bucketSortRun(input.values) }),
  testCases: [
    { name: 'integers', input: { values: [5, 3, 8, 1] }, expected: { values: [1, 3, 5, 8] } },
    { name: 'same', input: { values: [2, 2, 2] }, expected: { values: [2, 2, 2] } },
    { name: 'two', input: { values: [9, 1] }, expected: { values: [1, 9] } },
  ],
};

function bucketSortRun(values: number[]): number[] {
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

export const introsortDemo: AlgorithmDemo<SortInput, SortOutput> = {
  id: 'introsort',
  visualFamily: 'array-bars',
  metadata: { timeComplexity: 'O(n log n)', spaceComplexity: 'O(log n)' },
  defaultInput: { values: [38, 27, 43, 3, 9, 82, 10] },
  buildInitialScene(input) {
    return { kind: 'array', values: [...input.values], highlights: {}, pointers: {} };
  },
  generateSteps(input) {
    const arr = [...input.values];
    const steps = [arrayStep(arr, {}, {}, 'steps.introsort.start', { n: arr.length, depth: Math.floor(Math.log2(arr.length + 1)) * 2 })];
    introsortSteps(arr, 0, arr.length - 1, Math.floor(Math.log2(arr.length + 1)) * 2, steps);
    steps.push(arrayStep(arr, {}, {}, 'steps.introsort.done', {}));
    return steps;
  },
  run: (input) => ({ values: sortedCopy(input.values) }),
  testCases: [
    { name: 'default', input: { values: [3, 1, 4] }, expected: { values: [1, 3, 4] } },
    { name: 'sorted', input: { values: [1, 2] }, expected: { values: [1, 2] } },
    { name: 'reverse', input: { values: [2, 1] }, expected: { values: [1, 2] } },
  ],
};

function introsortSteps(arr: number[], lo: number, hi: number, depth: number, steps: ReturnType<typeof arrayStep>[]): void {
  if (lo >= hi) return;
  if (depth === 0) {
    steps.push(arrayStep(arr, {}, { lo, hi }, 'steps.introsort.heapify', { lo, hi }));
    heapifySlice(arr, lo, hi + 1, steps);
    return;
  }
  const p = partition(arr, lo, hi, steps);
  introsortSteps(arr, lo, p - 1, depth - 1, steps);
  introsortSteps(arr, p + 1, hi, depth - 1, steps);
}

function partition(arr: number[], lo: number, hi: number, steps: ReturnType<typeof arrayStep>[]): number {
  const pivot = arr[hi];
  steps.push(arrayStep(arr, { [hi]: 'pivot' }, { lo, hi }, 'steps.quicksort.choosePivot', { index: hi, value: pivot }));
  let i = lo - 1;
  for (let j = lo; j < hi; j++) {
    steps.push(arrayStep(arr, { [j]: 'compare', [hi]: 'pivot' }, { i, j }, 'steps.quicksort.compare', { j, value: arr[j], pivot }));
    if (arr[j] <= pivot) {
      i++;
      if (i !== j) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        steps.push(arrayStep(arr, { [i]: 'active', [j]: 'active' }, { i, j }, 'steps.quicksort.swap', { i, j }));
      }
    }
  }
  [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
  steps.push(arrayStep(arr, { [i + 1]: 'pivot' }, { pivot: i + 1 }, 'steps.quicksort.pivotPlaced', { index: i + 1, value: arr[i + 1] }));
  return i + 1;
}

function heapifySlice(arr: number[], offset: number, end: number, steps: ReturnType<typeof arrayStep>[]): void {
  for (let i = Math.floor((end - offset) / 2) - 1; i >= 0; i--) siftDown(arr, offset, offset + end, offset + i, steps);
  for (let endIdx = end - 1; endIdx > offset; endIdx--) {
    [arr[offset], arr[endIdx]] = [arr[endIdx], arr[offset]];
    steps.push(arrayStep(arr, { [endIdx]: 'sorted' }, { end: endIdx }, 'steps.heapsort.extract', { end: endIdx, value: arr[endIdx] }));
    siftDown(arr, offset, endIdx, offset, steps);
  }
}

function siftDown(arr: number[], base: number, end: number, i: number, steps: ReturnType<typeof arrayStep>[]): void {
  let largest = i;
  const l = base + 2 * (i - base) + 1;
  const r = base + 2 * (i - base) + 2;
  if (l < end && arr[l] > arr[largest]) largest = l;
  if (r < end && arr[r] > arr[largest]) largest = r;
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    steps.push(arrayStep(arr, { [i]: 'active', [largest]: 'active' }, { i, largest }, 'steps.heapsort.heapify', { i, largest }));
    siftDown(arr, base, end, largest, steps);
  }
}

export const timsortDemo: AlgorithmDemo<SortInput, SortOutput> = {
  id: 'timsort',
  visualFamily: 'array-bars',
  metadata: { timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)' },
  defaultInput: { values: [5, 2, 8, 1, 9, 3, 7, 4, 6] },
  buildInitialScene(input) {
    return { kind: 'array', values: [...input.values], highlights: {}, pointers: {} };
  },
  generateSteps(input) {
    const arr = [...input.values];
    const steps = [arrayStep(arr, {}, {}, 'steps.timsort.start', { n: arr.length })];
    const runSize = Math.max(2, Math.floor(arr.length / 3));
    for (let start = 0; start < arr.length; start += runSize) {
      const end = Math.min(start + runSize - 1, arr.length - 1);
      for (let i = start + 1; i <= end; i++) {
        const key = arr[i];
        let j = i - 1;
        steps.push(arrayStep(arr, { [i]: 'active' }, { i, start, end }, 'steps.timsort.insertRun', { i, start, end }));
        while (j >= start && arr[j] > key) {
          arr[j + 1] = arr[j];
          j--;
        }
        arr[j + 1] = key;
      }
      for (let k = start; k <= end; k++) steps.push(arrayStep(arr, { [k]: 'sorted' }, { k }, 'steps.timsort.runDone', { start, end }));
    }
    mergeAll(arr, runSize, steps);
    steps.push(arrayStep(arr, {}, {}, 'steps.timsort.done', {}));
    return steps;
  },
  run: (input) => ({ values: sortedCopy(input.values) }),
  testCases: [
    { name: 'default', input: { values: [3, 1, 2] }, expected: { values: [1, 2, 3] } },
    { name: 'sorted', input: { values: [1, 2, 3, 4] }, expected: { values: [1, 2, 3, 4] } },
    { name: 'reverse', input: { values: [4, 3, 2, 1] }, expected: { values: [1, 2, 3, 4] } },
  ],
};

function mergeAll(arr: number[], runSize: number, steps: ReturnType<typeof arrayStep>[]): void {
  for (let width = runSize; width < arr.length; width *= 2) {
    for (let left = 0; left < arr.length; left += 2 * width) {
      const mid = Math.min(left + width - 1, arr.length - 1);
      const right = Math.min(left + 2 * width - 1, arr.length - 1);
      if (mid >= right) continue;
      steps.push(arrayStep(arr, {}, { left, mid, right }, 'steps.mergesort.mergeStart', { left, mid, right }));
      const tmp = arr.slice(left, right + 1);
      let i = 0;
      let j = mid - left + 1;
      let k = left;
      while (i <= mid - left && j < tmp.length) {
        if (tmp[i] <= tmp[j]) arr[k++] = tmp[i++];
        else arr[k++] = tmp[j++];
      }
      while (i <= mid - left) arr[k++] = tmp[i++];
      while (j < tmp.length) arr[k++] = tmp[j++];
      steps.push(arrayStep(arr, {}, { left, right }, 'steps.mergesort.merged', { left, right }));
    }
  }
}

export const interpolationSearchDemo: AlgorithmDemo<
  { values: number[]; target: number },
  { index: number }
> = {
  id: 'interpolation-search',
  visualFamily: 'array-bars',
  metadata: { timeComplexity: 'O(log log n) avg', spaceComplexity: 'O(1)' },
  defaultInput: { values: [10, 20, 30, 40, 50, 60, 70, 80, 90], target: 70 },
  buildInitialScene(input) {
    return { kind: 'array', values: [...input.values], highlights: {}, pointers: {} };
  },
  generateSteps(input) {
    const arr = sortedCopy(input.values);
    const target = input.target;
    const steps = [arrayStep(arr, {}, {}, 'steps.interpolationSearch.start', { target, n: arr.length })];
    let lo = 0;
    let hi = arr.length - 1;
    while (lo <= hi && target >= arr[lo] && target <= arr[hi]) {
      const pos =
        lo === hi
          ? lo
          : lo + Math.floor(((target - arr[lo]) * (hi - lo)) / (arr[hi] - arr[lo] || 1));
      const mid = Math.min(hi, Math.max(lo, pos));
      steps.push(
        arrayStep(arr, { [mid]: 'compare' }, { lo, hi, mid }, 'steps.interpolationSearch.probe', {
          mid,
          value: arr[mid],
          target,
        }),
      );
      if (arr[mid] === target) {
        steps.push(arrayStep(arr, { [mid]: 'found' }, { mid }, 'steps.interpolationSearch.found', { mid }));
        return steps;
      }
      if (arr[mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
    steps.push(arrayStep(arr, {}, {}, 'steps.interpolationSearch.notFound', { target }));
    return steps;
  },
  run(input) {
    const arr = sortedCopy(input.values);
    let lo = 0;
    let hi = arr.length - 1;
    while (lo <= hi && input.target >= arr[lo] && input.target <= arr[hi]) {
      const pos =
        lo === hi
          ? lo
          : lo + Math.floor(((input.target - arr[lo]) * (hi - lo)) / (arr[hi] - arr[lo] || 1));
      const mid = Math.min(hi, Math.max(lo, pos));
      if (arr[mid] === input.target) return { index: mid };
      if (arr[mid] < input.target) lo = mid + 1;
      else hi = mid - 1;
    }
    return { index: -1 };
  },
  testCases: [
    { name: 'found', input: { values: [10, 20, 30, 40], target: 30 }, expected: { index: 2 } },
    { name: 'not found', input: { values: [10, 20, 30], target: 25 }, expected: { index: -1 } },
    { name: 'first', input: { values: [1, 2, 3, 4], target: 1 }, expected: { index: 0 } },
  ],
};

export const exponentialSearchDemo: AlgorithmDemo<
  { values: number[]; target: number },
  { index: number }
> = {
  id: 'busqueda-exponencial',
  visualFamily: 'array-bars',
  metadata: { timeComplexity: 'O(log n)', spaceComplexity: 'O(1)' },
  defaultInput: { values: [2, 4, 8, 16, 32, 64, 128], target: 32 },
  buildInitialScene(input) {
    return { kind: 'array', values: [...sortedCopy(input.values)], highlights: {}, pointers: {} };
  },
  generateSteps(input) {
    const arr = sortedCopy(input.values);
    const target = input.target;
    const steps = [arrayStep(arr, {}, {}, 'steps.exponentialSearch.start', { target, n: arr.length })];
    if (arr[0] === target) {
      steps.push(arrayStep(arr, { 0: 'found' }, { i: 0 }, 'steps.exponentialSearch.found', { index: 0 }));
      return steps;
    }
    let bound = 1;
    while (bound < arr.length && arr[bound] < target) {
      steps.push(
        arrayStep(arr, { [bound]: 'compare' }, { bound }, 'steps.exponentialSearch.expand', { bound, value: arr[bound] }),
      );
      bound *= 2;
    }
    let lo = Math.floor(bound / 2);
    let hi = Math.min(bound, arr.length - 1);
    steps.push(arrayStep(arr, {}, { lo, hi }, 'steps.exponentialSearch.binaryRange', { lo, hi }));
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      steps.push(
        arrayStep(arr, { [mid]: 'compare' }, { lo, hi, mid }, 'steps.exponentialSearch.compare', {
          mid,
          value: arr[mid],
          target,
        }),
      );
      if (arr[mid] === target) {
        steps.push(arrayStep(arr, { [mid]: 'found' }, { mid }, 'steps.exponentialSearch.found', { index: mid }));
        return steps;
      }
      if (arr[mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
    steps.push(arrayStep(arr, {}, {}, 'steps.exponentialSearch.notFound', { target }));
    return steps;
  },
  run(input) {
    const arr = sortedCopy(input.values);
    const target = input.target;
    if (arr[0] === target) return { index: 0 };
    let bound = 1;
    while (bound < arr.length && arr[bound] < target) bound *= 2;
    let lo = Math.floor(bound / 2);
    let hi = Math.min(bound, arr.length - 1);
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (arr[mid] === target) return { index: mid };
      if (arr[mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return { index: -1 };
  },
  testCases: [
    { name: 'found', input: { values: [1, 3, 5, 7, 9], target: 7 }, expected: { index: 3 } },
    { name: 'not found', input: { values: [1, 3, 5], target: 4 }, expected: { index: -1 } },
    { name: 'first', input: { values: [2, 4, 8], target: 2 }, expected: { index: 0 } },
  ],
};

export const topKHeapDemo: AlgorithmDemo<SortInput, { topK: number[] }> = {
  id: 'top-k-con-heap',
  visualFamily: 'array-bars',
  metadata: { timeComplexity: 'O(n log k)', spaceComplexity: 'O(k)' },
  defaultInput: { values: [3, 2, 1, 5, 6, 4] },
  buildInitialScene(input) {
    return { kind: 'array', values: [...input.values], highlights: {}, pointers: {} };
  },
  generateSteps(input) {
    const arr = [...input.values];
    const k = Math.min(3, arr.length);
    const steps = [arrayStep(arr, {}, { k }, 'steps.topK.start', { k, n: arr.length })];
    const heap = arr.slice(0, k);
    for (let i = k; i < arr.length; i++) {
      steps.push(arrayStep(arr, { [i]: 'compare' }, { i, k }, 'steps.topK.consider', { i, value: arr[i] }));
      if (arr[i] > Math.min(...heap)) {
        const minIdx = heap.indexOf(Math.min(...heap));
        heap[minIdx] = arr[i];
        steps.push(arrayStep(arr, { [i]: 'active', [minIdx]: 'pivot' }, { i, minIdx }, 'steps.topK.replace', { i, minIdx }));
      }
    }
    heap.sort((a, b) => b - a);
    steps.push(arrayStep(arr, {}, { k }, 'steps.topK.done', { k, values: heap.join(', ') }));
    return steps;
  },
  run(input) {
    const k = Math.min(3, input.values.length);
    const heap = input.values.slice(0, k);
    for (let i = k; i < input.values.length; i++) {
      if (input.values[i] > Math.min(...heap)) {
        const minIdx = heap.indexOf(Math.min(...heap));
        heap[minIdx] = input.values[i];
      }
    }
    return { topK: heap.sort((a, b) => b - a) };
  },
  testCases: [
    { name: 'default', input: { values: [1, 2, 3, 4, 5] }, expected: { topK: [5, 4, 3] } },
    { name: 'small k', input: { values: [9, 1] }, expected: { topK: [9, 1] } },
    { name: 'duplicates', input: { values: [1, 1, 1, 2] }, expected: { topK: [2, 1, 1] } },
  ],
};

export const medianOfMediansDemo: AlgorithmDemo<SortInput, { median: number }> = {
  id: 'median-of-medians',
  visualFamily: 'array-bars',
  metadata: { timeComplexity: 'O(n)', spaceComplexity: 'O(n)' },
  defaultInput: { values: [12, 3, 5, 7, 4, 19, 26, 8, 15, 10] },
  buildInitialScene(input) {
    return { kind: 'array', values: [...input.values], highlights: {}, pointers: {} };
  },
  generateSteps(input) {
    const arr = [...input.values];
    const steps = [arrayStep(arr, {}, {}, 'steps.medianOfMedians.start', { n: arr.length })];
    const median = selectMedian(arr, 0, arr.length - 1, Math.floor(arr.length / 2), steps);
    steps.push(arrayStep(arr, { [Math.floor(arr.length / 2)]: 'found' }, {}, 'steps.medianOfMedians.done', { median }));
    return steps;
  },
  run(input) {
    const arr = [...input.values];
    const idx = Math.floor(arr.length / 2);
    return { median: selectMedian(arr, 0, arr.length - 1, idx, () => {}) };
  },
  testCases: [
    { name: 'odd', input: { values: [3, 1, 2] }, expected: { median: 2 } },
    { name: 'single', input: { values: [42] }, expected: { median: 42 } },
    { name: 'five', input: { values: [5, 1, 4, 2, 3] }, expected: { median: 3 } },
  ],
};

function selectMedian(
  arr: number[],
  lo: number,
  hi: number,
  k: number,
  steps: ReturnType<typeof arrayStep>[] | (() => void),
): number {
  if (lo === hi) return arr[lo];
  const stepFn = typeof steps === 'function' ? () => {} : (s: ReturnType<typeof arrayStep>) => steps.push(s);
  const groups = Math.ceil((hi - lo + 1) / 5);
  const medians: number[] = [];
  for (let g = 0; g < groups; g++) {
    const start = lo + g * 5;
    const end = Math.min(start + 4, hi);
    const slice = arr.slice(start, end + 1).sort((a, b) => a - b);
    medians.push(slice[Math.floor(slice.length / 2)]);
    stepFn(arrayStep(arr, {}, { start, end }, 'steps.medianOfMedians.group', { start, end, median: medians[medians.length - 1] }));
  }
  const pivot = medians.sort((a, b) => a - b)[Math.floor(medians.length / 2)];
  let i = lo;
  let j = hi;
  while (i <= j) {
    while (arr[i] < pivot) i++;
    while (arr[j] > pivot) j--;
    if (i <= j) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      stepFn(arrayStep(arr, { [i]: 'active', [j]: 'active' }, { i, j, pivot }, 'steps.medianOfMedians.partition', { i, j, pivot }));
      i++;
      j--;
    }
  }
  if (k <= j) return selectMedian(arr, lo, j, k, steps);
  if (k >= i) return selectMedian(arr, i, hi, k, steps);
  return pivot;
}

export const externalSortDemo: AlgorithmDemo<SortInput, SortOutput> = {
  id: 'external-sorting',
  visualFamily: 'array-bars',
  metadata: { timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)' },
  defaultInput: { values: [38, 27, 43, 3, 9, 82, 10, 55] },
  buildInitialScene(input) {
    return { kind: 'array', values: [...input.values], highlights: {}, pointers: {} };
  },
  generateSteps(input) {
    const arr = [...input.values];
    const blockSize = Math.max(2, Math.ceil(arr.length / 2));
    const steps = [arrayStep(arr, {}, { blockSize }, 'steps.externalSort.start', { n: arr.length, blockSize })];
    for (let start = 0; start < arr.length; start += blockSize) {
      const end = Math.min(start + blockSize - 1, arr.length - 1);
      for (let i = start + 1; i <= end; i++) {
        const key = arr[i];
        let j = i - 1;
        while (j >= start && arr[j] > key) {
          arr[j + 1] = arr[j];
          j--;
        }
        arr[j + 1] = key;
      }
      for (let k = start; k <= end; k++) {
        steps.push(arrayStep(arr, { [k]: 'active' }, { block: start / blockSize }, 'steps.externalSort.sortRun', { start, end, k }));
      }
    }
    mergeAll(arr, blockSize, steps);
    steps.push(arrayStep(arr, {}, {}, 'steps.externalSort.done', {}));
    return steps;
  },
  run: (input) => ({ values: sortedCopy(input.values) }),
  testCases: [
    { name: 'default', input: { values: [4, 2, 1, 3] }, expected: { values: [1, 2, 3, 4] } },
    { name: 'sorted', input: { values: [1, 2] }, expected: { values: [1, 2] } },
    { name: 'reverse', input: { values: [3, 2, 1] }, expected: { values: [1, 2, 3] } },
  ],
};

export const REST_SORTING_DEMOS = {
  'selection-algorithm': selectionSortDemo,
  'radix-sort': radixSortDemo,
  'bucket-sort': bucketSortDemo,
  introsort: introsortDemo,
  timsort: timsortDemo,
  'interpolation-search': interpolationSearchDemo,
  'busqueda-exponencial': exponentialSearchDemo,
  'top-k-con-heap': topKHeapDemo,
  'median-of-medians': medianOfMediansDemo,
  'external-sorting': externalSortDemo,
};
