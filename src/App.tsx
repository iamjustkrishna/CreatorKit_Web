import { Suspense, lazy, useEffect, useState } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Declaration from "./components/Declaration";
import Workflow from "./components/Workflow";
import Showcase from "./components/Showcase";
import Privacy from "./components/Privacy";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";
import Hud from "./components/Hud";
import Cursor from "./components/Cursor";
import Intro from "./components/Intro";
import { getBoot, setBoot, useBoot } from "./core/boot";
import { bus, updateBus } from "./core/bus";
import { initScroll, onFrame, prefersReducedMotion, scroll } from "./core/scroll";
import { initStory, story, updateStory } from "./core/story";
import { initChoreo } from "./motion/choreo";
import { frame } from "./scene/frame";
import { saveDataEnabled, webglAvailable } from "./scene/quality";

const SceneCanvas = lazy(() => import("./scene/SceneCanvas"));

function App() {
  const boot = useBoot();
  const [enable3d] = useState(
    () => !prefersReducedMotion() && !saveDataEnabled() && webglAvailable(),
  );

  useEffect(() => {
    setBoot({ webgl: enable3d, sceneReady: !enable3d });
    if (!enable3d) document.body.dataset.noWebgl = "true";
  }, [enable3d]);

  // The engines: scroll → story → bus → (scene, HUD), one ordered loop.
  useEffect(() => {
    const cleanups: (() => void)[] = [];
    // Dev-only handle for inspecting live state from the console / tests.
    if (import.meta.env.DEV) {
      Object.assign(window, { __ck: { story, bus, frame, scroll, boot: getBoot } });
    }
    cleanups.push(initScroll());
    cleanups.push(initStory());
    cleanups.push(
      onFrame((time) => {
        updateBus(time);
        updateStory();
      }),
    );
    cleanups.push(initChoreo());
    if (getBoot().gateOpen) {
      scroll.lenis?.stop();
      document.documentElement.classList.add("gate-open");
    }
    return () => {
      cleanups.forEach((fn) => {
        try {
          fn();
        } catch {
          /* ignore teardown errors */
        }
      });
    };
  }, []);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <div className="atmosphere" aria-hidden="true" />
      {enable3d && (
        <ErrorBoundary>
          <Suspense fallback={null}>
            <SceneCanvas onReady={() => setBoot({ sceneReady: true })} />
          </Suspense>
        </ErrorBoundary>
      )}

      <div id="site-content" inert={boot.gateOpen}>
        <Header />
        <main id="main">
          <Hero />
          <Marquee />
          <Declaration />
          <Workflow />
          <Showcase />
          <Privacy />
          <FinalCTA />
        </main>
        <Footer />
      </div>

      <Hud />
      <Cursor />
      <Intro />
    </div>
  );
}

export default App;
