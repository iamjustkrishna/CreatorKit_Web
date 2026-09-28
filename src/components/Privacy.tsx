import { PRIVACY_URL } from "./StoreButton";
import { Icon } from "./Icons";

export default function Privacy() {
  return (
    <section className="privacy section-frame" id="privacy" data-reveal>
      <div className="privacy-mark" aria-hidden="true" data-shield>
        <Icon name="shield" size={48} />
      </div>
      <div>
        <p className="section-kicker">Your files are not the product</p>
        <h2>The work happens on your device.</h2>
      </div>
      <div className="privacy-copy">
        <p>
          CreatorKit processes your selected media on your phone. Your
          recordings and videos are not uploaded to a conversion server.
        </p>
        <a href={PRIVACY_URL} target="_blank" rel="noreferrer">
          Read the privacy policy
        </a>
      </div>
    </section>
  );
}
