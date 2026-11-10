const WORDS = [
  "Extract",
  "Enhance",
  "Transcribe",
  "Keep",
  "Ad-free",
  "No account",
  "On-device",
];

function Star() {
  return (
    <svg className="marquee-star" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 1.5 14 10l8.5 2-8.5 2-2 8.5-2-8.5-8.5-2 8.5-2L12 1.5Z" fill="currentColor" />
    </svg>
  );
}

/** Decorative type band. Speeds up with scroll velocity (see motion/choreo). */
export default function Marquee() {
  const row = (suffix: string) =>
    WORDS.map((word) => (
      <span className="marquee-item" key={`${suffix}-${word}`}>
        <span>{word}</span>
        <Star />
      </span>
    ));

  return (
    <div className="marquee" aria-hidden="true" data-marquee>
      <div className="marquee-track" data-marquee-track>
        <div className="marquee-group">{row("a")}</div>
        <div className="marquee-group">{row("b")}</div>
      </div>
    </div>
  );
}
