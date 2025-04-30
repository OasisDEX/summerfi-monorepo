/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable no-mixed-operators */
let audioContext: AudioContext | null = null
let mainGainNode: GainNode | null = null
let reverbNode: ConvolverNode | null = null
let delayNodes: { [key: string]: { input: DelayNode; output: GainNode } } = {} // Added for delay effects
let schedulerInterval: NodeJS.Timeout | null = null
let nextNoteTime = 0.0 // When the next note is scheduled to play
let current16thNote = 0 // Which note is currently playing
const lookahead = 25.0 // How frequently to call scheduling function (in milliseconds)
const scheduleAheadTime = 0.1 // How far ahead to schedule audio (sec)

// Song progression tracker
let currentIntensityLevel = 0 // 0-3: Intro, Verse, Chorus, Bridge
let barCount = 0

// Faster progression - Changed from 4 bars to 2 bars for intensity increase
const BARS_PER_INTENSITY_INCREASE = 2

const BPM = 80
const secondsPerBeat = 60.0 / BPM
const secondsPer16thNote = secondsPerBeat / 4

// --- [redacted]-inspired Pattern ---
// Bassline (notes as MIDI note numbers, 0 = rest)
// C Major scale notes: C2=36, D=38, E=40, F=41, G=43, A=45, B=47, C3=48
const bassPattern = [
  36, 0, 40, 0, 43, 0, 36, 0, 41, 0, 45, 0, 43, 41, 40, 36, 36, 0, 40, 0, 43, 0, 36, 0, 48, 0, 45,
  0, 43, 45, 41, 43,
]
const bassPatternLength = bassPattern.length // 32 * 16th notes = 2 bars

// Arpeggio (higher notes) - [redacted] style with brighter sound
const arpPattern = [
  60,
  0,
  64,
  0,
  67,
  0,
  72,
  0, // C4, E4, G4, C5
  65,
  0,
  69,
  0,
  72,
  0,
  76,
  0, // F4, A4, C5, E5
  67,
  0,
  71,
  0,
  74,
  0,
  79,
  0, // G4, B4, D5, G5
  65,
  0,
  69,
  0,
  72,
  0,
  77,
  0, // F4, A4, C5, F5
]
const arpPatternLength = arpPattern.length

// Melody pattern that appears in later sections ([redacted] quirky style)
const melodyPattern = [
  72,
  0,
  74,
  0,
  76,
  79,
  76,
  0,
  74,
  0,
  72,
  0,
  69,
  0,
  72,
  0, // Simple Mario-esque melody
  0,
  0,
  74,
  0,
  76,
  0,
  79,
  0,
  81,
  0,
  79,
  76,
  74,
  0,
  72,
  0,
]
const melodyPatternLength = melodyPattern.length

// --- More [redacted]-like chord progressions ---
// [redacted] games often use jazzy chord progressions with major 7ths and 9ths
const chordProgressions = [
  // Level 0 (Intro) - Simple progression
  [
    [60, 64, 67], // C major: C4, E4, G4
    [67, 71, 74], // G major: G4, B4, D5
    [65, 69, 72], // F major: F4, A4, C5
    [67, 71, 74], // G major: G4, B4, D5
  ],
  // Level 1 (Verse) - Slightly more complex
  [
    [60, 64, 67, 71], // Cmaj7: C4, E4, G4, B4
    [67, 71, 74, 77], // G7: G4, B4, D5, F5
    [65, 69, 72, 76], // Fmaj7: F4, A4, C5, E5
    [62, 65, 69, 72], // Dm7: D4, F4, A4, C5
  ],
  // Level 2 (Chorus) - More [redacted]-like with sus and 9th chords
  [
    [60, 64, 67, 69], // Cadd9: C4, E4, G4, A4
    [60, 65, 67, 72], // Csus4add9: C4, F4, G4, D5
    [65, 69, 72, 74], // Fadd9: F4, A4, C5, D5
    [67, 71, 74, 76], // Gadd9: G4, B4, D5, E5
  ],
  // Level 3 (Bridge) - Full [redacted] jazz progression
  [
    [60, 64, 67, 71, 74], // Cmaj9: C4, E4, G4, B4, D5
    [62, 65, 69, 71, 76], // Dm9: D4, F4, A4, B4, E5
    [65, 69, 72, 76, 79], // Fmaj9: F4, A4, C5, E5, G5
    [67, 71, 74, 77, 81], // G9: G4, B4, D5, F5, A5
  ],
]

