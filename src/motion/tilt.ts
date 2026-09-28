// Pointer tilt — transform-only, rAF-lerped, disabled on touch/reduced-motion.

export function initTilt(root: ParentNode = document): () => void {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  if (reduced || coarse) return () => undefined;

  const cleanups: (() => void)[] = [];
  const targets = Array.from(
    root.querySelectorAll<HTMLElement>("[data-tilt], [data-tilt-card]"),
  );

  for (const el of targets) {
    const max = el.hasAttribute("data-tilt-card") ? 6 : 10;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const render = () => {
      // Snappy follow (stiffness-like); release settles without float.
      cx += (tx - cx) * 0.2;
      cy += (ty - cy) * 0.2;
      el.style.transform = `perspective(900px) rotateX(${cy.toFixed(2)}deg) rotateY(${cx.toFixed(2)}deg)`;
      if (Math.abs(tx - cx) > 0.01 || Math.abs(ty - cy) > 0.01) {
        raf = requestAnimationFrame(render);
      } else {
        raf = 0;
      }
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / Math.max(1, r.width) - 0.5;
      const py = (e.clientY - r.top) / Math.max(1, r.height) - 0.5;
      tx = px * max * 2;
      ty = -py * max * 2;
      kick();
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      kick();
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    cleanups.push(() => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = "";
    });
  }

  return () => cleanups.forEach((fn) => fn());
}

export function initFloat(root: ParentNode = document): () => void {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return () => undefined;
  const els = Array.from(
    root.querySelectorAll<HTMLElement>("[data-float], [data-float-delayed]"),
  );
  els.forEach((el, i) => {
    el.style.animation = `hero-float 5s ease-in-out ${i % 2 ? "-2.5s" : "0s"} infinite`;
  });
  return () => els.forEach((el) => (el.style.animation = ""));
}
