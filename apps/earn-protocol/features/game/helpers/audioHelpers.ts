let audioContext: AudioContext | null = null

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null // Avoid server-side execution
  if (!audioContext) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      audioContext = new (window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext)()
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Web Audio API is not supported in this browser', e)

      return null
    }
  }

  return audioContext
}

// Game Start Sound - Softer, slightly lower pitch
export const playGameStartSound = () => {
  const context = getAudioContext()

  if (!context) return

  const oscillator = context.createOscillator()
  const gainNode = context.createGain()
  const filter = context.createBiquadFilter() // Add a filter
  const now = context.currentTime

  // Lower base frequency (A5) and variation
  const baseFreq = 880.0 // A5
  const freqVariation = (Math.random() - 0.5) * 40 // +/- 20 Hz
  const startFreq = baseFreq + freqVariation
  const endFreq = startFreq / 1.5 // Less drastic drop

  // Configure Oscillator
  oscillator.type = 'sine' // Keep sine for smoothness
  oscillator.frequency.setValueAtTime(startFreq, now)
  oscillator.frequency.exponentialRampToValueAtTime(endFreq, now + 0.15) // Slightly longer ramp

  // Configure Filter (Low-pass to remove harsh highs)
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(4000, now) // Cut off high frequencies

  // Configure Gain (Slightly longer decay)
  gainNode.gain.setValueAtTime(0.3, now) // Slightly lower start volume
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3) // Longer decay

  // Connect nodes: Oscillator -> Filter -> Gain -> Destination
  oscillator.connect(filter)
  filter.connect(gainNode)
  gainNode.connect(context.destination)

  // Start and stop the sound
  oscillator.start(now)
  oscillator.stop(now + 0.3)
}

// Helper function for linear interpolation
const lerp = (a: number, b: number, t: number): number => a + Number(Number(b - a) * t)

// Helper to check if a value is finite, return default if not
const ensureFinite = (value: number, defaultValue: number): number => {
  return Number.isFinite(value) ? value : defaultValue
}

// Correct Selection Sound - Varies based on remaining time (Adjusted for more pleasing tone)
export const playCorrectSound = (timeLeft: number, timerDuration: number) => {
  const context = getAudioContext()

  if (!context) return

  const oscillator = context.createOscillator()
  const gainNode = context.createGain()
  const filter = context.createBiquadFilter()
  const now = context.currentTime

  // Calculate time ratio (0 to 1), ensure timerDuration is valid
  const safeTimerDuration = timerDuration > 0 ? timerDuration : 1 // Avoid division by zero
  const timeRatio = Math.max(0, Math.min(1, timeLeft / safeTimerDuration))

  // Define parameters based on timeRatio (Happy <-> Sad)
  // Lower frequency range: E4 (sad) to A4 (happy)
  const baseStartFreq = lerp(329.63, 440.0, timeRatio)
  const freqVariation = (Math.random() - 0.5) * 20 * timeRatio // Less variation
  const startFreq = ensureFinite(baseStartFreq + freqVariation, 380) // Default ~F#4
  // Keep pitch ramp logic (down when sad, up when happy)
  const endFreqMultiplier = lerp(0.85, 1.15, timeRatio) // Slightly narrower ramp
  const endFreq = ensureFinite(startFreq * endFreqMultiplier, startFreq)
  // Keep duration interpolation (longer when sad)
  const duration = ensureFinite(lerp(0.3, 0.15, timeRatio), 0.2)
  // Lower max filter frequency for less sharpness when happy
  const filterFreq = ensureFinite(lerp(1200, 3000, timeRatio), 2000)
  // Keep volume interpolation
  const volume = ensureFinite(lerp(0.15, 0.25, timeRatio), 0.2)

  // Configure Oscillator
  oscillator.type = 'triangle' // Keep triangle
  oscillator.frequency.setValueAtTime(startFreq, now)
  oscillator.frequency.linearRampToValueAtTime(endFreq, now + Number(duration * 0.8))

  // Configure Filter (Low-pass)
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(filterFreq, now)

  // Configure Gain
  gainNode.gain.setValueAtTime(volume, now)
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration)

  // Connect nodes: Oscillator -> Filter -> Gain -> Destination
  oscillator.connect(filter)
  filter.connect(gainNode)
  gainNode.connect(context.destination)

  // Start and stop the sound
  oscillator.start(now)
  oscillator.stop(now + duration)
}

// Incorrect Selection Sound - Triangle wave, filtered
export const playIncorrectSound = () => {
  const context = getAudioContext()

  if (!context) return

  const oscillator = context.createOscillator()
  const gainNode = context.createGain()
  const filter = context.createBiquadFilter() // Add filter
  const now = context.currentTime

  // Keep low frequencies (A3), add variation
  const baseStartFreq = 220 // A3
  const freqVariation = (Math.random() - 0.5) * 10 // +/- 5 Hz
  const startFreq = baseStartFreq + freqVariation
  const endFreq = startFreq / 1.8 // Less drastic drop

  // Configure Oscillator
  oscillator.type = 'triangle' // Change to triangle
  oscillator.frequency.setValueAtTime(startFreq, now)
  oscillator.frequency.linearRampToValueAtTime(endFreq, now + 0.25) // Slightly longer ramp

  // Configure Filter (Low-pass)
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(1500, now)

  // Configure Gain
  gainNode.gain.setValueAtTime(0.25, now) // Slightly lower volume
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35) // Slightly longer decay

  // Connect nodes: Oscillator -> Filter -> Gain -> Destination
  oscillator.connect(filter)
  filter.connect(gainNode)
  gainNode.connect(context.destination)

  // Start and stop the sound
  oscillator.start(now)
  oscillator.stop(now + 0.35)
}
