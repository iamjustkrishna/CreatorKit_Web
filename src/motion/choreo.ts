// Page choreography. One motion language, from the direction notes:
//   energy    kinetic × sharp — arrivals are fast, settles are long
//   easing    expo.out for arrivals, power3.inOut for moves, one pop for CTAs
//   unit      0.25 s: 0.5 / 1.0 / 1.25 s are its multiples
//   stagger   0.08 s for words, 0.06 s for lists
//   restraint privacy is stillness; phones get a calmer version of everything
//
// Everything created here lives in a gsap.context, so tearing down (or React
// StrictMode's double-mount) is a single revert.

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { workflow } from "../content";
import { isTouch, onFrame, prefersReducedMotion, scroll } from "../core/scroll";
import { story } from "../core/story";

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, DrawSVGPlugin);

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

let heroPlay: (() => void) | null = null;
let heroPending = false;
let heroPlayed = false;

/** Plays the hero entrance. Safe to call before or after initChoreo. */
export function playHeroIntro() {
  if (heroPlayed) return;
  if (heroPlay) heroPlay();
  else heroPending = true;
}

function revealNow() {
  document.documentElement.classList.remove("will-intro");
}

export function initChoreo(): () => void {
  const reduced = prefersReducedMotion();
  if (reduced) {
    revealNow();
    heroPlayed = true;
    return () => undefined;
  }

  let disposed = false;
  const splits: SplitText[] = [];
  const cleanups: (() => void)[] = [];
  const ctx = gsap.context(() => undefined);

  // Safety net: if anything stalls, never leave the hero hidden.
  const failSafe = window.setTimeout(revealNow, 12000);
  cleanups.push(() => window.clearTimeout(failSafe));

  const build = () => {
    if (disposed) return;
    ctx.add(() => {
      buildHero(splits);
      buildStory(splits);
      buildTypeReveals(splits);
      buildWorkflow(cleanups);
      buildMarquee(cleanups);
      buildPrivacy();
      buildMagnetic(cleanups);
      buildPressFeedback(cleanups);
      ScrollTrigger.refresh();
    });
  };

  const fontsReady = document.fonts?.ready ?? Promise.resolve();
  void fontsReady.then(build);
  // Layout shifts after late font/image loads move the pins.
  const onLoad = () => ScrollTrigger.refresh();
  window.addEventListener("load", onLoad);
  cleanups.push(() => window.removeEventListener("load", onLoad));

  return () => {
    disposed = true;
    cleanups.forEach((fn) => {
      try {
        fn();
      } catch {
        /* ignore teardown errors */
      }
    });
    splits.forEach((s) => s.revert());
    ctx.revert();
    heroPlay = null;
  };
}

