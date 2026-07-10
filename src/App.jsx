import { useMemo, useState } from 'react'
import MapView from './components/MapView'
import SidePanel from './components/SidePanel'
import LanguageSwitcher from './components/LanguageSwitcher'
import LayerToggles from './components/LayerToggles'
import Filters from './components/Filters'
import Legend from './components/Legend'
import SearchBar from './components/SearchBar'
import { useI18n } from './i18n/I18nContext'
import { levels as allLevels, levelsById, dangerBounds } from './data/loadLevels'
import { defaultActiveLayers } from './layers/registry'

export default function App() {
  const { t } = useI18n()
  const [selectedId, setSelectedId] = useState(null)
  // Incrémenté à chaque recherche pour demander à la carte de recentrer.
  const [focusNonce, setFocusNonce] = useState(0)
  const [activeLayers, setActiveLayers] = useState(() => new Set(defaultActiveLayers))
  const [filters, setFilters] = useState(() => ({
    hiddenClasses: new Set(),
    dangerMin: dangerBounds.min,
    dangerMax: dangerBounds.max,
  }))

  // Niveaux visibles après application des filtres.
  const visibleLevels = useMemo(
    () =>
      allLevels.filter(
        (lvl) =>
          !filters.hiddenClasses.has(lvl.class) &&
          lvl.danger.level >= filters.dangerMin &&
          lvl.danger.level <= filters.dangerMax,
      ),
    [filters],
  )

  // Désélectionne si le niveau sélectionné devient invisible.
  const selectedLevel =
    selectedId && visibleLevels.some((l) => l.id === selectedId)
      ? levelsById[selectedId]
      : null

  // Sélection depuis la recherche : ouvre le panneau + recentre la carte.
  function focusLevel(id) {
    setSelectedId(id)
    setFocusNonce((n) => n + 1)
  }

  function toggleLayer(id) {
    setActiveLayers((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__brand">
          <h1 className="app__title">{t('app.title')}</h1>
          <p className="app__subtitle">{t('app.subtitle')}</p>
        </div>
        <SearchBar levels={visibleLevels} onSelect={focusLevel} />
        <LanguageSwitcher />
      </header>

      <div className="app__body">
        <div className="app__map">
          <MapView
            levels={visibleLevels}
            activeLayers={activeLayers}
            selectedId={selectedLevel?.id ?? null}
            focusNonce={focusNonce}
            onSelect={setSelectedId}
          />

          <div className="controls">
            <LayerToggles activeLayers={activeLayers} onToggle={toggleLayer} />
            <Filters filters={filters} onChange={setFilters} shownCount={visibleLevels.length} />
          </div>

          <Legend />
        </div>

        <SidePanel
          level={selectedLevel}
          onSelect={setSelectedId}
          onClose={() => setSelectedId(null)}
        />
      </div>
    </div>
  )
}
