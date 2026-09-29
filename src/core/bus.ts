// A small shared "ambient" signal read by the scene. It is a slow, gentle
// breathing — not a beat — that gives the radial equaliser and terrain
// something to do. Deliberately calm: no fast pulses anywhere.

export const BIN_COUNT = 32;

export const bus = {
  bass: 0,
  mid: 0,
  high: 0,
  level: 0,
  bins: new Float32Array(BIN_COUNT),
  time: 0,
};

function follow(current: number, target: number, rate: number) {
  return current + (target - current) * rate;
}

export function updateBus(nowSec: number) {
  bus.time = nowSec;
  const t = nowSec;
  bus.bass = follow(bus.bass, 0.22 + 0.07 * Math.sin(t * 0.55), 0.06);
  bus.mid = follow(bus.mid, 0.26 + 0.05 * Math.sin(t * 0.8 + 1.3), 0.06);
  bus.high = follow(bus.high, 0.18 + 0.04 * Math.sin(t * 1.1 + 2.1), 0.06);
  bus.level = bus.bass * 0.5 + bus.mid * 0.35 + bus.high * 0.15;
  for (let i = 0; i < BIN_COUNT; i++) {
    const u = i / BIN_COUNT;
    const target =
      (0.3 - u * 0.19) * (0.7 + 0.3 * Math.sin(t * 0.5 + i * 0.32)) +
      0.06 * (0.5 + 0.5 * Math.sin(t * 0.85 + i * 0.75));
    bus.bins[i] = follow(bus.bins[i], target, 0.05);
  }
}
