/* eslint-disable no-mixed-operators */

import {
  BLACKHOLE_DEATH_RADIUS,
  BLACKHOLE_PULL_SPEED,
  LARGE_COLORS,
  SMALL_COLORS,
} from '@/components/layout/LandingMasterPage/landingPageBlobs.constants'
import {
  type LargeBlob,
  type SmallBlob,
} from '@/components/layout/LandingMasterPage/landingPageBlobs.types'

export const rand = (min: number, max: number) => {
  return min + Math.random() * (max - min)
}
export const pickRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]
export const lerp = (a: number, b: number, t: number) => {
  return a + (b - a) * t
}
export const easeInOutCubic = (x: number): number => {
  if (x < 0.5) return 4 * x * x * x
  const v = (-2 * x + 2) ** 3

  return 1 - v / 2
}

export const calcGravityPull = (
  blobX: number,
  blobY: number,
  cx: number,
  cy: number,
  activation: number,
  inverseMaxDist: number,
  gravityRadius: number,
): { pullX: number; pullY: number } => {
  if (activation <= 0.001) return { pullX: 0, pullY: 0 }
  const bDx = cx - blobX
  const bDy = cy - blobY
  const blobDist = Math.sqrt(bDx * bDx + bDy * bDy)
  const maxDist = 1 / inverseMaxDist
  const effectiveRadius = Math.min(Math.max(gravityRadius, 1), maxDist)
  const normalizedDist = Math.min(blobDist / effectiveRadius, 1)
  const reachMultiplier = 0.35 + activation * 0.65
  const adjustedDist = Math.min(normalizedDist / reachMultiplier, 1)
  const pullFraction = easeInOutCubic(1 - adjustedDist)
  const strength = activation * pullFraction

  return { pullX: (bDx * strength) / 2, pullY: (bDy * strength) / 2 }
}

const compileShader = (gl: WebGL2RenderingContext, type: number, src: string): WebGLShader => {
  const s = gl.createShader(type) as WebGLShader

  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(s) ?? 'shader compile error')
  }

  return s
}

export const linkProgram = (
  gl: WebGL2RenderingContext,
  vert: string,
  frag: string,
): WebGLProgram => {
  const p = gl.createProgram() as WebGLProgram

  gl.attachShader(p, compileShader(gl, gl.VERTEX_SHADER, vert))
  gl.attachShader(p, compileShader(gl, gl.FRAGMENT_SHADER, frag))
  gl.linkProgram(p)
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(p) ?? 'program link error')
  }

  return p
}

export const spawnSmallBlob = (width: number, height: number, preAge?: number): SmallBlob => {
  const color = pickRandom(SMALL_COLORS)
  const fromBottom = Math.random() > 0.5
  const direction: 1 | -1 = fromBottom ? 1 : -1
  const startY = fromBottom ? height + rand(10, 60) : rand(-60, -10)
  const x = rand(width * 0.2, width * 0.8)

  return {
    x,
    startY,
    fromBottom,
    age: preAge ?? 0,
    lifetime: rand(20, 200),
    size: rand(1, 3),
    swayAmp: rand(1, 5),
    swayFreq: rand(0.1, 0.5),
    speed: rand(1, 25),
    direction,
    phase: rand(0, Math.PI * 2),
    glowPhase: rand(0, Math.PI * 2),
    color,
    offsetX: 0,
    offsetY: 0,
    deathStartAge: null,
    renderX: 0,
    renderY: 0,
    hasRender: false,
    tailStartX: 0,
    tailStartY: 0,
    tailEndX: 0,
    tailEndY: 0,
    hasTail: false,
    gravityInfluence: 0,
  }
}

export const updateSmallBlob = (
  blob: SmallBlob,
  dt: number,
  gravityCx: number,
  gravityCy: number,
  activation: number,
  inverseMaxDist: number,
  gravityRadius: number,
) => {
  const t = blob.age / blob.lifetime
  const currentY = blob.startY - blob.direction * blob.speed * blob.age
  const sway = blob.swayAmp * Math.sin(blob.swayFreq * blob.age) + blob.phase
  const baseCurrentX = blob.x + sway + t * (blob.fromBottom ? -500 : 500)
  const worldX = baseCurrentX + blob.offsetX
  const worldY = currentY + blob.offsetY

  const { pullX, pullY } = calcGravityPull(
    worldX,
    worldY,
    gravityCx,
    gravityCy,
    activation,
    inverseMaxDist,
    gravityRadius,
  )
  const gravityInfluence = Math.sqrt(pullX * pullX + pullY * pullY)

  blob.gravityInfluence = gravityInfluence

  blob.offsetX += pullX * dt * BLACKHOLE_PULL_SPEED
  blob.offsetY += pullY * dt * BLACKHOLE_PULL_SPEED

  const hadRender = blob.hasRender
  const prevRenderX = blob.renderX
  const prevRenderY = blob.renderY

  blob.renderX = baseCurrentX + blob.offsetX
  blob.renderY = currentY + blob.offsetY
  blob.hasRender = true

  if (hadRender) {
    const vX = blob.renderX - prevRenderX
    const vY = blob.renderY - prevRenderY
    const velocity = Math.sqrt(vX * vX + vY * vY)

    if (velocity > 0.001) {
      const dirX = vX / velocity
      const dirY = vY / velocity
      const tailLength = Math.min(Math.max(velocity * 14, 6), 40)

      blob.tailStartX = blob.renderX - dirX * tailLength * 0.05
      blob.tailStartY = blob.renderY - dirY * tailLength * 0.05
      blob.tailEndX = blob.renderX - dirX * tailLength
      blob.tailEndY = blob.renderY - dirY * tailLength
      blob.hasTail = true
    } else {
      blob.hasTail = false
    }
  } else {
    blob.hasTail = false
  }

  const dx = blob.renderX - gravityCx
  const dy = blob.renderY - gravityCy

  if (Math.sqrt(dx * dx + dy * dy) <= BLACKHOLE_DEATH_RADIUS && blob.deathStartAge === null) {
    blob.deathStartAge = blob.age
  }
}

export const createLargeBlob = (index: number, total: number): LargeBlob => {
  const color = LARGE_COLORS[index % LARGE_COLORS.length]
  const size = rand(160, 320)
  const ySpread = total > 1 ? 0.45 + (index / (total - 1)) * 0.1 : 0.5

  return {
    baseX: rand(0.65, 0.75),
    baseY: ySpread,
    size,
    driftPhaseX: rand(0, Math.PI * 2),
    driftPhaseY: rand(0, Math.PI * 2),
    driftSpeedX: rand(0.08, 0.18),
    driftSpeedY: rand(0.06, 0.14),
    driftAmpX: rand(15, 35),
    driftAmpY: rand(10, 25),
    wobblePhase: rand(0, Math.PI * 2),
    wobbleSpeed: rand(0.4, 0.9),
    fadePhase: rand(0, Math.PI * 2),
    fadeSpeed: rand(0.15, 0.35),
    color,
  }
}
