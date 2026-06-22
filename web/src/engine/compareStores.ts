import { createPlaybackStore } from '../engine/createPlaybackStore';

export const useCompareLeftStore = createPlaybackStore();
export const useCompareRightStore = createPlaybackStore();

export const COMPARE_PRESETS = [
  { left: 'quicksort', right: 'mergesort' },
  { left: 'quicksort', right: 'heapsort' },
  { left: 'bubble-sort', right: 'insertion-sort' },
  { left: 'bfs', right: 'dfs' },
  { left: 'dijkstra', right: 'bellman-ford' },
  { left: 'kruskal', right: 'prim' },
] as const;
