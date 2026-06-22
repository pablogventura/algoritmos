import type { AlgorithmDemo, CatalogEntry, DemoInput } from '../../types/demo';
import {
  buildInitialScene,
  COMPLEXITY_BY_FAMILY,
  defaultInputFor,
} from './sceneDefaults';
import { buildBulkSteps } from './steps';
import { defaultTestCases, runAlgorithm } from './runners';

export function createBulkDemo(entry: CatalogEntry): AlgorithmDemo<DemoInput> {
  const defaultInput = defaultInputFor(entry);
  const complexity = COMPLEXITY_BY_FAMILY[entry.visualFamily];

  return {
    id: entry.id,
    visualFamily: entry.visualFamily,
    metadata: {
      timeComplexity: complexity.time,
      spaceComplexity: complexity.space,
    },
    defaultInput,
    buildInitialScene: (input) => buildInitialScene(entry.visualFamily, input),
    generateSteps: (input) => {
      const result = runAlgorithm(entry, input);
      return buildBulkSteps(entry, input, result);
    },
    run: (input) => runAlgorithm(entry, input),
    testCases: defaultTestCases(entry, defaultInput),
  };
}