// ---------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------
function buildHero(splits: SplitText[]) {
  const hero = document.querySelector<HTMLElement>(".hero");
  if (!hero) return;
  const lines = Array.from(hero.querySelectorAll<HTMLElement>(".hero-line"));
  const split = lines.map((line) =>
    SplitText.create(line, { type: "words", wordsClass: "hero-word" }),
  );
  splits.push(...split);
  const words = split.flatMap((s) => s.words);
  const ads = hero.querySelector<HTMLElement>(".ads-word");
  const rise = gsap.utils.toArray<HTMLElement>(hero.querySelectorAll('[data-hero="rise"]'));
  const chips = gsap.utils.toArray<HTMLElement>(hero.querySelectorAll('[data-hero="chip"]'));
  const fades = gsap.utils.toArray<HTMLElement>(hero.querySelectorAll('[data-hero="fade"]'));
  const stage = hero.querySelector<HTMLElement>('[data-hero="stage"]');
  const header = document.querySelector<HTMLElement>("[data-header]");
  const chrome = gsap.utils.toArray<HTMLElement>(".hud, .progress-line");

  // Take over from the CSS "will-intro" hiding without a single-frame flash.
  gsap.set(words, { yPercent: 118 });
  gsap.set(rise, { opacity: 0, y: 22 });
  gsap.set(chips, { opacity: 0, scale: 0.7 });
  gsap.set(fades, { opacity: 0 });
  if (stage) gsap.set(stage, { opacity: 0 });
  if (header) gsap.set(header, { opacity: 0, yPercent: -40 });
  gsap.set(chrome, { opacity: 0 });
  if (ads) gsap.set(ads, { "--strike": 0 });
  revealNow();

  heroPlay = () => {
    if (heroPlayed) return;
    heroPlayed = true;
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.to(header, { opacity: 1, yPercent: 0, duration: 1.0 }, 0.25)
      .to(rise[0] ?? [], { opacity: 1, y: 0, duration: 0.9 }, 0.3)
      .to(words, { yPercent: 0, duration: 1.15, stagger: 0.085 }, 0.2)
      .to(stage ?? [], { opacity: 1, duration: 0.9, ease: "power2.out" }, 0.4)
      .to(rise.slice(1), { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.75)
      .to(chips, { opacity: 1, scale: 1, duration: 0.7, stagger: 0.12, ease: "back.out(1.6)" }, 1.15)
      .to(fades, { opacity: 1, duration: 0.8, ease: "power2.out" }, 1.5)
      .to(chrome, { opacity: 1, duration: 0.9, ease: "power2.out" }, 1.0);
    if (ads) {
      tl.to(ads, { "--strike": 1, duration: 0.55, ease: "expo.out" }, 0.85).to(
        ads,
        { opacity: 0.4, duration: 0.7, ease: "power2.out" },
        0.95,
      );
    }
    tl.add(() => {
      gsap.set([...rise, ...chips, ...fades], { clearProps: "opacity,transform" });
    });
  };
  if (heroPending) heroPlay();
}

// ---------------------------------------------------------------------
// Story: words light up as you read
// ---------------------------------------------------------------------
function buildStory(splits: SplitText[]) {
  const text = document.querySelector<HTMLElement>("[data-scrub-words]");
  if (!text) return;
  const split = SplitText.create(text, { type: "words", wordsClass: "story-word" });
  splits.push(split);
  gsap.fromTo(
    split.words,
    { opacity: 0.13 },
    {
      opacity: 1,
      ease: "none",
      stagger: 0.12,
      scrollTrigger: { trigger: text, start: "top 80%", end: "bottom 46%", scrub: 0.6 },
    },
  );
}

// ---------------------------------------------------------------------
// Labels, titles and generic reveals
// ---------------------------------------------------------------------
function buildTypeReveals(splits: SplitText[]) {
  // Mono labels decode themselves.
  gsap.utils.toArray<HTMLElement>("[data-label]").forEach((el) => {
    const finalText = el.textContent ?? "";
    gsap.set(el, { opacity: 0 });
    ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () => {
        gsap.to(el, { opacity: 1, duration: 0.3 });
        gsap.to(el, {
          duration: 1.0,
          scrambleText: { text: finalText, chars: "01/·—+", speed: 0.7, revealDelay: 0.12 },
        });
      },
    });
  });

  // Section titles rise line by line out of a mask.
  gsap.utils.toArray<HTMLElement>("[data-title]").forEach((el) => {
    const split = SplitText.create(el, {
      type: "lines",
      linesClass: "title-line",
      mask: "lines",
    });
    splits.push(split);
    gsap.set(split.lines, { yPercent: 108 });
    ScrollTrigger.create({
      trigger: el,
      start: "top 86%",
      once: true,
      onEnter: () =>
        gsap.to(split.lines, { yPercent: 0, duration: 1.1, stagger: 0.1, ease: "expo.out" }),
    });
  });

  // The finale headline is the one place with a pop.
  const cta = document.querySelector<HTMLElement>("[data-cta-title]");
  if (cta) {
    const split = SplitText.create(cta, { type: "lines,words", linesClass: "title-line", mask: "lines" });
    splits.push(split);
    gsap.set(split.words, { yPercent: 112 });
    ScrollTrigger.create({
      trigger: cta,
      start: "top 82%",
      once: true,
      onEnter: () =>
        gsap.to(split.words, {
          yPercent: 0,
          duration: 1.2,
          stagger: 0.07,
          ease: "back.out(1.25)",
        }),
    });
  }

  // Generic fade-and-rise, batched so a group lands as one gesture.
  const items = gsap.utils.toArray<HTMLElement>("[data-reveal]");
  gsap.set(items, { opacity: 0, y: 28 });
  ScrollTrigger.batch(items, {
    start: "top 90%",
    once: true,
    onEnter: (els) =>
      gsap.to(els, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "expo.out", overwrite: true }),
  });

  // Privacy copy arrives slowly: same direction, calmer numbers.
  const calm = gsap.utils.toArray<HTMLElement>("[data-calm]");
  gsap.set(calm, { opacity: 0, y: 14 });
  ScrollTrigger.batch(calm, {
    start: "top 88%",
    once: true,
    onEnter: (els) =>
      gsap.to(els, { opacity: 1, y: 0, duration: 1.5, stagger: 0.18, ease: "power2.out", overwrite: true }),
  });
}

