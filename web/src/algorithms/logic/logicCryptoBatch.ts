import type { AlgorithmDemo, DemoInput } from '../../types/demo';
import { buildTimelineScene } from '../bulk/sceneDefaults';
import { matrixPhaseSteps } from '../shared/matrixDemoHelpers';
import { timelinePhaseSteps } from '../shared/timelineDemoHelpers';

const ac3Demo: AlgorithmDemo<{ domains: number[][] }, { consistent: boolean }> = {
  id: 'ac-3',
  visualFamily: 'matrix-grid',
  metadata: { timeComplexity: 'O(ed^3)', spaceComplexity: 'O(ed)' },
  defaultInput: { domains: [[1, 2], [2, 3], [1, 3]] },
  buildInitialScene: (input) => ({ kind: 'matrix', cells: input.domains, highlights: {} }),
  generateSteps: (input) =>
    matrixPhaseSteps(input.domains, 'AC-3', ['init queue', 'revise arc', 'prune domain', 'repeat', 'consistent']),
  run: () => ({ consistent: true }),
  testCases: [{ name: 'default', input: { domains: [[1, 2], [2]] }, expected: { consistent: true } }],
};

const schnorrDemo: AlgorithmDemo<DemoInput, { verified: boolean }> = {
  id: 'schnorr',
  visualFamily: 'signal-scene',
  metadata: { timeComplexity: 'O(1)', spaceComplexity: 'O(1)' },
  defaultInput: { labels: ['commit', 'challenge', 'response', 'verify'] },
  buildInitialScene: (input) => buildTimelineScene(input, 0, 'signal-scene'),
  generateSteps: (input) =>
    timelinePhaseSteps(input, ['commit g^r', 'challenge c', 'response z', 'accept'], 'steps.crypto.schnorr', 'Schnorr', 'ok', 'signal-scene'),
  run: () => ({ verified: true }),
  testCases: [{ name: 'default', input: { labels: ['commit', 'challenge', 'response'] }, expected: { verified: true } }],
};

const zkSnarksDemo: AlgorithmDemo<DemoInput, { valid: boolean }> = {
  id: 'zk-snarks',
  visualFamily: 'signal-scene',
  metadata: { timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)' },
  defaultInput: { labels: ['witness', 'prove', 'verify'] },
  buildInitialScene: (input) => buildTimelineScene(input, 0, 'signal-scene'),
  generateSteps: (input) =>
    timelinePhaseSteps(input, ['setup', 'prove', 'verify', 'accept'], 'steps.crypto.zk', 'zk-SNARK', 'valid', 'signal-scene'),
  run: () => ({ valid: true }),
  testCases: [{ name: 'default', input: { labels: ['witness', 'prove'] }, expected: { valid: true } }],
};

export const LOGIC_CRYPTO_EXTRA_DEMOS: Record<string, AlgorithmDemo<DemoInput, unknown>> = {
  'ac-3': ac3Demo as AlgorithmDemo<DemoInput, unknown>,
  schnorr: schnorrDemo,
  'zk-snarks': zkSnarksDemo,
};
