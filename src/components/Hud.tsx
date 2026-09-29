import { useEffect, useRef } from "react";
import { CHAPTERS } from "../core/chapters";
import { onFrame } from "../core/scroll";
import { story } from "../core/story";

const LABELS: Record<string, string> = {
  hero: "INTRO",
  story: "STORY",
  workflow: "SIGNAL",
  showcase: "APP",
  privacy: "PRIVATE",
  cta: "FINALE",
};

/**
 * Quiet studio-console furniture: a scroll progress line and, on wide
 * screens, a chapter readout. Only touches the DOM when something changes.
 */
export default function Hud() {
  const chapter = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const dots = useRef<HTMLUListElement>(null);

  useEffect(() => {
    let lastChapter = -1;
    let lastProgress = -1;
    return onFrame(() => {
      if (Math.abs(story.progress - lastProgress) > 0.0005) {
        lastProgress = story.progress;
        if (bar.current) bar.current.style.transform = `scaleX(${story.progress.toFixed(4)})`;
      }
      if (lastChapter !== story.chapterIndex) {
        lastChapter = story.chapterIndex;
        if (chapter.current) {
          chapter.current.textContent = `${String(story.chapterIndex + 1).padStart(2, "0")} / ${String(CHAPTERS.length).padStart(2, "0")} · ${LABELS[story.chapter]}`;
        }
        dots.current?.querySelectorAll("li").forEach((li, i) => {
          li.classList.toggle("is-active", i === story.chapterIndex);
        });
      }
    });
  }, []);

  return (
    <>
      <div className="progress-line" aria-hidden="true">
        <div ref={bar} />
      </div>

      <aside className="hud hud--right" aria-hidden="true">
        <span className="hud-chapter" ref={chapter}>
          01 / 06 · INTRO
        </span>
        <ul className="hud-dots" ref={dots}>
          {CHAPTERS.map((c, i) => (
            <li key={c} className={i === 0 ? "is-active" : ""} />
          ))}
        </ul>
      </aside>
    </>
  );
}
