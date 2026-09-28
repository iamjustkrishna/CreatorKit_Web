# CreatorKit Showcase — Immersive 3D Redesign (design spec)

Branch: `immersive-3d-redesign` (from `main` @ dd095f5)
Date: 2026-09-28
Status: approved in chat — "go ahead"

## 1. Intent

Turn the existing install-focused showcase into a modern 3D immersive,
motion-rich experience with continuous music, while keeping the same
information architecture and copy so conversion is preserved.

Confirmed decisions:
- Music: muted-first autoplay attempt + prominent Sound On toggle.
  Reuse `creatorkit-video/public/audio/creatorkit-original.wav` (original
  120 BPM deterministic score). No new composition.
- 3D: full immersive (Three.js via React Three Fiber + Drei).
- Content: keep structure/copy — header, hero, declaration, workflow,
  showcase tabs, privacy, final CTA, footer. Reskin only.
- Guardrails: static `dist/` deploy unchanged, `prefers-reduced-motion`
  full fallback, mobile low-end fallback.

Success criteria:
- Same content reaches Play Store CTA faster and feels premium.
- 60fps on desktop, no jank on Moto-class mobile (fallback path).
- Music loops seamlessly, user-controllable, never autoplays with sound.
- `npm run lint` + `npm run build` green.

## 2. Current state

- Vite 8 + React 19 + TS, single `src/App.tsx` (462 lines),
  `src/styles.css` (1265 lines).
- Theme: `--night #0f0b17`, violet `#a855f7`, cyan `#22d3ee`,
  orange `#fb923c`. Fonts: Instrument Serif + Playpen Sans (local).
- Sections have only CSS keyframes: hero in, signal-travel, screen-change.
- Assets: `creator-kit-icon.png`, 3 screenshots, 2 fonts.
- No 3D, motion, or audio deps.

## 3. Architecture

Keep DOM for content/SEO/a11y. Add one fixed WebGL layer behind content.

```
src/
  App.tsx (composition only)
  components/
    Header.tsx SoundPill.tsx Hero.tsx Declaration.tsx
    Workflow.tsx Showcase.tsx Privacy.tsx FinalCTA.tsx Footer.tsx
  scene/
    SceneCanvas.tsx // fixed canvas, aurora shader + particles + shards
    HeroPhones.tsx  // tilt/parallax group, screenshot textures
    shaders.ts
  motion/
    reveal.ts // IntersectionObserver + GSAP ScrollTrigger helpers
    tilt.ts   // pointer tilt hook
  audio/
    loop.ts   // WebAudio loop manager + AnalyserNode
    SoundContext.tsx
  styles/
    tokens.css motion.css scene.css
public/audio/
  creatorkit-loop.wav (copy) + .mp3 + .ogg (compressed)
```

WebGL details:
- `SceneCanvas`: full-viewport fixed, `pointer-events:none`, z-index -1.
  Aurora fragment shader (violet/cyan/orange), 350-point starfield,
  12 floating icosahedrons, scroll-linked camera y + rotation lerp.
- DPR cap 1.75 desktop / 1.25 mobile. `frameloop="demand"` when idle,
  pause when `document.hidden` or canvas offscreen.
- Fallback: if WebGL fails or reduced-motion or `save-data`, render
  static CSS gradients only.

Motion details:
- Lenis smooth scroll + GSAP ScrollTrigger reveals (y 24px, opacity,
  0.7s, `power3.out`, stagger 0.08).
- Hero headline SplitText char reveal, phones pointer-tilt (max 8deg)
  + idle float (sine 4s) + scroll parallax (different speeds).
- Workflow signal-line: SVG stroke draw-on scrub + traveling glow.
- Showcase tabs: View Transition crossfade + screen tilt.
- Buttons: magnetic (translate 6px toward cursor) + shine sweep.
- Final CTA wave: 28 bars idle CSS; when audio on, drive scaleY from
  AnalyserNode FFT (throttled rAF).

Audio details:
- `loop.ts`: AudioContext lazy, GainNode master (0.0 -> 0.8 fade 800ms),
  BufferSource loop:true, crossfade tail built into original WAV.
- Muted-first: attempt `play()` muted on load; unmute only on toggle.
  Persist `creatorkit-sound: on/off` in localStorage.
- Duck to -18dB on `visibilitychange` hidden, resume on visible if on.
- Compressed MP3/OGG generated once via ffmpeg, WAV kept as fallback.
- SoundPill in header + floating mobile pill. Aria-pressed, label
  "Turn sound on/off".

## 4. Components (per existing section)

- Header: glass on scroll (`backdrop-blur` intensity by scrollY),
  SoundPill, mobile nav stagger.
- Hero: same copy/CTA, 3D phone stage, glow replaced by live shader
  + DOM glow fallback, floating notes pulse.
- Declaration: word-by-word scrub opacity 0.15 -> 1.
- Workflow: 4 steps same copy, tilt cards, animated node glow on enter.
- Showcase: same 3 tools/tabs, 3D screen tilt, aura hue per tool.
- Privacy: shield stroke draw, same copy/link.
- FinalCTA: same copy, audio-reactive wave, icon slow rotateY.
- Footer: same links, reveal.

No new sections, no copy changes, no URL changes.

## 5. Data flow / error handling

- Audio: toggle -> SoundContext -> loop.ts -> AnalyserNode -> CTA wave.
  Errors (decode, autoplay block) -> stay silent, pill shows Off, console
  warn only. No crash.
- 3D: try/catch around Canvas creation; on fail -> `data-no-webgl`
  on body, CSS fallback. Textures: `useTexture` with Suspense fallback
  to `<img>`.
- Motion: if GSAP fails to load, content defaults visible (no FOUC —
  set initial state via JS, not CSS `opacity:0`).

## 6. Testing

- `npm run lint`, `npm run build`, `vite preview` smoke all sections.
- Manual: desktop Chrome/Edge, mobile 390px, sound on/off, reload
  persistence, reduced-motion OS setting, WebGL disabled, CPU 4x throttle.
- Lighthouse mobile target >85 perf, no CLS regression.
- Check dist size delta documented in PR.

## 7. Implementation order

1. Deps + audio assets + SoundPill + loop.ts (independently testable).
2. SceneCanvas + fallback + tokens.
3. Split App.tsx into components (no visual change).
4. Hero 3D + kinetic type + tilt.
5. Scroll reveals + workflow SVG + showcase transitions.
6. CTA audio-reactive + footer + polish + reduced-motion audit.
7. Lint/build/verify.

## 8. Out of scope

- No new pages, routing, backend, or copy rewrite.
- No new music composition (reuse original).
- No video embed (film stays in `creatorkit-video/`).
- No PWA/service-worker changes.
- No `creatorkit-video/` code changes.

## Spec self-review

- No TBDs. Copy frozen. Asset paths explicit.
- Architecture matches features. Fallbacks cover WebGL/audio/motion
  failures. Initial-visible default prevents blank content.
- Single plan scope. No contradictions.
