// Page copy that is shared between components and the motion layer.

import type { IconName } from "./components/Icons";

export const workflow: {
  icon: IconName;
  title: string;
  text: string;
  tag: string;
  readout: string;
}[] = [
  {
    icon: "video",
    title: "Extract",
    text: "Pull high-quality audio from a video.",
    tag: "SOURCE",
    readout: "MP3 · M4A · AAC · WAV",
  },
  {
    icon: "wave",
    title: "Enhance",
    text: "Reduce noise and bring the voice forward.",
    tag: "CLEAN",
    readout: "Noise down · Voice up",
  },
  {
    icon: "captions",
    title: "Transcribe",
    text: "Turn English speech into editable text.",
    tag: "TEXT",
    readout: "English · On-device",
  },
  {
    icon: "folder",
    title: "Keep",
    text: "Play, share, and organize every output.",
    tag: "LIBRARY",
    readout: "One local library",
  },
];

export type ShowcaseTool = {
  id: "extract" | "transcribe" | "organize";
  shortLabel: string;
  title: string;
  description: string;
  detail: string;
  image: string;
  alt: string;
  icon: IconName;
};

export const showcaseTools: ShowcaseTool[] = [
  {
    id: "extract",
    shortLabel: "Extract",
    title: "Turn video into clean audio.",
    description:
      "Choose the format that fits your workflow, from compact M4A to widely compatible MP3 and WAV.",
    detail: "MP3, M4A, AAC and WAV",
    image: "/assets/screenshot-extractor.png",
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
    alt: "CreatorKit Library screen grouping transcripts and enhanced audio",
    icon: "folder",
  },
];
