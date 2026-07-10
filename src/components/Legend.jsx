import { useState } from 'react'
import { useI18n } from '../i18n/I18nContext'

// Légende repliable : types de routes, échelle de danger, badge entités.
export default function Legend() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)

  return (
    <div className={`legend ${open ? 'legend--open' : ''}`}>
      <button className="legend__header" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span>{t('legend.title')}</span>
        <span className="legend__chevron">{open ? '▾' : '▸'}</span>
      </button>

      {open && (
        <div className="legend__body">
          <div className="legend__section">
            <h4>{t('legend.routes')}</h4>
            <ul>
              <li>
                <span className="route-swatch route-swatch--noclip" /> {t('legend.noclip')}
              </li>
              <li>
                <span className="route-swatch route-swatch--porte" /> {t('legend.porte')}
              </li>
              <li>
                <span className="route-swatch route-swatch--escalier" /> {t('legend.escalier')}
              </li>
              <li>
                <span className="arrow-swatch">⇄</span> {t('legend.bidirectional')}
              </li>
              <li>
                <span className="arrow-swatch">→</span> {t('legend.oneway')}
              </li>
            </ul>
          </div>

          <div className="legend__section">
            <h4>{t('legend.dangerScale')}</h4>
            <div className="danger-gradient" />
            <div className="danger-gradient__labels">
              <span>{t('legend.safeLevel')} 1</span>
              <span>5 {t('legend.lethalLevel')}</span>
            </div>
            <p className="muted small">
              <span className="entity-swatch" /> {t('legend.entitiesBadge')}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
