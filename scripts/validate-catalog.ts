import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalogPath = path.join(
  __dirname,
  '..',
  'web',
  'src',
  'catalog',
  'algorithms.generated.json',
);

const VALID_FAMILIES = new Set([
  'array-bars',
  'graph-view',
  'tree-view',
  'matrix-grid',
  'string-scene',
  'flow-network',
  'state-machine',
  'numeric-scene',
  'system-sim',
  'signal-scene',
]);

const VALID_STATUS = new Set(['ready', 'draft', 'planned']);

interface Entry {
  id: string;
  name: string;
  area: string;
  status: string;
  visualFamily: string;
  visualMetaphor: string;
}

const catalog: Entry[] = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const ids = new Set<string>();
let errors = 0;

for (const entry of catalog) {
  if (!entry.id || ids.has(entry.id)) {
    console.error(`Duplicate or missing id: ${entry.id}`);
    errors++;
  }
  ids.add(entry.id);

  if (!entry.area) {
    console.error(`Missing area for ${entry.id}`);
    errors++;
  }
  if (!VALID_FAMILIES.has(entry.visualFamily)) {
    console.error(`Invalid visualFamily for ${entry.id}: ${entry.visualFamily}`);
    errors++;
  }
  if (!VALID_STATUS.has(entry.status)) {
    console.error(`Invalid status for ${entry.id}: ${entry.status}`);
    errors++;
  }
  if (!entry.visualMetaphor?.trim()) {
    console.error(`Missing visualMetaphor for ${entry.id}`);
    errors++;
  }
  if (entry.status === 'reference') {
    console.error(`Forbidden status 'reference' on ${entry.id}`);
    errors++;
  }
}

if (errors > 0) {
  console.error(`validate-catalog: ${errors} error(s)`);
  process.exit(1);
}

console.log(`validate-catalog: OK (${catalog.length} entries)`);