// --- Beat callback system ---
let beatListeners: (() => void)[] = []

// Fixed frequency range to avoid console errors
const MAX_FREQ = 20000 // Maximum frequency to prevent clamping warnings

export function addBeatListener(listener: () => void) {
  beatListeners.push(listener)
}

export function removeBeatListener(listener: () => void) {
  beatListeners = beatListeners.filter((l) => l !== listener)
}

// Function to convert MIDI note number to frequency with clamping
function midiNoteToFrequency(note: number): number {
  const freq = Number(2 ** Number((note - 69) / 12)) * 440

  return Math.min(freq, MAX_FREQ) // Clamp frequency to avoid warnings
}

// Create a reverb convolver for [redacted]-style spacious sound
function createReverb(audioCtx: AudioContext): ConvolverNode | null {
  try {
    const convolver = audioCtx.createConvolver()
    const bufferSize = audioCtx.sampleRate * 2 // 2 seconds
    const buffer = audioCtx.createBuffer(2, bufferSize, audioCtx.sampleRate)

    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel)

      for (let i = 0; i < bufferSize; i++) {
        // Exponential decay for a nice reverb tail
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3))
      }
    }

    convolver.buffer = buffer

    return convolver
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to create reverb', e)

    return null
  }
}

// Create a delay effect for rhythmic [redacted]-style sounds
function createDelay(
  audioCtx: AudioContext,
  delayTime: number,
  feedback: number,
): {
  input: DelayNode
  output: GainNode
} {
  const delay = audioCtx.createDelay()

  delay.delayTime.value = delayTime

  const feedbackGain = audioCtx.createGain()

  feedbackGain.gain.value = feedback

  const output = audioCtx.createGain()

  output.gain.value = 0.7

  delay.connect(feedbackGain)
  feedbackGain.connect(delay)
  delay.connect(output)

  return { input: delay, output }
}

// Create distortion curve for bass and leads
function makeDistortionCurve(amount: number): Float32Array {
  const k = typeof amount === 'number' ? amount : 50
  const nSamples = 44100
  const curve = new Float32Array(nSamples)
  const deg = Math.PI / 180

  for (let i = 0; i < nSamples; i++) {
    const x = (i * 2) / nSamples - 1

    curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x))
  }

  return curve
}

