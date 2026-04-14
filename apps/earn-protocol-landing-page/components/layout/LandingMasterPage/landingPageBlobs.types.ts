export interface SmallBlob {
  x: number
  startY: number
  age: number
  lifetime: number
  size: number
  swayAmp: number
  swayFreq: number
  speed: number
  direction: 1 | -1
  phase: number
  glowPhase: number
  color: [number, number, number]
  fromBottom: boolean
  offsetX: number
  offsetY: number
  deathStartAge: number | null
  renderX: number
  renderY: number
  hasRender: boolean
  tailStartX: number
  tailStartY: number
  tailEndX: number
  tailEndY: number
  hasTail: boolean
  gravityInfluence: number
}

export interface LargeBlob {
  baseX: number
  baseY: number
  size: number
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
  color: [number, number, number]
}

export type DebrisParticle = {
  x: number
  y: number
  vx: number
  vy: number
  age: number
  lifetime: number
  size: number
  baseAlpha: number
  phase: number
  color: [number, number, number]
}
