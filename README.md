# Backrooms — Map interactive

Site statique (Vite + React + Cytoscape.js) affichant les niveaux des Backrooms
et les routes qui les relient. 100 % statique, déployable sur GitHub Pages.

## Démarrer

Prérequis : **Node.js ≥ 18**.

```bash
npm install
npm run validate   # vérifie l'intégrité des niveaux
npm run dev        # http://localhost:5173
```

Build de production :

```bash
npm run build      # -> dist/
npm run preview    # sert le build localement
```

## Fonctionnalités (v1)

- **Map interactive** : niveaux = nœuds, routes = liens ; zoom / pan / clic → panneau latéral (nom, description, danger, entités, connexions, lien wiki).
- **Multilingue FR/EN** : UI dans `src/i18n/locales/`, textes des niveaux dans leur champ `i18n`. Architecture extensible (ajouter `xx.json` + l'enregistrer).
- **Calques** (toggle) : `Danger` (couleur vert→rouge) et `Entités` (anneau + compte).
- **Filtres** : par classe et par plage de niveau de danger.
- **Légende** repliable (types de routes, échelle de danger, badge entités).

## Architecture

```
src/
  data/levels/*.json   1 fichier par niveau (schéma = level-0.json à la racine)
  data/loadLevels.js   chargement auto (import.meta.glob)
  graph/               construction + style Cytoscape + layout hybride
  layers/              système de calques générique (1 fichier par calque)
  i18n/                contexte langue + dictionnaires + lecture des textes niveaux
  components/          MapView, SidePanel, Filters, LayerToggles, Legend, LanguageSwitcher
  styles/theme.css     thème dark/neon
scripts/validate-levels.mjs   validation des JSON (connexions, doublons, schéma)
```

### Ajouter un niveau

1. Copier un JSON existant dans `src/data/levels/`, garder le schéma de `level-0.json`.
2. Renseigner `connections` (les `to` doivent exister).
3. `npm run validate` puis `npm run dev`. Rien d'autre à câbler.

### Ajouter un calque

Créer `src/layers/mon-calque.layer.js` (`id`, `labelKey`, `defaultOn`, `stylesheet`)
puis l'enregistrer dans `src/layers/registry.js`.

### Layout hybride

Les nœuds avec `coordinates` sont placés à ces positions ; les autres sont
disposés automatiquement (fcose) en figeant les premiers. Voir `graph/useCytoscape.js`.

## Déploiement GitHub Pages

`vite.config.js` utilise `base: './'` (chemins relatifs). Build (`npm run build`)
puis publier le dossier `dist/` (ex. via GitHub Actions ou la branche `gh-pages`).
