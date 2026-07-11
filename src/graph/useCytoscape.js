import { useEffect, useRef, useState } from 'react'
import { baseStylesheet } from './cytoscapeStyle'

// Cytoscape + son extension de layout pèsent l'essentiel du bundle JS.
// Chargés à la demande (après le premier rendu) plutôt qu'au démarrage,
// pour que la page affiche l'interface plus vite, surtout sur mobile.
let loadPromise = null
function loadCytoscape() {
  if (!loadPromise) {
    loadPromise = Promise.all([import('cytoscape'), import('cytoscape-fcose')]).then(
      ([cytoscapeMod, fcoseMod]) => {
        const cytoscape = cytoscapeMod.default
        cytoscape.use(fcoseMod.default)
        return cytoscape
      },
    )
  }
  return loadPromise
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
    randomize: true,
    animate: false,
    fit: true,
    padding: 80,
    // Graphe de ~100 nœuds : il faut une forte répulsion et une faible
    // gravité pour éviter que tout ne s'écrase au centre (surtout autour
    // des nœuds à très haut degré comme les niveaux 53/54/1).
    nodeSeparation: 260,
    idealEdgeLength: 320,
    nodeRepulsion: 28000,
    edgeElasticity: 0.15,
    gravity: 0.02,
    gravityRange: 8.0,
    numIter: 8000,
    // Empile proprement les nœuds isolés (stubs sans connexions) à part.
    tile: true,
    tilingPaddingVertical: 80,
    tilingPaddingHorizontal: 80,
    // On fige les nœuds qui possèdent déjà des coordonnées.
    fixedNodeConstraint: withCoords.map((n) => ({
      nodeId: n.id(),
      position: n.position(),
    })),
  }).run()
}

/**
 * Hook : charge Cytoscape à la demande, crée une instance dans
 * `containerRef` une seule fois et la nettoie au démontage.
 * Renvoie [cyRef, ready] — `ready` ne passe à true qu'une fois l'instance
 * disponible ; les effets qui en dépendent doivent l'ajouter à leurs deps.
 */
export function useCytoscape(containerRef, onReady) {
  const cyRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    loadCytoscape().then((cytoscape) => {
      if (cancelled) return
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
      setReady(true)
    })

    return () => {
      cancelled = true
      if (cyRef.current) {
        cyRef.current.destroy()
        cyRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [cyRef, ready]
}
