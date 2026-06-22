import type { SceneState, VisualStep, ArrayScene, GraphScene } from '../types/demo';

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

export function applyStep(scene: SceneState, patch: VisualStep['scene']): SceneState {
  if (patch.kind === 'array' && scene.kind === 'array') {
    return mergeArrayScene(scene, patch as Partial<ArrayScene>);
  }
  if (patch.kind === 'graph' && scene.kind === 'graph') {
    return mergeGraphScene(scene, patch as Partial<GraphScene>);
  }
  return scene;
}

export function composeScene(initial: SceneState, steps: VisualStep[], index: number): SceneState {
  let scene = structuredClone(initial) as SceneState;
  for (let i = 0; i <= index && i < steps.length; i++) {
    scene = applyStep(scene, steps[i].scene);
  }
  return scene;
}

export function resetHighlights(scene: SceneState): SceneState {
  if (scene.kind === 'array') {
    return { ...scene, highlights: {}, pointers: {} };
  }
  return {
    ...scene,
    nodes: scene.nodes.map((n) => ({ ...n, state: undefined })),
    edges: scene.edges.map((e) => ({ ...e, state: undefined })),
    queue: [],
    visited: [],
  };
}
