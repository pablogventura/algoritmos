import { binarySearchDemo } from './sorting/binarySearch';
import { quicksortDemo } from './sorting/quicksort';
import { mergesortDemo } from './sorting/mergesort';
import { bfsDemo } from './graphs/bfs';
import { dijkstraDemo } from './graphs/dijkstra';
import { primDemo } from './graphs/prim';
import type { AlgorithmDemo } from '../types/demo';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DEMOS: Record<string, AlgorithmDemo<any, any>> = {
  'binary-search': binarySearchDemo,
  quicksort: quicksortDemo,
  mergesort: mergesortDemo,
  bfs: bfsDemo,
  dijkstra: dijkstraDemo,
  prim: primDemo,
};

export function getDemo(id: string) {
  return DEMOS[id];
}

export const READY_DEMO_IDS = Object.keys(DEMOS);
