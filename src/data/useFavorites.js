import { useCallback, useState } from 'react'

const STORAGE_KEY = 'backrooms.favorites'

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
    /* localStorage indisponible : les favoris ne persistent pas, tant pis */
  }
}

// Favoris persistés en localStorage (aucune donnée envoyée à un serveur,
// cf. la page de confidentialité). Un simple Set d'ids de niveaux.
export function useFavorites() {
  const [favorites, setFavorites] = useState(load)

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      save(next)
      return next
    })
  }, [])

  return { favorites, toggleFavorite }
}