function scheduleNote(noteTime: number) {
  if (!audioContext || !mainGainNode) return

  // Check if we should increase intensity (every 2 bars = 32 16th notes)
  if (current16thNote % 32 === 0) {
    barCount++

    // Increase intensity every 2 bars until reaching max level
    if (barCount % BARS_PER_INTENSITY_INCREASE === 0 && currentIntensityLevel < 3) {
      currentIntensityLevel++
    }
  }

  // --- Bass ---
  const bassNote = bassPattern[current16thNote % bassPatternLength]

  if (bassNote > 0) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!audioContext) return
    const osc = audioContext.createOscillator()
    const noteGain = audioContext.createGain()
    const filter = audioContext.createBiquadFilter()

    // [redacted]-like warmer bass with less harshness
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1600, noteTime) // Warmer cutoff
    filter.Q.value = 2 // Resonant [redacted] feel

    // Mix square and sawtooth for [redacted] bass
    const osc2 = audioContext.createOscillator()

    osc.type = 'square'
    osc2.type = 'sawtooth'
    osc.frequency.setValueAtTime(midiNoteToFrequency(bassNote), noteTime)
    osc2.frequency.setValueAtTime(midiNoteToFrequency(bassNote), noteTime)

    // Square slightly detuned for width
    osc2.detune.value = -10

    const osc1Gain = audioContext.createGain()
    const osc2Gain = audioContext.createGain()

    osc1Gain.gain.value = 0.3
    osc2Gain.gain.value = 0.2

    noteGain.gain.setValueAtTime(0.4, noteTime) // Bass volume
    noteGain.gain.exponentialRampToValueAtTime(0.01, noteTime + Number(secondsPer16thNote * 0.9)) // Quick decay

    osc.connect(osc1Gain)
    osc2.connect(osc2Gain)
    osc1Gain.connect(filter)
    osc2Gain.connect(filter)
    filter.connect(noteGain)

    // Add some distortion for harder notes (in higher intensity sections)
    if (currentIntensityLevel >= 2 && current16thNote % 8 === 0) {
      const distortion = audioContext.createWaveShaper()

      distortion.curve = makeDistortionCurve(20) // Mild distortion
      noteGain.connect(distortion)
      distortion.connect(mainGainNode)
    } else {
      noteGain.connect(mainGainNode)
    }

    osc.start(noteTime)
    osc2.start(noteTime)
    osc.stop(noteTime + secondsPer16thNote)
    osc2.stop(noteTime + secondsPer16thNote)
  }

  // --- Arp ---
  if (currentIntensityLevel >= 1) {
    // Only play arps from level 1 onwards
    const arpNote = arpPattern[current16thNote % arpPatternLength]

    if (arpNote > 0) {
      const oscArp = audioContext.createOscillator()
      const arpGain = audioContext.createGain()
      const filter = audioContext.createBiquadFilter()

      // [redacted]-like bright arp sound
      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(2000, noteTime)
      filter.Q.value = 1

      // [redacted] often uses pulse waves with different widths
      oscArp.type = 'square'

      // Create a second oscillator for richness
      const oscArp2 = audioContext.createOscillator()

      oscArp2.type = 'sine'

      oscArp.frequency.setValueAtTime(midiNoteToFrequency(arpNote), noteTime)
      // Avoid octave multiplication that can exceed frequency range
      oscArp2.frequency.setValueAtTime(midiNoteToFrequency(arpNote + 12), noteTime) // One octave higher

      arpGain.gain.setValueAtTime(0.2, noteTime) // Arp volume
      arpGain.gain.exponentialRampToValueAtTime(0.01, noteTime + Number(secondsPer16thNote * 0.9)) // Quick decay

      oscArp.connect(filter)
      oscArp2.connect(filter)
      filter.connect(arpGain)

      // Add delay effects for [redacted]-style arpeggios
      // Arpeggios sound great with precise rhythmic delay
      if (currentIntensityLevel >= 1 && delayNodes.arpeggio) {
        const delaySend = audioContext.createGain()

        delaySend.gain.value = 0.15 + currentIntensityLevel * 0.05 // More delay as intensity increases

        arpGain.connect(delaySend)
        delaySend.connect(delayNodes.arpeggio.input)
      }

      // Also add reverb in higher intensity
      if (currentIntensityLevel >= 2 && reverbNode) {
        const reverbSend = audioContext.createGain()

        reverbSend.gain.value = 0.2
        arpGain.connect(reverbSend)
        reverbSend.connect(reverbNode)
      }

      arpGain.connect(mainGainNode)
      oscArp.start(noteTime)
      oscArp2.start(noteTime)
      oscArp.stop(noteTime + secondsPer16thNote)
      oscArp2.stop(noteTime + secondsPer16thNote)
    }
  }

  // --- Melody (only appears in intensity levels 2-3) ---
  if (currentIntensityLevel >= 2) {
    const melodyNote = melodyPattern[current16thNote % melodyPatternLength]

    if (melodyNote > 0) {
      // [redacted]-style melody using pulse waves
      const melodyOsc = audioContext.createOscillator()
      const melodyGain = audioContext.createGain()

      // [redacted]-style pulse wave
      melodyOsc.type = 'square'

      // Add vibrato for expression
      const vibratoOsc = audioContext.createOscillator()
      const vibratoGain = audioContext.createGain()

      vibratoOsc.type = 'sine'
      vibratoOsc.frequency.value = 6 // 6Hz vibrato
      vibratoGain.gain.value = 3 // Mild vibrato depth

      vibratoOsc.connect(vibratoGain)
      vibratoGain.connect(melodyOsc.detune)

      melodyOsc.frequency.setValueAtTime(midiNoteToFrequency(melodyNote), noteTime)

      // Envelope with slight attack for smooth notes
      melodyGain.gain.setValueAtTime(0.01, noteTime)
      melodyGain.gain.linearRampToValueAtTime(0.25, noteTime + 0.03)
      melodyGain.gain.setValueAtTime(0.25, noteTime + secondsPer16thNote * 0.7)
      melodyGain.gain.exponentialRampToValueAtTime(0.01, noteTime + secondsPer16thNote * 0.9)

      // Bandpass filter for that [redacted] tone
      const melodyFilter = audioContext.createBiquadFilter()

      melodyFilter.type = 'bandpass'
      melodyFilter.frequency.value = 2000
      melodyFilter.Q.value = 2

      melodyOsc.connect(melodyFilter)
      melodyFilter.connect(melodyGain)

      // Add delay effect for melody - [redacted] games often use subtle delay for lead melodies
      if (delayNodes.melody) {
        const delaySend = audioContext.createGain()
        // Dynamic delay level based on melody note position
        const delayAmount = current16thNote % 8 === 0 ? 0.25 : 0.15

        delaySend.gain.value = delayAmount

        melodyGain.connect(delaySend)
        delaySend.connect(delayNodes.melody.input)
      }

      // Add reverb
      if (reverbNode) {
        const reverbSend = audioContext.createGain()

        reverbSend.gain.value = 0.3
        melodyGain.connect(reverbSend)
        reverbSend.connect(reverbNode)
      }

      melodyGain.connect(mainGainNode)

      vibratoOsc.start(noteTime)
      melodyOsc.start(noteTime)
      vibratoOsc.stop(noteTime + secondsPer16thNote)
      melodyOsc.stop(noteTime + secondsPer16thNote)
    }
  }

  // --- Guitar Pluck ([redacted]-style bell/marimba sound) ---
  if (current16thNote % 4 === 0) {
    // Plucked string: filtered noise burst with [redacted] character
    const bufferSize = audioContext.sampleRate * 0.12 // ~120ms
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
    const data = buffer.getChannelData(0)

    // Create a more bell-like attack ([redacted] style)
    for (let i = 0; i < bufferSize; i++) {
      const t = i / audioContext.sampleRate
      // Mix sine wave with noise for bell-like attack
      const sineComponent = Math.sin(2 * Math.PI * 800 * t) * Math.exp(-t * 20)
      const noiseComponent = (Math.random() * 2 - 1) * Math.exp(-t * 10)

      data[i] = sineComponent * 0.6 + noiseComponent * 0.4
    }

    const pluck = audioContext.createBufferSource()

    pluck.buffer = buffer

    // [redacted]-style bright filter
    const pluckFilter = audioContext.createBiquadFilter()

    pluckFilter.type = 'bandpass'
    pluckFilter.frequency.value = 2000 + currentIntensityLevel * 500 // Higher frequencies as intensity increases
    pluckFilter.Q.value = 2

    const pluckGain = audioContext.createGain()

    pluckGain.gain.value = 0.15 + currentIntensityLevel * 0.05

    pluck.connect(pluckFilter)
    pluckFilter.connect(pluckGain)

    // Add reverb in higher intensity levels
    if (currentIntensityLevel >= 1 && reverbNode) {
      const reverbSend = audioContext.createGain()

      reverbSend.gain.value = 0.2
      pluckGain.connect(reverbSend)
      reverbSend.connect(reverbNode)
    }

    pluckGain.connect(mainGainNode)
    pluck.start(noteTime)
    pluck.stop(noteTime + 0.12)
  }

  // --- Percussion (Hi-hat) - More [redacted]-like with filters ---
  if (
    current16thNote % 4 === 1 ||
    current16thNote % 4 === 3 ||
    (currentIntensityLevel >= 2 && current16thNote % 2 === 1)
  ) {
    const bufferSize = audioContext.sampleRate * 0.04 // ~40ms
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Number(Math.random() * 2) - 1) * Math.exp(-i / (bufferSize * 0.7))
    }
    const noise = audioContext.createBufferSource()

    noise.buffer = buffer
    const hhFilter = audioContext.createBiquadFilter()

    // [redacted]-style hi-hat is less harsh
    hhFilter.type = 'highpass'
    hhFilter.frequency.setValueAtTime(5000, noteTime)
    hhFilter.Q.value = 1.5 // Less resonant for softer sound

    const hhGain = audioContext.createGain()

    hhGain.gain.setValueAtTime(0.1, noteTime)
    hhGain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.04)

    noise.connect(hhFilter)
    hhFilter.connect(hhGain)
    hhGain.connect(mainGainNode)
    noise.start(noteTime)
    noise.stop(noteTime + 0.04)
  }

  // --- Percussion (Kick Drum) - [redacted]-style rounded kick ---
  if (current16thNote % 4 === 0) {
    const osc = audioContext.createOscillator()
    const kickGain = audioContext.createGain()

    // [redacted] kicks aren't as boomy, more rounded
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(80, noteTime)
    osc.frequency.exponentialRampToValueAtTime(40, noteTime + 0.08)

    kickGain.gain.setValueAtTime(0.5, noteTime)
    kickGain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.1)

    // Add some click for [redacted]-style attack
    const clickOsc = audioContext.createOscillator()
    const clickGain = audioContext.createGain()

    clickOsc.type = 'sine'
    clickOsc.frequency.value = 600
    clickGain.gain.setValueAtTime(0.2, noteTime)
    clickGain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.02)

    clickOsc.connect(clickGain)
    clickGain.connect(mainGainNode)

    osc.connect(kickGain)
    kickGain.connect(mainGainNode)

    osc.start(noteTime)
    clickOsc.start(noteTime)
    osc.stop(noteTime + 0.1)
    clickOsc.stop(noteTime + 0.02)
  }

  // --- Extra Deep Kick for rhythmic structure (at bar starts) ---
  if (current16thNote % 16 === 0) {
    const osc = audioContext.createOscillator()
    const kickGain = audioContext.createGain()

    // Smoother [redacted]-style bass drums
    osc.type = 'sine'
    osc.frequency.setValueAtTime(60, noteTime)
    osc.frequency.exponentialRampToValueAtTime(30, noteTime + 0.35)
    kickGain.gain.setValueAtTime(0.5, noteTime)
    kickGain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.36)

    osc.connect(kickGain)
    kickGain.connect(mainGainNode)
    osc.start(noteTime)
    osc.stop(noteTime + 0.37)
  }

  // --- Percussion (Snare) - More [redacted]-like softer snare ---
  if (current16thNote % 4 === 2) {
    const bufferSize = audioContext.sampleRate * 0.08 // ~80ms
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Number(Math.random() * 2) - 1) * Math.exp(-i / (bufferSize * 0.5))
    }
    const noise = audioContext.createBufferSource()

    noise.buffer = buffer

    // [redacted] snares often have a tone component
    const toneOsc = audioContext.createOscillator()

    toneOsc.type = 'triangle'
    toneOsc.frequency.value = 180

    const toneGain = audioContext.createGain()

    toneGain.gain.setValueAtTime(0.08, noteTime)
    toneGain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.04)

    const snareFilter = audioContext.createBiquadFilter()

    snareFilter.type = 'bandpass'
    snareFilter.frequency.setValueAtTime(2000, noteTime)
    snareFilter.Q.value = 1

    const snareGain = audioContext.createGain()

    snareGain.gain.setValueAtTime(0.15, noteTime)
    snareGain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.08)

    noise.connect(snareFilter)
    snareFilter.connect(snareGain)
    toneOsc.connect(toneGain)
    toneGain.connect(snareGain)

    // Add delay effect to selected snare hits for rhythmic variation
    // In [redacted] games snare delay often creates a dynamic rhythm section
    if (currentIntensityLevel >= 2 && current16thNote % 8 === 2 && delayNodes.percussion) {
      const delaySend = audioContext.createGain()

      delaySend.gain.value = 0.2
      snareGain.connect(delaySend)
      delaySend.connect(delayNodes.percussion.input)
    }

    snareGain.connect(mainGainNode)

    // Add reverb in higher intensity
    if (currentIntensityLevel >= 2 && reverbNode) {
      const reverbSend = audioContext.createGain()

      reverbSend.gain.value = 0.1
      snareGain.connect(reverbSend)
      reverbSend.connect(reverbNode)
    }

    noise.start(noteTime)
    toneOsc.start(noteTime)
    noise.stop(noteTime + 0.08)
    toneOsc.stop(noteTime + 0.04)
  }

  // --- Percussion Fills (snare roll only in higher intensities) ---
  if (currentIntensityLevel >= 2 && current16thNote % 64 >= 56) {
    // Build more complex fills as intensity increases
    const fillDensity = 1 + currentIntensityLevel // More notes as intensity increases

    if (current16thNote % fillDensity === 0) {
      // [redacted]-style bright snare rolls
      const bufferSize = audioContext.sampleRate * 0.04
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
      const data = buffer.getChannelData(0)

      for (let j = 0; j < bufferSize; j++) {
        data[j] = (Number(Math.random() * 2) - 1) * Math.exp(-j / (bufferSize * 0.5))
      }
      const noise = audioContext.createBufferSource()

      noise.buffer = buffer

      const snareFilter = audioContext.createBiquadFilter()

      snareFilter.type = 'bandpass'
      snareFilter.frequency.setValueAtTime(2000, noteTime)
      snareFilter.Q.value = 1

      const snareGain = audioContext.createGain()

      snareGain.gain.setValueAtTime(0.1, noteTime)
      snareGain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.04)

      // Add panning for width in fills
      const panner = audioContext.createStereoPanner()

      panner.pan.value = Math.random() * 2 - 1 // Random pan position

      noise.connect(snareFilter)
      snareFilter.connect(snareGain)
      snareGain.connect(panner)
      panner.connect(mainGainNode)

      noise.start(noteTime)
      noise.stop(noteTime + 0.04)
    }
  }

  // --- Ambient Chords ([redacted]-style progressions with evolving richness) ---
  // Each chord lasts 1 bar (16 16th notes)
  if (current16thNote % 16 === 0) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!audioContext || !mainGainNode) return

    // Get appropriate chord progression based on current intensity level
    const currentProgression = chordProgressions[currentIntensityLevel]
    const chordIndex = Math.floor((current16thNote / 16) % 4)
    const chordNotes = currentProgression[chordIndex]

    chordNotes.forEach((note, i) => {
      if (!audioContext || !mainGainNode) return

      // Layer more oscillators in higher intensity levels
      const oscillators = []

      // Base pulse wave ([redacted] staple)
      const osc1 = audioContext.createOscillator()

      osc1.type = 'square'
      osc1.frequency.setValueAtTime(midiNoteToFrequency(note), noteTime)
      oscillators.push(osc1)

      // Add triangle as intensity increases
      if (currentIntensityLevel >= 1) {
        const osc2 = audioContext.createOscillator()

        osc2.type = 'triangle'
        osc2.frequency.setValueAtTime(midiNoteToFrequency(note), noteTime)
        oscillators.push(osc2)
      }

      // Add octave up as intensity increases - ensure we don't exceed frequency limits
      if (currentIntensityLevel >= 2 && note < 84) {
        // Only add octave if base note isn't too high
        const osc3 = audioContext.createOscillator()

        osc3.type = 'sine'
        osc3.frequency.setValueAtTime(midiNoteToFrequency(note + 12), noteTime)
        oscillators.push(osc3)
      }

      // Stereo panning for width
      const pan = audioContext.createStereoPanner()

      pan.pan.setValueAtTime(-0.5 + Number(i * 0.5), noteTime) // spread voices

      // Filter sweep for movement - more pronounced in higher intensities
      const filter = audioContext.createBiquadFilter()

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(800, noteTime)
      filter.frequency.linearRampToValueAtTime(2000 + currentIntensityLevel * 300, noteTime + 1.2)
      filter.Q.value = 1 + currentIntensityLevel * 0.5 // More resonant at higher intensities

      // Envelope
      const chordGain = audioContext.createGain()

      chordGain.gain.setValueAtTime(0.06 + currentIntensityLevel * 0.02, noteTime)
      chordGain.gain.linearRampToValueAtTime(0.04, noteTime + 0.8)
      chordGain.gain.exponentialRampToValueAtTime(
        0.001,
        noteTime + Number(secondsPer16thNote * 16) - 0.1,
      )

      // Connect all oscillators to the chain
      oscillators.forEach((osc) => osc.connect(filter))
      filter.connect(pan)
      pan.connect(chordGain)

      // Add reverb in higher intensities
      if (currentIntensityLevel >= 1 && reverbNode) {
        const reverbSend = audioContext.createGain()

        reverbSend.gain.value = 0.2 + currentIntensityLevel * 0.1
        chordGain.connect(reverbSend)
        reverbSend.connect(reverbNode)
      }

      chordGain.connect(mainGainNode)

      // Start and stop all oscillators
      oscillators.forEach((osc) => {
        osc.start(noteTime)
        osc.stop(noteTime + Number(secondsPer16thNote * 16))
      })
    })
  }
}

