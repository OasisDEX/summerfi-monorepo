'use client'

import { memo, type RefObject, useEffect, useMemo, useRef, useState } from 'react'
import { throttle } from 'lodash-es'

import styles from './FractalGlassBackground.module.css'

const RECT_WIDTH = 60
const MIN_BLUR_PX = 20
const MAX_BLUR_PX = 400
const COMPONENT_HEIGHT = 450
const HALF_RECT_WIDTH = RECT_WIDTH / 2
const RECT_CENTER_Y = COMPONENT_HEIGHT / 2

const BLOB_COLORS = ['#FF49A4', '#B049FF', '#9333EA', '#F43F5E']
const MIN_VISIBLE_BLOBS = 4
const MAX_BLOBS = 12
const INITIAL_BLOB_COUNT = 4
const BLOB_MIN_RADIUS = 350
const BLOB_MAX_RADIUS = 600
const BLOB_MIN_SPEED = 20
const BLOB_MAX_SPEED = 100
const SIN30 = 0.5
const COS30 = 0.8660254037844387

type CanvasBlob = {
  id: number
  x: number
  y: number
  radius: number
  color: string
  speed: number
}

let nextBlobId = 0

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max)

function randomBetween(min: number, max: number): number {
  return min + Number(Math.random() * (max - min))
}

function getRectGradient(index: number, total: number): string {
  const t = total > 1 ? index / (total - 1) : 0
  const wave = 0.18 * Math.sin(t * Math.PI)
  const opacity = 0.08 + wave

  return `linear-gradient(to right, rgba(20,20,20,${opacity.toFixed(3)}) 0%, rgba(0,0,0,0.1) 50%, rgba(10,10,10,${opacity.toFixed(3)}) 100%)`
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function createBlob(containerWidth: number, isSkewed: boolean, placeInView: boolean): CanvasBlob {
  const radius = randomBetween(BLOB_MIN_RADIUS, BLOB_MAX_RADIUS)
  const color = BLOB_COLORS[Math.floor(Math.random() * BLOB_COLORS.length)]
  const speed = randomBetween(BLOB_MIN_SPEED, BLOB_MAX_SPEED)

  let x: number
  let y: number

  if (placeInView) {
    x = randomBetween(radius, containerWidth - radius)
    y = randomBetween(radius * 0.3, COMPONENT_HEIGHT - Number(radius * 0.3))
  } else if (!isSkewed) {
    x = -(radius * 2)
    y = randomBetween(-(radius * 0.3), COMPONENT_HEIGHT + Number(radius * 0.3))
  } else {
    x = randomBetween(-(radius * 2), containerWidth * 0.6)
    y = COMPONENT_HEIGHT + Number(radius * 2)
  }

  return { id: nextBlobId++, x, y, radius, color, speed }
}

function isBlobVisible(blob: CanvasBlob, containerWidth: number): boolean {
  return (
    blob.x + blob.radius > 0 &&
    blob.x - blob.radius < containerWidth &&
    blob.y + blob.radius > 0 &&
    blob.y - blob.radius < COMPONENT_HEIGHT
  )
}

function isBlobNearExit(blob: CanvasBlob, containerWidth: number, isSkewed: boolean): boolean {
  if (!isSkewed) {
    return blob.x + blob.radius > containerWidth * 0.5
  }

  return blob.y - blob.radius < COMPONENT_HEIGHT * 0.2
}

function isBlobOffScreen(blob: CanvasBlob, containerWidth: number, isSkewed: boolean): boolean {
  if (!isSkewed) {
    return blob.x - Number(blob.radius * 2) > containerWidth
  }

  return blob.y + Number(blob.radius * 2) < 0
}

function drawBlobs(
  ctx: CanvasRenderingContext2D,
  blobs: CanvasBlob[],
  width: number,
  height: number,
): void {
  ctx.clearRect(0, 0, width, height)

  for (const blob of blobs) {
    ctx.save()

    const grad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.radius)

    grad.addColorStop(0, hexToRgba(blob.color, 0.4))
    grad.addColorStop(0.6, hexToRgba(blob.color, 0.02))
    grad.addColorStop(1, hexToRgba(blob.color, 0.01))

    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

const FractalGlassPanels = memo(
  ({
    count,
    skewed,
    rectElemsRef,
  }: {
    count: number
    skewed: boolean
    rectElemsRef: RefObject<(HTMLDivElement | null)[]>
  }) => {
    const rectGradients = useMemo(
      () => Array.from({ length: count }, (_, i) => getRectGradient(i, count)),
      [count],
    )

    return (
      <>
        {Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            ref={(el) => {
              // Store refs to rect elements for direct DOM writes in the rAF loop
              // (style updates for blur based on blob proximity)
              rectElemsRef.current[i] = el
            }}
            className={styles.rect}
            style={{
              transform: skewed ? 'skewX(-30deg)' : undefined,
              left: `${Number(i * RECT_WIDTH) - (skewed ? Math.tan((30 * Math.PI) / 180) * Number(RECT_WIDTH * 6) : 0)}px`,
              background: rectGradients[i],
            }}
          />
        ))}
      </>
    )
  },
)

