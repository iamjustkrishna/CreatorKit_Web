import { Component, type ReactNode } from "react";
import { setBoot } from "../core/boot";

type Props = { children: ReactNode };
type State = { failed: boolean };

/** If the 3D layer dies for any reason, the page keeps working without it. */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(err: unknown) {
    console.warn("[scene] 3D canvas failed, falling back:", err);
    try {
      document.body.dataset.noWebgl = "true";
      document.documentElement.classList.remove("gl-on");
    } catch {
      /* ignore */
    }
    // Never leave the intro gate waiting on a scene that will not come.
    setBoot({ sceneReady: true, webgl: false });
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}
