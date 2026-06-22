#!/usr/bin/env npx tsx
/**
 * Scaffold a new handcrafted demo stub.
 * Usage: npx tsx scripts/new-demo.ts my-algorithm sorting array-bars
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const [id, area = 'sorting', visualFamily = 'array-bars'] = process.argv.slice(2);
if (!id) {
  console.error('Usage: npx tsx scripts/new-demo.ts <id> [area] [visualFamily]');
  process.exit(1);
}

const pascal = id
  .split('-')
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join('');

const demoVar = `${id.replace(/-/g, '')}Demo`;
const outDir = path.join(root, 'web', 'src', 'algorithms', area);
const outFile = path.join(outDir, `${id}.ts`);

if (fs.existsSync(outFile)) {
  console.error(`File already exists: ${outFile}`);
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const template = `import type { AlgorithmDemo } from '../../types/demo';
import { arrayStep } from '../shared/arraySteps';

interface ${pascal}Input {
  values: number[];
}

export const ${demoVar}: AlgorithmDemo<${pascal}Input, number[]> = {
  id: '${id}',
  defaultInput: { values: [5, 2, 8, 1, 9] },
  metadata: {
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
  },
  buildInitialScene(input) {
    return {
      kind: 'array',
      values: [...input.values],
      highlights: {},
      pointers: {},
    };
  },
  generateSteps(input) {
    const arr = [...input.values];
    const steps = [
      arrayStep(arr, {}, {}, 'steps.generic.start', { name: '${pascal}' }),
      arrayStep(arr, {}, {}, 'steps.generic.done', { name: '${pascal}', summary: arr.join(',') }),
    ];
    return steps;
  },
  run(input) {
    return [...input.values].sort((a, b) => a - b);
  },
  testCases: [{ name: 'default', input: { values: [3, 1, 2] }, expected: [1, 2, 3] }],
};
`;

fs.writeFileSync(outFile, template);
console.log(`Created ${outFile}`);
console.log(`Next steps:`);
console.log(`  1. Implement generateSteps and run()`);
console.log(`  2. Register in web/src/algorithms/handcrafted/index.ts`);
console.log(`  3. Add steps.generic or custom keys to locales/en|es/steps.json`);
console.log(`  4. Set visualFamily ${visualFamily} in catalog if needed`);
console.log(`  5. npm test`);
