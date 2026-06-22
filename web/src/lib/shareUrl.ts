import type { DemoInput } from '../types/demo';
import { appUrl } from './urls';

export function buildAlgoShareParams(
  input: DemoInput | null,
  stepIndex?: number,
): Record<string, string | number> {
  const params: Record<string, string | number> = {};
  if (input && 'values' in input && Array.isArray(input.values)) {
    params.data = input.values.join(',');
  }
  if (input && 'target' in input && input.target != null) {
    params.target = String(input.target);
  }
  if (stepIndex != null && stepIndex >= 0) {
    params.step = stepIndex;
  }
  return params;
}

export function buildAlgoShareUrl(id: string, input: DemoInput | null, stepIndex?: number): string {
  return appUrl(`/algo/${id}`, buildAlgoShareParams(input, stepIndex));
}

export function buildCompareShareUrl(
  left: string,
  right: string,
  input: DemoInput | null,
): string {
  const params: Record<string, string | number> = { left, right, ...buildAlgoShareParams(input) };
  return appUrl('/compare', params);
}
