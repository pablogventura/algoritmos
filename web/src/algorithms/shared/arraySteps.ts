import type { HighlightKind, VisualStep } from '../../types/demo';

export function arrayStep(
  values: number[],
  highlights: Partial<Record<number, HighlightKind>>,
  pointers: Record<string, number>,
  captionKey: string,
  captionParams: Record<string, string | number> = {},
): VisualStep {
  return {
    captionKey,
    captionParams,
    scene: { kind: 'array', values: [...values], highlights, pointers },
  };
}

export interface SortInput {
  values: number[];
}

export interface SortOutput {
  values: number[];
}
