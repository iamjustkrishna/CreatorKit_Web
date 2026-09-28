import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getAudioManager,
  getStoredPreference,
  type AudioLoopManager,
} from "./loop";

type SoundState = {
  enabled: boolean;
  ready: boolean;
  toggle: () => void;
  getManager: () => AudioLoopManager;
  getAnalyser: () => AnalyserNode | null;
};

const SoundContext = createContext<SoundState | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [manager] = useState<AudioLoopManager>(() => getAudioManager());
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const prefersReduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    if (!getStoredPreference()) return;
    let cancelled = false;
    const unlock = () => {
      if (cancelled) return;
      manager
        .setEnabled(true)
        .then(() => {
          if (!cancelled) {
            setEnabled(true);
            setReady(true);
          }
        })
        .catch(() => {
          if (!cancelled) setReady(true);
        });
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [manager]);

  const toggle = useCallback(() => {
    const next = !enabled;
    setEnabled(next);
    manager
      .setEnabled(next)
      .then(() => setReady(true))
      .catch(() => {
        setEnabled(false);
        setReady(true);
      });
  }, [enabled, manager]);

  const value = useMemo<SoundState>(
    () => ({
      enabled,
      ready,
      toggle,
      getManager: () => manager,
      getAnalyser: () => manager.getAnalyser(),
    }),
    [enabled, ready, toggle, manager],
  );

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  );
}

export function useSound(): SoundState {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used inside SoundProvider");
  return ctx;
}
