import { useEffect, useRef } from 'react'
import cytoscape from 'cytoscape'
import fcose from 'cytoscape-fcose'
import { baseStylesheet } from './cytoscapeStyle'

// Enregistrement unique de l'extension de layout auto.
let fcoseRegistered = false
function ensureExtensions() {
  if (!fcoseRegistered) {
    cytoscape.use(fcose)
    fcoseRegistered = true
  }
}

/**
 * Choisit et lance le layout selon la stratégie HYBRIDE :
 *  - tous les nœuds ont des coordonnées -> 'preset' (positions du JSON)
 *  - certains n'en ont pas -> 'fcose' auto, en figeant ceux qui en ont
 */
export function runHybridLayout(cy) {
  const nodes = cy.nodes()
  if (nodes.length === 0) return

  const withCoords = nodes.filter((n) => n.data('hasCoords'))
  const allHaveCoords = withCoords.length === nodes.length

  if (allHaveCoords) {
    cy.layout({ name: 'preset', fit: true, padding: 60, animate: false }).run()
    return
  }

  cy.layout({
    name: 'fcose',
    quality: 'proof',
    animate: false,
    fit: true,
    padding: 60,
    nodeSeparation: 140,
    idealEdgeLength: 150,
    // On fige les nœuds qui possèdent déjà des coordonnées.
    fixedNodeConstraint: withCoords.map((n) => ({
      nodeId: n.id(),
      position: n.position(),
    })),
  }).run()
}

/**
 * Hook : crée une instance Cytoscape dans `containerRef` une seule fois
 * et la nettoie au démontage. Renvoie une ref vers l'instance.
 */
export function useCytoscape(containerRef, onReady) {
  const cyRef = useRef(null)

  useEffect(() => {
    ensureExtensions()
    const cy = cytoscape({
      container: containerRef.current,
      style: baseStylesheet,
      elements: [],
      minZoom: 0.2,
      maxZoom: 3,
      boxSelectionEnabled: false,
    })
    cyRef.current = cy
    onReady?.(cy)

    return () => {
      cy.destroy()
      cyRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return cyRef
}
