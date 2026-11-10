import { Icon } from "./Icons";

const features = [
  {
    icon: "video" as const,
    number: "01",
    title: "Extract audio",
    text: "Turn a supported video into an audio file. Choose MP3 for broad compatibility or M4A (AAC) for an efficient everyday format.",
    detail: "MP4 · MKV · AVI",
  },
  {
    icon: "wave" as const,
    number: "02",
    title: "Enhance vocals",
    text: "Give a voice recording a quick lift, then compare the original and enhanced versions before you save.",
    detail: "Listen before exporting",
  },
  {
    icon: "captions" as const,
    number: "03",
    title: "Transcribe English",
    text: "Turn supported English speech into a transcript right on your Android device.",
    detail: "On-device processing",
  },
  {
    icon: "folder" as const,
    number: "04",
    title: "Keep it together",
    text: "Play, share, and organize finished audio and transcripts in one local library.",
    detail: "Your files, your folders",
  },
];

const steps = [
  ["Choose", "Pick a video or audio file from your device."],
  ["Make", "Extract, enhance, or transcribe what you need."],
  ["Keep", "Find the result in your library and share it when ready."],
];

export default function Workflow() {
  return (
    <section className="features-section section-space" id="features" aria-labelledby="features-title">
      <div className="page-width">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">A few useful tools</p>
          <h2 id="features-title">The work around your audio, made simpler.</h2>
          <p>One small Android toolkit for the steps that usually get scattered across apps.</p>
        </div>

        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.number} data-reveal>
              <div className="feature-card-top">
                <span className="feature-icon"><Icon name={feature.icon} size={23} /></span>
                <span className="feature-number">{feature.number}</span>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
              <span className="feature-detail">{feature.detail}</span>
            </article>
          ))}
        </div>

        <div className="steps-panel" data-reveal>
          <div className="steps-heading">
            <p className="eyebrow">A calmer little workflow</p>
            <h3>From source file to something useful.</h3>
          </div>
          <ol className="steps-list">
            {steps.map(([title, text], index) => (
              <li key={title}>
                <span className="step-index">0{index + 1}</span>
                <div><h4>{title}</h4><p>{text}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
