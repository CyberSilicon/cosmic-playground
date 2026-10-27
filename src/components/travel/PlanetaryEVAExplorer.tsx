'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ArrowLeft, Search, X } from 'lucide-react';
import { Destination } from '@/data/destinations';

interface PlanetaryEVAExplorerProps {
  destination: Destination;
  onReturn: () => void;
  reducedMotion: boolean;
}

type PlanetMeta = {
  label: string;
  g: number;
  color: string;
  groundDark: string;
  ground: string;
  groundLight: string;
  rock: string;
  ice: string;
};

const CELESTIAL_GRAVITY: Record<string, PlanetMeta> = {
  mars: {
    label: 'Mars', g: 3.71, color: '#e74c3c',
    groundDark: '#3d1c14', ground: '#7a3f2a', groundLight: '#b9724c',
    rock: '#6f4434', ice: '#c9b09a',
  },
  moon: {
    label: 'Lune', g: 1.62, color: '#d8dee9',
    groundDark: '#454a52', ground: '#767d87', groundLight: '#b3b9c2',
    rock: '#767d87', ice: '#d7e0e8',
  },
  europa: {
    label: 'Europe', g: 1.315, color: '#a8dadc',
    groundDark: '#6f93a6', ground: '#afcdda', groundLight: '#e3f3f9',
    rock: '#8fa9b8', ice: '#dcf2fa',
  },
};

const ROCK_DATA: Record<string, { name: string; composition: string; source: string }> = {
  mars: {
    name: 'Roché basaltique martien',
    composition: 'Silicate ferreux (olivine, pyroxène), feldspath, oxydes de fer',
    source: 'NASA / JPL — Curiosity & Perseverance, spectromètres APXS & ChemCam',
  },
  moon: {
    name: 'Régolithe lunaire',
    composition: 'Dioxyde de silicium, alumine, oxyde de fer, oxyde de magnésium',
    source: 'NASA — Échantillons Apollo, Lunar Sample Laboratory',
  },
  europa: {
    name: 'Glace de surface d’Europe',
    composition: 'Glace d’eau (H₂O), sels d’hydrates de magnésium et de sodium',
    source: 'NASA / JPL — Galileo & Hubble, spectroscopie infrarouge proche',
  },
};

