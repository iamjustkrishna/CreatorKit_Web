# SDD ledger — plan: docs/superpowers/plans/2026-09-28-immersive-3d.md

Pre-flight: shared interfaces checked —
- T1 useSound/analyser -> T2 SceneCanvas (optional) + T6 CTA wave: consistent names.
- T2 SceneCanvas -> T4 Hero: no conflict, separate layers.
- T3 component split preserves ids/copy for T4-T6: verified against src/App.tsx.
- T5 initReveals/initLenis produced once, consumed T4-T6: single owner (reveal.ts).
No conflicts. Ruling: none needed.

Task 1: complete (tests: npm run lint → 0 errors, audio mp3+ogg ~1MB)
Task 2: complete (tests: npm run build → PASS, canvas lazy)
Task 3: complete (tests: npm run lint && npm run build → PASS, code-split index 238KB)
Task 4: complete (tests: npm run lint && npm run build → PASS)
Task 5: complete (tests: npm run build → PASS; Ruling: fixed prefer-const lint in App.tsx — const cleanups)
Task 6: complete (tests: npm run lint → 0 errors, npm run build → PASS, dist/ audio present)
Task 1 Ruling: removed 8MB WAV from public/audio to meet <6MB budget — mp3+ogg only (~1MB), WAV source stays in creatorkit-video. Cost if wrong: Safari very-old needs WAV; mp3+ogg covers modern.
Task 4 Ruling: hero split/tilt/float hand-rolled (no GSAP SplitText club dependency) — transform/opacity only. Cost if wrong: minor easing differences.
Task 6 Ruling: index.html left untouched — no audio preload is the correct save-data outcome; plan text not updated.
Final: fixed canvas freeze — removed onCreated visibility hook that permanently killed R3F loop; browsers pause rAF automatically. Suite green.
Final: fixed missing boundary — added ErrorBoundary around lazy SceneCanvas, fallback null + CSS nebula.
Final: fixed transform fights — tilt moved to inner elements (phone, showcase-screen), parallax/reveal on outers; workflow cards opacity-only.
Final: minor (deferred): duplicate SoundPill (header + floating) overlap on small screens.
Final: minor (deferred): sound-eq animates height (4 tiny bars).
Final: minor (deferred): showcase tabs lack arrow-key roving tabindex (parity with main).
Final: minor (deferred): audio initPromise caches rejection for session; transient blip needs reload.
Final review: self + subagent review (task ses_f16e09070ffe0iPno7xxUM2n1j); no Critical; Important fixed above; suite green after pass.

