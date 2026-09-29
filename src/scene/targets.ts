// Shape generators for the particle "signal". Every target has the same
// number of points and each is sorted by x, so point i sits at the same
// horizontal rank in every shape — morphs read as clean left-to-right flows
// instead of a random scramble.
//
//   0 ribbons   hero — flowing audio bands behind the phone
//   1 raw       a noisy waveform with hiss
//   2 clean     the same waveform, noise removed
//   3 text      lines of transcript with a caret
//   4 library   a tilted grid of file cards
//   5 halo      orbit rings around the showcase phone
//   6 orb       a calm sphere for the privacy moment
//   7 spokes    a radial equaliser for the closing CTA

export const TARGET_COUNT = 8;

type V3 = [number, number, number];

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Targets = {
  /** 8 position arrays, each count*3. */
  positions: Float32Array[];
  /** count*4: rank-ish, size, seed, colour seed. */
  rand: Float32Array;
};

export function buildTargets(count: number): Targets {
  const rnd = mulberry32(0xc2ea70);
  const gauss = () => {
    const u = Math.max(1e-6, rnd());
    const v = rnd();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(Math.PI * 2 * v);
  };

  const envelope = (x: number) =>
    0.32 + 0.68 * Math.abs(Math.sin(x * 1.15) * Math.sin(x * 0.41 + 1.3));

  // 0 — ribbons ---------------------------------------------------------
  const ribbons = [
    { y: 0.15, amp: 0.55, k: 0.55, z: -1.2, th: 0.06 },
    { y: -0.35, amp: 0.42, k: 0.8, z: -0.3, th: 0.05 },
    { y: 0.7, amp: 0.7, k: 0.4, z: -2.2, th: 0.08 },
    { y: -0.9, amp: 0.5, k: 0.65, z: 0.55, th: 0.04 },
    { y: 1.4, amp: 0.35, k: 0.9, z: -0.8, th: 0.05 },
  ];
  const gen0 = (n: number): V3[] =>
    Array.from({ length: n }, (_, i) => {
      const r = ribbons[i % ribbons.length];
      const x = (rnd() - 0.5) * 17;
      const y = r.y + Math.sin(x * r.k + r.y * 3) * r.amp * 0.4 + gauss() * r.th;
      return [x, y, r.z + gauss() * 0.08];
    });

  // 1 & 2 — waveform ----------------------------------------------------
  const cols = 240;
  const colAmp = Array.from({ length: cols }, () => rnd());
  const gen1 = (n: number): V3[] =>
    Array.from({ length: n }, (_, i) => {
      if (i % 4 === 0) {
        // hiss: scattered noise around the signal
        return [(rnd() - 0.5) * 10.4, gauss() * 0.95, gauss() * 0.5];
      }
      const c = Math.floor(rnd() * cols);
      const x = (c / cols - 0.5) * 9.4;
      const amp = envelope(x) * (0.35 + 0.65 * Math.pow(colAmp[c], 0.7)) * 1.45;
      return [x, (rnd() * 2 - 1) * amp, (rnd() - 0.5) * 0.15];
    });
  const gen2 = (n: number): V3[] =>
    Array.from({ length: n }, () => {
      const c = Math.floor(rnd() * cols);
      const x = (c / cols - 0.5) * 9.4;
      const amp = envelope(x) * 0.82 * 1.45;
      return [x + (rnd() - 0.5) * 0.02, (rnd() * 2 - 1) * amp, (rnd() - 0.5) * 0.08];
    });

  // 3 — transcript ------------------------------------------------------
  type Seg = { a: number; b: number; y: number };
  const segs: Seg[] = [];
  const lineCount = 6;
  for (let l = 0; l < lineCount; l++) {
    const y = 1.35 - l * 0.54;
    const limit = l === lineCount - 1 ? 0.6 : 3.7;
    let cursor = -3.7;
    while (cursor < limit) {
      const len = 0.35 + rnd() * 1.1;
      const b = Math.min(cursor + len, limit);
      if (b - cursor > 0.15) segs.push({ a: cursor, b, y });
      cursor = b + 0.18;
    }
  }
  const segLenTotal = segs.reduce((s, g) => s + (g.b - g.a), 0);
  const lastLine = segs.filter((s) => s.y === 1.35 - (lineCount - 1) * 0.54);
  const caretX = lastLine.length ? lastLine[lastLine.length - 1].b + 0.14 : 0;
  const gen3 = (n: number): V3[] =>
    Array.from({ length: n }, (_, i) => {
      if (i % 44 === 0) {
        return [caretX + gauss() * 0.01, 1.35 - (lineCount - 1) * 0.54 + (rnd() - 0.5) * 0.44, 0];
      }
      let pick = rnd() * segLenTotal;
      let seg = segs[0];
      for (const s of segs) {
        pick -= s.b - s.a;
        if (pick <= 0) {
          seg = s;
          break;
        }
      }
      return [seg.a + rnd() * (seg.b - seg.a), seg.y + (rnd() - 0.5) * 0.11, gauss() * 0.02];
    });

  // 4 — library grid ------------------------------------------------------
  const gen4 = (n: number): V3[] => {
    const cw = 1.75;
    const ch = 1.05;
    const px = 2.1;
    const py = 1.32;
    const tilt = -0.42;
    const cos = Math.cos(tilt);
    const sin = Math.sin(tilt);
    return Array.from({ length: n }, (_, i) => {
      const card = i % 9;
      const cx = ((card % 3) - 1) * px;
      const cy = (1 - Math.floor(card / 3)) * py;
      let x: number;
      let y: number;
      if (rnd() < 0.5) {
        // outline
        const s = rnd() * 2 * (cw + ch);
        if (s < cw) {
          x = -cw / 2 + s;
          y = ch / 2;
        } else if (s < cw + ch) {
          x = cw / 2;
          y = ch / 2 - (s - cw);
        } else if (s < 2 * cw + ch) {
          x = cw / 2 - (s - cw - ch);
          y = -ch / 2;
        } else {
          x = -cw / 2;
          y = -ch / 2 + (s - 2 * cw - ch);
        }
      } else {
        const r = rnd();
        if (r < 0.28) {
          // small icon block
          x = -0.76 + rnd() * 0.32;
          y = 0.2 + rnd() * 0.18;
        } else {
          const line = Math.floor(rnd() * 3);
          const len = [1.3, 0.9, 1.1][line];
          x = -0.76 + rnd() * len;
          y = -0.02 - line * 0.2 + (rnd() - 0.5) * 0.045;
        }
      }
      const gx = cx + x;
      const z = ((card % 3) - 1) * 0.28 + gauss() * 0.02;
      return [gx * cos + z * sin * 0.5, cy + y, -gx * sin * 0.5 + z * cos];
    });
  };

  // 5 — halo rings ------------------------------------------------------
  const ring = (R: number, tube: number, tiltX: number, tiltZ: number): V3 => {
    const a = rnd() * Math.PI * 2;
    const r = R + gauss() * tube;
    let x = Math.cos(a) * r;
    let y = Math.sin(a) * r;
    let z = gauss() * tube * 1.2;
    // tilt about X then about Z
    const y1 = y * Math.cos(tiltX) - z * Math.sin(tiltX);
    const z1 = y * Math.sin(tiltX) + z * Math.cos(tiltX);
    y = y1;
    z = z1;
    const x2 = x * Math.cos(tiltZ) - y * Math.sin(tiltZ);
    const y2 = x * Math.sin(tiltZ) + y * Math.cos(tiltZ);
    x = x2;
    y = y2;
    return [x, y, z];
  };
  const gen5 = (n: number): V3[] =>
    Array.from({ length: n }, () => {
      const r = rnd();
      if (r < 0.55) return ring(2.7, 0.05, 1.15, 0.18);
      if (r < 0.8) return ring(3.5, 0.06, 0.6, -0.35);
      if (r < 0.92) return ring(2.1, 0.04, -0.85, 0.5);
      const d = 4.6 * Math.cbrt(rnd());
      const th = rnd() * Math.PI * 2;
      const ph = Math.acos(2 * rnd() - 1);
      return [d * Math.sin(ph) * Math.cos(th), d * Math.sin(ph) * Math.sin(th), d * Math.cos(ph)];
    });

  // 6 — orb -------------------------------------------------------------
  const gen6 = (n: number): V3[] =>
    Array.from({ length: n }, (_, i) => {
      if (rnd() < 0.24) return ring(2.45, 0.025, 0.5, 0.2);
      const k = (i + 0.5) / n;
      const phi = Math.acos(1 - 2 * k);
      const th = Math.PI * (1 + Math.sqrt(5)) * i;
      const R = 1.75 + gauss() * 0.012;
      return [R * Math.sin(phi) * Math.cos(th), R * Math.cos(phi), R * Math.sin(phi) * Math.sin(th)];
    });

  // 7 — spokes ----------------------------------------------------------
  const spokes = 96;
  const gen7 = (n: number): V3[] =>
    Array.from({ length: n }, () => {
      const r = rnd();
      if (r < 0.3) {
        const R = [2.2, 2.45, 3.2][Math.floor(rnd() * 3)];
        const a = rnd() * Math.PI * 2;
        return [Math.cos(a) * R, Math.sin(a) * R, gauss() * 0.02];
      }
      const s = Math.floor(rnd() * spokes);
      const a = (s / spokes) * Math.PI * 2 + gauss() * 0.004;
      const rad = 2.3 + rnd() * 0.35;
      return [Math.cos(a) * rad, Math.sin(a) * rad, gauss() * 0.02];
    });

  const generators = [gen0, gen1, gen2, gen3, gen4, gen5, gen6, gen7];
  const positions = generators.map((gen) => {
    const pts = gen(count);
    pts.sort((p, q) => p[0] - q[0]);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = pts[i][0];
      arr[i * 3 + 1] = pts[i][1];
      arr[i * 3 + 2] = pts[i][2];
    }
    return arr;
  });

  const rand = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    const hot = rnd() < 0.07;
    rand[i * 4] = 0.86 * (i / count) + 0.14 * rnd();
    rand[i * 4 + 1] = hot ? 2.1 + rnd() * 0.8 : 0.55 + rnd() * 0.95;
    rand[i * 4 + 2] = rnd();
    rand[i * 4 + 3] = rnd();
  }

  return { positions, rand };
}