export const FractalGlassBackground = ({ skewed = false }: { skewed?: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [count, setCount] = useState(0)

  const rafIdRef = useRef<number | null>(null)
  const skewedRef = useRef(skewed)
  const containerWidthRef = useRef(0)
  const blobsRef = useRef<CanvasBlob[]>([])
  const lastSpawnRef = useRef(0)
  const lastFrameRef = useRef(0)

  const rectElemsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    skewedRef.current = skewed
  }, [skewed])

  // Initialize canvas and blobs
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current

    if (!canvas || !container) return

    const width = container.offsetWidth

    containerWidthRef.current = width

    const dpr = window.devicePixelRatio || 1

    canvas.width = width * dpr
    canvas.height = COMPONENT_HEIGHT * dpr

    blobsRef.current = Array.from({ length: INITIAL_BLOB_COUNT }, () =>
      createBlob(width, skewed, true),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Animation loop
  useEffect(() => {
    const loop = (now: number) => {
      rafIdRef.current = requestAnimationFrame(loop)

      const canvas = canvasRef.current

      if (!canvas) return

      const ctx = canvas.getContext('2d')

      if (!ctx) return

      const dt = lastFrameRef.current ? (now - lastFrameRef.current) / 1000 : 0

      lastFrameRef.current = now

      const isSkewed = skewedRef.current
      const containerWidth = containerWidthRef.current || window.innerWidth
      const blobs = blobsRef.current

      // Update positions
      for (const blob of blobs) {
        if (!isSkewed) {
          blob.x += blob.speed * dt
        } else {
          blob.x += Number(blob.speed * SIN30 * dt)
          blob.y -= Number(blob.speed * COS30 * dt)
        }
      }

      // Remove off-screen blobs
      blobsRef.current = blobs.filter((b) => !isBlobOffScreen(b, containerWidth, isSkewed))

      // Spawn new blobs preemptively — count blobs near the exit edge
      // as leaving so replacements enter while old ones are still visible
      const visibleBlobs = blobsRef.current.filter((b) => isBlobVisible(b, containerWidth))
      const nearExitCount = visibleBlobs.filter((b) =>
        isBlobNearExit(b, containerWidth, isSkewed),
      ).length
      const effectiveVisible = visibleBlobs.length - nearExitCount

      if (effectiveVisible < MIN_VISIBLE_BLOBS && blobsRef.current.length < MAX_BLOBS) {
        blobsRef.current.push(createBlob(containerWidth, isSkewed, false))
        lastSpawnRef.current = now
      }

      // Draw blobs on canvas
      const dpr = window.devicePixelRatio || 1

      ctx.save()
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      drawBlobs(ctx, blobsRef.current, containerWidth, COMPONENT_HEIGHT)
      ctx.restore()

      // Update rect panel blur based on blob proximity
      const currentBlobs = blobsRef.current
      const rectElems = rectElemsRef.current
      const rectCount = rectElems.length

      for (let i = 0; i < rectCount; i++) {
        const el = rectElems[i]

        // eslint-disable-next-line no-continue
        if (!el) continue

        if (i === rectCount - 1) {
          el.style.backdropFilter = 'unset'
          // eslint-disable-next-line no-continue
          continue
        }

        const rectCenterX = Number(i * RECT_WIDTH) + HALF_RECT_WIDTH

        let closestNorm = Infinity

        for (const blob of currentBlobs) {
          const dx = rectCenterX - blob.x
          const dy = RECT_CENTER_Y - blob.y
          const dist = Math.sqrt(Number(dx * dx) + Number(dy * dy))
          const norm = dist / blob.radius

          if (norm < closestNorm) closestNorm = norm
        }

        const distanceFactor = clamp(closestNorm, 0, 1)
        const blurPx = MIN_BLUR_PX + Number(distanceFactor * (MAX_BLUR_PX - MIN_BLUR_PX))
        const blurStr = `blur(${blurPx.toFixed(1)}px)`

        if (el.style.backdropFilter !== blurStr) {
          el.style.backdropFilter = blurStr
        }
      }
    }

    rafIdRef.current = requestAnimationFrame(loop)

    return () => {
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current)
    }
  }, [])

  // Resize handler
  useEffect(() => {
    const el = containerRef.current
    const resizeObserverHandler = throttle(() => {
      if (el) {
        const width = el.offsetWidth

        containerWidthRef.current = width

        const canvas = canvasRef.current

        if (canvas) {
          const dpr = window.devicePixelRatio || 1

          canvas.width = width * dpr
          canvas.height = COMPONENT_HEIGHT * dpr
        }

        const newCount = skewed
          ? Math.ceil(width / (RECT_WIDTH * 0.8))
          : Math.ceil(width / RECT_WIDTH)

        setCount(newCount)
      }
    }, 1000)
    const ro = new ResizeObserver(resizeObserverHandler)

    if (el) {
      containerWidthRef.current = el.offsetWidth
      setCount(
        skewed
          ? Math.ceil(el.offsetWidth / (RECT_WIDTH * 0.5))
          : Math.ceil(el.offsetWidth / RECT_WIDTH),
      )
      ro.observe(el)
    }

    return () => {
      ro.disconnect()
      resizeObserverHandler.cancel()
    }
  }, [skewed])

  return (
    <div ref={containerRef} className={styles.container}>
      <canvas ref={canvasRef} className={styles.blobCanvas} />
      <FractalGlassPanels count={count} skewed={skewed} rectElemsRef={rectElemsRef} />
    </div>
  )
}
