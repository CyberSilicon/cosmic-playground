# DEMARRER ICI : Cosmic Playground sur Antigravity

**Le kit est un ensemble d'images et de consignes, pas un site Next.js déjà développé.**

1. Installer Node.js LTS et Google Antigravity.
2. Dans un terminal :

   ```powershell
   npx create-next-app@latest cosmic-playground --ts --tailwind --eslint --app --src-dir --use-npm --yes
   cd cosmic-playground
   npm install three @react-three/fiber @react-three/drei gsap lucide-react
   npm install -D @types/three
   ```
3. Décompresser ce ZIP, copier `public`, `reference`, `docs`, `scripts` dans `cosmic-playground/` (fusionner les dossiers).
4. Ouvrir le dossier `cosmic-playground` avec Antigravity.
5. Coller **seulement** le PROMPT 00 (dans `docs/PROMPTS_ANTIGRAVITY.md`), puis le PROMPT 01 ; comparer le rendu.
6. Exécuter `node scripts/telecharger-textures.mjs` **sur ton PC avec une connexion Internet** pour obtenir les fichiers de textures. Si un téléchargement échoue, Antigravity peut le reprendre à partir des liens dans `docs/TEXTURES_SOURCES.json`.
7. Continuer les prompts : 02 catalogue/texture, 03 transitions, 04 laboratoire, 05 promenade, 06 galaxies, 07 vérification et 09 boutons.
8. Lancer `npm run dev` et ouvrir http://localhost:3000 ; pour vérifier la compilation lancer `npm run build`.

**IMPORTANT** : la capture de référence est très large (1734×478), donc valider une capture à cette taille et aussi les affichages desktop normaux et mobile.

## Images présentes dans le kit

- `public/assets/scenes/hub-orbital.webp` : station orbitale, sans boutons.
- `public/assets/scenes/laboratoire-mars.webp` : laboratoire martien, sans boutons.
- `public/assets/scenes/panorama-mars.webp` : panorama martien.
- `public/assets/scenes/panorama-europa.webp` : panorama d'Europe avec Jupiter.
- `public/assets/scenes/panorama-titan.webp` : panorama de Titan (illustration artistique).
- `reference/CAPTURE_ORIGINALE.png` : ta capture, référence de composition.
- `reference/planche-*.webp` : guides pour l'interface.

Les textures planétaires, les personnages, les modèles GLB et les animations **ne sont pas inclus**. Le script télécharge des textures libres avec attribution depuis Solar System Scope, et une carte NASA/JPL pour Europe. **Les fonds générés sont des illustrations, pas des photographies réelles.**

## Comment préserver l'effet WOW

- Scène plein écran, Terre en bas, grandes planètes dans la bande du ciel.
- Panneau SPACE HUB en bas à droite et menu discret en haut à droite.
- Planètes et textes HTML interactifs, trajectoires luminescentes animées.
- En cliquant Mars : animation courte, arrivée sur Mars, fiche info, 3 actions.
- Ne pas fabriquer de fausses données spatiales (distance/positions en temps réel).

## Sources et licences

- Textures : https://edu.solarsystemscope.com/textures/ — CC BY 4.0 (attribution requise), contours parfois reconstitués et couleurs stylisées.
- NASA/JPL : https://maps.jpl.nasa.gov/tmaps/ — cartes composites et indications de source.
- Modèles NASA : https://science.nasa.gov/3d-resources/ — vérifier les licences et la description de chaque ressource.
- NASA media guidelines : https://www.nasa.gov/nasa-brand-center/images-and-media/ — ne pas sous-entendre un partenariat ou une approbation par la NASA.