function scheduler() {
  if (!audioContext) return

  while (nextNoteTime < audioContext.currentTime + scheduleAheadTime) {
    scheduleNote(nextNoteTime)
    // Notify listeners on every 16th note
    beatListeners.forEach((cb) => cb())
    nextNoteTime += secondsPer16thNote
    current16thNote++
  }
}

function initAudioContext() {
  if (!audioContext) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      audioContext = new (window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext)()

      // Create master gain node
      mainGainNode = audioContext.createGain()
      mainGainNode.gain.value = 0.3 // Master volume control

      // Create reverb node for [redacted]-style spaciousness
      reverbNode = createReverb(audioContext)
      if (reverbNode) {
        const reverbGain = audioContext.createGain()

        reverbGain.gain.value = 0.1 // Reverb level
        reverbNode.connect(reverbGain)
        reverbGain.connect(audioContext.destination)
      }

      // Create delay nodes for different instruments
      // Create appropriate delay times for the tempo (80bpm)
      // Quarter note = 60/80 = 0.75 seconds

      // Arpeggio delay - dotted eighth note (0.75 * 0.75 = 0.5625 seconds)
      delayNodes.arpeggio = createDelay(audioContext, secondsPerBeat * 0.75, 0.4)
      delayNodes.arpeggio.output.connect(audioContext.destination)

      // Melody delay - sixteenth note (0.75 / 4 = 0.1875 seconds)
      delayNodes.melody = createDelay(audioContext, secondsPerBeat / 4, 0.3)
      delayNodes.melody.output.connect(audioContext.destination)

      // Percussion delay - eighth note (0.75 / 2 = 0.375 seconds)
      delayNodes.percussion = createDelay(audioContext, secondsPerBeat / 2, 0.15)
      delayNodes.percussion.output.connect(audioContext.destination)

      // Connect master chain
      mainGainNode.connect(audioContext.destination)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Web Audio API is not supported in this browser', e)

      return false
    }
  }

  return true
}

