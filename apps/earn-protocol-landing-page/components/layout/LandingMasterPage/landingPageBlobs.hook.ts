/* eslint-disable no-mixed-operators */
import { type RefObject, useEffect } from 'react'
import { debounce } from 'lodash-es'

import {
  AFTER_PULSE_STRENGTH,
  AFTER_SPAWN_FRACTION,
  BLACKHOLE_DEATH_FADE,
  COLLAPSE_DEBRIS_BOOST,
  COLLAPSE_MAX_PULSE_STRENGTH,
  COLLAPSE_RADIUS_MULTIPLIER,
  COLLAPSE_SPAWN_BOOST,
  COMET_DEBRIS_CAP_MULTIPLIER,
  COMET_DEBRIS_DRAG,
  COMET_DEBRIS_LIFETIME_MAX,
  COMET_DEBRIS_LIFETIME_MIN,
  COMET_DEBRIS_MAX,
  COMET_DEBRIS_MIN,
  COMET_DEBRIS_SIZE_MAX,
  COMET_DEBRIS_SIZE_MIN,
  COMET_DEBRIS_SPREAD,
  DEBRIS_FRAG,
  DEBRIS_VERT,
  FRAME_DT,
  FRAME_DURATION_MS,
  GRAVITY_CENTER_X,
  GRAVITY_CENTER_Y,
  GRAVITY_DEBRIS_THRESHOLD,
  GRAVITY_LERP_SPEED,
  GRAVITY_MOUSE_RADIUS,
  GRAVITY_RADIUS_GROW_SPEED,
  GRAVITY_RADIUS_SHRINK_SPEED,
  LARGE_BLOB_ACTIVE_ALPHA_BOOST,
  LARGE_BLOB_ACTIVE_SCALE_BOOST,
  LARGE_BLOB_CENTER_PULL,
  LARGE_BLOB_IDLE_ALPHA,
  LARGE_BLOB_RESPONSE_LERP_SPEED,
  LARGE_FRAG,
  LARGE_VERT,
  SMALL_FRAG,
  SMALL_VERT,
  TAIL_FRAG,
  TAIL_VERT,
} from '@/components/layout/LandingMasterPage/landingPageBlobs.constants'
import {
  calcGravityPull,
  createLargeBlob,
  easeInOutCubic,
  lerp,
  linkProgram,
  rand,
  spawnSmallBlob,
  updateSmallBlob,
} from '@/components/layout/LandingMasterPage/landingPageBlobs.helpers'
import { createLensPipeline } from '@/components/layout/LandingMasterPage/landingPageBlobs.lens'
import {
  FINALE_CALM_END_S,
  FINALE_FLASH_START_S,
  finalePhase,
  type FinaleState,
} from '@/components/layout/LandingMasterPage/landingPageBlobs.timeline'
import {
  type DebrisParticle,
  type LargeBlob,
  type SmallBlob,
} from '@/components/layout/LandingMasterPage/landingPageBlobs.types'

