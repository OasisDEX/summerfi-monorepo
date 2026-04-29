export const SMALL_COLORS: [number, number, number][] = [
  [0xde / 255, 0x20 / 255, 0x7f / 255],
  [0xdb / 255, 0x70 / 255, 0xa5 / 255],
  [0x8d / 255, 0x33 / 255, 0x60 / 255],
  [0x5e / 255, 0x12 / 255, 0x38 / 255],
]
export const LARGE_COLORS: [number, number, number][] = [
  [0xdb / 255, 0x70 / 255, 0xa5 / 255],
  [0x5b / 255, 0x03 / 255, 0x5d / 255],
  [0x5d / 255, 0x1a / 255, 0x03 / 255],
  [0xde / 255, 0x20 / 255, 0x7f / 255],
]

export const GRAVITY_CENTER_X = 0.7
export const GRAVITY_CENTER_Y = 0.5
export const GRAVITY_MOUSE_RADIUS = 0.4
export const GRAVITY_LERP_SPEED = 1.2
export const GRAVITY_RADIUS_GROW_SPEED = 180
export const GRAVITY_RADIUS_SHRINK_SPEED = 150
export const BLACKHOLE_PULL_SPEED = 1.8
export const BLACKHOLE_DEATH_RADIUS = 100
export const BLACKHOLE_DEATH_FADE = 1
export const FRAME_RATE = 60
export const FRAME_DURATION_MS = 1000 / FRAME_RATE
export const FRAME_DT = 1 / FRAME_RATE
export const LARGE_BLOB_IDLE_ALPHA = 0.38
export const LARGE_BLOB_ACTIVE_ALPHA_BOOST = 0.3
export const LARGE_BLOB_CENTER_PULL = 0.6
export const LARGE_BLOB_ACTIVE_SCALE_BOOST = -0.22
export const LARGE_BLOB_RESPONSE_LERP_SPEED = 0.4
export const COMET_DEBRIS_MIN = 10
export const COMET_DEBRIS_MAX = 60
export const COMET_DEBRIS_SIZE_MIN = 0.01
export const COMET_DEBRIS_SIZE_MAX = 0.5
export const COMET_DEBRIS_SPREAD = 1.3
export const COMET_DEBRIS_LIFETIME_MIN = 0.001
export const COMET_DEBRIS_LIFETIME_MAX = 4
export const COMET_DEBRIS_DRAG = 0.1
export const COMET_DEBRIS_CAP_MULTIPLIER = 200
export const GRAVITY_DEBRIS_THRESHOLD = 90

export const SMALL_VERT = `#version 300 es
precision highp float;

// quad corners (-1..1)
in vec2 a_pos;

// per-instance
in vec2  a_center;   // px
in float a_size;     // core radius px
in float a_glow;     // glow radius px
in float a_alpha;
in vec3  a_color;

// tail
in vec2  a_tailA;    // tail fat end left  (px)
in vec2  a_tailB;    // tail fat end right (px)
in vec2  a_tailTip;  // tail sharp tip     (px)
in float a_hasTail;  // 0 or 1

out vec2  v_uv;       // local -1..1 in glow circle
out float v_size;
out float v_glow;
out float v_alpha;
out vec3  v_color;

uniform vec2 u_resolution; // css px

vec2 toClip(vec2 p) {
  return vec2(p.x / u_resolution.x * 2.0 - 1.0,
              1.0 - p.y / u_resolution.y * 2.0);
}

void main() {
  v_uv    = a_pos;
  v_size  = a_size;
  v_glow  = a_glow;
  v_alpha = a_alpha;
  v_color = a_color;

  vec2 world = a_center + a_pos * a_glow;
  gl_Position = vec4(toClip(world), 0.0, 1.0);
}
`

export const SMALL_FRAG = `#version 300 es
precision mediump float;

in vec2  v_uv;
in float v_size;
in float v_glow;
in float v_alpha;
in vec3  v_color;

out vec4 fragColor;

void main() {
  float dist = length(v_uv) * v_glow;  // actual px distance from center
  if (dist > v_glow) discard;

  // core: hard circle
  float core = smoothstep(v_size, v_size * 0.85, dist);

  // glow: 4-stop gradient matching original
  float t = dist / v_glow;
  float g0 = 1.0 - smoothstep(0.0,  0.3,  t);   // 0.0→0.3
  float g1 = 1.0 - smoothstep(0.3,  0.6,  t);   // 0.3→0.6
  float g2 = 1.0 - smoothstep(0.6,  1.0,  t);   // 0.6→1.0
  // replicate original alpha stops:
  // stop0 alpha = alpha*glowIntensity (≈v_alpha)
  // stop0.3 = alpha*glowIntensity*0.2
  // stop0.6 = alpha*glowIntensity*0.1
  // stop1 = 0
  float glowA = g0 * v_alpha
              + g1 * v_alpha * 0.2
              + g2 * v_alpha * 0.05;

  float totalA = clamp(core * v_alpha * 0.9 + glowA, 0.0, 1.0);
  float noise =
    (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.03;
  vec3 noisyColor = clamp(v_color + vec3(noise), 0.0, 1.0);

  fragColor = vec4(noisyColor * totalA, totalA);
}
`

