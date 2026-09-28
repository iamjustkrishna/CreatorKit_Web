import { initFloat, initTilt } from "./tilt";
import { splitHeroTitle } from "./split";

export function initHeroMotion(): () => void {
  const cleanups = [splitHeroTitle(), initTilt(), initFloat()];

  // Magnetic buttons
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const magnetCleanups: (() => void)[] = [];
  if (!reduced) {
    document.querySelectorAll<HTMLElement>(".magnetic").forEach((el) => {
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${(dx * 0.08).toFixed(1)}px, ${(dy * 0.08).toFixed(1)}px)`;
      };
      const onLeave = () => {
        el.style.transform = "";
      };
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      magnetCleanups.push(() => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      });
    });
  }

  return () => {
    cleanups.forEach((fn) => fn());
    magnetCleanups.forEach((fn) => fn());
  };
}
