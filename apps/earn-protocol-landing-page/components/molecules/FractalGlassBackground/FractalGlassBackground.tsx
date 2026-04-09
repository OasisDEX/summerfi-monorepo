'use client'

import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { debounce, throttle } from 'lodash-es'

import { useScrolled } from '@/hooks/use-scrolled'

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
  {
    width: 550,
    height: 550,
    blur: 90,
    baseOffsetX: 300,
    baseOffsetY: 100,
    mouseOffsetStrength: 2,
  },
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

type Offset = {
  x: number
  y: number
}

type PositionedBlob = BlobState & {
  x: number
  y: number
  centerX: number
  centerY: number
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

const getPositionedBlobs = (blobs: BlobState[], mouseOffset: Offset): PositionedBlob[] => {
  return blobs.map((blob) => {
    const x = blob.baseX + Number(mouseOffset.x * blob.mouseOffsetStrength) - 900
    const y = blob.baseY + Number(mouseOffset.y * blob.mouseOffsetStrength)
    const halfBlobWidth = blob.width / 2
    const halfBlobHeight = blob.height / 2

    return {
      ...blob,
      x,
      y,
      centerX: x + halfBlobWidth,
      centerY: y + halfBlobHeight,
    }
  })
}

const getRectBlur = (rectCenterX: number, blobs: PositionedBlob[]): number => {
  if (!blobs.length) {
    return MAX_BLUR_PX
  }

  const closestNormalizedDistance = blobs.reduce((closestDistance, blob) => {
    const distance = Math.hypot(rectCenterX - blob.centerX, RECT_CENTER_Y - blob.centerY)
    const blobRadius = Math.max(blob.width, blob.height) / 2
    const normalizedDistance = distance / blobRadius

    return Math.min(closestDistance, normalizedDistance)
  }, Number.POSITIVE_INFINITY)

  const distanceFactor = clamp(closestNormalizedDistance, 0, 1)
  const blurRange = MAX_BLUR_PX - MIN_BLUR_PX
  const blurOffset = distanceFactor * blurRange

  return MIN_BLUR_PX + blurOffset
}

const FractalGlassBackgroundBlobs = memo(({ blobs }: { blobs: PositionedBlob[] }) => {
  return (
    <div className={styles.blobsContainer}>
      {blobs.map((blob) => {
        return (
          <div
            key={blob.id}
            className={styles.blob}
            style={{
              left: `${blob.x}px`,
              top: `${blob.y}px`,
              width: `${blob.width}px`,
              height: `${blob.height}px`,
              filter: `blur(${blob.blur}px)`,
              background: `radial-gradient(circle, ${hexToRgba(blob.color, 0.8)} 0%, ${hexToRgba(blob.color, 0.1)} 60%, ${hexToRgba(blob.color, 0)} 100%)`,
            }}
          />
        )
      })}
    </div>
  )
})

export const FractalGlassBackground = ({ skewed = false }: { skewed?: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(0)
  const [blobs, setBlobs] = useState<BlobState[]>([])
  const [viewport, setViewport] = useState({ width: 0 })
  const [mouseOffset, setMouseOffset] = useState<Offset>({ x: 0, y: 0 })
  const { scrolled } = useScrolled()
  const isScrollingRef = useRef(false)

  useEffect(() => {
    /**
     * Detect if the user is scrolling (+ 200ms after scroll end) to reduce mousemove handler work during scroll, which can cause jank due to the number of elements being re-rendered with new blur values on each mouse move.
     */
    if (scrolled > 0) {
      isScrollingRef.current = true
    }

    const timeoutId = setTimeout(() => {
      isScrollingRef.current = false
    }, 200)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [scrolled])

  useEffect(() => {
    const setSize = () => {
      setViewport({ width: window.innerWidth })
    }

    const resizeHandler = debounce(setSize, 1000)

    setSize()
    window.addEventListener('resize', resizeHandler)

    return () => {
      window.removeEventListener('resize', resizeHandler)
      resizeHandler.cancel()
    }
  }, [])

  useEffect(() => {
    if (!viewport.width) {
      return
    }

    const newBlobs: BlobState[] = BLOB_CONFIG.map((config, i) => {
      const xRange = Math.random() * (viewport.width + config.width)
      const xShift = config.width * 0.8
      const yShift = config.height * 0.8

      return {
        id: i,
        baseX: xRange - xShift,
        baseY: COMPONENT_HEIGHT - yShift,
        color: BLOB_COLORS[i % BLOB_COLORS.length],
        width: config.width,
        height: config.height,
        blur: config.blur,
        mouseOffsetStrength: config.mouseOffsetStrength,
      }
    })

    setBlobs(newBlobs)
  }, [viewport])

  useEffect(() => {
    let rafId: number | null = null
    let latestClientX = 0
    let latestClientY = 0

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      latestClientX = e.clientX
      latestClientY = e.clientY

      if (rafId !== null || isScrollingRef.current) return

      rafId = requestAnimationFrame(() => {
        rafId = null
        const xNorm = (latestClientX / window.innerWidth) * 100
        const yNorm = (latestClientY / window.innerHeight) * 100
        const xPercent = xNorm - 50
        const yPercent = yNorm - 50

        setMouseOffset({ x: xPercent, y: yPercent })
      })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
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

  const positionedBlobs = useMemo(
    () => getPositionedBlobs(blobs, mouseOffset),
    [blobs, mouseOffset],
  )

  // Static: only changes when count changes
  const rectGradients = useMemo(
    () => Array.from({ length: count }, (_, i) => getRectGradient(i, count)),
    [count],
  )

  // Dynamic: recomputed when blob positions change (every frame with mouse)
  const rectBlurs = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        if (i === count - 1) return 'unset'
        const left = i * RECT_WIDTH
        const rectCenterX = left + HALF_RECT_WIDTH
        const blurPx = getRectBlur(rectCenterX, positionedBlobs)

        return `blur(${blurPx.toFixed(1)}px)`
      }),
    [count, positionedBlobs],
  )

  return (
    <div ref={containerRef} className={styles.container}>
      <FractalGlassBackgroundBlobs blobs={positionedBlobs} />
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className={styles.rect}
          style={{
            transform: skewed ? 'skewX(-30deg)' : undefined,
            left: `${Number(i * RECT_WIDTH) - (skewed ? Math.tan((30 * Math.PI) / 180) * Number(RECT_WIDTH * 6) : 0)}px`,
            backdropFilter: rectBlurs[i],
            WebkitBackdropFilter: rectBlurs[i],
            background: rectGradients[i],
          }}
        />
      ))}
    </div>
  )
}
