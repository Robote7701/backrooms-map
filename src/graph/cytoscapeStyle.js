// Style de base du graphe (thème dark/neon). Les calques ajoutent leurs
// propres règles PAR-DESSUS ce tableau (voir layers/ et MapView).
export const baseStylesheet = [
  {
    selector: 'node',
    style: {
      label: 'data(label)',
      color: '#e8e8f0',
      'font-family': "'JetBrains Mono', 'Courier New', monospace",
      'font-size': 13,
      'text-valign': 'bottom',
      'text-halign': 'center',
      'text-margin-y': 8,
      'text-wrap': 'wrap',
      'text-max-width': 140,
      'text-outline-color': '#0a0a0f',
      'text-outline-width': 2,
      width: 34,
      height: 34,
      'background-color': '#1b1b26',
      'border-color': '#d4c26a',
      'border-width': 2,
      'transition-property': 'border-color, border-width, background-color, width, height',
      'transition-duration': '150ms',
    },
  },
  {
    // Survol : glow néon cyan.
    selector: 'node.hovered',
    style: {
      'border-color': '#31d7f5',
      'border-width': 4,
      'shadow-blur': 24,
      'shadow-color': '#31d7f5',
      'shadow-opacity': 0.9,
      width: 40,
      height: 40,
    },
  },
  {
    // Sélection : glow magenta persistant.
    selector: 'node.selected',
    style: {
      'border-color': '#e34ba9',
      'border-width': 4,
      'shadow-blur': 28,
      'shadow-color': '#e34ba9',
      'shadow-opacity': 1,
    },
  },

  // ---- Edges (routes) ----
  {
    selector: 'edge',
    style: {
      width: 2,
      'line-color': '#3a3a52',
      'target-arrow-color': '#3a3a52',
      'curve-style': 'bezier',
      opacity: 0.85,
      'transition-property': 'line-color, width, opacity',
      'transition-duration': '150ms',
    },
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
      'target-arrow-color': '#3a3a52',
      'source-arrow-color': '#3a3a52',
    },
  },
  // Type de route -> couleur de ligne (voir Légende).
  {
    selector: 'edge.noclip',
    style: {
      'line-color': '#31d7f5',
      'line-style': 'dashed',
      'target-arrow-color': '#31d7f5',
      'source-arrow-color': '#31d7f5',
    },
  },
  {
    selector: 'edge.porte',
    style: {
      'line-color': '#d4c26a',
      'target-arrow-color': '#d4c26a',
      'source-arrow-color': '#d4c26a',
    },
  },
  {
    selector: 'edge.escalier',
    style: {
      'line-color': '#8a7de0',
      'line-style': 'dotted',
      'target-arrow-color': '#8a7de0',
      'source-arrow-color': '#8a7de0',
    },
  },
  {
    // Edge relié au nœud survolé/sélectionné : mis en avant.
    selector: 'edge.highlighted',
    style: { width: 4, opacity: 1 },
  },
  {
    selector: 'edge.dimmed',
    style: { opacity: 0.15 },
  },
  {
    selector: 'node.dimmed',
    style: { opacity: 0.25 },
  },
]
