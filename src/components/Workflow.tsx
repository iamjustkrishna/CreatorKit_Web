import { Icon, type IconName } from "./Icons";

const workflow: { icon: IconName; title: string; text: string }[] = [
  { icon: "video", title: "Extract", text: "Pull high-quality audio from a video." },
  { icon: "wave", title: "Enhance", text: "Reduce noise and bring the voice forward." },
  { icon: "captions", title: "Transcribe", text: "Turn English speech into editable text." },
  { icon: "folder", title: "Keep", text: "Play, share, and organize every output." },
];

export default function Workflow() {
  return (
    <section className="signal-journey" id="workflow">
      <div data-reveal>
        <p className="module-label">01 / SIGNAL PATH</p>
        <h2 className="module-title">Everything your audio needs, in one flow.</h2>
      </div>

      <div className="journey-grid" data-journey>
        <div className="journey-spine" aria-hidden="true">
          <div className="journey-progress" data-journey-progress />
          {workflow.map((step, i) => (
            <span
              key={step.title}
              className="beat-node"
              data-beat-node={i}
              style={{ left: `${12.5 + i * 25}%` }}
            />
          ))}
        </div>
        {workflow.map((step, index) => (
          <article className="module-card" key={step.title} data-journey-card>
            <div className="module-icon">
              <Icon name={step.icon} size={24} />
            </div>
            <div className="module-num">{String(index + 1).padStart(2, "0")}</div>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
