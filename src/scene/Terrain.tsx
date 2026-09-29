import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { bus, BIN_COUNT } from "../core/bus";
import { story } from "../core/story";
import { terrainFragment, terrainVertex } from "./shaders";
import type { TierConfig } from "./quality";

const ROWS = 48;
const COLS = 64;
// One new spectrogram row every 0.22 s: the landscape drifts, it does not rush.
const ROW_INTERVAL = 0.22;

/** Spectrogram terrain: newest audio row at the front, history flowing away. */
export default function Terrain({ cfg }: { cfg: TierConfig }) {
  const mesh = useRef<THREE.Mesh>(null);
  const head = useRef(0);
  const acc = useRef(0);

  const { data, texture } = useMemo(() => {
    const d = new Uint8Array(ROWS * COLS);
    const tex = new THREE.DataTexture(d, COLS, ROWS, THREE.RedFormat, THREE.UnsignedByteType);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.needsUpdate = true;
    return { data: d, texture: tex };
  }, []);

  const uniforms = useMemo(
    () => ({
      uSpec: { value: texture },
      uHead: { value: 0 },
      uRows: { value: ROWS },
      uAmp: { value: 3.6 },
      uGrid: { value: new THREE.Vector2(cfg.terrainSegments[0], cfg.terrainSegments[1]) },
      uWeight: { value: 0 },
      uC0: { value: new THREE.Color("#22d3ee") },
      uC1: { value: new THREE.Color("#a855f7") },
      uC2: { value: new THREE.Color("#fb923c") },
    }),
    [texture, cfg.terrainSegments],
  );

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: terrainVertex,
        fragmentShader: terrainFragment,
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      }),
    [uniforms],
  );

  const geometry = useMemo(
    () => new THREE.PlaneGeometry(34, 44, cfg.terrainSegments[0], cfg.terrainSegments[1]),
    [cfg.terrainSegments],
  );

  useLayoutEffect(
    () => () => {
      geometry.dispose();
      texture.dispose();
      material.dispose();
    },
    [geometry, texture, material],
  );

  useFrame((state, dt) => {
    const m = mesh.current;
    if (!m) return;
    const w = story.terrain;
    m.visible = w > 0.01;
    if (!m.visible) return;

    acc.current += Math.min(dt, 0.1);
    let pushed = false;
    while (acc.current >= ROW_INTERVAL) {
      acc.current -= ROW_INTERVAL;
      head.current = (head.current + 1) % ROWS;
      const off = head.current * COLS;
      const t = state.clock.elapsedTime;
      for (let c = 0; c < COLS; c++) {
        const u = (c / (COLS - 1)) * (BIN_COUNT - 1);
        const i0 = Math.floor(u);
        const i1 = Math.min(BIN_COUNT - 1, i0 + 1);
        const v = bus.bins[i0] + (bus.bins[i1] - bus.bins[i0]) * (u - i0);
        const relief = 0.06 * (0.5 + 0.5 * Math.sin(c * 0.55 + t * 0.9));
        const h = THREE.MathUtils.clamp((v - 0.05) * 1.55 + relief, 0, 1);
        data[off + c] = Math.round(h * 255);
      }
      pushed = true;
    }
    if (pushed) texture.needsUpdate = true;

    const u = uniforms;
    u.uHead.value = head.current + acc.current / ROW_INTERVAL;
    u.uWeight.value = w;
    u.uAmp.value = 2.3 * (0.55 + 0.45 * w);
  });

  return (
    <mesh
      ref={mesh}
      geometry={geometry}
      material={material}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -6.1, -15]}
      frustumCulled={false}
      visible={false}
    />
  );
}
