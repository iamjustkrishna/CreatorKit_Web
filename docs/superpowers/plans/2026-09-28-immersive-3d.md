# Immersive 3D Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the CreatorKit showcase as a 3D immersive, motion-rich site with continuous music on branch `immersive-3d-redesign`.

**Architecture:** Keep DOM content for SEO/a11y, add one fixed R3F canvas behind content for aurora + particles + scroll camera, GSAP + Lenis for scroll motion, WebAudio loop for music with Sound toggle.

**Tech Stack:** React 19, Vite 8, TS, three, @react-three/fiber, @react-three/drei, gsap, lenis. No router, no backend.

**Spec:** `docs/superpowers/specs/2026-09-28-immersive-3d-design.md`

## Global Constraints

- Branch `immersive-3d-redesign` only, never touch `main` until approved.
- Keep IA/copy/URLs identical — hero, declaration, workflow, showcase tabs, privacy, final CTA, footer.
- Muted-first audio, never autoplay with sound; toggle persists `creatorkit-sound`.
- `prefers-reduced-motion` disables WebGL/Lenis/tilt/autoplay; content defaults visible (no CSS `opacity:0` initial).
- DPR cap 1.75 desktop / 1.25 mobile, pause when hidden/offscreen.
- Static `dist/` deploy unchanged; `creatorkit-video/` untouched except audio copy.
- `npm run lint` + `npm run build` must stay green per task.

## Review Focus

- Autoplay blocked with sound -> stays silent, pill shows Off, no exception surfacing.
- WebGL context creation fails -> body `data-no-webgl`, CSS gradient fallback, content readable.
- `prefers-reduced-motion` on -> no Lenis, no Canvas animation, phones static, wave idle.
- Low-end mobile 390px -> layout intact, DPR capped, no horizontal scroll.
- Audio file missing/corrupt -> decode error caught, UI stays Off, site usable.

---

### Task 1: Deps + audio assets + sound system

**Files:**
- Modify: `package.json`
- Create: `public/audio/creatorkit-loop.wav` (copy), `public/audio/creatorkit-loop.mp3`, `public/audio/creatorkit-loop.ogg`
- Create: `src/audio/loop.ts`
- Create: `src/audio/SoundContext.tsx`
- Create: `src/components/SoundPill.tsx`

**Interfaces:**
- Consumes: original `creatorkit-video/public/audio/creatorkit-original.wav`
- Produces: `useSound(): { enabled: boolean, toggle: () => void, analyser: AnalyserNode | null }`, `getAudioManager(): AudioLoopManager`

- [ ] **Step 1: Add deps**

Run: `npm install three @react-three/fiber @react-three/drei gsap lenis`
Run: `npm install -D @types/three`
Expected: package.json updated, install clean.

- [ ] **Step 2: Copy + transcode audio**

Copy WAV to `public/audio/`. Transcode via ffmpeg if available, else keep WAV + document MP3 TODO (do not block).
Expected: `public/audio/` contains loopable files, <6MB total.

- [ ] **Step 3: Implement `AudioLoopManager` in `src/audio/loop.ts`**

Signature: `class AudioLoopManager { init(urls: string[]): Promise<void>, setEnabled(on: boolean): void, getAnalyser(): AnalyserNode | null }`
Behavior: lazy AudioContext, GainNode fade 800ms, BufferSource loop:true, visibility duck -18dB, decode errors caught.
Test: manual toggle on/off, reload persists via localStorage in context.

- [ ] **Step 4: Implement SoundContext + SoundPill**

Pill: `aria-pressed`, labels "Sound on/off", keyboard accessible, header + floating mobile variant.
Run: `npm run lint`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json public/audio src/audio src/components/SoundPill.tsx
git commit -m "feat: continuous music loop with sound toggle"
```

### Task 2: Scene canvas + global motion foundation

**Files:**
- Create: `src/scene/shaders.ts`, `src/scene/SceneCanvas.tsx`
- Create: `src/styles/tokens.css`, `src/styles/scene.css`, `src/styles/motion.css`
- Modify: `src/main.tsx`, `src/styles.css` (import only)

**Interfaces:**
- Consumes: `useSound` analyser (optional, Task 1)
- Produces: `<SceneCanvas />` fixed background, `data-no-webgl` fallback, CSS vars `--night --violet --cyan --orange`

- [ ] **Step 1: Implement aurora shader + particles in `SceneCanvas.tsx`**

Canvas fixed inset-0, `pointer-events:none`, `frameloop="demand"`, DPR `[1, 1.75]`, scroll-linked group rotation lerp. Catch WebGL fail -> set `document.body.dataset.noWebgl`.
Expected: desktop shows violet/cyan/orange nebula + 350 stars + 12 shards; body fallback readable when disabled.

- [ ] **Step 2: Add tokens/scene/motion CSS**

Tokens preserve existing palette. `scene.css` positions canvas z -1. `motion.css` defines `.reveal` initial state set via JS only (not CSS hidden by default).
Run: `npm run build`
Expected: PASS, no FOUC.

- [ ] **Step 3: Commit**

```bash
git add src/scene src/styles src/main.tsx src/styles.css
git commit -m "feat: immersive 3D background canvas with fallbacks"
```

### Task 3: Component split (no visual change)

**Files:**
- Create: `src/components/Header.tsx`, `Hero.tsx`, `Declaration.tsx`, `Workflow.tsx`, `Showcase.tsx`, `Privacy.tsx`, `FinalCTA.tsx`, `Footer.tsx`, `StoreButton.tsx`, `Icons.tsx`
- Modify: `src/App.tsx` (composition only)

**Interfaces:**
- Consumes: existing copy/links/images from current `App.tsx`
- Produces: same DOM output, identical copy, `activeToolId` state stays in `Showcase.tsx`

- [ ] **Step 1: Extract components verbatim**

Move JSX + Icon + StoreButton unchanged, preserve ids `#top #workflow #showcase #privacy`, aria labels.
Run: `npm run lint && npm run build`
Expected: PASS, `vite preview` pixel-identical except imports.

