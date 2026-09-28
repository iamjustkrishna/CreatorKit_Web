export const auroraVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const auroraFragment = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uViolet;
  uniform vec3 uCyan;
  uniform vec3 uOrange;

  // Cheap value-noise for nebula bands
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.05;
    float n1 = noise(uv * 3.0 + vec2(t, -t * 0.6));
    float n2 = noise(uv * 5.0 - vec2(t * 0.7, t));
    float band = smoothstep(0.15, 0.95, n1 * 0.65 + n2 * 0.35);

    vec3 col = mix(uViolet, uCyan, smoothstep(0.1, 0.7, uv.x + n1 * 0.4));
    col = mix(col, uOrange, smoothstep(0.55, 1.0, uv.y + n2 * 0.3) * 0.45);
    float alpha = band * 0.55 + 0.08;

    // Vignette fade edges so DOM text stays readable
    float edge = smoothstep(0.0, 0.25, uv.x) * smoothstep(1.0, 0.6, uv.x)
               * smoothstep(0.0, 0.2, uv.y) * smoothstep(1.0, 0.55, uv.y);
    gl_FragColor = vec4(col, alpha * (0.35 + edge));
  }
`;
