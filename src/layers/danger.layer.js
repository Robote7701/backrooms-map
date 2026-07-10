// Calque "Danger" : colore les nœuds du vert (peu dangereux) au rouge
// (mortel) selon danger.level, via un dégradé mapData de Cytoscape.
export default {
  id: 'danger',
  labelKey: 'layers.danger',
  defaultOn: false,
  // Règles ajoutées au stylesheet quand le calque est actif.
  stylesheet: [
    {
      selector: 'node',
      style: {
        // 1 -> vert, 5 -> rouge (dégradé continu, néons saturés).
        'background-color': 'mapData(dangerLevel, 1, 5, #00e676, #ff2d55)',
        'border-color': 'mapData(dangerLevel, 1, 5, #00e676, #ff2d55)',
      },
    },
  ],
}
