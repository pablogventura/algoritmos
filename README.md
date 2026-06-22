# Algoritmos

Visual algorithm playground published on GitHub Pages. **268 interactive demos** — all with handcrafted step-by-step animations covering every entry in the `docs/` corpus.

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

537 tests (one per catalog entry).

## Features

- **268 interactive demos** with step-by-step animation
- **Compare mode** at `/compare` (two algorithms, same input)
- **Shareable URLs** with input and step (`?data=&step=&lang=`)
- **Export GIF** from any demo page
- **Keyboard shortcuts**: Space, arrows, R, Home
- **i18n**: English default, Spanish toggle

## GitHub Pages

- Repository: `pablogventura/algoritmos` (project site)
- URL: https://pablogventura.github.io/algoritmos/
- Deploy: automatic on push to `main` via `.github/workflows/deploy.yml`

## Adding a visual demo

1. Run `npm run catalog` to refresh the index from `docs/`.
2. **Handcrafted (preferred):** add `generateSteps` under `web/src/algorithms/handcrafted/` or area batch modules and register in `web/src/algorithms/handcrafted/index.ts`.
3. **Auto-generated:** new catalog entries without a core demo use `web/src/algorithms/remaining/` (area-specific runners and steps).
4. Set `status: ready` in catalog (or update `READY_IDS` in `scripts/generate-catalog.ts`).
5. Add step strings to `web/src/locales/en/steps.json` and `es/steps.json` (handcrafted); bulk uses `steps.generic.*`.
6. Run `npm test` (537 tests, one per catalog entry).
7. See [`web/CONTRIBUTING.md`](web/CONTRIBUTING.md) and `npx tsx scripts/new-demo.ts <id>`.
