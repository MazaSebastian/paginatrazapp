/**
 * Motor de Audio Sintetizado "Apple-Grade" para TrazAPP / Growy
 * Genera un acorde de bienvenida etéreo, cálido y tecnológico
 * utilizando la Web Audio API nativa sin dependencias externas.
 */

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    audioCtx = new AudioContextClass()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

export function playAppleBootChime(volume = 0.28) {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    // Acorde majestuoso estilo bienvenida tecnológica (F#maj9 / D#m7 cálido)
    // F#2, C#3, F#3, A#3, C#4, F#4, G#4
    const frequencies = [92.5, 138.59, 185.0, 233.08, 277.18, 369.99, 415.3]

    // Master bus con saturador suave y compresor
    const masterGain = ctx.createGain()
    masterGain.gain.setValueAtTime(volume, now)

    // Filtro pasabajos con barrido dinámico para sonido aterciopelado
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(450, now)
    filter.frequency.exponentialRampToValueAtTime(2200, now + 0.12)
    filter.frequency.exponentialRampToValueAtTime(550, now + 3.8)
    filter.Q.setValueAtTime(1.2, now)

    // Conexión a destino
    masterGain.connect(filter)
    filter.connect(ctx.destination)

    // Crear cada armónico con osciladores combinados
    frequencies.forEach((freq, index) => {
      const osc = ctx.createOscillator()
      const oscGain = ctx.createGain()

      // Los graves usan sine puro, los medios/agudos una pizca de triangle para brillo de cristal
      osc.type = index < 2 ? 'sine' : (index % 2 === 0 ? 'sine' : 'triangle')
      osc.frequency.setValueAtTime(freq, now)

      // Micro-desafinación analógica para efecto estéreo y dimensión viva
      const detune = (index - frequencies.length / 2) * 2.5
      osc.detune.setValueAtTime(detune, now)

      // Panning estéreo según altura tonal
      const panNode = ctx.createStereoPanner ? ctx.createStereoPanner() : null
      if (panNode) {
        const panVal = ((index / (frequencies.length - 1)) - 0.5) * 0.7
        panNode.pan.setValueAtTime(panVal, now)
      }

      // Envolvente acústica: Ataque suave (25ms), sustain y decay largo (3.8s)
      const relativeVolume = index === 0 ? 0.35 : (index === 1 ? 0.28 : 0.18 / Math.sqrt(index))
      oscGain.gain.setValueAtTime(0.0001, now)
      oscGain.gain.linearRampToValueAtTime(relativeVolume, now + 0.04)
      oscGain.gain.exponentialRampToValueAtTime(0.00001, now + 3.8)

      if (panNode) {
        osc.connect(oscGain)
        oscGain.connect(panNode)
        panNode.connect(masterGain)
      } else {
        osc.connect(oscGain)
        oscGain.connect(masterGain)
      }

      osc.start(now)
      osc.stop(now + 4.0)
    })

    // Sub-bass warmth pulse inicial (tipo "heartbeat / wake up" imperceptible pero táctil)
    const subOsc = ctx.createOscillator()
    const subGain = ctx.createGain()
    subOsc.type = 'sine'
    subOsc.frequency.setValueAtTime(65.4, now) // C2
    subGain.gain.setValueAtTime(0.001, now)
    subGain.gain.linearRampToValueAtTime(0.2, now + 0.02)
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2)
    subOsc.connect(subGain)
    subGain.connect(filter)
    subOsc.start(now)
    subOsc.stop(now + 1.3)

  } catch (err) {
    console.warn('Audio boot chime error:', err)
  }
}

/**
 * Micro-sonido sutil de "hover / click táctil" estilo háptico
 */
export function playHapticTap() {
  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(420, now)
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.04)

    gain.gain.setValueAtTime(0.08, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.05)
  } catch (err) {
    // Silencioso si no hay interacción de audio aún
  }
}
