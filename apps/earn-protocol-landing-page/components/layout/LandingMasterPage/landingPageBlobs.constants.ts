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

// ---- finale: collapse simulation tuning ----
export const COLLAPSE_MAX_PULSE_STRENGTH = 2.0
export const COLLAPSE_RADIUS_MULTIPLIER = 0.8
export const COLLAPSE_DEBRIS_BOOST = 0.8
export const COLLAPSE_SPAWN_BOOST = 0.4 // extra comets at full collapse (fraction of smallBlobCount)
export const AFTER_PULSE_STRENGTH = 1.2 // steady post-collapse feeding pull (calm pulses peak ~1.2)
export const AFTER_SPAWN_FRACTION = 0.5 // post-collapse comet count (fraction of smallBlobCount)

// ---- transition smoothing envelopes (attack = rise speed, release = fall speed, 1/s) ----
export const WELL_ENERGY_ATTACK = 2.5
export const WELL_ENERGY_RELEASE = 0.8
export const RADIUS_MULT_ATTACK = 1.5
export const RADIUS_MULT_RELEASE = 0.6
export const SPAWN_TARGET_ATTACK = 0.8
export const SPAWN_TARGET_RELEASE = 0.3
export const LARGE_FADE_ATTACK = 3.0
// slow release ≈ large blobs gone within the first ~third of the 14s collapse
export const LARGE_FADE_RELEASE = 0.7
// light symmetric smoothing that rounds the derivative kinks at phase
// boundaries without visibly lagging the 14s collapse ramp
export const LENS_UNIFORM_SMOOTHING = 3.0
// collapse energy accelerates the shader clock (borrowed sun-blob time-warp)
export const TIME_WARP_FACTOR = 0.35

// ---- molten horizon (textured accretion swirl outside the event horizon rim) ----
export const HORIZON_TEX_ITERATIONS = 10 // rotated noise samples accumulated per pixel
export const HORIZON_TEX_SCALE = 1.6 // hole-space → texture-space zoom
export const HORIZON_SWIRL_WIDTH = 0.06 // swirl band extent beyond the rim (fraction of hole radius)
export const HORIZON_SWIRL_SPIN = 0.01 // per-layer rotation speed (radians per warped second)
// coverage window: lower LOW → more pebbles visible; lower HIGH → hotter veins
export const HORIZON_VEIN_LOW = 0.04
export const HORIZON_VEIN_HIGH = 0.6
// the background grid brightens as the horizon forms — the displacement +
// aberration of the lens reads much better against a more visible grid
export const GRID_HORIZON_BOOST = 1.4
export const GRID_SCALE = 1.5 // matches the old DOM <Image> transform: scale(1.5)

// --- grid pass: the background grid SVG as a GL texture so the lens can bend it ---
export const GRID_VERT = `#version 300 es
precision highp float;

in vec2 a_pos; // -1..1 quad

uniform vec2 u_resolution; // css px
uniform vec4 u_rect;       // x, y, w, h in css px (y-down)

out vec2 v_uv;

void main() {
  v_uv = a_pos * 0.5 + 0.5;
  vec2 world = u_rect.xy + v_uv * u_rect.zw;
  vec2 clip = vec2(world.x / u_resolution.x * 2.0 - 1.0,
                   1.0 - world.y / u_resolution.y * 2.0);
  gl_Position = vec4(clip, 0.0, 1.0);
}
`

export const GRID_FRAG = `#version 300 es
precision mediump float;

in vec2 v_uv;

uniform sampler2D u_texture;
uniform float u_boost; // >= 1; grid brightens as the event horizon forms

out vec4 fragColor;

void main() {
  vec4 tex = texture(u_texture, v_uv);
  float a = min(tex.a * u_boost, 1.0);
  // premultiply to match the pipeline blend mode
  fragColor = vec4(tex.rgb * a, a);
}
`

// --- lens pass: fullscreen post-process bending the scene around the well ---
// Math mirrors landingPageBlobs.lensMath.ts — keep in sync.
export const LENS_VERT = `#version 300 es
precision highp float;

in vec2 a_pos; // -1..1 quad

out vec2 v_uv;

void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`

