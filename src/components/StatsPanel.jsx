import { useI18n } from '../i18n/I18nContext'
import { levels, dangerDistribution, totalRoutes, stubCount } from '../data/loadLevels'
import { entityIndex } from '../data/entityIndex'

// Petit tableau de bord basé sur les données déjà chargées : aucun calcul
// serveur, juste un moyen ludique de survoler l'ensemble du corpus.
export default function StatsPanel() {
  const { t } = useI18n()
  const maxCount = Math.max(...dangerDistribution.map((d) => d.count), 1)
  const topEntity = entityIndex[0]

  return (
    <div className="panel-block">
      <h3 className="panel-block__title">{t('stats.title')}</h3>

      <div className="stats-grid">
        <div className="stats-tile">
          <span className="stats-tile__value">{levels.length}</span>
          <span className="stats-tile__label">{t('stats.levels')}</span>
        </div>
        <div className="stats-tile">
          <span className="stats-tile__value">{totalRoutes}</span>
          <span className="stats-tile__label">{t('stats.routes')}</span>
        </div>
        <div className="stats-tile">
          <span className="stats-tile__value">{entityIndex.length}</span>
          <span className="stats-tile__label">{t('stats.entities')}</span>
        </div>
        <div className="stats-tile">
          <span className="stats-tile__value">{stubCount}</span>
          <span className="stats-tile__label">{t('stats.stubs')}</span>
        </div>
      </div>

      <div className="stats-hist">
        <span className="filter-label">{t('stats.dangerHist')}</span>
        {dangerDistribution.map(({ level, count }) => (
          <div className="stats-hist__row" key={level}>
            <span className="stats-hist__level">{level}</span>
            <div className="stats-hist__bar-track">
              <div
                className="stats-hist__bar"
                style={{ width: `${(count / maxCount) * 100}%` }}
              />
            </div>
            <span className="stats-hist__count">{count}</span>
          </div>
        ))}
      </div>

      {topEntity && (
        <p className="muted small stats-top-entity">
          {t('stats.topEntity', { name: topEntity.id, count: topEntity.appearances.length })}
        </p>
      )}
    </div>
  )
}
