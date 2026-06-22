import type { VisualFamily } from '../types/demo';

export interface AreaDefinition {
  slug: string;
  nameKey: string;
  docFile: string;
  defaultFamily: VisualFamily;
}

export const AREAS: AreaDefinition[] = [
  {
    slug: 'patrones-algoritmicos',
    nameKey: 'areas.patrones-algoritmicos',
    docFile: 'patrones-algoritmicos.md',
    defaultFamily: 'array-bars',
  },
  {
    slug: 'ordenamiento-busqueda-seleccion',
    nameKey: 'areas.ordenamiento-busqueda-seleccion',
    docFile: 'ordenamiento-busqueda-seleccion.md',
    defaultFamily: 'array-bars',
  },
  {
    slug: 'estructuras-de-datos',
    nameKey: 'areas.estructuras-de-datos',
    docFile: 'estructuras-de-datos.md',
    defaultFamily: 'tree-view',
  },
  {
    slug: 'grafos',
    nameKey: 'areas.grafos',
    docFile: 'grafos.md',
    defaultFamily: 'graph-view',
  },
  {
    slug: 'strings-parsing-automatas',
    nameKey: 'areas.strings-parsing-automatas',
    docFile: 'strings-parsing-automatas.md',
    defaultFamily: 'string-scene',
  },
  {
    slug: 'logica-sat-csp',
    nameKey: 'areas.logica-sat-csp',
    docFile: 'logica-sat-csp.md',
    defaultFamily: 'matrix-grid',
  },
  {
    slug: 'compresion-codificacion',
    nameKey: 'areas.compresion-codificacion',
    docFile: 'compresion-codificacion.md',
    defaultFamily: 'signal-scene',
  },
  {
    slug: 'criptografia-seguridad',
    nameKey: 'areas.criptografia-seguridad',
    docFile: 'criptografia-seguridad.md',
    defaultFamily: 'signal-scene',
  },
  {
    slug: 'numericos-algebra-lineal',
    nameKey: 'areas.numericos-algebra-lineal',
    docFile: 'numericos-algebra-lineal.md',
    defaultFamily: 'numeric-scene',
  },
  {
    slug: 'optimizacion',
    nameKey: 'areas.optimizacion',
    docFile: 'optimizacion.md',
    defaultFamily: 'numeric-scene',
  },
  {
    slug: 'aprendizaje-automatico',
    nameKey: 'areas.aprendizaje-automatico',
    docFile: 'aprendizaje-automatico.md',
    defaultFamily: 'signal-scene',
  },
  {
    slug: 'sistemas-operativos-concurrencia',
    nameKey: 'areas.sistemas-operativos-concurrencia',
    docFile: 'sistemas-operativos-concurrencia.md',
    defaultFamily: 'system-sim',
  },
  {
    slug: 'bases-de-datos',
    nameKey: 'areas.bases-de-datos',
    docFile: 'bases-de-datos.md',
    defaultFamily: 'tree-view',
  },
];

export const AREA_BY_SLUG = Object.fromEntries(AREAS.map((a) => [a.slug, a])) as Record<
  string,
  AreaDefinition
>;
