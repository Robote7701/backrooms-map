import { useI18n } from '../i18n/I18nContext'
import { getLevelText } from '../i18n/getLevelText'
import { levelsById } from '../data/loadLevels'
import { entityIndex } from '../data/entityIndex'
import { entityWikiUrl } from '../data/entityWiki'
import { presenceIcons } from '../data/icons'

// Glossaire interne des entités : plus fiable que les liens externes vers
// le wiki (slugs best-effort, voir entityWiki.js), puisqu'il ne dépend que
// de nos propres données. Complémentaire, pas un remplacement.
export default function EntityGlossary({ onClose }) {
  const { lang, t } = useI18n()

  return (
    <div className="legal-page">
      <div className="legal-page__inner">
        <button className="legal-page__close" onClick={onClose}>
          ← {t('legal.back')}
        </button>

        <h1>{t('glossary.title')}</h1>
        <p className="glossary__intro">{t('glossary.intro')}</p>

        <ul className="glossary-list">
          {entityIndex.map((entity) => (
            <li key={entity.id} className="glossary-entry">
              <div className="glossary-entry__header">
                <a
                  className="glossary-entry__name"
                  href={entityWikiUrl(entity.id)}
                  target="_blank"
                  rel="noreferrer noopener"
                  title={t('panel.entityLinkHint')}
                >
                  {entity.id}
                </a>
                <span className="muted small">
                  {t('glossary.appearances', { count: entity.appearances.length })}
                </span>
              </div>
              <div className="glossary-entry__levels">
                {entity.appearances.map(({ levelId, presence }) => {
                  const lvl = levelsById[levelId]
                  if (!lvl) return null
                  return (
                    <a key={levelId} className="glossary-chip" href={`#level/${levelId}`}>
                      {presenceIcons[presence] ?? '❔'} {getLevelText(lvl, lang, 'name')}
                    </a>
                  )
                })}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
