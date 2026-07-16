import { useEffect, useMemo, useState } from 'react'
import MapView from './components/MapView'
import SidePanel from './components/SidePanel'
import LanguageSwitcher from './components/LanguageSwitcher'
import LayerToggles from './components/LayerToggles'
import Filters from './components/Filters'
import Legend from './components/Legend'
import SearchBar from './components/SearchBar'
import LegalPage from './components/LegalPage'
import EntityGlossary from './components/EntityGlossary'
import PathFinder from './components/PathFinder'
import StatsPanel from './components/StatsPanel'
import AmbientSoundToggle from './components/AmbientSoundToggle'
import OnboardingHint from './components/OnboardingHint'
import { useI18n } from './i18n/I18nContext'
import { levels as allLevels, levelsById, dangerBounds } from './data/loadLevels'
import { defaultActiveLayers } from './layers/registry'
import { useFavorites } from './data/useFavorites'
import { useVisited } from './data/useVisited'

// Sous ce seuil, le panneau Calques/Filtres devient un tiroir repliable
// (sinon il recouvre toute la carte sur un écran de téléphone).
const MOBILE_BREAKPOINT = 640

function parseLevelHash() {
  const m = /^#level\/(.+)$/.exec(window.location.hash)
  return m ? decodeURIComponent(m[1]) : null
}

