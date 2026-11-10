import { Icon } from "./Icons";
import { PRIVACY_URL } from "./StoreButton";

const promises = [
  "Selected media is processed on your Android device.",
  "No account is needed to use the app.",
  "No ads, tracking, or cloud uploads.",
];

export default function Privacy() {
  return (
    <section className="privacy-section section-space" id="privacy" aria-labelledby="privacy-title">
      <div className="privacy-card page-width" data-reveal>
        <div className="privacy-mark"><Icon name="shield" size={27} /></div>
        <div className="privacy-copy">
          <p className="eyebrow">A little more peace of mind</p>
          <h2 id="privacy-title">Your recordings belong with you.</h2>
          <p>
            CreatorKit is designed to work locally. Audio extraction, voice
            enhancement, transcription, and file management happen on your phone;
            your selected media is not uploaded to a conversion server.
          </p>
          <ul>
            {promises.map((promise) => (
              <li key={promise}><span aria-hidden="true">✓</span>{promise}</li>
            ))}
          </ul>
          <a className="privacy-link" href={PRIVACY_URL} target="_blank" rel="noreferrer">
            Read the privacy policy <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="privacy-stamp" aria-hidden="true">
          <span>LOCAL</span>
          <span>BY DESIGN</span>
        </div>
      </div>
    </section>
  );
}
