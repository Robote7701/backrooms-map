import { getLevelText } from '../i18n/getLevelText'

// Échelle appliquée aux coordonnées du JSON pour obtenir des pixels lisibles.
const COORD_SCALE = 150

// Types de routes connus -> classe CSS Cytoscape (voir cytoscapeStyle.js).
export const CONNECTION_TYPES = ['noclip', 'porte', 'escalier', 'autre']

/**
 * Transforme une liste de niveaux en éléments Cytoscape (nodes + edges).
 *
 * @param {Array} levels  niveaux à afficher (déjà filtrés en amont)
 * @param {string} lang   langue courante ('fr' | 'en')
 * @returns {{ nodes: Array, edges: Array }}
 */
export function buildGraph(levels, lang) {
  const visibleIds = new Set(levels.map((lvl) => lvl.id))

  const nodes = levels.map((lvl) => {
    const name = getLevelText(lvl, lang, 'name')
    const entityCount = lvl.entities?.length ?? 0
    return {
      data: {
        id: lvl.id,
        label: name,
        // Label alternatif utilisé par le calque "Entités".
        labelWithEntities: entityCount > 0 ? `${name}  ⬤${entityCount}` : name,
        levelClass: lvl.class,
        dangerLevel: lvl.danger.level,
        entityCount,
        hasCoords: !!lvl.coordinates,
      },
      // Position seulement si le niveau a des coordonnées (layout hybride).
      position: lvl.coordinates
        ? { x: lvl.coordinates.x * COORD_SCALE, y: lvl.coordinates.y * COORD_SCALE }
        : undefined,
    }
  })

  // Déduplication : une route bidirectionnelle déclarée des deux côtés
  // ne doit produire qu'un seul edge.
  const seen = new Set()
  const edges = []

  for (const lvl of levels) {
    for (const conn of lvl.connections ?? []) {
      // On ignore les connexions vers des niveaux non visibles (filtrés).
      if (!visibleIds.has(conn.to)) continue

      const bidir = conn.direction === 'bidirectional'
      const key = bidir
        ? `bi:${[lvl.id, conn.to].sort().join('|')}:${conn.type}`
        : `uni:${lvl.id}>${conn.to}:${conn.type}`
      if (seen.has(key)) continue
      seen.add(key)

      edges.push({
        data: {
          id: `${lvl.id}__${conn.to}__${conn.type}`,
          source: lvl.id,
          target: conn.to,
          connType: conn.type,
          bidirectional: bidir,
          reliability: conn.reliability ?? null,
        },
        classes: [conn.type, bidir ? 'bidirectional' : 'oneway'].join(' '),
      })
    }
  }

  return { nodes, edges }
}
