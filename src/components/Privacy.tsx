import { PRIVACY_URL } from "./StoreButton";
import { Icon } from "./Icons";

export default function Privacy() {
  return (
    <section className="privacy-quiet" id="privacy" data-reveal data-calm>
      <div className="shield-calm" aria-hidden="true" data-shield>
        <Icon name="shield" size={40} />
      </div>
      <p className="module-label">03 / PRIVATE BY DESIGN</p>
      <h2 className="module-title">The work happens on your device.</h2>
      <p>
        CreatorKit processes your selected media on your phone. Your
        recordings and videos are not uploaded to a conversion server.
      </p>
      <a href={PRIVACY_URL} target="_blank" rel="noreferrer">
        Read the privacy policy
      </a>
    </section>
  );
}
