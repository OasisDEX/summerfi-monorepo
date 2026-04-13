'use client'

import { useCallback, useEffect, useRef } from 'react'
import { debounce } from 'lodash-es'
import Image from 'next/image'

import landingPageGrid from '@/public/img/landing-page/grid.svg'

import landingPageBlobsStyles from '@/components/layout/LandingMasterPage/landingPageBlobs.module.css'

/* ------------------------------------------------------------------ */
/*  Color palette (from original design)                               */
/* ------------------------------------------------------------------ */

const SMALL_COLORS = ['#de207f', '#DB70A5', '#8D3360', '#5E1238']
const LARGE_COLORS = ['#5B035D', '#DB70A5', '#5D1A03', '#de207f']

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const rand = (min: number, max: number): number => {
  return Number(min) + Number(Number(Math.random()) * Number(max - min))
}

const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Number(Math.random()) * Number(arr.length))]

const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '')
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h

  return [
    Number(parseInt(full.slice(0, 2), 16)),
    Number(parseInt(full.slice(2, 4), 16)),
    Number(parseInt(full.slice(4, 6), 16)),
  ]
}

const rgbaString = (r: number, g: number, b: number, a: number): string =>
  `rgba(${r}, ${g}, ${b}, ${a})`

const TWO_PI = Number(Math.PI) * 2

const lerp = (current: number, target: number, rate: number): number => {
  return Number(current) + Number(Number(target - current) * Number(rate))
}

/* ------------------------------------------------------------------ */
/*  Gravity field                                                      */
/* ------------------------------------------------------------------ */

const GRAVITY_CENTER_X = 0.7
const GRAVITY_CENTER_Y = 0.5
const GRAVITY_MOUSE_RADIUS = 0.5 // fraction of width – outer activation radius
const GRAVITY_LERP_SPEED = 1.3 // how fast activation catches up (units/sec)
const BLACKHOLE_PULL_SPEED = 1.2 // how fast small blobs are permanently sucked in
const BLACKHOLE_DEATH_RADIUS = 150 // pixels from center before the blob dies and fades away
const BLACKHOLE_DEATH_FADE = 0.7 // seconds of fade after entering black hole core

const easeInOutCubic = (x: number): number => {
  return x < 0.5
    ? Number(4 * Number(x) * Number(x) * Number(x))
    : Number(1 - Number(Number((Number(-2 * Number(x)) + 2) ** 3) / 2))
}

/**
 * activation is pre-computed + smoothed per-frame – not per-blob.
 */
const calcGravityPull = (
  blobX: number,
  blobY: number,
  gravityCx: number,
  gravityCy: number,
  activation: number,
  inverseMaxDist: number,
): { pullX: number; pullY: number } => {
  if (activation <= 0.001) return { pullX: 0, pullY: 0 }

  // blob vector toward gravity center
  const bDx = Number(gravityCx) - Number(blobX)
  const bDy = Number(gravityCy) - Number(blobY)
  const blobDist = Math.sqrt(Number(Number(bDx) * Number(bDx)) + Number(Number(bDy) * Number(bDy)))

  const normalizedDist = Math.min(Number(blobDist) * Number(inverseMaxDist), 1)

  // the stronger the activation the further blobs are reached
  const reachMultiplier = 0.2 + Number(Number(activation) * 0.2)
  const adjustedDist = Math.min(Number(normalizedDist) / Number(reachMultiplier), 1)

  // ease per-blob pull so nearby ones snap harder
  const pullFraction = easeInOutCubic(1 - Number(adjustedDist))

  const strength = Number(activation) * Number(pullFraction)

  return {
    pullX: Number(Number(bDx) * Number(strength)) / 2,
    pullY: Number(Number(bDy) * Number(strength)) / 2,
  }
}

/* ------------------------------------------------------------------ */
/*  Small blob (particle rising from bottom)                          */
/* ------------------------------------------------------------------ */

