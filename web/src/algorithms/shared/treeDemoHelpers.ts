import type { HighlightKind, TreeNodeView, VisualStep } from '../../types/demo';

export interface BSTNode {
  id: string;
  key: number;
  left?: BSTNode;
  right?: BSTNode;
}

export function insertBST(root: BSTNode | undefined, key: number, id: string): BSTNode {
  if (!root) return { id, key };
  if (key < root.key) return { ...root, left: insertBST(root.left, key, `${id}L`) };
  if (key > root.key) return { ...root, right: insertBST(root.right, key, `${id}R`) };
  return root;
}

export function layoutTree(root: BSTNode | undefined, depth = 0, x = 200, spread = 120): TreeNodeView[] {
  if (!root) return [];
  const y = 40 + depth * 70;
  const nodes: TreeNodeView[] = [{ id: root.id, label: String(root.key), x, y, state: 'active' as HighlightKind }];
  const childSpread = Math.max(30, spread / 2);
  if (root.left) {
    nodes.push(...layoutTree(root.left, depth + 1, x - childSpread, childSpread).map((n) => ({ ...n, parentId: root.id })));
  }
  if (root.right) {
    nodes.push(...layoutTree(root.right, depth + 1, x + childSpread, childSpread).map((n) => ({ ...n, parentId: root.id })));
  }
  return nodes;
}

export function chainLayout(labels: string[], vertical = false): TreeNodeView[] {
  return labels.map((label, i) => ({
    id: label,
    label,
    x: vertical ? 200 : 60 + i * 70,
    y: vertical ? 40 + i * 55 : 160,
    parentId: i > 0 ? labels[i - 1] : undefined,
    state: i === labels.length - 1 ? ('active' as HighlightKind) : ('visited' as HighlightKind),
  }));
}

export function treeStep(
  nodes: TreeNodeView[],
  highlights: string[],
  captionKey: string,
  captionParams: Record<string, string | number> = {},
): VisualStep {
  return {
    captionKey,
    captionParams,
    scene: {
      kind: 'tree',
      nodes: nodes.map((n) => ({
        ...n,
        state: highlights.includes(n.id) ? 'active' : n.state,
      })),
      highlights,
    },
  };
}

export function buildBSTSteps(keys: number[], name: string): VisualStep[] {
  const steps: VisualStep[] = [
    treeStep([], [], 'steps.generic.start', { name }),
  ];
  let root: BSTNode | undefined;
  keys.forEach((key, i) => {
    root = insertBST(root, key, `n${i}`);
    const nodes = layoutTree(root);
    steps.push(treeStep(nodes, [nodes[nodes.length - 1]?.id ?? ''], 'steps.batch.treeInsert', { key, name }));
  });
  steps.push(treeStep(layoutTree(root), [], 'steps.generic.done', { name, summary: keys.join(', ') }));
  return steps;
}
