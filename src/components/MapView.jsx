import { useEffect, useRef } from 'react'
import { useCytoscape, runHybridLayout } from '../graph/useCytoscape'
import { buildGraph } from '../graph/buildGraph'
import { baseStylesheet } from '../graph/cytoscapeStyle'
import { composeStylesheet } from '../layers/registry'
import { useI18n } from '../i18n/I18nContext'

/**
 * Conteneur Cytoscape. Se re-synchronise avec :
 *  - la liste des niveaux visibles (filtres) + la langue -> reconstruit les éléments
 *  - les calques actifs -> recompose le stylesheet
 *  - la sélection -> classes .selected / .highlighted
 */
export default function MapView({ levels, activeLayers, selectedId, pathIds, focusNonce, onSelect }) {
  const { lang } = useI18n()
  const containerRef = useRef(null)
  const [cyRef, cyReady] = useCytoscape(containerRef, (cy) => bindEvents(cy))

  // Garde une réf stable vers onSelect pour les handlers d'événements.
  const onSelectRef = useRef(onSelect)
  useEffect(() => {
    onSelectRef.current = onSelect
  }, [onSelect])

  // Idem pour le niveau sélectionné : le handler de survol doit savoir
  // quelles routes appartiennent à la sélection pour ne pas les éteindre
  // par erreur quand la souris quitte le nœud (voir mouseout ci-dessous).
  const selectedIdRef = useRef(selectedId)
  useEffect(() => {
    selectedIdRef.current = selectedId
  }, [selectedId])

  function bindEvents(cy) {
    cy.on('tap', 'node', (evt) => onSelectRef.current?.(evt.target.id()))
    cy.on('tap', (evt) => {
      if (evt.target === cy) onSelectRef.current?.(null)
    })
    cy.on('mouseover', 'node', (evt) => {
      const n = evt.target
      n.addClass('hovered')
      n.connectedEdges().addClass('highlighted')
    })
    cy.on('mouseout', 'node', (evt) => {
      const n = evt.target
      n.removeClass('hovered')
      // Ne retire la mise en avant que sur les routes qui ne touchent pas
      // le nœud sélectionné : celles-là doivent rester visibles même sans
      // survol, tant que la sélection est active.
      const selId = selectedIdRef.current
      n.connectedEdges().forEach((edge) => {
        if (edge.data('source') !== selId && edge.data('target') !== selId) {
          edge.removeClass('highlighted')
        }
      })
    })

    // Niveau de détail selon le zoom : avec ~100 nœuds et 360+ routes,
    // tout afficher en permanence donne une pelote illisible. En vue
    // d'ensemble on ne montre qu'un semis de points ; routes et labels
    // se révèlent progressivement en zoomant.
    let lodFrame = null
    const applyLod = () => {
      lodFrame = null
      const z = cy.zoom()
      cy.batch(() => {
        cy.edges().toggleClass('lod-hidden', z < 0.55)
        cy.nodes().toggleClass('lod-compact', z < 0.4)
      })
    }
    cy.on('zoom pan', () => {
      if (lodFrame) return
      lodFrame = requestAnimationFrame(applyLod)
    })
    cy.on('layoutstop', applyLod)
  }

  // (Re)construit les éléments quand niveaux ou langue changent.
  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return
    const { nodes, edges } = buildGraph(levels, lang)
    cy.elements().remove()
    cy.add([...nodes, ...edges])
    runHybridLayout(cy)
    // Réapplique la sélection et le chemin actif après reconstruction.
    applySelection(cy, selectedId)
    applyPath(cy, pathIds)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levels, lang, cyReady])

  // Recompose le stylesheet quand les calques changent.
  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return
    cy.style().fromJson(composeStylesheet(baseStylesheet, activeLayers)).update()
  }, [activeLayers, cyRef, cyReady])

  // Met à jour les classes de sélection / mise en avant.
  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return
    applySelection(cy, selectedId)
  }, [selectedId, cyRef, cyReady])

  // Met à jour la surbrillance du chemin actif (PathFinder).
  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return
    applyPath(cy, pathIds)
  }, [pathIds, cyRef, cyReady])

  // Recentre la carte sur le niveau recherché (focusNonce change à chaque recherche).
  useEffect(() => {
    if (!focusNonce) return
    const cy = cyRef.current
    if (!cy || !selectedId) return
    const node = cy.getElementById(selectedId)
    if (node.empty()) return
    cy.animate({ center: { eles: node }, zoom: Math.max(cy.zoom(), 1.4) }, { duration: 350 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusNonce, cyReady])

  return (
    <>
      <div ref={containerRef} className="map-view" />
      <div className="map-ambient" aria-hidden="true" />
    </>
  )
}

function applySelection(cy, selectedId) {
  cy.batch(() => {
    cy.elements().removeClass('selected highlighted dimmed')
    if (!selectedId) return
    const node = cy.getElementById(selectedId)
    if (node.empty()) return
    const neighborhood = node.closedNeighborhood()
    cy.elements().not(neighborhood).addClass('dimmed')
    node.addClass('selected')
    node.connectedEdges().addClass('highlighted')
  })
}

// Marque les nœuds/arêtes du chemin trouvé par PathFinder (classe .path,
// toujours au-dessus du LOD zoom et du dimming, voir cytoscapeStyle.js).
function applyPath(cy, pathIds) {
  cy.batch(() => {
    cy.elements().removeClass('path')
    if (!pathIds || pathIds.length < 2) return
    for (const id of pathIds) cy.getElementById(id).addClass('path')
    for (let i = 0; i < pathIds.length - 1; i++) {
      const a = pathIds[i]
      const b = pathIds[i + 1]
      cy.edges(`[source = "${a}"][target = "${b}"], [source = "${b}"][target = "${a}"]`).addClass('path')
    }
  })
  if (pathIds && pathIds.length >= 2) {
    const nodes = cy.collection(pathIds.map((id) => cy.getElementById(id)).filter((n) => !n.empty()))
    if (nodes.length > 0) cy.animate({ fit: { eles: nodes, padding: 80 } }, { duration: 400 })
  }
}
