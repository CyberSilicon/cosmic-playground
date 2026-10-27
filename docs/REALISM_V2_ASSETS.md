# Realism V2 — Asset acquisition checklist

## Existing implementation
- Hub: removed the flat foreground astronaut PNG to avoid paper-cutout look. It can be reintroduced when a rigged PBR `.glb` is available.
- Flight: smoother geometry fallback and optional local `/public/assets/models/ship.glb` loader. No external model is bundled or misrepresented as provided.
- NASA photo mode: curated NASA/JPL panoramas, real photos separated from simulations. First load may be slow because source PNGs are large. Download and resize to optimized WebP before production.
- Terrain collision: controller uses the *same* size/resolution as the mesh and resamples height after horizontal movement. Full rigid-body collisions remain a recommended next step.

## Assets still needed for truly photorealistic experience
1. A correctly licensed, rigged realistic astronaut model in GLB/GLTF, with PBR textures.
2. A correctly licensed cinematic spaceship model as `public/assets/models/ship.glb`, with a known scale/orientation. If absent, fallback procedural ship is used.
3. Real digital elevation model (DEM/DTM) + matching orthoimage from NASA/JPL or USGS for true first-person walking. A photograph cannot generate navigable scientifically accurate terrain by itself.
4. First-person glove/arm GLB, authored/rigged appropriately for realistic hand presence and interaction.
5. Locally optimized NASA photos to avoid huge remote PNG requests.

NASA resources: https://science.nasa.gov/3d-resources/ ; https://www.jpl.nasa.gov/images/ ; https://data.nasa.gov/dataset/mro-mars-high-resolution-imaging-science-experiment-dtm-v1-0

Do not imply NASA endorsed the project. Retain exact credits and source URLs, avoid using NASA logos on AI-generated images.

## Review and tests
- `npm install`
- `npx tsc --noEmit`
- `npm run build`
- Test up/down slopes and terrain boundaries; no player below mesh.
- Switch NASA photos and check attribution / fallback behavior.
- Fly to Mars, skip travel animation, enter laboratory, open the photos tab.
