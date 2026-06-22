import type { DemoInput, VisualStep } from '../../types/demo';
import { buildTimelineScene } from '../bulk/sceneDefaults';

export function timelinePhaseSteps(
  input: DemoInput,
  phases: string[],
  captionPrefix: string,
  name: string,
  summary: string,
  family?: import('../../types/demo').VisualFamily,
): VisualStep[] {
  const steps: VisualStep[] = [
    {
      captionKey: 'steps.generic.start',
      captionParams: { name },
      scene: buildTimelineScene({ ...input, labels: phases }, 0, family),
    },
  ];
  for (let i = 0; i < phases.length; i++) {
    steps.push({
      captionKey: `${captionPrefix}.phase`,
      captionParams: { phase: phases[i], step: i + 1, name },
      scene: buildTimelineScene({ ...input, labels: phases }, i, family),
    });
  }
  steps.push({
    captionKey: 'steps.generic.done',
    captionParams: { name, summary },
    scene: buildTimelineScene({ ...input, labels: phases }, phases.length - 1, family),
  });
  return steps;
}

export function defaultPhases(id: string): string[] {
  if (id.includes('huffman')) return ['Count freq', 'Build heap', 'Merge nodes', 'Assign codes'];
  if (id.includes('rsa') || id.includes('diffie')) return ['Choose primes', 'Compute keys', 'Encrypt', 'Decrypt'];
  if (id.includes('round-robin')) return ['Enqueue P1', 'Run quantum', 'Preempt', 'Switch'];
  if (id.includes('lru')) return ['Access page', 'Hit/Miss', 'Evict LRU', 'Update list'];
  if (id.includes('gradient')) return ['Init weights', 'Forward', 'Compute loss', 'Update'];
  if (id.includes('dpll') || id.includes('cdcl')) return ['Unit propagate', 'Decide', 'Branch', 'Backtrack'];
  if (id.includes('k-means')) return ['Pick centroids', 'Assign points', 'Recompute', 'Converge'];
  if (id.includes('fft')) return ['Bit-reverse', 'Butterfly stage 1', 'Stage 2', 'Combine'];
  return ['Initialize', 'Process', 'Update state', 'Complete'];
}
