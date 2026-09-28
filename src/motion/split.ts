import { BEAT, DUR, EASE, EIGHTH } from "./tokens";

// Kinetic headline + beat-gridded hero entrance.
// Slots land on the 120 BPM grid: badge 0, headline 250, copy/CTA 500,
// stage dolly 500 (parallel, cinematic), cue 1250.

const SLOT_DELAY: Record<string, number> = {
  "0": 0,
  "1": EIGHTH / 2, // 125ms — headline starts just before the beat, lands on it
  "2": BEAT / 2, // 250ms — lede + actions
  "3": BEAT / 2, // 250ms — stage dolly runs parallel (camera move, 1200ms)
  "4": BEAT * 2 + EIGHTH, // 1250ms — scroll cue last
};

const CHAR_STAGGER = 18;

export function splitHeroTitle(root: ParentNode = document): () => void {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return () => undefined;

  const cleanups: (() => void)[] = [];
  const rafIds: number[] = [];
  const timeouts: number[] = [];

  // 1. Split headline into chars (primary layer)
  const title = root.querySelector<HTMLElement>("[data-split]");
  const chars: HTMLElement[] = [];
  if (title) {
    const slot = title.dataset.heroSlot ?? "1";
    const delay = SLOT_DELAY[slot] ?? 0;
    const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    while (walker.nextNode()) nodes.push(walker.currentNode as Text);
    for (const node of nodes) {
      const frag = document.createDocumentFragment();
      for (const ch of node.textContent ?? "") {
        if (ch === " " || ch === "\n") {
          frag.appendChild(document.createTextNode(ch));
          continue;
        }
        const s = document.createElement("span");
        s.className = "char";
        s.textContent = ch;
        s.style.opacity = "0";
        s.style.transform = "translateY(110%)";
        frag.appendChild(s);
        chars.push(s);
      }
      node.parentNode?.replaceChild(frag, node);
    }

    timeouts.push(
      window.setTimeout(() => {
        const start = performance.now();
        const tick = (now: number) => {
          const t = (now - start) / DUR.hero;
          chars.forEach((s, i) => {
            const local = Math.min(1, Math.max(0, t * 1.25 - i * (CHAR_STAGGER / DUR.hero)));
            // Ease-out cubic: fast start, gentle settle into rest
            const eased = 1 - Math.pow(1 - local, 3);
            s.style.opacity = String(eased);
            s.style.transform = `translateY(${(1 - eased) * 110}%)`;
          });
          if (t < 1.5) rafIds.push(requestAnimationFrame(tick));
        };
        rafIds.push(requestAnimationFrame(tick));
      }, delay),
    );
  }

  // 2. Slot siblings: setup → action → resolution (secondary layer)
  const slots = Array.from(
    root.querySelectorAll<HTMLElement>("[data-hero-slot]"),
  ).filter((el) => !el.hasAttribute("data-split"));
  for (const el of slots) {
    const delay = SLOT_DELAY[el.dataset.heroSlot ?? ""] ?? 0;
    const isStage = el.dataset.heroSlot === "3";
    el.style.opacity = "0";
    el.style.transform = isStage ? "translateY(48px) scale(0.97)" : "translateY(20px)";
    el.style.transition = "none";
    timeouts.push(
      window.setTimeout(() => {
        el.style.transition = isStage
          ? `opacity 1200ms ${EASE.enter}, transform 1200ms ${EASE.enter}`
          : `opacity ${DUR.section}ms ${EASE.enter}, transform ${DUR.section}ms ${EASE.enter}`;
        rafIds.push(
          requestAnimationFrame(() =>
            requestAnimationFrame(() => {
              el.style.opacity = "1";
              el.style.transform = isStage ? "translateY(0) scale(1)" : "translateY(0)";
            }),
          ),
        );
      }, delay),
    );
  }

  return () => {
    rafIds.forEach((id) => cancelAnimationFrame(id));
    timeouts.forEach((id) => window.clearTimeout(id));
    cleanups.forEach((fn) => fn());
  };
}
