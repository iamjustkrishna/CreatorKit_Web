import { useState, type ReactNode } from "react";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=space.iamjustkrishna.creatorkit";
const GITHUB_URL = "https://github.com/iamjustkrishna/CreatorKit";
const PRIVACY_URL = "https://iamjustkrishna.github.io/privacy-policies/";

type IconName =
  | "spark"
  | "video"
  | "wave"
  | "captions"
  | "folder"
  | "shield"
  | "github"
  | "menu"
  | "close";

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

const workflow = [
  {
    icon: "video" as const,
    title: "Extract",
    text: "Pull high-quality audio from a video.",
  },
  {
    icon: "wave" as const,
    title: "Enhance",
    text: "Reduce noise and bring the voice forward.",
  },
  {
    icon: "captions" as const,
    title: "Transcribe",
    text: "Turn English speech into editable text.",
  },
  {
    icon: "folder" as const,
    title: "Keep",
    text: "Play, share, and organize every output.",
  },
];

function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  const paths: Record<IconName, ReactNode> = {
    spark: (
      <>
        <path d="M12 2.8 13.7 8l5.3 1.7-5.3 1.7L12 16.6l-1.7-5.2L5 9.7 10.3 8 12 2.8Z" />
        <path d="m19.2 15 .8 2.4 2.4.8-2.4.8-.8 2.4-.8-2.4-2.4-.8 2.4-.8.8-2.4Z" />
      </>
    ),
    video: (
      <>
        <path d="M4 5.5h10a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Z" />
        <path d="m16 9 5-2.5v11L16 15" />
      </>
    ),
    wave: (
      <>
        <path d="M3 12h2M19 12h2M7 8v8M10 4v16M14 6v12M17 9v6" />
      </>
    ),
    captions: (
      <>
        <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
        <path d="M6.5 11h4M13.5 11h4M6.5 15h6M15.5 15h2" />
      </>
    ),
    folder: (
      <path d="M3 6.8a2 2 0 0 1 2-2h4l2 2H19a2 2 0 0 1 2 2v8.4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6.8Z" />
    ),
    shield: (
      <>
        <path d="M12 3 20 6v5.5c0 4.8-3.2 7.8-8 9.5-4.8-1.7-8-4.7-8-9.5V6l8-3Z" />
        <path d="m8.5 12 2.2 2.2 4.8-5" />
      </>
    ),
    github: (
      <path d="M12 2.8a9.2 9.2 0 0 0-2.9 17.9c.5.1.6-.2.6-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 0 1.6 1.1 1.6 1.1.9 1.6 2.4 1.1 2.9.9.1-.7.4-1.1.7-1.4-2.2-.3-4.6-1.1-4.6-4.9 0-1.1.4-2 1-2.6-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.7 1a9.5 9.5 0 0 1 4.9 0c1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.6.7.7 1 1.5 1 2.6 0 3.8-2.3 4.7-4.6 4.9.4.3.7.9.7 1.8v2.6c0 .3.2.6.7.5A9.2 9.2 0 0 0 12 2.8Z" />
    ),
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),
  };

  return <svg {...common}>{paths[name]}</svg>;
}

function PlayStoreMark() {
  return (
    <svg
      viewBox="0 0 32 36"
      aria-hidden="true"
      className="play-mark"
      fill="none"
    >
      <path d="M1.8 1.6 18.5 18 1.9 34.4a4 4 0 0 1-.9-2.6V4.2c0-1 .3-1.9.8-2.6Z" fill="#00D1FF" />
      <path d="m18.5 18 5.4-5.3 6.1 3.5c1.4.8 1.4 2.8 0 3.6l-6.1 3.5-5.4-5.3Z" fill="#FFD54A" />
      <path d="M1.8 1.6A3.9 3.9 0 0 1 6.7.8l17.2 9.9-5.4 5.3L1.8 1.6Z" fill="#29E28B" />
      <path d="m18.5 20 5.4 5.3-17.2 9.9a3.9 3.9 0 0 1-4.8-.8L18.5 20Z" fill="#FF5B62" />
    </svg>
  );
}

