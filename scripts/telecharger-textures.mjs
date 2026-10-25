// Usage: node scripts/telecharger-textures.mjs
// Installe les textures equirectangulaires dans public/assets/planets
// Crédits/licences détaillés dans docs/TEXTURES_SOURCES.json
import { mkdir, writeFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
const target = join(process.cwd(), 'public', 'assets', 'planets');
const textures = [
  {
    "name": "mercury.jpg",
    "url": "https://edu.solarsystemscope.com/textures/download/2k_mercury.jpg"
  },
  {
    "name": "venus-surface.jpg",
    "url": "https://edu.solarsystemscope.com/textures/download/2k_venus_surface.jpg"
  },
  {
    "name": "venus-atmosphere.jpg",
    "url": "https://edu.solarsystemscope.com/textures/download/2k_venus_atmosphere.jpg"
  },
  {
    "name": "earth.jpg",
    "url": "https://edu.solarsystemscope.com/textures/download/2k_earth_daymap.jpg"
  },
  {
    "name": "earth-night.jpg",
    "url": "https://edu.solarsystemscope.com/textures/download/2k_earth_nightmap.jpg"
  },
  {
    "name": "earth-clouds.jpg",
    "url": "https://edu.solarsystemscope.com/textures/download/2k_earth_clouds.jpg"
  },
  {
    "name": "moon.jpg",
    "url": "https://edu.solarsystemscope.com/textures/download/2k_moon.jpg"
  },
  {
    "name": "mars.jpg",
    "url": "https://edu.solarsystemscope.com/textures/download/2k_mars.jpg"
  },
  {
    "name": "jupiter.jpg",
    "url": "https://edu.solarsystemscope.com/textures/download/2k_jupiter.jpg"
  },
  {
    "name": "saturn.jpg",
    "url": "https://edu.solarsystemscope.com/textures/download/2k_saturn.jpg"
  },
  {
    "name": "saturn-ring-alpha.png",
    "url": "https://edu.solarsystemscope.com/textures/download/2k_saturn_ring_alpha.png"
  },
  {
    "name": "uranus.jpg",
    "url": "https://edu.solarsystemscope.com/textures/download/2k_uranus.jpg"
  },
  {
    "name": "neptune.jpg",
    "url": "https://edu.solarsystemscope.com/textures/download/2k_neptune.jpg"
  },
  {
    "name": "sun.jpg",
    "url": "https://edu.solarsystemscope.com/textures/download/2k_sun.jpg"
  },
  {
    "name": "starfield.jpg",
    "url": "https://edu.solarsystemscope.com/textures/download/2k_stars_milky_way.jpg"
  },
  {
    "name": "europa.jpg",
    "url": "https://maps.jpl.nasa.gov/tmaps/pix/jup2vss2.jpg"
  }
];
await mkdir(target, { recursive: true });
let failed = 0;
for (const { name, url } of textures) {
  const destination = join(target, name);
  try {
    const already = await stat(destination).catch(() => null);
    if (already?.size > 100) { console.log('EXISTE', name); continue; }
    const response = await fetch(url, { signal: AbortSignal.timeout(25000), headers: { 'User-Agent': 'CosmicPlaygroundEducationalPrototype/0.1' } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const type = response.headers.get('content-type') || '';
    if (!type.includes('image/')) throw new Error(`Contenu non-image: ${type}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length < 100) throw new Error('Réponse vide');
    await writeFile(destination, bytes);
    console.log('OK    ', name, (bytes.length/1024).toFixed(0)+' KB');
  } catch (error) { failed += 1; console.error('ECHEC ', name, error.message); }
}
console.log(`Terminé : ${textures.length - failed}/${textures.length} textures téléchargées ou existantes.`);
if (failed) process.exitCode = 1;
