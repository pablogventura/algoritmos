import catalogData from './algorithms.generated.json';
import type { CatalogEntry } from '../types/demo';

export const CATALOG: CatalogEntry[] = catalogData as CatalogEntry[];

export function getCatalogEntry(id: string): CatalogEntry | undefined {
  return CATALOG.find((e) => e.id === id);
}

export function getCatalogByArea(areaSlug: string): CatalogEntry[] {
  return CATALOG.filter((e) => e.area === areaSlug);
}

export function countByStatus(status: CatalogEntry['status']): number {
  return CATALOG.filter((e) => e.status === status).length;
}
