import { useState } from "react";
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
  const [activeToolId, setActiveToolId] =
    useState<ShowcaseTool["id"]>("extract");
  const activeTool =
    showcaseTools.find((tool) => tool.id === activeToolId) ?? showcaseTools[0];

  return (
    <section className="showcase section-frame" id="showcase">
      <div
        className="showcase-stage tilt"
        data-tool={activeTool.id}
        data-tilt
        data-reveal
      >
        <div className="showcase-screen">
          <div className="showcase-screen-bar" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <img
            key={activeTool.id}
            src={activeTool.image}
            alt={activeTool.alt}
            width="1080"
            height={activeTool.imageHeight}
          />
        </div>
        <div className="screen-aura" aria-hidden="true" />
      </div>

      <div className="showcase-content" data-reveal>
        <p className="section-kicker">A closer look</p>
        <h2>Your work stays uncomplicated.</h2>
        <div
          className="tool-tabs"
          role="tablist"
          aria-label="CreatorKit feature previews"
        >
          {showcaseTools.map((tool) => (
            <button
              key={tool.id}
              id={`tab-${tool.id}`}
              type="button"
              role="tab"
              aria-selected={activeTool.id === tool.id}
              aria-controls="tool-panel"
              className={activeTool.id === tool.id ? "is-active" : ""}
              onClick={() => setActiveToolId(tool.id)}
            >
              <Icon name={tool.icon} size={19} />
              {tool.shortLabel}
            </button>
          ))}
        </div>

        <div
          className="tool-panel"
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
