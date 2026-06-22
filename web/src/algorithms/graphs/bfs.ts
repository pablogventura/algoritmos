import type { AlgorithmDemo, GraphScene, VisualStep } from '../../types/demo';
import {
  buildAdjacency,
  initialGraphScene,
  type GraphInput,
} from './graphUtils';

export interface GraphTraversalOutput {
  order: string[];
}

function graphStep(
  base: GraphScene,
  patch: Partial<GraphScene>,
  captionKey: string,
  captionParams: Record<string, string | number>,
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

function applyNodeStates(
  scene: GraphScene,
  visited: string[],
  queue: string[],
  current?: string,
): GraphScene['nodes'] {
  return scene.nodes.map((n) => ({
    ...n,
    state:
      n.id === current
        ? 'active'
        : visited.includes(n.id)
          ? 'visited'
          : queue.includes(n.id)
            ? 'frontier'
            : undefined,
  }));
}

export const bfsDemo: AlgorithmDemo<GraphInput, GraphTraversalOutput> = {
  id: 'bfs',
  visualFamily: 'graph-view',
  metadata: {
    problemKey: 'algorithms.bfs.problem',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
  },
  defaultInput: {
    nodes: ['A', 'B', 'C', 'D', 'E', 'F'],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'A', to: 'C' },
      { from: 'B', to: 'D' },
      { from: 'C', to: 'E' },
      { from: 'D', to: 'F' },
      { from: 'E', to: 'F' },
    ],
    start: 'A',
  },
  buildInitialScene(input) {
    return initialGraphScene(input);
  },
  generateSteps(input) {
    const scene = initialGraphScene(input);
    const adj = buildAdjacency(input);
    const steps: VisualStep[] = [];
    const visited: string[] = [];
    const queue: string[] = [input.start];
    const order: string[] = [];

    steps.push(
      graphStep(scene, { queue: [...queue], visited: [] }, 'steps.bfs.start', {
        start: input.start,
      }),
    );

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.includes(current)) continue;
      visited.push(current);
      order.push(current);

      steps.push(
        graphStep(
          scene,
          {
            nodes: applyNodeStates(scene, visited, queue, current),
            queue: [...queue],
            visited: [...visited],
          },
          'steps.bfs.dequeue',
          { node: current },
        ),
      );

      for (const { to } of adj.get(current) ?? []) {
        if (!visited.includes(to) && !queue.includes(to)) {
          queue.push(to);
          steps.push(
            graphStep(
              scene,
              {
                nodes: applyNodeStates(scene, visited, queue, current),
                queue: [...queue],
                visited: [...visited],
              },
              'steps.bfs.enqueue',
              { from: current, to },
            ),
          );
        }
      }
    }

    steps.push(
      graphStep(
        scene,
        {
          nodes: applyNodeStates(scene, visited, [], undefined),
          queue: [],
          visited: [...visited],
        },
        'steps.bfs.done',
        { order: order.join(', ') },
      ),
    );
    return steps;
  },
  run(input) {
    const adj = buildAdjacency(input);
    const visited = new Set<string>();
    const order: string[] = [];
    const queue = [input.start];
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;
      visited.add(current);
      order.push(current);
      for (const { to } of adj.get(current) ?? []) {
        if (!visited.has(to) && !queue.includes(to)) queue.push(to);
      }
    }
    return { order };
  },
  testCases: [
    {
      name: 'line graph',
      input: {
        nodes: ['A', 'B', 'C'],
        edges: [
          { from: 'A', to: 'B' },
          { from: 'B', to: 'C' },
        ],
        start: 'A',
      },
      expected: { order: ['A', 'B', 'C'] },
    },
    {
      name: 'star',
      input: {
        nodes: ['A', 'B', 'C', 'D'],
        edges: [
          { from: 'A', to: 'B' },
          { from: 'A', to: 'C' },
          { from: 'A', to: 'D' },
        ],
        start: 'A',
      },
      expected: { order: ['A', 'B', 'C', 'D'] },
    },
    {
      name: 'single node',
      input: { nodes: ['X'], edges: [], start: 'X' },
      expected: { order: ['X'] },
    },
  ],
};
