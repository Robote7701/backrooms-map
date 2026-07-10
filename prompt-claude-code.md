# Prompt de démarrage — Map interactive Backrooms

Copie-colle tout le bloc ci-dessous dans Claude Code, dans un dossier vide (ex: `~/projets/backrooms-map`). Mets le fichier `level-0.json` dans le dossier avant de lancer, Claude Code s'en servira comme référence.

---

Je veux créer un site web statique : une **map interactive de l'univers des Backrooms** montrant les niveaux (nœuds) et les routes qui les relient (liens). Voici les specs :

## Stack
- Vite + React
- Cytoscape.js pour le graphe interactif (zoom, pan, clic sur nœud)
- Site 100% statique, déployable sur GitHub Pages
- Pas de backend, toutes les données en JSON

## Données
- Un fichier JSON par niveau dans `src/data/levels/`. Le schéma est défini par le fichier `level-0.json` à la racine du projet : lis-le et respecte-le exactement.
- Les connexions entre niveaux sont déclarées dans chaque fichier de niveau (champ `connections`). Génère le graphe Cytoscape à partir de ces fichiers.
- Crée 6 niveaux de test en plus du Level 0 : Level 1, Level 2, Level 3, Level Fun (=), The Manila Room, Level ! — avec des données cohérentes avec le lore Backrooms.

## Fonctionnalités v1
1. **Map interactive** : niveaux affichés comme des nœuds, routes comme des liens. Clic sur un nœud → panneau latéral avec nom, description, danger, entités, connexions, lien wiki.
2. **Multilingue FR/EN** : sélecteur de langue, textes UI dans `src/locales/fr.json` et `en.json`, textes des niveaux lus depuis le champ `i18n` des JSON. Architecture extensible pour ajouter d'autres langues.
3. **Calques** (boutons toggle) :
   - Calque "Danger" : colore les nœuds selon `danger.level` (vert → rouge)
   - Calque "Entités" : badge sur les nœuds avec le nombre d'entités
4. **Filtres** : masquer les niveaux par classe (`habitable`, `dangereux`, etc.) et par niveau de danger min/max.
5. **Légende** repliable expliquant couleurs et types de routes (noclip, porte, escalier...).

## Style visuel
- Thème dark/neon : fond très sombre (#0a0a0f), accents néon (cyan, magenta, jaune Backrooms #d4c26a)
- Typo légèrement rétro/monospace pour les titres
- Effet de glow subtil sur les nœuds et liens au survol
- Ambiance "vieux terminal / liminal space", mais lisible avant tout

## Architecture (important pour le futur)
- Sépare bien : données (JSON) / logique du graphe / UI / i18n
- Les calques doivent être un système générique (un fichier de config par calque) pour pouvoir en ajouter facilement plus tard (ressources, avant-postes, factions...)
- Prévois un petit script de validation des JSON (vérifie que chaque `connections.to` pointe vers un niveau existant)

Commence par me proposer l'arborescence du projet et le plan, puis on avance étape par étape. Initialise un dépôt Git dès le début.

---

## Conseils d'utilisation

- **Modèle** : Sonnet par défaut. Passe sur Opus/Fable (`/model`) seulement si ça bloque sur un problème complexe.
- Avance par étapes : valide l'arborescence, puis la map basique, puis les calques. Commit Git à chaque étape qui marche (`demande-lui de committer`).
- Pour ajouter un niveau plus tard : "Ajoute le Level 4 en suivant le schéma, avec [tes infos]" — c'est tout.
- Quand tu veux déployer : "Configure le déploiement GitHub Pages".