export const LENS_FRAG = `#version 300 es
precision highp float;

in vec2 v_uv;

uniform sampler2D u_scene;
uniform vec2  u_resolution;   // css px
uniform vec2  u_wellCenter;   // uv, y-down (same space as v_uv after flip below)
uniform float u_lensStrength; // 0..1
uniform float u_flash;        // 0..1 blackout toward the page background color
uniform float u_horizon;      // 0..1 event-horizon presence (stays 1 forever after collapse)
uniform sampler2D u_noiseTex; // tiling grayscale noise (pebbles)
uniform float u_time;         // warped shader clock (accelerates with energy)
uniform float u_energy;       // 0..1 normalized well energy
uniform float u_texReady;     // 0 until the noise texture has loaded

out vec4 fragColor;

const float FALLOFF_RADIUS = 0.82;
const float MIN_DIST = 0.08;
const float MAX_DISPLACEMENT = 0.32;
const float ABERRATION = 0.35;
const float RING_RADIUS = 0.1;
const float RING_WIDTH = 0.0;
const float HOLE_RADIUS = 0.14;
const float HOLE_DIMMING = 0.4;

float lensFalloff(float dist) {
  float d = max(dist, MIN_DIST);
  float falloffAtMin = FALLOFF_RADIUS / MIN_DIST - 1.0;
  float raw = max(FALLOFF_RADIUS / d - 1.0, 0.0);
  return min(raw / falloffAtMin, 1.0);
}

mat2 rot2(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat2(c, s, -s, c);
}

void main() {
  float aspect = u_resolution.x / u_resolution.y;

  // scene texture uv is y-up; well center is y-down — flip once
  vec2 uvYDown = vec2(v_uv.x, 1.0 - v_uv.y);
  vec2 toWell = uvYDown - u_wellCenter;
  vec2 toWellAspect = vec2(toWell.x * aspect, toWell.y);
  float dist = length(toWellAspect);
  vec2 dir = dist > 0.0001 ? toWell / dist : vec2(0.0);

  float dispG = min(u_lensStrength * MAX_DISPLACEMENT * lensFalloff(dist), dist);
  float dispR = dispG * (1.0 + ABERRATION);
  float dispB = dispG * (1.0 - ABERRATION);

  // pull samples toward the well (light bends around it); flip back to y-up to sample
  vec2 uvR = vec2(uvYDown - dir * dispR);
  vec2 uvG = vec2(uvYDown - dir * dispG);
  vec2 uvB = vec2(uvYDown - dir * dispB);

  float r = texture(u_scene, vec2(uvR.x, 1.0 - uvR.y)).r;
  vec2 gSample = texture(u_scene, vec2(uvG.x, 1.0 - uvG.y)).ga;
  float b = texture(u_scene, vec2(uvB.x, 1.0 - uvB.y)).b;
  float a = gSample.y;

  vec3 color = vec3(r, gSample.x, b);

  // collapse blackout first: fade the lensed scene to the page background (rgb 16,16,16)
  vec3 flashColor = vec3(16.0 / 255.0);
  color = mix(color, flashColor, u_flash);
  a = mix(a, 1.0, u_flash);

  // event horizon: opaque disk that grows with the collapse and never leaves.
  // Inside it the sky refracts through the hole — classic lens inversion
  // (r -> R²/r, mirrored through the center) with heavy chromatic aberration,
  // dimmed hard so the disk still reads as black while comets ghost across it
  float holeR = max(RING_RADIUS * u_lensStrength, HOLE_RADIUS * u_horizon);
  float hole = 1.0 - smoothstep(holeR - RING_WIDTH, holeR, dist);
  vec3 holeColor = vec3(0.0);

  if (hole > 0.0 && holeR > MIN_DIST) {
    // interior: refract the sky through the hole — classic lens inversion
    // (r -> R²/r) with heavy chromatic aberration
    float invDist = min(holeR * holeR / max(dist, MIN_DIST * 0.25), FALLOFF_RADIUS);
    vec2 invUvR = u_wellCenter - dir * invDist * (1.0 + ABERRATION * 0.5);
    vec2 invUvG = u_wellCenter - dir * invDist;
    vec2 invUvB = u_wellCenter - dir * invDist * (1.0 - ABERRATION * 0.5);
    float hr = texture(u_scene, vec2(invUvR.x, 1.0 - invUvR.y)).r;
    float hg = texture(u_scene, vec2(invUvG.x, 1.0 - invUvG.y)).g;
    float hb = texture(u_scene, vec2(invUvB.x, 1.0 - invUvB.y)).b;

    // spherical structure: the refracted sky only survives in a band hugging the
    // inner rim (light grazing the photon sphere) and dies off cubically toward
    // the core, which stays truly black — reads as a ball, not a flat mirror
    float rimBand = pow(clamp(dist / max(holeR, MIN_DIST), 0.0, 1.0), 3.0);

    holeColor = vec3(hr, hg, hb) * HOLE_DIMMING * rimBand;
  }

  color = mix(color, holeColor, hole);
  a = mix(a, 1.0, hole);

  // event-horizon accretion swirl: molten textured band hugging the OUTSIDE of
  // the rim (iterated rotated noise samples — sun-blob technique), flaring as
  // comets feed the well; the interior above stays a dark refracted ball
  if (u_texReady > 0.5 && holeR > MIN_DIST) {
    // band straddles the rim: full width outside, a 35%-of-width bleed inside —
    // both scale with HORIZON_SWIRL_WIDTH so shrinking it can't leave an
    // inside-only ring with a hard outer cutoff
    float swirlOuter = holeR * (1.0 + ${HORIZON_SWIRL_WIDTH.toFixed(3)});
    float swirlInner = holeR * (1.0 - ${HORIZON_SWIRL_WIDTH.toFixed(3)} * 0.35);
    float band = smoothstep(swirlInner, holeR, dist) *
      (1.0 - smoothstep(holeR, swirlOuter, dist));

    if (band > 0.001) {
      vec2 p = toWellAspect * (${HORIZON_TEX_SCALE.toFixed(2)} / max(holeR, MIN_DIST));

      // overlay-composite the rotating layers (Photoshop overlay: darks
      // multiply, brights screen) — self-normalizing for any layer count,
      // overlapping patches marble into veins instead of averaging to specks
      float acc = 0.5;

      for (int i = 0; i < ${HORIZON_TEX_ITERATIONS}; i++) {
        float io = 6.28318 * float(i) / 7.0;
        float s = texture(u_noiseTex,
          p * 0.35 + vec2(-0.014 * u_time, 0.006 * u_time)).r;

        // the pebbles texture skews dark — lift the samples before folding so
        // repeated overlays don't collapse the whole band to black
        s = pow(s, 0.9);
        float ov = acc < 0.5
          ? 2.0 * acc * s
          : 1.0 - 2.0 * (1.0 - acc) * (1.0 - s);

        acc = mix(acc, ov, 0.7);
        p = rot2(${HORIZON_SWIRL_SPIN.toFixed(3)} * u_time + io) * (p * 1.13);
      }

      // dark gaps stay dark, overlapping veins glow — then tint with the
      // palette pinks and flare with feeding energy
      float veins = smoothstep(${HORIZON_VEIN_LOW.toFixed(2)}, ${HORIZON_VEIN_HIGH.toFixed(2)}, acc);
      vec3 pink1 = vec3(0.859, 0.439, 0.647); // #DB70A5
      vec3 pink2 = vec3(0.871, 0.125, 0.498); // #DE207F
      vec3 molten = mix(pink2, pink1, veins) * (0.3 + 1.45 * veins);
      float presence = max(u_horizon, u_lensStrength * 0.6);
      // the block above is hard-gated on holeR > MIN_DIST — fade the swirl in
      // as the growing hole crosses that threshold so it never pops in whole
      float grow = smoothstep(MIN_DIST, MIN_DIST * 2.0, holeR);
      vec3 swirl = molten * (0.6 + 0.8 * u_energy) * band * presence * grow;

      color += swirl;
      a = min(a + max(swirl.r, max(swirl.g, swirl.b)), 1.0);
    }
  }

  // Einstein ring: thin sharp annulus on the horizon's edge, drawn last so it never fades
  float ring = max(u_lensStrength, u_horizon * 0.85) *
    (1.0 - smoothstep(0.0, RING_WIDTH, abs(dist - holeR)));
  color += vec3(ring);
  a = min(a + ring, 1.0);

  fragColor = vec4(color, a);
}
`