export default function App() {
  const { t } = useI18n()
  const { favorites, toggleFavorite } = useFavorites()
  const { visited, markVisited } = useVisited()
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
    // 'all' | 'with' | 'without' — présence d'au moins une entité connue.
    entityPresence: 'all',
    safeOnly: false,
    securedOnly: false,
    hideStubs: false,
    // Tags de danger sélectionnés (correspondance OR : un seul suffit).
    activeTags: new Set(),
  }))
  // Chemin actif entre deux niveaux (liste d'ids), voir PathFinder.
  const [pathIds, setPathIds] = useState(null)

  // Pages annexes : simple bascule via le hash de l'URL, pas besoin d'un
  // routeur pour deux pages secondaires.
  const [showLegal, setShowLegal] = useState(
    () => typeof window !== 'undefined' && window.location.hash === '#legal',
  )
  const [showGlossary, setShowGlossary] = useState(
    () => typeof window !== 'undefined' && window.location.hash === '#entities',
  )

  // Lien partageable vers un niveau précis : #level/<id>. Lu au chargement
  // (et à chaque navigation historique), écrit à chaque changement de
  // sélection via replaceState pour ne pas polluer l'historique.
  const [selectedId, setSelectedId] = useState(() => {
    if (typeof window === 'undefined') return null
    const id = parseLevelHash()
    return id && levelsById[id] ? id : null
  })

  useEffect(() => {
    function onHashChange() {
      const hash = window.location.hash
      setShowLegal(hash === '#legal')
      setShowGlossary(hash === '#entities')
      if (hash === '#legal' || hash === '#entities') return
      const id = parseLevelHash()
      if (id && levelsById[id]) {
        setSelectedId(id)
        setFocusNonce((n) => n + 1)
      } else if (!hash) {
        setSelectedId(null)
      }
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  // Recentre la carte une fois au chargement si on est arrivé via un lien
  // direct vers un niveau (#level/xxx).
  useEffect(() => {
    if (selectedId) setFocusNonce((n) => n + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Garde l'URL synchronisée avec le niveau sélectionné, sauf pendant
  // l'affichage des pages annexes (mentions légales, glossaire).
  useEffect(() => {
    if (showLegal || showGlossary) return
    const url = new URL(window.location.href)
    url.hash = selectedId ? `level/${selectedId}` : ''
    window.history.replaceState(null, '', url)
  }, [selectedId, showLegal, showGlossary])

  // Niveaux visibles après application des filtres.
  const visibleLevels = useMemo(
    () =>
      allLevels.filter((lvl) => {
        if (filters.hiddenClasses.has(lvl.class)) return false
        if (lvl.danger.level < filters.dangerMin || lvl.danger.level > filters.dangerMax) return false
        if (filters.entityPresence === 'with' && lvl.entities.length === 0) return false
        if (filters.entityPresence === 'without' && lvl.entities.length > 0) return false
        if (filters.safeOnly && !lvl.survival.safe) return false
        if (filters.securedOnly && !lvl.survival.secure) return false
        if (filters.hideStubs && lvl.meta?.status === 'stub') return false
        if (filters.activeTags.size > 0 && !lvl.danger.tags?.some((tag) => filters.activeTags.has(tag))) {
          return false
        }
        return true
      }),
    [filters],
  )

  // Un chemin actif doit rester entièrement visible sur la carte, même si
  // une étape est masquée par les filtres courants.
  const mapLevels = useMemo(() => {
    if (!pathIds || pathIds.length === 0) return visibleLevels
    const visibleIds = new Set(visibleLevels.map((l) => l.id))
    const extra = pathIds.map((id) => levelsById[id]).filter((l) => l && !visibleIds.has(l.id))
    return extra.length ? [...visibleLevels, ...extra] : visibleLevels
  }, [visibleLevels, pathIds])

  // Désélectionne si le niveau sélectionné n'est plus affiché sur la carte.
  const selectedLevel =
    selectedId && mapLevels.some((l) => l.id === selectedId) ? levelsById[selectedId] : null

  // Suivi d'exploration : marque le niveau comme visité dès qu'il est
  // sélectionné (recherche, clic, chemin, glossaire, lien direct...).
  useEffect(() => {
    if (selectedLevel) markVisited(selectedLevel.id)
  }, [selectedLevel, markVisited])

  // Navigation clavier : flèche droite/gauche saute vers la première/
  // dernière connexion du niveau sélectionné (explore le graphe de proche
  // en proche), Échap ferme le panneau. Désactivée pendant la saisie dans
  // un champ (recherche, itinéraire...).
  useEffect(() => {
    function onKeyDown(e) {
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      if (e.key === 'Escape' && selectedId) {
        setSelectedId(null)
        return
      }
      if (!selectedLevel) return
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      const connections = selectedLevel.connections ?? []
      if (connections.length === 0) return
      e.preventDefault()
      const target = e.key === 'ArrowRight' ? connections[0].to : connections[connections.length - 1].to
      if (levelsById[target]) focusLevel(target)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedLevel, selectedId])

  // Sélection depuis la recherche / le glossaire / un chemin : ouvre le
  // panneau + recentre la carte.
  function focusLevel(id) {
    setSelectedId(id)
    setFocusNonce((n) => n + 1)
  }

  // Téléporte vers un niveau au hasard parmi ceux actuellement visibles —
  // un clin d'œil au thème (on erre dans les Backrooms sans destination).
  function randomLevel() {
    if (visibleLevels.length === 0) return
    const pick = visibleLevels[Math.floor(Math.random() * visibleLevels.length)]
    focusLevel(pick.id)
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
  if (showGlossary) {
    return <EntityGlossary onClose={() => { window.location.hash = '' }} />
  }

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__brand">
          <h1 className="app__title">{t('app.title')}</h1>
          <p className="app__subtitle">{t('app.subtitle')}</p>
        </div>
        <SearchBar levels={visibleLevels} onSelect={focusLevel} />
        <AmbientSoundToggle />
        <LanguageSwitcher />
      </header>

      <div className="app__body">
        <div className="app__map">
          <MapView
            levels={mapLevels}
            activeLayers={activeLayers}
            selectedId={selectedLevel?.id ?? null}
            pathIds={pathIds}
            focusNonce={focusNonce}
            onSelect={setSelectedId}
          />

          <OnboardingHint dismissSignal={selectedId} />

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
            <Filters
              filters={filters}
              onChange={setFilters}
              shownCount={visibleLevels.length}
              onRandom={randomLevel}
            />
            <PathFinder onPathChange={setPathIds} onSelectLevel={focusLevel} />
            <StatsPanel visitedCount={visited.size} />
          </div>

          <Legend />
        </div>

        <SidePanel
          level={selectedLevel}
          onSelect={setSelectedId}
          onClose={() => setSelectedId(null)}
          isFavorite={selectedLevel ? favorites.has(selectedLevel.id) : false}
          onToggleFavorite={() => selectedLevel && toggleFavorite(selectedLevel.id)}
        />
      </div>

      <footer className="app-footer">
        <a
          href="https://github.com/Robote7701/backrooms-map/blob/master/CHANGELOG.md"
          target="_blank"
          rel="noreferrer noopener"
        >
          {t('footer.changelog')}
        </a>
        <a href="#entities">{t('footer.glossary')}</a>
        <a href="#legal">{t('footer.legal')}</a>
      </footer>
    </div>
  )
}
