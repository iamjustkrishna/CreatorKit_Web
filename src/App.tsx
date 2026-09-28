import { Suspense, lazy, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Declaration from "./components/Declaration";
import Workflow from "./components/Workflow";
import Showcase from "./components/Showcase";
import Privacy from "./components/Privacy";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";
import SoundPill from "./components/SoundPill";

const SceneCanvas = lazy(() => import("./scene/SceneCanvas"));

function App() {
  useEffect(() => {
    let cleanups: (() => void)[] = [];
    let cancelled = false;
    import("./motion/hero").then((m) => {
      if (!cancelled) cleanups.push(m.initHeroMotion());
    });
    import("./motion/reveal").then((m) => {
      if (cancelled) return;
      cleanups.push(m.initLenis());
      cleanups.push(m.initReveals());
    });
    return () => {
      cancelled = true;
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

      <Suspense fallback={null}>
        <SceneCanvas />
      </Suspense>
      <Header />

      <main id="main">
        <Hero />
        <Declaration />
        <Workflow />
        <Showcase />
        <Privacy />
        <FinalCTA />
      </main>

      <Footer />
      <SoundPill floating />
    </div>
  );
}

export default App;
