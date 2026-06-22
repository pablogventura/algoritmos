#!/usr/bin/env npx tsx
/**
 * Scaffold a new handcrafted demo stub.
 * Usage: npx tsx scripts/new-demo.ts my-algorithm array-bars
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const id = process.argv[2];
const family = process.argv[3] ?? 'array-bars';

if (!id) {
  console.error('Usage: npx tsx scripts/new-demo.ts <algorithm-id> [visual-family]');
  process.exit(1);
}

const camel = id.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
const demoName = `${camel}Demo`;
const target = path.join(__dirname, '..', 'web', 'src', 'algorithms', 'stubs', `${id}.ts`);

const stub = `import type { AlgorithmDemo } from '../../types/demo';
import { arrayStep } from '../shared/arraySteps';

export const ${demoName}: AlgorithmDemo = {
  id: '${id}',
  visualFamily: '${family}',
  metadata: { timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
  defaultInput: { values: [3, 1, 4, 1, 5] },
  buildInitialScene(input) {
    return { kind: 'array', values: [...(input as { values: number[] }).values], highlights: {}, pointers: {} };
  },
  generateSteps(input) {
    const values = [...(input as { values: number[] }).values];
    return [
      arrayStep(values, {}, {}, 'steps.generic.start', { name: '${id}' }),
      arrayStep(values, {}, {}, 'steps.generic.done', { name: '${id}', summary: 'done' }),
    ];
  },
  run(input) {
    return { values: [...(input as { values: number[] }).values] };
  },
  testCases: [{ name: 'default', input: { values: [1, 2, 3] }, expected: { values: [1, 2, 3] } }],
};
`;

fs.mkdirSync(path.dirname(target), { recursive: true });
if (fs.existsSync(target)) {
  console.error(`Already exists: ${target}`);
  process.exit(1);
}
fs.writeFileSync(target, stub);
console.log(`Created ${target}`);
console.log(`Next: register in web/src/algorithms/handcrafted/index.ts and add steps to locales.`);
