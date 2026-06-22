import { binarySearchDemo } from '../sorting/binarySearch';
import { quicksortDemo } from '../sorting/quicksort';
import { mergesortDemo } from '../sorting/mergesort';
import {
  linearSearchDemo,
  quickselectDemo,
  countingSortDemo,
  heapsortDemo,
} from '../sorting/moreSorting';
import { bfsDemo } from '../graphs/bfs';
import { dijkstraDemo } from '../graphs/dijkstra';
import { primDemo } from '../graphs/prim';
import {
  dfsDemo,
  kruskalDemo,
  bellmanFordDemo,
  topologicalSortDemo,
  unionFindDemo,
} from '../graphs/moreGraphs';
import { REST_GRAPH_DEMOS } from '../graphs/restGraphs';
import { GRAPH_BATCH2_DEMOS } from '../graphs/graphBatch2';
import { REST_SORTING_DEMOS } from '../sorting/restSorting';
import { DATA_STRUCTURE_DEMOS } from '../structures/dataStructures';
import { STRING_BATCH_DEMOS } from '../strings/stringBatch';
import type { AlgorithmDemo } from '../../types/demo';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const HANDCRAFTED_DEMOS: Record<string, AlgorithmDemo<any, any>> = {
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
  ...REST_SORTING_DEMOS,
  ...REST_GRAPH_DEMOS,
  ...GRAPH_BATCH2_DEMOS,
  ...DATA_STRUCTURE_DEMOS,
  ...STRING_BATCH_DEMOS,
};

export const HANDCRAFTED_IDS = new Set(Object.keys(HANDCRAFTED_DEMOS));