export const useLandingPageBlobs = ({
  canvasRef,
  canvasRectRef,
  smallBlobCount,
  largeBlobCount,
  gridSrc,
  onFinale,
}: {
  canvasRef?: RefObject<HTMLCanvasElement | null>
  canvasRectRef: RefObject<DOMRect | null>
  smallBlobCount: number
  largeBlobCount: number
  gridSrc: string
  onFinale: () => void
}) => {
  useEffect(() => {
    const canvas = canvasRef?.current

    if (!canvas) return undefined

    let finaleFired = false
    const fireFinale = () => {
      if (finaleFired) return
      finaleFired = true
      onFinale()
    }

    // ---- WebGL2 context ----
    const gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
    }) as WebGL2RenderingContext | null

    if (!gl) {
      const fallbackTimer = window.setTimeout(fireFinale, FINALE_FLASH_START_S * 1000)

      return () => window.clearTimeout(fallbackTimer)
    }

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA) // premultiplied

    // ---- compile programs ----
    let smallProg: WebGLProgram
    let tailProg: WebGLProgram
    let debrisProg: WebGLProgram
    let largeProg: WebGLProgram

    try {
      smallProg = linkProgram(gl, SMALL_VERT, SMALL_FRAG)
      tailProg = linkProgram(gl, TAIL_VERT, TAIL_FRAG)
      debrisProg = linkProgram(gl, DEBRIS_VERT, DEBRIS_FRAG)
      largeProg = linkProgram(gl, LARGE_VERT, LARGE_FRAG)
    } catch {
      const fallbackTimer = window.setTimeout(fireFinale, FINALE_FLASH_START_S * 1000)

      return () => window.clearTimeout(fallbackTimer)
    }

    // ---- small blob geometry: unit quad (-1..1) ----
    const quadVerts = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])
    const quadBuf = gl.createBuffer() as WebGLBuffer

    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf)
    gl.bufferData(gl.ARRAY_BUFFER, quadVerts, gl.STATIC_DRAW)

    // ---- small blob instance buffer ----
    // layout: center(2) size(1) glow(1) alpha(1) color(3) tailA(2) tailB(2) tailTip(2) hasTail(1) = 15 floats
    const SMALL_STRIDE = 15
    const smallInstBuf = gl.createBuffer() as WebGLBuffer

    // ---- small blob VAO ----
    const smallVAO = gl.createVertexArray() as WebGLVertexArrayObject

    gl.bindVertexArray(smallVAO)

    // quad positions
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf)
    const aPosSmall = gl.getAttribLocation(smallProg, 'a_pos')

    gl.enableVertexAttribArray(aPosSmall)
    gl.vertexAttribPointer(aPosSmall, 2, gl.FLOAT, false, 0, 0)

    // instance buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, smallInstBuf)
    const fsize = 4

    const bindInst = (attrName: string, size: number, offset: number) => {
      const loc = gl.getAttribLocation(smallProg, attrName)

      if (loc < 0) return
      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, SMALL_STRIDE * fsize, offset * fsize)
      gl.vertexAttribDivisor(loc, 1)
    }

    bindInst('a_center', 2, 0)
    bindInst('a_size', 1, 2)
    bindInst('a_glow', 1, 3)
    bindInst('a_alpha', 1, 4)
    bindInst('a_color', 3, 5)
    bindInst('a_tailA', 2, 8)
    bindInst('a_tailB', 2, 10)
    bindInst('a_tailTip', 2, 12)
    bindInst('a_hasTail', 1, 14)

    gl.bindVertexArray(null)

    // ---- debris VAO ----
    // layout per point: center(2) size(1) color(3) alpha(1) = 7 floats
    const DEBRIS_VSTRIDE = 7
    const debrisBuf = gl.createBuffer() as WebGLBuffer
    const debrisVAO = gl.createVertexArray() as WebGLVertexArrayObject

    gl.bindVertexArray(debrisVAO)
    gl.bindBuffer(gl.ARRAY_BUFFER, debrisBuf)

    const aDebrisCenter = gl.getAttribLocation(debrisProg, 'a_center')
    const aDebrisSize = gl.getAttribLocation(debrisProg, 'a_size')
    const aDebrisColor = gl.getAttribLocation(debrisProg, 'a_color')
    const aDebrisAlpha = gl.getAttribLocation(debrisProg, 'a_alpha')

    gl.enableVertexAttribArray(aDebrisCenter)
    gl.vertexAttribPointer(aDebrisCenter, 2, gl.FLOAT, false, DEBRIS_VSTRIDE * fsize, 0)
    gl.enableVertexAttribArray(aDebrisSize)
    gl.vertexAttribPointer(aDebrisSize, 1, gl.FLOAT, false, DEBRIS_VSTRIDE * fsize, 2 * fsize)
    gl.enableVertexAttribArray(aDebrisColor)
    gl.vertexAttribPointer(aDebrisColor, 3, gl.FLOAT, false, DEBRIS_VSTRIDE * fsize, 3 * fsize)
    gl.enableVertexAttribArray(aDebrisAlpha)
    gl.vertexAttribPointer(aDebrisAlpha, 1, gl.FLOAT, false, DEBRIS_VSTRIDE * fsize, 6 * fsize)

    gl.bindVertexArray(null)

    // ---- tail VAO ----
    // layout per vertex (3 verts per tail): vertex(2) color(3) alpha(1) = 6 floats
    const TAIL_VSTRIDE = 6
    const tailBuf = gl.createBuffer() as WebGLBuffer
    const tailVAO = gl.createVertexArray() as WebGLVertexArrayObject

    gl.bindVertexArray(tailVAO)
    gl.bindBuffer(gl.ARRAY_BUFFER, tailBuf)

    const aVertexTail = gl.getAttribLocation(tailProg, 'a_vertex')
    const aColorTail = gl.getAttribLocation(tailProg, 'a_color')
    const aAlphaTail = gl.getAttribLocation(tailProg, 'a_alpha')

    gl.enableVertexAttribArray(aVertexTail)
    gl.vertexAttribPointer(aVertexTail, 2, gl.FLOAT, false, TAIL_VSTRIDE * fsize, 0)
    gl.enableVertexAttribArray(aColorTail)
    gl.vertexAttribPointer(aColorTail, 3, gl.FLOAT, false, TAIL_VSTRIDE * fsize, 2 * fsize)
    gl.enableVertexAttribArray(aAlphaTail)
    gl.vertexAttribPointer(aAlphaTail, 1, gl.FLOAT, false, TAIL_VSTRIDE * fsize, 5 * fsize)

    gl.bindVertexArray(null)

    // ---- large blob VAO (reuses quadBuf for geometry, instance buffer for blobs) ----
    const largeInstBuf = gl.createBuffer() as WebGLBuffer
    // layout: center(2) radius(1) alpha(1) color(3) = 7 floats
    const LARGE_STRIDE = 7
    const largeVAO = gl.createVertexArray() as WebGLVertexArrayObject

    gl.bindVertexArray(largeVAO)
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf)
    const aPosLarge = gl.getAttribLocation(largeProg, 'a_pos')

    gl.enableVertexAttribArray(aPosLarge)
    gl.vertexAttribPointer(aPosLarge, 2, gl.FLOAT, false, 0, 0)
    gl.bindBuffer(gl.ARRAY_BUFFER, largeInstBuf)

    const bindLargeInst = (attrName: string, size: number, offset: number) => {
      const loc = gl.getAttribLocation(largeProg, attrName)

      if (loc < 0) return
      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, LARGE_STRIDE * fsize, offset * fsize)
      gl.vertexAttribDivisor(loc, 1)
    }

    bindLargeInst('a_center', 2, 0)
    bindLargeInst('a_radius', 1, 2)
    bindLargeInst('a_alpha', 1, 3)
    bindLargeInst('a_color', 3, 4)

    gl.bindVertexArray(null)

    // ---- lens/finale pipeline ----
    const lens = createLensPipeline(gl, canvas, gridSrc)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // ---- simulation state ----
    let width = 0
    let height = 0
    let rafId = 0
    let initRafId = 0
    let prevTime = 0
    let frameAccumulator = 0
    let smoothedActivation = 0
    let largeBlobActivation = 0
    let dynamicMouseRadius = 1
    let resizeObserver: ResizeObserver | null = null
    let smallBlobs: SmallBlob[] = []
    let largeBlobs: LargeBlob[] = []
    let elapsedS = 0
    let reducedMotionTimer = 0
    let renderFinale: FinaleState = {
      phase: 'CALM',
      collapseProgress: 0,
      flash: 0,
      lensStrength: 0,
      horizon: 0,
    }
    const debrisParticles: DebrisParticle[] = []
    const debrisParticleCap = Math.max(200, smallBlobCount * COMET_DEBRIS_CAP_MULTIPLIER)

    if (reducedMotion) {
      reducedMotionTimer = window.setTimeout(fireFinale, FINALE_CALM_END_S * 1000)
    }

    // cached typed arrays (grown as needed)
    let smallInstData = new Float32Array(smallBlobCount * SMALL_STRIDE)
    let debrisData = new Float32Array(debrisParticleCap * DEBRIS_VSTRIDE)
    let tailVertData = new Float32Array(smallBlobCount * 3 * TAIL_VSTRIDE)
    let largeInstData = new Float32Array(largeBlobCount * LARGE_STRIDE)

    // autonomous black hole pulses: random cooldown, strength and duration
    let pulseCooldown = rand(1, 2)
    let pulseDuration = 0
    let pulseElapsed = 0
    let pulseStrength = 0
    let pulseRadiusMultiplier = 1
    let autoPulseStrength = 0

    const resize = () => {
      const container = canvas.parentElement

      if (!container) return
      const rect = container.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1

      width = Math.max(rect.width, 1)
      height = Math.max(rect.height, 1)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
      lens?.resize(width, height, dpr)
      canvasRectRef.current = rect
      dynamicMouseRadius = Math.max(width, height) * GRAVITY_MOUSE_RADIUS
      largeBlobs = Array.from({ length: largeBlobCount }, (_, i) =>
        createLargeBlob(i, largeBlobCount),
      )
    }
    const resizeDebounced = debounce(resize, 120)

    const seedSmallBlobs = () => {
      smallBlobs = Array.from({ length: smallBlobCount }, () =>
        spawnSmallBlob(width, height, rand(50, 100)),
      )
    }

    const ensureSmallBlobs = (target: number, matured = false) => {
      while (smallBlobs.length < target) {
        const sb = spawnSmallBlob(width, height, undefined)

        // post-collapse spawns skip the slow fade-in (it scales with lifetime,
        // 20-200s) so the black hole's food is visible from the moment it appears
        if (matured) sb.age = sb.lifetime * rand(0.16, 0.5)
        smallBlobs.push(sb)
      }
    }

    const tick = (time: number) => {
      if (prevTime === 0) {
        prevTime = time
        rafId = requestAnimationFrame(tick)

        return
      }

      frameAccumulator += time - prevTime
      prevTime = time
      frameAccumulator = Math.min(frameAccumulator, FRAME_DURATION_MS * 5)

      if (frameAccumulator < FRAME_DURATION_MS) {
        rafId = requestAnimationFrame(tick)

        return
      }

      while (frameAccumulator >= FRAME_DURATION_MS) {
        frameAccumulator -= FRAME_DURATION_MS
        const dt = FRAME_DT

        elapsedS += dt
        const finale = reducedMotion
          ? { phase: 'CALM' as const, collapseProgress: 0, flash: 0, lensStrength: 0, horizon: 0 }
          : finalePhase(elapsedS)

        if (finale.phase === 'FLASH' || finale.phase === 'AFTER') fireFinale()

        renderFinale = finale

        // ---------- gravity ----------
        const simGravCx = GRAVITY_CENTER_X * width
        const simGravCy = GRAVITY_CENTER_Y * height
        const simInvMaxDist = 1 / Math.sqrt(width * width + height * height)
        const baseMouseRadius = height * GRAVITY_MOUSE_RADIUS

        if (finale.phase === 'CALM') {
          if (pulseDuration > 0) {
            pulseElapsed += dt

            if (pulseElapsed >= pulseDuration) {
              pulseDuration = 0
              pulseElapsed = 0
              pulseCooldown = rand(3, 5)
            }
          } else {
            pulseCooldown -= dt

            if (pulseCooldown <= 0) {
              pulseDuration = rand(2.5, 4)
              pulseElapsed = 0
              pulseStrength = rand(0.6, 1.2)
              pulseRadiusMultiplier = rand(1.5, 3)
            }
          }
        } else {
          // lensStrength is the LINEAR collapse ramp (collapseProgress is eased and
          // surges mid-collapse) — linear makes the suction build up gradually;
          // max() keeps full strength once reached, even as lensStrength decays in AFTER
          const ramp = finale.phase === 'COLLAPSE' ? finale.lensStrength : 1

          pulseDuration = 0

          if (finale.phase === 'AFTER') {
            // relax toward a steady feeding pull — at full collapse strength new
            // comets cross the screen in <1s and are never seen
            autoPulseStrength = Math.max(AFTER_PULSE_STRENGTH, autoPulseStrength - dt * 0.5)
          } else {
            autoPulseStrength = Math.max(autoPulseStrength, ramp * COLLAPSE_MAX_PULSE_STRENGTH)
          }
          pulseRadiusMultiplier = lerp(pulseRadiusMultiplier, COLLAPSE_RADIUS_MULTIPLIER, ramp)
        }

        const pulseT = pulseDuration > 0 ? Math.min(pulseElapsed / pulseDuration, 1) : 0

        const pulseEnvelope = Math.sin(Math.PI * pulseT)
        const pulseTargetStrength = pulseStrength * pulseEnvelope

        if (pulseTargetStrength >= autoPulseStrength) {
          autoPulseStrength = pulseTargetStrength
        } else {
          const strengthDecayStep = dt * GRAVITY_RADIUS_SHRINK_SPEED * 0.0025

          autoPulseStrength = Math.max(pulseTargetStrength, autoPulseStrength - strengthDecayStep)
        }

        const rawActivation = autoPulseStrength
        const targetRadius =
          baseMouseRadius * (0.6 + pulseRadiusMultiplier * Math.max(autoPulseStrength, 0.05))

        dynamicMouseRadius = lerp(
          dynamicMouseRadius,
          targetRadius,
          Math.min(dt * GRAVITY_RADIUS_GROW_SPEED * 0.02, 1),
        )
        // easeInOutCubic blows up cubically outside 0..1 — collapse pulse strength
        // exceeds 1, so ease only the 0..1 part and add the excess back linearly
        // (keeps the >1 gravity boost without the cubic explosion)
        const targetActivation =
          easeInOutCubic(Math.min(rawActivation, 1)) + Math.max(rawActivation - 1, 0)

        smoothedActivation = lerp(
          smoothedActivation,
          targetActivation,
          Math.min(dt * GRAVITY_LERP_SPEED, 1),
        )
        largeBlobActivation = lerp(
          largeBlobActivation,
          smoothedActivation,
          Math.min(dt * LARGE_BLOB_RESPONSE_LERP_SPEED, 1),
        )

        // ---------- update small blobs ----------
        // comets keep spawning forever: boosted through the collapse, then easing
        // back to the base count — never a gap, so the feeding stream stays fluid
        const isPostCollapse = finale.phase === 'FLASH' || finale.phase === 'AFTER'
        const spawnTarget = isPostCollapse
          ? Math.floor(smallBlobCount * AFTER_SPAWN_FRACTION)
          : Math.floor(smallBlobCount * (1 + finale.collapseProgress * COLLAPSE_SPAWN_BOOST))

        // once the finale starts, replacements must be visible immediately — the
        // default fade-in scales with lifetime (20-200s), so age-0 spawns are
        // invisible while the gravity eats the visible field, draining the sky
        ensureSmallBlobs(spawnTarget, finale.phase !== 'CALM')

        let writeIndex = 0

        for (const sb of smallBlobs) {
          sb.age += dt
          updateSmallBlob(
            sb,
            dt,
            simGravCx,
            simGravCy,
            smoothedActivation,
            simInvMaxDist,
            dynamicMouseRadius,
          )

          const isNaturalDead = sb.age > sb.lifetime
          const isBlackHoleDead =
            sb.deathStartAge !== null && sb.age - sb.deathStartAge > BLACKHOLE_DEATH_FADE

          if (!isNaturalDead && !isBlackHoleDead) {
            smallBlobs[writeIndex++] = sb
          }
        }
        smallBlobs.length = writeIndex

        // ---------- debris simulation + emission ----------
        let debrisWrite = 0

        for (const particle of debrisParticles) {
          particle.age += dt

          if (particle.age < particle.lifetime) {
            particle.vx *= COMET_DEBRIS_DRAG
            particle.vy *= COMET_DEBRIS_DRAG
            particle.x += particle.vx * dt
            particle.y += particle.vy * dt
            debrisParticles[debrisWrite] = particle
            debrisWrite++
          }
        }
        debrisParticles.length = debrisWrite

        for (const sb of smallBlobs) {
          const progress = sb.age / sb.lifetime
          const fadeIn = Math.min(progress / 0.15, 1)
          const fadeOut = Math.min((1 - progress) / 0.2, 1)
          const deathT =
            sb.deathStartAge === null
              ? 0
              : Math.min((sb.age - sb.deathStartAge) / BLACKHOLE_DEATH_FADE, 1)
          const envelope = fadeIn * fadeOut * (1 - deathT)

          if (envelope > 0 && sb.hasTail) {
            const currentSize = sb.size * envelope

            if (currentSize > 0.35) {
              const motionX = sb.tailStartX - sb.tailEndX
              const motionY = sb.tailStartY - sb.tailEndY
              const motionLen = Math.sqrt(motionX * motionX + motionY * motionY)

              if (motionLen > 0.001) {
                const dirX = motionX / motionLen
                const dirY = motionY / motionLen
                const perpX = -dirY
                const perpY = dirX
                const normalizedSize = Math.min(currentSize / 3, 1)
                const gravityFactor = Math.min(sb.gravityInfluence / 0.12, 1)
                const targetDebris =
                  COMET_DEBRIS_MIN + normalizedSize * (COMET_DEBRIS_MAX - COMET_DEBRIS_MIN)
                const emitCount = Math.max(
                  1,
                  Math.min(
                    Math.round(
                      COMET_DEBRIS_MAX *
                        (1 + finale.collapseProgress * (COLLAPSE_DEBRIS_BOOST - 1)),
                    ),
                    Math.floor(
                      targetDebris *
                        gravityFactor *
                        (1 + finale.collapseProgress * COLLAPSE_DEBRIS_BOOST),
                    ),
                  ),
                )

                const shouldEmitDebris = sb.gravityInfluence > GRAVITY_DEBRIS_THRESHOLD

                if (shouldEmitDebris) {
                  for (let i = 0; i < emitCount; i++) {
                    if (debrisParticles.length >= debrisParticleCap) {
                      break
                    }

                    const idxFactor = (i + 1) / (emitCount + 1)
                    const jitter = (Math.random() - 0.5) * currentSize * COMET_DEBRIS_SPREAD
                    const emitDist = idxFactor * motionLen * (0.25 + normalizedSize * 0.8)
                    const spawnX = sb.renderX - dirX * emitDist + perpX * jitter
                    const spawnY = sb.renderY - dirY * emitDist + perpY * jitter
                    const sparkSpeed = rand(14, 62) * (0.45 + normalizedSize + gravityFactor)
                    const lateralSpeed = rand(-22, 22) * (0.7 + normalizedSize)
                    const vx = -dirX * sparkSpeed + perpX * lateralSpeed
                    const vy = -dirY * sparkSpeed + perpY * lateralSpeed
                    const lifetime = rand(COMET_DEBRIS_LIFETIME_MIN, COMET_DEBRIS_LIFETIME_MAX)
                    const size =
                      COMET_DEBRIS_SIZE_MIN +
                      (COMET_DEBRIS_SIZE_MAX - COMET_DEBRIS_SIZE_MIN) *
                        normalizedSize *
                        (1 - idxFactor * 0.5)
                    const baseAlpha = envelope * gravityFactor * rand(0.28, 0.6)

                    debrisParticles.push({
                      x: spawnX,
                      y: spawnY,
                      vx,
                      vy,
                      age: 0,
                      lifetime,
                      size,
                      baseAlpha,
                      phase: rand(0, Math.PI * 2),
                      color: sb.color,
                      flicker: Math.random() < 0.2,
                    })
                  }
                }
              }
            }
          }
        }
      }

      // ---------- build GPU data & render ----------
      if (lens) {
        lens.beginScenePass()
        lens.drawGrid()
      } else {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)
        gl.viewport(0, 0, canvas.width, canvas.height)
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)
      }

      const renderGravCx = GRAVITY_CENTER_X * width
      const renderGravCy = GRAVITY_CENTER_Y * height
      const t = prevTime * 0.001

      // ---- debris pass (behind tails and heads) ----
      let debrisCount = 0

      if (debrisData.length < debrisParticles.length * DEBRIS_VSTRIDE) {
        debrisData = new Float32Array(
          Math.max(debrisParticles.length * DEBRIS_VSTRIDE * 2, debrisData.length * 2),
        )
      }

      for (const particle of debrisParticles) {
        const lifeT = Math.min(particle.age / particle.lifetime, 1)
        const fade = 1 - lifeT
        const sparkle = 0.45 + 0.55 * Math.abs(Math.sin(particle.age * 22 + particle.phase))
        let alpha = particle.baseAlpha * fade * sparkle
        let [r, g, b] = particle.color

        if (particle.flicker && lifeT > 0.1) {
          const flickerProgress = (lifeT - 0.1) / 0.7
          const flicker =
            flickerProgress * Math.abs(Math.sin(particle.age * 55 + particle.phase * 3))

          r += (1 - r) * flicker
          g += (1 - g) * flicker
          b += (1 - b) * flicker
          alpha = Math.min(alpha * (1 + flicker * 2), 1)
        }

        if (alpha > 0.004) {
          const base = debrisCount * DEBRIS_VSTRIDE

          debrisData[base + 0] = particle.x
          debrisData[base + 1] = particle.y
          debrisData[base + 2] = particle.size
          debrisData[base + 3] = r
          debrisData[base + 4] = g
          debrisData[base + 5] = b
          debrisData[base + 6] = alpha
          debrisCount++
        }
      }

      if (debrisCount > 0) {
        gl.useProgram(debrisProg)
        gl.uniform2f(
          gl.getUniformLocation(debrisProg, 'u_resolution'),
          canvas.width / (window.devicePixelRatio || 1),
          canvas.height / (window.devicePixelRatio || 1),
        )
        gl.bindVertexArray(debrisVAO)
        gl.bindBuffer(gl.ARRAY_BUFFER, debrisBuf)
        gl.bufferData(
          gl.ARRAY_BUFFER,
          debrisData.subarray(0, debrisCount * DEBRIS_VSTRIDE),
          gl.DYNAMIC_DRAW,
        )
        gl.drawArrays(gl.POINTS, 0, debrisCount)
        gl.bindVertexArray(null)
      }

      // ---- tail pass ----
      let tailCount = 0

      if (tailVertData.length < smallBlobs.length * 3 * TAIL_VSTRIDE) {
        tailVertData = new Float32Array(smallBlobs.length * 3 * TAIL_VSTRIDE * 2)
      }

      for (const sb of smallBlobs) {
        const progress = sb.age / sb.lifetime
        const fadeIn = Math.min(progress / 0.15, 1)
        const fadeOut = Math.min((1 - progress) / 0.2, 1)
        const deathT =
          sb.deathStartAge === null
            ? 0
            : Math.min((sb.age - sb.deathStartAge) / BLACKHOLE_DEATH_FADE, 1)
        const envelope = fadeIn * fadeOut * (1 - deathT)

        const shouldSkipTail = envelope <= 0 || !sb.hasTail

        if (!shouldSkipTail) {
          const currentSize = sb.size * envelope
          const dxT = sb.tailEndX - sb.tailStartX
          const dyT = sb.tailEndY - sb.tailStartY
          const tLen = Math.sqrt(dxT * dxT + dyT * dyT)

          if (currentSize > 0.35 && tLen > 0) {
            const perpX = -dyT / tLen
            const perpY = dxT / tLen
            const alpha = envelope * 0.9
            const [r, g, b] = sb.color
            const whiteness = Math.min(sb.velocity / 8, 1)
            const finalR = r + (1 - r) * whiteness
            const finalG = g + (1 - g) * whiteness
            const finalB = b + (1 - b) * whiteness
            const base = tailCount * 3 * TAIL_VSTRIDE

            tailVertData[base + 0] = sb.tailStartX + perpX * currentSize
            tailVertData[base + 1] = sb.tailStartY + perpY * currentSize
            tailVertData[base + 2] = finalR
            tailVertData[base + 3] = finalG
            tailVertData[base + 4] = finalB
            tailVertData[base + 5] = alpha

            tailVertData[base + 6] = sb.tailStartX - perpX * currentSize
            tailVertData[base + 7] = sb.tailStartY - perpY * currentSize
            tailVertData[base + 8] = finalR
            tailVertData[base + 9] = finalG
            tailVertData[base + 10] = finalB
            tailVertData[base + 11] = alpha

            tailVertData[base + 12] = sb.tailEndX
            tailVertData[base + 13] = sb.tailEndY
            tailVertData[base + 14] = finalR
            tailVertData[base + 15] = finalG
            tailVertData[base + 16] = finalB
            tailVertData[base + 17] = 0

            tailCount++
          }
        }
      }

      if (tailCount > 0) {
        gl.useProgram(tailProg)
        gl.uniform2f(
          gl.getUniformLocation(tailProg, 'u_resolution'),
          canvas.width / (window.devicePixelRatio || 1),
          canvas.height / (window.devicePixelRatio || 1),
        )
        gl.bindVertexArray(tailVAO)
        gl.bindBuffer(gl.ARRAY_BUFFER, tailBuf)
        gl.bufferData(
          gl.ARRAY_BUFFER,
          tailVertData.subarray(0, tailCount * 3 * TAIL_VSTRIDE),
          gl.DYNAMIC_DRAW,
        )
        gl.drawArrays(gl.TRIANGLES, 0, tailCount * 3)
        gl.bindVertexArray(null)
      }

      // ---- small blob instanced pass ----
      let instCount = 0

      if (smallInstData.length < smallBlobs.length * SMALL_STRIDE) {
        smallInstData = new Float32Array(smallBlobs.length * SMALL_STRIDE * 2)
      }

      for (const sb of smallBlobs) {
        const progress = sb.age / sb.lifetime
        const fadeIn = Math.min(progress / 0.15, 1)
        const fadeOut = Math.min((1 - progress) / 0.2, 1)
        const deathT =
          sb.deathStartAge === null
            ? 0
            : Math.min((sb.age - sb.deathStartAge) / BLACKHOLE_DEATH_FADE, 1)
        const envelope = fadeIn * fadeOut * (1 - deathT)

        if (envelope > 0) {
          const currentSize = sb.size * envelope
          const glowIntensity = 0.7 + 0.5 * Math.abs(Math.sin(sb.age * 0.8 + sb.glowPhase))
          const glowRadius = currentSize * (2.5 + glowIntensity * 4)
          const alpha = envelope * 0.9
          const [r, g, b] = sb.color
          const whiteness = Math.min(sb.velocity / 5, 1)
          const finalR = r + (1 - r) * whiteness
          const finalG = g + (1 - g) * whiteness
          const finalB = b + (1 - b) * whiteness
          const base = instCount * SMALL_STRIDE

          smallInstData[base + 0] = sb.renderX
          smallInstData[base + 1] = sb.renderY
          smallInstData[base + 2] = currentSize
          smallInstData[base + 3] = glowRadius
          smallInstData[base + 4] = alpha
          smallInstData[base + 5] = finalR
          smallInstData[base + 6] = finalG
          smallInstData[base + 7] = finalB
          smallInstData[base + 8] = sb.tailStartX
          smallInstData[base + 9] = sb.tailStartY
          smallInstData[base + 10] = sb.tailEndX - sb.tailStartX
          smallInstData[base + 11] = sb.tailEndY - sb.tailStartY
          smallInstData[base + 12] = sb.tailEndX
          smallInstData[base + 13] = sb.tailEndY
          smallInstData[base + 14] = sb.hasTail ? 1 : 0
          instCount++
        }
      }

      if (instCount > 0) {
        gl.useProgram(smallProg)
        gl.uniform2f(
          gl.getUniformLocation(smallProg, 'u_resolution'),
          canvas.width / (window.devicePixelRatio || 1),
          canvas.height / (window.devicePixelRatio || 1),
        )
        gl.bindVertexArray(smallVAO)
        gl.bindBuffer(gl.ARRAY_BUFFER, smallInstBuf)
        gl.bufferData(
          gl.ARRAY_BUFFER,
          smallInstData.subarray(0, instCount * SMALL_STRIDE),
          gl.DYNAMIC_DRAW,
        )
        gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, instCount)
        gl.bindVertexArray(null)
      }

      // ---- large blob instanced pass ----
      if (largeInstData.length < largeBlobCount * LARGE_STRIDE) {
        largeInstData = new Float32Array(largeBlobCount * LARGE_STRIDE * 2)
      }

      const activationEased = easeInOutCubic(Math.min(Math.max(largeBlobActivation, 0), 1))
      let lCount = 0

      const lrgInvMaxDist = 1 / Math.sqrt(width * width + height * height)

      for (const lb of largeBlobs) {
        const cx = lb.baseX * width + lb.driftAmpX * Math.sin(lb.driftSpeedX * t) + lb.driftPhaseX
        const cy = lb.baseY * height + lb.driftAmpY * Math.cos(lb.driftSpeedY * t) + lb.driftPhaseY

        const centerWeight = activationEased * LARGE_BLOB_CENTER_PULL
        const centeredCx = lerp(cx, renderGravCx, centerWeight)
        const centeredCy = lerp(cy, renderGravCy, centerWeight)

        const wobble = 1 + 0.1 * Math.sin(lb.wobbleSpeed * t + lb.wobblePhase)
        const activeScale = 1 + activationEased * LARGE_BLOB_ACTIVE_SCALE_BOOST
        const currentRadius = lb.size * wobble * activeScale

        const fadeAlpha =
          (LARGE_BLOB_IDLE_ALPHA +
            activationEased * LARGE_BLOB_ACTIVE_ALPHA_BOOST +
            0.2 * Math.sin(lb.fadeSpeed * t + lb.fadePhase)) *
          // large blobs die in the first third of the collapse so their pink bloom
          // never halos the growing event horizon — only comets keep feeding it
          Math.max(0, 1 - renderFinale.collapseProgress * 3)

        const { pullX, pullY } = calcGravityPull(
          centeredCx,
          centeredCy,
          renderGravCx,
          renderGravCy,
          largeBlobActivation,
          lrgInvMaxDist,
          dynamicMouseRadius,
        )
        const finalCx = centeredCx + pullX
        const finalCy = centeredCy + pullY

        const base = lCount * LARGE_STRIDE

        largeInstData[base + 0] = finalCx
        largeInstData[base + 1] = finalCy
        largeInstData[base + 2] = currentRadius
        largeInstData[base + 3] = fadeAlpha
        // eslint-disable-next-line prefer-destructuring
        largeInstData[base + 4] = lb.color[0]
        // eslint-disable-next-line prefer-destructuring
        largeInstData[base + 5] = lb.color[1]
        // eslint-disable-next-line prefer-destructuring
        largeInstData[base + 6] = lb.color[2]
        lCount++
      }

      if (lCount > 0) {
        gl.useProgram(largeProg)
        gl.uniform2f(
          gl.getUniformLocation(largeProg, 'u_resolution'),
          canvas.width / (window.devicePixelRatio || 1),
          canvas.height / (window.devicePixelRatio || 1),
        )
        gl.bindVertexArray(largeVAO)
        gl.bindBuffer(gl.ARRAY_BUFFER, largeInstBuf)
        gl.bufferData(
          gl.ARRAY_BUFFER,
          largeInstData.subarray(0, lCount * LARGE_STRIDE),
          gl.DYNAMIC_DRAW,
        )
        gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, lCount)
        gl.bindVertexArray(null)
      }

      if (lens) {
        lens.drawLensPass({
          lensStrength: renderFinale.lensStrength,
          flash: renderFinale.flash,
          horizon: renderFinale.horizon,
        })
      }

      rafId = requestAnimationFrame(tick)
    }

    initRafId = requestAnimationFrame(() => {
      resize()
      seedSmallBlobs()
      rafId = requestAnimationFrame(tick)
    })

    const resizeContainer = canvas.parentElement

    if (resizeContainer) {
      resizeObserver = new ResizeObserver(() => resizeDebounced())
      resizeObserver.observe(resizeContainer)
    }

    return () => {
      cancelAnimationFrame(initRafId)
      cancelAnimationFrame(rafId)
      resizeObserver?.disconnect()
      window.clearTimeout(reducedMotionTimer)
      lens?.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [smallBlobCount, largeBlobCount])
}
