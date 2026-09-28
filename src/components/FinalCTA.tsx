import type { CSSProperties } from "react";
import StoreButton from "./StoreButton";

export default function FinalCTA() {
  return (
    <section className="final-cta section-frame" data-reveal>
      <div className="cta-wave" aria-hidden="true" data-cta-wave>
        {Array.from({ length: 28 }, (_, index) => (
          <span
            key={index}
            data-wave-bar
            style={{ "--bar": `${18 + ((index * 29) % 68)}%` } as CSSProperties}
          />
        ))}
      </div>
      <div className="final-cta-content">
        <img
          src="/assets/creator-kit-icon.png"
          alt=""
          data-icon-spin
        />
        <h2>Your next useful file is a few taps away.</h2>
        <p>Free to download. No subscription and no ad breaks.</p>
        <StoreButton />
      </div>
    </section>
  );
}
