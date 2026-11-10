import { PRIVACY_URL } from "./StoreButton";

export default function Footer() {
  return (
    <footer className="site-footer page-width">
      <a className="brand brand--footer" href="/" aria-label="CreatorKit home">
        <img src="/assets/creator-kit-icon.png" alt="" width="32" height="32" loading="lazy" />
        <span>CreatorKit</span>
      </a>
      <p>A quieter set of tools for the work around your audio.</p>
      <nav aria-label="Footer navigation">
        <a href="/journal/">Journal</a>
        <a href={PRIVACY_URL} target="_blank" rel="noreferrer">Privacy</a>
        <a href="mailto:mastersimpleapps@gmail.com">Contact</a>
      </nav>
      <small>© CreatorKit</small>
    </footer>
  );
}
