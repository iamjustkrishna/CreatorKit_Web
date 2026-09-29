// GLSL for the scene. WebGL2 only (three r186), so GLSL ES 3.0 features like
// dynamic uniform-array indexing and derivatives are safe.

// ---------------------------------------------------------------------
// Signal: 14k GPU-morphing particles
// ---------------------------------------------------------------------
export const signalVertex = /* glsl */ `
  uniform float uTime;
  uniform float uClock;
  uniform float uMorph;
  uniform float uIntro;
  uniform float uBass;
  uniform float uMid;
  uniform float uCalm;
  uniform float uSize;
  uniform float uPx;
  uniform vec3 uPointer;
  uniform vec4 uWave;
  uniform float uBins[32];
  uniform vec3 uC0;
  uniform vec3 uC1;
  uniform vec3 uC2;

  attribute vec3 aP1;
  attribute vec3 aP2;
  attribute vec3 aP3;
  attribute vec3 aP4;
  attribute vec3 aP5;
  attribute vec3 aP6;
  attribute vec3 aP7;
  attribute vec4 aRand;

  varying vec3 vColor;
  varying float vAlpha;

  mat2 rot(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat2(c, -s, s, c);
  }

  vec3 pickTarget(int i) {
    if (i <= 0) return position;
    if (i == 1) return aP1;
    if (i == 2) return aP2;
    if (i == 3) return aP3;
    if (i == 4) return aP4;
    if (i == 5) return aP5;
    if (i == 6) return aP6;
    return aP7;
  }

  // Per-shape life: what each state does while it holds still.
  vec3 animateState(int s, vec3 p, float seed) {
    float t = uTime;
    if (s == 0) {
      float amp = (0.18 + 0.22 * abs(p.y)) * (0.55 + uBass * 1.5);
      p.y += sin(p.x * 0.55 - t * 1.1 + seed * 3.0) * amp;
      p.z += cos(p.x * 0.4 - t * 0.7) * 0.25 * (0.5 + uMid);
    } else if (s == 1) {
      // A slow shimmer, not a flicker: fast per-point noise reads as jitter.
      float flick = sin(t * 1.6 + p.x * 3.0 + seed * 40.0);
      p.y *= 1.0 + 0.1 * flick * (0.4 + uMid);
    } else if (s == 2) {
      p.y *= 1.0 + 0.05 * sin(t * 2.0 + p.x * 1.1) + uBass * 0.28;
    } else if (s == 3) {
      p.z += sin(t * 1.3 + p.y * 3.0 + seed * 6.0) * 0.03;
      p.x += 0.02 * sin(t * 3.0 + seed * 20.0) * uMid;
    } else if (s == 4) {
      p.z += sin(t * 0.8 + p.x * 0.6 + p.y * 0.9) * 0.1;
      p.xy *= 1.0 + uBass * 0.03;
    } else if (s == 5) {
      p.xz = rot(t * 0.2) * p.xz;
      p *= 1.0 + uBass * 0.06;
    } else if (s == 6) {
      p.xz = rot(t * 0.09) * p.xz;
      p *= 1.0 + 0.025 * sin(t * 0.7 + p.y) + uBass * 0.015;
    } else {
      float len = length(p.xy);
      float tt = clamp((len - 2.3) / 0.35, 0.0, 1.0);
      float a = abs(atan(p.x, p.y)) / 3.14159265;
      int bi = int(min(a * 31.99, 31.0));
      float lv = uBins[bi];
      float grown = len + tt * lv * 2.1;
      p.xy *= grown / max(len, 0.0001);
      p.xy = rot(t * 0.05) * p.xy;
    }
    return p;
  }

  void main() {
    float seed = aRand.z;
    float m = clamp(uMorph, 0.0, 7.0);
    float seg = min(floor(m), 6.0);
    float f = m - seg;

    // Rank-staggered morph: the change sweeps across the shape left to right.
    float ff = clamp(f * 1.7 - aRand.x * 0.7, 0.0, 1.0);
    ff = ff * ff * (3.0 - 2.0 * ff);

    int si = int(seg);
    vec3 a = animateState(si, pickTarget(si), seed);
    vec3 b = animateState(si + 1, pickTarget(si + 1), seed);
    vec3 p = mix(a, b, ff);

    // Points travel on arcs, not straight lines.
    float arc = sin(ff * 3.14159265);
    p += vec3(seed - 0.5, aRand.y - 1.0, fract(seed * 7.3) - 0.5) * vec3(1.4, 0.9, 2.2) * arc * 0.9;

    // Enter: points fly in from dust.
    float ii = clamp(uIntro * 1.7 - aRand.x * 0.7, 0.0, 1.0);
    ii = 1.0 - pow(1.0 - ii, 3.0);
    vec3 dust = normalize(vec3(fract(seed * 13.1) - 0.5, fract(seed * 57.7) - 0.5, fract(seed * 91.3) - 0.5) + 0.0001)
      * (5.0 + fract(seed * 3.7) * 7.0);
    p = mix(dust, p, ii);

    // Pointer pushes nearby points away.
    vec2 dp = p.xy - uPointer.xy;
    float pr = length(dp);
    float push = uPointer.z * smoothstep(1.7, 0.0, pr);
    p.xy += (dp / (pr + 0.001)) * push * 0.32;
    p.z += push * 0.25;

    // Click shockwave.
    if (uWave.w > 0.5) {
      float age = uClock - uWave.z;
      vec2 dw = p.xy - uWave.xy;
      float rw = length(dw);
      float band = (rw - age * 6.5) * 1.6;
      float ring = exp(-band * band) * exp(-age * 1.4);
      p.xy += dw / (rw + 0.001) * ring * 0.7;
      p.z += ring * 0.7;
    }

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float depth = max(0.5, -mv.z);
    float size = uSize * aRand.y * (1.0 + uBass * 0.5) * ii;
    gl_PointSize = clamp(size * uPx / depth, 1.0, 46.0);

    float w = aRand.w;
    vColor = w < 0.5 ? uC0 : (w < 0.82 ? uC1 : uC2);
    float fog = smoothstep(26.0, 5.0, depth);
    vAlpha = fog * (0.55 + 0.45 * fract(seed * 5.1)) * (1.0 - 0.5 * uCalm) * clamp(ii * 2.0, 0.0, 1.0);
  }
`;

