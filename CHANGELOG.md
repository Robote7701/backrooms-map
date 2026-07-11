# Changelog

Toutes les évolutions notables de ce projet sont documentées ici.
Format inspiré de [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/).

## [1.5.0] — 2026-07-11

### Ajouté
- Filtres enrichis et instructifs : compte de niveaux par classe, compteur
  « X / Y niveaux affichés », filtre par présence d'entités (avec/sans),
  filtre par sécurité du lieu (Sûr / Sécurisé), filtre par dangers
  fréquents (12 tags les plus courants, calculés depuis les données),
  option pour masquer les fiches incomplètes.
- Bouton **🎲 Niveau au hasard** : téléporte vers un niveau visible pris
  au hasard, recentre la carte et ouvre son panneau.

## [1.4.0] — 2026-07-11

### Ajouté
- Allemand (DE) comme troisième langue de l'interface, avec drapeau
  dédié dans le sélecteur. Le contenu des niveaux (non traduit en DE)
  retombe proprement sur l'anglais.
- Page **Mentions légales & confidentialité** (éditeur, contact, hébergeur,
  crédits, politique de confidentialité), accessible via un lien discret
  en pied de page, bilingue puis trilingue.

### Corrigé
- Les routes du niveau sélectionné disparaissaient dès qu'on cessait de
  survoler son nœud (conflit entre les classes CSS de survol et de
  sélection).
- Mise en page mobile complète : en-tête empilé proprement, panneau
  Calques/Filtres transformé en tiroir repliable au lieu de recouvrir la
  carte, page de nouveau scrollable au lieu d'être figée en plein écran.
- Vue d'ensemble trop dense (« amas de points ») : les routes et labels
  ne s'affichent plus qu'à partir d'un certain niveau de zoom (LOD),
  laissant un semis de points lisible au chargement.

## [1.3.0] — 2026-07-11

### Modifié
- Thème visuel repensé : fond quasi noir, palette néon plus saturée
  (cyan, magenta, jaune, violet), glow renforcé sur les éléments actifs.
- Paramètres du layout automatique (fcose) retravaillés pour mieux
  étaler les ~100 niveaux au premier chargement.

### Documentation
- README complet (badges, aperçu des fonctionnalités, statistiques,
  architecture) et déploiement continu vers GitHub Pages via GitHub
  Actions à chaque push sur `master`.

## [1.2.0] — 2026-07-11

### Ajouté
- Import complet des 99 premiers niveaux normaux du
  [Backrooms Wiki](https://backrooms-wiki.wikidot.com/) : classe, danger,
  entités (avec noms réels), connexions typées (porte/escalier/no-clip/
  autre), descriptions reformulées avec lien vers la fiche source.
- Barre de recherche : trouver un niveau par nom ou numéro, la carte se
  recentre et zoome dessus.
- Traductions françaises complètes des 99 niveaux importés.
- Liens externes vers la page wiki de chaque entité mentionnée.
- Emoji/icônes sur les classes de niveau, types de routes, langues,
  présence d'entités et badges de survie.
- Pipeline de génération réutilisable (`scripts/import/`) : lots de
  données brutes → fichiers de niveaux, traductions fusionnées à la
  génération, idempotent.

## [1.1.0] — 2026-07-10

### Corrigé
- Propriétés de style Cytoscape invalides (`shadow-*` remplacé par
  `overlay-*` pour le glow, `font-family` mal formaté).

### Ajouté
- Import pilote des Levels 1 à 10 depuis le wiki, avec le pipeline de
  génération initial.

## [1.0.0] — 2026-07-10

### Ajouté
- Première version de la carte interactive : niveaux affichés comme des
  nœuds Cytoscape.js, routes comme des liens, panneau latéral de détails.
- Multilingue FR/EN (interface + contenu des niveaux).
- Calques Danger (dégradé de couleur) et Entités (badge de présence).
- Filtres par classe et par plage de danger, légende repliable.
- Layout hybride : positions fixes pour les niveaux ancres (Level 0,
  The Manila Room, Level Fun, Level !), disposition automatique pour
  les autres.
- Thème visuel dark/neon.
- Stack Vite + React + Cytoscape.js, site 100 % statique.
