import { binarySearchDemo } from './sorting/binarySearch';
import { quicksortDemo } from './sorting/quicksort';
import { mergesortDemo } from './sorting/mergesort';
import {
  linearSearchDemo,
  quickselectDemo,
  countingSortDemo,
  heapsortDemo,
} from './sorting/moreSorting';
import { bfsDemo } from './graphs/bfs';
import { dijkstraDemo } from './graphs/dijkstra';
import { primDemo } from './graphs/prim';
import {
  dfsDemo,
  kruskalDemo,
  bellmanFordDemo,
  topologicalSortDemo,
  unionFindDemo,
} from './graphs/moreGraphs';
import type { AlgorithmDemo } from '../types/demo';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DEMOS: Record<string, AlgorithmDemo<any, any>> = {
  'binary-search': binarySearchDemo,
  quicksort: quicksortDemo,
  mergesort: mergesortDemo,
  'linear-search-con-centinela': linearSearchDemo,
  quickselect: quickselectDemo,
  'counting-sort': countingSortDemo,
  heapsort: heapsortDemo,
  bfs: bfsDemo,
  dfs: dfsDemo,
  dijkstra: dijkstraDemo,
  prim: primDemo,
  kruskal: kruskalDemo,
  'bellman-ford': bellmanFordDemo,
  'orden-topologico': topologicalSortDemo,
  'union-find-disjoint-set-union': unionFindDemo,
};

export function getDemo(id: string) {
  return DEMOS[id];
}

export const READY_DEMO_IDS = Object.keys(DEMOS);