interface SmallBlob {
  x: number // current x (px)
  startY: number // spawn y
  age: number // seconds alive
  lifetime: number // total seconds of life
  size: number // max radius
  swayAmp: number // horizontal sway amplitude
  swayFreq: number // sway frequency
  speed: number // vertical speed (px/s), positive = upward
  direction: 1 | -1 // 1 = rising (from bottom), -1 = falling (from top)
  phase: number // random phase offset
  glowPhase: number // glow oscillation phase
  color: [number, number, number]
  fromBottom: boolean
  offsetX: number // permanent gravity displacement
  offsetY: number // permanent gravity displacement
  deathStartAge: number | null // when black hole death fade starts
  renderX: number // cached final x for this frame
  renderY: number // cached final y for this frame
}

const spawnSmallBlob = (width: number, height: number, preAge?: number): SmallBlob => {
  const rgb = hexToRgb(pickRandom(SMALL_COLORS))
  const fromBottom = Math.random() > 0.5
  const direction: 1 | -1 = fromBottom ? 1 : -1
  const startY = fromBottom ? Number(height) + rand(10, 60) : rand(-60, -10)

  return {
    x: rand(Number(width) * 0.05, Number(width) * 0.95),
    startY,
    fromBottom,
    age: preAge ?? 0,
    lifetime: rand(20, 200),
    size: rand(1, 3),
    swayAmp: rand(1, 5),
    swayFreq: rand(0.1, 0.5),
    speed: rand(1, 25),
    direction,
    phase: rand(0, Number(Math.PI) * 2),
    glowPhase: rand(0, Number(Math.PI) * 2),
    color: rgb,
    offsetX: 0,
    offsetY: 0,
    deathStartAge: null,
    renderX: 0,
    renderY: 0,
  }
}

const updateSmallBlob = (
  blob: SmallBlob,
  dt: number,
  gravityCx: number,
  gravityCy: number,
  activation: number,
  inverseMaxDist: number,
) => {
  // compute natural position (same formula as drawSmallBlob)
  const t = Number(blob.age) / Number(blob.lifetime)
  const currentY =
    Number(blob.startY) -
    Number(Number(blob.direction) * Number(Number(blob.speed) * Number(blob.age)))
  const sway = Number(
    Number(Number(blob.swayAmp) * Math.sin(Number(blob.swayFreq) * Number(blob.age))) +
      Number(blob.phase),
  )
  const baseCurrentX =
    Number(blob.x) + Number(sway) + Number(t * Number(blob.fromBottom ? -500 : 500))

  // the position WITH current offset is what the blob "is" now
  const worldX = Number(baseCurrentX) + Number(blob.offsetX)
  const worldY = Number(currentY) + Number(blob.offsetY)

  // compute gravity pull from current world position
  const { pullX, pullY } = calcGravityPull(
    worldX,
    worldY,
    gravityCx,
    gravityCy,
    activation,
    inverseMaxDist,
  )

  // accumulate into permanent offset
  blob.offsetX =
    Number(blob.offsetX) + Number(Number(pullX) * Number(dt) * Number(BLACKHOLE_PULL_SPEED))
  blob.offsetY =
    Number(blob.offsetY) + Number(Number(pullY) * Number(dt) * Number(BLACKHOLE_PULL_SPEED))

  blob.renderX = Number(baseCurrentX) + Number(blob.offsetX)
  blob.renderY = Number(currentY) + Number(blob.offsetY)

  // if the blob reaches the black hole core, cap lifetime so it fades away naturally
  const distanceToCore = Math.sqrt(
    Number(Number(blob.renderX - gravityCx) * Number(blob.renderX - gravityCx)) +
      Number(Number(blob.renderY - gravityCy) * Number(blob.renderY - gravityCy)),
  )

  if (distanceToCore <= Number(BLACKHOLE_DEATH_RADIUS) && blob.deathStartAge === null) {
    blob.deathStartAge = Number(blob.age)
  }
}

