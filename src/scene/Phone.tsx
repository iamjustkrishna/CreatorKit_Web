import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { scroll } from "../core/scroll";
import { story } from "../core/story";
import { frame } from "./frame";
import { phoneState, SCREENS, setScreenNow, showScreen } from "./phoneState";
import { glowFragment, glowVertex, screenFragment, screenVertex } from "./shaders";

const BODY_W = 1.14;
const BODY_H = 2.44;
const BODY_D = 0.12;
const SCREEN_W = 1.07;
const SCREEN_H = 2.37;

// The phone holds one fixed pose per section, sitting exactly on its DOM box.
// It does not react to the clock or to scroll speed. The one exception is a
// deliberate, heavily smoothed tilt toward the pointer while the pointer is
// over the phone — it eases in and out, and calms down while the page scrolls.
const TILT_YAW = 0.34;
const TILT_PITCH = 0.2;
const POSE = {
  hero: { yaw: -0.2, pitch: 0.05 },
  show: { yaw: 0.16, pitch: 0.05 },
} as const;

const smooth = (a: number, b: number, x: number) => {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

export default function Phone() {
  const textures = useTexture(SCREENS.map((s) => s.src));
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const glow = useRef<THREE.Mesh>(null);
  const lastMode = useRef<string | null>(null);

  useLayoutEffect(() => {
    for (const t of textures) {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      t.generateMipmaps = true;
      t.minFilter = THREE.LinearMipmapLinearFilter;
      t.needsUpdate = true;
    }
  }, [textures]);

  const screenUniforms = useMemo(
    () => ({
      uA: { value: textures[0] },
      uB: { value: textures[0] },
      uMix: { value: 1 },
      uAspect: { value: SCREEN_W / SCREEN_H },
      uAspectA: { value: SCREENS[0].aspect },
      uAspectB: { value: SCREENS[0].aspect },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const glowUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(SCREENS[0].accent) },
      uIntensity: { value: 0.62 },
    }),
    [],
  );
  const screenMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: screenVertex,
        fragmentShader: screenFragment,
        uniforms: screenUniforms,
        transparent: true,
      }),
    [screenUniforms],
  );
  const glowMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: glowVertex,
        fragmentShader: glowFragment,
        uniforms: glowUniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [glowUniforms],
  );
  const accentFrom = useMemo(() => new THREE.Color(), []);
  const accentTo = useMemo(() => new THREE.Color(), []);
  const lastShown = useRef({ from: -1, to: -1, mix: -1 });
  // Smoothed hover state: how much the tilt applies, and where on the phone.
  const hover = useRef({ w: 0, x: 0, y: 0 });

  useFrame((_state, delta) => {
    const g = root.current;
    const b = body.current;
    if (!g || !b) return;
    const ph = frame.phone;

    // A single, one-off entrance after the particles begin converging.
    const intro = smooth(0.32, 0.92, story.intro);
    g.visible = ph.mode !== null && intro > 0.01;
    if (!g.visible) {
      lastMode.current = null;
      return;
    }
    const mode = ph.mode as "hero" | "show";

    // Hero always shows the first screen; the showcase shows the chosen tab.
    // Switching sections happens while the phone is off-screen, so it is instant.
    if (lastMode.current !== mode) {
      lastMode.current = mode;
      setScreenNow(mode === "show" ? frame.tab : 0);
    } else if (mode === "show" && phoneState.to !== frame.tab) {
      showScreen(frame.tab);
    }

    // Hover: is a mouse pointer over the phone right now?
    const dt = Math.min(delta, 0.05);
    const p = frame.pointer;
    const halfW = (ph.h * (BODY_W / BODY_H)) / 2;
    const halfH = ph.h / 2;
    const dx = p.ndcX * (frame.worldW / 2) - ph.x;
    const dy = p.ndcY * (frame.worldH / 2) - ph.y;
    const over = p.fine && p.inside && Math.abs(dx) < halfW * 1.1 && Math.abs(dy) < halfH * 1.04;
    // Weight eases in quickly and out slowly, and drops away while scrolling so
    // the phone never wobbles under a stationary cursor as the page moves.
    const want = over ? 1 - THREE.MathUtils.clamp(scroll.speed * 3, 0, 1) : 0;
    const h = hover.current;
    h.w += (want - h.w) * (1 - Math.exp(-dt * (want > h.w ? 5 : 2.6)));
    if (over) {
      const k = 1 - Math.exp(-dt * 5);
      h.x += (THREE.MathUtils.clamp(dx / halfW, -1, 1) - h.x) * k;
      h.y += (THREE.MathUtils.clamp(dy / halfH, -1, 1) - h.y) * k;
    }

    g.scale.setScalar((ph.h / BODY_H) * (0.94 + 0.06 * intro) * (1 + h.w * 0.018));
    g.position.set(ph.x, ph.y, h.w * 0.12);
    b.rotation.set(
      POSE[mode].pitch - h.w * h.y * TILT_PITCH,
      POSE[mode].yaw + h.w * h.x * TILT_YAW,
      -h.w * h.x * 0.03,
    );

    // Only touch the uniforms when something actually changed.
    const shown = lastShown.current;
    if (shown.from !== phoneState.from || shown.to !== phoneState.to || shown.mix !== phoneState.mix) {
      shown.from = phoneState.from;
      shown.to = phoneState.to;
      shown.mix = phoneState.mix;
      const su = screenUniforms;
      su.uA.value = textures[phoneState.from];
      su.uB.value = textures[phoneState.to];
      su.uAspectA.value = SCREENS[phoneState.from].aspect;
      su.uAspectB.value = SCREENS[phoneState.to].aspect;
      su.uMix.value = phoneState.mix;
      accentFrom.set(SCREENS[phoneState.from].accent);
      accentTo.set(SCREENS[phoneState.to].accent);
      glowUniforms.uColor.value.copy(accentFrom).lerp(accentTo, phoneState.mix);
    }
    glowUniforms.uIntensity.value = 0.62 * intro;
    if (glow.current) glow.current.scale.setScalar(4.6);
  });

  return (
    <group ref={root} visible={false}>
      <mesh ref={glow} position={[0, 0, -0.5]} renderOrder={-1} material={glowMaterial}>
        <planeGeometry args={[1, 1]} />
      </mesh>
      <group ref={body}>
        <RoundedBox args={[BODY_W, BODY_H, BODY_D]} radius={0.13} smoothness={5} creaseAngle={0.4}>
          <meshPhysicalMaterial
            color="#0f0b18"
            metalness={0.92}
            roughness={0.3}
            clearcoat={0.7}
            clearcoatRoughness={0.25}
            envMapIntensity={1.4}
          />
        </RoundedBox>
        {/* side buttons */}
        <mesh position={[BODY_W / 2 + 0.006, 0.42, 0]}>
          <boxGeometry args={[0.02, 0.34, 0.05]} />
          <meshStandardMaterial color="#1a1326" metalness={0.9} roughness={0.35} />
        </mesh>
        <mesh position={[BODY_W / 2 + 0.006, -0.05, 0]}>
          <boxGeometry args={[0.02, 0.2, 0.05]} />
          <meshStandardMaterial color="#1a1326" metalness={0.9} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0, BODY_D / 2 + 0.003]} material={screenMaterial}>
          <planeGeometry args={[SCREEN_W, SCREEN_H]} />
        </mesh>
      </group>
    </group>
  );
}
