import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { showcaseTools } from "../content";
import { Icon } from "./Icons";

export default function Showcase() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tool = showcaseTools[active];

  const select = (next: number, focus = false) => {
    setActive(next);
    if (focus) tabRefs.current[next]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = showcaseTools.length - 1;
    const keys: Record<string, number> = {
      ArrowRight: active === last ? 0 : active + 1,
      ArrowDown: active === last ? 0 : active + 1,
      ArrowLeft: active === 0 ? last : active - 1,
      ArrowUp: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    };
    const next = keys[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select(next, true);
  };

  return (
    <section className="showcase-section section-space" id="inside" aria-labelledby="inside-title">
      <div className="showcase-layout page-width">
        <div className="showcase-visual" data-reveal>
          <div className="showcase-image-wrap">
            <img
              key={tool.image}
              src={tool.image}
              alt={tool.alt}
              width="1080"
              height="2400"
              loading="lazy"
            />
          </div>
          <p className="screenshot-caption">A closer look at CreatorKit on Android</p>
        </div>
        <div className="showcase-copy" data-reveal>
          <p className="eyebrow">Made to feel at home on your phone</p>
          <h2 id="inside-title">Useful, without the busywork.</h2>
          <p className="showcase-intro">
            Start with the screen that matches what you need. The rest of the app
            stays close by.
          </p>
          <div
            className="tabs"
            role="tablist"
            aria-label="CreatorKit app screens"
            style={{ "--tab-index": active } as CSSProperties}
            onKeyDown={onKeyDown}
          >
            {showcaseTools.map((item, index) => (
              <button
                key={item.id}
                ref={(element) => { tabRefs.current[index] = element; }}
                id={`tab-${item.id}`}
                type="button"
                role="tab"
                tabIndex={index === active ? 0 : -1}
                aria-selected={index === active}
                aria-controls="tool-panel"
                onClick={() => select(index)}
              >
                <Icon name={item.icon} size={17} />
                {item.shortLabel}
              </button>
            ))}
          </div>
          <div
            className="tool-panel"
            id="tool-panel"
            role="tabpanel"
            aria-labelledby={`tab-${tool.id}`}
            key={tool.id}
          >
            <h3>{tool.title}</h3>
            <p>{tool.description}</p>
            <span>{tool.detail}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
