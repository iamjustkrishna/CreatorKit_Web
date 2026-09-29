import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { showcaseTools } from "../content";
import { selectTab } from "../scene/phoneState";
import { Icon } from "./Icons";

export default function Showcase() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tool = showcaseTools[active];

  const select = (next: number, focus = false) => {
    if (next === active) return;
    setActive(next);
    // The 3D phone reads the tab; the crossfade starts right away.
    selectTab(next);
    if (focus) tabRefs.current[next]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = showcaseTools.length - 1;
    const keys: Record<string, number> = {
      ArrowRight: active === last ? 0 : active + 1,
      ArrowDown: active === last ? 0 : active + 1,
      ArrowLeft: active === 0 ? last : active - 1,
      ArrowUp: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    };
    const next = keys[e.key];
    if (next === undefined) return;
    e.preventDefault();
    select(next, true);
  };

  return (
    <section className="showcase" id="showcase" data-chapter="showcase">
      <div
        className="showcase-stage"
        data-anchor="show-phone"
        data-tool={tool.id}
        role="img"
        aria-label={tool.alt}
      >
        <div className="phone-fallback" aria-hidden="true">
          {showcaseTools.map((t, i) => (
            <img
              key={t.id}
              className={i === active ? "is-active" : ""}
              src={t.image}
              alt=""
              width="1080"
              height="2400"
              loading="lazy"
            />
          ))}
        </div>
      </div>

      <div className="showcase-copy">
        <p className="module-label" data-label>
          02 / INSIDE THE APP
        </p>
        <h2 className="module-title" data-title>
          Your work stays uncomplicated.
        </h2>

        <div
          className="tabs"
          role="tablist"
          aria-label="CreatorKit feature previews"
          style={{ "--i": active } as CSSProperties}
          onKeyDown={onKeyDown}
          data-reveal
        >
          {showcaseTools.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              id={`tab-${t.id}`}
              type="button"
              role="tab"
              tabIndex={i === active ? 0 : -1}
              aria-selected={i === active}
              aria-controls="tool-panel"
              className={i === active ? "is-active" : ""}
              onClick={() => select(i)}
            >
              <Icon name={t.icon} size={18} />
              {t.shortLabel}
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
          <span className="tool-detail">{tool.detail}</span>
        </div>
      </div>
    </section>
  );
}