const drawSmallBlob = (ctx: CanvasRenderingContext2D, blob: SmallBlob) => {
  const t = Number(blob.age) / Number(blob.lifetime) // 0 → 1 progress

  // fade envelope: smooth in for first 15%, smooth out for last 20%
  const fadeIn = Math.min(Number(t) / 0.15, 1)
  const fadeOut = Math.min(Number(1 - t) / 0.2, 1)
  const deathT =
    blob.deathStartAge === null
      ? 0
      : Math.min(
          Number(Number(blob.age) - Number(blob.deathStartAge)) / Number(BLACKHOLE_DEATH_FADE),
          1,
        )
  const deathFade = Number(1 - Number(deathT))
  const envelope = Number(Number(fadeIn) * Number(fadeOut)) * Number(deathFade)

  if (envelope <= 0) return

  // cached final position comes from updateSmallBlob
  const currentX = blob.renderX
  const finalY = blob.renderY

  // size grows in then shrinks
  const currentSize = Number(blob.size) * Number(envelope)

  // variable glow throughout flight (slower oscillation: 0.4 instead of 1.5)
  const baseGlowIntensity =
    0.3 + Number(0.5 * Math.abs(Math.sin(Number(Number(blob.age) * 0.4) + Number(blob.glowPhase))))
  const deathGlowBoost = Number(deathT) * 0.8
  const glowIntensity = Number(baseGlowIntensity) + Number(deathGlowBoost)
  // smaller glow: multiplier reduced from (3 + intensity*8) to (1.5 + intensity*3)
  const glowRadius = Number(currentSize) * (1.5 + Number(Number(glowIntensity) * 3))

  const [r, g, b] = blob.color
  const alpha = Number(Number(envelope) * 0.9)

  // glow layer
  const grad = ctx.createRadialGradient(currentX, finalY, 0, currentX, finalY, glowRadius)

  grad.addColorStop(0, rgbaString(r, g, b, Number(alpha) * Number(glowIntensity) * 0.5))
  grad.addColorStop(0.4, rgbaString(r, g, b, Number(alpha) * Number(glowIntensity) * 0.15))
  grad.addColorStop(1, rgbaString(r, g, b, 0))

  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(currentX, finalY, glowRadius, 0, TWO_PI)
  ctx.fill()

  // core dot
  const coreGrad = ctx.createRadialGradient(currentX, finalY, 0, currentX, finalY, currentSize)

  coreGrad.addColorStop(0, rgbaString(r, g, b, alpha))
  coreGrad.addColorStop(1, rgbaString(r, g, b, Number(alpha) * 0.3))

  ctx.fillStyle = coreGrad
  ctx.beginPath()
  ctx.arc(currentX, finalY, currentSize, 0, TWO_PI)
  ctx.fill()
}

/* ------------------------------------------------------------------ */
/*  Large blob (fixed position, drift/wobble/mouse-reactive blur)      */
/* ------------------------------------------------------------------ */

interface LargeBlob {
  baseX: number // base position (fraction of width – around 0.7)
  baseY: number // base position (fraction of height – centered)
  size: number // radius
  driftPhaseX: number
  driftPhaseY: number
  driftSpeedX: number
  driftSpeedY: number
  driftAmpX: number
  driftAmpY: number
  wobblePhase: number
  wobbleSpeed: number
  fadePhase: number
  fadeSpeed: number
  baseBlur: number
  color: [number, number, number]
}

const createLargeBlob = (index: number, total: number): LargeBlob => {
  const rgb = hexToRgb(pickRandom(LARGE_COLORS))
  // concentrate vertically near center (0.45–0.55 range)
  const ySpread = total > 1 ? Number(0.45 + Number(Number(index / Number(total - 1)) * 0.1)) : 0.5

  return {
    baseX: rand(0.65, 0.75),
    baseY: ySpread,
    size: rand(160, 320),
    driftPhaseX: rand(0, Number(Math.PI) * 2),
    driftPhaseY: rand(0, Number(Math.PI) * 2),
    driftSpeedX: rand(0.08, 0.18),
    driftSpeedY: rand(0.06, 0.14),
    driftAmpX: rand(15, 35),
    driftAmpY: rand(10, 25),
    wobblePhase: rand(0, Number(Math.PI) * 2),
    wobbleSpeed: rand(0.4, 0.9),
    fadePhase: rand(0, Number(Math.PI) * 2),
    fadeSpeed: rand(0.15, 0.35),
    baseBlur: rand(2, 125),
    color: rgb,
  }
}

