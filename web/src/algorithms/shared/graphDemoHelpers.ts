import type { GraphScene, HighlightKind, VisualStep } from '../../types/demo';

export function graphStep(
  base: GraphScene,
  patch: Partial<GraphScene>,
  captionKey: string,
  captionParams: Record<string, string | number> = {},
): VisualStep {
  return {
    captionKey,
    captionParams,
    scene: {
      kind: 'graph',
      nodes: patch.nodes ?? base.nodes,
      edges: patch.edges ?? base.edges,
      queue: patch.queue ?? base.queue,
      visited: patch.visited ?? base.visited,
    },
  };
}

export function markNodes(
  scene: GraphScene,
  visited: string[],
  current?: string,
  frontier?: string[],
): GraphScene['nodes'] {
  return scene.nodes.map((n) => ({
    ...n,
    state: (n.id === current
      ? 'active'
      : visited.includes(n.id)
        ? 'visited'
        : frontier?.includes(n.id)
          ? 'frontier'
          : undefined) as HighlightKind | undefined,
  }));
}

export function batchGraphStep(
  scene: GraphScene,
  visited: string[],
  captionKey: string,
  params: Record<string, string | number>,
  current?: string,
): VisualStep {
  return graphStep(
    scene,
    { nodes: markNodes(scene, visited, current), visited: [...visited], queue: [] },
    captionKey,
    params,
  );
}
