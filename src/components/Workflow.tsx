import { Icon, type IconName } from "./Icons";

const workflow: { icon: IconName; title: string; text: string }[] = [
  { icon: "video", title: "Extract", text: "Pull high-quality audio from a video." },
  { icon: "wave", title: "Enhance", text: "Reduce noise and bring the voice forward." },
  { icon: "captions", title: "Transcribe", text: "Turn English speech into editable text." },
  { icon: "folder", title: "Keep", text: "Play, share, and organize every output." },
];

export default function Workflow() {
  return (
    <section className="workflow section-frame" id="workflow">
      <div className="section-heading" data-reveal>
        <p className="section-kicker">A shorter path from clip to creation</p>
        <h2>Everything your audio needs, in one flow.</h2>
      </div>

      <div className="signal-path" data-workflow>
        <div className="signal-line" aria-hidden="true">
          <svg
            className="signal-svg"
            viewBox="0 0 1000 8"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <line
              x1="0"
              y1="4"
              x2="1000"
              y2="4"
              className="signal-track"
              strokeWidth="2"
            />
            <line
              x1="0"
              y1="4"
              x2="1000"
              y2="4"
              className="signal-draw"
              strokeWidth="3"
            />
          </svg>
          <span />
        </div>
        {workflow.map((step, index) => (
          <article className="signal-step" key={step.title} data-reveal>
            <div className="signal-node" data-tilt-card>
              <Icon name={step.icon} size={27} />
              <span>{String(index + 1).padStart(2, "0")}</span>
            </div>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
