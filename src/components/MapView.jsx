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
export default function MapView({ levels, activeLayers, selectedId, focusNonce, onSelect }) {
  const { lang } = useI18n()
  const containerRef = useRef(null)
  const cyRef = useCytoscape(containerRef, (cy) => bindEvents(cy))

  // Garde une réf stable vers onSelect pour les handlers d'événements.
  const onSelectRef = useRef(onSelect)
  useEffect(() => {
    onSelectRef.current = onSelect
  }, [onSelect])

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
      n.connectedEdges().removeClass('highlighted')
    })
  }

  // (Re)construit les éléments quand niveaux ou langue changent.
  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return
    const { nodes, edges } = buildGraph(levels, lang)
    cy.elements().remove()
    cy.add([...nodes, ...edges])
    runHybridLayout(cy)
    // Réapplique la sélection après reconstruction.
    applySelection(cy, selectedId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levels, lang])

  // Recompose le stylesheet quand les calques changent.
  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return
    cy.style().fromJson(composeStylesheet(baseStylesheet, activeLayers)).update()
  }, [activeLayers, cyRef])

  // Met à jour les classes de sélection / mise en avant.
  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return
    applySelection(cy, selectedId)
  }, [selectedId, cyRef])

  // Recentre la carte sur le niveau recherché (focusNonce change à chaque recherche).
  useEffect(() => {
    if (!focusNonce) return
    const cy = cyRef.current
    if (!cy || !selectedId) return
    const node = cy.getElementById(selectedId)
    if (node.empty()) return
    cy.animate({ center: { eles: node }, zoom: Math.max(cy.zoom(), 1.4) }, { duration: 350 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusNonce])

  return <div ref={containerRef} className="map-view" />
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
