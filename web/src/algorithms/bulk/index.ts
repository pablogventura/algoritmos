import { CATALOG } from '../../catalog';
import type { AlgorithmDemo } from '../../types/demo';
import { HANDCRAFTED_DEMOS } from '../handcrafted';
import { createBulkDemo } from './factory';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildAllDemos(): Record<string, AlgorithmDemo<any, any>> {
  const demos: Record<string, AlgorithmDemo<any, any>> = {};

  for (const entry of CATALOG) {
    if (!HANDCRAFTED_DEMOS[entry.id]) {
      demos[entry.id] = createBulkDemo(entry);
    }
  }

  return { ...demos, ...HANDCRAFTED_DEMOS };
}
