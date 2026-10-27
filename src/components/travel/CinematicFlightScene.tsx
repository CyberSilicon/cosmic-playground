'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import gsap from 'gsap';
import { Destination } from '@/data/destinations';

export interface FlightProgressState {
  progress: number;
  phaseLabel: string;
  speedIndicator: string;
}

export interface CinematicFlightSceneProps {
  destination: Destination;
  isMobile: boolean;
  reducedMotion: boolean;
  onProgressUpdate?: (state: FlightProgressState) => void;
  onFlightComplete: () => void;
}

/**
 * Procedural 3D Spaceship built with React Three Fiber primitives.
 * Features a sleek command fuselage, cockpit canopy, swept wings,
 * stabilizer fin, warp ring, and animated ion thruster plumes.
 */
function SpaceshipMesh({
  shipRef,
  thrusterGlowRef,
  accentColor,
}: {
  shipRef: React.RefObject<THREE.Group | null>;
  thrusterGlowRef: React.RefObject<THREE.Group | null>;
  accentColor: string;
}) {
  const ringPulseRef = useRef<THREE.Mesh>(null);
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

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (thrusterGlowRef.current) {
      const flicker = 0.92 + Math.sin(t * 42) * 0.08 + Math.cos(t * 27) * 0.05;
      thrusterGlowRef.current.scale.set(1, 1, flicker);
    }
    if (ringPulseRef.current) {
      const pulse = 1 + Math.sin(t * 8) * 0.06;
      ringPulseRef.current.scale.set(pulse, pulse, 1);
    }
  });

  return (
    <group ref={shipRef} scale={[0.28, 0.28, 0.28]}>
      {shipModel && <primitive object={shipModel} rotation={[0, Math.PI, 0]} />}
      <group rotation={[0, Math.PI, 0]} visible={!shipModel}>
        {/* Main Fuselage Hull */}
        <mesh position={[0, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.38, 2.2, 48]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.75} roughness={0.25} />
        </mesh>

        {/* Rear Engine Housing */}
        <mesh position={[0, 0, -0.95]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.42, 0.34, 0.65, 48]} />
          <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.3} />
        </mesh>

        {/* Glowing Cockpit Canopy */}
        <mesh position={[0, 0.18, 0.35]} rotation={[Math.PI / 2.2, 0, 0]}>
          <capsuleGeometry args={[0.16, 0.55, 8, 16]} />
          <meshStandardMaterial
            color="#0284c7"
            emissive="#38bdf8"
            emissiveIntensity={0.9}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Swept Delta Wings */}
        <mesh position={[0, -0.03, -0.35]}>
          <boxGeometry args={[2.3, 0.06, 0.85]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Wingtip Accent Strips */}
        <mesh position={[-1.15, 0.02, -0.35]} rotation={[0, 0, 0.25]}>
          <boxGeometry args={[0.08, 0.28, 0.95]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[1.15, 0.02, -0.35]} rotation={[0, 0, -0.25]}>
          <boxGeometry args={[0.08, 0.28, 0.95]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.8} />
        </mesh>

        {/* Top Stabilizer Fin */}
        <mesh position={[0, 0.32, -0.75]} rotation={[-0.3, 0, 0]}>
          <boxGeometry args={[0.06, 0.52, 0.65]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.25} />
        </mesh>

        {/* Holographic Warp Ring around Rear Hull */}
        <mesh ref={ringPulseRef} position={[0, 0, -0.65]}>
          <torusGeometry args={[0.56, 0.025, 12, 48]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Dual Ion Thruster Plumes */}
        <group ref={thrusterGlowRef} position={[0, 0, -1.28]}>
          <mesh position={[0, 0, -0.55]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.24, 1.35, 16, 1, true]} />
            <meshBasicMaterial
              color="#38bdf8"
              transparent
              opacity={0.85}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          <mesh position={[0, 0, -0.32]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.12, 0.75, 12]} />
            <meshBasicMaterial
              color="#e0f2fe"
              transparent
              opacity={0.95}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          <mesh position={[-0.28, 0, -0.35]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.09, 0.7, 12]} />
            <meshBasicMaterial
              color={accentColor}
              transparent
              opacity={0.8}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          <mesh position={[0.28, 0, -0.35]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.09, 0.7, 12]} />
            <meshBasicMaterial
              color={accentColor}
              transparent
              opacity={0.8}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          <pointLight color="#38bdf8" intensity={3.5} distance={6} />
        </group>
      </group>
    </group>
  );
}

/**
 * Streaming 3D Starfield that moves past the camera during flight.
 */
