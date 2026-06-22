# Algoritmos

Visual algorithm playground published on GitHub Pages. **268 interactive demos** from the corpus in `docs/` (31 handcrafted step-by-step animations + 237 bulk demos by visual family). Sorting area is **100% handcrafted**.

## Structure

- [`docs/`](docs/) — algorithm corpus by area (reference notes)
- [`web/`](web/) — AlgoViz React app (Vite + TypeScript)
- [`scripts/`](scripts/) — catalog generation and validation

## Local development

```bash
npm install --prefix web
npm run dev
```

Open http://localhost:5173/

## Build

```bash
npm run build
```

Output: `web/dist/` (includes `404.html` for SPA routing on GitHub Pages).

## Tests

```bash
npm test
```

## GitHub Pages

- Repository: `pablogventura/algoritmos` (project site)
- URL: https://pablogventura.github.io/algoritmos/
- Deploy: automatic on push to `main` via `.github/workflows/deploy.yml`

## Adding a visual demo

1. Run `npm run catalog` to refresh the index from `docs/`.
2. **Handcrafted (preferred):** add `generateSteps` under `web/src/algorithms/handcrafted/` and register in `web/src/algorithms/handcrafted/index.ts`.
3. **Bulk fallback:** new catalog entries get a demo automatically via `web/src/algorithms/bulk/` (generic steps per `visualFamily`).
4. Set `status: ready` in catalog (or update `READY_IDS` in `scripts/generate-catalog.ts`).
5. Add step strings to `web/src/locales/en/steps.json` and `es/steps.json` (handcrafted); bulk uses `steps.generic.*`.
6. Run `npm test` (537 tests, one per catalog entry).
