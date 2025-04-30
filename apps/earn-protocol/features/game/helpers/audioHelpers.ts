/* eslint-disable no-mixed-operators */
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

// Create a basic reverb with softer decay for more pleasing sound
const createQuickReverb = (context: AudioContext, decayTime = 0.8): ConvolverNode => {
  const convolver = context.createConvolver()
  const rate = context.sampleRate
  const length = rate * decayTime
  const impulse = context.createBuffer(2, length, rate)

  // Create impulse response with softer decay curve
  for (let channel = 0; channel < 2; channel++) {
    const impulseData = impulse.getChannelData(channel)

    for (let i = 0; i < length; i++) {
      // Softer impulse response with less harsh randomness
      const t = i / length

      impulseData[i] = (Math.random() * 1.8 - 0.9) * (1 - t) ** 3
    }
  }

  convolver.buffer = impulse

  return convolver
}

// Game Start Sound - Gentle [redacted]-style "game start" jingle
export const playGameStartSound = () => {
  const context = getAudioContext()

  if (!context) return

  const now = context.currentTime
  const masterGain = context.createGain()

  masterGain.gain.value = 0.35 // Reduced overall volume
  masterGain.connect(context.destination)

  // Create gentle reverb for softness
  const reverb = createQuickReverb(context, 1.2) // Slightly longer reverb for smoothness
  const reverbGain = context.createGain()

  reverbGain.gain.value = 0.18
  reverb.connect(reverbGain)
  reverbGain.connect(context.destination)

  // Create the main "coin" sound with softer tone
  const coinOsc = context.createOscillator()
  const coinGain = context.createGain()

  // Change from square to triangle wave for less harshness
  coinOsc.type = 'triangle'
  coinOsc.frequency.setValueAtTime(988, now) // B5
  // Smoother transition between frequency changes
  coinOsc.frequency.linearRampToValueAtTime(1319, now + 0.11) // E6 - smooth transition

  // Filter for warmer tone
  const coinFilter = context.createBiquadFilter()

  coinFilter.type = 'lowpass' // Changed from bandpass to lowpass for less harshness
  coinFilter.frequency.value = 1800 // Higher cutoff for smoother sound
  coinFilter.Q.value = 0.7 // Less resonant for gentler sound

  // Connect and shape envelope
  coinOsc.connect(coinFilter)
  coinFilter.connect(coinGain)
  coinGain.connect(masterGain)
  coinGain.connect(reverb) // Add reverb

  // Envelope for coin sound - softer attack and release
  coinGain.gain.setValueAtTime(0, now)
  coinGain.gain.linearRampToValueAtTime(0.16, now + 0.04) // Slower attack, lower volume
  coinGain.gain.linearRampToValueAtTime(0.12, now + 0.12)
  coinGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

  // Create a second "fanfare" sound with gentler character
  const fanfareOsc = context.createOscillator()
  const fanfareGain = context.createGain()

  // Triangle waves are much gentler than square
  fanfareOsc.type = 'triangle'
  fanfareOsc.frequency.setValueAtTime(659.25, now + 0.15) // E5
  fanfareOsc.frequency.linearRampToValueAtTime(783.99, now + 0.28) // G5 - smooth transition

  // Instead of harsh waveshaper, use a gentle filter
  const fanfareFilter = context.createBiquadFilter()

  fanfareFilter.type = 'lowpass'
  fanfareFilter.frequency.value = 2200
  fanfareFilter.Q.value = 0.5

  // Connect fanfare
  fanfareOsc.connect(fanfareFilter)
  fanfareFilter.connect(fanfareGain)
  fanfareGain.connect(masterGain)
  fanfareGain.connect(reverb) // Add reverb

  // Envelope for fanfare - gentler transitions
  fanfareGain.gain.setValueAtTime(0, now + 0.15)
  fanfareGain.gain.linearRampToValueAtTime(0.12, now + 0.18)
  fanfareGain.gain.linearRampToValueAtTime(0.15, now + 0.28)
  fanfareGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45)

  // Create a bass note for depth - keep this as sine (already gentle)
  const bassOsc = context.createOscillator()
  const bassGain = context.createGain()

  bassOsc.type = 'sine'
  bassOsc.frequency.setValueAtTime(196, now + 0.15) // G3

  // Connect bass
  bassOsc.connect(bassGain)
  bassGain.connect(masterGain)

  // Envelope for bass - smoother transitions
  bassGain.gain.setValueAtTime(0, now + 0.15)
  bassGain.gain.linearRampToValueAtTime(0.18, now + 0.2) // Gentler attack
  bassGain.gain.linearRampToValueAtTime(0.001, now + 0.45) // Smooth fade out

  // Start and stop all the sounds
  coinOsc.start(now)
  coinOsc.stop(now + 0.25)

  fanfareOsc.start(now + 0.15)
  fanfareOsc.stop(now + 0.45)

  bassOsc.start(now + 0.15)
  bassOsc.stop(now + 0.45)
}

