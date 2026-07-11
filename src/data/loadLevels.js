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

// Nombre de niveaux par classe (affiché à côté de chaque filtre pour le
// rendre instructif : on sait combien de niveaux on va gagner/perdre).
export const levelClassCounts = levels.reduce((acc, lvl) => {
  acc[lvl.class] = (acc[lvl.class] ?? 0) + 1
  return acc
}, {})

// Bornes de danger réellement présentes (pour les curseurs de filtre).
export const dangerBounds = levels.reduce(
  (acc, lvl) => ({
    min: Math.min(acc.min, lvl.danger.level),
    max: Math.max(acc.max, lvl.danger.level),
  }),
  { min: Infinity, max: -Infinity },
)

// Tags de danger (aléas) qui ne décrivent pas un vrai risque mais la
// qualité de la fiche elle-même : à exclure des filtres par tag.
const META_TAGS = new Set(['difficulte-estimee', 'source-missing'])

// Tags les plus fréquents parmi tous les niveaux (hors tags "méta"),
// avec leur nombre d'occurrences. Sert au filtre "dangers fréquents".
export const topDangerTags = Object.entries(
  levels.reduce((acc, lvl) => {
    for (const tag of lvl.danger.tags ?? []) {
      if (META_TAGS.has(tag)) continue
      acc[tag] = (acc[tag] ?? 0) + 1
    }
    return acc
  }, {}),
)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 12)
  .map(([tag, count]) => ({ tag, count }))

// Niveaux dont la fiche est incomplète (page source introuvable au moment
// de l'import) : utile pour un filtre "masquer les fiches incomplètes".
export const stubCount = levels.filter((lvl) => lvl.meta?.status === 'stub').length
