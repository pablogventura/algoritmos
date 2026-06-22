import type { AlgorithmDemo, TreeNodeView, VisualStep } from '../../types/demo';
import {
  buildBSTSteps,
  chainLayout,
  insertBST,
  layoutTree,
  treeStep,
  type BSTNode,
} from '../shared/treeDemoHelpers';

type StructureDemo = AlgorithmDemo<{ keys: number[] }, unknown>;

const DEFAULT_KEYS = [8, 3, 10, 1, 6, 14, 4, 7];

function makeStructureDemo(
  id: string,
  buildSteps: (keys: number[], name: string) => VisualStep[],
  run: (keys: number[]) => unknown,
  testKeys = DEFAULT_KEYS,
): StructureDemo {
  return {
    id,
    visualFamily: 'tree-view',
    metadata: { timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)' },
    defaultInput: { keys: [...DEFAULT_KEYS] },
    buildInitialScene(input) {
      const root = input.keys.reduce<BSTNode | undefined>((r, k, i) => insertBST(r, k, `n${i}`), undefined);
      return { kind: 'tree', nodes: layoutTree(root), highlights: [] };
    },
    generateSteps(input) {
      return buildSteps(input.keys, id);
    },
    run: (input) => run(input.keys),
    testCases: [
      { name: 'default', input: { keys: testKeys }, expected: run(testKeys) },
      { name: 'small', input: { keys: [5, 2, 8] }, expected: run([5, 2, 8]) },
      { name: 'sorted', input: { keys: [1, 2, 3, 4] }, expected: run([1, 2, 3, 4]) },
    ],
  };
}

function heapLayout(keys: number[]): TreeNodeView[] {
  return keys.map((k, i) => ({
    id: `h${i}`,
    label: String(k),
    x: 80 + (i % 4) * 80,
    y: 40 + Math.floor(i / 4) * 70,
    parentId: i > 0 ? `h${Math.floor((i - 1) / 2)}` : undefined,
    state: i === 0 ? 'active' : 'visited',
  }));
}

function heapSteps(keys: number[], name: string): VisualStep[] {
  const arr = [...keys];
  const steps: VisualStep[] = [treeStep(heapLayout(arr), [], 'steps.generic.start', { name })];
  for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
    steps.push(treeStep(heapLayout(arr), [`h${i}`], 'steps.batch.heapify', { i, name }));
  }
  steps.push(treeStep(heapLayout([...arr].sort((a, b) => b - a)), [], 'steps.generic.done', { name, summary: 'heap built' }));
  return steps;
}

function linearSteps(keys: number[], name: string, structure: string): VisualStep[] {
  const labels = keys.map(String);
  const steps: VisualStep[] = [treeStep(chainLayout([]), [], 'steps.generic.start', { name })];
  for (let i = 0; i < labels.length; i++) {
    steps.push(treeStep(chainLayout(labels.slice(0, i + 1), structure === 'stack'), [labels[i]], 'steps.batch.linearPush', { value: labels[i], name }));
  }
  steps.push(treeStep(chainLayout(labels, structure === 'stack'), [], 'steps.generic.done', { name, summary: labels.join('→') }));
  return steps;
}

function trieSteps(keys: number[], name: string): VisualStep[] {
  const steps: VisualStep[] = [treeStep([], [], 'steps.generic.start', { name })];
  const nodes: TreeNodeView[] = [];
  keys.forEach((k, ki) => {
    const s = String(k);
    for (let ci = 0; ci < s.length; ci++) {
      const id = `${ki}-${ci}`;
      nodes.push({
        id,
        label: s[ci],
        x: 60 + ci * 50,
        y: 40 + ki * 60,
        parentId: ci > 0 ? `${ki}-${ci - 1}` : undefined,
        state: 'active',
      });
      steps.push(treeStep([...nodes], [id], 'steps.batch.trieInsert', { char: s[ci], key: k }));
    }
  });
  steps.push(treeStep(nodes, [], 'steps.generic.done', { name, summary: `${keys.length} keys` }));
  return steps;
}