// ---------------------------------------------------------------------
// Workflow: pinned, driven by the particle morph
// ---------------------------------------------------------------------
function buildWorkflow(cleanups: (() => void)[]) {
  const section = document.querySelector<HTMLElement>("#workflow");
  if (!section) return;
  const narrow = window.matchMedia("(max-width: 820px)").matches;

  // On touch the pin is pure CSS (position: sticky) — no JS pin to flicker.
  if (!isTouch()) ScrollTrigger.create({
    id: "workflow",
    trigger: section,
    start: "top top",
    end: () => `+=${Math.round(window.innerHeight * (narrow ? 3.0 : 3.5))}`,
    pin: true,
    pinSpacing: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
  });

  const steps = gsap.utils.toArray<HTMLElement>("[data-wf-step]", section);
  const corners = gsap.utils.toArray<HTMLElement>(".wf-corner", section);
  const readout = section.querySelector<HTMLElement>("[data-wf-readout]");
  const tag = section.querySelector<HTMLElement>("[data-wf-tag]");

  gsap.set(steps, { opacity: 0, x: -24 });
  gsap.set(corners, { opacity: 0, scale: 0.6 });
  ScrollTrigger.create({
    trigger: section,
    start: "top 75%",
    once: true,
    onEnter: () => {
      gsap.to(steps, { opacity: 1, x: 0, duration: 0.9, stagger: 0.09, ease: "expo.out" });
      gsap.to(corners, { opacity: 1, scale: 1, duration: 0.7, stagger: 0.06, ease: "back.out(1.6)", delay: 0.2 });
    },
  });

  let lastActive = -2;
  // Only write a step's fill when it visibly changes: per-frame style writes
  // in a pinned section are a classic source of mobile scroll jank.
  const lastFill = steps.map(() => -1);
  const off = onFrame(() => {
    const m = story.morph;
    const inside = m > 0.55 && m < 4.45;
    const active = inside ? Math.min(3, Math.max(0, Math.round(m) - 1)) : -1;
    steps.forEach((li, i) => {
      const fill = clamp01(m - i);
      if (Math.abs(fill - lastFill[i]) > 0.01 || (fill % 1 === 0 && fill !== lastFill[i])) {
        lastFill[i] = fill;
        li.style.setProperty("--fill", fill.toFixed(2));
      }
    });
    if (active !== lastActive) {
      lastActive = active;
      steps.forEach((li, i) => li.classList.toggle("is-active", i === active));
      if (active >= 0) {
        const step = workflow[active];
        if (tag) gsap.to(tag, { duration: 0.5, scrambleText: { text: step.tag, chars: "upperCase", speed: 0.8 }, overwrite: true });
        if (readout) gsap.to(readout, { duration: 0.7, scrambleText: { text: step.readout, chars: "upperCase", speed: 0.6 }, overwrite: true });
      }
    }
  });
  cleanups.push(off);
}

// ---------------------------------------------------------------------
// Marquee: idles slowly; on a mouse it leans into scroll speed, gently.
// Touch devices get a steady, slower drift — reacting to touch-scroll speed
// reads as shake.
// ---------------------------------------------------------------------
function buildMarquee(cleanups: (() => void)[]) {
  const track = document.querySelector<HTMLElement>("[data-marquee-track]");
  if (!track) return;
  const touch = window.matchMedia("(pointer: coarse)").matches;
  const tween = gsap.to(track, { xPercent: -50, duration: touch ? 80 : 64, ease: "none", repeat: -1 });
  if (touch) {
    cleanups.push(() => tween.kill());
    return;
  }
  const skew = gsap.quickSetter(track, "skewX", "deg") as (v: number) => void;
  let ts = 1;
  let sk = 0;
  const off = onFrame(() => {
    const v = scroll.velocity;
    const targetTs = 1 + Math.min(2.5, Math.abs(v) * 0.08);
    ts += (targetTs - ts) * 0.08;
    tween.timeScale(v < -0.5 ? -ts : ts);
    sk += (Math.max(-3, Math.min(3, -v * 0.04)) - sk) * 0.08;
    skew(sk);
  });
  cleanups.push(off, () => tween.kill());
}

// ---------------------------------------------------------------------
// Privacy: a shield that draws itself, slowly
// ---------------------------------------------------------------------
function buildPrivacy() {
  const shield = document.querySelector<HTMLElement>("[data-shield]");
  if (!shield) return;
  const paths = gsap.utils.toArray<SVGPathElement>("[data-draw]", shield);
  gsap.set(shield, { opacity: 0, scale: 0.9 });
  gsap.set(paths, { drawSVG: "0%" });
  ScrollTrigger.create({
    trigger: "#privacy",
    start: "top 60%",
    once: true,
    onEnter: () => {
      gsap.to(shield, { opacity: 1, scale: 1, duration: 1.4, ease: "power2.out" });
      gsap.to(paths, { drawSVG: "100%", duration: 1.6, stagger: 0.35, ease: "power2.inOut", delay: 0.2 });
    },
  });
}

// ---------------------------------------------------------------------
// Magnetic store buttons + anticipation dip on press
// ---------------------------------------------------------------------
function buildMagnetic(cleanups: (() => void)[]) {
  if (!window.matchMedia("(pointer: fine)").matches) return;
  document.querySelectorAll<HTMLElement>(".store-button").forEach((el) => {
    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.18);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.22);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    cleanups.push(() => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    });
  });
}

function buildPressFeedback(cleanups: (() => void)[]) {
  const onDown = (e: PointerEvent) => {
    const el = (e.target as HTMLElement | null)?.closest<HTMLElement>(
      ".store-button, .tabs button",
    );
    if (!el) return;
    gsap.to(el, { scale: 0.95, duration: 0.08, ease: "power2.in", overwrite: "auto" });
  };
  const onUp = () => {
    gsap.to(".store-button, .tabs button", {
      scale: 1,
      duration: 0.5,
      ease: "back.out(2.2)",
      overwrite: "auto",
    });
  };
  window.addEventListener("pointerdown", onDown, { passive: true });
  window.addEventListener("pointerup", onUp, { passive: true });
  cleanups.push(() => {
    window.removeEventListener("pointerdown", onDown);
    window.removeEventListener("pointerup", onUp);
  });
}
