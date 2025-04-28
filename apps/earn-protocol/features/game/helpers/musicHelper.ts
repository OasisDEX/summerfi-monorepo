// filepath: src/app/helpers/musicHelper.ts
let audioContext: AudioContext | null = null
let mainGainNode: GainNode | null = null
let schedulerInterval: NodeJS.Timeout | null = null
let nextNoteTime = 0.0 // When the next note is scheduled to play
let current16thNote = 0 // Which note is currently playing
const lookahead = 25.0 // How frequently to call scheduling function (in milliseconds)
const scheduleAheadTime = 0.1 // How far ahead to schedule audio (sec)

const BPM = 80
const secondsPerBeat = 60.0 / BPM
const secondsPer16thNote = secondsPerBeat / 4

// --- Simple Synthwave Pattern ---
// Bassline (notes as MIDI note numbers, 0 = rest)
// C Minor scale notes: C2=36, D=38, Eb=39, F=41, G=43, Ab=44, Bb=45, C3=48
const bassPattern = [
  36, 0, 36, 0, 39, 0, 36, 0, 41, 0, 36, 0, 43, 41, 39, 36, 36, 0, 36, 0, 39, 0, 36, 0, 44, 0, 41,
  0, 45, 44, 41, 39,
]
const bassPatternLength = bassPattern.length // 32 * 16th notes = 2 bars

// Arpeggio (higher notes)
const arpPattern = [
  60,
  0,
  63,
  0,
  60,
  0,
  67,
  0, // C4, Eb4, C4, G4
  60,
  0,
  63,
  0,
  60,
  0,
  68,
  0, // C4, Eb4, C4, Ab4
  60,
  0,
  63,
  0,
  60,
  0,
  67,
  0, // C4, Eb4, C4, G4
  60,
  0,
  68,
  0,
  70,
  0,
  72,
  0, // C4, Ab4, Bb4, C5
]
const arpPatternLength = arpPattern.length

// --- Beat callback system ---
let beatListeners: (() => void)[] = []

export function addBeatListener(listener: () => void) {
  beatListeners.push(listener)
}

export function removeBeatListener(listener: () => void) {
  beatListeners = beatListeners.filter((l) => l !== listener)
}

// Function to convert MIDI note number to frequency
function midiNoteToFrequency(note: number): number {
  return Number(2 ** Number((note - 69) / 12)) * 440
}

