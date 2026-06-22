import type { AlgorithmDemo } from '../types/demo';

export interface TestResult {
  name: string;
  passed: boolean;
  expected: unknown;
  actual: unknown;
}

export function runTestCases<TInput, TOutput>(demo: AlgorithmDemo<TInput, TOutput>): TestResult[] {
  return demo.testCases.map((tc) => {
    const actual = demo.run(tc.input);
    const passed = JSON.stringify(actual) === JSON.stringify(tc.expected);
    return {
      name: tc.name,
      passed,
      expected: tc.expected,
      actual,
    };
  });
}
