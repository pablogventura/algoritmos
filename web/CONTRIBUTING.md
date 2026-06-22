# Contributing a visual demo

Checklist for adding or improving an AlgoViz demo (solo workflow).

## Quick start

```bash
npm run catalog
npx tsx scripts/new-demo.ts my-algorithm sorting
```

## Definition of done

1. `generateSteps` returns at least one step with valid `captionKey` and `scene`.
2. Step strings exist in `web/src/locales/en/steps.json` and `es/steps.json`.
3. `run()` matches `testCases` (Vitest runs one test per catalog entry).
4. Demo registered in `web/src/algorithms/handcrafted/index.ts` (or covered by `remaining/` factory).
5. `npm test` passes.

## Templates to copy

- Array bars: `web/src/algorithms/sorting/binarySearch.ts`
- Graph: `web/src/algorithms/graphs/dijkstra.ts`

## Visual families

| Family | Use for |
|--------|---------|
| `array-bars` | Sorting, selection, heaps as arrays |
| `graph-view` | BFS, shortest paths, MST, flows |
| `tree-view` | BST, heaps, B-trees |
| `string-scene` | KMP, edit distance |
| `matrix-grid` | SAT, dynamic programming grids |
| `signal-scene` / `system-sim` | OS, crypto timelines |

## Shareable URLs

- Single demo: `/algo/quicksort?data=5,2,8,1&step=12&lang=es`
- Compare: `/compare?left=quicksort&right=mergesort&data=5,2,8,1`

Use `appUrl()` and `buildAlgoShareUrl()` from `web/src/lib/`.