export const signalFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a = a * a * (1.0 + 1.6 * smoothstep(0.22, 0.0, d));
    vec3 col = vColor * (0.85 + 1.5 * smoothstep(0.2, 0.0, d));
    gl_FragColor = vec4(col, a * vAlpha);
    #include <colorspace_fragment>
  }
`;

// ---------------------------------------------------------------------
// Nebula: full-screen domain-warped noise, replaces the hard-edged aurora
// ---------------------------------------------------------------------
export const nebulaVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.9999, 1.0);
  }
`;

export const nebulaFragment = (octaves: number) => /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uAspect;
  uniform float uCalm;
  uniform float uProgress;
  uniform vec2 uPointer;
  uniform vec3 uA;
  uniform vec3 uB;
  uniform vec3 uC;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < ${octaves}; i++) {
      v += a * noise(p);
      p = p * 2.02 + vec2(7.3, 1.7);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
    p += uPointer * 0.035;
    float t = uTime * 0.028;
    float n = fbm(p * 1.5 + vec2(t, -t * 0.7));
    float n2 = fbm(p * 2.7 - vec2(t * 0.8, t) + n * 0.9);
    float band = smoothstep(0.24, 0.92, n * 0.6 + n2 * 0.5);

    vec3 col = mix(uA, uB, smoothstep(-0.5, 0.55, p.x + n2 * 0.5));
    col = mix(col, uC, smoothstep(0.05, 0.65, -p.y + uProgress * 0.4 + n * 0.4) * 0.55);

    float vig = smoothstep(1.3, 0.2, length(p));
    float a = band * 0.22 * (0.5 + 0.5 * vig) * (1.0 - 0.45 * uCalm);
    gl_FragColor = vec4(col, a);
    #include <colorspace_fragment>
  }
