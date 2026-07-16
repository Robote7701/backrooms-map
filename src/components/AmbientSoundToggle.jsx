import { useEffect, useState } from 'react'
import { useI18n } from '../i18n/I18nContext'
import { startAmbientHum, stopAmbientHum, isAmbientSupported } from '../audio/ambientHum'

// Bouton d'ambiance sonore, opt-in. Ne joue jamais rien sans clic explicite
// et se coupe silencieusement si le composant démonte (changement de page).
export default function AmbientSoundToggle() {
  const { t } = useI18n()
  const [on, setOn] = useState(false)

  useEffect(() => () => stopAmbientHum(), [])

  if (!isAmbientSupported()) return null

  async function toggle() {
    if (on) {
      stopAmbientHum()
      setOn(false)
    } else {
      await startAmbientHum()
      setOn(true)
    }
  }

  return (
    <button
      className={`sound-toggle ${on ? 'is-active' : ''}`}
      onClick={toggle}
      aria-pressed={on}
      title={t(on ? 'sound.off' : 'sound.on')}
      aria-label={t(on ? 'sound.off' : 'sound.on')}
    >
      {on ? '🔊' : '🔈'}
    </button>
  )
}
