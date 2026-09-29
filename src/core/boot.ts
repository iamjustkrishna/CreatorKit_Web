// Tiny external store for the boot sequence: is the scene ready, has the
// loader finished opening.

import { useSyncExternalStore } from "react";

export type BootState = {
  /** WebGL scene drew its first frames (or 3D is disabled — then true). */
  sceneReady: boolean;
  /** The loader is showing and the page is locked behind it. */
  gateOpen: boolean;
  /** The loader finished; the hero may play. */
  entered: boolean;
  /** Whether a WebGL scene will be mounted at all. */
  webgl: boolean;
};

function initialGate(): boolean {
  if (typeof window === "undefined") return false;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let entered = false;
  try {
    entered = sessionStorage.getItem("ck-entered") === "1";
  } catch {
    /* storage blocked */
  }
  return !reduced && !entered;
}

let state: BootState = {
  sceneReady: false,
  gateOpen: initialGate(),
  entered: false,
  webgl: true,
};

const listeners = new Set<() => void>();

export function setBoot(patch: Partial<BootState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

export function getBoot(): BootState {
  return state;
}

export function useBoot(): BootState {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
    () => state,
  );
}