function scheduleNote(noteTime: number) {
  if (!audioContext || !mainGainNode) return

  // --- Bass ---
  const bassNote = bassPattern[current16thNote % bassPatternLength]

  if (bassNote > 0) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!audioContext) return
    const osc = audioContext.createOscillator()
    const noteGain = audioContext.createGain()
    const filter = audioContext.createBiquadFilter()

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1200, noteTime) // Smooth cutoff
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(midiNoteToFrequency(bassNote), noteTime)
    noteGain.gain.setValueAtTime(0.4, noteTime) // Bass volume
    noteGain.gain.exponentialRampToValueAtTime(0.01, noteTime + Number(secondsPer16thNote * 0.9)) // Quick decay

    osc.connect(noteGain)
    noteGain.connect(filter)
    filter.connect(mainGainNode)
    osc.start(noteTime)
    osc.stop(noteTime + secondsPer16thNote)
  }

  // --- Arp ---
  const arpNote = arpPattern[current16thNote % arpPatternLength]

  if (arpNote > 0) {
    const oscArp = audioContext.createOscillator()
    const arpGain = audioContext.createGain()
    const filter = audioContext.createBiquadFilter()

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(2000, noteTime) // Softer for arp
    oscArp.type = 'triangle' // Softer sound for arp
    oscArp.frequency.setValueAtTime(midiNoteToFrequency(arpNote), noteTime)
    arpGain.gain.setValueAtTime(0.2, noteTime) // Arp volume
    arpGain.gain.exponentialRampToValueAtTime(0.01, noteTime + Number(secondsPer16thNote * 0.9)) // Quick decay

    oscArp.connect(arpGain)
    arpGain.connect(filter)
    filter.connect(mainGainNode)
    oscArp.start(noteTime)
    oscArp.stop(noteTime + secondsPer16thNote)
  }

  // --- Guitar Pluck (flair) ---
  // Add a pluck on every 4th 16th note (once per beat) if there's an arp note
  if (current16thNote % 4 === 0 && arpNote > 0) {
    // Plucked string: filtered noise burst
    const bufferSize = audioContext.sampleRate * 0.12 // ~120ms
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Number(Math.random() * 2) - 1) * Math.exp(-i / (bufferSize * 0.7)) // Exponential decay
    }
    const noise = audioContext.createBufferSource()

    noise.buffer = buffer
    const pluckFilter = audioContext.createBiquadFilter()

    pluckFilter.type = 'bandpass'
    pluckFilter.frequency.setValueAtTime(midiNoteToFrequency(arpNote), noteTime)
    pluckFilter.Q.value = 10
    const pluckGain = audioContext.createGain()

    pluckGain.gain.setValueAtTime(0.18, noteTime)
    pluckGain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.12)
    noise.connect(pluckFilter)
    pluckFilter.connect(pluckGain)
    pluckGain.connect(mainGainNode)
    noise.start(noteTime)
    noise.stop(noteTime + 0.12)
  }

  // --- Percussion (Hi-hat) ---
  // Add a hi-hat on every 2nd and 4th 16th note (off-beats)
  if (current16thNote % 4 === 1 || current16thNote % 4 === 3) {
    const bufferSize = audioContext.sampleRate * 0.04 // ~40ms
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Number(Math.random() * 2) - 1) * Math.exp(-i / (bufferSize * 0.7))
    }
    const noise = audioContext.createBufferSource()

    noise.buffer = buffer
    const hhFilter = audioContext.createBiquadFilter()

    hhFilter.type = 'highpass'
    hhFilter.frequency.setValueAtTime(6000, noteTime)
    const hhGain = audioContext.createGain()

    hhGain.gain.setValueAtTime(0.12, noteTime)
    hhGain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.04)
    noise.connect(hhFilter)
    hhFilter.connect(hhGain)
    hhGain.connect(mainGainNode)
    noise.start(noteTime)
    noise.stop(noteTime + 0.04)
  }

  // --- Percussion (Kick Drum) ---
  // Add a kick on every first 16th note of each beat
  if (current16thNote % 4 === 0) {
    const osc = audioContext.createOscillator()
    const kickGain = audioContext.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(120, noteTime)
    osc.frequency.exponentialRampToValueAtTime(40, noteTime + 0.09)
    kickGain.gain.setValueAtTime(0.22, noteTime)
    kickGain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.11)
    osc.connect(kickGain)
    kickGain.connect(mainGainNode)
    osc.start(noteTime)
    osc.stop(noteTime + 0.12)
  }

  // --- Extra Deep Kick (every bar) ---
  if (current16thNote % 16 === 0) {
    const osc = audioContext.createOscillator()
    const kickGain = audioContext.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(60, noteTime)
    osc.frequency.exponentialRampToValueAtTime(24, noteTime + 0.38) // lower and longer
    kickGain.gain.setValueAtTime(0.6, noteTime) // louder
    kickGain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.39) // longer decay
    osc.connect(kickGain)
    kickGain.connect(mainGainNode)
    osc.start(noteTime)
    osc.stop(noteTime + 0.4)
  }

  // --- Extra Deep Kick 2 (even deeper, every 2 bars) ---
  if (current16thNote % 32 === 0) {
    const osc = audioContext.createOscillator()
    const kickGain = audioContext.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(38, noteTime)
    osc.frequency.exponentialRampToValueAtTime(12, noteTime + 0.48) // lower and longer
    kickGain.gain.setValueAtTime(0.7, noteTime) // louder
    kickGain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.49) // longer decay
    osc.connect(kickGain)
    kickGain.connect(mainGainNode)
    osc.start(noteTime)
    osc.stop(noteTime + 0.5)
  }

  // --- Percussion (Snare) ---
  // Add a snare on the 3rd 16th note of each beat
  if (current16thNote % 4 === 2) {
    const bufferSize = audioContext.sampleRate * 0.08 // ~80ms
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Number(Math.random() * 2) - 1) * Math.exp(-i / (bufferSize * 0.5))
    }
    const noise = audioContext.createBufferSource()

    noise.buffer = buffer
    const snareFilter = audioContext.createBiquadFilter()

    snareFilter.type = 'highpass'
    snareFilter.frequency.setValueAtTime(1800, noteTime)
    const snareGain = audioContext.createGain()

    snareGain.gain.setValueAtTime(0.18, noteTime)
    snareGain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.08)
    noise.connect(snareFilter)
    snareFilter.connect(snareGain)
    snareGain.connect(mainGainNode)
    noise.start(noteTime)
    noise.stop(noteTime + 0.08)
  }

  // --- Percussion Fills (snare roll every 8 bars) ---
  if (current16thNote % 128 === 112) {
    // Snare roll: rapid snare hits
    for (let i = 0; i < 8; i++) {
      const fillTime = noteTime + Number(i * (secondsPer16thNote / 8))
      const bufferSize = audioContext.sampleRate * 0.04 // ~40ms
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
      const data = buffer.getChannelData(0)

      for (let j = 0; j < bufferSize; j++) {
        data[j] = (Number(Math.random() * 2) - 1) * Math.exp(-j / (bufferSize * 0.5))
      }
      const noise = audioContext.createBufferSource()

      noise.buffer = buffer
      const snareFilter = audioContext.createBiquadFilter()

      snareFilter.type = 'highpass'
      snareFilter.frequency.setValueAtTime(1800, fillTime)
      const snareGain = audioContext.createGain()

      snareGain.gain.setValueAtTime(0.13, fillTime)
      snareGain.gain.exponentialRampToValueAtTime(0.001, fillTime + 0.04)
      noise.connect(snareFilter)
      snareFilter.connect(snareGain)
      snareGain.connect(mainGainNode)
      noise.start(fillTime)
      noise.stop(fillTime + 0.04)
    }
  }

  // --- Ambient Chords (C - G - Am - F progression, synthwave style) ---
  // Each chord lasts 1 bar (16 16th notes)
  const chordProgression = [
    [60, 64, 67], // C major: C4, E4, G4
    [67, 71, 74], // G major: G4, B4, D5
    [69, 72, 76], // A minor: A4, C5, E5
    [65, 69, 72], // F major: F4, A4, C5
  ]
  const chordIndex = Math.floor((current16thNote / 16) % 4)
  const chordNotes = chordProgression[chordIndex]

  if (current16thNote % 16 === 0) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!audioContext || !mainGainNode) return
    chordNotes.forEach((note, i) => {
      if (!audioContext || !mainGainNode) return
      // Layered synthwave chord: detuned sawtooth + triangle, stereo spread, slow filter sweep
      const osc1 = audioContext.createOscillator()
      const osc2 = audioContext.createOscillator()
      const osc3 = audioContext.createOscillator()

      osc1.type = 'sawtooth'
      osc2.type = 'sawtooth'
      osc3.type = 'triangle'
      osc1.frequency.setValueAtTime(midiNoteToFrequency(note), noteTime)
      osc2.frequency.setValueAtTime(midiNoteToFrequency(note) * 1.01, noteTime) // slight detune
      osc3.frequency.setValueAtTime(midiNoteToFrequency(note), noteTime)
      // Stereo panning for width
      const pan = audioContext.createStereoPanner()

      pan.pan.setValueAtTime(-0.5 + Number(i * 0.5), noteTime) // spread voices
      // Filter sweep for movement
      const filter = audioContext.createBiquadFilter()

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(700, noteTime)
      filter.frequency.linearRampToValueAtTime(1800, noteTime + 1.2) // slow sweep up
      // Envelope
      const chordGain = audioContext.createGain()

      chordGain.gain.setValueAtTime(0.08, noteTime) // quieter
      chordGain.gain.linearRampToValueAtTime(0.05, noteTime + 0.8)
      chordGain.gain.linearRampToValueAtTime(
        0.005,
        noteTime + Number(secondsPer16thNote * 16) - 0.1,
      )
      // Routing
      osc1.connect(pan)
      osc2.connect(pan)
      osc3.connect(pan)
      pan.connect(filter)
      filter.connect(chordGain)
      chordGain.connect(mainGainNode)
      osc1.start(noteTime)
      osc2.start(noteTime)
      osc3.start(noteTime)
      osc1.stop(noteTime + Number(secondsPer16thNote * 16))
      osc2.stop(noteTime + Number(secondsPer16thNote * 16))
      osc3.stop(noteTime + Number(secondsPer16thNote * 16))
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
      mainGainNode = audioContext.createGain()
      mainGainNode.gain.value = 0.3 // Master volume control
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
  // Optional: Stop any lingering sounds immediately by disconnecting gain
  // mainGainNode?.disconnect();
  // mainGainNode = null; // Or just set gain to 0 if you want to restart later
  if (mainGainNode) {
    mainGainNode.gain.setTargetAtTime(0, audioContext?.currentTime ?? 0, 0.01) // Fade out quickly
  }

  // Consider suspending context if not needed anymore to save resources
  // audioContext?.suspend();
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
