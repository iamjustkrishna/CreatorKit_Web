// Motion system — concrete numbers from animation-principles.
// Every duration/easing in the site comes from here. Nothing ad-hoc.

/** Easing curves by action type. Linear is for loops only. */
export const EASE = {
  /** Enter / appear: fast start, gentle settle */
  enter: "cubic-bezier(0.16, 1, 0.3, 1)",
  /** Exit / disappear: gentle start, fast end */
  exit: "cubic-bezier(0.7, 0, 0.84, 0)",
  /** Move / reposition on screen: symmetric */
  move: "cubic-bezier(0.65, 0, 0.35, 1)",
  /** Playful / branded: overshoot-and-settle reads as weight */
  pop: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  /** Continuous loops only (spinners, marquees, ambient drift) */
  linear: "linear",
} as const;

/** Durations scaled by distance/size. Small icon ≠ full panel. */
export const DUR = {
  /** Hover, toggle, tap feedback */
  micro: 150,
  /** Panel, tab, modal, region */
  ui: 300,
  /** Section reveal */
  section: 450,
  /** Hero / large element */
  hero: 650,
  /** Cinematic camera move */
  camera: 1200,
} as const;

/** Stagger offsets. Cap total group reveal ~700ms. */
export const STAGGER = {
  list: 60,
  grid: 30,
  cap: 700,
} as const;

/** 120 BPM soundtrack grid. Impact keyframes land on beats, not between. */
export const BEAT = 500;
export const EIGHTH = 250;

/** Anticipation dip before the main action (button press, card rise). */
export const ANTICIPATE_MS = 80;
/** Follow-through: trailing parts settle after the main body stops. */
export const FOLLOW_MS = 60;

/** Snappy spring for interactive, interruptible motion. */
export const SPRING = { stiffness: 300, damping: 30, mass: 1 } as const;

export function staggerDelay(index: number, step: number): number {
  return Math.min(index * step, STAGGER.cap);
}
