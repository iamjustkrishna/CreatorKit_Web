import { useRef, useState } from "react";
import { Icon, type IconName } from "./Icons";

type ShowcaseTool = {
  id: "extract" | "transcribe" | "organize";
  shortLabel: string;
  title: string;
  description: string;
  detail: string;
  image: string;
  imageHeight: number;
  alt: string;
  icon: IconName;
};

const showcaseTools: ShowcaseTool[] = [
  {
    id: "extract",
    shortLabel: "Extract",
    title: "Turn video into clean audio.",
    description:
      "Choose the format that fits your workflow, from compact M4A to widely compatible MP3 and WAV.",
    detail: "MP3, M4A, AAC and WAV",
    image: "/assets/screenshot-extractor.png",
    imageHeight: 2285,
    alt: "CreatorKit Audio Extractor screen with format and processing controls",
    icon: "video",
  },
  {
    id: "transcribe",
    shortLabel: "Transcribe",
    title: "Make spoken ideas editable.",
    description:
      "Select audio or video and turn English speech into a transcript you can read, edit, and reuse.",
    detail: "On-device Moonshine ASR",
    image: "/assets/screenshot-transcriber.png",
    imageHeight: 2400,
    alt: "CreatorKit AI Transcriber screen with recent transcripts",
    icon: "captions",
  },
  {
    id: "organize",
    shortLabel: "Organize",
    title: "Keep every output in reach.",
    description:
      "Browse exports by tool, play finished audio, open transcripts, share files, or move them into your own folders.",
    detail: "One local media library",
    image: "/assets/screenshot-library.png",
    imageHeight: 2400,
    alt: "CreatorKit Library screen grouping transcripts and enhanced audio",
    icon: "folder",
  },
];

export default function Showcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [leaving, setLeaving] = useState<ShowcaseTool | null>(null);
  const timer = useRef(0);
  const activeTool = showcaseTools[activeIndex];

  const select = (next: number) => {
    if (next === activeIndex) return;
    setDirection(next > activeIndex ? 1 : -1);
    setLeaving(showcaseTools[activeIndex]);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setLeaving(null), 250);
    setActiveIndex(next);
  };

  const inClass = direction === 1 ? "slide-in-right" : "slide-in-left";
  const outClass = direction === 1 ? "slide-out-left" : "slide-out-right";

  return (
    <section className="showcase-cine" id="showcase">
      <div className="stage-frame" data-reveal data-tool={activeTool.id}>
        <div className="stage-screen tilt" data-tilt>
          {leaving && (
            <img
              src={leaving.image}
              alt=""
              aria-hidden="true"
              width="1080"
              height={leaving.imageHeight}
              className={outClass}
            />
          )}
          <img
            key={activeTool.id}
            src={activeTool.image}
            alt={activeTool.alt}
            width="1080"
            height={activeTool.imageHeight}
            className={inClass}
          />
        </div>
        <div className="screen-aura" aria-hidden="true" />
      </div>

      <div data-reveal>
        <p className="module-label">02 / INSIDE THE APP</p>
        <h2 className="module-title">Your work stays uncomplicated.</h2>
        <div
          className="console-tabs"
          role="tablist"
          aria-label="CreatorKit feature previews"
        >
          {showcaseTools.map((tool, i) => (
            <button
              key={tool.id}
              id={`tab-${tool.id}`}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-controls="tool-panel"
              className={i === activeIndex ? "is-active" : ""}
              onClick={() => select(i)}
            >
              <Icon name={tool.icon} size={18} />
              {tool.shortLabel}
            </button>
          ))}
        </div>

        <div
          className="tool-detail"
          id="tool-panel"
          role="tabpanel"
          aria-labelledby={`tab-${activeTool.id}`}
          key={`panel-${activeTool.id}`}
        >
          <h3>{activeTool.title}</h3>
          <p>{activeTool.description}</p>
          <span>{activeTool.detail}</span>
        </div>
      </div>
    </section>
  );
}
