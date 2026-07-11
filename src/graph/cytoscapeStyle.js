// Style de base du graphe (thème dark/neon). Les calques ajoutent leurs
// propres règles PAR-DESSUS ce tableau (voir layers/ et MapView).
// Couleurs alignées sur les variables CSS de theme.css (Cytoscape ne lit pas
// les custom properties, on duplique donc les valeurs ici).
export const baseStylesheet = [
  {
    selector: 'node',
    style: {
      label: 'data(label)',
      color: '#f2f2fa',
      'font-family': 'JetBrains Mono, Courier New, monospace',
      'font-size': 13,
      'text-valign': 'bottom',
      'text-halign': 'center',
      'text-margin-y': 8,
      'text-wrap': 'wrap',
      'text-max-width': 140,
      'text-outline-color': '#030305',
      'text-outline-width': 2,
      width: 34,
      height: 34,
      'background-color': '#12121c',
      'border-color': '#ffd60a',
      'border-width': 2.5,
      'transition-property': 'border-color, border-width, background-color, width, height',
      'transition-duration': '150ms',
    },
  },
  {
    // Vue très dézoomée : masque les labels pour ne garder que les points.
    selector: 'node.lod-compact',
    style: { label: '' },
  },
  {
    // Survol : halo néon cyan (overlay = la façon Cytoscape de "glow").
    selector: 'node.hovered',
    style: {
      'border-color': '#00f0ff',
      'border-width': 4.5,
      'overlay-color': '#00f0ff',
      'overlay-opacity': 0.35,
      'overlay-padding': 12,
      width: 42,
      height: 42,
    },
  },
  {
    // Sélection : halo magenta persistant.
    selector: 'node.selected',
    style: {
      'border-color': '#ff2ec4',
      'border-width': 4.5,
      'overlay-color': '#ff2ec4',
      'overlay-opacity': 0.4,
      'overlay-padding': 12,
    },
  },

  // ---- Edges (routes) ----
  {
    selector: 'edge',
    style: {
      width: 2,
      'line-color': '#41415c',
      'target-arrow-color': '#41415c',
      'curve-style': 'bezier',
      opacity: 0.85,
      'transition-property': 'line-color, width, opacity',
      'transition-duration': '150ms',
    },
  },
  {
    // Vue d'ensemble (zoom faible) : routes masquées pour ne garder qu'un
    // semis de points lisible. Se révèlent en zoomant (voir MapView).
    selector: 'edge.lod-hidden',
    style: { opacity: 0, events: 'no' },
  },
  {
    selector: 'edge.oneway',
    style: { 'target-arrow-shape': 'triangle' },
  },
  {
    selector: 'edge.bidirectional',
    style: {
      'target-arrow-shape': 'triangle',
      'source-arrow-shape': 'triangle',
      'target-arrow-color': '#41415c',
      'source-arrow-color': '#41415c',
    },
  },
  // Type de route -> couleur de ligne (voir Légende).
  {
    selector: 'edge.noclip',
    style: {
      'line-color': '#00f0ff',
      'line-style': 'dashed',
      'target-arrow-color': '#00f0ff',
      'source-arrow-color': '#00f0ff',
    },
  },
  {
    selector: 'edge.porte',
    style: {
      'line-color': '#ffd60a',
      'target-arrow-color': '#ffd60a',
      'source-arrow-color': '#ffd60a',
    },
  },
  {
    selector: 'edge.escalier',
    style: {
      'line-color': '#b14bff',
      'line-style': 'dotted',
      'target-arrow-color': '#b14bff',
      'source-arrow-color': '#b14bff',
    },
  },
  {
    // Autre (portail, ascenseur, trou, mécanisme non classé).
    selector: 'edge.autre',
    style: {
      'line-color': '#8b8ba8',
      'target-arrow-color': '#8b8ba8',
      'source-arrow-color': '#8b8ba8',
    },
  },
  {
    // Edge relié au nœud survolé/sélectionné : mis en avant.
    selector: 'edge.highlighted',
    style: {
      width: 4,
      opacity: 1,
      'overlay-opacity': 0.22,
      'overlay-padding': 4,
    },
  },
  {
    selector: 'edge.dimmed',
    style: { opacity: 0.12 },
  },
  {
    selector: 'node.dimmed',
    style: { opacity: 0.22 },
  },

  // ---- Chemin actif (PathFinder) — toujours en dernier pour l'emporter
  // sur le LOD zoom, le dimming et même la sélection/survol. ----
  {
    selector: 'node.path',
    style: {
      'border-color': '#00e676',
      'border-width': 4,
      'overlay-color': '#00e676',
      'overlay-opacity': 0.3,
      'overlay-padding': 10,
      opacity: 1,
    },
  },
  {
    selector: 'edge.path',
    style: {
      'line-color': '#00e676',
      'target-arrow-color': '#00e676',
      'source-arrow-color': '#00e676',
      width: 5,
      opacity: 1,
      'z-index': 10,
    },
  },
]
