# Cosmic Playground — kit pour Antigravity

## Contenu réellement fourni
- `reference/CAPTURE_ORIGINALE.png` : la capture de l'utilisateur, référence principale de composition. À **ne pas** afficher à la place d'un site interactif.
- `reference/planche-direction-artistique.webp`, `reference/planche-elements.webp` : inspirations générées ; certains textes et chiffres dans ces planches peuvent être inexacts.
- `public/assets/scenes/hub-orbital.webp` : décor orbital **sans boutons**.
- `public/assets/scenes/laboratoire-mars.webp` : décor du laboratoire martien.
- `public/assets/scenes/panorama-mars.webp` : paysage martien **artistique**.
- `public/assets/scenes/panorama-europa.webp` : vue d'Europe et Jupiter, **artistique**.
- `docs/PROMPTS_ANTIGRAVITY.md` : prompts à copier successivement, en gardant une seule conversation d'agent et un projet.
- `docs/ASSETS_MANIFEST.json` : inventaire et conseils d'intégration.
- `docs/destinations.catalogue.json` : liste de destinations et des niveaux de simulation ; ce n'est pas encore un jeu de données scientifiques certifiées.
- `APERCU_DU_KIT.jpg` : aperçu des cinq décors fournis.

## Installation
1. Créer un projet Next.js TypeScript avec Tailwind.
2. Copier le dossier `public/assets/scenes` dans le `public/` du projet.
3. Copier `reference/` à la racine du projet (hors public si possible).
4. Ajouter les instructions de `docs/PROMPTS_ANTIGRAVITY.md` à Antigravity **une phase à la fois**.
5. Faire vérifier l'interface dans un navigateur sur 1734×478 ou un ratio similaire, ainsi que 1440×900 et 390×844.

## Limitations explicites
Aucun fichier GLB n'a été fabriqué. Les textures des planètes n'ont pas été téléchargées dans ce ZIP. Les images générées ne sont pas des relevés scientifiques exacts : elles sont destinées à l'identité visuelle, aux arrière-plans et aux maquettes. La NASA n'a pas participé à la création de ces images.

## Sources pour assets 3D et textures réelles
- NASA 3D Resources : https://science.nasa.gov/3d-resources/
- JPL planetary texture maps : https://space.jpl.nasa.gov/tmaps/
- NASA Media guidelines : https://www.nasa.gov/nasa-brand-center/images-and-media/
- JPL Horizons : https://ssd-api.jpl.nasa.gov/doc/horizons.html
- NASA exoplanet archive : https://exoplanetarchive.ipac.caltech.edu/

Note : certaines anciennes cartes JPL sont explicitement fictives ou composites. Lire la légende et conserver les crédits source de chaque carte.

**Complément :** `public/assets/scenes/panorama-titan.webp` (vue artistique de Titan, Saturne sur-visible), `scripts/telecharger-textures.mjs`, `docs/TEXTURES_SOURCES.json` et `DEMARRER_ICI.md`. Les cartes planétaires ne sont **pas** dans le ZIP et sont récupérées par ce script sur le PC de développement, sous réserve de la connexion et de la disponibilité des sources.
