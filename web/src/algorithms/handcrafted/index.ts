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
import { PATTERN_BATCH_DEMOS } from '../patterns/patternBatch';
import { PATTERN_OVERVIEW_DEMOS } from '../patterns/patternOverviewBatch';
import { COMPRESSION_EXTRA_DEMOS } from '../compresion/compressionBatch';
import { LOGIC_CRYPTO_EXTRA_DEMOS } from '../logic/logicCryptoBatch';
import { KEY_ALGO_DEMOS } from '../special/keyDemos';
import { buildRemainingDemos } from '../remaining/factory';
import type { AlgorithmDemo } from '../../types/demo';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CORE_DEMOS: Record<string, AlgorithmDemo<any, any>> = {
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
  ...PATTERN_BATCH_DEMOS,
  ...PATTERN_OVERVIEW_DEMOS,
  ...COMPRESSION_EXTRA_DEMOS,
  ...LOGIC_CRYPTO_EXTRA_DEMOS,
  ...KEY_ALGO_DEMOS,
  'busqueda-binaria': { ...binarySearchDemo, id: 'busqueda-binaria' },
  'arc-consistency': { ...LOGIC_CRYPTO_EXTRA_DEMOS['ac-3'], id: 'arc-consistency' },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const HANDCRAFTED_DEMOS: Record<string, AlgorithmDemo<any, any>> = {
  ...CORE_DEMOS,
  ...buildRemainingDemos(new Set(Object.keys(CORE_DEMOS))),
};

export const HANDCRAFTED_IDS = new Set(Object.keys(HANDCRAFTED_DEMOS));
