import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "@fontsource-variable/martian-mono/wght.css";
import "./styles/site.css";

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

if (import.meta.env.DEV) {
  createRoot(root).render(app);
} else {
  hydrateRoot(root, app);
}
