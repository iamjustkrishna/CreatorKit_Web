// Kinetic headline: split into chars, staggered rise. No GSAP needed for hero.

export function splitHeroTitle(root: ParentNode = document): () => void {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const title = root.querySelector<HTMLElement>("[data-split]");
  if (!title || reduced) return () => undefined;

  const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);

  const created: HTMLElement[] = [];
  for (const node of nodes) {
    const frag = document.createDocumentFragment();
    const text = node.textContent ?? "";
    for (const ch of text) {
      if (ch === " " || ch === "\n") {
        frag.appendChild(document.createTextNode(ch));
        continue;
      }
      const s = document.createElement("span");
      s.className = "char";
      s.textContent = ch;
      s.style.opacity = "0";
      s.style.transform = "translateY(110%)";
      s.style.display = "inline-block";
      frag.appendChild(s);
      created.push(s);
    }
    node.parentNode?.replaceChild(frag, node);
  }

  let raf = 0;
  const start = performance.now();
  const tick = (now: number) => {
    const t = (now - start) / 900;
    created.forEach((s, i) => {
      const local = Math.min(1, Math.max(0, t * 1.2 - i * 0.012));
      const eased = 1 - Math.pow(1 - local, 4);
      s.style.opacity = String(eased);
      s.style.transform = `translateY(${(1 - eased) * 110}%)`;
    });
    if (t < 1.4) raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  // Fade sibling hero elements with stagger
  const fades = Array.from(
    root.querySelectorAll<HTMLElement>("[data-hero-fade]"),
  );
  fades.forEach((el, i) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(16px)";
    el.style.transition = `opacity 0.7s cubic-bezier(0.21,0.8,0.38,1) ${200 + i * 120}ms, transform 0.7s cubic-bezier(0.21,0.8,0.38,1) ${200 + i * 120}ms`;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }),
    );
  });

  return () => {
    if (raf) cancelAnimationFrame(raf);
  };
}
