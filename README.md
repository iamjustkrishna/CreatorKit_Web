# CreatorKit Showcase

Install-focused website for the
[CreatorKit Android app](https://play.google.com/store/apps/details?id=space.iamjustkrishna.creatorkit).

It is a single continuous WebGL experience: a 3D phone, a particle "signal"
that morphs through the product story, and a spectrogram terrain for the finale.
There is no sound.

## Development

```bash
npm install
npm run dev
```

## Checks

```bash
npm run lint
npm run build
```

The production site is emitted to `dist/` and can be deployed to any static
host.

## How it works

One fixed WebGL canvas sits behind normal, accessible DOM. Everything else is
driven by one ordered loop (GSAP ticker → Lenis scroll → story → ambient bus →
render).

| Layer | Where | What it does |
| --- | --- | --- |
| Story | `src/core/story.ts` | Maps scroll to a *morph* value (0–7), the chapter and the workflow step. Rebuilt from real layout on every ScrollTrigger refresh. |
| Signal | `src/scene/Signal.tsx`, `targets.ts` | ~14k GPU particles that morph between eight shapes: ribbons → raw waveform → clean waveform → transcript → library → halo → orb → radial equaliser. |
| Phone | `src/scene/Phone.tsx` | 3D phone with a shader screen that crossfades between screenshots. It holds one fixed pose per section and never reacts to the clock or scroll speed. The one exception is a smoothed tilt toward the pointer while the pointer is over it: it eases in and out, and backs off while the page scrolls. Docks to `[data-anchor]` DOM boxes, so layout stays in CSS. |
| Terrain | `src/scene/Terrain.tsx` | Spectrogram landscape under the closing CTA. |
| Choreography | `src/motion/choreo.ts` | Hero entrance, scroll reveals, pinned workflow, marquee. |

The scene runs on a slow ambient "breathing" signal (`src/core/bus.ts`) — no beat,
no fast pulses. All background motion (particles, nebula, terrain, marquee) is paced
deliberately slow: the ambient shader clock runs at 0.36× real time on desktop and
0.26× on phones (`motion` in `src/scene/quality.ts`).

### Quality tiers and fallbacks

- **high** (desktop): 14k particles, reflections, DPR up to 1.75.
- **low** (phones, ≤4 cores or ≤4 GB): 3.6k particles, no reflections, DPR up to 1.25,
  ambient motion at half speed.
- **Touch devices** get a native-scroll profile. Phones scroll on the compositor
  thread, so anything re-positioned from JavaScript while scrolling lags behind the
  page and shakes. Therefore on touch: the workflow pin is pure CSS (`position: sticky`)
  instead of a ScrollTrigger pin, the in-page phone image replaces the 3D phone (it
  scrolls in perfect sync), Lenis smooth-scroll is not used, horizontal panning is
  locked and nothing may widen the page. They also skip scroll-speed zoom/twist, touch
  pushes and tap shockwaves, keep the marquee flat and steady, use solid instead of
  blurred glass panels (backdrop blur over an animating canvas is a main cause of phone
  scroll jank), and pin the canvas to the large viewport so it never resizes with the
  address bar.
- Rendering is capped at about 2.6 megapixels whatever the window size (a zoomed-out
  browser is a huge window in CSS pixels), and steps down — never back up, so it
  cannot flicker — if frames still drop.
- **Reduced motion, data saver, or no WebGL**: no canvas. The page is fully
  usable with DOM phones and no pinning. Reduced motion also skips smooth scroll,
  parallax and the HUD.
- If the 3D layer throws, an error boundary drops to the same fallback.

### Debug handle

In `npm run dev`, `window.__ck` exposes `story`, `bus`, `frame`, `scroll` and
`boot`, and `window.__r3f` is the live R3F state.

## Source assets

The app icon, screenshots, Instrument Serif, and Playpen Sans are sourced from
the adjacent CreatorKit Android project. HUD labels use Martian Mono (via
`@fontsource-variable/martian-mono`).

## Product film

The independent [Remotion project](./creatorkit-video/README.md) contains the
42-second CreatorKit launch film, an original soundtrack, editable scene
timelines, and rendering commands. Its dependencies and lint configuration are
managed separately from this website.
