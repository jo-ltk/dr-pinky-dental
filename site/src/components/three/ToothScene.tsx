"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { collarGeometry, crownGeometry, implantGeometry, rootGeometry } from "./geometry";

export type ToothVariant = "implant" | "tooth" | "crown" | "screw" | "aligner";

function useMaterials() {
  return useMemo(() => {
    // Realistic porcelain with clearcoat and champagne sheen
    const porcelain = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#FCFAF7"),
      roughness: 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      sheen: 0.55,
      sheenColor: new THREE.Color("#F5DDA5"),
      sheenRoughness: 0.35,
      ior: 1.52,
      specularIntensity: 0.9,
      specularColor: new THREE.Color("#FFF5E6"),
    });

    // Medical-grade surgical titanium with smooth metallic microfacet reflection
    const titanium = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#D1CBC1"),
      metalness: 0.98,
      roughness: 0.24,
      clearcoat: 0.3,
      clearcoatRoughness: 0.15,
    });

    // Subtle champagne gold illumination ring at crown-collar interface
    const glow = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#F5DDA5"),
      toneMapped: false,
    });

    const shell = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#F5DDA5"),
      roughness: 0.06,
      transmission: 0.95,
      thickness: 0.4,
      transparent: true,
      opacity: 0.6,
      clearcoat: 1.0,
    });

    return { porcelain, titanium, glow, shell };
  }, []);
}

function Model({
  variant,
  animate,
  pointer,
}: {
  variant: ToothVariant;
  animate: boolean;
  pointer: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const m = useMaterials();
  const geo = useMemo(
    () => ({
      crown: crownGeometry(),
      implant: implantGeometry(),
      collar: collarGeometry(),
      root: rootGeometry(),
    }),
    []
  );

  useFrame((state, dt) => {
    if (!group.current || !inner.current) return;
    const t = state.clock.elapsedTime;
    if (animate) {
      inner.current.rotation.y += dt * 0.18;
      group.current.position.y = Math.sin(t * 0.7) * 0.07;
    }
    const tx = pointer.current.y * 0.12;
    const ty = pointer.current.x * 0.22;
    group.current.rotation.x += (tx - group.current.rotation.x) * 0.05;
    group.current.rotation.z += (-ty * 0.4 - group.current.rotation.z) * 0.05;
  });

  const showImplant = variant === "implant" || variant === "screw";
  const showCrown = variant !== "screw";

  return (
    <group ref={group}>
      <group ref={inner} rotation={[0, variant === "crown" ? 0.6 : 0.35, 0]}>
        <group
          position={[
            0,
            variant === "implant" ? 0.85 : variant === "screw" ? 1.3 : variant === "crown" ? -0.5 : 0.3,
            0,
          ]}
        >
          {showCrown && (
            <mesh
              geometry={geo.crown}
              material={m.porcelain}
              scale={variant === "implant" ? [0.86, 1.02, 0.86] : [1.1, 1.18, 1.1]}
              position={[0, variant === "implant" ? 0.0 : -0.1, 0]}
              castShadow
            />
          )}
          {variant === "aligner" && (
            <mesh
              geometry={geo.crown}
              material={m.shell}
              scale={[1.21, 1.19, 1.22]}
              position={[0, -0.12, 0]}
            />
          )}
          {variant === "tooth" || variant === "aligner" ? (
            <group position={[0, -0.05, 0]}>
              <mesh geometry={geo.root} material={m.porcelain} position={[0.34, 0, 0.04]} rotation={[0, 0, 0.06]} />
              <mesh
                geometry={geo.root}
                material={m.porcelain}
                position={[-0.34, 0, -0.04]}
                rotation={[0, Math.PI, 0]}
                scale={[1, 0.93, 1]}
              />
            </group>
          ) : null}
          {showImplant && (
            <group>
              {variant === "implant" && (
                <mesh material={m.glow} position={[0, 0.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.47, 0.026, 24, 160]} />
                </mesh>
              )}
              {variant === "implant" && (
                <pointLight position={[0, 0.12, 0.5]} intensity={4.5} distance={1.8} decay={1.6} color="#F5DDA5" />
              )}
              <mesh geometry={geo.collar} material={m.titanium} />
              <mesh geometry={geo.implant} material={m.titanium} position={[0, -0.38, 0]} />
            </group>
          )}
        </group>
      </group>
    </group>
  );
}

function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      {/* Key softbox with pure neutral-warm illumination */}
      <Lightformer form="rect" intensity={2.6} color="#FFFBF2" position={[-3, 2, 3]} scale={[3, 4, 1]} target={[0, 0, 0]} />
      {/* Metallic gold right rim light */}
      <Lightformer form="rect" intensity={5.2} color="#D4AF6A" position={[4, 0.5, -2]} scale={[1.2, 6, 1]} target={[0, 0, 0]} />
      {/* Champagne gold left contour light */}
      <Lightformer form="rect" intensity={3.8} color="#F5DDA5" position={[-4, 0, -3]} scale={[1, 6, 1]} target={[0, 0, 0]} />
      {/* Soft champagne top strip */}
      <Lightformer form="rect" intensity={1.5} color="#F5DDA5" position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[6, 1, 1]} />
      {/* Deep royal purple floor bounce for subtle plum depth */}
      <Lightformer form="rect" intensity={1.1} color="#3B1048" position={[0, -4, 0]} rotation-x={-Math.PI / 2} scale={[10, 10, 1]} />
      {/* Warm champagne highlight ring */}
      <Lightformer form="ring" intensity={2.4} color="#F5DDA5" position={[2, 3, 4]} scale={1.2} target={[0, 0, 0]} />
    </Environment>
  );
}

