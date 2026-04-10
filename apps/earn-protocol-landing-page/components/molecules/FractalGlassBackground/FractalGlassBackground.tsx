'use client'

import { memo, type RefObject, useEffect, useMemo, useRef, useState } from 'react'
import { throttle } from 'lodash-es'

import styles from './FractalGlassBackground.module.css'

const RECT_WIDTH = 60
const MIN_BLUR_PX = 10
const MAX_BLUR_PX = 200
const COMPONENT_HEIGHT = 450
const HALF_RECT_WIDTH = RECT_WIDTH / 2
const RECT_CENTER_Y = COMPONENT_HEIGHT / 2

const BLOB_COLORS = ['#FF49A4', '#B049FF', '#9333EA']
const BLOB_CONFIG = [
  {
    width: 600,
    height: 600,
    blur: 100,
    baseOffsetX: -200,
    baseOffsetY: -100,
    mouseOffsetStrength: 0.8,
  },
  {
    width: 500,
    height: 500,
    blur: 70,
    baseOffsetX: -50,
    baseOffsetY: -50,
    mouseOffsetStrength: 0.4,
  },
  { width: 550, height: 550, blur: 90, baseOffsetX: 300, baseOffsetY: 100, mouseOffsetStrength: 2 },
]

type BlobState = {
  id: number
  baseX: number
  baseY: number
  color: string
  width: number
  height: number
  blur: number
  mouseOffsetStrength: number
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max)

function getRectGradient(index: number, total: number): string {
  const t = total > 1 ? index / (total - 1) : 0
  const wave = 0.18 * Math.sin(t * Math.PI)
  const opacity = 0.08 + wave

  return `linear-gradient(to right, rgba(20,20,20,${opacity.toFixed(3)}) 0%, rgba(0,0,0,0.1) 50%, rgba(10,10,10,${opacity.toFixed(3)}) 100%)`
}

const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const FractalGlassBackgroundBlobs = memo(
  ({
    blobs,
    blobElemsRef,
  }: {
    blobs: BlobState[]
    blobElemsRef: RefObject<(HTMLDivElement | null)[]>
  }) => {
    return (
      <div className={styles.blobsContainer}>
        {blobs.map((blob, i) => (
          <div
            key={blob.id}
            ref={(el) => {
              blobElemsRef.current[i] = el
            }}
            className={styles.blob}
            style={{
              // Base position only — mouse offset applied imperatively
              left: `${blob.baseX}px`,
              top: `${blob.baseY}px`,
              width: `${blob.width}px`,
              height: `${blob.height}px`,
              filter: `blur(${blob.blur}px)`,
              background: `radial-gradient(circle, ${hexToRgba(blob.color, 0.8)} 0%, ${hexToRgba(blob.color, 0.1)} 60%, ${hexToRgba(blob.color, 0)} 100%)`,
            }}
          />
        ))}
      </div>
    )
  },
)

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
  const [count, setCount] = useState(0)
  const [blobs, setBlobs] = useState<BlobState[]>([])
  const [viewport, setViewport] = useState({ width: 0 })

  const mouseOffsetRef = useRef({ x: 0, y: 0 })
  const rafIdRef = useRef<number | null>(null)

  const rectElemsRef = useRef<(HTMLDivElement | null)[]>([])
  const blobElemsRef = useRef<(HTMLDivElement | null)[]>([])

  const blobsRef = useRef<BlobState[]>([])

  useEffect(() => {
    blobsRef.current = blobs
  }, [blobs])

  useEffect(() => {
    setViewport({ width: window.innerWidth })
  }, [])

  useEffect(() => {
    if (!viewport.width) return
    const newBlobs: BlobState[] = BLOB_CONFIG.map((config, i) => ({
      id: i,
      baseX: Math.random() * (viewport.width - Number(config.width * 0.5)),
      baseY: Math.random() * (COMPONENT_HEIGHT - Number(config.height * 0.5)),
      color: BLOB_COLORS[i % BLOB_COLORS.length],
      width: config.width,
      height: config.height,
      blur: config.blur,
      mouseOffsetStrength: config.mouseOffsetStrength,
    }))

    setBlobs(newBlobs)
  }, [viewport])

  useEffect(() => {
    const loop = () => {
      rafIdRef.current = requestAnimationFrame(loop)

      const { x: mx, y: my } = mouseOffsetRef.current
      const currentBlobs = blobsRef.current

      const positioned = currentBlobs.map((blob) => {
        const x = blob.baseX + Number(mx * blob.mouseOffsetStrength)
        const y = blob.baseY + Number(my * blob.mouseOffsetStrength)

        return {
          x,
          y,
          centerX: x + Number(blob.width / 2),
          centerY: y + Number(blob.height / 2),
          halfDim: Math.max(blob.width, blob.height) / 2,
          strength: blob.mouseOffsetStrength,
        }
      })

      blobElemsRef.current.forEach((el, i) => {
        if (!el || !currentBlobs[i]) return
        el.style.left = `${positioned[i].x}px`
        el.style.top = `${positioned[i].y}px`
      })

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

        for (let j = 0; j < positioned.length; j++) {
          const pb = positioned[j]
          const dx = rectCenterX - pb.centerX
          const dy = RECT_CENTER_Y - pb.centerY
          const dist = Math.sqrt(Number(dx * dx) + Number(dy * dy))
          const norm = dist / pb.halfDim

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

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      mouseOffsetRef.current = {
        x: Number((e.clientX / window.innerWidth) * 100) - 50,
        y: Number((e.clientY / window.innerHeight) * 100) - 50,
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    const resizeObserverHandler = throttle(() => {
      if (el) {
        setCount(
          skewed
            ? Math.ceil(el.offsetWidth / (RECT_WIDTH * 0.8))
            : Math.ceil(el.offsetWidth / RECT_WIDTH),
        )
      }
    }, 1000)
    const ro = new ResizeObserver(resizeObserverHandler)

    if (el) {
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
      <FractalGlassBackgroundBlobs blobs={blobs} blobElemsRef={blobElemsRef} />
      <FractalGlassPanels count={count} skewed={skewed} rectElemsRef={rectElemsRef} />
    </div>
  )
}
