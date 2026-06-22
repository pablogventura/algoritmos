import type { CatalogEntry, DemoInput, VisualStep } from '../../types/demo';
import { buildBulkSteps } from '../bulk/steps';
import { buildInitialScene } from '../bulk/sceneDefaults';
import type { MatrixInput } from '../bulk/sceneDefaults';
import { matrixPhaseSteps, satPhases } from '../shared/matrixDemoHelpers';
import { buildBSTSteps } from '../shared/treeDemoHelpers';
import { defaultPhases, timelinePhaseSteps } from '../shared/timelineDemoHelpers';

export function buildRemainingSteps(entry: CatalogEntry, input: DemoInput, result: unknown): VisualStep[] {
  switch (entry.visualFamily) {
    case 'signal-scene':
    case 'state-machine':
      return timelinePhaseSteps(input, defaultPhases(entry.id), 'steps.batch.timeline', entry.name, String(JSON.stringify(result)).slice(0, 40));
    case 'system-sim':
      return timelinePhaseSteps(
        input,
        (input as { labels?: string[] }).labels ?? defaultPhases(entry.id),
        'steps.batch.system',
        entry.name,
        String(JSON.stringify(result)).slice(0, 40),
      );
    case 'numeric-scene':
      return numericSteps(entry, input, result);
    case 'matrix-grid':
      return matrixPhaseSteps(
        (input as unknown as MatrixInput).values,
        entry.name,
        satPhases(entry.id),
      );
    case 'tree-view':
      if (entry.area === 'bases-de-datos') return dbTreeSteps(entry, input, result);
      return buildBulkSteps(entry, input, result);
    default:
      return buildBulkSteps(entry, input, result);
  }
}

function numericSteps(entry: CatalogEntry, input: DemoInput, result: unknown): VisualStep[] {
  const values = (input as { values?: number[] }).values ?? [1, 2, 3, 4, 5];
  const history =
    result && typeof result === 'object' && 'history' in (result as object)
      ? (result as { history: number[] }).history
      : values;
  const seq = Array.isArray(history) ? history : values;
  const phases = seq.map((v, i) => `iter ${i + 1}: ${Number(v).toFixed(2)}`);
  return timelinePhaseSteps(input, phases.length ? phases : defaultPhases(entry.id), 'steps.batch.numeric', entry.name, String(seq[seq.length - 1] ?? ''));
}

function dbTreeSteps(entry: CatalogEntry, input: DemoInput, _result: unknown): VisualStep[] {
  const keys = (input as { keys?: number[] }).keys ?? (input as { values?: number[] }).values ?? [10, 20, 30, 40];
  const steps = buildBSTSteps(keys, entry.name);
  if (entry.id.includes('join')) {
    steps.splice(1, 0, {
      captionKey: 'steps.batch.joinProbe',
      captionParams: { name: entry.name, rows: keys.length },
      scene: buildInitialScene('tree-view', input),
    });
  }
  return steps;
}