function hashSteps(keys: number[], name: string): VisualStep[] {
  const steps: VisualStep[] = [treeStep([], [], 'steps.generic.start', { name })];
  const buckets = 5;
  keys.forEach((k) => {
    const slot = k % buckets;
    const nodes: TreeNodeView[] = [{ id: `b${slot}-${k}`, label: String(k), x: 60 + slot * 70, y: 160, state: 'active' }];
    steps.push(treeStep(nodes, [`b${slot}-${k}`], 'steps.batch.hashInsert', { key: k, slot, name }));
  });
  steps.push(treeStep([], [], 'steps.generic.done', { name, summary: `${keys.length} inserts` }));
  return steps;
}

const BST_IDS = new Set([
  'arboles-binarios-de-busqueda',
  'avl',
  'red-black-trees',
  'splay-trees',
  'treaps',
  'b-trees',
  'b-plus-trees',
]);

const HEAP_IDS = new Set(['heaps-binarios', 'heaps-d-arios', 'binomial-heaps', 'fibonacci-heaps', 'colas-de-prioridad']);

const LINEAR_STACK = new Set(['pilas']);
const LINEAR_QUEUE = new Set(['colas', 'listas-enlazadas', 'arrays-dinamicos']);

const TRIE_IDS = new Set(['tries', 'radix-trees', 'suffix-trees']);

const HASH_IDS = new Set([
  'hash-tables',
  'hashing-universal',
  'robin-hood-hashing',
  'cuckoo-hashing',
  'bloom-filters',
  'count-min-sketch',
  'hyperloglog',
]);

const SEGMENT_IDS = new Set(['segment-trees', 'fenwick-trees', 'sparse-tables', 'suffix-arrays', 'skip-lists']);

function buildDemoForId(id: string): StructureDemo {
  if (BST_IDS.has(id)) {
    return makeStructureDemo(id, (keys, name) => buildBSTSteps(keys, name), (keys) => ({ keys: [...keys].sort((a, b) => a - b) }));
  }
  if (HEAP_IDS.has(id)) {
    return makeStructureDemo(id, heapSteps, (keys) => ({ heap: [...keys].sort((a, b) => b - a) }));
  }
  if (LINEAR_STACK.has(id)) {
    return makeStructureDemo(id, (keys, name) => linearSteps(keys, name, 'stack'), (keys) => ({ stack: [...keys] }));
  }
  if (LINEAR_QUEUE.has(id)) {
    return makeStructureDemo(id, (keys, name) => linearSteps(keys, name, 'queue'), (keys) => ({ queue: [...keys] }));
  }
  if (TRIE_IDS.has(id)) {
    return makeStructureDemo(id, trieSteps, (keys) => ({ keys: keys.map(String) }));
  }
  if (HASH_IDS.has(id)) {
    return makeStructureDemo(id, hashSteps, (keys) => ({ slots: keys.map((k) => k % 5) }));
  }
  if (SEGMENT_IDS.has(id)) {
    return makeStructureDemo(
      id,
      (keys, name) => {
        const steps = buildBSTSteps(keys, name);
        steps.splice(1, 0, treeStep(layoutTree(keys.reduce<BSTNode | undefined>((r, k, i) => insertBST(r, k, `n${i}`), undefined)), [], 'steps.batch.segmentBuild', { n: keys.length, name }));
        return steps;
      },
      (keys) => ({ range: Math.max(...keys) - Math.min(...keys) }),
    );
  }
  return makeStructureDemo(id, (keys, name) => buildBSTSteps(keys, name), (keys) => ({ keys: [...keys].sort((a, b) => a - b) }));
}

const STRUCTURE_IDS = [
  'arboles-binarios-de-busqueda',
  'arrays-dinamicos',
  'avl',
  'b-trees',
  'b-plus-trees',
  'binomial-heaps',
  'bloom-filters',
  'colas',
  'colas-de-prioridad',
  'count-min-sketch',
  'cuckoo-hashing',
  'fenwick-trees',
  'fibonacci-heaps',
  'hash-tables',
  'hashing-universal',
  'heaps-binarios',
  'heaps-d-arios',
  'hyperloglog',
  'listas-enlazadas',
  'pilas',
  'radix-trees',
  'red-black-trees',
  'robin-hood-hashing',
  'segment-trees',
  'skip-lists',
  'sparse-tables',
  'splay-trees',
  'suffix-arrays',
  'suffix-trees',
  'treaps',
  'tries',
];

export const DATA_STRUCTURE_DEMOS: Record<string, StructureDemo> = Object.fromEntries(
  STRUCTURE_IDS.map((id) => [id, buildDemoForId(id)]),
);
