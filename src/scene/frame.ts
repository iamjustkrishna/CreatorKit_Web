// Per-frame shared state between the DOM and the WebGL scene.
//
// The canvas is fixed behind the page, so 3D objects "dock" to invisible DOM
// anchors ([data-anchor="…"]). Every frame we read the anchors' rects, convert
// them to world units and hand the scene where to be. Layout stays in CSS —
// responsive for free — and the 3D always lines up with the text.

import { story } from "../core/story";

export type Xf = { x: number; y: number; s: number };

const NOMINAL_PHONE_H = 2.44;

const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const degToRad = (d: number) => (d * Math.PI) / 180;

export const frame = {
  camZ: 8,
  fov: 42,
  viewW: 1440,
  viewH: 900,
  worldW: 10.9,
  worldH: 6.14,
  /** Scale that keeps shapes inside narrow viewports. */
  fit: 1,
  pointer: {
    ndcX: 0,
    ndcY: 0,
    /** Low-pass filtered pointer: decorative effects use this, never the raw one. */
    /** True while the pointer is over the page. */
    inside: false,
    smoothX: 0,
    smoothY: 0,
    worldX: 0,
    worldY: 0,
    strength: 0,
    fine: true,
  },
  wave: { x: 0, y: 0, t: -100, active: 0 },
  phone: { mode: null as null | "hero" | "show", x: 0, y: 0, h: NOMINAL_PHONE_H, enter: 0 },
  /** One transform per particle target. */
  xf: Array.from({ length: 8 }, () => ({ x: 0, y: 0, s: 1 })) as Xf[],
  /** xf blended by the current morph value. */
  blend: { x: 0, y: 0, s: 1 } as Xf,
  /** Showcase tab (0..2) currently shown on the phone. */
  tab: 0,
  time: 0,
};

const anchors = new Map<string, HTMLElement | null>();
function anchor(id: string): HTMLElement | null {
  const cached = anchors.get(id);
  if (cached && cached.isConnected) return cached;
  const el = document.querySelector<HTMLElement>(`[data-anchor="${id}"]`);
  anchors.set(id, el);
  return el;
}

type Rect = { cx: number; cy: number; w: number; h: number; vis: number };

function rectOf(id: string, k: number, W: number, H: number): Rect | null {
  const el = anchor(id);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (r.width === 0 && r.height === 0) return null;
  const visible = Math.min(r.bottom, H) - Math.max(r.top, 0);
  return {
    cx: (r.left + r.width / 2 - W / 2) * k,
    cy: -(r.top + r.height / 2 - H / 2) * k,
    w: r.width * k,
    h: r.height * k,
    vis: clamp(visible / Math.max(1, r.height), 0, 1),
  };
}

const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

/**
 * W and H are the CANVAS size, not the window: the canvas is fixed to the
 * large viewport so it never resizes when a phone's address bar collapses.
 */
export function updateFrame(fovDeg: number, W: number, H: number) {
  frame.viewW = W;
  frame.viewH = H;
  frame.fov = fovDeg;
  frame.worldH = 2 * frame.camZ * Math.tan(degToRad(fovDeg) / 2);
  frame.worldW = (frame.worldH * W) / H;
  frame.fit = clamp(frame.worldW / 10.9, 0.55, 1.15);
  const k = frame.worldH / H;

  const p = frame.pointer;
  p.smoothX += (p.ndcX - p.smoothX) * 0.07;
  p.smoothY += (p.ndcY - p.smoothY) * 0.07;
  p.worldX = p.smoothX * (frame.worldW / 2);
  p.worldY = p.smoothY * (frame.worldH / 2);

  const hero = rectOf("hero-phone", k, W, H);
  const show = rectOf("show-phone", k, W, H);
  const wf = rectOf("wf-signal", k, W, H);
  const priv = rectOf("privacy-orb", k, W, H);
  const cta = rectOf("cta-ring", k, W, H);

  const xf = frame.xf;
  xf[0] = { x: hero?.cx ?? 0, y: hero?.cy ?? 0, s: frame.fit };
  const wfScale = wf
    ? clamp(Math.min(wf.w / 9.8, wf.h / 4.6), 0.16, 1.2)
    : frame.fit * 0.7;
  for (let i = 1; i <= 4; i++) xf[i] = { x: wf?.cx ?? 0, y: wf?.cy ?? 0, s: wfScale };
  // Halo radius ≈ 0.6× the phone height so the rings hug the device.
  // Text and library are smaller shapes than the waveform; let them fill.
  xf[3].s *= 1.18;
  xf[4].s *= 1.16;
  xf[5] = {
    x: show?.cx ?? 0,
    y: show?.cy ?? 0,
    s: show ? show.h / 4.5 : frame.fit,
  };
  xf[6] = { x: priv?.cx ?? 0, y: priv?.cy ?? 0, s: priv ? priv.w / 5.7 : frame.fit * 0.7 };
  xf[7] = { x: cta?.cx ?? 0, y: cta?.cy ?? 0, s: cta ? cta.w / 7.6 : frame.fit * 0.8 };

  const m = clamp(story.morph, 0, 7);
  const i = Math.min(Math.floor(m), 6);
  const f = smooth(0, 1, m - i);
  const a = xf[i];
  const b = xf[i + 1];
  frame.blend.x = a.x + (b.x - a.x) * f;
  frame.blend.y = a.y + (b.y - a.y) * f;
  frame.blend.s = a.s + (b.s - a.s) * f;

  // Phone docks to whichever anchor is more on-screen.
  const ph = frame.phone;
  const heroVis = hero?.vis ?? 0;
  const showVis = show?.vis ?? 0;
  if (hero && heroVis >= showVis && heroVis > 0.02) {
    ph.mode = "hero";
    ph.x = hero.cx;
    ph.y = hero.cy;
    ph.h = hero.h;
    ph.enter = smooth(0.04, 0.7, heroVis);
  } else if (show && showVis > 0.02) {
    ph.mode = "show";
    ph.x = show.cx;
    ph.y = show.cy;
    ph.h = show.h;
    ph.enter = smooth(0.04, 0.7, showVis);
  } else {
    ph.mode = null;
    ph.enter = 0;
  }
}

/** Global pointer tracking. Returns a cleanup. */
export function initPointer(): () => void {
  const fine = window.matchMedia("(pointer: fine)").matches;
  frame.pointer.fine = fine;
  // Touch is for scrolling. Letting a finger push particles around while the
  // page moves under it reads as jitter, so only mouse/pen input is tracked.
  const onMove = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    const p = frame.pointer;
    p.ndcX = (e.clientX / window.innerWidth) * 2 - 1;
    p.ndcY = -((e.clientY / window.innerHeight) * 2 - 1);
    p.strength = 1;
    p.inside = true;
  };
  const onLeave = () => {
    frame.pointer.strength = 0;
    frame.pointer.inside = false;
  };
  const onDown = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    onMove(e);
    frame.wave.x = frame.pointer.ndcX * (frame.worldW / 2);
    frame.wave.y = frame.pointer.ndcY * (frame.worldH / 2);
    frame.wave.t = frame.time;
    frame.wave.active = 1;
  };
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", onDown, { passive: true });
  document.addEventListener("pointerleave", onLeave);
  return () => {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerdown", onDown);
    document.removeEventListener("pointerleave", onLeave);
  };
}
