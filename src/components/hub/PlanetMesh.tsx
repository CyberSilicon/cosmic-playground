'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { Destination } from '@/data/destinations';

interface PlanetMeshProps {
  destination: Destination;
  position: [number, number, number];
  scale?: number;
  isSelected: boolean;
  isHovered: boolean;
  reducedMotion: boolean;
  onPointerOver: () => void;
  onPointerOut: () => void;
  onClick: () => void;
}

export function PlanetMesh({
  destination,
  position,
  scale = 1,
  isSelected,
  isHovered,
  reducedMotion,
  onPointerOver,
  onPointerOut,
  onClick,
}: PlanetMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  // Load primary surface texture with Suspense support
  const texture = useLoader(THREE.TextureLoader, destination.texturePath);

  // Load ring texture if available
  const ringTexture = destination.ringTexturePath
    ? useLoader(THREE.TextureLoader, destination.ringTexturePath)
    : null;

  useMemo(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = true;
      texture.needsUpdate = true;
    }
    if (ringTexture) {
      ringTexture.colorSpace = THREE.SRGBColorSpace;
      ringTexture.rotation = Math.PI / 2;
      ringTexture.center.set(0.5, 0.5);
      ringTexture.needsUpdate = true;
    }
  }, [texture, ringTexture]);

  const radius = destination.hubPosition.baseRadius * scale;

  // Realistic axial rotation calibrated per celestial body
  useFrame((state, delta) => {
    if (reducedMotion) return;

    if (meshRef.current) {
      const rotSpeed =
        destination.id === 'saturn' || destination.id === 'jupiter'
          ? 0.07
          : destination.id === 'mars'
          ? 0.05
          : destination.id === 'venus'
          ? -0.015 // Vénus tourne en sens rétrograde
          : 0.035;
      meshRef.current.rotation.y += delta * rotSpeed;
    }

    if (atmosphereRef.current && destination.hasAtmosphere) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.012;
      atmosphereRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  const activeScale = isSelected ? 1.1 : isHovered ? 1.05 : 1.0;

  return (
    <group position={position} scale={[activeScale, activeScale, activeScale]}>
      {/* 3D Interactive Sphere */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          onPointerOver();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onPointerOut();
          document.body.style.cursor = 'auto';
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          roughness={destination.category === 'gas_giant' ? 0.75 : destination.id === 'titan' ? 0.95 : 0.6}
          metalness={destination.id === 'mercury' ? 0.2 : 0.04}
          emissive={new THREE.Color(destination.colorHex)}
          emissiveIntensity={destination.category === 'star' ? 0.9 : isSelected ? 0.25 : isHovered ? 0.18 : 0.03}
        />
      </mesh>

      {/* Atmospheric Rim Glow (Only rendered when the body has a documented atmosphere) */}
      {destination.hasAtmosphere && (
        <mesh ref={atmosphereRef}>
          <sphereGeometry args={[radius * 1.07, 32, 32]} />
          <meshBasicMaterial
            color={destination.trajectoryColor}
            transparent
            opacity={isSelected ? 0.45 : isHovered ? 0.35 : 0.16}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Selection / Hover Accent Ring */}
      {(isSelected || isHovered) && (
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <ringGeometry args={[radius * 1.22, radius * 1.28, 64]} />
          <meshBasicMaterial
            color={destination.trajectoryColor}
            transparent
            opacity={isSelected ? 0.75 : 0.4}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Saturn's Rings Geometry & Material */}
      {destination.hasRings && (
        <mesh
          ref={ringRef}
          rotation={[-1.28, 0.2, -0.3]}
          position={[0, 0, 0]}
        >
          <ringGeometry
            args={[
              radius * (destination.ringsRadius?.inner || 1.26),
              radius * (destination.ringsRadius?.outer || 2.25),
              96,
            ]}
          />
          <meshStandardMaterial
            map={ringTexture || texture}
            transparent
            opacity={0.88}
            side={THREE.DoubleSide}
            roughness={0.8}
            metalness={0.05}
            depthWrite={false}
            blending={THREE.NormalBlending}
          />
        </mesh>
      )}
    </group>
  );
}
