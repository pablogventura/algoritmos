import type { AlgorithmDemo } from '../../types/demo';
import { buildTimelineScene } from '../bulk/sceneDefaults';
import { timelinePhaseSteps } from '../shared/timelineDemoHelpers';

type OverviewDemo = AlgorithmDemo<{ labels?: string[]; values?: number[] }, unknown>;

function patternOverview(
  id: string,
  name: string,
  phases: string[],
  result: unknown,
  time: string,
  space: string,
): OverviewDemo {
  const defaultInput = { labels: phases, values: phases.map((_, i) => i + 1) };
  return {
    id,
    visualFamily: 'system-sim',
    metadata: { timeComplexity: time, spaceComplexity: space },
    defaultInput,
    buildInitialScene: (input) => buildTimelineScene({ ...input, labels: phases }, 0, 'system-sim'),
    generateSteps: (input) =>
      timelinePhaseSteps(input, phases, 'steps.patternOverview.phase', name, String(JSON.stringify(result)).slice(0, 48), 'system-sim'),
    run: () => result,
    testCases: [{ name: 'default', input: defaultInput, expected: result }],
  };
}

export const PATTERN_OVERVIEW_DEMOS: Record<string, OverviewDemo> = {
  'fuerza-bruta-inteligente': patternOverview(
    'fuerza-bruta-inteligente',
    'Fuerza bruta inteligente',
    ['enumerar candidatos', 'aplicar poda', 'meet-in-the-middle'],
    { techniques: 3 },
    'O(2^n) → O(2^(n/2))',
    'O(n)',
  ),
  'divide-y-venceras': patternOverview(
    'divide-y-venceras',
    'Divide y vencerás',
    ['dividir', 'resolver subproblemas', 'combinar'],
    { paradigm: 'divide-conquer' },
    'O(n log n)',
    'O(log n)',
  ),
  'programacion-dinamica': patternOverview(
    'programacion-dinamica',
    'Programación dinámica',
    ['definir subestructura', 'relación de recurrencia', 'tabla + reconstrucción'],
    { optimal: true },
    'O(n·W) típico',
    'O(n·W)',
  ),
  voraces: patternOverview(
    'voraces',
    'Voraces',
    ['ordenar por criterio local', 'elegir óptimo local', 'demostrar corrección'],
    { greedy: true },
    'O(n log n)',
    'O(n)',
  ),
  backtracking: patternOverview(
    'backtracking',
    'Backtracking',
    ['asignar variable', 'comprobar restricciones', 'retroceder si falla'],
    { solutions: 2 },
    'O(n!) peor caso',
    'O(n)',
  ),
  'branch-and-bound': patternOverview(
    'branch-and-bound',
    'Branch and bound',
    ['relajación / cota', 'ramificar', 'podar por bound'],
    { best: 10 },
    'exponencial',
    'O(n)',
  ),
  aleatorizados: patternOverview(
    'aleatorizados',
    'Aleatorizados',
    ['elegir al azar', 'probabilidad de éxito', 'amplificar con repeticiones'],
    { success: 0.99 },
    'esperado O(n log n)',
    'O(1)',
  ),
  amortizados: patternOverview(
    'amortizados',
    'Amortizados',
    ['operación barata usual', 'operación cara ocasional', 'costo amortizado O(1)'],
    { amortized: 1 },
    'O(1) amortizado',
    'O(n)',
  ),
  aproximacion: patternOverview(
    'aproximacion',
    'Aproximación',
    ['algoritmo polinomial', 'ratio de aproximación', 'trade-off calidad/tiempo'],
    { ratio: 2 },
    'O(n log n)',
    'O(n)',
  ),
  online: patternOverview(
    'online',
    'Online',
    ['decidir sin futuro', 'comparar con adversario', 'competitiveness ratio'],
    { competitive: 2 },
    'por request',
    'O(1)',
  ),
  streaming: patternOverview(
    'streaming',
    'Streaming',
    ['un pase sobre datos', 'sketch compacto', 'estimación con error acotado'],
    { memory: 'O(log n)' },
    'O(n)',
    'O(log n)',
  ),
  paralelos: patternOverview(
    'paralelos',
    'Paralelos',
    ['particionar trabajo', 'sincronizar', 'analizar work/span'],
    { span: 2, work: 8 },
    'O(n/p + log p)',
    'O(n)',
  ),
  distribuidos: patternOverview(
    'distribuidos',
    'Distribuidos',
    ['mensajes entre nodos', 'tolerar fallos', 'consenso / snapshot'],
    { nodes: 3, decided: true },
    'O(n) mensajes',
    'O(n)',
  ),
};
