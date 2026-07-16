// Bourdonnement d'ambiance façon néon fatigué : deux sinusoïdes graves
// légèrement désaccordées (battement lent) + un souffle de bruit filtré très
// discret. Généré entièrement via Web Audio, aucun fichier audio à héberger.
// Opt-in uniquement : ne démarre jamais sans un clic (règle des navigateurs
// sur l'audio automatique, et cohérent avec le zéro-tracking du site — rien
// n'est joué ni persisté sans action explicite).
let ctx = null
let nodes = null

function buildNoiseBuffer(audioCtx) {
  const size = audioCtx.sampleRate * 2
  const buffer = audioCtx.createBuffer(1, size, audioCtx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1
  return buffer
}

export function isAmbientSupported() {
  return typeof window !== 'undefined' && !!(window.AudioContext || window.webkitAudioContext)
}

export async function startAmbientHum() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext
  if (!ctx) ctx = new AudioCtx()
  if (ctx.state === 'suspended') await ctx.resume()
  if (nodes) return

  const master = ctx.createGain()
  master.gain.value = 0
  master.connect(ctx.destination)

  const osc1 = ctx.createOscillator()
  osc1.type = 'sine'
  osc1.frequency.value = 55
  const osc2 = ctx.createOscillator()
  osc2.type = 'sine'
  osc2.frequency.value = 55.8
  const oscGain = ctx.createGain()
  oscGain.gain.value = 0.5
  osc1.connect(oscGain)
  osc2.connect(oscGain)

  const noise = ctx.createBufferSource()
  noise.buffer = buildNoiseBuffer(ctx)
  noise.loop = true
  const noiseFilter = ctx.createBiquadFilter()
  noiseFilter.type = 'lowpass'
  noiseFilter.frequency.value = 400
  const noiseGain = ctx.createGain()
  noiseGain.gain.value = 0.06
  noise.connect(noiseFilter).connect(noiseGain)

  oscGain.connect(master)
  noiseGain.connect(master)

  osc1.start()
  osc2.start()
  noise.start()
  nodes = { master, osc1, osc2, noise }

  const now = ctx.currentTime
  master.gain.setValueAtTime(0, now)
  master.gain.linearRampToValueAtTime(0.05, now + 1.5)
}

export function stopAmbientHum() {
  if (!nodes || !ctx) return
  const now = ctx.currentTime
  nodes.master.gain.cancelScheduledValues(now)
  nodes.master.gain.setValueAtTime(nodes.master.gain.value, now)
  nodes.master.gain.linearRampToValueAtTime(0, now + 0.8)
  const toStop = nodes
  nodes = null
  setTimeout(() => {
    toStop.osc1.stop()
    toStop.osc2.stop()
    toStop.noise.stop()
  }, 900)
}
