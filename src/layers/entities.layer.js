// Calque "Entités" : badge sur les nœuds portant des entités.
// Le badge = anneau magenta dont l'épaisseur croît avec le nombre
// d'entités, + le compte affiché dans le label (labelWithEntities).
export default {
  id: 'entities',
  labelKey: 'layers.entities',
  defaultOn: false,
  stylesheet: [
    {
      selector: 'node[entityCount > 0]',
      style: {
        label: 'data(labelWithEntities)',
        'border-color': '#ff2ec4',
        'border-width': 'mapData(entityCount, 1, 4, 3, 10)',
      },
    },
  ],
}
