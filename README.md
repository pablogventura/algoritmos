# Algoritmos

Visual algorithm playground published on GitHub Pages.

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
2. Implement `generateSteps` in `web/src/algorithms/`.
3. Register in `web/src/algorithms/registry.ts` and set `status: ready` in catalog (or update `READY_IDS` in `scripts/generate-catalog.ts`).
4. Add step strings to `web/src/locales/en/steps.json` and `es/steps.json`.
5. Run `npm test`.
