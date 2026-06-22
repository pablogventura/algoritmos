import { CATALOG } from '../../catalog';
import type { AlgorithmDemo, CatalogEntry, DemoInput } from '../../types/demo';
import { buildInitialScene, COMPLEXITY_BY_FAMILY, defaultInputFor } from '../bulk/sceneDefaults';
import { buildRemainingSteps } from './steps';
import { runRemaining } from './runners';

function buildTestCases(entry: CatalogEntry, defaultInput: DemoInput) {
  return [
    { name: 'default', input: defaultInput, expected: runRemaining(entry, defaultInput) },
    { name: 'repeat', input: defaultInput, expected: runRemaining(entry, defaultInput) },
    { name: 'verify', input: defaultInput, expected: runRemaining(entry, defaultInput) },
  ];
}

export function createRemainingDemo(entry: CatalogEntry): AlgorithmDemo<DemoInput> {
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
    generateSteps: (input) => buildRemainingSteps(entry, input, runRemaining(entry, input)),
    run: (input) => runRemaining(entry, input),
    testCases: buildTestCases(entry, defaultInput),
  };
}

export function buildRemainingDemos(existingIds: Set<string>): Record<string, AlgorithmDemo<DemoInput>> {
  const demos: Record<string, AlgorithmDemo<DemoInput>> = {};
  for (const entry of CATALOG) {
    if (!existingIds.has(entry.id)) demos[entry.id] = createRemainingDemo(entry);
  }
  return demos;
}
