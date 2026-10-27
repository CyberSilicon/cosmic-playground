# Cosmic Playground — Realism Patch (outils)

Ce dossier contient le script `apply_improvements.py` qui applique des correctifs de
réalisme et de robustesse sur une copie de `CyberSilicon/cosmic-playground` (branche
`feat/cosmic-realism-v2`, jamais `master`).

## Ce que le patch fait

- **PlanetaryEVAExplorer.tsx** : collision de terrain basée sur les vraies dimensions de la géométrie (plus de traversée du sol), clamp des indices de grille, brouillard adapté par destination.
- **StationFrame.tsx** : suppression du cosmonaute découpé en avant-plan (cutout plat non réaliste) en attendant un modèle PBR sous licence.
- **CinematicFlightScene.tsx** : géométrie de fuselage plus lisse, chargement optionnel d'un modèle GLB `/assets/models/ship.glb` sans plantage si absent.
- **CinematicTravelModal.tsx** : barre de progression de vol sans expression de gabarit cassée.
- **ExplorerPanel.tsx** : plus de panorama Mars par défaut pour les mondes sans photo vérifiée.
- **MarsLabPanel.tsx** : icônes Lucide à la place des emojis, nouvel onglet "Photos NASA" avec `MarsPhotoExplorer`.
- **MarsPhotoExplorer.tsx** (nouveau) : panoramas réels NASA/JPL avec crédits, source et comportement de secours.
- **UniverseMapOverview.tsx / ExoplanetSciencePanel.tsx** (nouveaux) : composants référencés par `UniverseMapPage.tsx`.
- **universe-catalog.ts** : adapté sur `./destinations` (ancienne version sauvegardée sous `docs/universe-catalog-legacy.txt`).
- **docs/REALISM_V2_ASSETS.md** (nouveau) : liste d'acquisition d'assets sous licence.

## Prérequis

Exécuter depuis la racine du dépôt :
```
python tools/realism-patch/apply_improvements.py
npm ci
npx tsc --noEmit
npm run build
```

Le script ne touche pas l'historique Git et ne pousse rien sur GitHub.
