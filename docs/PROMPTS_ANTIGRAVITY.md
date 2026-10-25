# Prompts Antigravity — Cosmic Playground

> **À faire dans l'ordre.** Un prompt = une étape, avec vérification `npm run build` et capture du rendu navigateur entre chaque étape. Ne lance pas tous les prompts simultanément.

## 00 — Initialisation et analyse de la référence

```text
Tu es un expert senior en interfaces immersives, Next.js, TypeScript, Three.js, React Three Fiber, animation web et science planétaire. Tu disposes dans le projet de `reference/CAPTURE_ORIGINALE.png`, de deux planches d'inspiration et de cinq arrière-plans dans `public/assets/scenes/`. Inspecte-les avant de coder.

OBJECTIF INVARIABLE : reproduire au plus près le HUB SPATIAL montré dans CAPTURE_ORIGINALE.png, avec un site véritablement interactif, pas une capture aplatie.

Analyse d'abord la capture de 1734×478 : grand cadre métallique et station à GAUCHE ; personnage/astronaute devant le hublot à gauche-centre ; Terre occupant essentiellement le BAS de l'écran ; planètes et noms en ligne de gauche vers la droite à travers le ciel (Lune, Mars, Europe, Titan, Saturne) ; arcs lumineux pointillés et en couleur ; barre de navigation petite en HAUT-DROITE ; encart SPACE HUB en BAS-DROITE. Noir profond, cyan électrique, ambre doux, verre fumé, typographie en capitales espacées. Les positions dans cette capture sont des repères artistiques, pas des positions astronomiques réelles.

CRITÈRES : sur une fenêtre 1734×478 le rendu doit immédiatement rappeler cette composition. Ne crée PAS une landing page verticale avec grosse section de texte et des cartes marketing. Pas de hero générique, ni trois panneaux empilés, ni lignes d'interface baked-in dans un PNG. Le screenshot original est une référence, pas un arrière-plan visible en production.

STACK : Next.js App Router TypeScript, Tailwind, Three.js, @react-three/fiber, @react-three/drei, GSAP ou animations CSS, lucide-react. Sans backend, auth ni services payants au MVP. Ajouter la gestion de reduced motion.

ACTIONS : inspecter le dossier existant ; installer ce qui manque ; proposer un plan de composants et le réaliser tout de suite ; créer ou modifier les vrais fichiers ; lancer la compilation ; tester dans le navigateur ; montrer les chemins des fichiers modifiés et ce qui marche. Commencer par le hub uniquement. N'invente pas de fichiers GLB absents : utilise un fallback procédural ou documente explicitement le manque.
```

## 01 — Hub orbital : reconstruction interactive fidèle

```text
Implémente la page d'accueil en plein écran. 3 couches synchronisées : (A) environnement photoréaliste, avec `hub-orbital.webp` comme arrière-plan/fallback temporaire ; (B) vrai Canvas Three.js pour planètes cliquables, halos, effets de lumière, orbital paths stylisés en courbes THREE.CatmullRomCurve3 avec animation de particules ; (C) composants DOM et Tailwind pour navigation, labels, encart, boutons et focus clavier.

Découpe en composants : SpaceHubPage, StationFrame, UniverseCanvas, PlanetMesh, DestinationNode, RouteCurve, HolographicGlobe, NavigationBar, SpaceHubCard, SceneTransition, DestinationOverlay.

La Terre remplit visuellement le bas. L'architecture de station sur la gauche encadre la scène. 5 destinations principales dans le ciel, espacées de façon artistique, selon CAPTURE_ORIGINALE : Lune ~x=27%, Mars ~42%, Europe ~57%, Titan ~71%, Saturne ~94%. Les proportions affichées ne sont PAS à l'échelle, indiquer discretement 'Vue illustrative — non à l'échelle'. Les libellés doivent être HTML (accessibles), alors que les planètes tournent en 3D. Un arc lumineux propre à chaque planète lie visuellement sa position à la Terre, avec particules animées. Ajoute lumière ambre venant du haut-gauche.

Interactivité : hover/focus d'une planète => halo + nom + mini-info. Clic => état selectedDestination et bouton 'VOYAGER'. Encart bas-droite SPACE HUB comportant pictogramme de station, sous-titre et bouton 'CHOISIR UNE DESTINATION'. Nav top-right: SYSTÈME SOLAIRE | EXPLORER | EXPÉRIENCES | PROFIL (profil peut être absent ou désactivé clairement, jamais faux bouton). Chaque action doit produire une réaction concrète. Navigation clavier et tactile.

Qualité : custom shaders facultatifs, performance correcte avec animations fluides, pas de post-processing lourd au premier rendu. Eviter de cacher l'horizon derrière les panneaux. Améliorer les textures planétaires en phase suivante.

Capture automatiquement un screenshot au format similaire à 1734×478 et à 1440×900 et compare au fichier référence, puis corrige cadrage, tailles, et placement. Teste réellement le clic Mars. Exécute npm run build.
```

