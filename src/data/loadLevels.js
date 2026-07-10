// Charge automatiquement tous les niveaux de src/data/levels/*.json.
// Ajouter un niveau = déposer un fichier JSON ici, rien d'autre à toucher.
const modules = import.meta.glob('./levels/*.json', { eager: true })

export const levels = Object.values(modules)
  .map((m) => m.default ?? m)
  .sort((a, b) => a.id.localeCompare(b.id))

// Index id -> niveau, pratique pour les lookups (connexions, panneau...).
export const levelsById = Object.fromEntries(levels.map((lvl) => [lvl.id, lvl]))

// Liste triée des classes présentes dans les données (pour les filtres).
export const levelClasses = [...new Set(levels.map((lvl) => lvl.class))].sort()

// Bornes de danger réellement présentes (pour les curseurs de filtre).
export const dangerBounds = levels.reduce(
  (acc, lvl) => ({
    min: Math.min(acc.min, lvl.danger.level),
    max: Math.max(acc.max, lvl.danger.level),
  }),
  { min: Infinity, max: -Infinity },
)
