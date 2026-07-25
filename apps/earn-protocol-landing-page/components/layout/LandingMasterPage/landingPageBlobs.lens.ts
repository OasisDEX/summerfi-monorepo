/* eslint-disable no-mixed-operators */
import {
  GRAVITY_CENTER_X,
  GRAVITY_CENTER_Y,
  GRID_FRAG,
  GRID_SCALE,
  GRID_VERT,
  LENS_FRAG,
  LENS_VERT,
} from '@/components/layout/LandingMasterPage/landingPageBlobs.constants'
import { linkProgram } from '@/components/layout/LandingMasterPage/landingPageBlobs.helpers'

export interface LensPipeline {
  resize: (cssWidth: number, cssHeight: number, dpr: number) => void
  beginScenePass: () => void
  drawGrid: (boost: number) => void
  drawLensPass: (opts: {
    lensStrength: number
    flash: number
    horizon: number
    time: number
    energy: number
  }) => void
  dispose: () => void
}

export const createLensPipeline = (
  gl: WebGL2RenderingContext,
  canvas: HTMLCanvasElement,
  gridSrc: string,
  noiseSrc: string,
): LensPipeline | null => {
  let gridProg: WebGLProgram
  let lensProg: WebGLProgram

  try {
    gridProg = linkProgram(gl, GRID_VERT, GRID_FRAG)
    lensProg = linkProgram(gl, LENS_VERT, LENS_FRAG)
  } catch {
    return null
  }

  // fullscreen quad shared by grid + lens passes
  const quadBuf = gl.createBuffer() as WebGLBuffer

  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)

  const makeQuadVAO = (prog: WebGLProgram): WebGLVertexArrayObject => {
    const vao = gl.createVertexArray() as WebGLVertexArrayObject

    gl.bindVertexArray(vao)
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf)
    const aPos = gl.getAttribLocation(prog, 'a_pos')

    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)
    gl.bindVertexArray(null)

    return vao
  }

  const gridVAO = makeQuadVAO(gridProg)
  const lensVAO = makeQuadVAO(lensProg)

  // ---- offscreen scene FBO ----
  const fbo = gl.createFramebuffer()
  const sceneTex = gl.createTexture()

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!fbo || !sceneTex) return null

  let fboWidth = 0
  let fboHeight = 0
  let cssW = 1
  let cssH = 1

  const resize = (cssWidth: number, cssHeight: number, dpr: number) => {
    const cappedDpr = Math.min(dpr, 2)

    cssW = Math.max(cssWidth, 1)
    cssH = Math.max(cssHeight, 1)
    fboWidth = Math.max(Math.round(cssW * cappedDpr), 1)
    fboHeight = Math.max(Math.round(cssH * cappedDpr), 1)

    gl.bindTexture(gl.TEXTURE_2D, sceneTex)
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      fboWidth,
      fboHeight,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null,
    )
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.bindTexture(gl.TEXTURE_2D, null)
  }

  resize(canvas.width, canvas.height, 1)

  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, sceneTex, 0)
  const fboOk = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE

  gl.bindFramebuffer(gl.FRAMEBUFFER, null)

  if (!fboOk) return null

  // ---- grid texture: load the SVG asynchronously; drawGrid is a no-op until ready ----
  const gridTex = gl.createTexture() as WebGLTexture
  let gridReady = false
  let gridW = 0
  let gridH = 0
  let disposed = false
  const gridImg = new Image()

  gridImg.onload = () => {
    if (disposed) return
    gridW = gridImg.naturalWidth
    gridH = gridImg.naturalHeight
    gl.bindTexture(gl.TEXTURE_2D, gridTex)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, gridImg)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.bindTexture(gl.TEXTURE_2D, null)
    gridReady = true
  }
  gridImg.src = gridSrc

  // ---- noise texture for the molten horizon; the shader falls back to the
  // inverted-sky look until it's ready (512² power-of-two, so REPEAT is legal) ----
  const noiseTex = gl.createTexture() as WebGLTexture
  let noiseReady = false
  const noiseImg = new Image()

  noiseImg.onload = () => {
    if (disposed) return
    gl.bindTexture(gl.TEXTURE_2D, noiseTex)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, noiseImg)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
    gl.bindTexture(gl.TEXTURE_2D, null)
    noiseReady = true
  }
  noiseImg.src = noiseSrc

  const beginScenePass = () => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
    gl.viewport(0, 0, fboWidth, fboHeight)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
  }

  const drawGrid = (boost: number) => {
    if (!gridReady) return
    const w = gridW * GRID_SCALE
    const h = gridH * GRID_SCALE

    gl.useProgram(gridProg)
    gl.uniform2f(gl.getUniformLocation(gridProg, 'u_resolution'), cssW, cssH)
    gl.uniform1f(gl.getUniformLocation(gridProg, 'u_boost'), boost)
    // anchored to the top-right corner, like the old DOM <Image>
    gl.uniform4f(gl.getUniformLocation(gridProg, 'u_rect'), cssW - w, 0, w, h)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, gridTex)
    gl.uniform1i(gl.getUniformLocation(gridProg, 'u_texture'), 0)
    gl.bindVertexArray(gridVAO)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    gl.bindVertexArray(null)
    gl.bindTexture(gl.TEXTURE_2D, null)
  }

  const drawLensPass = ({
    lensStrength,
    flash,
    horizon,
    time,
    energy,
  }: {
    lensStrength: number
    flash: number
    horizon: number
    time: number
    energy: number
  }) => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(lensProg)
    gl.uniform2f(gl.getUniformLocation(lensProg, 'u_resolution'), cssW, cssH)
    gl.uniform2f(
      gl.getUniformLocation(lensProg, 'u_wellCenter'),
      GRAVITY_CENTER_X,
      GRAVITY_CENTER_Y,
    )
    gl.uniform1f(gl.getUniformLocation(lensProg, 'u_lensStrength'), lensStrength)
    gl.uniform1f(gl.getUniformLocation(lensProg, 'u_flash'), flash)
    gl.uniform1f(gl.getUniformLocation(lensProg, 'u_horizon'), horizon)
    gl.uniform1f(gl.getUniformLocation(lensProg, 'u_time'), time)
    gl.uniform1f(gl.getUniformLocation(lensProg, 'u_energy'), energy)
    gl.uniform1f(gl.getUniformLocation(lensProg, 'u_texReady'), noiseReady ? 1 : 0)
    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, noiseTex)
    gl.uniform1i(gl.getUniformLocation(lensProg, 'u_noiseTex'), 1)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, sceneTex)
    gl.uniform1i(gl.getUniformLocation(lensProg, 'u_scene'), 0)
    gl.bindVertexArray(lensVAO)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    gl.bindVertexArray(null)
    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, null)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, null)
  }

  const dispose = () => {
    disposed = true
    gl.deleteFramebuffer(fbo)
    gl.deleteTexture(sceneTex)
    gl.deleteTexture(gridTex)
    gl.deleteTexture(noiseTex)
    gl.deleteBuffer(quadBuf)
    gl.deleteVertexArray(gridVAO)
    gl.deleteVertexArray(lensVAO)
    gl.deleteProgram(gridProg)
    gl.deleteProgram(lensProg)
  }

  return { resize, beginScenePass, drawGrid, drawLensPass, dispose }
}
