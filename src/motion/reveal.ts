import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { DUR, STAGGER, staggerDelay } from "./tokens";

gsap.registerPlugin(ScrollTrigger);

export function initLenis(): () => void {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return () => undefined;
  try {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    // GSAP ticker time is seconds; Lenis raf() expects milliseconds.
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  } catch (err) {
    console.warn("[motion] lenis unavailable, native scroll:", err);
    return () => undefined;
  }
}

export function initReveals(): () => void {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return () => undefined;

  const ctx = gsap.context(() => {
    // Generic reveals — enter curve, duration by element weight.
    // Calm sections (privacy): slower, smaller travel, no overshoot anywhere here.
    gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
      const calm = el.hasAttribute("data-calm");
      gsap.fromTo(
        el,
        { y: calm ? 16 : 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: (calm ? 600 : DUR.section) / 1000,
          ease: "expo.out", // closest GSAP match to cubic-bezier(0.16,1,0.3,1)
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        },
      );
    });

    // Journey cards: 300ms UI duration, 60ms list stagger, enter curve.
    // Scrub drives the spine; cards pop once as the line reaches them.
    const journey = document.querySelector<HTMLElement>("[data-journey]");
    if (journey) {
      const progress = journey.querySelector("[data-journey-progress]");
      if (progress) {
        gsap.fromTo(
          progress,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: journey,
              start: "top 75%",
              end: "bottom 55%",
              scrub: 0.8,
            },
          },
        );
      }
      const cards = journey.querySelectorAll<HTMLElement>("[data-journey-card]");
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: DUR.ui / 1000,
            delay: staggerDelay(i, STAGGER.list) / 1000,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 88%", once: true },
          },
        );
      });
      // Beat nodes light as the progress line passes each quartile.
      const nodes = journey.querySelectorAll<HTMLElement>("[data-beat-node]");
      nodes.forEach((node, i) => {
        ScrollTrigger.create({
          trigger: journey,
          start: "top 75%",
          end: "bottom 55%",
          scrub: 0.8,
          onUpdate: (self) => {
            node.classList.toggle("lit", self.progress >= (i + 1) / (nodes.length + 1));
          },
        });
      });
    }

    // Crescendo: branded pop with overshoot — the one place weight is playful.
    document.querySelectorAll<HTMLElement>("[data-crescendo]").forEach((el) => {
      gsap.fromTo(
        el,
        { scale: 0.92, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(1.56)",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        },
      );
    });

    // Shield: calm settle, no rotation theatrics.
    const shield = document.querySelector("[data-shield]");
    if (shield) {
      gsap.fromTo(
        shield,
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: "expo.out",
          scrollTrigger: { trigger: shield, start: "top 85%", once: true },
        },
      );
    }

    // Parallax on scroll (move = stays on screen; scrubbed so linear-in-time is right).
    gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
      const speed = Number(el.dataset.parallax ?? "-8");
      gsap.to(el, {
        yPercent: speed,
        ease: "none",
        scrollTrigger: {
          trigger: el.closest("section") ?? el,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    });

    const spin = document.querySelector("[data-icon-spin]");
    if (spin) {
      gsap.to(spin, { rotateY: 360, duration: 14, repeat: -1, ease: "none" });
    }
  });

  return () => ctx.revert();
}
