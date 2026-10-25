'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface ProceduralAstronautProps {
  position: [number, number, number];
  scale?: number;
  reducedMotion: boolean;
}

export function ProceduralAstronaut({
  position,
  scale = 1,
  reducedMotion,
}: ProceduralAstronautProps) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const chestRef = useRef<THREE.Group>(null);

  // Subtle breathing and idle posture motion
  useFrame((state) => {
    if (reducedMotion) return;
    const time = state.clock.elapsedTime;

    if (groupRef.current) {
      // Very gentle breathing oscillation (12 breaths per minute = ~0.2 Hz)
      const breath = Math.sin(time * 1.3) * 0.015;
      groupRef.current.position.y = position[1] + breath;
    }

    if (headRef.current) {
      // Subtle gaze tracking of the cosmos
      headRef.current.rotation.y = 0.15 + Math.sin(time * 0.4) * 0.04;
      headRef.current.rotation.x = -0.05 + Math.cos(time * 0.3) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]} rotation={[0, 0.45, 0]}>
      {/* Platform Shadow */}
      <mesh position={[0, -1.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.65, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.65} />
      </mesh>

      {/* Head / Helmet & Ponytail */}
      <group ref={headRef} position={[0, 0.95, 0.05]}>
        {/* Sleek Aerospace Helmet */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial
            color="#f1f5f9"
            roughness={0.25}
            metalness={0.6}
          />
        </mesh>

        {/* Gold Reflective Visor facing outward to space */}
        <mesh position={[0.08, 0.03, 0.18]} rotation={[0.1, 0.25, 0]}>
          <sphereGeometry args={[0.22, 24, 24, 0, Math.PI * 1.1, 0, Math.PI * 0.8]} />
          <meshStandardMaterial
            color="#f59e0b"
            roughness={0.1}
            metalness={0.9}
            emissive="#b45309"
            emissiveIntensity={0.25}
          />
        </mesh>

        {/* Ponytail hair extending backward */}
        <mesh position={[-0.08, -0.05, -0.22]} rotation={[0.4, -0.1, 0]}>
          <coneGeometry args={[0.09, 0.45, 16]} />
          <meshStandardMaterial color="#1c1917" roughness={0.9} />
        </mesh>
      </group>

      {/* Torso & Suit Armor */}
      <group ref={chestRef} position={[0, 0.2, 0]}>
        {/* Upper Chest and Back */}
        <mesh position={[0, 0.25, 0]}>
          <capsuleGeometry args={[0.3, 0.45, 8, 16]} />
          <meshStandardMaterial
            color="#f8fafc"
            roughness={0.4}
            metalness={0.2}
          />
        </mesh>

        {/* Contrast Dark Carbon Panels */}
        <mesh position={[0, 0.22, 0.04]} scale={[0.92, 0.85, 0.92]}>
          <capsuleGeometry args={[0.3, 0.42, 8, 16]} />
          <meshStandardMaterial
            color="#334155"
            roughness={0.6}
            metalness={0.4}
          />
        </mesh>

        {/* Shoulder Armor Left */}
        <mesh position={[-0.38, 0.4, 0]} rotation={[0, 0, -0.2]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.3} metalness={0.4} />
        </mesh>

        {/* Shoulder Armor Right (with Mission Patch) */}
        <mesh position={[0.38, 0.4, 0]} rotation={[0, 0, 0.2]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.3} metalness={0.4} />
        </mesh>

        {/* Arm Right hanging naturally */}
        <mesh position={[0.42, 0.05, 0.05]} rotation={[-0.1, 0, -0.1]}>
          <cylinderGeometry args={[0.09, 0.07, 0.65, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.5} />
        </mesh>

        {/* Arm Left hanging naturally */}
        <mesh position={[-0.42, 0.05, 0.05]} rotation={[-0.08, 0, 0.1]}>
          <cylinderGeometry args={[0.09, 0.07, 0.65, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.5} />
        </mesh>

        {/* Backpack Life Support System (PLSS) on back */}
        <mesh position={[0, 0.32, -0.28]}>
          <boxGeometry args={[0.42, 0.58, 0.22]} />
          <meshStandardMaterial
            color="#e2e8f0"
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>

        {/* Life Support Telemetry LED strip (cyan) */}
        <mesh position={[0, 0.48, -0.39]}>
          <boxGeometry args={[0.26, 0.04, 0.02]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* Status Indicator LED (amber) */}
        <mesh position={[0.1, 0.38, -0.39]}>
          <boxGeometry args={[0.04, 0.04, 0.02]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
      </group>

      {/* Waist and Belt */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.29, 0.28, 0.14, 24]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.3} />
      </mesh>

      {/* Legs & Boots */}
      <group position={[0, -0.9, 0]}>
        {/* Left Leg */}
        <mesh position={[-0.17, 0.2, 0]} rotation={[0.05, 0, 0.04]}>
          <cylinderGeometry args={[0.13, 0.11, 0.8, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>

        {/* Right Leg */}
        <mesh position={[0.17, 0.2, 0]} rotation={[-0.05, 0, -0.04]}>
          <cylinderGeometry args={[0.13, 0.11, 0.8, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>

        {/* Left Boot */}
        <mesh position={[-0.18, -0.26, 0.06]}>
          <boxGeometry args={[0.17, 0.14, 0.32]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>

        {/* Right Boot */}
        <mesh position={[0.18, -0.26, 0.06]}>
          <boxGeometry args={[0.17, 0.14, 0.32]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}
