import { initFloat, initTilt } from "./tilt";
import { splitHeroTitle } from "./split";

export function initHeroMotion(): () => void {
  const cleanups = [splitHeroTitle(), initTilt(), initFloat()];

  // Magnetic buttons with anticipation dip: press 80ms ease-exit to
  // scale 0.95, release pops back on the branded curve.
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const magnetCleanups: (() => void)[] = [];
  if (!reduced) {
    document.querySelectorAll<HTMLElement>(".magnetic, .crescendo-btn").forEach((el) => {
      const target = el as HTMLElement;
      const onMove = (e: PointerEvent) => {
        const r = target.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        target.style.transform = `translate(${(dx * 0.08).toFixed(1)}px, ${(dy * 0.08).toFixed(1)}px)`;
      };
      const onDown = () => {
        target.style.transition = "transform 80ms cubic-bezier(0.7, 0, 0.84, 0)";
        target.style.transform = "scale(0.95)";
      };
      const onUp = () => {
        target.style.transition =
          "transform 450ms cubic-bezier(0.34, 1.56, 0.64, 1)";
        target.style.transform = "";
      };
      const onLeave = () => {
        if (target.style.transform.startsWith("translate")) {
          target.style.transition =
            "transform 300ms cubic-bezier(0.16, 1, 0.3, 1)";
          target.style.transform = "";
        }
      };
      target.addEventListener("pointermove", onMove);
      target.addEventListener("pointerdown", onDown);
      target.addEventListener("pointerup", onUp);
      target.addEventListener("pointerleave", onLeave);
      magnetCleanups.push(() => {
        target.removeEventListener("pointermove", onMove);
        target.removeEventListener("pointerdown", onDown);
        target.removeEventListener("pointerup", onUp);
        target.removeEventListener("pointerleave", onLeave);
      });
    });
  }

  return () => {
    cleanups.forEach((fn) => fn());
    magnetCleanups.forEach((fn) => fn());
  };
}
