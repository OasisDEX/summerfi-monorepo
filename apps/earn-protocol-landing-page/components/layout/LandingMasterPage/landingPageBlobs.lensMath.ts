/* eslint-disable no-mixed-operators */

// Pure mirror of the LENS_FRAG shader math — keep the two in sync.
export const LENS_FALLOFF_RADIUS = 0.82
export const LENS_MIN_DIST = 0.02
export const LENS_MAX_DISPLACEMENT = 0.22
export const LENS_ABERRATION = 0.45
export const EINSTEIN_RING_RADIUS = 0.1
export const EINSTEIN_RING_WIDTH = 0.002
export const EVENT_HORIZON_RADIUS = 0.14

const FALLOFF_AT_MIN = LENS_FALLOFF_RADIUS / LENS_MIN_DIST - 1

// ~1/dist photon-bending falloff, 1 at MIN_DIST, 0 at FALLOFF_RADIUS
export const lensFalloff = (dist: number): number => {
  const d = Math.max(dist, LENS_MIN_DIST)
  const raw = Math.max(LENS_FALLOFF_RADIUS / d - 1, 0)

  return Math.min(raw / FALLOFF_AT_MIN, 1)
}

export const lensDisplacement = (dist: number, strength: number): number => {
  const displacement = strength * LENS_MAX_DISPLACEMENT * lensFalloff(dist)

  // never pull the sample past the well center itself
  return Math.min(displacement, dist)
}

export const chromaticDisplacements = (
  dist: number,
  strength: number,
): { r: number; g: number; b: number } => {
  const g = lensDisplacement(dist, strength)

  return { r: g * (1 + LENS_ABERRATION), g, b: g * (1 - LENS_ABERRATION) }
}
