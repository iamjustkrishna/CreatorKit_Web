// Which screenshot the 3D phone shows, and the crossfade between two of them.
// Lives outside React so GSAP can tween it and the render loop can read it.

import gsap from "gsap";
import { frame } from "./frame";

export const SCREENS = [
  { src: "/assets/screenshot-extractor.png", aspect: 1080 / 2285, accent: "#a855f7" },
  { src: "/assets/screenshot-transcriber.png", aspect: 1080 / 2400, accent: "#22d3ee" },
  { src: "/assets/screenshot-library.png", aspect: 1080 / 2400, accent: "#fb923c" },
] as const;

export const phoneState = {
  from: 0,
  to: 0,
  /** 0 → showing `from`, 1 → showing `to`. */
  mix: 1,
};

/** Show a screen immediately, with no transition (used on mode changes). */
export function setScreenNow(index: number) {
  gsap.killTweensOf(phoneState);
  phoneState.from = index;
  phoneState.to = index;
  phoneState.mix = 1;
}

/** Crossfade to a screen. Only ever triggered by the visitor picking a tab. */
export function showScreen(index: number) {
  if (index === phoneState.to) return;
  // Mid-fade? Continue from whichever screen is currently dominant.
  phoneState.from = phoneState.mix > 0.5 ? phoneState.to : phoneState.from;
  phoneState.to = index;
  phoneState.mix = 0;
  gsap.killTweensOf(phoneState);
  gsap.to(phoneState, { mix: 1, duration: 0.7, ease: "power2.inOut" });
}

/** User picked a tab: point the phone at it and crossfade. */
export function selectTab(index: number) {
  frame.tab = index;
  showScreen(index);
}
