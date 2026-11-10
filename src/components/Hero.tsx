import StoreButton from "./StoreButton";

export default function Hero() {
  return (
    <section className="hero page-width" id="top" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow hero-eyebrow">
          <span className="eyebrow-dot" aria-hidden="true" />
          A focused audio toolkit for Android
        </p>
        <h1 id="hero-title">
          Make more room
          <br />
          for the <em>making.</em>
        </h1>
        <p className="hero-lede">
          Extract audio, bring vocals forward, and turn English speech into text.
          CreatorKit keeps the useful tools together and your files on your phone.
        </p>
        <div className="hero-actions">
          <StoreButton />
          <a className="quiet-link" href="#features">
            Explore the tools <span aria-hidden="true">↓</span>
          </a>
        </div>
        <p className="hero-note">No ads. No account. No cloud uploads.</p>
      </div>
      <div className="hero-visual" data-reveal>
        <div className="hero-orbit hero-orbit--one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit--two" aria-hidden="true" />
        <div className="hero-phone">
          <img
            src="/assets/screenshot-extractor.png"
            alt="CreatorKit Audio Extractor showing video selection, MP3 format, and the Studio and Library tabs"
            width="1080"
            height="2400"
            fetchPriority="high"
          />
        </div>
        <div className="floating-note floating-note--top">
          <span className="note-mark" aria-hidden="true">♫</span>
          <span><b>Video to audio</b><small>MP3 or M4A</small></span>
        </div>
        <div className="floating-note floating-note--bottom">
          <span className="note-check" aria-hidden="true">✓</span>
          <span><b>Saved locally</b><small>Ready when you are</small></span>
        </div>
      </div>
    </section>
  );
}
