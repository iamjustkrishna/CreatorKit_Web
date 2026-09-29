// Quality tiers. Desktop-class devices get the full scene; phones and modest
// laptops get fewer particles, a lower pixel ratio and no reflections.

export type Tier = "high" | "low";

export type TierConfig = {
  tier: Tier;
  points: number;
  dpr: [number, number];
  antialias: boolean;
  environment: boolean;
  terrainSegments: [number, number];
  nebulaOctaves: number;
  /** Speed of the ambient background motion. Deliberately slow and dreamy. */
  motion: number;
};

const CONFIG: Record<Tier, TierConfig> = {
  high: {
    tier: "high",
    points: 14000,
    dpr: [1, 1.75],
    antialias: true,
    environment: true,
    terrainSegments: [96, 56],
    nebulaOctaves: 5,
    motion: 0.36,
  },
  low: {
    tier: "low",
    points: 3600,
    dpr: [1, 1.25],
    antialias: false,
    environment: false,
    terrainSegments: [56, 30],
    nebulaOctaves: 2,
    motion: 0.26,
  },
};

export function detectTier(): TierConfig {
  if (typeof window === "undefined") return CONFIG.high;
  const nav = navigator as Navigator & { deviceMemory?: number };
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.innerWidth < 820;
  const cores = nav.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;
  const modest = cores <= 4 || memory <= 4;
  return CONFIG[coarse || narrow || modest ? "low" : "high"];
}

export function webglAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl2") || c.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

export function saveDataEnabled(): boolean {
  if (typeof navigator === "undefined") return false;
  return (
    (navigator as unknown as { connection?: { saveData?: boolean } }).connection
      ?.saveData === true
  );
}
