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

export interface TreeNodeView {
  id: string;
  label: string;
  x: number;
  y: number;
  parentId?: string;
  state?: HighlightKind;
}

export interface TreeScene {
  kind: 'tree';
  nodes: TreeNodeView[];
  highlights: string[];
}

export interface MatrixScene {
  kind: 'matrix';
  cells: number[][];
  highlights: Record<string, HighlightKind>;
  rowLabels?: string[];
  colLabels?: string[];
  waveFront?: number;
  dependency?: { from: string; to: string };
}

export interface StringScene {
  kind: 'string';
  primary: string;
  secondary?: string;
  pointers: Record<string, number>;
  highlights: number[];
}

export interface TimelineItem {
  id: string;
  label: string;
  start: number;
  end: number;
  color?: string;
}

export interface TimelineMessage {
  from: string;
  to: string;
  text: string;
}

export interface TimelineNetworkNode {
  id: string;
  label: string;
  x: number;
  y: number;
  role?: 'active' | 'idle' | 'leader' | 'target';
}

export interface TimelineNetworkEdge {
  from: string;
  to: string;
  active?: boolean;
}

export type TimelineVizMode = 'pipeline' | 'network' | 'signal' | 'convergence' | 'resources';

export interface TimelineMetric {
  label: string;
  value: number;
  max?: number;
  unit?: string;
}

export interface TimelineScene {
  kind: 'timeline';
  items: TimelineItem[];
  messages: TimelineMessage[];
  bits: string;
  activeIndex: number;
  vizMode?: TimelineVizMode;
  sparkline?: number[];
  waveform?: number[];
  networkNodes?: TimelineNetworkNode[];
  networkEdges?: TimelineNetworkEdge[];
  metrics?: TimelineMetric[];
  resourceSlots?: { label: string; filled: boolean; hot?: boolean }[];
}

export type SceneState = ArrayScene | GraphScene | TreeScene | MatrixScene | StringScene | TimelineScene;

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
  problemKey?: string;
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

export type DemoInput = Record<string, unknown>;