// --- tail pass: one triangle per blob ---
export const TAIL_VERT = `#version 300 es
precision highp float;

in vec2  a_vertex; // one of 3 triangle corners (px)
in vec3  a_color;
in float a_alpha;

uniform vec2 u_resolution;

out vec3  v_color;
out float v_alpha;

void main() {
  v_color = a_color;
  v_alpha = a_alpha;
  vec2 clip = vec2(a_vertex.x / u_resolution.x * 2.0 - 1.0,
                   1.0 - a_vertex.y / u_resolution.y * 2.0);
  gl_Position = vec4(clip, 0.0, 1.0);
}
`

export const TAIL_FRAG = `#version 300 es
precision mediump float;

in vec3  v_color;
in float v_alpha;
out vec4 fragColor;

void main() {
  float a = v_alpha;
  float noise =
    (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.03;
  vec3 noisyColor = clamp(v_color + vec3(noise), 0.0, 1.0);
  fragColor = vec4(noisyColor * a, a);
}
`

// --- debris pass: point sprites with soft circular falloff ---
export const DEBRIS_VERT = `#version 300 es
precision highp float;

in vec2 a_center;
in float a_size;
in vec3 a_color;
in float a_alpha;

uniform vec2 u_resolution;

out vec3 v_color;
out float v_alpha;

void main() {
  v_color = a_color;
  v_alpha = a_alpha;

  vec2 clip = vec2(a_center.x / u_resolution.x * 2.0 - 1.0,
                   1.0 - a_center.y / u_resolution.y * 2.0);
  gl_Position = vec4(clip, 0.0, 1.0);
  gl_PointSize = a_size;
}
`

export const DEBRIS_FRAG = `#version 300 es
precision mediump float;

in vec3 v_color;
in float v_alpha;
out vec4 fragColor;

void main() {
  vec2 uv = gl_PointCoord * 2.0 - 1.0;
  float d = dot(uv, uv);
  if (d > 1.0) discard;

  float falloff = smoothstep(1.0, 0.0, d);
  float a = v_alpha * falloff;
  float noise =
    (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.03;
  vec3 noisyColor = clamp(v_color + vec3(noise), 0.0, 1.0);
  fragColor = vec4(noisyColor * a, a);
}
`

// --- large blob pass: one quad per blob, radial gradient in shader ---
export const LARGE_VERT = `#version 300 es
precision highp float;

in vec2  a_pos;      // -1..1 quad
in vec2  a_center;
in float a_radius;
in float a_alpha;
in vec3  a_color;

out vec2  v_uv;
out float v_alpha;
out vec3  v_color;

uniform vec2 u_resolution;

void main() {
  v_uv    = a_pos;
  v_alpha = a_alpha;
  v_color = a_color;

  vec2 world = a_center + a_pos * a_radius;
  vec2 clip  = vec2(world.x / u_resolution.x * 2.0 - 1.0,
                    1.0 - world.y / u_resolution.y * 2.0);
  gl_Position = vec4(clip, 0.0, 1.0);
}
`

export const LARGE_FRAG = `#version 300 es
precision mediump float;

in vec2  v_uv;
in float v_alpha;
in vec3  v_color;

out vec4 fragColor;

void main() {
  float t = length(v_uv);   // 0 at center, 1 at edge
  if (t > 1.0) discard;

  // replicate original 4-stop radial gradient
  float a0 = 0.95;
  float a1 = 0.55;
  float a2 = 0.2;
  float a3 = 0.0;

  float a;
  if (t < 0.45)       a = mix(a0, a1, t / 0.45);
  else if (t < 0.75)  a = mix(a1, a2, (t - 0.45) / 0.30);
  else                a = mix(a2, a3, (t - 0.75) / 0.25);

  float finalA = a * v_alpha;
  float noise =
    (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.03;
  vec3 noisyColor = clamp(v_color + vec3(noise), 0.0, 1.0);
  fragColor = vec4(noisyColor * finalA, finalA);
}
`