export function startMusic() {
  if (!initAudioContext() || !audioContext) return

  // Reset progression trackers
  currentIntensityLevel = 0
  barCount = 0

  // Resume context if it's suspended (required by browser policies)
  if (audioContext.state === 'suspended') {
    audioContext.resume()
  }

  // Ensure gain is restored and node is connected
  if (mainGainNode) {
    mainGainNode.gain.value = 0.3
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (mainGainNode.context && mainGainNode.context.state !== 'closed') {
      try {
        mainGainNode.disconnect() // Prevent duplicate connections
      } catch {
        // Ignore errors if already disconnected
      }
      mainGainNode.connect(audioContext.destination)
    }
  }

  if (schedulerInterval) return // Already playing

  current16thNote = 0
  nextNoteTime = audioContext.currentTime + 0.05 // Start scheduling slightly ahead
  schedulerInterval = setInterval(scheduler, lookahead)
}

export function stopMusic() {
  if (schedulerInterval) {
    clearInterval(schedulerInterval)
    schedulerInterval = null
  }

  if (mainGainNode) {
    mainGainNode.gain.setTargetAtTime(0, audioContext?.currentTime ?? 0, 0.01) // Fade out quickly
  }

  // Clear delay nodes when stopping music
  delayNodes = {}
}

// Function to ensure AudioContext is resumed after user interaction
export function ensureAudioContextResumed() {
  if (!initAudioContext()) return
  if (audioContext && audioContext.state === 'suspended') {
    // eslint-disable-next-line no-console
    audioContext.resume().catch((e) => console.error('Error resuming AudioContext:', e))
  }
}

export function setMusicVolume(volume: number) {
  if (mainGainNode) {
    mainGainNode.gain.setTargetAtTime(volume, audioContext?.currentTime ?? 0, 0.08)
  }
}