const drawLargeBlob = (
  ctx: CanvasRenderingContext2D,
  blob: LargeBlob,
  time: number,
  width: number,
  height: number,
  gravityCx: number,
  gravityCy: number,
  activation: number,
  inverseMaxDist: number,
) => {
  const t = Number(time) * 0.001

  // drift
  const cx =
    Number(Number(blob.baseX) * Number(width)) +
    Number(
      Number(Number(blob.driftAmpX) * Math.sin(Number(blob.driftSpeedX) * Number(t))) +
        Number(blob.driftPhaseX),
    )
  const cy =
    Number(Number(blob.baseY) * Number(height)) +
    Number(
      Number(Number(blob.driftAmpY) * Math.cos(Number(blob.driftSpeedY) * Number(t))) +
        Number(blob.driftPhaseY),
    )

  // wobble (slight scale oscillation)
  const wobble =
    1 +
    Number(0.06 * Math.sin(Number(Number(blob.wobbleSpeed) * Number(t)) + Number(blob.wobblePhase)))
  const currentRadius = Number(blob.size) * Number(wobble)

  // fade in/out gently (higher base opacity for more contrast)
  const fadeAlpha =
    0.7 +
    Number(0.2 * Math.sin(Number(Number(blob.fadeSpeed) * Number(t)) + Number(blob.fadePhase)))

  // gravity pull toward center
  const { pullX, pullY } = calcGravityPull(cx, cy, gravityCx, gravityCy, activation, inverseMaxDist)
  const finalCx = Number(cx) + Number(pullX)
  const finalCy = Number(cy) + Number(pullY)

  const [r, g, b] = blob.color
  const totalBlur = Number(blob.baseBlur)

  ctx.save()
  ctx.filter = `blur(${totalBlur}px)`
  ctx.globalAlpha = fadeAlpha

  const grad = ctx.createRadialGradient(finalCx, finalCy, 0, finalCx, finalCy, currentRadius)

  grad.addColorStop(0, rgbaString(r, g, b, 0.95))
  grad.addColorStop(0.45, rgbaString(r, g, b, 0.55))
  grad.addColorStop(0.75, rgbaString(r, g, b, 0.2))
  grad.addColorStop(1, rgbaString(r, g, b, 0))

  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(finalCx, finalCy, currentRadius, 0, TWO_PI)
  ctx.fill()
  ctx.restore()
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

type LandingPageBlobsProps = {
  smallBlobCount?: number
  largeBlobCount?: number
}

export const LandingPageBlobs = ({
  smallBlobCount = 100,
  largeBlobCount = 5,
}: LandingPageBlobsProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })

  const handleMouseMove = useCallback((ev: MouseEvent) => {
    const canvas = canvasRef.current

    if (!canvas) return
    const rect = canvas.getBoundingClientRect()

    mouseRef.current = {
      x: Number(ev.clientX) - Number(rect.left),
      y: Number(ev.clientY) - Number(rect.top),
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) return undefined

    const ctx = canvas.getContext('2d')

    if (!ctx) return undefined

    let width = 0
    let height = 0
    let rafId = 0
    let prevTime = 0
    let smoothedActivation = 0

    // blob pools
    let smallBlobs: SmallBlob[] = []
    let largeBlobs: LargeBlob[] = []

    const resize = () => {
      const container = canvas.parentElement

      if (!container) return

      const rect = container.getBoundingClientRect()
      const dpr = Number(window.devicePixelRatio) || 1

      width = Math.max(Number(rect.width), 1)
      height = Math.max(Number(rect.height), 1)
      canvas.width = Math.round(Number(width) * Number(dpr))
      canvas.height = Math.round(Number(height) * Number(dpr))
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // re-create large blobs on resize (they are position-relative)
      largeBlobs = Array.from({ length: largeBlobCount }, (_, i) =>
        createLargeBlob(i, largeBlobCount),
      )
    }
    const resizeDebounced = debounce(resize, 1000)

    const seedSmallBlobs = () => {
      // pre-seed blobs at random ages so canvas starts populated
      smallBlobs = Array.from({ length: smallBlobCount }, () => {
        const blob = spawnSmallBlob(width, height, rand(50, 100))

        return blob
      })
    }

    const ensureSmallBlobs = () => {
      // keep pool at target count – respawn dead ones
      while (smallBlobs.length < smallBlobCount) {
        smallBlobs.push(spawnSmallBlob(width, height))
      }
    }

    const tick = (time: number) => {
      const dt = prevTime === 0 ? 0.016 : Number(time - prevTime) * 0.001

      prevTime = time

      ctx.clearRect(0, 0, width, height)

      // --- compute smoothed gravity activation once per frame ---
      const gravityCx = Number(GRAVITY_CENTER_X) * Number(width)
      const gravityCy = Number(GRAVITY_CENTER_Y) * Number(height)
      const inverseMaxDist =
        1 /
        Math.sqrt(Number(Number(width) * Number(width)) + Number(Number(height) * Number(height)))

      const mDx = Number(mouseRef.current.x) - Number(gravityCx)
      const mDy = Number(mouseRef.current.y) - Number(gravityCy)
      const mouseDist = Math.sqrt(
        Number(Number(mDx) * Number(mDx)) + Number(Number(mDy) * Number(mDy)),
      )
      const mouseRadius = Number(height) * Number(GRAVITY_MOUSE_RADIUS)
      const rawActivation = Math.max(0, 1 - Number(Number(mouseDist) / Number(mouseRadius)))
      const targetActivation = easeInOutCubic(rawActivation)

      smoothedActivation = lerp(
        smoothedActivation,
        targetActivation,
        Math.min(Number(dt) * Number(GRAVITY_LERP_SPEED), 1),
      )

      // --- small blobs (behind) ---
      ensureSmallBlobs()
      let writeIndex = 0

      for (const sb of smallBlobs) {
        sb.age = Number(Number(sb.age) + Number(dt)) // + Number(targetActivation * 0.1)

        updateSmallBlob(sb, dt, gravityCx, gravityCy, smoothedActivation, inverseMaxDist)
        drawSmallBlob(ctx, sb)

        const isNaturalDead = sb.age > sb.lifetime
        const isBlackHoleDead =
          sb.deathStartAge !== null &&
          Number(Number(sb.age) - Number(sb.deathStartAge)) > Number(BLACKHOLE_DEATH_FADE)

        if (!isNaturalDead && !isBlackHoleDead) {
          smallBlobs[writeIndex] = sb
          writeIndex += 1
        }
      }
      smallBlobs.length = writeIndex

      // --- large blobs (on top) ---
      for (const lb of largeBlobs) {
        drawLargeBlob(
          ctx,
          lb,
          time,
          width,
          height,
          gravityCx,
          gravityCy,
          smoothedActivation,
          inverseMaxDist,
        )
      }

      rafId = requestAnimationFrame(tick)
    }

    resize()
    seedSmallBlobs()
    rafId = requestAnimationFrame(tick)

    window.addEventListener('resize', resizeDebounced)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('resize', resizeDebounced)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [smallBlobCount, largeBlobCount, handleMouseMove])

  return (
    <div className={landingPageBlobsStyles.blobsContainer}>
      <Image
        src={landingPageGrid}
        alt="landing_page_grid"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          zIndex: -1,
          transform: 'scale(1.5)',
        }}
        priority
      />
      <canvas ref={canvasRef} className={landingPageBlobsStyles.canvas} />
      <div className={landingPageBlobsStyles.gradientBottom} />
    </div>
  )
}
