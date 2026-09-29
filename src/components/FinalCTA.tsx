import StoreButton, { GITHUB_URL } from "./StoreButton";

export default function FinalCTA() {
  return (
    <section className="cta" id="cta" data-chapter="cta">
      {/* The radial equaliser docks to this box; the icon sits at its centre. */}
      <div className="cta-ring" data-anchor="cta-ring" aria-hidden="true">
        <span className="cta-icon">
          <img src="/assets/creator-kit-icon.png" alt="" width="96" height="96" />
        </span>
      </div>

      <div className="cta-content">
        <p className="module-label module-label--center" data-label>
          04 / READY WHEN YOU ARE
        </p>
        <h2 className="cta-title" data-cta-title>
          Your next useful file is a few taps away.
        </h2>
        <p className="cta-sub" data-reveal>
          Free to download. No subscription and no ad breaks.
        </p>
        <div className="cta-actions" data-reveal>
          <span className="cta-button">
            <StoreButton />
          </span>
          <a className="text-link" href={GITHUB_URL} target="_blank" rel="noreferrer">
            Read the source
          </a>
        </div>
      </div>
    </section>
  );
}
