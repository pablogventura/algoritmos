# Adding a visual demo

## Checklist (Definition of Done)

- [ ] `generateSteps` emits `captionKey` + `scene` patches
- [ ] EN and ES strings in `src/locales/*/steps.json`
- [ ] ≥3 test cases in the demo module
- [ ] Registered in `src/algorithms/registry.ts`
- [ ] ID added to `READY_IDS` in `scripts/generate-catalog.ts`
- [ ] `npm test` passes

## Steps

1. Copy `src/algorithms/sorting/binarySearch.ts` or `src/algorithms/graphs/dijkstra.ts`.
2. Implement `buildInitialScene`, `generateSteps`, and `run`.
3. Add translations under `steps.<algorithmId>.*`.
4. Register demo and regenerate catalog: `npm run catalog` from repo root.
