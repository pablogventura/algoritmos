import { buildAllDemos } from './bulk';

export const DEMOS = buildAllDemos();

export function getDemo(id: string) {
  return DEMOS[id];
}

export const READY_DEMO_IDS = Object.keys(DEMOS);
