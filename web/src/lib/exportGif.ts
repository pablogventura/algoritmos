import { GIFEncoder, quantize, applyPalette } from 'gifenc';
import { toCanvas } from 'html-to-image';

const MAX_FRAMES = 80;

export function sampleStepIndices(totalSteps: number, maxFrames = MAX_FRAMES): number[] {
  if (totalSteps <= maxFrames) {
    return Array.from({ length: totalSteps }, (_, i) => i);
  }
  const indices: number[] = [];
  for (let i = 0; i < maxFrames; i += 1) {
    indices.push(Math.round((i * (totalSteps - 1)) / (maxFrames - 1)));
  }
  return indices;
}

export async function exportSceneGif(
  element: HTMLElement,
  stepIndices: number[],
  goToStep: (index: number) => void | Promise<void>,
  delayMs: number,
): Promise<Blob> {
  const gif = GIFEncoder();
  const delayCs = Math.max(1, Math.round(delayMs / 10));

  for (const index of stepIndices) {
    await goToStep(index);
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });

    const canvas = await toCanvas(element, {
      backgroundColor: '#020617',
      pixelRatio: 1,
      cacheBust: true,
    });
    const ctx = canvas.getContext('2d');
    if (!ctx) continue;

    const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const palette = quantize(data, 256);
    const indexed = applyPalette(data, palette);
    gif.writeFrame(indexed, width, height, { palette, delay: delayCs });
  }

  gif.finish();
  const bytes = gif.bytes();
  return new Blob([Uint8Array.from(bytes)], { type: 'image/gif' });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
