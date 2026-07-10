import { useI18n } from '../i18n/I18nContext'
import { layers } from '../layers/registry'

// Boutons toggle des calques, générés depuis le registre.
export default function LayerToggles({ activeLayers, onToggle }) {
  const { t } = useI18n()
  return (
    <div className="panel-block">
      <h3 className="panel-block__title">{t('layers.title')}</h3>
      <div className="toggle-row">
        {layers.map((layer) => {
          const on = activeLayers.has(layer.id)
          return (
            <button
              key={layer.id}
              className={`toggle ${on ? 'toggle--on' : ''}`}
              onClick={() => onToggle(layer.id)}
              aria-pressed={on}
            >
              <span className="toggle__dot" />
              {t(layer.labelKey)}
            </button>
          )
        })}
      </div>
    </div>
  )
}
