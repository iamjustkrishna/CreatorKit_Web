import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { story } from "../core/story";
import { frame } from "./frame";
import { nebulaFragment, nebulaVertex } from "./shaders";
import type { TierConfig } from "./quality";

// Dark, low-chroma tints per shape so the backdrop follows the story.
const TINTS: [string, string, string][] = [
  ["#6d28d9", "#0e7490", "#9a3412"],
  ["#9a3412", "#7c2d12", "#4c1d95"],
  ["#0e7490", "#0369a1", "#4c1d95"],
  ["#4c1d95", "#1e3a8a", "#0e7490"],
  ["#6d28d9", "#a21caf", "#9a3412"],
  ["#6d28d9", "#0e7490", "#be185d"],
  ["#0f766e", "#1e40af", "#312e81"],
  ["#9a3412", "#6d28d9", "#0e7490"],
];
const TINT = TINTS.map((row) => row.map((h) => new THREE.Color(h)));

/** Full-screen domain-warped noise. No geometry edges, ever. */
export default function Nebula({ cfg }: { cfg: TierConfig }) {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAspect: { value: 1.6 },
      uCalm: { value: 0 },
      uProgress: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
      uA: { value: new THREE.Color() },
      uB: { value: new THREE.Color() },
      uC: { value: new THREE.Color() },
    }),
    [],
  );
  const frag = useMemo(() => nebulaFragment(cfg.nebulaOctaves), [cfg.nebulaOctaves]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: nebulaVertex,
        fragmentShader: frag,
        uniforms,
        transparent: true,
        depthTest: false,
        depthWrite: false,
      }),
    [uniforms, frag],
  );

  useFrame((state) => {
    const m = THREE.MathUtils.clamp(story.morph, 0, 7);
    const i = Math.min(Math.floor(m), 6);
    const f = m - i;
    const f2 = f * f * (3 - 2 * f);
    uniforms.uTime.value = state.clock.elapsedTime * 0.55;
    uniforms.uAspect.value = frame.viewW / frame.viewH;
    uniforms.uCalm.value = story.calm;
    uniforms.uProgress.value = story.progress;
    uniforms.uPointer.value.set(frame.pointer.smoothX, frame.pointer.smoothY);
    uniforms.uA.value.copy(TINT[i][0]).lerp(TINT[i + 1][0], f2);
    uniforms.uB.value.copy(TINT[i][1]).lerp(TINT[i + 1][1], f2);
    uniforms.uC.value.copy(TINT[i][2]).lerp(TINT[i + 1][2], f2);
  });

  return (
    <mesh renderOrder={-10} frustumCulled={false} material={material}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}
