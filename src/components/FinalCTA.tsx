import StoreButton from "./StoreButton";

export default function FinalCTA() {
  return (
    <section className="cta-section page-width" id="download" aria-labelledby="cta-title">
      <div className="cta-card" data-reveal>
        <img
          className="cta-icon"
          src="/assets/creator-kit-icon.png"
          alt=""
          width="64"
          height="64"
          loading="lazy"
        />
        <div>
          <p className="eyebrow">Your next idea can stay yours</p>
          <h2 id="cta-title">Make space for the part you came to do.</h2>
          <p>CreatorKit is available for Android on Google Play.</p>
        </div>
        <StoreButton />
      </div>
    </section>
  );
}
