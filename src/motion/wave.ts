import { getAudioManager } from "../audio/loop";

// Audio-reactive CTA wave. Idle sine when muted, FFT-driven when sound on.
// Throttled to ~30Hz, transform-only (scaleY).

export function initWave(): () => void {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const container = document.querySelector<HTMLElement>("[data-cta-wave]");
  if (!container) return () => undefined;
  const bars = Array.from(
    container.querySelectorAll<HTMLElement>("[data-wave-bar]"),
  );
  if (bars.length === 0) return () => undefined;
  if (reduced) return () => undefined;

  let raf = 0;
  let last = 0;
  const analyserData = new Uint8Array(32);
  const baseHeights = bars.map((b) => {
    const raw = b.style.getPropertyValue("--bar") || "40%";
    const n = parseFloat(raw);
    return Number.isFinite(n) ? n : 40;
  });

  const tick = (now: number) => {
    raf = requestAnimationFrame(tick);
    if (now - last < 33) return;
    last = now;
    const t = now / 1000;

    let live: Uint8Array | null = null;
    try {
      const mgr = getAudioManager();
      if (mgr.isEnabled()) {
        const an = mgr.getAnalyser();
        if (an) {
          an.getByteFrequencyData(analyserData);
          live = analyserData;
        }
      }
    } catch {
      live = null;
    }

    bars.forEach((bar, i) => {
      let h: number;
      if (live) {
        const bin = live[i % live.length] / 255;
        h = 18 + bin * 70 + Math.sin(t * 2 + i * 0.5) * 6;
      } else {
        h = baseHeights[i] + Math.sin(t * 1.2 + i * 0.55) * 10;
      }
      bar.style.transform = `scaleY(${(h / 50).toFixed(2)})`;
      bar.style.transformOrigin = "center";
    });
  };
  raf = requestAnimationFrame(tick);

  return () => cancelAnimationFrame(raf);
}
