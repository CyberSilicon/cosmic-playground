'use client';

import React, { useRef, useMemo } from 'react';
import Image from 'next/image';
import * as THREE from 'three';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Destination } from '@/data/destinations';

export interface ArrivalSceneMeta {
  hasDedicatedPanorama: boolean;
  panoramaPath: string | null;
  isAtmosphericOnly: boolean;
  sceneTitle: string;
  artisticDisclaimer: string;
  scientificCaveat: string | null;
}

export function getArrivalSceneMetadata(destination: Destination): ArrivalSceneMeta {
  const isAtmosphericOnly = destination.category === 'gas_giant' || destination.category === 'ice_giant' || destination.category === 'star';
  if (destination.id === 'mars') return { hasDedicatedPanorama: true, panoramaPath: '/assets/scenes/panorama-mars.webp', isAtmosphericOnly: false, sceneTitle: 'Panorama de surface — Mars', artisticDisclaimer: 'Paysage généré artistique — représentation illustrative, pas une photographie directe.', scientificCaveat: 'Données physiques issues des missions NASA Mars Reconnaissance Orbiter, Curiosity et Perseverance.' };
  if (destination.id === 'europa') return { hasDedicatedPanorama: true, panoramaPath: '/assets/scenes/panorama-europa.webp', isAtmosphericOnly: false, sceneTitle: 'Panorama glacé — Europe & Jupiter', artisticDisclaimer: 'Paysage généré artistique — vue illustrative de la banquise d’Europe, non photographique.', scientificCaveat: 'Relief de glace fracturée et taille apparente de Jupiter stylisés pour l’immersion visuelle.' };
  if (destination.id === 'titan') return { hasDedicatedPanorama: true, panoramaPath: '/assets/scenes/panorama-titan.webp', isAtmosphericOnly: false, sceneTitle: 'Panorama — Titan (Lacs d’hydrocarbures)', artisticDisclaimer: 'Illustration artistique — ne constitue pas une observation photographique de surface.', scientificCaveat: 'Note scientifique : la vue de Saturne dans le ciel de Titan est artistique et non scientifiquement exacte (l’épaisse brume orangée d’azote et de méthane masque Saturne en lumière visible depuis la surface).' };
  if (isAtmosphericOnly) return { hasDedicatedPanorama: false, panoramaPath: null, isAtmosphericOnly: true, sceneTitle: `Survol orbital & Observation atmosphérique — ${destination.name}`, artisticDisclaimer: `Scène 3D de survol orbital — Texture ${destination.scientificAttribution}.`, scientificCaveat: `${destination.name} ne possède pas de surface solide accessible pour un atterrissage. Seuls les survols orbitaux et les sondages atmosphériques sont possibles.` };
  return { hasDedicatedPanorama: false, panoramaPath: null, isAtmosphericOnly: false, sceneTitle: `Vue orbitale 3D & Horizon — ${destination.name}`, artisticDisclaimer: `Scène 3D interactive générée à partir de la carte documentée (${destination.scientificAttribution}) — rendu illustratif non photographique.`, scientificCaveat: null };
}