- [ ] **Step 2: Commit**

```bash
git add src/components src/App.tsx
git commit -m "refactor: split App into section components"
```

### Task 4: Hero 3D + kinetic typography + tilt

**Files:**
- Modify: `src/components/Hero.tsx`
- Create: `src/motion/tilt.ts`, `src/motion/split.ts`
- Modify: `src/styles/motion.css`

**Interfaces:**
- Consumes: `<SceneCanvas />`, screenshot textures `/assets/screenshot-*.png`
- Produces: `useTilt(ref, maxDeg=8): void`, `splitChars(el): void`

- [ ] **Step 1: Headline char reveal + lede/actions stagger**

GSAP timeline on mount: h1 chars y 110% -> 0, `power4.out` 0.9s stagger 0.02; lede/actions/note fade-up. Reduced-motion -> skip, show instantly.
Expected: no layout shift, CLS clean.

- [ ] **Step 2: Phone tilt + float + parallax**

Pointer tilt max 8deg (rAF lerp), idle float sine 4s (transform only), scroll parallax via ScrollTrigger yPercent -8 / -14. Mobile: tilt disabled, float kept unless reduced-motion.
Run: `npm run lint`
Expected: PASS, 60fps, no horizontal scroll at 390px.

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero.tsx src/motion src/styles/motion.css
git commit -m "feat: hero kinetic type and 3D phone stage"
```

### Task 5: Scroll reveals + workflow + showcase motion

**Files:**
- Create: `src/motion/reveal.ts`
- Modify: `src/components/Declaration.tsx`, `Workflow.tsx`, `Showcase.tsx`, `Privacy.tsx`
- Modify: `src/styles/motion.css`

**Interfaces:**
- Consumes: `useTilt`, GSAP ScrollTrigger, Lenis (init in `main.tsx`)
- Produces: `initReveals(): cleanup`, `initLenis(): cleanup` (both no-op on reduced-motion)

- [ ] **Step 1: Lenis + generic reveals**

Lenis `lerp 0.1`, sync to ScrollTrigger. `[data-reveal]` y 24 opacity fade 0.7s `power3.out`. Set initial via JS.
Expected: smooth scroll desktop, native fallback mobile/reduced-motion.

- [ ] **Step 2: Declaration word scrub + workflow SVG draw**

Declaration words opacity 0.15->1 scrub. Workflow signal-line stroke-dashoffset scrub + traveling glow + node pop stagger.
Expected: scrub smooth, no jank.

- [ ] **Step 3: Showcase Flip + tilt + aura hue**

Tab switch View Transition crossfade 360ms, screen tilt subtle, aura hue per tool (extract violet, transcribe cyan, organize orange).
Run: `npm run build`
Expected: PASS, tabs keyboard accessible (`role=tablist` preserved).

- [ ] **Step 4: Commit**

```bash
git add src/motion src/components/Declaration.tsx src/components/Workflow.tsx src/components/Showcase.tsx src/components/Privacy.tsx src/main.tsx
git commit -m "feat: scroll storytelling and showcase transitions"
```

### Task 6: CTA audio-reactive + polish + verify

**Files:**
- Modify: `src/components/FinalCTA.tsx`, `Header.tsx`, `Footer.tsx`
- Modify: `src/styles/motion.css`, `src/styles/scene.css`
- Modify: `index.html` (meta theme + preload audio none)

**Interfaces:**
- Consumes: `useSound().analyser`, existing CTA copy
- Produces: audio-reactive 28-bar wave (idle CSS fallback), header glass intensity by scrollY, magnetic buttons

- [ ] **Step 1: Audio-reactive wave + magnetic buttons + header glass**

Wave: rAF reads FFT (throttled to 30Hz), scaleY bars; idle sine when muted. Buttons: translate 6px toward cursor + shine. Header: `backdrop-blur` 12->20px by scrollY.
Expected: wave animates only when sound on; idle otherwise.

- [ ] **Step 2: Reduced-motion + contrast + mobile audit**

Force `prefers-reduced-motion`, disable WebGL via flag, 390px check, keyboard tab through, SoundPill aria-pressed correct.
Run: `npm run lint && npm run build`
Expected: PASS, no horizontal scroll, focus visible.

- [ ] **Step 3: Commit + verify preview**

```bash
git add src/components/FinalCTA.tsx src/components/Header.tsx src/components/Footer.tsx src/styles index.html
git commit -m "feat: audio-reactive CTA and final polish"
npm run build
npx vite preview --port 4173
```
Expected: preview serves `dist/`, all sections render, sound toggles, console clean.

## Self-review

- Spec coverage: music (T1+T6), 3D canvas (T2), component IA (T3), hero (T4), scroll/showcase (T5), polish/verify (T6). All spec sections mapped.
- Step scan: each step one action + checkable run. No transcripts — bodies left to implementer.
- Type consistency: `useSound`, `AudioLoopManager`, `useTilt`, `initReveals/initLenis`, `SceneCanvas` names stable across tasks.
- Review Focus tests added in owning tasks (autoplay, WebGL fail, reduced-motion, mobile, corrupt audio).
- Proportion: plan shorter than spec + code, signatures only.
