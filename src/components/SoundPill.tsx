import { useSound } from "../audio/SoundContext";

export default function SoundPill({ floating = false }: { floating?: boolean }) {
  const { enabled, toggle } = useSound();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? "Turn sound off" : "Turn sound on"}
      title={enabled ? "Mute the soundtrack" : "Play the CreatorKit soundtrack"}
      className={`sound-pill${floating ? " sound-pill--floating" : ""}${enabled ? " is-on" : ""}`}
    >
      <span className="sound-bars" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
      {enabled ? "Sound on" : "Sound off"}
    </button>
  );
}
