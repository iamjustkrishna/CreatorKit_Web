import { PRIVACY_URL } from "./StoreButton";

export default function Privacy() {
  return (
    <section className="privacy" id="privacy" data-chapter="privacy">
      {/* The calm orb docks here. */}
      <div className="privacy-orb" data-anchor="privacy-orb" aria-hidden="true">
        <div className="shield" data-shield>
          <svg viewBox="0 0 48 48" width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path data-draw d="M24 5 38 10.5v11c0 9.2-5.8 15.2-14 18.5-8.2-3.3-14-9.3-14-18.5v-11L24 5Z" />
            <path data-draw d="m17.5 24 4.5 4.5 9-9.5" />
          </svg>
        </div>
      </div>

      <div className="privacy-copy">
        <p className="module-label module-label--center" data-label>
          03 / PRIVATE BY DESIGN
        </p>
        <h2 className="module-title" data-title>
          The work happens on your device.
        </h2>
        <p className="privacy-text" data-calm>
          CreatorKit processes your selected media on your phone. Your
          recordings and videos are not uploaded to a conversion server.
        </p>
        <a className="privacy-link" data-calm href={PRIVACY_URL} target="_blank" rel="noreferrer">
          Read the privacy policy
        </a>
      </div>
    </section>
  );
}
