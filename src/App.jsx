import { useMemo, useState } from 'react'
import MapView from './components/MapView'
import SidePanel from './components/SidePanel'
import LanguageSwitcher from './components/LanguageSwitcher'
import LayerToggles from './components/LayerToggles'
import Filters from './components/Filters'
import Legend from './components/Legend'
import { useI18n } from './i18n/I18nContext'
import { levels as allLevels, levelsById, dangerBounds } from './data/loadLevels'
import { defaultActiveLayers } from './layers/registry'

export default function App() {
  const { t } = useI18n()
  const [selectedId, setSelectedId] = useState(null)
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
        <div>
          <h1 className="app__title">{t('app.title')}</h1>
          <p className="app__subtitle">{t('app.subtitle')}</p>
        </div>
        <LanguageSwitcher />
      </header>

      <div className="app__body">
        <div className="app__map">
          <MapView
            levels={visibleLevels}
            activeLayers={activeLayers}
            selectedId={selectedLevel?.id ?? null}
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
