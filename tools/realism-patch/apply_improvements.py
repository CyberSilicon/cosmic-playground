#!/usr/bin/env python3
"""Apply guarded Cosmic Playground improvements to a checkout of CyberSilicon/cosmic-playground.
This script intentionally does not change Git history or push to GitHub.
"""
from pathlib import Path
import argparse, re, sys

ROOT=Path.cwd()
changed=[]

def replace(path, old, new, count=1):
    f=ROOT / path
    if not f.exists(): raise RuntimeError(f'Missing file: {path}')
    txt=f.read_text(encoding='utf-8')
    if new in txt and old not in txt: return
    if txt.count(old)!=count:
        raise RuntimeError(f'Expected {count} matches, found {txt.count(old)} in {path}: {old[:110]!r}')
    f.write_text(txt.replace(old,new,count),encoding='utf-8')
    changed.append(path)

def insert_new(path, content):
    f=ROOT/path
    if f.exists():
        if f.read_text(encoding='utf-8') == content: return
        raise RuntimeError(f'Will not overwrite existing custom file: {path}')
    f.parent.mkdir(parents=True,exist_ok=True)
    f.write_text(content,encoding='utf-8')
    changed.append(path)

def main():
    if not (ROOT/'src/components/travel/PlanetaryEVAExplorer.tsx').is_file() or not (ROOT/'package.json').is_file():
        raise RuntimeError('Run this script from cosmic-playground repository root.')

    eva='src/components/travel/PlanetaryEVAExplorer.tsx'
    # Terrain collision bug: 60x40 sampled against actual 100x64
    replace(eva,
       "  terrainGeo,\n  joystickRef,\n  cameraYawRef,",
       "  terrainGeo,\n  terrainSize,\n  terrainSegments,\n  joystickRef,\n  cameraYawRef,")
    replace(eva,
       "  terrainGeo: THREE.PlaneGeometry;\n  joystickRef:",
       "  terrainGeo: THREE.PlaneGeometry;\n  terrainSize: number;\n  terrainSegments: number;\n  joystickRef:")
    replace(eva,
       "  const size = 60;\n  const segments = 40;\n  const { camera } = useThree();",
       "  // Use the actual dimensions of the generated terrain for ground collision.\n  const size = terrainSize;\n  const segments = terrainSegments;\n  const { camera } = useThree();")
    replace(eva,
       "    const groundY = getHeightFromGeo(terrainGeo, posRef.current.x, posRef.current.z, size, segments);\n",
       "    // Ground is sampled AFTER horizontal movement to avoid entering an uphill slope.\n")
    replace(eva,
       "    posRef.current.z = THREE.MathUtils.clamp(posRef.current.z + nvz * dt, -bound, bound);\n    posRef.current.y += velRef.current.y * dt;",
       "    posRef.current.z = THREE.MathUtils.clamp(posRef.current.z + nvz * dt, -bound, bound);\n    const groundY = getHeightFromGeo(terrainGeo, posRef.current.x, posRef.current.z, size, segments);\n    posRef.current.y += velRef.current.y * dt;")
    # Clamp sampled grid indices, prevent out-of-bounds at terrain boundaries
    replace(eva,
       "  const fx = ((x / size) + 0.5) * segments;\n  const fz = ((z / size) + 0.5) * segments;",
       "  const fx = THREE.MathUtils.clamp(((x / size) + 0.5) * segments, 0, segments);\n  const fz = THREE.MathUtils.clamp(((z / size) + 0.5) * segments, 0, segments);")
    replace(eva,
       "            terrainGeo={terrainGeo}\n            joystickRef={joystickRef}",
       "            terrainGeo={terrainGeo}\n            terrainSize={size}\n            terrainSegments={segments}\n            joystickRef={joystickRef}")
    # Remove artificial strong blue fog, favor pale atmospheric tint for Mars
    replace(eva,
       "          <fog attach=\"fog\" args={['#08101f', 45, 95]} />\n          <color attach=\"background\" args={['#020617']} />",
       "          <fog attach=\"fog\" args={[destination.id === 'mars' ? '#a06b53' : destination.id === 'moon' ? '#090d15' : '#172331', 48, 115]} />\n          <color attach=\"background\" args={[destination.id === 'mars' ? '#9f6549' : '#020617']} />")
    # No further fake avatar in the orbital hub. Image original never had genuine 3d body there.
    frame='src/components/hub/StationFrame.tsx'
    txt=(ROOT/frame).read_text(encoding='utf-8')
    start=txt.find('      {/* Astronaut Character on Foreground Deck observing the cosmos */}')
    end=txt.find('      {/* Futuristic Station Metal Column Typography (Left Edge) */}',start)
    if start>=0 and end>start:
        txt=txt[:start]+"      {/* No flat astronaut cutout: preserve clean cinematic station until a licensed PBR GLB model is available. */}\n\n"+txt[end:]
        (ROOT/frame).write_text(txt,encoding='utf-8');changed.append(frame)
    else: raise RuntimeError('Cannot find hub astronaut cutout block')
    # Smooth the primitive fallback rocket. The optional PBR GLB can replace it without crashes.
    flight='src/components/travel/CinematicFlightScene.tsx'
    replace(flight,'coneGeometry args={[0.38, 2.2, 8]}','coneGeometry args={[0.38, 2.2, 48]}')
    replace(flight,'cylinderGeometry args={[0.42, 0.34, 0.65, 12]}','cylinderGeometry args={[0.42, 0.34, 0.65, 48]}')
    # Optional ship model (no broken useGLTF url if file missing): GLTFLoader on demand, fallback remains intact.
    replace(flight,"import React, { useRef, useMemo, useEffect } from 'react';",
                   "import React, { useRef, useMemo, useEffect, useState } from 'react';")
    replace(flight,"import * as THREE from 'three';",
                   "import * as THREE from 'three';\nimport { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';")
    replace(flight,
       "  const ringPulseRef = useRef<THREE.Mesh>(null);\n\n  useFrame((state) => {",
       """  const ringPulseRef = useRef<THREE.Mesh>(null);
  const [shipModel, setShipModel] = useState<THREE.Group | null>(null);
  useEffect(() => {
    let alive = true;
    // Real PBR ship asset is optional; a missing file never crashes the flight.
    const loader = new GLTFLoader();
    loader.load('/assets/models/ship.glb', (gltf) => {
      if (alive) setShipModel(gltf.scene);
      else gltf.scene.traverse((obj) => { if (obj instanceof THREE.Mesh) obj.geometry?.dispose(); });
    }, undefined, () => { /* Keep the existing procedural fallback */ });
    return () => { alive = false; };
  }, []);

  useFrame((state) => {""")
    replace(flight,
       "    <group ref={shipRef} scale={[0.28, 0.28, 0.28]}>\n      <group rotation={[0, Math.PI, 0]}>",
       "    <group ref={shipRef} scale={[0.28, 0.28, 0.28]}>\n      {shipModel && <primitive object={shipModel} rotation={[0, Math.PI, 0]} />}\n      <group rotation={[0, Math.PI, 0]} visible={!shipModel}>")
    # Gravity overlay issue
    modal='src/components/hub/CinematicTravelModal.tsx'
    replace(modal,
       'className={`h-full bg-cyan-400 w-[${flightProgress.progress}%] transition-all duration-300`}',
       'className="h-full bg-cyan-400 transition-[width] duration-300" style={{ width: `${flightProgress.progress}%` }}')
    # Guard against travel modal showing Mars art for alien worlds (ExplorerPanel)
    explorer='src/components/travel/ExplorerPanel.tsx'
    replace(explorer,
       "const sceneBg = PANORAMA_MAP[destination.id] || '/assets/scenes/panorama-mars.webp';",
       "const sceneBg = PANORAMA_MAP[destination.id] || null;")
    replace(explorer,
       "      <div className=\"relative w-full h-40 rounded-xl overflow-hidden\">\n        <Image",
       "      {sceneBg ? <div className=\"relative w-full h-40 rounded-xl overflow-hidden\">\n        <Image")
    replace(explorer,
       "      </div>\n\n      {isGasGiant ? (",
       "      </div> : <div className=\"relative w-full h-40 rounded-xl overflow-hidden bg-slate-950/90 flex items-center justify-center text-sm text-slate-400\">Aucun panorama photographique vérifié disponible pour {destination.name}</div>}\n\n      {isGasGiant ? (")
    # Emoji rock icons replaced with Lucide icons in lab.
    lab='src/components/travel/MarsLabPanel.tsx'
    replace(lab,'<span className="text-3xl" aria-hidden="true">{rock.emoji}</span>',
           '<Layers className="h-7 w-7 text-orange-300" aria-hidden="true" />')
    replace(lab,'<span className="text-4xl" aria-hidden="true">{selectedSample.emoji}</span>',
           '<Layers className="h-9 w-9 text-orange-300" aria-hidden="true" />')
    # Adding curated NASA photos mode integrated into existing lab tab
    replace(lab,"type LabTab = 'gravity' | 'rock' | 'oxygen' | 'eva';",
           "type LabTab = 'gravity' | 'rock' | 'oxygen' | 'eva' | 'photos';")
    replace(lab, "import Image from 'next/image';", "import Image from 'next/image';\nimport { MarsPhotoExplorer } from './MarsPhotoExplorer';")
    replace(lab,
       "{ id: 'eva', label: 'Exploration 3D', icon: <Footprints className=\"w-3.5 h-3.5\" /> },",
       "{ id: 'eva', label: 'Exploration 3D', icon: <Footprints className=\"w-3.5 h-3.5\" /> },\n    { id: 'photos', label: 'Photos NASA', icon: <Layers className=\"w-3.5 h-3.5\" /> },")
    replace(lab,
       "{labTab === 'oxygen' && <OxygenExperiment />}",
       "{labTab === 'oxygen' && <OxygenExperiment />}\n            {labTab === 'photos' && <MarsPhotoExplorer />}")

    # Add mode real photographed Mars surfaces, not a fake free walk over flat image
    photos= r''' 'use client';

import React, { useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Camera, Info } from 'lucide-react';

// Primary NASA/JPL source records. Download and resize locally for production performance.
const NASA_VIEWS = [
  {
    title: 'Broom Point — Jezero',
    image: 'https://d2pn8kiwq2w21t.cloudfront.net/original_images/PIA26755.png',
    source: 'https://www.jpl.nasa.gov/images/pia26755-nasas-perseverance-rover-provides-sweeping-view-of-broom-point/',
    credit: 'NASA/JPL-Caltech/ASU/MSSS',
    details: 'Photographie Mastcam-Z prise par Perseverance le 15 mai 2025. Panorama réel, pas un décor 3D.',
  },
  {
    title: 'Crocodile Bridge — Jezero',
    image: 'https://d2pn8kiwq2w21t.cloudfront.net/original_images/PIA26699.png',
    source: 'https://www.jpl.nasa.gov/images/pia26699-nasas-perseverance-mars-rover-surveys-crocodile-bridge/',
    credit: 'NASA/JPL-Caltech/ASU/MSSS',
    details: 'Panorama composé de prises Mastcam-Z entre décembre 2025 et janvier 2026.',
  },
] as const;

export function MarsPhotoExplorer() {
  const [index,setIndex] = useState(0);
  const [imgError,setImgError] = useState(false);
  const photo = NASA_VIEWS[index];
  const change = (delta: number) => {
    setIndex((prev) => (prev + delta + NASA_VIEWS.length) % NASA_VIEWS.length);
    setImgError(false);
  };
  return (
    <section aria-label="Paysages photographiés par NASA sur Mars" className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#2d1b16] min-h-[260px] h-[min(48vw,470px)]">
        {!imgError ? (
          <img key={photo.image} src={photo.image} alt={photo.title} onError={() => setImgError(true)}
            className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[url('/assets/scenes/panorama-mars.webp')] bg-cover bg-center">
            <p className="bg-black/80 p-3 text-sm text-white">Photo NASA momentanément indisponible. Fond artistique de secours.</p>
          </div>
        )}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute left-4 bottom-4 right-4 flex items-end justify-between gap-3">
          <div className="space-y-1"><p className="text-xs tracking-widest text-cyan-300 uppercase">Image de mission réelle</p><h3 className="text-lg font-semibold text-white">{photo.title}</h3><p className="text-xs text-slate-300">{photo.credit}</p></div>
          <div className="flex gap-2"><button onClick={() => change(-1)} aria-label="Photo précédente" className="rounded-full border border-white/30 bg-black/60 p-3 hover:bg-slate-700"><ChevronLeft size={18}/></button><button onClick={() => change(1)} aria-label="Photo suivante" className="rounded-full border border-white/30 bg-black/60 p-3 hover:bg-slate-700"><ChevronRight size={18}/></button></div>
        </div>
      </div>
      <p className="flex items-start gap-2 text-sm text-slate-300"><Info className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />{photo.details}</p>
      <p className="text-xs text-amber-200">Ces images sont de vrais panoramas pris par des rovers, mais ne sont PAS des surfaces 3D navigables. Le mode terrain 3D reste séparé. Pour un déplacement géographiquement fidèle, utiliser un MNT/DEM NASA/HiRISE.</p>
      <a href={photo.source} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 px-4 py-2 text-xs font-semibold text-cyan-200 hover:bg-cyan-500/15"><Camera size={16}/> Voir la source originale NASA/JPL <ArrowUpRight size={14}/></a>
    </section>
  );
}
'''.lstrip()
    insert_new('src/components/travel/MarsPhotoExplorer.tsx',photos)

    # Restore missing components referenced by UniverseMapPage.tsx.
    insert_new('src/components/hub/UniverseMapOverview.tsx', r''''use client';
import React from 'react';
import type { UniverseCatalogDestination, UniverseCategory } from ''data/universe-catalog'' (see below for file content);
export interface UniverseMapOverviewProps {
  items: UniverseCatalogDestination[];
  activeCategory: UniverseCategory;
  selectedDestination: UniverseCatalogDestination | null;
  onSelect: (destination: UniverseCatalogDestination) => void;
  isMobile: boolean;
}
export function UniverseMapOverview({ items, selectedDestination, onSelect }: UniverseMapOverviewProps) {
  return <div className="h-full overflow-y-auto px-4 pb-12 pt-24 md:px-10 md:pt-12">
    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {items.map((world) => <button type="button" key={world.id} onClick={() => onSelect(world)}
        aria-pressed={selectedDestination?.id === world.id}
        className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-4 text-left transition-all hover:border-cyan-400/60 hover:bg-slate-800/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400">
        <div className="mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-black">
          <img src={world.texturePath} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" onError={(e) => { e.currentTarget.style.visibility='hidden'; }} />
        </div>
        <h3 className="text-sm font-bold text-white">{world.name}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-slate-400">{world.tagline}</p>
        <p className="mt-3 text-[10px] uppercase tracking-wider text-cyan-300">{world.experienceType === 'surface' ? 'Surface' : 'Observation'} · {world.surfaceStatus === 'artist_concept' ? 'Artistique' : 'Données disponibles'}</p>
      </button>)}
    </div>
    {items.length === 0 && <p className="py-20 text-center text-slate-400">Aucune destination correspondante.</p>}
  </div>;
}
''')

    insert_new('src/components/hub/ExoplanetSciencePanel.tsx', r''''use client';
import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import type { UniverseCatalogDestination } from ''data/universe-catalog'' (see below for file content);
export function ExoplanetSciencePanel({ destination, onClose, isOpen }: {destination: UniverseCatalogDestination; onClose:()=>void; isOpen:boolean}) {
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={destination.name}>
    <div className="absolute bottom-0 right-0 top-0 w-full max-w-xl overflow-y-auto border-l border-cyan-500/30 bg-slate-950 p-6 shadow-2xl">
      <div className="flex items-start justify-between gap-5"><div><p className="text-xs uppercase tracking-widest text-cyan-300">Dossier scientifique</p><h2 className="mt-2 text-3xl font-bold text-white">{destination.name}</h2><p className="mt-2 text-sm text-slate-300">{destination.tagline}</p></div><button aria-label="Fermer" onClick={onClose} className="rounded-full border border-white/20 p-2 text-white"><X/></button></div>
      <div className="mt-7 space-y-5 text-sm text-slate-300">
        <p>Type d'observation : {destination.surfaceStatus === 'artist_concept' ? 'Illustration artistique — conditions de surface non observées directement' : destination.surfaceStatus}</p>
        <p>Distance depuis la Terre : {destination.distanceToEarth.average} (indicative)</p>
        <p>Sources scientifiques : {destination.scientificAttribution}</p>
        {([['Observé / mesuré', destination.scienceTiers?.observed],['Déduit des modèles', destination.scienceTiers?.deduced],['Hypothèses', destination.scienceTiers?.hypothetical]] as const).map(([label, facts]) => facts?.length ? <section key={label}><h3 className="mb-2 font-semibold text-cyan-200">{label}</h3><ul className="list-disc space-y-1 pl-5">{facts.map((s,i) => <li key={i}>{s}</li>)}</ul></section>:null)}
        {destination.scientificNotes && <p className="rounded-xl border border-white/10 p-4">{destination.scientificNotes}</p>}
      </div>
    </div>
  </div>;
}
''')

    # The autogenerated universe catalogue is syntactically invalid and contains
    # duplicate blocks; replace with an adapter over validated app destinations.
    # Preserve the old generated content for review.
    cat = ROOT / 'src/data/universe-catalog.ts'
    if cat.exists():
        previous = cat.read_text(encoding='utf-8')
        backup = ROOT / 'docs/universe-catalog-legacy.txt'
        if not backup.exists():
            backup.write_text(previous, encoding='utf-8')
            changed.append('docs/universe-catalog-legacy.txt')
        clean = r'''
import { ALL_DESTINATIONS, type Destination } from './destinations';

export type UniverseRegion = 'Système solaire' | 'Voie lactée';
export type UniverseCategory = 'solar-system' | 'milky-way';
export type TravelExperienceType = 'surface' | 'flyby' | 'orbit' | 'speculative-view' | 'depth-probe';
export type CelestialCategory = 'star' | 'terrestrial_planet' | 'gas_giant' | 'ice_giant' | 'dwarf_planet' | 'moon' | 'ocean_world' | 'asteroid' | 'stellar_system' | 'exoplanet';
export type ObservationTier = 'direct_imaging' | 'transit' | 'radial_velocity' | 'astrometry';

export interface ScienceTiers { observed:string[]; deduced:string[]; hypothetical:string[] }
export interface UniverseCatalogDestination {
  id:string; name:string; nameEn:string;
  category:CelestialCategory; region:UniverseRegion; experienceType:TravelExperienceType;
  phase:'start' | 'later' | 'distant' | 'very-distant';
  texturePath:string; colorHex:string; glowColor:string; trajectoryColor:string;
  mapPosition:{xPercent:number;yPercent:number;zCamera:number}; baseRadius:number;
  ringsRadius?:{inner:number;outer:number};
  tagline:string; groundExplorationConceptuallyPossible:boolean;
  distanceToEarth:{min:string;max:string;average:string;note:string};
  scientificDataStatus:'to_verify' | 'confirmed' | 'artist_conceptual' | 'inferred';
  surfaceStatus:'observed' | 'modelled' | 'artist_concept';
  scienceTiers?:ScienceTiers; detectionMethods?:ObservationTier[];
  scientificAttribution:string; scientificNotes?:string; knownMaterials?:string[];
}
export const CATEGORIES: {id:UniverseCategory;label:string;icon:string}[] = [
  {id:'solar-system',label:'Système solaire',icon:'☀'},
  {id:'milky-way',label:'Voie lactée',icon:'✦'},
];
function categoryOf(d:Destination):CelestialCategory {
  if (d.category==='terrestrial') return 'terrestrial_planet';
  if (d.category==='dwarf') return 'dwarf_planet';
  return d.category;
}
function toCatalog(d:Destination):UniverseCatalogDestination {
  const atmosphereOnly = d.category==='gas_giant' || d.category==='ice_giant' || d.category==='star';
  const isExoplanet = d.category==='exoplanet';
  return {
    id:d.id,name:d.name,nameEn:d.nameEn, category:categoryOf(d),region:d.region,
    experienceType:isExoplanet?'speculative-view':atmosphereOnly?'flyby':'surface',
    phase:isExoplanet?'very-distant':'start',
    texturePath:d.texturePath,colorHex:d.colorHex,glowColor:d.glowColor,trajectoryColor:d.trajectoryColor,
    mapPosition:{xPercent:d.hubPosition.xPercent,yPercent:d.hubPosition.yPercent,zCamera:0},
    baseRadius:d.hubPosition.baseRadius,ringsRadius:d.ringsRadius,
    tagline:d.tagline,groundExplorationConceptuallyPossible:!atmosphereOnly&&!isExoplanet,
    distanceToEarth:{min:d.distanceFromEarth.minKm,max:d.distanceFromEarth.maxKm,average:d.distanceFromEarth.averageKm,note:d.distanceFromEarth.note},
    scientificDataStatus:'to_verify',
    surfaceStatus:isExoplanet?'artist_concept':'modelled',
    scientificAttribution:d.scientificAttribution,scientificNotes:d.scientificNotes,knownMaterials:d.knownMaterials,
  };
}
export const UNIVERSE_CATALOG:UniverseCatalogDestination[] = ALL_DESTINATIONS.map(toCatalog);
export function getDestinationById(id:string):UniverseCatalogDestination | undefined {
  return UNIVERSE_CATALOG.find(d=>d.id===id);
}
export function getSmartObjects(region:UniverseRegion):UniverseCatalogDestination[] {
  return UNIVERSE_CATALOG.filter(d=>d.region===region);
}
'''
        if previous != clean:
            cat.write_text(clean,encoding='utf-8');changed.append('src/data/universe-catalog.ts')

    # Documentation re actual 3D assets
    insert_new('docs/REALISM_V2_ASSETS.md',r'''# Realism V2 — Asset acquisition checklist

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
''')
    # fix no plain text 'framer' requirement? add motion dependency explicit, no aggressive UI changes
    pkg=ROOT/'package.json';s=pkg.read_text(encoding='utf-8')
    if '"motion":' not in s:
        # Installation follows npm install motion separately; avoid lock mismatch if not in use.
        pass
    print('Files modified:',len(set(changed)))
    for c in sorted(set(changed)):print('  ',c)
    print('Next: npm install && npx tsc --noEmit && npm run build')

if __name__=='__main__':
    try:main()
    except Exception as e:
        print('Patch stopped safely:',e,file=sys.stderr)
        sys.exit(1)

