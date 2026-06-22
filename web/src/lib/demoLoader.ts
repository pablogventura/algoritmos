import type { AlgorithmDemo } from '../types/demo';

let cache: Record<string, AlgorithmDemo<unknown, unknown>> | null = null;
let loading: Promise<Record<string, AlgorithmDemo<unknown, unknown>>> | null = null;

export function loadAllDemos(): Promise<Record<string, AlgorithmDemo<unknown, unknown>>> {
  if (cache) return Promise.resolve(cache);
  if (!loading) {
    loading = import('../algorithms/bulk').then((mod) => {
      cache = mod.buildAllDemos();
      return cache;
    });
  }
  return loading;
}

export async function getDemoAsync(id: string): Promise<AlgorithmDemo<unknown, unknown> | undefined> {
  const demos = await loadAllDemos();
  return demos[id];
}
