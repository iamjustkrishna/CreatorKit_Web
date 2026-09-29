// The page as a timeline. Maps the smoothed scroll position to:
//   - morph:   which shape the particle "signal" is (0..7, continuous)
//   - chapter: which part of the score / HUD we are in
//   - step:    the active workflow step
// Keys are rebuilt from real layout on every ScrollTrigger refresh, so the
// mapping survives resizes, font loads and pin spacers.

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CHAPTERS, type Chapter } from "./chapters";
import { scroll } from "./scroll";

export const story = {
  /** Particle target index, 0..7 (continuous). */
  morph: 0,
  chapter: "hero" as Chapter,
  chapterIndex: 0,
  /** Active workflow step, 0..3. */
  step: 0,
  /** 0..1 — spectrogram terrain rising under the closing CTA. */
  terrain: 0,
  /** 0..1 — the privacy moment (scene quiets down). */
  calm: 0,
  /** 0..1 — the Enter animation (points fly in from dust). */
  intro: 0,
  /** 0..1 progress through the pinned workflow. */
  workflow: 0,
  /** 0..1 overall page progress. */
  progress: 0,
};

type Key = [number, number];
let morphKeys: Key[] = [
  [0, 0],
  [1, 0],
];
let starts: Record<Chapter, number> = {
  hero: -Infinity,
  story: Infinity,
  workflow: Infinity,
  showcase: Infinity,
  privacy: Infinity,
  cta: Infinity,
};
let wfRange: [number, number] = [0, 1];

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

function interp(keys: Key[], y: number): number {
  if (y <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [x1, v1] = keys[i];
    if (y <= x1) {
      const [x0, v0] = keys[i - 1];
      const span = x1 - x0;
      return span <= 0 ? v1 : v0 + ((y - x0) / span) * (v1 - v0);
    }
  }
  return keys[keys.length - 1][1];
}

function docTop(selector: string): number | null {
  const el = document.querySelector<HTMLElement>(selector);
  if (!el) return null;
  return el.getBoundingClientRect().top + window.scrollY;
}

/** Recompute all scroll keys from the current layout. */
export function buildStory() {
  const H = window.innerHeight;
  const storyTop = docTop("#story") ?? H;
  const trigger = ScrollTrigger.getById("workflow");
  // Desktop pins with ScrollTrigger; touch uses a CSS-sticky inner panel inside
  // a tall section, so the range is the section height minus the panel.
  const wfEl = document.querySelector<HTMLElement>("#workflow");
  const wfInner = wfEl?.querySelector<HTMLElement>(".wf-inner");
  const wfTop = docTop("#workflow") ?? storyTop + H;
  const wfStart = trigger ? trigger.start : wfTop;
  const wfEnd = trigger
    ? trigger.end
    : wfEl && wfInner && wfEl.offsetHeight > wfInner.offsetHeight + 40
      ? wfTop + (wfEl.offsetHeight - wfInner.offsetHeight)
      : wfStart + 3 * H;
  const L = Math.max(1, wfEnd - wfStart);
  const showTop = docTop("#showcase") ?? wfEnd + H;
  const privTop = docTop("#privacy") ?? showTop + 1.4 * H;
  const ctaTop = docTop("#cta") ?? privTop + 1.2 * H;
  wfRange = [wfStart, wfEnd];

  // Plateaus at integer values give each shape time to read before the next
  // morph begins.
  const keys: Key[] = [
    [0, 0],
    [wfStart - 0.95 * H, 0],
    [wfStart - 0.1 * H, 1],
    [wfStart + 0.06 * L, 1],
    [wfStart + 0.2 * L, 1],
    [wfStart + 0.32 * L, 2],
    [wfStart + 0.46 * L, 2],
    [wfStart + 0.58 * L, 3],
    [wfStart + 0.7 * L, 3],
    [wfStart + 0.82 * L, 4],
    [wfEnd, 4],
    [wfEnd + 0.8 * H, 5],
    [privTop - 1.05 * H, 5],
    [privTop - 0.4 * H, 6],
    [ctaTop - 1.1 * H, 6],
    [ctaTop - 0.4 * H, 7],
    [ctaTop + 10 * H, 7],
  ];
  // Guarantee strictly ascending x on short/odd layouts.
  keys.sort((a, b) => a[0] - b[0]);
  for (let i = 1; i < keys.length; i++) {
    if (keys[i][0] <= keys[i - 1][0]) keys[i][0] = keys[i - 1][0] + 0.001;
  }
  morphKeys = keys;

  starts = {
    hero: -Infinity,
    story: storyTop - 0.55 * H,
    workflow: wfStart - 0.35 * H,
    showcase: showTop - 0.6 * H,
    privacy: privTop - 0.6 * H,
    cta: ctaTop - 0.7 * H,
  };
}

/** Advance derived state from the current scroll position. Once per frame. */
export function updateStory() {
  const y = scroll.y;
  story.morph = interp(morphKeys, y);
  story.workflow = clamp01((y - wfRange[0]) / (wfRange[1] - wfRange[0]));
  story.step = Math.min(3, Math.max(0, Math.round(story.morph) - 1));
  const t = clamp01(story.morph - 6);
  story.terrain = t * t * (3 - 2 * t);
  story.calm = 1 - clamp01(Math.abs(story.morph - 6) / 0.9);
  story.progress = scroll.limit > 0 ? clamp01(y / scroll.limit) : 0;

  let index = 0;
  for (let i = 0; i < CHAPTERS.length; i++) {
    if (y >= starts[CHAPTERS[i]]) index = i;
  }
  if (index !== story.chapterIndex) {
    story.chapterIndex = index;
    story.chapter = CHAPTERS[index];
  }
}

export function initStory(): () => void {
  const rebuild = () => buildStory();
  ScrollTrigger.addEventListener("refresh", rebuild);
  window.addEventListener("resize", rebuild);
  buildStory();
  return () => {
    ScrollTrigger.removeEventListener("refresh", rebuild);
    window.removeEventListener("resize", rebuild);
  };
}
