import { useCallback, useState } from 'react'

const STORAGE_KEY = 'backrooms.visited'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function save(set) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
  } catch {
    /* localStorage indisponible : le suivi ne persiste pas, tant pis */
  }
}

// Suit les niveaux déjà consultés (persisté en localStorage, même mécanique
// que les favoris) pour afficher une progression d'exploration dans les
// statistiques — aucune donnée envoyée à un serveur.
export function useVisited() {
  const [visited, setVisited] = useState(load)

  const markVisited = useCallback((id) => {
    if (!id) return
    setVisited((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      save(next)
      return next
    })
  }, [])

  return { visited, markVisited }
}
