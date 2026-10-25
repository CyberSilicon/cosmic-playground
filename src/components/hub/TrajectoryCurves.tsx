'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Destination } from '@/data/destinations';

interface TrajectoryCurvesProps {
  destinations: Destination[];
  planetPositions: Record<string, [number, number, number]>;
  scaleFactor: number;
  selectedId: string | null;
  hoveredId: string | null;
  reducedMotion: boolean;
}

interface CurvePathData {
  id: string;
  color: string;
  curve: THREE.CatmullRomCurve3;
  points: THREE.Vector3[];
}

export function TrajectoryCurves({
  destinations,
  planetPositions,
  scaleFactor,
  selectedId,
  hoveredId,
  reducedMotion,
}: TrajectoryCurvesProps) {
  const beadCountPerCurve = 6;
  const beadRefs = useRef<{ [key: string]: THREE.Mesh[] }>({});

  const curvesData = useMemo<CurvePathData[]>(() => {
    const s = scaleFactor;
    return destinations
      .map((dest) => {
        const p = planetPositions[dest.id];
        if (!p) return null;

        const [px, py, pz] = p;
        let controlPoints: THREE.Vector3[] = [];

        if (dest.id === 'moon') {
          // Arc rising from Earth's atmospheric horizon up into Moon
          controlPoints = [
            new THREE.Vector3(px + 1.8 * s, py - 2.8 * s, pz - 0.2),
            new THREE.Vector3(px + 1.2 * s, py - 1.6 * s, pz - 0.1),
            new THREE.Vector3(px + 0.4 * s, py - 0.6 * s, pz + 0.05),
            new THREE.Vector3(px - 0.05 * s, py + 0.02 * s, pz),
          ];
        } else if (dest.id === 'mars') {
          // Orange arc looping over and around Mars from Earth
          controlPoints = [
            new THREE.Vector3(px + 2.0 * s, py - 2.9 * s, pz - 0.3),
            new THREE.Vector3(px + 1.5 * s, py - 1.5 * s, pz - 0.1),
            new THREE.Vector3(px + 0.7 * s, py + 0.3 * s, pz + 0.1),
            new THREE.Vector3(px + 0.08 * s, py + 0.08 * s, pz),
          ];
        } else if (dest.id === 'europa') {
          // Cyan loop looping below and around Europa
          controlPoints = [
            new THREE.Vector3(px + 1.4 * s, py - 2.6 * s, pz - 0.3),
            new THREE.Vector3(px + 1.0 * s, py - 1.3 * s, pz - 0.1),
            new THREE.Vector3(px + 0.4 * s, py - 0.4 * s, pz + 0.05),
            new THREE.Vector3(px + 0.05 * s, py + 0.05 * s, pz),
          ];
        } else if (dest.id === 'titan') {
          // Golden loop curving around Titan
          controlPoints = [
            new THREE.Vector3(px + 1.3 * s, py - 2.5 * s, pz - 0.3),
            new THREE.Vector3(px + 0.9 * s, py - 1.2 * s, pz - 0.1),
            new THREE.Vector3(px + 0.35 * s, py - 0.4 * s, pz + 0.05),
            new THREE.Vector3(px + 0.05 * s, py + 0.05 * s, pz),
          ];
        } else if (dest.id === 'saturn') {
          // Cyan trajectory sweeping into Saturn's orbital plane
          controlPoints = [
            new THREE.Vector3(px - 3.2 * s, py - 2.6 * s, pz - 0.3),
            new THREE.Vector3(px - 2.0 * s, py - 1.6 * s, pz - 0.1),
            new THREE.Vector3(px - 0.8 * s, py - 0.6 * s, pz + 0.05),
            new THREE.Vector3(px - 0.15 * s, py - 0.1 * s, pz),
          ];
        } else {
          controlPoints = [
            new THREE.Vector3(px + 1.0 * s, py - 2.5 * s, pz - 0.3),
            new THREE.Vector3(px, py, pz),
          ];
        }

        const curve = new THREE.CatmullRomCurve3(controlPoints, false, 'centripetal', 0.5);
        const points = curve.getPoints(50);

        return {
          id: dest.id,
          color: dest.trajectoryColor,
          curve,
          points,
        };
      })
      .filter(Boolean) as CurvePathData[];
  }, [destinations, planetPositions, scaleFactor]);

  useFrame((state) => {
    if (reducedMotion) return;
    const time = state.clock.elapsedTime;

    curvesData.forEach((curveItem) => {
      const meshes = beadRefs.current[curveItem.id];
      if (!meshes) return;

      const speed = curveItem.id === selectedId ? 0.32 : 0.18;

      meshes.forEach((mesh, index) => {
        if (!mesh) return;
        const offset = index / beadCountPerCurve;
        const t = (time * speed + offset) % 1;
        const pt = curveItem.curve.getPointAt(t);
        mesh.position.set(pt.x, pt.y, pt.z);

        const beadScale = (0.05 + Math.sin(t * Math.PI) * 0.04) * scaleFactor;
        mesh.scale.set(beadScale, beadScale, beadScale);
      });
    });
  });

  return (
    <group>
      {curvesData.map((item) => {
        const isSelected = item.id === selectedId;
        const isHovered = item.id === hoveredId;
        const opacity = isSelected ? 0.95 : isHovered ? 0.7 : 0.38;

        const lineGeometry = new THREE.BufferGeometry().setFromPoints(item.points);

        return (
          <group key={item.id}>
            {/* Smooth glowing trajectory arc */}
            {/* @ts-ignore */}
            <primitive object={new THREE.Line(
              lineGeometry,
              new THREE.LineBasicMaterial({
                color: new THREE.Color(item.color),
                transparent: true,
                opacity,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
              })
            )} />

            {/* Glowing animated beads along the trajectory */}
            {Array.from({ length: beadCountPerCurve }).map((_, idx) => (
              <mesh
                key={idx}
                ref={(el) => {
                  if (!beadRefs.current[item.id]) {
                    beadRefs.current[item.id] = [];
                  }
                  if (el) beadRefs.current[item.id][idx] = el;
                }}
              >
                <sphereGeometry args={[1, 12, 12]} />
                <meshBasicMaterial
                  color={item.color}
                  transparent
                  opacity={isSelected ? 1.0 : isHovered ? 0.85 : 0.65}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}
