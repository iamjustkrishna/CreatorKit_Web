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
    text: "Extract audio from a supported video.",
    tag: "EXTRACT",
    readout: "MP3 · M4A (AAC)",
  },
  {
    icon: "wave",
    title: "Enhance",
    text: "Boost and clarify a voice recording.",
    tag: "ENHANCE",
    readout: "Compare before saving",
  },
  {
    icon: "captions",
    title: "Transcribe",
    text: "Create an English transcript on-device.",
    tag: "TRANSCRIBE",
    readout: "English · On-device",
  },
  {
    icon: "folder",
    title: "Keep",
    text: "Play, share, and organize local files.",
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
    title: "Audio extraction, without the detour.",
    description:
      "Select a supported video, choose MP3 or M4A (AAC), and save the audio to your device.",
    detail: "Video formats: MP4, MKV, AVI",
    image: "/assets/screenshot-extractor.png",
    alt: "CreatorKit Audio Extractor screen with video selection and MP3 format controls",
    icon: "video",
  },
  {
    id: "transcribe",
    shortLabel: "Transcribe",
    title: "Keep the words, skip the retyping.",
    description:
      "Create an English transcript from supported audio or video, processed on your phone.",
    detail: "English speech · On-device",
    image: "/assets/screenshot-transcriber.png",
    alt: "CreatorKit AI Transcriber screen with audio and video file selection",
    icon: "captions",
  },
  {
    id: "organize",
    shortLabel: "Library",
    title: "Your finished work, in one place.",
    description:
      "Browse files by tool, play audio, open transcripts, and share or organize your exports.",
    detail: "Local media library",
    image: "/assets/screenshot-library.png",
    alt: "CreatorKit Library screen grouping files by tool",
    icon: "folder",
  },
];

export const articles = [
  {
    slug: "video-to-audio-on-android",
    title: "A straightforward way to get audio out of a video",
    summary:
      "A practical guide to choosing a video, picking MP3 or M4A, and keeping the exported file easy to find.",
    category: "A practical guide",
    readTime: "4 min read",
  },
  {
    slug: "enhance-a-voice-recording",
    title: "A better voice recording starts with a good listen",
    summary:
      "How to review a recording, try a vocal enhancement, and decide for yourself whether the result is better.",
    category: "Audio notes",
    readTime: "4 min read",
  },
  {
    slug: "transcribe-english-audio-offline",
    title: "Turn an English voice note into text on Android",
    summary:
      "A simple on-device transcription workflow, plus a few ways to make a source recording easier to follow.",
    category: "A practical guide",
    readTime: "5 min read",
  },
  {
    slug: "the-recording-that-waited",
    title: "The recording that waited until the train ride home",
    summary:
      "A fictional creator story about catching an idea, cleaning up the voice note, and letting a small tool stay small.",
    category: "A small story",
    readTime: "3 min read",
  },
];
