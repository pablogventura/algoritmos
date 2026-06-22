import type { VisualStep } from '../../types/demo';

export function matrixPhaseSteps(
  cells: number[][],
  name: string,
  phases: string[],
): VisualStep[] {
  const rows = cells.length;
  const cols = cells[0]?.length ?? 0;
  const steps: VisualStep[] = [
    {
      captionKey: 'steps.generic.start',
      captionParams: { name },
      scene: { kind: 'matrix', cells, highlights: {}, waveFront: 0 },
    },
  ];
  for (let p = 0; p < phases.length; p++) {
    const i = p % rows;
    const j = (p + Math.floor(p / rows)) % Math.max(cols, 1);
    const highlights: Record<string, 'active' | 'compare' | 'frontier'> = {};
    for (let r = 0; r <= i; r++) {
      for (let c = 0; c <= j; c++) {
        if (r === i && c === j) highlights[`${r},${c}`] = 'active';
        else if (r === i || c === j) highlights[`${r},${c}`] = 'compare';
        else if (r + c <= p) highlights[`${r},${c}`] = 'frontier';
      }
    }
    const prevI = p > 0 ? (p - 1) % rows : i;
    const prevJ = p > 0 ? ((p - 1) + Math.floor((p - 1) / rows)) % Math.max(cols, 1) : j;
    steps.push({
      captionKey: 'steps.batch.satPhase',
      captionParams: { phase: phases[p], row: i, col: j, name },
      scene: {
        kind: 'matrix',
        cells,
        highlights,
        waveFront: p,
        dependency: p > 0 ? { from: `${prevI},${prevJ}`, to: `${i},${j}` } : undefined,
      },
    });
  }
  steps.push({
    captionKey: 'steps.generic.done',
    captionParams: { name, summary: phases[phases.length - 1] ?? 'done' },
    scene: {
      kind: 'matrix',
      cells,
      highlights: Object.fromEntries(
        cells.flatMap((row, ri) => row.map((_, ci) => [`${ri},${ci}`, 'sorted' as const])),
      ),
      waveFront: phases.length,
    },
  });
  return steps;
}

export function satPhases(id: string): string[] {
  if (id.includes('unit-propagation') || id.includes('dpll') || id.includes('cdcl'))
    return ['Unit propagate', 'Pure literal', 'Decide', 'Backtrack', 'Satisfiable'];
  if (id.includes('walksat')) return ['Random assignment', 'Pick clause', 'Flip var', 'Check'];
  return ['Load formula', 'Propagate', 'Decide', 'Resolve', 'Done'];
}
