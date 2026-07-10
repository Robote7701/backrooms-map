import { useMemo, useRef, useState } from 'react'
import { useI18n } from '../i18n/I18nContext'
import { getLevelText } from '../i18n/getLevelText'

// Barre de recherche : filtre les niveaux visibles par nom ou numéro,
// affiche une liste de résultats ; sélectionner recentre la carte dessus.
export default function SearchBar({ levels, onSelect }) {
  const { lang, t } = useI18n()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const blurTimer = useRef(null)

  // Index de recherche (nom localisé + id) recalculé quand niveaux/langue changent.
  const index = useMemo(
    () =>
      levels.map((lvl) => ({
        id: lvl.id,
        name: getLevelText(lvl, lang, 'name'),
        haystack: `${getLevelText(lvl, lang, 'name')} ${lvl.id} ${lvl.slug ?? ''}`.toLowerCase(),
      })),
    [levels, lang],
  )

  const q = query.trim().toLowerCase()
  const results = useMemo(() => {
    if (!q) return []
    return index.filter((e) => e.haystack.includes(q)).slice(0, 8)
  }, [index, q])

  function choose(id) {
    if (!id) return
    onSelect(id)
    setQuery('')
    setOpen(false)
  }

  function onKeyDown(e) {
    if (!results.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => (i + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => (i - 1 + results.length) % results.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      choose(results[Math.min(activeIdx, results.length - 1)]?.id)
    } else if (e.key === 'Escape') {
      setQuery('')
      setOpen(false)
    }
  }

  return (
    <div className="search-bar">
      <span className="search-bar__icon" aria-hidden="true">
        ⌕
      </span>
      <input
        type="search"
        className="search-bar__input"
        placeholder={t('search.placeholder')}
        value={query}
        aria-label={t('search.placeholder')}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
          setActiveIdx(0)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          // Léger délai pour laisser le clic sur un résultat se déclencher.
          blurTimer.current = setTimeout(() => setOpen(false), 120)
        }}
        onKeyDown={onKeyDown}
      />

      {open && q && (
        <ul className="search-bar__results" onMouseDown={() => clearTimeout(blurTimer.current)}>
          {results.length ? (
            results.map((r, i) => (
              <li key={r.id}>
                <button
                  className={`search-bar__result ${i === activeIdx ? 'is-active' : ''}`}
                  onMouseEnter={() => setActiveIdx(i)}
                  onClick={() => choose(r.id)}
                >
                  {r.name}
                </button>
              </li>
            ))
          ) : (
            <li className="search-bar__empty">{t('search.noResults')}</li>
          )}
        </ul>
      )}
    </div>
  )
}
