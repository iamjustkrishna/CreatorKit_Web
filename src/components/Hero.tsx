import StoreButton, { GITHUB_URL } from "./StoreButton";
import { Icon } from "./Icons";

export default function Hero() {
  return (
    <section className="hero" id="top" data-chapter="hero">
      <div className="hero-copy">
        <p className="availability" data-hero="rise">
          <span className="availability-dot" aria-hidden="true" />
          Free on Android · No ads · No account
        </p>

        <h1 className="hero-title" data-hero-title>
          <span className="hero-line">
            Stop watching <span className="ads-word">ads.</span>
          </span>{" "}
          <span className="hero-line hero-line--accent">Start creating.</span>
        </h1>

        <p className="hero-lede" data-hero="rise">
          Extract audio, clean up vocals, and turn speech into text with one
          focused toolkit that keeps your media on your phone.
        </p>

        <div className="hero-actions" data-hero="rise">
          <StoreButton />
          <a className="text-link" href={GITHUB_URL} target="_blank" rel="noreferrer">
            <Icon name="github" size={21} />
            Explore the source
          </a>
        </div>

        <ul className="hero-meta" data-hero="rise" aria-label="Highlights">
          <li>Android 10+</li>
          <li>On-device</li>
          <li>Open source</li>
        </ul>
      </div>

      {/* The 3D phone docks to this box. The <img> is the no-WebGL fallback. */}
      <div
        className="hero-stage"
        data-anchor="hero-phone"
        data-hero="stage"
        role="img"
        aria-label="CreatorKit Audio Extractor interface on a phone"
      >
        <div className="phone-fallback" aria-hidden="true">
          <img
            src="/assets/screenshot-extractor.png"
            alt=""
            width="1080"
            height="2285"
            fetchPriority="high"
          />
        </div>
        <div className="glass-chip glass-chip--a" data-hero="chip" aria-hidden="true">
          <Icon name="wave" size={16} />
          Vocal clarity
        </div>
        <div className="glass-chip glass-chip--b" data-hero="chip" aria-hidden="true">
          <Icon name="shield" size={16} />
          Files stay local
        </div>
        <div className="glass-chip glass-chip--c" data-hero="chip" aria-hidden="true">
          <Icon name="captions" size={16} />
          Speech to text
        </div>
      </div>

      <div className="scroll-cue" aria-hidden="true" data-hero="fade">
        <span>Scroll</span>
        <i />
      </div>
    </section>
  );
}
