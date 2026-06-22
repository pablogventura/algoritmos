import type {
  ArrayScene,
  GraphScene,
  MatrixScene,
  SceneState,
  StringScene,
  TimelineScene,
  TreeScene,
  VisualStep,
} from '../types/demo';

function mergeArrayScene(base: ArrayScene, patch: Partial<ArrayScene>): ArrayScene {
  return {
    kind: 'array',
    values: patch.values ?? base.values,
    highlights: { ...base.highlights, ...(patch.highlights ?? {}) },
    pointers: { ...base.pointers, ...(patch.pointers ?? {}) },
  };
}

function mergeGraphScene(base: GraphScene, patch: Partial<GraphScene>): GraphScene {
  return {
    kind: 'graph',
    nodes: patch.nodes ?? base.nodes,
    edges: patch.edges ?? base.edges,
    queue: patch.queue ?? base.queue,
    visited: patch.visited ?? base.visited,
  };
}

function mergeTreeScene(base: TreeScene, patch: Partial<TreeScene>): TreeScene {
  return {
    kind: 'tree',
    nodes: patch.nodes ?? base.nodes,
    highlights: patch.highlights ?? base.highlights,
  };
}

function mergeMatrixScene(base: MatrixScene, patch: Partial<MatrixScene>): MatrixScene {
  return {
    kind: 'matrix',
    cells: patch.cells ?? base.cells,
    highlights: { ...base.highlights, ...(patch.highlights ?? {}) },
    rowLabels: patch.rowLabels ?? base.rowLabels,
    colLabels: patch.colLabels ?? base.colLabels,
    waveFront: patch.waveFront ?? base.waveFront,
    dependency: patch.dependency ?? base.dependency,
  };
}

function mergeStringScene(base: StringScene, patch: Partial<StringScene>): StringScene {
  return {
    kind: 'string',
    primary: patch.primary ?? base.primary,
    secondary: patch.secondary ?? base.secondary,
    pointers: { ...base.pointers, ...(patch.pointers ?? {}) },
    highlights: patch.highlights ?? base.highlights,
  };
}

function mergeTimelineScene(base: TimelineScene, patch: Partial<TimelineScene>): TimelineScene {
  return {
    kind: 'timeline',
    items: patch.items ?? base.items,
    messages: patch.messages ?? base.messages,
    bits: patch.bits ?? base.bits,
    activeIndex: patch.activeIndex ?? base.activeIndex,
    vizMode: patch.vizMode ?? base.vizMode,
    sparkline: patch.sparkline ?? base.sparkline,
    waveform: patch.waveform ?? base.waveform,
    networkNodes: patch.networkNodes ?? base.networkNodes,
    networkEdges: patch.networkEdges ?? base.networkEdges,
    metrics: patch.metrics ?? base.metrics,
    resourceSlots: patch.resourceSlots ?? base.resourceSlots,
  };
}

export function applyStep(scene: SceneState, patch: VisualStep['scene']): SceneState {
  if (patch.kind === 'array' && scene.kind === 'array') return mergeArrayScene(scene, patch);
  if (patch.kind === 'graph' && scene.kind === 'graph') return mergeGraphScene(scene, patch);
  if (patch.kind === 'tree' && scene.kind === 'tree') return mergeTreeScene(scene, patch);
  if (patch.kind === 'matrix' && scene.kind === 'matrix') return mergeMatrixScene(scene, patch);
  if (patch.kind === 'string' && scene.kind === 'string') return mergeStringScene(scene, patch);
  if (patch.kind === 'timeline' && scene.kind === 'timeline') return mergeTimelineScene(scene, patch);
  return scene;
}

export function composeScene(initial: SceneState, steps: VisualStep[], index: number): SceneState {
  let scene = structuredClone(initial) as SceneState;
  for (let i = 0; i <= index && i < steps.length; i++) {
    scene = applyStep(scene, steps[i].scene);
  }
  return scene;
}
