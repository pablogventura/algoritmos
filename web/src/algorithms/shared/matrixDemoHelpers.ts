import type { VisualStep } from '../../types/demo';

export function matrixPhaseSteps(
  cells: number[][],
  name: string,
  phases: string[],
): VisualStep[] {
  const steps: VisualStep[] = [
    {
      captionKey: 'steps.generic.start',
      captionParams: { name },
      scene: { kind: 'matrix', cells, highlights: {} },
    },
  ];
  for (let p = 0; p < phases.length; p++) {
    const i = p % cells.length;
    const j = p % (cells[0]?.length ?? 1);
    steps.push({
      captionKey: 'steps.batch.satPhase',
      captionParams: { phase: phases[p], row: i, col: j, name },
      scene: {
        kind: 'matrix',
        cells,
        highlights: { [`${i},${j}`]: 'active' },
      },
    });
  }
  steps.push({
    captionKey: 'steps.generic.done',
    captionParams: { name, summary: phases[phases.length - 1] ?? 'done' },
    scene: { kind: 'matrix', cells, highlights: {} },
  });
  return steps;
}

export function satPhases(id: string): string[] {
  if (id.includes('unit-propagation') || id.includes('dpll') || id.includes('cdcl'))
    return ['Unit propagate', 'Pure literal', 'Decide', 'Backtrack', 'Satisfiable'];
  if (id.includes('walksat')) return ['Random assignment', 'Pick clause', 'Flip var', 'Check'];
  return ['Load formula', 'Propagate', 'Decide', 'Resolve', 'Done'];
}