// Helper function for linear interpolation
const lerp = (a: number, b: number, t: number): number => a + Number(Number(b - a) * t)

// Helper to check if a value is finite, return default if not
const ensureFinite = (value: number, defaultValue: number): number => {
  return Number.isFinite(value) ? value : defaultValue
}

// Correct Selection Sound - Gentle Nintendo-style happy sound with subtle variations
export const playCorrectSound = (timeLeft: number, timerDuration: number) => {
  const context = getAudioContext()

  if (!context) return

  const now = context.currentTime
  const masterGain = context.createGain()

  masterGain.gain.value = 0.35 // Reduced overall volume
  masterGain.connect(context.destination)

  // Calculate time ratio (0 to 1) - using ensureFinite to handle any NaN or Infinity cases
  const safeTimerDuration = ensureFinite(timerDuration, 1) // Avoid division by zero
  const timeRatio = Math.max(0, Math.min(1, ensureFinite(timeLeft / safeTimerDuration, 0)))

  // Add subtle randomness for variation in each play
  const variationAmount = 0.15 // Max amount of random variation
  const randomVar = (Math.random() * 2 - 1) * variationAmount // Random value between -0.15 and 0.15

  // Create softer reverb for correct sound - vary reverb time slightly
  const reverbTime = ensureFinite(0.7 + randomVar * 0.2, 0.7) // 0.6-0.8 seconds
  const reverb = createQuickReverb(context, reverbTime)
  const reverbGain = context.createGain()

  reverbGain.gain.value = 0.14 + timeRatio * 0.06 // Gentler reverb
  reverb.connect(reverbGain)
  reverbGain.connect(context.destination)

  // Sound gets more exciting with more time left
  // Main "collect item" sound with softer waveforms
  const mainOsc1 = context.createOscillator()
  const mainOsc2 = context.createOscillator()
  const mainGain = context.createGain()

  // Define parameters based on timeRatio - using ensureFinite to prevent any NaN or Infinity
  const baseFreq1 = ensureFinite(lerp(523.25, 659.25, timeRatio), 523.25) // C5 to E5
  const baseFreq2 = ensureFinite(lerp(783.99, 987.77, timeRatio), 783.99) // G5 to B5

  // Randomize the starting frequency slightly for variation
  const startFreqVar = baseFreq1 * (1 + randomVar * 0.03) // Subtle detune by ±3%
  const endFreqVar = baseFreq2 * (1 + randomVar * 0.02) // Subtle detune by ±2%

  // Randomly choose between triangle and sine for more variation
  mainOsc1.type = Math.random() > 0.5 ? 'triangle' : 'sine'
  mainOsc2.type = 'sine'

  // First note with variation
  mainOsc1.frequency.setValueAtTime(startFreqVar, now)
  mainOsc2.frequency.setValueAtTime(startFreqVar, now)

  // Second note with variation - smooth transitions
  // Vary the transition time slightly
  const transitionTime = 0.08 + randomVar * 0.02 // 0.06-0.10

  mainOsc1.frequency.linearRampToValueAtTime(endFreqVar, now + transitionTime)
  mainOsc2.frequency.linearRampToValueAtTime(endFreqVar, now + transitionTime)

  // Filter for softer tone - vary the filter frequencies
  const filterFreqVar = 1800 + timeRatio * 1000 + randomVar * 200 // Add ±200Hz variation
  const mainFilter = context.createBiquadFilter()

  mainFilter.type = 'lowpass'
  mainFilter.frequency.value = filterFreqVar
  mainFilter.Q.value = 0.5 + timeRatio * 1.5 + randomVar * 0.1 // Slight Q variation

  // Connect oscillators through filter
  mainOsc1.connect(mainFilter)
  mainOsc2.connect(mainFilter)
  mainFilter.connect(mainGain)
  mainGain.connect(masterGain)
  mainGain.connect(reverb)

  // Volume varies with time left - but gentler overall with slight random variation
  const volumeRandom = randomVar * 0.03 // Small volume variation
  const volume = ensureFinite(lerp(0.1, 0.18, timeRatio) + volumeRandom, 0.1)

  // Envelope for main sound - softer attack and release with variation
  const attackTime = 0.04 + randomVar * 0.01 // 0.03-0.05s attack
  const releaseTime = 0.25 + randomVar * 0.05 // 0.20-0.30s release

  mainGain.gain.setValueAtTime(0, now)
  mainGain.gain.linearRampToValueAtTime(volume, now + attackTime)
  mainGain.gain.exponentialRampToValueAtTime(volume * 0.6, now + 0.12)
  mainGain.gain.exponentialRampToValueAtTime(0.001, now + releaseTime)

  // Add a very subtle vibrato for expression - vary rate and depth
  const vibratoOsc = context.createOscillator()
  const vibratoGain = context.createGain()

  // Vary vibrato rate and depth slightly
  const vibratoRate = 6 + timeRatio * 2 + Number(randomVar) * 1 // 5-7Hz base with variation
  const vibratoDepth = 3 + timeRatio * 5 + randomVar * 2 // Vary depth slightly

  vibratoOsc.type = 'sine'
  vibratoOsc.frequency.value = vibratoRate
  vibratoGain.gain.value = vibratoDepth

  vibratoOsc.connect(vibratoGain)
  vibratoGain.connect(mainOsc2.detune)

  // With good timing, add a gentle bonus higher note
  if (timeRatio > 0.6) {
    const bonusOsc = context.createOscillator()
    const bonusGain = context.createGain()

    // Randomly choose between triangle and sine
    bonusOsc.type = Math.random() > 0.3 ? 'triangle' : 'sine'

    // Slightly vary the bonus note frequency
    const bonusFreq = baseFreq2 * (1.2 + randomVar * 0.05) // 1.15-1.25 multiplier

    bonusOsc.frequency.setValueAtTime(bonusFreq, now + 0.12)

    const bonusFilter = context.createBiquadFilter()

    bonusFilter.type = 'lowpass'
    bonusFilter.frequency.value = 2000 + randomVar * 300 // 1700-2300Hz
    bonusFilter.Q.value = 0.5

    bonusOsc.connect(bonusFilter)
    bonusFilter.connect(bonusGain)
    bonusGain.connect(masterGain)
    bonusGain.connect(reverb)

    // Gentler envelope with variation
    const bonusAttack = 0.15 + randomVar * 0.02 // 0.13-0.17s
    const bonusRelease = 0.3 + randomVar * 0.05 // 0.25-0.35s

    bonusGain.gain.setValueAtTime(0, now + 0.12)
    bonusGain.gain.linearRampToValueAtTime(volume * 0.5, now + bonusAttack)
    bonusGain.gain.exponentialRampToValueAtTime(0.001, now + bonusRelease)

    bonusOsc.start(now + 0.12)
    bonusOsc.stop(now + bonusRelease)
  }

  // Occasionally add a tiny "sparkle" high-frequency sound (25% chance)
  if (Math.random() < 0.25 && timeRatio > 0.3) {
    const sparkleOsc = context.createOscillator()
    const sparkleGain = context.createGain()

    sparkleOsc.type = 'sine'
    // High-frequency chime sound
    sparkleOsc.frequency.setValueAtTime(2500 + Math.random() * 1500, now + 0.05)

    // Very quiet
    sparkleGain.gain.setValueAtTime(0, now + 0.05)
    sparkleGain.gain.linearRampToValueAtTime(0.04, now + 0.06)
    sparkleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)

    const sparkleFilter = context.createBiquadFilter()

    sparkleFilter.type = 'bandpass'
    sparkleFilter.frequency.value = 3000
    sparkleFilter.Q.value = 4

    sparkleOsc.connect(sparkleFilter)
    sparkleFilter.connect(sparkleGain)
    sparkleGain.connect(masterGain)
    sparkleGain.connect(reverb)

    sparkleOsc.start(now + 0.05)
    sparkleOsc.stop(now + 0.2)
  }

  // Start and stop all the sounds
  mainOsc1.start(now)
  mainOsc2.start(now)
  vibratoOsc.start(now)

  // Vary the duration slightly
  const stopTime = now + releaseTime

  mainOsc1.stop(stopTime)
  mainOsc2.stop(stopTime)
  vibratoOsc.stop(stopTime)
}

