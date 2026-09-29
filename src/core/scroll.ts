// Scroll engine: Lenis smooth scroll driven by GSAP's ticker (one loop, in
// order), with a native-scroll path for reduced-motion users. Exposes the
// smoothed scroll position and velocity for the scene and HUD.

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

// Phones resize the viewport every time the address bar slides in or out.
// Re-measuring pinned sections on each of those is a top source of scroll
// jumps, so ignore them.
ScrollTrigger.config({ ignoreMobileResize: true });

export const scroll = {
  /** Smoothed scroll position in px. */
  y: 0,
  /** Signed px/frame-ish velocity from Lenis (or native delta). */
  velocity: 0,
  /** Absolute normalised speed, 0..1. */
  speed: 0,
  limit: 1,
  lenis: null as Lenis | null,
};

export function isTouch(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

type FrameFn = (timeSec: number, deltaSec: number) => void;
const frameFns = new Set<FrameFn>();

/** Register work that must run once per frame, after scroll has advanced. */
export function onFrame(fn: FrameFn): () => void {
  frameFns.add(fn);
  return () => frameFns.delete(fn);
}

export function scrollToTarget(
  target: string | number | HTMLElement,
  opts: { offset?: number; duration?: number } = {},
) {
  const lenis = scroll.lenis;
  if (lenis) {
    lenis.scrollTo(target, {
      offset: opts.offset ?? 0,
      duration: opts.duration ?? 1.6,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
    });
    return;
  }
  const behavior: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth";
  const el =
    typeof target === "string"
      ? document.querySelector<HTMLElement>(target)
      : target instanceof HTMLElement
        ? target
        : null;
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY + (opts.offset ?? 0);
    window.scrollTo({ top: Math.max(0, top), behavior });
  } else if (typeof target === "number") {
    window.scrollTo({ top: target, behavior });
  }
}

export function initScroll(): () => void {
  const reduced = prefersReducedMotion();
  let lastNativeY = window.scrollY;
  scroll.y = window.scrollY;

  let lenis: Lenis | null = null;
  // No JS smooth-scroll on touch: native scrolling is already smooth, and a
  // JS-driven position would fight the compositor.
  if (!reduced && !isTouch()) {
    try {
      lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.95 });
      scroll.lenis = lenis;
      lenis.on("scroll", () => ScrollTrigger.update());
    } catch (err) {
      console.warn("[scroll] lenis unavailable, native scroll:", err);
      lenis = null;
      scroll.lenis = null;
    }
  }

  const tick = (time: number, delta: number) => {
    // GSAP ticker time is seconds; Lenis wants milliseconds.
    if (lenis) {
      lenis.raf(time * 1000);
      scroll.y = lenis.scroll;
      scroll.velocity = lenis.velocity;
      scroll.limit = lenis.limit;
    } else {
      const y = window.scrollY;
      scroll.velocity = (y - lastNativeY) * 0.5;
      lastNativeY = y;
      scroll.y = y;
      scroll.limit = document.documentElement.scrollHeight - window.innerHeight;
    }
    const target = Math.min(1, Math.abs(scroll.velocity) / 55);
    scroll.speed += (target - scroll.speed) * 0.14;
    const dt = Math.min(0.1, delta / 1000);
    frameFns.forEach((fn) => fn(time, dt));
  };
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  // In-page anchors travel through Lenis so the motion stays continuous.
  const onClick = (e: MouseEvent) => {
    const a = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    if (!id || id === "#") return;
    const el = document.querySelector<HTMLElement>(id);
    if (!el) return;
    e.preventDefault();
    if (id === "#top") scrollToTarget(0);
    else scrollToTarget(el, { offset: -8 });
    history.replaceState(null, "", id);
  };
  document.addEventListener("click", onClick);

  return () => {
    document.removeEventListener("click", onClick);
    gsap.ticker.remove(tick);
    lenis?.destroy();
    scroll.lenis = null;
    frameFns.clear();
  };
}
