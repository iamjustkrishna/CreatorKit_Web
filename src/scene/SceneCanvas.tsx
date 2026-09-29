import { Suspense, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import gsap from "gsap";
import * as THREE from "three";
import { isTouch } from "../core/scroll";
import { frame, initPointer, updateFrame } from "./frame";
import { detectTier, type TierConfig } from "./quality";
import Nebula from "./Nebula";
import Phone from "./Phone";
import Signal from "./Signal";
import Terrain from "./Terrain";

const BASE_FOV = 42;
const MAX_PIXELS = 2.6e6;

/** Largest pixel ratio that keeps the drawing buffer under the pixel budget. */
function pixelBudget(cfg: TierConfig): number {
  const cssPixels = Math.max(1, window.innerWidth * window.innerHeight);
  const fit = Math.sqrt(MAX_PIXELS / cssPixels);
  return Math.min(cfg.dpr[1], Math.max(0.6, fit));
}

/**
 * Runs first every frame: advances the render loop from GSAP's ticker (so
 * scroll and rendering stay in one ordered loop) and refreshes the
 * DOM-anchored layout. The camera never moves or zooms: a fov that follows
 * scroll speed made the whole scene (and the phone) breathe while scrolling.
 */
function Controller() {
  const advance = useThree((s) => s.advance);

  useEffect(() => {
    const drive = (time: number) => advance(time * 1000);
    gsap.ticker.add(drive);
    const cleanupPointer = initPointer();
    return () => {
      gsap.ticker.remove(drive);
      cleanupPointer();
    };
  }, [advance]);

  useFrame((state) => {
    frame.time = state.clock.elapsedTime;
    if (import.meta.env.DEV) (window as unknown as { __r3f?: unknown }).__r3f = state;
    const cam = state.camera as THREE.PerspectiveCamera;
    updateFrame(cam.fov, state.size.width, state.size.height);
  });
  return null;
}

/** Fires once the first frame with all textures has been drawn. */
function Ready({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    let raf = 0;
    let frames = 0;
    const tick = () => {
      if (++frames >= 3) {
        onReady();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onReady]);
  return null;
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <pointLight position={[3.5, 2.5, 4]} intensity={26} color="#a855f7" distance={16} />
      <pointLight position={[-3.5, -1.5, 3.5]} intensity={20} color="#22d3ee" distance={16} />
      <pointLight position={[0, 3, 2]} intensity={8} color="#ffffff" distance={12} />
    </>
  );
}

function Studio() {
  // A procedural studio: soft boxes reflected in the phone's frame. No network.
  return (
    <Environment resolution={128} frames={1} background={false}>
      <Lightformer form="rect" intensity={2.4} color="#a855f7" position={[-4, 3, 3]} scale={[7, 2, 1]} />
      <Lightformer form="rect" intensity={2} color="#22d3ee" position={[4, -2, 3]} scale={[6, 2, 1]} />
      <Lightformer form="rect" intensity={1.4} color="#ffffff" position={[0, 5, -2]} scale={[8, 1, 1]} />
      <Lightformer form="circle" intensity={1.2} color="#fb923c" position={[0, -4, 2]} scale={3} />
    </Environment>
  );
}

export default function SceneCanvas({ onReady }: { onReady?: () => void }) {
  const [cfg] = useState<TierConfig>(detectTier);
  // Pixel budget. Every fragment shader runs once per pixel, so a huge window
  // (or a zoomed-out browser, which is a huge window in CSS pixels) multiplies
  // the cost. Render at most ~2.6 MP, whatever the window size.
  const [budget, setBudget] = useState(() => pixelBudget(cfg));
  // If frames still drop, step resolution DOWN. It never steps back up: a
  // resolution that flips back and forth pops and reads as flicker.
  const [level, setLevel] = useState(0);
  useEffect(() => {
    let timer = 0;
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setBudget(pixelBudget(cfg)), 300);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", onResize);
    };
  }, [cfg]);
  const dpr = Math.max(0.75, budget * (1 - 0.18 * level));

  useEffect(() => {
    document.documentElement.dataset.tier = cfg.tier;
    return () => {
      delete document.documentElement.dataset.tier;
    };
  }, [cfg.tier]);

  return (
    <div className="scene-canvas" aria-hidden="true">
      <Canvas
        frameloop="never"
        dpr={[cfg.dpr[0], dpr]}
        camera={{ position: [0, 0, frame.camZ], fov: BASE_FOV, near: 0.1, far: 90 }}
        gl={{
          antialias: cfg.antialias,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.domElement.addEventListener("webglcontextlost", (e) => {
            e.preventDefault();
            document.documentElement.classList.remove("gl-on");
          });
          gl.domElement.addEventListener("webglcontextrestored", () => {
            document.documentElement.classList.add("gl-on");
          });
        }}
      >
        <PerformanceMonitor onDecline={() => setLevel((l) => Math.min(2, l + 1))} />
        <Controller />
        <Nebula cfg={cfg} />
        <Lights />
        <Suspense fallback={null}>
          {cfg.environment && <Studio />}
          <Signal cfg={cfg} />
          {/* On touch the DOM phone is used: it scrolls in perfect sync. */}
          {!isTouch() && <Phone />}
          <Terrain cfg={cfg} />
          <Ready
            onReady={() => {
              document.documentElement.classList.add("gl-on");
              onReady?.();
            }}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
