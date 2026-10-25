'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface HolographicGlobeProps {
  position: [number, number, number];
  scale?: number;
  reducedMotion: boolean;
}

export function HolographicGlobe({
  position,
  scale = 1,
  reducedMotion,
}: HolographicGlobeProps) {
  const globeRef = useRef<THREE.Group>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);
  const ringRef3 = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (reducedMotion) return;

    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.2;
    }
    if (ringRef1.current) {
      ringRef1.current.rotation.z += delta * 0.4;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.x -= delta * 0.3;
      ringRef2.current.rotation.y += delta * 0.25;
    }
    if (ringRef3.current) {
      ringRef3.current.rotation.z -= delta * 0.2;
    }
    if (coreRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.15;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  const baseRadius = 0.55 * scale;

  return (
    <group position={position}>
      {/* Platform Floor Glow Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -baseRadius * 0.8, 0]}>
        <ringGeometry args={[baseRadius * 0.7, baseRadius * 1.5, 48]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Rotating Holographic Earth Wireframe Sphere */}
      <group ref={globeRef}>
        <mesh>
          <sphereGeometry args={[baseRadius, 24, 24]} />
          <meshBasicMaterial
            color="#38bdf8"
            wireframe
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Inner Solid Holographic Core */}
        <mesh ref={coreRef}>
          <sphereGeometry args={[baseRadius * 0.5, 16, 16]} />
          <meshBasicMaterial
            color="#0284c7"
            transparent
            opacity={0.25}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Latitudinal equator indicator */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[baseRadius * 0.99, baseRadius * 1.02, 48]} />
          <meshBasicMaterial
            color="#7dd3fc"
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* Orbital Satellite Tracking Rings */}
      <mesh ref={ringRef1} rotation={[0.4, 0.2, 0]}>
        <ringGeometry args={[baseRadius * 1.25, baseRadius * 1.28, 48]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh ref={ringRef2} rotation={[-0.6, 0.5, 0.3]}>
        <ringGeometry args={[baseRadius * 1.4, baseRadius * 1.43, 48]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh ref={ringRef3} rotation={[Math.PI / 2.5, 0, 0]}>
        <ringGeometry args={[baseRadius * 1.55, baseRadius * 1.58, 48]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Vertical Data Scan Laser Column */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, baseRadius * 2.4, 16]} />
        <meshBasicMaterial
          color="#bae6fd"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
