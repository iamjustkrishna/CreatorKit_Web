import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { SoundProvider } from "./audio/SoundContext";
import "./styles/tokens.css";
import "./styles.css";
import "./styles/scene.css";
import "./styles/motion.css";

document.documentElement.classList.add("js-motion");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SoundProvider>
      <App />
    </SoundProvider>
  </StrictMode>,
);