/** Measures real frame times; if the device can't keep ~20fps, hand back to the static poster. */
function PerfGuard({ onSlow }: { onSlow?: () => void }) {
  const samples = useRef<number[]>([]);
  const done = useRef(false);
  useFrame((_, dt) => {
    if (done.current || !onSlow) return;
    samples.current.push(dt);
    if (samples.current.length >= 60) {
      const s = [...samples.current].sort((a, b) => a - b);
      done.current = true;
      if (s[Math.floor(s.length / 2)] > 0.05) onSlow();
    }
  });
  return null;
}

function Capture({ onReady }: { onReady?: (gl: THREE.WebGLRenderer) => void }) {
  const { gl } = useThree();
  useEffect(() => {
    onReady?.(gl);
  }, [gl, onReady]);
  return null;
}

export default function ToothScene({
  variant = "implant",
  animate = true,
  interactive = true,
  preserve = false,
  onReady,
  camZ = 10,
  className,
  paused = false,
  onFirstFrame,
  onSlow,
}: {
  paused?: boolean;
  onFirstFrame?: () => void;
  onSlow?: () => void;
  variant?: ToothVariant;
  animate?: boolean;
  interactive?: boolean;
  preserve?: boolean;
  onReady?: (gl: THREE.WebGLRenderer) => void;
  camZ?: number;
  className?: string;
}) {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    if (!interactive) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [interactive]);

  return (
    <Canvas
      className={className}
      dpr={[1, typeof window !== "undefined" && window.innerWidth < 640 ? 1.5 : 1.75]}
      camera={{ position: [0, 0.1, camZ], fov: 30 }}
      gl={{
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: preserve,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.08,
      }}
      frameloop={paused ? "never" : animate || interactive ? "always" : "demand"}
      onCreated={() => requestAnimationFrame(() => requestAnimationFrame(() => onFirstFrame?.()))}
    >
      <ambientLight intensity={0.25} color="#FFF5E6" />
      <directionalLight position={[-3, 4, 4]} intensity={1.5} color="#FFFBF2" />
      <directionalLight position={[4, 1, -3]} intensity={2.2} color="#D4AF6A" />
      <pointLight position={[0, -1.2, 2]} intensity={5.0} distance={6} color="#F5DDA5" />
      <Studio />
      <Model variant={variant} animate={animate} pointer={pointer} />
      <ContactShadows position={[0, -2.25, 0]} opacity={0.6} scale={6} blur={2.8} far={3} color="#15031b" />
      <PerfGuard onSlow={onSlow} />
      <Capture onReady={onReady} />
    </Canvas>
  );
}
