import { describe, expect, it } from 'vitest';
import { binarySearchDemo } from './algorithms/sorting/binarySearch';
import { quicksortDemo } from './algorithms/sorting/quicksort';
import { mergesortDemo } from './algorithms/sorting/mergesort';
import { bfsDemo } from './algorithms/graphs/bfs';
import { dijkstraDemo } from './algorithms/graphs/dijkstra';
import { primDemo } from './algorithms/graphs/prim';
import { runTestCases } from './engine/TestRunner';
import type { AlgorithmDemo } from './types/demo';

const demos = [
  binarySearchDemo,
  quicksortDemo,
  mergesortDemo,
  bfsDemo,
  dijkstraDemo,
  primDemo,
];

describe('algorithm demos', () => {
  for (const demo of demos) {
    describe(demo.id, () => {
      it('passes all test cases', () => {
        const results = runTestCases(demo as AlgorithmDemo<unknown, unknown>);
        for (const r of results) {
          expect(r.passed, r.name).toBe(true);
        }
      });

      it('generateSteps returns captions and scenes', () => {
        const steps = demo.generateSteps(demo.defaultInput as never);
        expect(steps.length).toBeGreaterThan(0);
        for (const step of steps) {
          expect(step.captionKey).toBeTruthy();
          expect(step.scene.kind).toBeTruthy();
        }
      });
    });
  }
});
