import { useEffect, useRef } from 'react'

import styles from './FractalGlassBackground.module.css'

const BACKGROUND_COLOR = 'rgb(16,16,16)'
const BLOB_COLORS = ['rgb(255, 73, 164)', 'rgb(176, 73, 255)', 'rgb(244, 63, 94)']
const BLOB_COUNT = 6
const MAX_BLOBS = 6

function parseRgba(input: string): [number, number, number, number] {
  const match = input
    .replace(/\s+/gu, '')
    .match(/^rgba?\((\d{1,3}),(\d{1,3}),(\d{1,3})(?:,(\d*\.?\d+))?\)$/iu)

  if (!match) {
    return [1, 1, 1, 1]
  }

  const r = Math.min(255, Number(match[1])) / 255
  const g = Math.min(255, Number(match[2])) / 255
  const b = Math.min(255, Number(match[3])) / 255

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const a = match[4] !== undefined ? Math.max(0, Math.min(1, Number(match[4]))) : 1

  return [r, g, b, a]
}

interface BlobState {
  x: number // physical pixels
  y: number // physical pixels
  speed: number // physical pixels per second
  radius: number // normalized (fraction of canvas height)
  color: string // blob color
  colorMultiplier: number // brightness multiplier for the blob color
}

function spawnBlob(
  _canvasWidth: number,
  canvasHeight: number,
  initialX?: number,
  blobIndex?: number,
): BlobState {
  return {
    x: initialX ?? -(180 + Number(Math.random() * 220)),
    y: (0.1 + Number(Math.random() * 0.8)) * canvasHeight,
    speed: (10 + Number(Math.random() * 70)) * (window.devicePixelRatio || 1),
    radius: 0.007 + Number(Math.random() * 0.2),
    color:
      BLOB_COLORS[
        blobIndex !== undefined
          ? blobIndex % BLOB_COLORS.length
          : Math.floor(Math.random() * BLOB_COLORS.length)
      ],
    colorMultiplier: 0.5 + Number(Number(Math.random() * 2) * 1.5),
  }
}

