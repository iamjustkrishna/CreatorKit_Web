import { Component, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { failed: boolean };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(err: unknown) {
    console.warn("[scene] 3D canvas failed, falling back:", err);
    try {
      document.body.dataset.noWebgl = "true";
    } catch {
      /* ignore */
    }
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}
