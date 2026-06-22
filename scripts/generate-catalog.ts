import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const docsDir = path.join(root, 'docs');
const outPath = path.join(root, 'web', 'src', 'catalog', 'algorithms.generated.json');

type VisualFamily =
  | 'array-bars'
  | 'graph-view'
  | 'tree-view'
  | 'matrix-grid'
  | 'string-scene'
  | 'flow-network'
  | 'state-machine'
  | 'numeric-scene'
  | 'system-sim'
  | 'signal-scene';

type DemoStatus = 'ready' | 'draft' | 'planned';

interface CatalogEntry {
  id: string;
  name: string;
  area: string;
  status: DemoStatus;
  visualFamily: VisualFamily;
  visualMetaphor: string;
}

const READY_IDS = new Set([
  'binary-search',
  'linear-search-con-centinela',
  'quicksort',
  'mergesort',
  'quickselect',
  'counting-sort',
  'heapsort',
  'bfs',
  'dfs',
  'dijkstra',
  'prim',
  'kruskal',
  'bellman-ford',
  'orden-topologico',
  'union-find-disjoint-set-union',
]);

const AREA_FAMILY: Record<string, VisualFamily> = {
  'patrones-algoritmicos': 'array-bars',
  'ordenamiento-busqueda-seleccion': 'array-bars',
  'estructuras-de-datos': 'tree-view',
  grafos: 'graph-view',
  'strings-parsing-automatas': 'string-scene',
  'logica-sat-csp': 'matrix-grid',
  'compresion-codificacion': 'signal-scene',
  'criptografia-seguridad': 'signal-scene',
  'numericos-algebra-lineal': 'numeric-scene',
  optimizacion: 'numeric-scene',
  'aprendizaje-automatico': 'signal-scene',
  'sistemas-operativos-concurrencia': 'system-sim',
  'bases-de-datos': 'tree-view',
};

const METAPHOR: Record<VisualFamily, string> = {
  'array-bars': 'Animated bars with compare/swap highlights',
  'graph-view': 'Nodes and edges with visit/distance animation',
  'tree-view': 'Tree nodes with insert/rotate animation',
  'matrix-grid': 'Colored cells with dependency arrows',
  'string-scene': 'Two strings with sliding pointers',
  'flow-network': 'Capacity network with animated flow',
  'state-machine': 'States, transitions, and parse stack',
  'numeric-scene': 'Matrices, vectors, and convergence plots',
  'system-sim': 'Processes, pages, locks, or message timeline',
  'signal-scene': 'Bits, codewords, curves, or attention grid',
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function titleCase(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function parseDoc(filePath: string, areaSlug: string): CatalogEntry[] {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const entries: CatalogEntry[] = [];
  const seen = new Set<string>();
  const family = AREA_FAMILY[areaSlug] ?? 'array-bars';

  for (const line of lines) {
    const match = line.match(/^-\s+(.+)$/);
    if (!match) continue;
    let raw = match[1].trim();
    if (!raw || raw.startsWith('**')) continue;

    raw = raw.replace(/\*\*/g, '').split(':')[0]?.trim() ?? raw;
    raw = raw.replace(/\([^)]*\)/g, '').trim();
    if (raw.length < 2) continue;

    const id = slugify(raw);
    if (!id || seen.has(id)) continue;
    seen.add(id);

    entries.push({
      id,
      name: titleCase(raw),
      area: areaSlug,
      status: READY_IDS.has(id) ? 'ready' : 'planned',
      visualFamily: family,
      visualMetaphor: METAPHOR[family],
    });
  }

  return entries;
}

const docFiles = fs
  .readdirSync(docsDir)
  .filter((f) => f.endsWith('.md') && f !== 'README.md');

const catalog: CatalogEntry[] = [];
const globalSeen = new Set<string>();

for (const file of docFiles.sort()) {
  const areaSlug = file.replace(/\.md$/, '');
  for (const entry of parseDoc(path.join(docsDir, file), areaSlug)) {
    if (globalSeen.has(entry.id)) continue;
    globalSeen.add(entry.id);
    catalog.push(entry);
  }
}

catalog.sort((a, b) => a.area.localeCompare(b.area) || a.name.localeCompare(b.name));

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(catalog, null, 2) + '\n');

console.log(`Generated ${catalog.length} catalog entries -> ${outPath}`);
console.log(`Ready: ${catalog.filter((e) => e.status === 'ready').length}`);
