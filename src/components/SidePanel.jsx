import { useState } from 'react'
import { useI18n } from '../i18n/I18nContext'
import { getLevelText, pickLang } from '../i18n/getLevelText'
import { levelsById } from '../data/loadLevels'

// Panneau latéral : détails du niveau sélectionné.
export default function SidePanel({ level, onSelect, onClose }) {
  const { lang, t } = useI18n()

  if (!level) {
    return (
      <aside className="side-panel side-panel--empty">
        <p className="muted">{t('panel.empty')}</p>
      </aside>
    )
  }

  const name = getLevelText(level, lang, 'name')
  const wiki = pickLang(level.wikiUrl, lang)
  const banner = level.media?.banner

  return (
    <aside className="side-panel" key={level.id}>
      <button className="side-panel__close" onClick={onClose} aria-label={t('panel.close')}>
        ×
      </button>

      {banner && <Banner src={banner} alt={name} />}

      <h2 className="side-panel__title">{name}</h2>

      <div className="badges">
        <span className={`badge badge--class badge--${level.class}`}>
          {t('panel.class')}: {level.class}
        </span>
        <DangerBadge danger={level.danger} label={t('panel.danger')} />
      </div>

      <p className="side-panel__desc">{getLevelText(level, lang, 'shortDescription')}</p>

      <Section title={t('panel.atmosphere')}>
        <p>{getLevelText(level, lang, 'atmosphere')}</p>
      </Section>

      <Section title={t('panel.tips')}>
        <p className="tips">{getLevelText(level, lang, 'tips')}</p>
      </Section>

      <Section title={t('panel.survival')}>
        <ul className="survival">
          <li className={level.survival?.safe ? 'ok' : 'ko'}>
            {level.survival?.safe ? t('panel.safe') : t('panel.unsafe')}
          </li>
          <li className={level.survival?.secure ? 'ok' : 'ko'}>
            {level.survival?.secure ? t('panel.secure') : t('panel.unsecure')}
          </li>
        </ul>
      </Section>

      <Section title={`${t('panel.entities')} (${level.entities?.length ?? 0})`}>
        {level.entities?.length ? (
          <ul className="entities">
            {level.entities.map((e) => (
              <li key={e.id}>
                <span className="entity-name">{e.id}</span>
                <span className="muted"> — {e.presence} {t('panel.presence')}</span>
                {e.zones?.length > 0 && (
                  <div className="muted small">{e.zones.join(', ')}</div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">{t('panel.noEntities')}</p>
        )}
      </Section>

      <Section title={`${t('panel.connections')} (${level.connections?.length ?? 0})`}>
        {level.connections?.length ? (
          <ul className="connections">
            {level.connections.map((c) => {
              const target = levelsById[c.to]
              const targetName = target ? getLevelText(target, lang, 'name') : c.to
              return (
                <li key={`${c.to}-${c.type}`}>
                  <button
                    className="link-btn"
                    onClick={() => target && onSelect(c.to)}
                    disabled={!target}
                    title={target ? '' : `${c.to} (introuvable)`}
                  >
                    {targetName}
                  </button>
                  <span className={`chip chip--${c.type}`}>{t(`connType.${c.type}`)}</span>
                  <span className="chip chip--dir">{t(`direction.${c.direction}`)}</span>
                  <div className="muted small">{pickLang(c.method, lang)}</div>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="muted">{t('panel.noConnections')}</p>
        )}
      </Section>

      {wiki && (
        <a className="wiki-link" href={wiki} target="_blank" rel="noreferrer noopener">
          {t('panel.wiki')} ↗
        </a>
      )}
    </aside>
  )
}

function Section({ title, children }) {
  return (
    <section className="side-panel__section">
      <h3>{title}</h3>
      {children}
    </section>
  )
}

function DangerBadge({ danger, label }) {
  const pct = (danger.level - 1) / (danger.scale - 1)
  // vert -> rouge selon le niveau
  const hue = Math.round((1 - pct) * 120)
  return (
    <span className="badge" style={{ borderColor: `hsl(${hue} 70% 55%)`, color: `hsl(${hue} 70% 70%)` }}>
      {label}: {danger.level}/{danger.scale}
    </span>
  )
}

// Image de bannière avec repli silencieux si le fichier n'existe pas.
function Banner({ src, alt }) {
  const [ok, setOk] = useState(true)
  if (!ok) return null
  return <img className="side-panel__banner" src={src} alt={alt} onError={() => setOk(false)} />
}
