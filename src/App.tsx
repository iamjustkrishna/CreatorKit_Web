import { useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Workflow from "./components/Workflow";
import Showcase from "./components/Showcase";
import Privacy from "./components/Privacy";
import Journal from "./components/Journal";
import FAQ from "./components/FAQ";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";

function App() {
  useEffect(() => {
    document.documentElement.classList.add("motion-ready");
    const items = document.querySelectorAll<HTMLElement>("[data-reveal]");

    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return () => document.documentElement.classList.remove("motion-ready");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -36px 0px" },
    );

    items.forEach((item) => observer.observe(item));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <section className="proof-strip" aria-label="CreatorKit at a glance">
          <p><span>01</span> Android app</p>
          <p><span>02</span> No ads</p>
          <p><span>03</span> No account</p>
          <p><span>04</span> Files stay on your device</p>
        </section>
        <Workflow />
        <Showcase />
        <Privacy />
        <Journal />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
