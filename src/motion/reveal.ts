import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export function initLenis(): () => void {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return () => undefined;
  try {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time);
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
    // Generic reveals
    gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
      // Skip hero (already animated on mount)
      if (el.closest(".hero")) return;
      gsap.fromTo(
        el,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        },
      );
    });

    // Declaration word scrub
    document.querySelectorAll<HTMLElement>("[data-scrub-words]").forEach((p) => {
      const words = p.textContent?.split(/\s+/) ?? [];
      p.innerHTML = words
        .map((w) => `<span class="scrub-word">${w}</span>`)
        .join(" ");
      const spans = p.querySelectorAll(".scrub-word");
      gsap.to(spans, {
        opacity: 1,
        stagger: 0.06,
        ease: "none",
        scrollTrigger: {
          trigger: p,
          start: "top 80%",
          end: "bottom 45%",
          scrub: 0.6,
        },
      });
    });

    // Workflow signal draw
    const path = document.querySelector<HTMLElement>("[data-workflow]");
    if (path) {
      const draw = path.querySelector(".signal-draw");
      if (draw) {
        gsap.fromTo(
          draw,
          { strokeDasharray: 1000, strokeDashoffset: 1000 },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: path,
              start: "top 80%",
              end: "bottom 50%",
              scrub: 0.8,
            },
          },
        );
      }
      // Tilt owns transform on these cards, so animate opacity only here.
      gsap.utils.toArray<HTMLElement>("[data-tilt-card]").forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.5,
            delay: (i % 4) * 0.08,
            ease: "power2.out",
            scrollTrigger: { trigger: card, start: "top 88%", once: true },
          },
        );
      });
    }

    // Parallax
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

    // Shield draw + icon spin
    const shield = document.querySelector("[data-shield] svg");
    if (shield) {
      gsap.fromTo(
        shield,
        { scale: 0.8, rotate: -8, opacity: 0 },
        {
          scale: 1,
          rotate: 0,
          opacity: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: { trigger: shield, start: "top 85%", once: true },
        },
      );
    }
    const spin = document.querySelector("[data-icon-spin]");
    if (spin) {
      gsap.to(spin, {
        rotateY: 360,
        duration: 14,
        repeat: -1,
        ease: "none",
      });
    }
  });

  return () => ctx.revert();
}
