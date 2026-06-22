export type VisualFamily =
  | 'array-bars'
  | 'graph-view'
  | 'tree-view'
  | 'matrix-grid'
  | 'string-scene'
  | 'flow-network'
  | 'state-machine'
  | 'numeric-scene'
  | 'system-sim'
  | 'signal-scene';

export type DemoStatus = 'ready' | 'draft' | 'planned';

export type HighlightKind =
  | 'default'
  | 'compare'
  | 'active'
  | 'sorted'
  | 'found'
  | 'discarded'
  | 'pivot'
  | 'visited'
  | 'frontier'
  | 'path'
  | 'mst';

export interface ArrayScene {
  kind: 'array';
  values: number[];
  highlights: Partial<Record<number, HighlightKind>>;
  pointers: Record<string, number>;
}

export interface GraphNodeView {
  id: string;
  label: string;
  x: number;
  y: number;
  state?: HighlightKind;
  distance?: number | string;
}

export interface GraphEdgeView {
  from: string;
  to: string;
  weight?: number;
  directed?: boolean;
  state?: HighlightKind;
}

export interface GraphScene {
  kind: 'graph';
  nodes: GraphNodeView[];
  edges: GraphEdgeView[];
  queue: string[];
  visited: string[];
}

export type SceneState = ArrayScene | GraphScene;

export interface VisualStep {
  captionKey: string;
  captionParams?: Record<string, string | number>;
  durationMs?: number;
  scene: Partial<SceneState> & { kind: SceneState['kind'] };
}

export interface TestCase<TInput = unknown, TOutput = unknown> {
  name: string;
  input: TInput;
  expected: TOutput;
}

export interface AlgorithmMetadata {
  problemKey: string;
  timeComplexity: string;
  spaceComplexity: string;
}

export interface AlgorithmDemo<TInput = unknown, TOutput = unknown> {
  id: string;
  visualFamily: VisualFamily;
  metadata: AlgorithmMetadata;
  defaultInput: TInput;
  buildInitialScene(input: TInput): SceneState;
  generateSteps(input: TInput): VisualStep[];
  run(input: TInput): TOutput;
  testCases: TestCase<TInput, TOutput>[];
}

export interface CatalogEntry {
  id: string;
  name: string;
  area: string;
  status: DemoStatus;
  visualFamily: VisualFamily;
  visualMetaphor: string;
}