function StreamingStarfield({
  count,
  flightSpeedRef,
}: {
  count: number;
  flightSpeedRef: React.MutableRefObject<number>;
}) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#bae6fd'),
      new THREE.Color('#fde68a'),
      new THREE.Color('#93c5fd'),
    ];

    for (let i = 0; i < count; i++) {
      const angle = (i * 2.39996) % (Math.PI * 2);
      const radius = 2.2 + ((i * 7.13) % 28);
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = 12 - ((i * 13.37) % 95);

      const c = palette[i % palette.length];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const speed = flightSpeedRef.current;

    for (let i = 0; i < count; i++) {
      let z = posAttr.getZ(i);
      z += delta * speed * 32;
      if (z > 16) {
        z = -80;
      }
      posAttr.setZ(i, z);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.14}
        vertexColors
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/**
 * Target Destination Planet that grows progressively as the camera and ship approach.
 */
function TargetPlanet3D({
  destination,
  planetGroupRef,
}: {
  destination: Destination;
  planetGroupRef: React.RefObject<THREE.Group | null>;
}) {
  const sphereRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, destination.texturePath);
  const ringTexture = destination.ringTexturePath
    ? useLoader(THREE.TextureLoader, destination.ringTexturePath)
    : null;

  useMemo(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
    }
    if (ringTexture) {
      ringTexture.colorSpace = THREE.SRGBColorSpace;
      ringTexture.rotation = Math.PI / 2;
      ringTexture.center.set(0.5, 0.5);
      ringTexture.needsUpdate = true;
    }
  }, [texture, ringTexture]);

  useFrame((_, delta) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta * 0.14;
    }
  });

  const baseRadius = 2.6;

  return (
    <group ref={planetGroupRef} position={[0, 0.4, -52]} scale={[0.35, 0.35, 0.35]}>
      <mesh ref={sphereRef}>
        <sphereGeometry args={[baseRadius, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          roughness={destination.category === 'gas_giant' ? 0.7 : 0.6}
          metalness={0.05}
          emissive={new THREE.Color(destination.colorHex)}
          emissiveIntensity={destination.category === 'star' ? 0.95 : 0.08}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[baseRadius * 1.08, 48, 48]} />
        <meshBasicMaterial
          color={destination.trajectoryColor || destination.colorHex}
          transparent
          opacity={destination.hasAtmosphere ? 0.32 : 0.14}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[baseRadius * 1.18, 32, 32]} />
        <meshBasicMaterial
          color={destination.colorHex}
          transparent
          opacity={0.12}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {destination.hasRings && (
        <mesh rotation={[-1.25, 0.18, -0.25]}>
          <ringGeometry
            args={[
              baseRadius * (destination.ringsRadius?.inner || 1.26),
              baseRadius * (destination.ringsRadius?.outer || 2.25),
              96,
            ]}
          />
          <meshStandardMaterial
            map={ringTexture || texture}
            transparent
            opacity={0.88}
            side={THREE.DoubleSide}
            roughness={0.8}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}

/**
 * Departure Earth & Station Horizon at the beginning of the trajectory.
 */
function DepartureEarthHorizon() {
  const earthTexture = useLoader(THREE.TextureLoader, '/assets/planets/earth.jpg');

  useMemo(() => {
    if (earthTexture) {
      earthTexture.colorSpace = THREE.SRGBColorSpace;
      earthTexture.needsUpdate = true;
    }
  }, [earthTexture]);

  return (
    <group position={[0, -9.2, 6]}>
      <mesh rotation={[0.2, -0.6, 0]}>
        <sphereGeometry args={[7.8, 48, 48]} />
        <meshStandardMaterial map={earthTexture} roughness={0.65} metalness={0.05} />
      </mesh>
      <mesh>
        <sphereGeometry args={[8.05, 48, 48]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.25}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/**
 * Main 3D Flight Choreographer using GSAP + CatmullRomCurve3 interpolation.
 */
function FlightChoreography({
  destination,
  isMobile,
  reducedMotion,
  onProgressUpdate,
  onFlightComplete,
}: CinematicFlightSceneProps) {
  const { camera } = useThree();
  const shipRef = useRef<THREE.Group>(null);
  const thrusterGlowRef = useRef<THREE.Group>(null);
  const planetGroupRef = useRef<THREE.Group>(null);
  const flightSpeedRef = useRef<number>(0.4);

  const { flightCurve, trajectoryLine } = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(-1.4, -0.7, 9.5),
        new THREE.Vector3(-0.7, 0.25, 0.0),
        new THREE.Vector3(0.85, 0.65, -16.0),
        new THREE.Vector3(0.3, 0.45, -33.0),
        new THREE.Vector3(0.0, 0.35, -45.5),
      ],
      false,
      'centripetal',
      0.5
    );

    const pts = curve.getPoints(90);
    const geom = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color(destination.trajectoryColor || '#38bdf8'),
      transparent: true,
      opacity: 0.38,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const lineObj = new THREE.Line(geom, mat);

    return { flightCurve: curve, trajectoryLine: lineObj };
  }, [destination.trajectoryColor]);

  useEffect(() => {
    if (reducedMotion) {
      onFlightComplete();
      return;
    }

    const animState = {
      t: 0,
      planetScale: 0.32,
      warpFactor: 0.35,
    };

    const totalDuration = isMobile ? 2.8 : 3.8;
    let lastReportedPct = -1;

    const tl = gsap.timeline({
      onComplete: () => {
        onFlightComplete();
      },
    });

    tl.to(
      animState,
      {
        t: 1,
        duration: totalDuration,
        ease: 'power2.inOut',
        onUpdate: () => {
          const t = animState.t;
          flightSpeedRef.current = animState.warpFactor;

          const shipT = Math.min(t * 0.96 + 0.02, 0.995);
          const shipPos = flightCurve.getPointAt(shipT);
          const lookAheadT = Math.min(shipT + 0.025, 1.0);
          const lookAheadPos = flightCurve.getPointAt(lookAheadT);

          if (shipRef.current) {
            shipRef.current.position.copy(shipPos);
            shipRef.current.lookAt(lookAheadPos);
            const bankAngle = Math.sin(t * Math.PI * 2) * 0.28 * (1 - t * 0.6);
            shipRef.current.rotateZ(bankAngle);
          }

          const camT = Math.max(0, shipT - 0.075 * (1 - t * 0.45));
          const camBasePos = flightCurve.getPointAt(camT);
          const camOffsetX = THREE.MathUtils.lerp(-0.35, 0.0, t);
          const camOffsetY = THREE.MathUtils.lerp(0.42, 0.16, t);
          const camOffsetZ = THREE.MathUtils.lerp(2.4, 1.15, t);

          camera.position.set(
            camBasePos.x + camOffsetX,
            camBasePos.y + camOffsetY,
            camBasePos.z + camOffsetZ
          );

          const targetPlanetCenter = new THREE.Vector3(0, 0.4, -52);
          const gazePoint = new THREE.Vector3().lerpVectors(
            lookAheadPos,
            targetPlanetCenter,
            THREE.MathUtils.smoothstep(t, 0.15, 0.92)
          );
          camera.lookAt(gazePoint);

          if (planetGroupRef.current) {
            const s = animState.planetScale;
            planetGroupRef.current.scale.set(s, s, s);
          }

          const pct = Math.min(100, Math.round(t * 100));
          if (pct !== lastReportedPct && (pct % 2 === 0 || pct === 100)) {
            lastReportedPct = pct;
            let phaseLabel = 'SORTIE DE LA STATION ORBITALE';
            let speedIndicator = 'IMPULSION ORBITALE';
            if (t >= 0.2 && t < 0.75) {
              phaseLabel = `CROISIÈRE INTERPLANÉTAIRE VERS ${destination.name.toUpperCase()}`;
              speedIndicator = 'TRANSIT CINÉMATIQUE ACCÉLÉRÉ';
            } else if (t >= 0.75) {
              phaseLabel =
                destination.category === 'gas_giant' ||
                destination.category === 'ice_giant' ||
                destination.category === 'star'
                  ? `INSERTION EN ORBITE D'OBSERVATION — ${destination.name.toUpperCase()}`
                  : `APPROCHE FINALE & ENTRÉE ORBITALE — ${destination.name.toUpperCase()}`;
              speedIndicator = 'DÉCÉLÉRATION D’APPROCHE';
            }
            onProgressUpdate?.({
              progress: pct,
              phaseLabel,
              speedIndicator,
            });
          }
        },
      },
      0
    );

    tl.to(
      animState,
      {
        planetScale: 2.35,
        duration: totalDuration,
        ease: 'power2.in',
      },
      0
    );

    tl.to(
      animState,
      {
        warpFactor: 2.2,
        duration: totalDuration * 0.45,
        ease: 'power2.in',
      },
      0
    ).to(
      animState,
      {
        warpFactor: 0.35,
        duration: totalDuration * 0.55,
        ease: 'power2.out',
      },
      totalDuration * 0.45
    );

    return () => {
      tl.kill();
    };
  }, [
    camera,
    destination.category,
    destination.name,
    flightCurve,
    isMobile,
    onFlightComplete,
    onProgressUpdate,
    reducedMotion,
  ]);

  return (
    <>
      <ambientLight intensity={0.75} color="#f8fafc" />
      <directionalLight position={[-18, 12, 14]} intensity={2.8} color="#ffedd5" />
      <directionalLight position={[12, -8, -20]} intensity={1.1} color="#38bdf8" />

      <group position={[-22, 9, -45]}>
        <mesh>
          <sphereGeometry args={[1.4, 24, 24]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
        <mesh>
          <sphereGeometry args={[3.2, 24, 24]} />
          <meshBasicMaterial
            color="#f59e0b"
            transparent
            opacity={0.28}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      <DepartureEarthHorizon />
      <StreamingStarfield count={isMobile ? 220 : 520} flightSpeedRef={flightSpeedRef} />
      <primitive object={trajectoryLine} />
      <SpaceshipMesh
        shipRef={shipRef}
        thrusterGlowRef={thrusterGlowRef}
        accentColor={destination.trajectoryColor || '#38bdf8'}
      />
      <TargetPlanet3D destination={destination} planetGroupRef={planetGroupRef} />
    </>
  );
}

export function CinematicFlightScene(props: CinematicFlightSceneProps) {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <Canvas
        camera={{ position: [-1.4, -0.3, 12], fov: 38, near: 0.1, far: 300 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        dpr={props.isMobile ? [1, 1.5] : [1, 2]}
      >
        <color attach="background" args={['#020617']} />
        <React.Suspense fallback={null}>
          <FlightChoreography {...props} />
        </React.Suspense>
      </Canvas>
    </div>
  );
}


