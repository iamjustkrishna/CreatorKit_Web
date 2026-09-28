import { GITHUB_URL, PRIVACY_URL } from "./StoreButton";

export default function Footer() {
  return (
    <footer className="footer-strip">
      <a className="console-brand brand--footer" href="#top">
        <img src="/assets/creator-kit-icon.png" alt="" />
        <span>CreatorKit</span>
      </a>
      <p style={{ margin: 0 }}>Built for creators who would rather create.</p>
      <div className="footer-links">
        <a href={PRIVACY_URL} target="_blank" rel="noreferrer">
          Privacy
        </a>
        <a href={GITHUB_URL} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a href="mailto:mastersimpleapps@gmail.com">Contact</a>
      </div>
    </footer>
  );
}
