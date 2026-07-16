import { useEffect, useState } from 'react'
import { useI18n } from '../i18n/I18nContext'

const STORAGE_KEY = 'backrooms.onboarded'

// Bulle d'aide affichée uniquement à la toute première visite (persisté en
// localStorage), disparaît dès la première interaction avec la carte ou
// au clic sur le bouton de fermeture.
export default function OnboardingHint({ dismissSignal }) {
  const { t } = useI18n()
  const [visible, setVisible] = useState(() => {
    try {
      return !localStorage.getItem(STORAGE_KEY)
    } catch {
      return false
    }
  })

  useEffect(() => {
    if (dismissSignal) dismiss()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dismissSignal])

  function dismiss() {
    setVisible(false)
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* localStorage indisponible : la bulle réapparaîtra, sans gravité */
    }
  }

  if (!visible) return null

  return (
    <div className="onboarding-hint">
      <button className="onboarding-hint__close" onClick={dismiss} aria-label={t('panel.close')}>
        ×
      </button>
      <p>{t('onboarding.line1')}</p>
      <p>{t('onboarding.line2')}</p>
    </div>
  )
}
