<div align="center">

# 🟨 Backrooms — Carte Interactive

**Explorez les 99 premiers niveaux des Backrooms sur une carte interactive, sombre et néon.**

[![Deploy to GitHub Pages](https://github.com/Robote7701/backrooms-map/actions/workflows/deploy.yml/badge.svg)](https://github.com/Robote7701/backrooms-map/actions/workflows/deploy.yml)
![Niveaux](https://img.shields.io/badge/niveaux-99-d4c26a)
![Langues](https://img.shields.io/badge/langues-FR%20%2F%20EN%20%2F%20DE-31d7f5)
![Stack](https://img.shields.io/badge/stack-Vite%20%2B%20React%20%2B%20Cytoscape.js-e34ba9)
![Licence](https://img.shields.io/badge/licence-MIT-8a7de0)

**[🔗 Voir la carte en ligne](https://robote7701.github.io/backrooms-map/)** · [📋 Changelog](CHANGELOG.md)

</div>

---

Une carte interactive et navigable de l'univers des **Backrooms** : niveaux affichés
comme des nœuds, routes (portes, escaliers, no-clip...) comme des liens. Cliquez sur
un niveau pour son fiche complète — danger, entités, connexions, conseils de survie.
Site 100 % statique, sans backend, déployé automatiquement sur GitHub Pages.

## ✨ Fonctionnalités

- 🗺️ **Carte interactive** — zoom, pan, clic sur un nœud pour ouvrir le panneau de détails
- 🔍 **Recherche** — trouvez un niveau par nom ou numéro, la carte se recentre dessus
- 🌐 **Multilingue FR/EN/DE** — interface dans les 3 langues, contenu des niveaux en FR/EN (repli automatique en DE), architecture extensible
- 🎨 **Calques** — Danger (dégradé vert → rouge) et Entités (badge de présence)
- 🧭 **Filtres** — par classe de niveau et par plage de danger
- 📖 **Légende repliable** — types de routes, échelle de danger
- 👁️ **Liens vers les entités** — chaque entité pointe vers sa fiche sur le wiki source
- 🌑 **Thème dark/neon** — ambiance "vieux terminal / liminal space"

## 📊 Contenu

**103 niveaux** au total : les 99 premiers niveaux normaux du wiki Backrooms
([backrooms-wiki.wikidot.com](https://backrooms-wiki.wikidot.com/normal-levels-i)),
plus 4 niveaux emblématiques (Level 0, The Manila Room, Level Fun, Level !),
reliés par **363 connexions**. Descriptions reformulées (pas de copie du wiki),
lien source conservé sur chaque fiche.

## 🚀 Démarrer

Prérequis : **Node.js ≥ 18**.

```bash
npm install
npm run validate   # vérifie l'intégrité des niveaux et des connexions
npm run dev        # http://localhost:5173
```

Build de production :

```bash
npm run build      # -> dist/
npm run preview    # sert le build localement
```

## 🏗️ Architecture

```
src/
  data/levels/*.json   1 fichier par niveau (schéma = level-0.json à la racine)
  data/loadLevels.js   chargement auto (import.meta.glob)
  graph/               construction + style Cytoscape + layout hybride
  layers/              système de calques générique (1 fichier par calque)
  i18n/                contexte langue + dictionnaires + lecture des textes niveaux
  components/          MapView, SidePanel, SearchBar, Filters, LayerToggles, Legend...
  styles/theme.css     thème dark/neon
scripts/
  validate-levels.mjs        validation des JSON (connexions, doublons, schéma)
  import/generate.mjs        génère les niveaux depuis scripts/import/raw/*.json
  import/fr-translations.json  traductions FR fusionnées à la génération
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

## 🌍 Déploiement GitHub Pages

Le déploiement est automatique via GitHub Actions (`.github/workflows/deploy.yml`) :
chaque push sur `master` build le site et le publie sur Pages.
`vite.config.js` utilise `base: './'` (chemins relatifs), compatible sous-répertoire.

## 📜 Licence & source

Code sous licence MIT. Les données de niveaux sont adaptées du
[Backrooms Wiki](https://backrooms-wiki.wikidot.com/) (CC-BY-SA) — descriptions
reformulées, lien source conservé sur chaque fiche.