function StoreButton({ compact = false }: { compact?: boolean }) {
  return (
    <a
      className={`store-button${compact ? " store-button--compact" : ""}`}
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Get CreatorKit on Google Play"
    >
      <PlayStoreMark />
      <span>
        <small>Get it on</small>
        Google Play
      </span>
    </a>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeToolId, setActiveToolId] =
    useState<ShowcaseTool["id"]>("extract");
  const activeTool =
    showcaseTools.find((tool) => tool.id === activeToolId) ?? showcaseTools[0];

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="site-header">
        <a className="brand" href="#top" onClick={closeMenu}>
          <img src="/assets/creator-kit-icon.png" alt="" />
          <span>CreatorKit</span>
        </a>

        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Icon name={menuOpen ? "close" : "menu"} />
        </button>

        <nav
          id="site-navigation"
          className={`site-nav${menuOpen ? " site-nav--open" : ""}`}
          aria-label="Main navigation"
        >
          <a href="#workflow" onClick={closeMenu}>
            What it does
          </a>
          <a href="#showcase" onClick={closeMenu}>
            Inside the app
          </a>
          <a href="#privacy" onClick={closeMenu}>
            Privacy
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            onClick={closeMenu}
          >
            GitHub
          </a>
          <StoreButton compact />
        </nav>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-copy">
            <div className="availability">
              <span className="availability-dot" />
              Free on Android
            </div>
            <h1>
              Stop watching ads.
              <br />
              Start creating.
            </h1>
            <p className="hero-lede">
              Extract audio, clean up vocals, and turn speech into text with
              one focused toolkit that keeps your media on your phone.
            </p>
            <div className="hero-actions">
              <StoreButton />
              <a
                className="text-link"
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="github" size={21} />
                Explore the source
              </a>
            </div>
            <p className="hero-note">No ads. No account. Android 10 and newer.</p>
          </div>

          <div className="hero-visual" aria-label="CreatorKit app preview">
            <div className="visual-glow" />
            <div className="phone phone--back" aria-hidden="true">
              <img
                src="/assets/screenshot-transcriber.png"
                alt=""
                width="1080"
                height="2400"
              />
            </div>
            <div className="phone phone--front">
              <img
                src="/assets/screenshot-extractor.png"
                alt="CreatorKit Audio Extractor interface"
                width="1080"
                height="2285"
              />
            </div>
            <div className="app-icon-orbit" aria-hidden="true">
              <img src="/assets/creator-kit-icon.png" alt="" />
            </div>
            <div className="floating-note floating-note--top">
              <Icon name="wave" size={19} />
              Vocal clarity
            </div>
            <div className="floating-note floating-note--bottom">
              <Icon name="shield" size={19} />
              Files stay local
            </div>
          </div>
        </section>

        <section className="declaration" aria-label="CreatorKit mission">
          <p>
            One pocket studio, built for the moment between an idea and a
            finished file.
          </p>
          <div className="declaration-facts">
            <span>Ad-free</span>
            <span>Open source</span>
            <span>Made for Android</span>
          </div>
        </section>

        <section className="workflow section-frame" id="workflow">
          <div className="section-heading">
            <p className="section-kicker">A shorter path from clip to creation</p>
            <h2>Everything your audio needs, in one flow.</h2>
          </div>

          <div className="signal-path">
            <div className="signal-line" aria-hidden="true">
              <span />
            </div>
            {workflow.map((step, index) => (
              <article className="signal-step" key={step.title}>
                <div className="signal-node">
                  <Icon name={step.icon} size={27} />
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="showcase section-frame" id="showcase">
          <div className="showcase-stage">
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

          <div className="showcase-content">
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

        <section className="privacy section-frame" id="privacy">
          <div className="privacy-mark" aria-hidden="true">
            <Icon name="shield" size={48} />
          </div>
          <div>
            <p className="section-kicker">Your files are not the product</p>
            <h2>The work happens on your device.</h2>
          </div>
          <div className="privacy-copy">
            <p>
              CreatorKit processes your selected media on your phone. Your
              recordings and videos are not uploaded to a conversion server.
            </p>
            <a href={PRIVACY_URL} target="_blank" rel="noreferrer">
              Read the privacy policy
            </a>
          </div>
        </section>

        <section className="final-cta section-frame">
          <div className="cta-wave" aria-hidden="true">
            {Array.from({ length: 28 }, (_, index) => (
              <span
                key={index}
                style={{ "--bar": `${18 + ((index * 29) % 68)}%` } as React.CSSProperties}
              />
            ))}
          </div>
          <div className="final-cta-content">
            <img src="/assets/creator-kit-icon.png" alt="" />
            <h2>Your next useful file is a few taps away.</h2>
            <p>Free to download. No subscription and no ad breaks.</p>
            <StoreButton />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand brand--footer" href="#top">
          <img src="/assets/creator-kit-icon.png" alt="" />
          <span>CreatorKit</span>
        </a>
        <p>Built for creators who would rather create.</p>
        <div className="footer-links">
          <a href={PRIVACY_URL} target="_blank" rel="noreferrer">
            Privacy
          </a>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="mailto:mastersimpleapps@gmail.com">Contact</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
