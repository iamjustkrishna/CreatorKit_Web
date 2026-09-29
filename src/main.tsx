import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "@fontsource-variable/martian-mono/wght.css";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/hud.css";

const root = document.documentElement;
root.classList.add("js-motion");
// Touch devices scroll natively (compositor thread). Anything that has to be
// re-positioned from JavaScript while scrolling lags behind it and shakes, so
// touch gets a native-scroll profile: CSS-sticky pin, in-page phone, no Lenis.
if (window.matchMedia("(pointer: coarse)").matches) {
  root.classList.add("is-touch");
}
// Hero elements start hidden (only when motion is allowed) so the entrance
// can play from a clean slate. choreo removes this; a timer backs it up.
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  root.classList.add("will-intro");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