export function FractalGlassBackground({ skewed = false }: { skewed?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    const gl = canvas.getContext('webgl')

    if (!gl) {
      // eslint-disable-next-line no-console
      console.error('WebGL not supported')

      return
    }

    const vertexShaderSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `

    const fragmentShaderSource = `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform float u_panelWidth;
      uniform float u_skewTan;
      uniform vec4 u_bgColor;
      uniform float u_blobCount;
      uniform vec2 u_blobPositions[${MAX_BLOBS}];
      uniform float u_blobAlphas[${MAX_BLOBS}];
      uniform float u_blobRadii[${MAX_BLOBS}];
      uniform float u_blobColorsR[${MAX_BLOBS}];
      uniform float u_blobColorsG[${MAX_BLOBS}];
      uniform float u_blobColorsB[${MAX_BLOBS}];
      uniform float u_blobColorMultipliers[${MAX_BLOBS}];
      varying vec2 v_uv;

      float Cir(vec2 uv, float r, float blurFactor) {
        float a = blurFactor > 0.0 ? 0.01 : 0.0;
        float b = blurFactor > 0.0 ? 0.13 * mix(0.8, 1.4, blurFactor) : 5.0 / u_resolution.y;
        return smoothstep(a, b, length(uv) - r);
      }

      void main() {
        vec2 fragCoord = v_uv * u_resolution;

        // Shear panel-space X by Y so vertical bands become skewed while preserving fill.
        float skewOffset = (fragCoord.y - u_resolution.y * 0.5) * u_skewTan;
        float panelX = fragCoord.x + skewOffset;
        float shearPadding = abs(u_skewTan) * u_resolution.y * 0.5;
        float skewedWidth = u_resolution.x + shearPadding * 2.0;

        float panelCount = max(1.0, ceil(skewedWidth / u_panelWidth));
        float totalWidth = panelCount * u_panelWidth;
        float offset = -shearPadding + (skewedWidth - totalWidth) * 0.5;
        float panelIndex = floor((panelX - offset) / u_panelWidth);
        panelIndex = clamp(panelIndex, 0.0, panelCount - 1.0);

        float wave = sin(panelIndex * 0.8 + 0.4 + (u_time * 0.4)) * 0.5 + 0.5;
        float jitter = sin(panelIndex + (u_time * 0.4)) * 0.1;
        float blurFactor = clamp(wave + jitter, 0.0, 2.0);
        float panelBlur = mix(4.0, 8.0, blurFactor);

        float localX = mod(panelX - offset, u_panelWidth);
        float panelGradient = abs((localX / u_panelWidth) * 1.5 - 1.5);
        panelGradient = clamp(panelGradient, 0.0, 1.0);

        vec3 col = u_bgColor.rgb;
        // add noise
        float noise = (fract(sin(dot(fragCoord.xy ,vec2(12.9898,78.233))) * 43758.5453) - 0.5) * panelBlur * 0.005;
        col += noise;

        // Subtle glass tile edge highlight with faint edges and transparent middle
        col += vec3(1.0) * panelGradient * (jitter * 0.5 + 0.5) * 0.05 / (panelBlur * 0.3);

        for (int i = 0; i < ${MAX_BLOBS}; i++) {
          if (float(i) >= u_blobCount) { break; }

          vec2 blobUv = (fragCoord - u_blobPositions[i]) / u_resolution.y;
          float cirMask = Cir(blobUv, u_blobRadii[i], panelBlur);

          // Per-blob color from uniforms with brightness multiplier
          vec3 blobColor = vec3(u_blobColorsR[i] * u_blobColorMultipliers[i], u_blobColorsG[i] * u_blobColorMultipliers[i], u_blobColorsB[i] * u_blobColorMultipliers[i]);
          
          // Additive blob glow — only brightens, never darkens background
          col += blobColor * (1.0 - cirMask) * u_blobAlphas[i] * 0.1;
        }

        gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
      }
    `

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type)

      if (!shader) return null
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        // eslint-disable-next-line no-console
        console.error(gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)

        return null
      }

      return shader
    }

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource)

    if (!vertexShader || !fragmentShader) {
      return
    }

    const program = gl.createProgram()

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!program) {
      return
    }
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      // eslint-disable-next-line no-console
      console.error(gl.getProgramInfoLog(program))

      return
    }

    const positionLocation = gl.getAttribLocation(program, 'a_position')
    const timeLocation = gl.getUniformLocation(program, 'u_time')
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution')
    const panelWidthLocation = gl.getUniformLocation(program, 'u_panelWidth')
    const skewTanLocation = gl.getUniformLocation(program, 'u_skewTan')
    const bgColorLocation = gl.getUniformLocation(program, 'u_bgColor')
    const blobCountLocation = gl.getUniformLocation(program, 'u_blobCount')
    const blobPositionsLocation = gl.getUniformLocation(program, 'u_blobPositions')
    const blobAlphasLocation = gl.getUniformLocation(program, 'u_blobAlphas')
    const blobRadiiLocation = gl.getUniformLocation(program, 'u_blobRadii')
    const blobColorsRLocation = gl.getUniformLocation(program, 'u_blobColorsR')
    const blobColorsGLocation = gl.getUniformLocation(program, 'u_blobColorsG')
    const blobColorsBLocation = gl.getUniformLocation(program, 'u_blobColorsB')
    const blobColorMultipliersLocation = gl.getUniformLocation(program, 'u_blobColorMultipliers')

    const positionBuffer = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    )

    const canvasBackgroundColor = parseRgba(BACKGROUND_COLOR)

    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clearColor(...canvasBackgroundColor)

    gl.useProgram(program)
    if (bgColorLocation) {
      gl.uniform4f(
        bgColorLocation,
        canvasBackgroundColor[0],
        canvasBackgroundColor[1],
        canvasBackgroundColor[2],
        canvasBackgroundColor[3],
      )
    }
    gl.enableVertexAttribArray(positionLocation)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    // Pre-allocate typed arrays for blob uniforms
    const positionsArray = new Float32Array(MAX_BLOBS * 2)
    const alphasArray = new Float32Array(MAX_BLOBS)
    const radiiArray = new Float32Array(MAX_BLOBS)
    const colorsRArray = new Float32Array(MAX_BLOBS)
    const colorsGArray = new Float32Array(MAX_BLOBS)
    const colorsBArray = new Float32Array(MAX_BLOBS)
    const colorMultipliersArray = new Float32Array(MAX_BLOBS)

    const resizeCanvas = () => {
      const devPixelRatio = window.devicePixelRatio || 1
      const displayWidth = Math.round(canvas.clientWidth * devPixelRatio)
      const displayHeight = Math.round(canvas.clientHeight * devPixelRatio)

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth
        canvas.height = displayHeight
        gl.viewport(0, 0, displayWidth, displayHeight)
      }
    }

    // Initial resize to get real canvas dimensions for blob spawning
    resizeCanvas()

    const count = Math.min(BLOB_COUNT, MAX_BLOBS)
    const blobs: BlobState[] = Array.from({ length: count }, (_, i) => {
      // Spread initial blobs evenly across canvas width so it's populated on load
      const spreadX = Number((i / count) * (canvas.width + 200)) - 100

      return spawnBlob(canvas.width, canvas.height, spreadX, i)
    })

    let animationFrameId = 0
    let lastTime = performance.now()
    const startTime = lastTime
    const panelWidth = 60
    const skewTan = skewed ? Math.tan((-30 * Math.PI) / 180) : 0

    const render = () => {
      resizeCanvas()

      const now = performance.now()
      const dt = Math.min((now - lastTime) / 1000, 0.1) // cap delta to avoid jumps

      lastTime = now
      const currentTime = (now - startTime) / 1000

      const fadeMargin = Math.max(300, canvas.width * 0.3)

      // Update blobs and compute alphas
      for (let i = 0; i < blobs.length; i++) {
        const blob = blobs[i]

        blob.x += blob.speed * dt

        // Respawn off the right edge
        if (blob.x > canvas.width + fadeMargin) {
          blobs[i] = spawnBlob(canvas.width, canvas.height, undefined, i)
        }

        // Alpha: fade in from left, fully visible on canvas, fade out to right
        // Calculate per-blob fade distance based on its radius to prevent pop-in
        const blobPixelRadius = blob.radius * canvas.height
        const effectiveFadeMargin = Math.max(fadeMargin, blobPixelRadius * 3)

        let alpha: number

        if (blob.x < 0) {
          alpha = Math.max(0, (blob.x + effectiveFadeMargin) / effectiveFadeMargin)
        } else if (blob.x > canvas.width) {
          alpha = Math.max(0, 1 - Number((blob.x - canvas.width) / effectiveFadeMargin))
        } else {
          alpha = 1
        }

        // Parse blob color from CSS string
        const [r, g, b] = parseRgba(blob.color)

        const iterationIndex = i * 2

        positionsArray[iterationIndex] = blob.x
        positionsArray[iterationIndex + 1] = blob.y
        alphasArray[i] = alpha
        radiiArray[i] = blob.radius
        colorsRArray[i] = r
        colorsGArray[i] = g
        colorsBArray[i] = b
        colorMultipliersArray[i] = blob.colorMultiplier
      }

      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.uniform1f(timeLocation, currentTime)
      if (resolutionLocation) {
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height)
      }
      if (panelWidthLocation) {
        gl.uniform1f(panelWidthLocation, panelWidth)
      }
      if (skewTanLocation) {
        gl.uniform1f(skewTanLocation, skewTan)
      }
      if (blobCountLocation) {
        gl.uniform1f(blobCountLocation, blobs.length)
      }
      if (blobPositionsLocation) {
        gl.uniform2fv(blobPositionsLocation, positionsArray)
      }
      if (blobAlphasLocation) {
        gl.uniform1fv(blobAlphasLocation, alphasArray)
      }
      if (blobRadiiLocation) {
        gl.uniform1fv(blobRadiiLocation, radiiArray)
      }
      if (blobColorsRLocation) {
        gl.uniform1fv(blobColorsRLocation, colorsRArray)
      }
      if (blobColorsGLocation) {
        gl.uniform1fv(blobColorsGLocation, colorsGArray)
      }
      if (blobColorsBLocation) {
        gl.uniform1fv(blobColorsBLocation, colorsBArray)
      }
      if (blobColorMultipliersLocation) {
        gl.uniform1fv(blobColorMultipliersLocation, colorMultipliersArray)
      }

      gl.drawArrays(gl.TRIANGLES, 0, 6)
      animationFrameId = requestAnimationFrame(render)
    }

    const observer = new ResizeObserver(() => {
      resizeCanvas()
    })

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    render()

    // eslint-disable-next-line consistent-return
    return () => {
      cancelAnimationFrame(animationFrameId)
      observer.disconnect()
      gl.deleteBuffer(positionBuffer)
      gl.deleteProgram(program)
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
    }
  }, [skewed])

  return (
    <section className={styles.container} ref={containerRef}>
      <canvas ref={canvasRef} />
    </section>
  )
}
