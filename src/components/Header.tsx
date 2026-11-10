import { useEffect, useState } from "react";
import { Icon } from "./Icons";
import StoreButton from "./StoreButton";

const links = [
  { href: "#features", label: "Features" },
  { href: "#inside", label: "Inside the app" },
  { href: "#privacy", label: "Privacy" },
  { href: "/journal/", label: "Journal" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="CreatorKit home" onClick={closeMenu}>
        <img src="/assets/creator-kit-icon.png" alt="" width="38" height="38" />
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
        <Icon name={menuOpen ? "close" : "menu"} size={21} />
      </button>
      <nav
        id="site-navigation"
        className={`site-nav${menuOpen ? " is-open" : ""}`}
        aria-label="Main navigation"
      >
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={closeMenu}>
            {link.label}
          </a>
        ))}
        <StoreButton compact />
      </nav>
    </header>
  );
}
