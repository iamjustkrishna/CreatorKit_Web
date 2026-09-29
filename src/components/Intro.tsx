import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { getBoot, setBoot, useBoot } from "../core/boot";
import { startExperience } from "../core/experience";

const MIN_MS = 1200;
const GIVE_UP_MS = 7000;

/**
 * The loader. It hides the moment the 3D scene compiles its shaders and loads
 * textures, then the two halves part on their own and the hero plays.
 */
export default function Intro() {
  const boot = useBoot();
  const content = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLDivElement>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const seam = useRef<HTMLDivElement>(null);
  const opened = useRef(false);
  const [visible] = useState(() => getBoot().gateOpen);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);

  // Progress: the scene is binary, so a creeping line keeps things moving
  // while shaders compile. Opens once the scene is ready (and not too fast).
  useEffect(() => {
    if (!visible) return;
    const t0 = performance.now();
    let raf = 0;
    const open = () => {
      if (opened.current) return;
      opened.current = true;
      setProgress(1);
      const tl = gsap.timeline({
        defaults: { ease: "expo.inOut" },
        onComplete: () => {
          setBoot({ gateOpen: false });
          setDone(true);
        },
      });
      tl.to(content.current, { opacity: 0, scale: 0.94, duration: 0.4, ease: "power2.in" }, 0)
        .to(seam.current, { scaleX: 1, opacity: 1, duration: 0.35, ease: "power2.out" }, 0.05)
        .add(() => startExperience(), 0.3)
        .to(top.current, { yPercent: -101, duration: 1.05 }, 0.3)
        .to(bottom.current, { yPercent: 101, duration: 1.05 }, 0.3)
        .to(seam.current, { opacity: 0, duration: 0.3, ease: "power2.in" }, 0.55);
    };
    const tick = () => {
      const t = performance.now() - t0;
      if (!opened.current) setProgress(getBoot().sceneReady ? 0.96 : Math.min(0.9, 1 - Math.exp(-t / 1800)));
      if ((t > MIN_MS && getBoot().sceneReady) || t > GIVE_UP_MS) {
        open();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible]);

  // Visitors who skip the loader (same-session reload, reduced motion) start
  // as soon as the scene is ready.
  useEffect(() => {
    if (boot.gateOpen || boot.entered) return;
    if (boot.sceneReady) startExperience();
  }, [boot.gateOpen, boot.sceneReady, boot.entered]);

  if (!visible || done) return null;

  const pct = Math.round(progress * 100);

  return (
    <div className="intro" role="status" aria-live="polite" aria-label="Loading CreatorKit">
      <div className="intro-half intro-half--top" ref={top} />
      <div className="intro-half intro-half--bottom" ref={bottom} />
      <div className="intro-seam" ref={seam} aria-hidden="true" />

      <div className="intro-content" ref={content}>
        <div className="intro-mark" aria-hidden="true">
          <img src="/assets/creator-kit-icon.png" alt="" width="84" height="84" />
          <span className="intro-rings">
            <i />
            <i />
            <i />
          </span>
        </div>
        <p className="intro-title">CreatorKit</p>
        <div className="intro-meter" aria-hidden="true">
          <div className="intro-meter-fill" style={{ transform: `scaleX(${progress})` }} />
          <span>{String(pct).padStart(2, "0")}%</span>
        </div>
      </div>
    </div>
  );
}
