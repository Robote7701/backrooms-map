import { useMemo, useState } from 'react'
import { useI18n } from '../i18n/I18nContext'
import { getLevelText } from '../i18n/getLevelText'
import { levels, levelsById } from '../data/loadLevels'
import { findShortestPath } from '../graph/pathfinding'
import { routeIcons } from '../data/icons'

// Petit sélecteur de niveau à autocomplétion, local à ce panneau (pas de
// lien avec la sélection/carte tant que l'utilisateur n'a pas cliqué
// "Trouver un chemin").
function LevelPicker({ label, value, onChange }) {
  const { lang } = useI18n()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return levels
      .map((l) => ({ id: l.id, name: getLevelText(l, lang, 'name') }))
      .filter((l) => l.name.toLowerCase().includes(q))
      .slice(0, 6)
  }, [query, lang])

  const selectedName = value ? getLevelText(levelsById[value], lang, 'name') : ''

  return (
    <div className="level-picker">
      <span className="filter-label">{label}</span>
      <input
        type="text"
        className="level-picker__input"
        placeholder={selectedName || '…'}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
      />
      {open && results.length > 0 && (
        <ul className="level-picker__results">
          {results.map((r) => (
            <li key={r.id}>
              <button
                onMouseDown={() => {
                  onChange(r.id)
                  setQuery('')
                  setOpen(false)
                }}
              >
                {r.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Trouve le plus court chemin entre deux niveaux (BFS dirigé, voir
// graph/pathfinding.js) et prévient le parent pour la surbrillance sur
// la carte via onPathChange(path | null).
export default function PathFinder({ onPathChange, onSelectLevel }) {
  const { lang, t } = useI18n()
  const [fromId, setFromId] = useState(null)
  const [toId, setToId] = useState(null)
  const [path, setPath] = useState(null)
  const [searched, setSearched] = useState(false)

  function find() {
    if (!fromId || !toId) return
    const result = findShortestPath(levels, fromId, toId)
    setPath(result)
    setSearched(true)
    onPathChange(result)
  }

  function clear() {
    setFromId(null)
    setToId(null)
    setPath(null)
    setSearched(false)
    onPathChange(null)
  }

  return (
    <div className="panel-block">
      <h3 className="panel-block__title">{t('pathfinder.title')}</h3>

      <div className="pathfinder-pickers">
        <LevelPicker label={t('pathfinder.from')} value={fromId} onChange={setFromId} />
        <LevelPicker label={t('pathfinder.to')} value={toId} onChange={setToId} />
      </div>

      <div className="filter-footer">
        <button className="link-btn" onClick={find} disabled={!fromId || !toId}>
          🧭 {t('pathfinder.find')}
        </button>
        {(path || searched) && (
          <button className="link-btn" onClick={clear}>
            {t('pathfinder.clear')}
          </button>
        )}
      </div>

      {searched && !path && <p className="muted small">{t('pathfinder.noPath')}</p>}

      {path && path.length > 0 && (
        <ol className="pathfinder-steps">
          {path.map((id, i) => {
            const lvl = levelsById[id]
            const conn = i < path.length - 1 ? lvl?.connections?.find((c) => c.to === path[i + 1]) : null
            return (
              <li key={id}>
                <button className="link-btn" onClick={() => onSelectLevel?.(id)}>
                  {getLevelText(lvl, lang, 'name')}
                </button>
                {conn && <span className="pathfinder-steps__arrow">{routeIcons[conn.type] ?? '→'}</span>}
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
