import type { ReactNode } from "react";

export type IconName =
  | "spark"
  | "video"
  | "wave"
  | "captions"
  | "folder"
  | "shield"
  | "github"
  | "menu"
  | "close";

export function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
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
