import type { CSSProperties } from "react";
import StoreButton from "./StoreButton";

export default function FinalCTA() {
  return (
    <section className="cta-crescendo" data-reveal>
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
        <img src="/assets/creator-kit-icon.png" alt="" data-icon-spin />
        <p className="module-label" style={{ justifyContent: "center" }}>
          04 / READY WHEN YOU ARE
        </p>
        <h2>
          <span className="crescendo-pop" data-crescendo>
            Your next useful file is a few taps away.
          </span>
        </h2>
        <p style={{ color: "var(--muted)", fontSize: "0.82rem" }}>
          Free to download. No subscription and no ad breaks.
        </p>
        <span className="crescendo-btn" style={{ display: "inline-flex" }}>
          <StoreButton />
        </span>
      </div>
    </section>
  );
}
