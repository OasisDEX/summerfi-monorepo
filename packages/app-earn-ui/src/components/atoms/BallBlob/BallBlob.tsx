'use client'
import { useEffect } from 'react'
import { spline } from '@georgedoescode/spline'
import { createNoise2D } from 'simplex-noise'

// how fast we progress through "time"
const noiseStep = 0.000005

function mapN(n, start1, end1, start2, end2) {
  return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2
}

function createPoints() {
  const points: {
    x: number
    y: number
    originX: number
    originY: number
    noiseOffsetX: number
    noiseOffsetY: number
  }[] = []
  const numPoints = 10
  const angleStep = (Math.PI * 2) / numPoints
  const rad = 30

  for (let i = 1; i <= numPoints; i++) {
    const theta = i * angleStep

    const x = 100 + Number(Math.cos(theta) * rad)
    const y = 100 + Number(Math.sin(theta) * rad)

    points.push({
      x,
      y,
      originX: x,
      originY: y,
      noiseOffsetX: Math.random() * 50,
      noiseOffsetY: Math.random() * 50,
    })
  }

  return points
}

const addBlob = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
  context.fillStyle = '#FFC0CB'
  const points = createPoints()
  const noise = createNoise2D()

  for (let i = 0; i < points.length; i++) {
    const point = points[i]

    const nX = noise(point.noiseOffsetX, point.noiseOffsetX)
    const nY = noise(point.noiseOffsetY, point.noiseOffsetY)
    const x = mapN(nX, -1, 1, point.originX - 5, point.originX + 5)
    const y = mapN(nY, -1, 1, point.originY - 5, point.originY + 5)

    // update the point's current coordinates
    point.x = x
    point.y = y

    // progress the point's x, y values through "time"
    point.noiseOffsetX += noiseStep
    point.noiseOffsetY += noiseStep
  }
  const blobPath = new Path2D(spline(points, 1, true))

  context.fill(blobPath)
}

const drawScene = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
  const { width, height } = canvas

  context.clearRect(0, 0, width, height)
  addBlob(canvas, context)
}

const startAnimation = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
  function animationLoop() {
    drawScene(canvas, context)
    requestAnimationFrame(animationLoop)
  }
  requestAnimationFrame(animationLoop)
}

export const BallBlob = () => {
  useEffect(() => {
    const canvas = document.getElementById('ballCanvasAKAPants') as HTMLCanvasElement
    const context = canvas.getContext('2d') as CanvasRenderingContext2D

    startAnimation(canvas, context)
  }, [])

  return <canvas id="ballCanvasAKAPants" style={{ width: 400, height: 400 }} />
}