## 02 — Cartes scientifiques pour les corps célestes

```text
Implémente un catalogue de destinations à partir de `docs/destinations.catalogue.json` (copie-le dans `src/data` puis enrichis-le). Sépare `Solar System` et `Beyond Solar System`. Les destinations doivent être des entrées réutilisables plutôt que 25 composants hardcodés.

Priorité navigable : Lune, Mars, Europe, Titan, Saturne. Catalogue : Soleil, Mercure, Vénus, Terre, Lune, Mars, Phobos, Déimos, Cérès, Jupiter, Io, Europe, Ganymède, Callisto, Saturne, Titan, Encelade, Uranus, Neptune, Triton, Pluton, Charon. Prévoir plus tard exoplanètes confirmées : Proxima Centauri b, TRAPPIST-1 e, Kepler-186 f, 55 Cancri e. Pour exoplanètes, les paysages et atmosphères sont des concepts, jamais des vérités observées.

Importer des textures équirectangulaires (projection 2:1) via `useTexture` sur SphereGeometry, rotation lente, mise en cache et éclairage directionnel ; anneaux Saturne via annular ring geometry avec inclinaison ; atmosphère shader légère ; afficher une alternative 2D si WebGL indisponible. Télécharge les fichiers de textures avec `node scripts/telecharger-textures.mjs` ; catalogue des sources et licences dans `docs/TEXTURES_SOURCES.json`. Vérifie aussi les sources NASA/JPL : https://maps.jpl.nasa.gov/tmaps/ et https://science.nasa.gov/3d-resources/. Crédite Solar System Scope (CC BY 4.0) dans le site et indique toute modification. Attention : plusieurs cartes JPL historiques sont notées fictives, stylisées ou représentatives. Ne les présente pas comme des images réelles.

Affiche type d'astre, atmosphère, gravité de surface si pertinente, composition connue, distance Terre-astre 'variable avec date' plutôt qu'une valeur faussement fixe, sources scientifiques et degré de certitude. Pour JPL Horizons, implémente d'abord des distances moyennes pédagogiques correctement étiquetées OU une date + vraie requête, jamais une fausse distance en temps réel.

Ne surcharge pas le hub : ajouter une recherche et un sélecteur de mondes secondaire. Conserver les 5 destinations visuelles du screenshot comme sélection principale. Compile et teste.
```

## 03 — Voyage spatial cinématique (transition)

```text
Depuis la scène hub, cliquer Mars/Lune/Europe/Titan/Saturne et VOYAGER déclenche une transition immersive de 3 à 6 secondes : initialisation, sortie de la station, passage visuel dans l'espace, approche de planète, arrivée sur lieu approprié. Caméra interpolée via GSAP et courbe 3D, halo du Soleil, particules contrôlées, sons facultatifs (off par défaut), bouton PASSER. Sur mobile et prefers-reduced-motion, utiliser une transition courte et légère.

ATTENTION PHYSIQUE : voyage dramatique NON à vitesse réelle, échelle réduite ; bandeau 'Trajet cinématique accéléré — distances non à l'échelle'. Aucun 'temps de voyage réel' inventé. Gérer les états idle -> selecting -> flying -> arriving -> destination, empêcher double clic, permettre RETOUR STATION.

Sur Mars, afficher la destination avec panorama-mars.webp, HUD de données, et 3 actions réellement activables : EXPLORER, LABORATOIRE, RESSOURCES. Sur Europe utiliser panorama-europa.webp comme rendu artistique. Pour Saturne et Jupiter, aucun bouton 'marcher sur la surface' : seulement survol et observations atmosphériques. Pour Titan, utiliser `panorama-titan.webp` avec la mention visible « Illustration artistique ». L’image exagère la visibilité de Saturne depuis la surface ; ne pas la présenter comme une représentation scientifiquement exacte. Utiliser des placeholders explicitement signalés pour les autres destinations sans panoramas.

Ne casse pas le hub existant. Compile, teste les transitions et les retours, prends des captures avant/après.
```

## 04 — Laboratoire scientifique interactif de Mars

```text
Créer une vue 'Mars Science Lab' inspirée de `public/assets/scenes/laboratoire-mars.webp`. Utiliser le décor en 2.5D pour la première version, placer les modules en DOM interactifs par-dessus (pas de faux graphes peints dans l'image). Trois expériences distinctes :
(A) GRAVITÉ : lancer une balle et afficher la trajectoire animée, vitesse verticale, hauteur et temps de vol ; Terre g=9,81 m/s², Mars g≈3,71 m/s², Lune g≈1,62 m/s² ; modèle simple sans résistance de l'air, avec hypothèses visibles.
(B) ROCHE : cliquer un échantillon, consulter les matériaux connus et les métadonnées sourcées ; ne pas afficher de faux pourcentages exacts inventés.
(C) OXYGÈNE : mini expérience pédagogique simplifiée inspirée de MOXIE sur conversion du CO2 martien, avec schéma interactif et avertissement explicite qu'il ne s'agit pas d'un simulateur thermochimique industriel.
Tous les boutons ont un état réel, réinitialisation, navigation clavier, téléphone. Tests unitaires des formules ; actions depuis hub via Mars puis LABORATOIRE ; bouton RETOUR MARS et retour station. Compile et teste.
```

