import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { bus, BIN_COUNT } from "../core/bus";
import { story } from "../core/story";
import { frame } from "./frame";
import { signalFragment, signalVertex } from "./shaders";
import { buildTargets, TARGET_COUNT } from "./targets";
import type { TierConfig } from "./quality";

// Palette per shape: three colours the particles are drawn from. Warm noise
// becomes cool signal, then text, then a violet library, and so on.
const PALETTE: [string, string, string][] = [
  ["#a855f7", "#22d3ee", "#f0e6ff"], // 0 hero
  ["#fb923c", "#f97362", "#a855f7"], // 1 raw — warm, noisy
  ["#22d3ee", "#5eead4", "#e0f2fe"], // 2 clean — cool
  ["#f9f6ff", "#c4b5fd", "#67e8f9"], // 3 text
  ["#a855f7", "#f472b6", "#fb923c"], // 4 library
  ["#22d3ee", "#a855f7", "#f9f6ff"], // 5 halo
  ["#22d3ee", "#2dd4bf", "#60a5fa"], // 6 privacy — calm, cool
  ["#fb923c", "#a855f7", "#22d3ee"], // 7 crescendo
];
const PAL = PALETTE.map((row) => row.map((hex) => new THREE.Color(hex)));

export default function Signal({ cfg }: { cfg: TierConfig }) {
  const points = useRef<THREE.Points>(null);

  const { geometry, uniforms } = useMemo(() => {
    const { positions, rand } = buildTargets(cfg.points);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions[0], 3));
    for (let i = 1; i < TARGET_COUNT; i++) {
      geo.setAttribute(`aP${i}`, new THREE.BufferAttribute(positions[i], 3));
    }
    geo.setAttribute("aRand", new THREE.BufferAttribute(rand, 4));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 100);

    const u = {
      uTime: { value: 0 },
      uClock: { value: 0 },
      uMorph: { value: 0 },
      uIntro: { value: 0 },
      uBass: { value: 0 },
      uMid: { value: 0 },
      uCalm: { value: 0 },
      uSize: { value: 0.021 },
      uPx: { value: 1000 },
      uPointer: { value: new THREE.Vector3() },
      uWave: { value: new THREE.Vector4(0, 0, -100, 0) },
      uBins: { value: new Float32Array(BIN_COUNT) },
      uC0: { value: new THREE.Color() },
      uC1: { value: new THREE.Color() },
      uC2: { value: new THREE.Color() },
    };
    return { geometry: geo, uniforms: u };
  }, [cfg.points]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: signalVertex,
        fragmentShader: signalFragment,
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [uniforms],
  );

  useLayoutEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((state) => {
    const pts = points.current;
    if (!pts) return;
    const t = state.clock.elapsedTime;
    const m = THREE.MathUtils.clamp(story.morph, 0, 7);
    const i = Math.min(Math.floor(m), 6);
    const f = m - i;
    const f2 = f * f * (3 - 2 * f);

    // Dock to the DOM anchor for this part of the story.
    pts.position.set(frame.blend.x, frame.blend.y, 0);
    pts.scale.setScalar(frame.blend.s);
    const p = frame.pointer;

    const u = uniforms;
    // The ambient motion runs slow; click ripples use the real clock.
    u.uTime.value = t * cfg.motion;
    u.uClock.value = t;
    u.uMorph.value = m;
    u.uIntro.value = story.intro;
    u.uBass.value = bus.bass * cfg.motion;
    u.uMid.value = bus.mid * cfg.motion;
    u.uCalm.value = story.calm;
    u.uPx.value =
      (state.size.height * state.viewport.dpr) /
      (2 * Math.tan(THREE.MathUtils.degToRad(frame.fov) / 2));
    u.uBins.value.set(bus.bins);

    // Pointer / click in the points' local space.
    const s = Math.max(0.0001, frame.blend.s);
    u.uPointer.value.set(
      (p.worldX - frame.blend.x) / s,
      (p.worldY - frame.blend.y) / s,
      p.fine ? p.strength : 0,
    );
    u.uWave.value.set(
      (frame.wave.x - frame.blend.x) / s,
      (frame.wave.y - frame.blend.y) / s,
      frame.wave.t,
      frame.wave.active,
    );

    u.uC0.value.copy(PAL[i][0]).lerp(PAL[i + 1][0], f2);
    u.uC1.value.copy(PAL[i][1]).lerp(PAL[i + 1][1], f2);
    u.uC2.value.copy(PAL[i][2]).lerp(PAL[i + 1][2], f2);

    // Pointer strength decays when the mouse is idle or has left.
    p.strength *= 0.985;
  });

  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />;
}
