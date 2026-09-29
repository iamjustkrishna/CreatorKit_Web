import { useEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "../core/scroll";

/** A trailing ring for fine pointers. The system cursor stays visible. */
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine || prefersReducedMotion()) return;
    const ringEl = ring.current;
    const dotEl = dot.current;
    if (!ringEl || !dotEl) return;

    const rx = gsap.quickTo(ringEl, "x", { duration: 0.5, ease: "power3" });
    const ry = gsap.quickTo(ringEl, "y", { duration: 0.5, ease: "power3" });
    const dx = gsap.quickTo(dotEl, "x", { duration: 0.08, ease: "power2" });
    const dy = gsap.quickTo(dotEl, "y", { duration: 0.08, ease: "power2" });
    const root = document.documentElement;

    const onMove = (e: PointerEvent) => {
      root.classList.add("cursor-on");
      rx(e.clientX);
      ry(e.clientY);
      dx(e.clientX);
      dy(e.clientY);
    };
    const onOver = (e: PointerEvent) => {
      const hit = (e.target as HTMLElement | null)?.closest(
        "a, button, [role='tab'], [data-hover]",
      );
      ringEl.classList.toggle("is-hover", !!hit);
    };
    const onDown = () => ringEl.classList.add("is-down");
    const onUp = () => ringEl.classList.remove("is-down");
    const onLeave = () => root.classList.remove("cursor-on");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      root.classList.remove("cursor-on");
    };
  }, []);

  return (
    <div className="cursor" aria-hidden="true">
      <div className="cursor-ring" ref={ring} />
      <div className="cursor-dot" ref={dot} />
    </div>
  );
}
