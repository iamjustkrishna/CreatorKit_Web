import { GITHUB_URL } from "./StoreButton";
import StoreButton from "./StoreButton";
import { Icon } from "./Icons";

export default function Hero() {
  return (
    <section className="hero-cine" id="top">
      <div className="availability" data-hero-slot="0">
        <span className="availability-dot" />
        Free on Android · No ads · No account
      </div>

      <h1 data-split data-hero-slot="1">
        Stop watching ads. Start creating.
      </h1>

      <p className="hero-lede" data-hero-slot="2">
        Extract audio, clean up vocals, and turn speech into text with one
        focused toolkit that keeps your media on your phone.
      </p>

      <div className="hero-actions" data-hero-slot="2">
        <span className="crescendo-btn" style={{ display: "inline-flex" }}>
          <StoreButton />
        </span>
        <a
          className="text-link"
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
        >
          <Icon name="github" size={21} />
          Explore the source
        </a>
      </div>

      <div
        className="hero-stage"
        aria-label="CreatorKit app preview"
        data-hero-slot="3"
      >
        <div className="hero-stage-glow" aria-hidden="true" />
        <div className="phone phone--ghost" aria-hidden="true">
          <img
            src="/assets/screenshot-transcriber.png"
            alt=""
            width="1080"
            height="2400"
          />
        </div>
        <div className="phone phone--lead tilt" data-tilt data-float>
          <img
            src="/assets/screenshot-extractor.png"
            alt="CreatorKit Audio Extractor interface"
            width="1080"
            height="2285"
          />
        </div>
        <div className="hero-badges hero-badges--a" data-float>
          <Icon name="wave" size={17} />
          Vocal clarity
        </div>
        <div className="hero-badges hero-badges--b" data-float-delayed>
          <Icon name="shield" size={17} />
          Files stay local
        </div>
      </div>

      <div className="scroll-cue" aria-hidden="true" data-hero-slot="4">
        <span>SCROLL</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </section>
  );
}
