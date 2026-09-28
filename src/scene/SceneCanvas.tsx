import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import * as THREE from "three";
import { auroraFragment, auroraVertex } from "./shaders";

function webglAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl2") || c.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

function ScrollRig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const el = group.current;
    if (!el) return;
    const y = window.scrollY || 0;
    const t = clock.getElapsedTime();
    const targetY = y * 0.0016;
    const targetRot = Math.min(0.6, y * 0.00035);
    el.position.y = THREE.MathUtils.lerp(el.position.y, targetY, 0.06);
    el.rotation.y = THREE.MathUtils.lerp(
      el.rotation.y,
      targetRot + Math.sin(t * 0.08) * 0.06,
      0.05,
    );
  });
  return <group ref={group}>{children}</group>;
}

function AuroraPlane() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uViolet: { value: new THREE.Color("#a855f7") },
      uCyan: { value: new THREE.Color("#22d3ee") },
      uOrange: { value: new THREE.Color("#fb923c") },
    }),
    [],
  );
  useFrame(({ clock }) => {
    if (mat.current) mat.current.uniforms.uTime.value = clock.getElapsedTime();
  });
  return (
    <mesh position={[0, 0, -6]} scale={[16, 10, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={mat}
        vertexShader={auroraVertex}
        fragmentShader={auroraFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

function Shards() {
  const items = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        pos: [
          (Math.sin(i * 2.7) * 5.5) as number,
          ((i % 4) - 1.5) * 1.8 as number,
          (-2 - (i % 3) * 1.2) as number,
        ] as [number, number, number],
        scale: 0.18 + ((i * 37) % 10) / 28,
        speed: 1 + ((i * 13) % 5) / 4,
        color: i % 3 === 0 ? "#22d3ee" : i % 3 === 1 ? "#a855f7" : "#fb923c",
      })),
    [],
  );
  return (
    <>
      {items.map((s, i) => (
        <Float key={i} speed={s.speed} rotationIntensity={0.6} floatIntensity={1.2}>
          <mesh position={s.pos} scale={s.scale}>
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={s.color}
              transparent
              opacity={0.32}
              roughness={0.35}
              metalness={0.55}
              emissive={s.color}
              emissiveIntensity={0.25}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

export default function SceneCanvas() {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData =
    typeof navigator !== "undefined" &&
    (navigator as unknown as { connection?: { saveData?: boolean } })
      .connection?.saveData === true;
  const noWebgl =
    typeof window !== "undefined" && !reduced && !saveData && !webglAvailable();

  useEffect(() => {
    if (noWebgl) document.body.dataset.noWebgl = "true";
  }, [noWebgl]);

  if (reduced || saveData || noWebgl) return null;

  const dpr: [number, number] =
    typeof window !== "undefined" && window.innerWidth < 820
      ? [1, 1.25]
      : [1, 1.75];

  return (
    <div className="scene-canvas" aria-hidden="true">
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0, 6], fov: 55 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          const pause = () => {
            try {
              if (document.hidden) gl.setAnimationLoop(null);
            } catch {
              /* ignore */
            }
          };
          document.addEventListener("visibilitychange", pause, { once: true });
        }}
      >
        <ambientLight intensity={0.7} />
        <pointLight position={[4, 3, 4]} intensity={12} color="#a855f7" />
        <pointLight position={[-4, -2, 3]} intensity={8} color="#22d3ee" />
        <Suspense fallback={null}>
          <ScrollRig>
            <AuroraPlane />
            <Stars
              radius={30}
              depth={20}
              count={350}
              factor={2.2}
              saturation={0.4}
              fade
              speed={0.6}
            />
            <Shards />
          </ScrollRig>
        </Suspense>
      </Canvas>
    </div>
  );
}
