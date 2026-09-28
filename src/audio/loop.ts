// Continuous music loop manager — muted-first, seamless, fault-tolerant.

export const LOOP_URLS = [
  "/audio/creatorkit-loop.ogg",
  "/audio/creatorkit-loop.mp3",
];

const STORAGE_KEY = "creatorkit-sound";
const FADE_MS = 800;
const DUCK_GAIN = 0.06;

export function getStoredPreference(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    return false;
  }
}

export function setStoredPreference(on: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {
    /* private mode — ignore */
  }
}

export class AudioLoopManager {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private source: AudioBufferSourceNode | null = null;
  private buffer: AudioBuffer | null = null;
  private enabled = false;
  private ducked = false;
  private initPromise: Promise<void> | null = null;
  private onVisibility = () => {
    if (!this.ctx || !this.master) return;
    if (document.hidden) {
      this.ducked = true;
      this.master.gain.setTargetAtTime(
        DUCK_GAIN,
        this.ctx.currentTime,
        0.2,
      );
    } else if (this.enabled) {
      this.ducked = false;
      this.master.gain.setTargetAtTime(0.8, this.ctx.currentTime, 0.3);
    }
  };

  async init(urls: string[] = LOOP_URLS): Promise<void> {
    if (this.initPromise) return this.initPromise;
    this.initPromise = (async () => {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) throw new Error("WebAudio unavailable");
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0;
      this.analyserNode = this.ctx.createAnalyser();
      this.analyserNode.fftSize = 64;
      this.analyserNode.smoothingTimeConstant = 0.82;
      this.master.connect(this.analyserNode);
      this.analyserNode.connect(this.ctx.destination);

      let lastError: unknown = null;
      for (const url of urls) {
        try {
          const res = await fetch(url);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const bytes = await res.arrayBuffer();
          this.buffer = await this.ctx.decodeAudioData(bytes);
          lastError = null;
          break;
        } catch (err) {
          lastError = err;
        }
      }
      if (!this.buffer) throw lastError ?? new Error("Audio load failed");
      document.addEventListener("visibilitychange", this.onVisibility);
    })();
    return this.initPromise;
  }

  private ensureSource(): boolean {
    if (!this.ctx || !this.master || !this.buffer) return false;
    if (this.source) return true;
    try {
      this.source = this.ctx.createBufferSource();
      this.source.buffer = this.buffer;
      this.source.loop = true;
      this.source.connect(this.master);
      this.source.start(0);
      return true;
    } catch {
      this.source = null;
      return false;
    }
  }

  async setEnabled(on: boolean): Promise<void> {
    this.enabled = on;
    setStoredPreference(on);
    if (!on) {
      if (this.ctx && this.master) {
        this.master.gain.setTargetAtTime(
          0,
          this.ctx.currentTime,
          FADE_MS / 1000 / 3,
        );
      }
      return;
    }
    try {
      await this.init();
      if (!this.ctx || !this.master) return;
      await this.ctx.resume();
      if (!this.ensureSource()) return;
      const target = this.ducked || document.hidden ? DUCK_GAIN : 0.8;
      this.master.gain.setTargetAtTime(
        target,
        this.ctx.currentTime,
        FADE_MS / 1000 / 3,
      );
    } catch (err) {
      console.warn("[sound] unable to start loop:", err);
      this.enabled = false;
      setStoredPreference(false);
      throw err;
    }
  }

  getAnalyser(): AnalyserNode | null {
    return this.analyserNode;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  dispose() {
    document.removeEventListener("visibilitychange", this.onVisibility);
    try {
      this.source?.stop();
    } catch {
      /* already stopped */
    }
    void this.ctx?.close().catch(() => undefined);
    this.ctx = null;
    this.source = null;
  }
}

let singleton: AudioLoopManager | null = null;

export function getAudioManager(): AudioLoopManager {
  if (!singleton) singleton = new AudioLoopManager();
  return singleton;
}
