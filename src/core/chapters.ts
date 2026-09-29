// The page's chapters, in order. Used by the story timeline and the HUD.

export type Chapter =
  | "hero"
  | "story"
  | "workflow"
  | "showcase"
  | "privacy"
  | "cta";

export const CHAPTERS: Chapter[] = [
  "hero",
  "story",
  "workflow",
  "showcase",
  "privacy",
  "cta",
];
