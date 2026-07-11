import { levels } from './loadLevels'

// Index entité -> niveaux où elle apparaît + fréquences de présence.
// Sert de glossaire interne, plus fiable que les liens externes vers le
// wiki (dont les slugs sont best-effort, voir entityWiki.js).
function buildEntityIndex() {
  const byId = new Map()
  for (const lvl of levels) {
    for (const e of lvl.entities ?? []) {
      if (!byId.has(e.id)) byId.set(e.id, { id: e.id, appearances: [] })
      byId.get(e.id).appearances.push({ levelId: lvl.id, presence: e.presence })
    }
  }
  return [...byId.values()].sort((a, b) => b.appearances.length - a.appearances.length || a.id.localeCompare(b.id))
}

export const entityIndex = buildEntityIndex()
