// Recherche du plus court chemin (en nombre de sauts) entre deux niveaux,
// en respectant le sens des routes : une connexion "one-way" ne se
// parcourt que dans son sens déclaré, une "bidirectional" dans les deux.
// BFS simple (non pondéré) sur l'ensemble complet des niveaux, indépendant
// des filtres actifs — trouver un chemin doit fonctionner même si une
// étape intermédiaire est actuellement masquée par un filtre.
export function findShortestPath(levels, fromId, toId) {
  if (!fromId || !toId) return null
  if (fromId === toId) return [fromId]

  const adjacency = new Map()
  const addEdge = (a, b) => {
    if (!adjacency.has(a)) adjacency.set(a, [])
    adjacency.get(a).push(b)
  }
  for (const lvl of levels) {
    for (const c of lvl.connections ?? []) {
      addEdge(lvl.id, c.to)
      if (c.direction === 'bidirectional') addEdge(c.to, lvl.id)
    }
  }

  const visited = new Set([fromId])
  const queue = [[fromId]]
  while (queue.length > 0) {
    const path = queue.shift()
    const last = path[path.length - 1]
    for (const next of adjacency.get(last) ?? []) {
      if (visited.has(next)) continue
      const nextPath = [...path, next]
      if (next === toId) return nextPath
      visited.add(next)
      queue.push(nextPath)
    }
  }
  return null
}