function ArrivalPlanet3D({ destination, reducedMotion, isAtmosphericOnly }: { destination: Destination; reducedMotion: boolean; isAtmosphericOnly: boolean }) {
  const planetRef = useRef<THREE.Mesh>(null);
  const horizonRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, destination.texturePath);
  const ringTexture = destination.ringTexturePath ? useLoader(THREE.TextureLoader, destination.ringTexturePath) : null;
  useMemo(() => { if (texture) { texture.colorSpace = THREE.SRGBColorSpace; texture.needsUpdate = true; } if (ringTexture) { ringTexture.colorSpace = THREE.SRGBColorSpace; ringTexture.rotation = Math.PI / 2; ringTexture.center.set(0.5, 0.5); ringTexture.needsUpdate = true; } }, [texture, ringTexture]);
  useFrame((_, delta) => { if (reducedMotion) return; if (planetRef.current) planetRef.current.rotation.y += delta * 0.06; if (horizonRef.current) horizonRef.current.rotation.y += delta * 0.015; });
  const radius = isAtmosphericOnly ? 2.65 : 1.95;
  const pos: [number, number, number] = isAtmosphericOnly ? [1.6, 0.15, 0] : [2.1, 0.65, -0.5];
  return (
    <>
      <ambientLight intensity={0.7} color="#f8fafc" />
      <directionalLight position={[-10, 8, 10]} intensity={2.6} color="#ffedd5" />
      <directionalLight position={[6, -6, 4]} intensity={0.9} color="#38bdf8" />
      <group position={pos}>
        <mesh ref={planetRef}>
          <sphereGeometry args={[radius, 64, 64]} />
          <meshStandardMaterial map={texture} roughness={isAtmosphericOnly ? 0.72 : 0.65} metalness={0.05} emissive={new THREE.Color(destination.colorHex)} emissiveIntensity={destination.category === 'star' ? 0.9 : 0.06} />
        </mesh>
        {destination.hasAtmosphere && (
          <mesh>
            <sphereGeometry args={[radius * 1.07, 48, 48]} />
            <meshBasicMaterial color={destination.trajectoryColor || destination.colorHex} transparent opacity={0.3} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        )}
        {destination.hasRings && (
          <mesh rotation={[-1.22, 0.22, -0.28]}>
            <ringGeometry args={[radius * (destination.ringsRadius?.inner || 1.26), radius * (destination.ringsRadius?.outer || 2.25), 96]} />
            <meshStandardMaterial map={ringTexture || texture} transparent opacity={0.9} side={THREE.DoubleSide} roughness={0.8} depthWrite={false} />
          </mesh>
        )}
      </group>
      {!isAtmosphericOnly && (
        <mesh ref={horizonRef} position={[-0.8, -6.6, 1.5]} rotation={[0.15, 0, -0.08]}>
          <sphereGeometry args={[5.8, 64, 48]} />
          <meshStandardMaterial map={texture} roughness={0.85} metalness={0.05} />
        </mesh>
      )}
    </>
  );
}

function ArrivalPanorama({ panoramaPath, destination }: { panoramaPath: string; destination: Destination }) {
  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden">
      <Image src={panoramaPath} alt={`Vue panoramique de ${destination.name}`} fill sizes="100vw" className="object-cover w-full h-full" priority />
    </div>
  );
}

export function ArrivalSceneBackdrop({ destination, reducedMotion, isMobile }: { destination: Destination; reducedMotion: boolean; isMobile: boolean }) {
  const meta = getArrivalSceneMetadata(destination);
  return (
    <div className="absolute inset-0 w-full h-full bg-[#020617] flex flex-col">
      {meta.hasDedicatedPanorama && meta.panoramaPath ? (
        <div className="flex-1 flex items-center justify-center relative overflow-hidden"><ArrivalPanorama panoramaPath={meta.panoramaPath} destination={destination} /></div>
      ) : (
        <div className="flex-1 relative w-full h-full overflow-hidden">
          <Canvas camera={{ position: [0, 1.6, 4.5], fov: 42, near: 0.1, far: 200 }} gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }} dpr={isMobile ? [1, 1.5] : [1, 2]}>
            <color attach="background" args={['#020617']} />
            <ArrivalPlanet3D destination={destination} reducedMotion={reducedMotion} isAtmosphericOnly={meta.isAtmosphericOnly} />
          </Canvas>
        </div>
      )}
      <div className="absolute bottom-4 left-0 right-0 px-6 pb-2 flex flex-col gap-2 pointer-events-none text-white z-10">
        <h3 className="text-lg font-semibold tracking-wide">{meta.sceneTitle}</h3>
        <p className="text-xs text-slate-300 italic max-w-[46rem] mx-auto opacity-80">{meta.artisticDisclaimer}</p>
        {meta.scientificCaveat && <p className="text-xs text-amber-200 italic max-w-[46rem] mx-auto opacity-90">⚠️ {meta.scientificCaveat}</p>}
      </div>
    </div>
  );
}