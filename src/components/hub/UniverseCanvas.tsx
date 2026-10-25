'use client';

import React, { Suspense, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { MAIN_DESTINATIONS, Destination } from '@/data/destinations';
import { PlanetMesh } from './PlanetMesh';
import { TrajectoryCurves } from './TrajectoryCurves';
import { HolographicGlobe } from './HolographicGlobe';

interface UniverseCanvasProps {
  selectedDestinationId: string | null;
  hoveredDestinationId: string | null;
  reducedMotion: boolean;
  onSelectDestination: (destination: Destination) => void;
  onHoverDestination: (id: string | null) => void;
}

function SceneContent({
  selectedDestinationId,
  hoveredDestinationId,
  reducedMotion,
  onSelectDestination,
  onHoverDestination,
}: UniverseCanvasProps) {
  const { viewport } = useThree();

  // Dynamic layout calibration: calculates world coordinates for 3D elements matching reference
  const { planetPositions, scaleFactor } = useMemo(() => {
    const positions: Record<string, [number, number, number]> = {};
    // Calculate adaptive scale for 28deg FOV
    const baseScale = Math.min(viewport.width / 24, viewport.height / 7.6);

    MAIN_DESTINATIONS.forEach((dest) => {
      const x = (dest.hubPosition.xPercent - 0.5) * viewport.width;
      const y = (0.5 - dest.hubPosition.yPercent) * viewport.height;
      const z = dest.id === 'saturn' ? -0.4 : dest.id === 'mars' ? 0.1 : 0;
      positions[dest.id] = [x, y, z];
    });

    return { planetPositions: positions, scaleFactor: baseScale };
  }, [viewport.width, viewport.height]);

  // Holographic Earth Globe on the left floor deck pad
  const holoGlobePos: [number, number, number] = useMemo(() => {
    const x = (-0.5 + 0.10) * viewport.width;
    const y = (0.5 - 0.82) * viewport.height;
    return [x, y, 1.4];
  }, [viewport.width, viewport.height]);

  return (
    <>
      {/* Neutral Cosmic Ambient Light to reveal textures */}
      <ambientLight intensity={0.9} color="#f8fafc" />

      {/* Warm Golden Sunlight from top-left sunrise */}
      <directionalLight
        position={[-viewport.width * 0.45, viewport.height * 0.4, 6]}
        intensity={2.8}
        color="#ffedd5"
      />

      {/* Soft Blue Atmospheric Fill Light from Earth horizon */}
      <directionalLight
        position={[0, -viewport.height * 0.3, 4]}
        intensity={1.1}
        color="#7dd3fc"
      />

      {/* Trajectory Curves with Animated Particle Beads */}
      <TrajectoryCurves
        destinations={MAIN_DESTINATIONS}
        planetPositions={planetPositions}
        scaleFactor={scaleFactor}
        selectedId={selectedDestinationId}
        hoveredId={hoveredDestinationId}
        reducedMotion={reducedMotion}
      />

      {/* 3D Planets */}
      {MAIN_DESTINATIONS.map((dest) => {
        const pos = planetPositions[dest.id];
        if (!pos) return null;

        return (
          <PlanetMesh
            key={dest.id}
            destination={dest}
            position={pos}
            scale={scaleFactor}
            isSelected={selectedDestinationId === dest.id}
            isHovered={hoveredDestinationId === dest.id}
            reducedMotion={reducedMotion}
            onPointerOver={() => onHoverDestination(dest.id)}
            onPointerOut={() => onHoverDestination(null)}
            onClick={() => onSelectDestination(dest)}
          />
        );
      })}

      {/* Holographic Earth Dome on Left Platform */}
      <HolographicGlobe
        position={holoGlobePos}
        scale={scaleFactor * 1.15}
        reducedMotion={reducedMotion}
      />
    </>
  );
}

export function UniverseCanvas(props: UniverseCanvasProps) {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 16], fov: 28, near: 0.1, far: 1000 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <SceneContent {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
}
