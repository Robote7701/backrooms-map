import { useEffect, useMemo, useState } from 'react'
import MapView from './components/MapView'
import SidePanel from './components/SidePanel'
import LanguageSwitcher from './components/LanguageSwitcher'
import LayerToggles from './components/LayerToggles'
import Filters from './components/Filters'
import Legend from './components/Legend'
import SearchBar from './components/SearchBar'
import LegalPage from './components/LegalPage'
import { useI18n } from './i18n/I18nContext'
import { levels as allLevels, levelsById, dangerBounds } from './data/loadLevels'
import { defaultActiveLayers } from './layers/registry'

// Sous ce seuil, le panneau Calques/Filtres devient un tiroir repliable
// (sinon il recouvre toute la carte sur un écran de téléphone).
const MOBILE_BREAKPOINT = 640

export default function App() {
  const { t } = useI18n()
  const [selectedId, setSelectedId] = useState(null)
  // Incrémenté à chaque recherche pour demander à la carte de recentrer.
  const [focusNonce, setFocusNonce] = useState(0)
  // Fermé par défaut sur mobile (la carte doit être visible immédiatement),
  // ouvert par défaut sur desktop. Le toggle n'est visible qu'en mobile (CSS).
  const [controlsOpen, setControlsOpen] = useState(
    () => typeof window === 'undefined' || window.innerWidth > MOBILE_BREAKPOINT,
  )
  const [activeLayers, setActiveLayers] = useState(() => new Set(defaultActiveLayers))
  const [filters, setFilters] = useState(() => ({
    hiddenClasses: new Set(),
    dangerMin: dangerBounds.min,
    dangerMax: dangerBounds.max,
  }))
  // Page mentions légales : simple bascule via #legal dans l'URL, pas besoin
  // d'un routeur pour une seule page annexe.
  const [showLegal, setShowLegal] = useState(
    () => typeof window !== 'undefined' && window.location.hash === '#legal',
  )
  useEffect(() => {
    const onHashChange = () => setShowLegal(window.location.hash === '#legal')
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

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

  if (showLegal) {
    return <LegalPage onClose={() => { window.location.hash = '' }} />
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

          <button
            className="controls-toggle"
            onClick={() => setControlsOpen((o) => !o)}
            aria-expanded={controlsOpen}
            aria-label={t('controls.toggle')}
          >
            {controlsOpen ? '✕' : '⚙️'} {t('controls.toggle')}
          </button>

          <div className={`controls ${controlsOpen ? '' : 'controls--closed'}`}>
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

      <footer className="app-footer">
        <a href="#legal">{t('footer.legal')}</a>
      </footer>
    </div>
  )
}
