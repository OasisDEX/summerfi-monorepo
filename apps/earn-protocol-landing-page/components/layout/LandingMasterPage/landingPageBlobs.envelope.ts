// Asymmetric attack/release smoother: events and phases set `target`; `update`
// glides `current` toward it. Exponential form makes it framerate-independent
// (N small steps land exactly where one big step does for a fixed target).
export interface Envelope {
  current: number
  target: number
  update: (dt: number) => number
}

export const createEnvelope = ({
  attackRate,
  releaseRate,
  initial = 0,
}: {
  attackRate: number
  releaseRate: number
  initial?: number
}): Envelope => ({
  current: initial,
  target: initial,
  update(dt: number) {
    const rate = this.target > this.current ? attackRate : releaseRate

    this.current += (this.target - this.current) * (1 - Math.exp(-rate * dt))

    return this.current
  },
})
