import { useEffect, useState } from "react";
import { GITHUB_URL } from "./StoreButton";
import StoreButton from "./StoreButton";
import { Icon } from "./Icons";
import SoundPill from "./SoundPill";
import { useSound } from "../audio/SoundContext";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { enabled } = useSound();
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const onScroll = () => {
      const intensity = Math.min(1, window.scrollY / 400);
      document.documentElement.style.setProperty(
        "--header-blur",
        `${12 + intensity * 10}px`,
      );
      document.body.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="console-header">
      <a className="console-brand" href="#top" onClick={closeMenu}>
        <img src="/assets/creator-kit-icon.png" alt="" />
        <span>CreatorKit</span>
      </a>

      <span className={`onair${enabled ? " live" : ""}`} aria-hidden="true">
        <i />
        {enabled ? "ON AIR" : "MUTED"}
      </span>

      <button
        className="menu-button"
        type="button"
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={menuOpen}
        aria-controls="site-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <Icon name={menuOpen ? "close" : "menu"} />
      </button>

      <nav
        id="site-navigation"
        className={`site-nav console-nav${menuOpen ? " site-nav--open" : ""}`}
        aria-label="Main navigation"
      >
        <a href="#workflow" onClick={closeMenu}>
          What it does
        </a>
        <a href="#showcase" onClick={closeMenu}>
          Inside the app
        </a>
        <a href="#privacy" onClick={closeMenu}>
          Privacy
        </a>
        <a href={GITHUB_URL} target="_blank" rel="noreferrer" onClick={closeMenu}>
          GitHub
        </a>
        <span className="console-actions">
          <SoundPill />
          <StoreButton compact />
        </span>
      </nav>
    </header>
  );
}
