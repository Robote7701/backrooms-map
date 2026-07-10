import dangerLayer from './danger.layer'
import entitiesLayer from './entities.layer'

// Registre générique des calques. Ajouter un calque :
//   1. créer `mon-calque.layer.js` (id, labelKey, defaultOn, stylesheet)
//   2. l'importer et l'ajouter à ce tableau.
// L'ordre compte : les derniers calques l'emportent sur les précédents.
export const layers = [dangerLayer, entitiesLayer]

export const layersById = Object.fromEntries(layers.map((l) => [l.id, l]))

// État initial des calques (Set des ids actifs par défaut).
export const defaultActiveLayers = new Set(
  layers.filter((l) => l.defaultOn).map((l) => l.id),
)

/**
 * Construit le stylesheet complet : base + calques actifs empilés.
 * @param {Array} baseStylesheet  style de base
 * @param {Set<string>} activeIds ids des calques actifs
 */
export function composeStylesheet(baseStylesheet, activeIds) {
  const extra = layers
    .filter((l) => activeIds.has(l.id))
    .flatMap((l) => l.stylesheet ?? [])
  return [...baseStylesheet, ...extra]
}