`;

// ---------------------------------------------------------------------
// Phone screen: two screenshots with a noisy glowing wipe between them
// ---------------------------------------------------------------------
export const screenVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const screenFragment = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D uA;
  uniform sampler2D uB;
  uniform float uMix;
  uniform float uAspect;
  uniform float uAspectA;
  uniform float uAspectB;

  // object-fit: cover, aligned to the top like the DOM version.
  vec2 cover(vec2 uv, float texAspect) {
    float k = uAspect / texAspect;
    vec2 s = k > 1.0 ? vec2(1.0, 1.0 / k) : vec2(k, 1.0);
    vec2 o = vec2((1.0 - s.x) * 0.5, 1.0 - s.y);
    return uv * s + o;
  }

  float sdRoundRect(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  void main() {
    vec4 A = texture2D(uA, cover(vUv, uAspectA));
    vec4 B = texture2D(uB, cover(vUv, uAspectB));

    // A clean, soft top-to-bottom crossfade: no noise, no glowing edge.
    float edge = uMix * 1.5 - (1.0 - vUv.y) * 0.5;
    float m = smoothstep(0.0, 0.5, edge);
    vec3 col = mix(A.rgb, B.rgb, m);

    // A fixed glass sheen. It never moves, so it never shimmers.
    float s = vUv.x * 0.7 + vUv.y * 0.5 + 0.1;
    col += exp(-pow((fract(s) - 0.5) * 4.6, 2.0)) * 0.04;

    vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
    float d = sdRoundRect(p, vec2(uAspect * 0.5, 0.5), 0.085);
    float mask = 1.0 - smoothstep(-0.004, 0.004, d);
    gl_FragColor = vec4(col, mask);
    #include <colorspace_fragment>
  }
`;

// ---------------------------------------------------------------------
// Soft radial glow behind the phone
// ---------------------------------------------------------------------
export const glowVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const glowFragment = /* glsl */ `
  varying vec2 vUv;
  uniform vec3 uColor;
  uniform float uIntensity;
  void main() {
    float d = length(vUv - 0.5) * 2.0;
    float a = pow(clamp(1.0 - d, 0.0, 1.0), 2.4) * uIntensity;
    gl_FragColor = vec4(uColor, a);
    #include <colorspace_fragment>
  }
`;

// ---------------------------------------------------------------------
// Spectrogram terrain for the closing crescendo
// ---------------------------------------------------------------------
export const terrainVertex = /* glsl */ `
  uniform sampler2D uSpec;
  uniform float uHead;
  uniform float uRows;
  uniform float uAmp;
  varying vec2 vUv;
  varying float vH;
  varying float vDepth;

  float sampleRow(float row, float x) {
    return texture2D(uSpec, vec2(x, (row + 0.5) / uRows)).r;
  }

  void main() {
    vUv = uv;
    float u = abs(uv.x * 2.0 - 1.0);
    float xf = pow(u, 0.72);
    float r = mod(uHead - uv.y * (uRows - 1.0), uRows);
    float r0 = floor(r);
    float fr = r - r0;
    float h = mix(sampleRow(r0, xf), sampleRow(mod(r0 + 1.0, uRows), xf), fr);
    h *= smoothstep(1.0, 0.22, u);
    vH = h;
    vec3 pos = position;
    pos.z += h * uAmp * (0.35 + 0.65 * uv.y);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

export const terrainFragment = /* glsl */ `
  uniform vec2 uGrid;
  uniform float uWeight;
  uniform vec3 uC0;
  uniform vec3 uC1;
  uniform vec3 uC2;
  varying vec2 vUv;
  varying float vH;
  varying float vDepth;

  void main() {
    vec2 g = vUv * uGrid;
    vec2 f = abs(fract(g - 0.5) - 0.5) / max(fwidth(g), vec2(0.0001));
    float line = 1.0 - min(min(f.x, f.y), 1.0);
    vec3 col = mix(uC0, uC1, smoothstep(0.05, 0.45, vH));
    col = mix(col, uC2, smoothstep(0.45, 0.95, vH));
    float fog = smoothstep(46.0, 12.0, vDepth);
    float edge = smoothstep(0.0, 0.08, vUv.x) * smoothstep(1.0, 0.92, vUv.x);
    float a = (line * (0.2 + vH * 1.3) + 0.012) * fog * edge * uWeight;
    gl_FragColor = vec4(col * (1.0 + vH), a);
    #include <colorspace_fragment>
  }
`;
