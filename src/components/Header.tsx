import { useEffect, useState } from "react";
import { scroll } from "../core/scroll";
import { Icon } from "./Icons";
import StoreButton, { GITHUB_URL } from "./StoreButton";

const LINKS = [
  { href: "#workflow", label: "What it does" },
  { href: "#showcase", label: "Inside the app" },
  { href: "#privacy", label: "Privacy" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const onScroll = () => {
      document.body.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // While the mobile sheet is open, freeze page scroll.
  useEffect(() => {
    if (menuOpen) scroll.lenis?.stop();
    else scroll.lenis?.start();
    document.documentElement.classList.toggle("menu-open", menuOpen);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("menu-open");
    };
  }, [menuOpen]);

  return (
    <header className="header" data-header>
      <a className="brand" href="#top" onClick={closeMenu}>
        <img src="/assets/creator-kit-icon.png" alt="" width="32" height="32" />
        <span>CreatorKit</span>
      </a>

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
        className={`nav${menuOpen ? " is-open" : ""}`}
        aria-label="Main navigation"
      >
        {LINKS.map((link) => (
          <a key={link.href} href={link.href} onClick={closeMenu}>
            {link.label}
          </a>
        ))}
        <a href={GITHUB_URL} target="_blank" rel="noreferrer" onClick={closeMenu}>
          GitHub
        </a>
        <span className="nav-actions">
          <StoreButton compact />
        </span>
      </nav>
    </header>
  );
}