// Incorrect Selection Sound - Sad [redacted]-style "character dying" sound effect
export const playIncorrectSound = () => {
  const context = getAudioContext()

  if (!context) return

  const now = context.currentTime
  const masterGain = context.createGain()

  masterGain.gain.value = 0.35 // Reduced overall volume
  masterGain.connect(context.destination)

  // Create gentle reverb for softness with longer decay
  const reverb = createQuickReverb(context, 1.5) // Longer reverb for sad atmosphere
  const reverbGain = context.createGain()

  reverbGain.gain.value = 0.2 // More reverb for emotional feel
  reverb.connect(reverbGain)
  reverbGain.connect(context.destination)

  // --- STAGE 1: Initial impact sound (character gets hit) ---
  // Initial "impact" sound with gentler waveforms
  const impactOsc = context.createOscillator()
  const impactGain = context.createGain()

  impactOsc.type = 'triangle'
  impactOsc.frequency.setValueAtTime(392, now) // G4

  // Filter for warmer tone
  const impactFilter = context.createBiquadFilter()

  impactFilter.type = 'lowpass'
  impactFilter.frequency.value = 800
  impactFilter.Q.value = 0.5

  // Short envelope for impact
  impactGain.gain.setValueAtTime(0, now)
  impactGain.gain.linearRampToValueAtTime(0.25, now + 0.04)
  impactGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)

  impactOsc.connect(impactFilter)
  impactFilter.connect(impactGain)
  impactGain.connect(masterGain)

  // Add a low "thud" impact
  const thudOsc = context.createOscillator()
  const thudGain = context.createGain()

  thudOsc.type = 'sine'
  thudOsc.frequency.value = 98 // G2

  thudGain.gain.setValueAtTime(0, now)
  thudGain.gain.linearRampToValueAtTime(0.3, now + 0.02)
  thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)

  thudOsc.connect(thudGain)
  thudGain.connect(masterGain)

  // --- STAGE 2: Main "falling" sound (descending arpeggio) ---
  // Classic [redacted]-style death sound with descending notes
  const fallingDelay = 0.15 // Wait a bit after the impact

  // Multiple oscillators for richer harmony
  const fallOsc1 = context.createOscillator()
  const fallOsc2 = context.createOscillator()
  const fallGain = context.createGain()

  fallOsc1.type = 'triangle'
  fallOsc2.type = 'sine'

  // Add tremolo/vibrato effect for emotional feel
  const tremoloOsc = context.createOscillator()
  const tremoloGain = context.createGain()

  tremoloOsc.type = 'sine'
  tremoloOsc.frequency.value = 6 // 6Hz tremolo
  tremoloGain.gain.value = 8 // Medium tremolo depth

  tremoloOsc.connect(tremoloGain)
  tremoloGain.connect(fallOsc1.detune)

  // Descending pattern (like Mario death)
  // 4-note descending pattern with small pauses
  fallOsc1.frequency.setValueAtTime(392, now + fallingDelay) // G4
  fallOsc1.frequency.setValueAtTime(349.23, now + fallingDelay + 0.12) // F4
  fallOsc1.frequency.setValueAtTime(293.66, now + fallingDelay + 0.24) // D4
  fallOsc1.frequency.setValueAtTime(246.94, now + fallingDelay + 0.36) // B3

  // Second oscillator with harmony
  fallOsc2.frequency.setValueAtTime(587.33, now + fallingDelay) // D5
  fallOsc2.frequency.setValueAtTime(523.25, now + fallingDelay + 0.12) // C5
  fallOsc2.frequency.setValueAtTime(440, now + fallingDelay + 0.24) // A4
  fallOsc2.frequency.setValueAtTime(392, now + fallingDelay + 0.36) // G4

  // Filter for warmer tone
  const fallFilter = context.createBiquadFilter()

  fallFilter.type = 'lowpass'
  fallFilter.frequency.value = 1200
  fallFilter.Q.value = 0.8

  // Connect falling sound chain
  fallOsc1.connect(fallFilter)
  fallOsc2.connect(fallFilter)
  fallFilter.connect(fallGain)
  fallGain.connect(masterGain)
  fallGain.connect(reverb) // Add reverb to falling sound

  // Each note has its own envelope for that classic [redacted]-ish sound
  fallGain.gain.setValueAtTime(0, now + fallingDelay)
  fallGain.gain.linearRampToValueAtTime(0.15, now + fallingDelay + 0.03)
  fallGain.gain.setValueAtTime(0.13, now + fallingDelay + 0.12)
  fallGain.gain.linearRampToValueAtTime(0.11, now + fallingDelay + 0.15)
  fallGain.gain.setValueAtTime(0.09, now + fallingDelay + 0.24)
  fallGain.gain.linearRampToValueAtTime(0.07, now + fallingDelay + 0.27)
  fallGain.gain.setValueAtTime(0.05, now + fallingDelay + 0.36)
  fallGain.gain.linearRampToValueAtTime(0.03, now + fallingDelay + 0.39)
  fallGain.gain.exponentialRampToValueAtTime(0.001, now + fallingDelay + 0.8)

  // --- STAGE 3: Final disappearing sound (classic [redacted] death finish) ---
  const finishDelay = fallingDelay + 0.48 // Start after the falling pattern

  // Final "poof" of the character disappearing
  const finishOsc = context.createOscillator()
  const finishGain = context.createGain()
  const noiseBuffer = context.createBuffer(1, context.sampleRate * 0.2, context.sampleRate)

  // Create noise burst for "disappear" effect
  const noiseData = noiseBuffer.getChannelData(0)

  for (let i = 0; i < noiseBuffer.length; i++) {
    noiseData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (noiseBuffer.length * 0.5))
  }

  const noiseSource = context.createBufferSource()

  noiseSource.buffer = noiseBuffer

  // Final sigh sound
  finishOsc.type = 'sine'
  finishOsc.frequency.setValueAtTime(220, now + finishDelay) // A3
  finishOsc.frequency.linearRampToValueAtTime(196, now + finishDelay + 0.3) // G3

  // Filter for noise
  const finishFilter = context.createBiquadFilter()

  finishFilter.type = 'bandpass'
  finishFilter.frequency.value = 800
  finishFilter.Q.value = 1

  // Connect finish sound chain
  noiseSource.connect(finishFilter)
  finishOsc.connect(finishGain)
  finishFilter.connect(finishGain)
  finishGain.connect(masterGain)
  finishGain.connect(reverb)

  // Final envelope
  finishGain.gain.setValueAtTime(0, now + finishDelay)
  finishGain.gain.linearRampToValueAtTime(0.08, now + finishDelay + 0.05)
  finishGain.gain.exponentialRampToValueAtTime(0.001, now + finishDelay + 0.7)

  // Start and stop all sounds
  impactOsc.start(now)
  thudOsc.start(now)
  fallOsc1.start(now + fallingDelay)
  fallOsc2.start(now + fallingDelay)
  tremoloOsc.start(now + fallingDelay)
  finishOsc.start(now + finishDelay)
  noiseSource.start(now + finishDelay)

  // Extended duration to let the sound complete
  impactOsc.stop(now + 0.3)
  thudOsc.stop(now + 0.4)
  fallOsc1.stop(now + fallingDelay + 0.8)
  fallOsc2.stop(now + fallingDelay + 0.8)
  tremoloOsc.stop(now + fallingDelay + 0.8)
  finishOsc.stop(now + finishDelay + 0.7)
  // Noise buffer source stops automatically
}