## 05 — Mode promenade 3D sur Mars, Lune et Europe

```text
Développe seulement APRÈS validation de la scène et du laboratoire. Prépare d'abord un petit terrain 3D avec textures et collisions, puis un astronaute low-poly provisoire ou un GLB sous licence documentée, animé via AnimationMixer. Contrôles ZQSD/WASD + souris, joystick mobile, sauts selon gravité locale, 3e personne, caméra souple, colliders rapier si nécessaire.

Une vraie image panoramique 2D ne fournit PAS la profondeur ni les collisions : créer une geometry de relief qui ne prétend pas correspondre exactement à une zone réelle de la planète. Les paysages générés sont artistiques et servent de skybox/distant scenery. Pour les surfaces scientifiquement cartographiées, remplacer progressivement avec données altimétriques réellement adaptées. Combinaison spatiale obligatoire sur Mars, Lune, Europe ; indiquer que les conditions de survie sont simplifiées et qu'il ne s'agit pas d'une simulation biomécanique ni médicale exacte.

Ajoute trois lieux explorables max. Si performance mobile insuffisante, garder le mode 3D léger. Teste collisions et absence de traversée du sol.
```

## 06 — Réalisme, contenu et extension de la Voie lactée

```text
Ajoute un onglet 'Au-delà du système solaire' en tant que deuxième chapitre, pas dans la même ligne principale du screenshot. Distances en années-lumière avec sources NASA Exoplanet Archive, recherche de planètes confirmées et exploration narrative.

Pour Proxima Centauri b, TRAPPIST-1 e, Kepler-186 f, 55 Cancri e : montrer uniquement les caractéristiques observées avec degré de certitude et vues artistiques clairement labellisées. Aucune 'promenade aux conditions réelles' si les données ne sont pas disponibles. Implémente un mode 'Que sait-on ? / Qu'imagine-t-on ?'. Ne prétends pas avoir couvert la galaxie entière.

Ajouter système de citations par monde et mention des droits d'auteur/crédits des textures et modèles. Pas de logo NASA sur images créées par IA. Vérifie compilation, performances, lisibilité mobile et accessibilité.
```

## 07 — Audit final de fidélité à l'image

```text
Compare ton rendu final à reference/CAPTURE_ORIGINALE.png et produis des screenshots 1734×478, 1440×900 et 390×844. Fais une grille d'écarts : composition, planète Mars, taille de la Terre, structures métalliques côté gauche, astres en ligne, trajectoires lumineuses, alignement navigation, panneau SPACE HUB. Corrige jusqu'à fidélité visuelle élevée sans sacrifier des boutons fonctionnels. Vérifie toutes les transitions hub -> monde -> labo -> hub ; tous les assets doivent se charger sans erreurs console ; npm run build OK. Vérifie les liens source scientifiques, aucun faux chiffre en 'live'. Documente les limites restantes. Ne te contente pas d'un rapport : applique les corrections.
```

## 08 — Installer textures (nouvelle étape préparatoire)

```text
Exécute `node scripts/telecharger-textures.mjs` depuis la racine du projet. Consulte `docs/TEXTURES_SOURCES.json`. Crée le composant `PlanetMesh` avec un mapping entre identifiant et texture locale. Pour Europe, vérifie que la mosaïque JPL est principalement en niveaux de gris ; la coloration éventuelle est stylistique. Gère les téléchargements échoués en utilisant des matériaux de couleur simples plutôt que des sphères invisibles. Ajoute dans le pied de page ou la section crédits : « Planet textures: Solar System Scope, CC BY 4.0 » avec lien. Pour la carte d'Europe, attribution NASA/JPL/USGS ; ne revendique pas une validation scientifique des textures. Ne fais aucun appel réseau au rendu côté utilisateur pour télécharger des textures depuis les sites d'origine.
```

## 09 — Boutons et états UX exacts

```text
Implémente tous les boutons visibles dans le mockup comme composants React accessibles et reliés à de vrais états applicatifs : Choisir une destination ouvre un sélecteur; cliquer sur un astre sélectionne un monde; Voyager exécute la transition ; Explorer charge une scène de promenade si disponible ou explique l'absence de terrain interactif ; Laboratoire ouvre des simulations réellement interactives si disponibles ; Ressources affiche une liste documentée; Retour revient correctement au hub. Ajouter states hover/focus/disabled/loading, clavier, touches mobiles et transitions reduced-motion. La barre de navigation principale en haut droite reste discrète (pas de CTA surdimensionné). Le panneau de voyage est en bas droite. Pas de bouton placebo.
```