function AstronautRig({
  posRef,
  yawRef,
  velRef,
  onGroundRef,
  keys,
  jumpPressed,
  setJumpPressed,
  meta,
  reducedMotion,
  terrainGeo,
  terrainSize,
  terrainSegments,
  joystickRef,
  cameraYawRef,
  cameraPitchRef,
  cameraDistanceRef,
}: {
  posRef: React.MutableRefObject<{ x: number; y: number; z: number }>;
  yawRef: React.MutableRefObject<number>;
  cameraYawRef: React.MutableRefObject<number>;
  cameraPitchRef: React.MutableRefObject<number>;
  cameraDistanceRef: React.MutableRefObject<number>;
  velRef: React.MutableRefObject<{ x: number; y: number; z: number }>;
  onGroundRef: React.MutableRefObject<boolean>;
  keys: { forward: boolean; backward: boolean; left: boolean; right: boolean };
  jumpPressed: boolean;
  setJumpPressed: (v: boolean) => void;
  meta: { label: string; g: number; color: string };
  reducedMotion: boolean;
  terrainGeo: THREE.PlaneGeometry;
  terrainSize: number;
  terrainSegments: number;
  joystickRef: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const walkRef = useRef(0);
  const timeRef = useRef(0);
  // Use the actual dimensions of the generated terrain for ground collision.
  const size = terrainSize;
  const segments = terrainSegments;
  const { camera } = useThree();
  useFrame((state, delta) => {
    timeRef.current = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);
    const g = meta.g;
    const jumpForce = 3.4;
    const groundFriction = 0.82;
    // Ground is sampled AFTER horizontal movement to avoid entering an uphill slope.

    let moveX = (keys.right ? 1 : 0) - (keys.left ? 1 : 0) + joystickRef.current.x;
    let moveZ = (keys.forward ? 1 : 0) - (keys.backward ? 1 : 0) + joystickRef.current.y;
    const moveLength = Math.hypot(moveX, moveZ);
    if (moveLength > 1) {
      moveX /= moveLength;
      moveZ /= moveLength;
    }

    // Déplacement relatif à la caméra (W avance dans l'axe de visée)
    const camYaw = cameraYawRef.current;
    const fwdX = -Math.sin(camYaw);
    const fwdZ = -Math.cos(camYaw);
    const rightX = Math.cos(camYaw);
    const rightZ = -Math.sin(camYaw);
    const dirX = fwdX * moveZ + rightX * moveX;
    const dirZ = fwdZ * moveZ + rightZ * moveX;
    const dirLength = Math.hypot(dirX, dirZ);

    if (dirLength > 0.01) {
      const targetYaw = Math.atan2(dirX, dirZ);
      let diff = targetYaw - yawRef.current;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      yawRef.current += diff * (1 - Math.pow(0.0001, dt));
    }

    const speed = 4.0;
    const inputX = dirLength > 0.01 ? dirX / dirLength : 0;
    const inputZ = dirLength > 0.01 ? dirZ / dirLength : 0;
    let nvx = velRef.current.x + (inputX * speed - velRef.current.x) * 0.2;
    let nvz = velRef.current.z + (inputZ * speed - velRef.current.z) * 0.2;

    if (jumpPressed && onGroundRef.current) {
      velRef.current.y = jumpForce;
      onGroundRef.current = false;
      setJumpPressed(false);
    }

    velRef.current.y -= g * dt;

    const bound = size / 2 - 3;
    posRef.current.x = THREE.MathUtils.clamp(posRef.current.x + nvx * dt, -bound, bound);
    posRef.current.z = THREE.MathUtils.clamp(posRef.current.z + nvz * dt, -bound, bound);
    const groundY = getHeightFromGeo(terrainGeo, posRef.current.x, posRef.current.z, size, segments);
    posRef.current.y += velRef.current.y * dt;

    velRef.current.x = nvx;
    velRef.current.z = nvz;

    if (posRef.current.y <= groundY) {
      posRef.current.y = groundY;
      velRef.current.y = 0;
      onGroundRef.current = true;
    } else {
      onGroundRef.current = false;
    }

    if (onGroundRef.current && moveX === 0 && moveZ === 0) {
      velRef.current.x *= groundFriction;
      velRef.current.z *= groundFriction;
      if (Math.abs(velRef.current.x) < 0.01) velRef.current.x = 0;
      if (Math.abs(velRef.current.z) < 0.01) velRef.current.z = 0;
    }

    // Caméra orbitale (glisser pour tourner, molette pour zoomer)
    const dist = cameraDistanceRef.current;
    const pitch = cameraPitchRef.current;
    const horizontal = Math.cos(pitch) * dist;
    const camOffset = new THREE.Vector3(
      Math.sin(cameraYawRef.current) * horizontal,
      1.1 + Math.sin(pitch) * dist,
      Math.cos(cameraYawRef.current) * horizontal
    );
    const targetCam = new THREE.Vector3(posRef.current.x + camOffset.x, posRef.current.y + camOffset.y, posRef.current.z + camOffset.z);
    const groundAtCam = getHeightFromGeo(terrainGeo, targetCam.x, targetCam.z, size, segments) + 0.6;
    if (targetCam.y < groundAtCam) targetCam.y = groundAtCam;

    // Évite qu'une dune masque l'astronaute : remonte la caméra au-dessus de la ligne de visée.
    const lookY = posRef.current.y + 1.15;
    for (let i = 1; i <= 6; i++) {
      const t = i / 6;
      const sx = posRef.current.x + (targetCam.x - posRef.current.x) * t;
      const sz = posRef.current.z + (targetCam.z - posRef.current.z) * t;
      const ridgeY = getHeightFromGeo(terrainGeo, sx, sz, size, segments) + 0.45;
      const requiredY = lookY + (ridgeY - lookY) / t;
      if (requiredY > targetCam.y) targetCam.y = requiredY;
    }
    camera.position.lerp(targetCam, 1 - Math.pow(0.001, dt));
    camera.lookAt(posRef.current.x, posRef.current.y + 1.15, posRef.current.z);

    if (groupRef.current) {
      groupRef.current.position.set(posRef.current.x, posRef.current.y, posRef.current.z);
      groupRef.current.rotation.y = yawRef.current;
    }

    // Animation procédurale des membres (pas dépendante des rendus React)
    const horizontalSpeed = Math.hypot(nvx, nvz);
    const moving = horizontalSpeed > 0.35;
    if (moving && onGroundRef.current) walkRef.current += dt * 9;
    const swing = moving && onGroundRef.current ? Math.sin(walkRef.current) * 0.6 : 0;
    const airborne = !onGroundRef.current;
    const limbLerp = 1 - Math.pow(0.0001, dt);
    const setRot = (ref: React.RefObject<THREE.Group | null>, x: number, z = 0) => {
      if (!ref.current) return;
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, x, limbLerp);
      ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, z, limbLerp);
    };
    const amplitude = reducedMotion ? 0.55 : 1;
    setRot(leftLegRef, airborne ? -0.45 : swing * amplitude);
    setRot(rightLegRef, airborne ? 0.35 : -swing * amplitude);
    setRot(leftArmRef, airborne ? -0.5 : -swing * 0.8 * amplitude, airborne ? -0.55 : -0.08);
    setRot(rightArmRef, airborne ? -0.5 : swing * 0.8 * amplitude, airborne ? 0.55 : 0.08);

    if (bodyRef.current) {
      const bob = airborne ? 0.02 : moving ? Math.abs(Math.sin(walkRef.current * 2)) * 0.035 : reducedMotion ? 0 : Math.sin(timeRef.current * 1.5) * 0.01;
      bodyRef.current.position.y = THREE.MathUtils.lerp(bodyRef.current.position.y, bob, limbLerp);
    }
    if (headRef.current && !reducedMotion) {
      headRef.current.rotation.y = Math.sin(timeRef.current * 0.45) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <group ref={bodyRef}>
        {/* Casque et visière dorée */}
        <group ref={headRef} position={[0, 1.98, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.3, 24, 24]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.3} metalness={0.35} />
          </mesh>
          <mesh position={[0, 0.01, 0.14]} scale={[1, 0.85, 0.62]}>
            <sphereGeometry args={[0.245, 24, 24]} />
            <meshStandardMaterial color="#f5b942" metalness={0.95} roughness={0.12} emissive="#7c4a03" emissiveIntensity={0.35} />
          </mesh>
          <mesh position={[0.25, 0.02, 0.08]}>
            <boxGeometry args={[0.05, 0.09, 0.11]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>

        {/* Torse */}
        <mesh position={[0, 1.35, 0]} castShadow>
          <capsuleGeometry args={[0.3, 0.42, 8, 20]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.55} metalness={0.15} />
        </mesh>
        {/* Panneau de contrôle */}
        <mesh position={[0, 1.38, 0.27]}>
          <boxGeometry args={[0.34, 0.28, 0.08]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.5} />
        </mesh>
        <mesh position={[-0.08, 1.45, 0.32]}>
          <boxGeometry args={[0.06, 0.04, 0.01]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[0.04, 1.45, 0.32]}>
          <boxGeometry args={[0.06, 0.04, 0.01]} />
          <meshBasicMaterial color="#f97316" />
        </mesh>

        {/* Sac à dos PLSS */}
        <mesh position={[0, 1.4, -0.34]} castShadow>
          <boxGeometry args={[0.5, 0.64, 0.24]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.4} metalness={0.3} />
        </mesh>
        <mesh position={[0, 1.55, -0.47]}>
          <boxGeometry args={[0.3, 0.05, 0.02]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[0.16, 1.72, -0.36]}>
          <cylinderGeometry args={[0.015, 0.015, 0.36, 6]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0.16, 1.9, -0.36]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>

        {/* Bras (pivots aux épaules) */}
        <group ref={leftArmRef} position={[-0.36, 1.63, 0]}>
          <mesh position={[0, -0.27, 0]} castShadow>
            <capsuleGeometry args={[0.1, 0.34, 6, 12]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.55} />
          </mesh>
          <mesh position={[0, -0.53, 0]}>
            <sphereGeometry args={[0.11, 12, 12]} />
            <meshStandardMaterial color="#1e293b" roughness={0.7} />
          </mesh>
        </group>
        <group ref={rightArmRef} position={[0.36, 1.63, 0]}>
          <mesh position={[0, -0.27, 0]} castShadow>
            <capsuleGeometry args={[0.1, 0.34, 6, 12]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.55} />
          </mesh>
          <mesh position={[0, -0.53, 0]}>
            <sphereGeometry args={[0.11, 12, 12]} />
            <meshStandardMaterial color="#1e293b" roughness={0.7} />
          </mesh>
        </group>

        {/* Jambes (pivots aux hanches) */}
        <group ref={leftLegRef} position={[-0.17, 0.98, 0]}>
          <mesh position={[0, -0.36, 0]} castShadow>
            <capsuleGeometry args={[0.12, 0.5, 6, 12]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.55} />
          </mesh>
          <mesh position={[0, -0.8, 0.08]} castShadow>
            <boxGeometry args={[0.23, 0.2, 0.42]} />
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </mesh>
        </group>
        <group ref={rightLegRef} position={[0.17, 0.98, 0]}>
          <mesh position={[0, -0.36, 0]} castShadow>
            <capsuleGeometry args={[0.12, 0.5, 6, 12]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.55} />
          </mesh>
          <mesh position={[0, -0.8, 0.08]} castShadow>
            <boxGeometry args={[0.23, 0.2, 0.42]} />
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </mesh>
        </group>
      </group>

      {/* Halo de localisation discret */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 0.72, 32]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.28} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function getHeightFromGeo(geometry: THREE.PlaneGeometry, x: number, z: number, size: number, segments: number): number {
  const positions = geometry.attributes.position;
  const fx = THREE.MathUtils.clamp(((x / size) + 0.5) * segments, 0, segments);
  const fz = THREE.MathUtils.clamp(((z / size) + 0.5) * segments, 0, segments);
  const x0 = Math.floor(fx);
  const z0 = Math.floor(fz);
  const x1 = Math.min(x0 + 1, segments);
  const z1 = Math.min(z0 + 1, segments);
  const tx = fx - x0;
  const tz = fz - z0;
  const stride = segments + 1;
  const h00 = positions.getY(z0 * stride + x0);
  const h10 = positions.getY(z0 * stride + x1);
  const h01 = positions.getY(z1 * stride + x0);
  const h11 = positions.getY(z1 * stride + x1);
  return h00 * (1 - tx) * (1 - tz) + h10 * tx * (1 - tz) + h01 * (1 - tx) * tz + h11 * tx * tz;
}

function makeRandom(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function hashString(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function hexToRgba(hex: string, alpha: number) {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function generateTerrain(size = 100, segments = 64) {
  const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
  geometry.rotateX(-Math.PI / 2);
  const positions = geometry.attributes.position;
  const count = positions.count;
  for (let i = 0; i < count; i++) {
    const x = positions.getX(i);
    const z = positions.getZ(i);
    const h =
      Math.sin(x * 0.18) * 0.7 +
      Math.cos(z * 0.15) * 0.6 +
      Math.sin((x + z) * 0.09) * 1.0 +
      Math.cos(x * 0.4 - z * 0.32) * 0.22;
    positions.setY(i, h);
  }
  geometry.computeVertexNormals();
  return { geometry, size, segments };
}

type Rock = {
  x: number;
  z: number;
  r: number;
  type: 'stone' | 'ice';
  rotation: [number, number, number];
  squash: number;
};

function generateRocks(destinationId: string, count = 22, size = 100): Rock[] {
  const rand = makeRandom(hashString(destinationId) + 7);
  const rocks: Rock[] = [];
  for (let i = 0; i < count; i++) {
    const angle = rand() * Math.PI * 2;
    const radius = i < 7 ? 5 + rand() * 11 : 9 + rand() * (size / 2 - 11);
    const isIce = destinationId === 'europa' && rand() > 0.3;
    rocks.push({
      x: Math.cos(angle) * radius,
      z: Math.sin(angle) * radius,
      r: 0.45 + rand() * 0.9,
      type: isIce ? 'ice' : 'stone',
      rotation: [rand() * 0.7 - 0.35, rand() * Math.PI * 2, rand() * 0.7 - 0.35],
      squash: 0.65 + rand() * 0.5,
    });
  }
  return rocks;
}

function createGroundTexture(destinationId: string): THREE.Texture | null {
  if (typeof document === 'undefined') return null;
  const meta = CELESTIAL_GRAVITY[destinationId] ?? CELESTIAL_GRAVITY.mars;
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const rand = makeRandom(hashString(destinationId) + 13);

  ctx.fillStyle = meta.ground;
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 80; i++) {
    const x = rand() * 512;
    const y = rand() * 512;
    const r = 25 + rand() * 110;
    const color = rand() > 0.5 ? meta.groundLight : meta.groundDark;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, hexToRgba(color, 0.06 + rand() * 0.12));
    grad.addColorStop(1, hexToRgba(color, 0));
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < 8000; i++) {
    const x = rand() * 512;
    const y = rand() * 512;
    const s = 0.6 + rand() * 1.8;
    ctx.fillStyle = rand() > 0.45 ? hexToRgba(meta.groundLight, 0.1 + rand() * 0.28) : hexToRgba(meta.groundDark, 0.1 + rand() * 0.3);
    ctx.fillRect(x, y, s, s);
  }

  for (let i = 0; i < (destinationId === 'europa' ? 18 : 30); i++) {
    const x = rand() * 512;
    const y = rand() * 512;
    const r = 5 + rand() * 32;
    ctx.strokeStyle = hexToRgba(meta.groundLight, 0.12 + rand() * 0.14);
    ctx.lineWidth = 1 + rand() * 1.5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = hexToRgba(meta.groundDark, 0.08);
    ctx.fill();
  }

  if (destinationId === 'europa') {
    ctx.strokeStyle = hexToRgba(meta.groundLight, 0.35);
    for (let i = 0; i < 26; i++) {
      let x = rand() * 512;
      let y = rand() * 512;
      ctx.lineWidth = 0.8 + rand() * 1.6;
      ctx.beginPath();
      ctx.moveTo(x, y);
      const segments = 3 + Math.floor(rand() * 4);
      for (let s = 0; s < segments; s++) {
        x += (rand() - 0.5) * 90;
        y += (rand() - 0.5) * 90;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(14, 14);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function TerrainMesh({ geometry, texture }: { geometry: THREE.PlaneGeometry; texture: THREE.Texture | null }) {
  return (
    <mesh receiveShadow geometry={geometry}>
      <meshStandardMaterial map={texture ?? undefined} roughness={0.95} metalness={0.04} color="#ffffff" />
    </mesh>
  );
}

function useKeyboardControls(onJump: (v: boolean) => void) {
  const [keys, setKeys] = useState<Record<string, boolean>>({});
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
      if (e.code === 'Space' && !e.repeat) {
        onJump(true);
        return;
      }
      setKeys((k) => ({ ...k, [e.code]: true }));
    };
    const up = (e: KeyboardEvent) => setKeys((k) => ({ ...k, [e.code]: false }));
    const blur = () => setKeys({});
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', blur);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', blur);
    };
  }, [onJump]);
  return {
    forward: !!keys['KeyW'] || !!keys['KeyZ'] || !!keys['ArrowUp'],
    backward: !!keys['KeyS'] || !!keys['ArrowDown'],
    left: !!keys['KeyA'] || !!keys['KeyQ'] || !!keys['ArrowLeft'],
    right: !!keys['KeyD'] || !!keys['ArrowRight'],
  };
}

function VirtualJoystick({ onChange }: { onChange: (x: number, y: number) => void }) {
  const baseRef = useRef<HTMLDivElement>(null);
  const pointerId = useRef<number | null>(null);
  const [thumb, setThumb] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  const update = (clientX: number, clientY: number) => {
    const el = baseRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const radius = rect.width / 2;
    let dx = (clientX - cx) / radius;
    let dy = (clientY - cy) / radius;
    const len = Math.hypot(dx, dy);
    if (len > 1) {
      dx /= len;
      dy /= len;
    }
    setThumb({ x: dx, y: dy });
    onChange(dx, -dy);
  };

  const release = () => {
    pointerId.current = null;
    setActive(false);
    setThumb({ x: 0, y: 0 });
    onChange(0, 0);
  };

  return (
    <div
      ref={baseRef}
      role="group"
      aria-label="Joystick de déplacement"
      className={`relative w-28 h-28 rounded-full border bg-black/45 backdrop-blur-md pointer-events-auto touch-none transition-colors ${
        active ? 'border-cyan-400 shadow-[0_0_24px_rgba(34,211,238,0.35)]' : 'border-white/20'
      }`}
      onPointerDown={(e) => {
        e.preventDefault();
        pointerId.current = e.pointerId;
        setActive(true);
        e.currentTarget.setPointerCapture(e.pointerId);
        update(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => {
        if (pointerId.current === e.pointerId) update(e.clientX, e.clientY);
      }}
      onPointerUp={release}
      onPointerCancel={release}
    >
      <div className="absolute inset-4 rounded-full border border-cyan-400/20" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-12 h-12 rounded-full border border-cyan-300/70 bg-cyan-400/25 shadow-[0_0_16px_rgba(34,211,238,0.35)]"
          style={{ transform: `translate(${thumb.x * 28}px, ${thumb.y * 28}px)` }}
        />
      </div>
      <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-mono tracking-widest text-cyan-300/70">
        DÉPLACEMENT
      </span>
    </div>
  );
}

export function PlanetaryEVAExplorer({ destination, onReturn, reducedMotion }: PlanetaryEVAExplorerProps) {
  const meta = CELESTIAL_GRAVITY[destination.id] || CELESTIAL_GRAVITY.mars;
  const rockInfo = ROCK_DATA[destination.id] || ROCK_DATA.mars;

  const [jumpPressed, setJumpPressed] = useState(false);
  const [analyzeOpen, setAnalyzeOpen] = useState<{ x: number; z: number } | null>(null);
  const keys = useKeyboardControls(setJumpPressed);
  const joystickRef = useRef({ x: 0, y: 0 });

  // Three.js construit des objets non déterministes : on monte la scène uniquement côté client.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const terrainData = useMemo(() => (mounted ? generateTerrain() : null), [mounted]);
  const terrainGeo = terrainData?.geometry ?? null;
  const size = terrainData?.size ?? 100;
  const segments = terrainData?.segments ?? 64;
  const rocks = useMemo(() => generateRocks(destination.id, 22, size), [destination.id, size]);
  const texture = useMemo(() => (mounted ? createGroundTexture(destination.id) : null), [mounted, destination.id]);

  useEffect(() => () => terrainGeo?.dispose(), [terrainGeo]);
  useEffect(() => () => texture?.dispose(), [texture]);
  useEffect(() => () => { document.body.style.cursor = 'auto'; }, []);

  useEffect(() => {
    if (!analyzeOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAnalyzeOpen(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [analyzeOpen]);

  const pos = useRef({ x: 0, y: 0, z: 0 });
  useEffect(() => {
    if (terrainGeo) pos.current.y = getHeightFromGeo(terrainGeo, 0, 0, size, segments);
  }, [terrainGeo, size, segments]);
  const vel = useRef({ x: 0, y: 0, z: 0 });
  const yaw = useRef(0);
  const cameraYaw = useRef(Math.PI);
  const cameraPitch = useRef(0.3);
  const cameraDistance = useRef(5.2);
  const dragRef = useRef<{ x: number; y: number } | null>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const onGround = useRef(false);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.x;
      const dy = e.clientY - dragRef.current.y;
      dragRef.current = { x: e.clientX, y: e.clientY };
      cameraYaw.current -= dx * 0.006;
      cameraPitch.current = THREE.MathUtils.clamp(cameraPitch.current - dy * 0.004, 0.08, 1.0);
    };
    const onUp = () => { dragRef.current = null; };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, []);

  useEffect(() => {
    const el = canvasHostRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraDistance.current = THREE.MathUtils.clamp(cameraDistance.current + e.deltaY * 0.004, 3.4, 9);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <div
      className="relative w-full bg-[#020617] text-white select-none overflow-hidden rounded-2xl border border-cyan-500/30"
      style={{ height: 'clamp(460px, 76vh, 740px)' }}
    >
      <div
        ref={canvasHostRef}
        className="absolute inset-0 z-0 touch-none"
        onPointerDown={(e) => {
          if (e.pointerType === 'mouse' && e.button !== 0) return;
          dragRef.current = { x: e.clientX, y: e.clientY };
        }}
      >
        {terrainGeo ? (
        <Canvas
          camera={{ position: [0, 3.6, -5.2], fov: 48, near: 0.1, far: 240 }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          dpr={[1, 2]}
          shadows="percentage"
        >
          <ambientLight intensity={0.6} color="#f8fafc" />
          <directionalLight
            position={[18, 26, 14]}
            intensity={2.3}
            color="#ffffff"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-left={-30}
            shadow-camera-right={30}
            shadow-camera-top={30}
            shadow-camera-bottom={-30}
            shadow-camera-far={90}
            shadow-bias={-0.0004}
          />
          <directionalLight position={[-14, 9, -12]} intensity={0.65} color="#7dd3fc" />
          <fog attach="fog" args={[destination.id === 'mars' ? '#a06b53' : destination.id === 'moon' ? '#090d15' : '#172331', 48, 115]} />
          <color attach="background" args={[destination.id === 'mars' ? '#9f6549' : '#020617']} />

          <TerrainMesh geometry={terrainGeo} texture={texture} />

          {rocks.map((rock, i) => (
            <mesh
              key={i}
              position={[
                rock.x,
                getHeightFromGeo(terrainGeo, rock.x, rock.z, size, segments) + rock.r * rock.squash * 0.7,
                rock.z,
              ]}
              rotation={rock.rotation}
              scale={[rock.r * 1.15, rock.r * rock.squash, rock.r]}
              castShadow
              receiveShadow
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                document.body.style.cursor = 'auto';
              }}
              onClick={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'auto';
                setAnalyzeOpen({ x: rock.x, z: rock.z });
              }}
            >
              <icosahedronGeometry args={[1, 0]} />
              <meshStandardMaterial
                color={rock.type === 'ice' ? meta.ice : meta.rock}
                roughness={rock.type === 'ice' ? 0.55 : 0.9}
                metalness={rock.type === 'ice' ? 0.1 : 0.04}
              />
            </mesh>
          ))}

          <AstronautRig
            posRef={pos}
            yawRef={yaw}
            velRef={vel}
            onGroundRef={onGround}
            keys={keys}
            jumpPressed={jumpPressed}
            setJumpPressed={setJumpPressed}
            meta={meta}
            reducedMotion={reducedMotion}
            terrainGeo={terrainGeo}
            terrainSize={size}
            terrainSegments={segments}
            joystickRef={joystickRef}
            cameraYawRef={cameraYaw}
            cameraPitchRef={cameraPitch}
            cameraDistanceRef={cameraDistance}
          />
        </Canvas>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#020617] text-cyan-300">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase">Initialisation de la surface…</span>
          </div>
        )}
      </div>

      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start gap-4">
        <div className="pointer-events-none rounded-xl border border-cyan-500/25 bg-slate-950/75 px-4 py-3">
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-cyan-400">EVA — SORTIE EXTRAVÉHICULAIRE</span>
          <h2 className="text-lg font-black tracking-[0.1em] uppercase text-white">{destination.name}</h2>
          <span className="text-xs font-mono text-slate-300">Gravité : {meta.g} m/s² — {meta.label}</span>
          <span className="mt-1 block text-[9px] font-mono text-amber-300/80">
            Terrain procédural — échelle non réelle
          </span>
        </div>
        <button
          type="button"
          onClick={onReturn}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 hover:border-cyan-400 text-xs font-bold tracking-widest uppercase text-slate-300 hover:text-white transition-all bg-slate-950/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          <ArrowLeft className="w-4 h-4" /> RETOUR LABORATOIRE
        </button>
      </div>

      <div className="pointer-events-none absolute bottom-24 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1 whitespace-nowrap md:flex">
        <span className="rounded-full border border-white/10 bg-slate-950/70 px-4 py-1.5 font-mono text-[10px] text-slate-300">
          <kbd className="text-cyan-300">ZQSD / WASD</kbd> se déplacer · <kbd className="text-cyan-300">ESPACE</kbd> sauter
        </span>
        <span className="rounded-full border border-white/10 bg-slate-950/70 px-4 py-1.5 font-mono text-[10px] text-slate-400">
          Glisser pour la caméra · Molette pour zoomer · Cliquer une roche pour l&apos;analyser
        </span>
      </div>

      <div className="absolute bottom-6 left-6 right-6 z-20 pointer-events-none px-6">
        <div className="flex justify-between items-end">
          <VirtualJoystick
            onChange={(x, y) => {
              joystickRef.current.x = x;
              joystickRef.current.y = y;
            }}
          />
          <button
            type="button"
            onClick={() => setJumpPressed(true)}
            className="w-16 h-16 rounded-full border border-white/20 bg-black/50 backdrop-blur-md text-cyan-400 text-xs font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:border-cyan-400 active:scale-95 transition-all"
          >
            SAUT
          </button>
        </div>
      </div>

      {analyzeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl bg-slate-950 border border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.25)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Analyse géologique</h3>
              <button type="button" onClick={() => setAnalyzeOpen(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-slate-300 mb-4">{rockInfo.name}</p>
            <div className="bg-slate-900/60 border border-white/10 p-4 rounded-xl mb-4">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Composition estimée</span>
              <p className="text-xs text-slate-200 leading-relaxed">{rockInfo.composition}</p>
            </div>
            <p className="text-[10px] text-slate-500 italic mb-6">Source : {rockInfo.source}</p>
            <button type="button" onClick={() => setAnalyzeOpen(null)} className="w-full py-3 rounded-lg border border-cyan-400 bg-cyan-500/10 text-cyan-400 font-bold tracking-wider hover:bg-cyan-400 hover:text-slate-950 transition-all">
              Fermer l'analyse
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

