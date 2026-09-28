import { GITHUB_URL } from "./StoreButton";
import StoreButton from "./StoreButton";
import { Icon } from "./Icons";

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <div className="availability">
          <span className="availability-dot" />
          Free on Android
        </div>
        <h1 className="hero-title" data-split>
          Stop watching ads.
          <br />
          Start creating.
        </h1>
        <p className="hero-lede" data-hero-fade>
          Extract audio, clean up vocals, and turn speech into text with one
          focused toolkit that keeps your media on your phone.
        </p>
        <div className="hero-actions" data-hero-fade>
          <StoreButton />
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
        <p className="hero-note" data-hero-fade>
          No ads. No account. Android 10 and newer.
        </p>
      </div>

      <div
        className="hero-visual tilt"
        aria-label="CreatorKit app preview"
        data-tilt
        data-parallax="-8"
      >
        <div className="visual-glow" />
        <div className="phone phone--back" aria-hidden="true" data-parallax="-14">
          <img
            src="/assets/screenshot-transcriber.png"
            alt=""
            width="1080"
            height="2400"
          />
        </div>
        <div className="phone phone--front" data-float>
          <img
            src="/assets/screenshot-extractor.png"
            alt="CreatorKit Audio Extractor interface"
            width="1080"
            height="2285"
          />
        </div>
        <div className="app-icon-orbit" aria-hidden="true" data-float-delayed>
          <img src="/assets/creator-kit-icon.png" alt="" />
        </div>
        <div className="floating-note floating-note--top" data-float>
          <Icon name="wave" size={19} />
          Vocal clarity
        </div>
        <div className="floating-note floating-note--bottom" data-float-delayed>
          <Icon name="shield" size={19} />
          Files stay local
        </div>
      </div>
    </section>
  );
}
