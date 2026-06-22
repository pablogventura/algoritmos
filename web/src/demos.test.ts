import { describe, expect, it } from 'vitest';
import { DEMOS } from './algorithms/registry';
import { CATALOG } from './catalog';
import { runTestCases } from './engine/TestRunner';
import type { AlgorithmDemo } from './types/demo';
import { HANDCRAFTED_IDS } from './algorithms/handcrafted';

const demos = Object.values(DEMOS);

describe('catalog coverage', () => {
  it('has a demo for every catalog entry', () => {
    for (const entry of CATALOG) {
      expect(DEMOS[entry.id], entry.id).toBeDefined();
    }
    expect(Object.keys(DEMOS).length).toBe(CATALOG.length);
  });
});

describe('algorithm demos', () => {
  for (const demo of demos) {
    describe(demo.id, () => {
      it('generateSteps returns captions and scenes', () => {
        const steps = demo.generateSteps(demo.defaultInput as never);
        expect(steps.length).toBeGreaterThan(0);
        for (const step of steps) {
          expect(step.captionKey).toBeTruthy();
          expect(step.scene.kind).toBeTruthy();
        }
      });

      if (HANDCRAFTED_IDS.has(demo.id)) {
        it('passes handcrafted test cases', () => {
          const results = runTestCases(demo as AlgorithmDemo<unknown, unknown>);
          for (const r of results) {
            expect(r.passed, r.name).toBe(true);
          }
        });
      } else {
        it('passes bulk test cases', () => {
          const results = runTestCases(demo as AlgorithmDemo<unknown, unknown>);
          for (const r of results) {
            expect(r.passed, r.name).toBe(true);
          }
        });
      }
    });
  }
});
