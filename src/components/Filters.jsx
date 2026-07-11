import { useI18n } from '../i18n/I18nContext'
import { levelClasses, levelClassCounts, dangerBounds, topDangerTags, stubCount } from '../data/loadLevels'
import { classIcons } from '../data/icons'

const TOTAL_LEVELS = levelClasses.reduce((sum, cls) => sum + (levelClassCounts[cls] ?? 0), 0)

// Filtres : classe, plage de danger, présence d'entités, sûreté/sécurité,
// dangers fréquents (tags) et qualité de fiche — chacun affiche son compte
// pour rester informatif plutôt qu'une simple case à cocher opaque.
export default function Filters({ filters, onChange, shownCount, onRandom }) {
  const { t } = useI18n()

  function toggleClass(cls) {
    const hidden = new Set(filters.hiddenClasses)
    hidden.has(cls) ? hidden.delete(cls) : hidden.add(cls)
    onChange({ ...filters, hiddenClasses: hidden })
  }

  function toggleTag(tag) {
    const active = new Set(filters.activeTags)
    active.has(tag) ? active.delete(tag) : active.add(tag)
    onChange({ ...filters, activeTags: active })
  }

  function setDanger(key, value) {
    const v = Number(value)
    const next = { ...filters, [key]: v }
    // Garde min <= max.
    if (key === 'dangerMin' && v > filters.dangerMax) next.dangerMax = v
    if (key === 'dangerMax' && v < filters.dangerMin) next.dangerMin = v
    onChange(next)
  }

  function setEntityPresence(value) {
    onChange({ ...filters, entityPresence: filters.entityPresence === value ? 'all' : value })
  }

  function reset() {
    onChange({
      hiddenClasses: new Set(),
      dangerMin: dangerBounds.min,
      dangerMax: dangerBounds.max,
      entityPresence: 'all',
      safeOnly: false,
      securedOnly: false,
      hideStubs: false,
      activeTags: new Set(),
    })
  }

  return (
    <div className="panel-block">
      <h3 className="panel-block__title">{t('filters.title')}</h3>

      <div className="filter-group">
        <span className="filter-label">{t('filters.byClass')}</span>
        <div className="chip-row">
          {levelClasses.map((cls) => {
            const active = !filters.hiddenClasses.has(cls)
            return (
              <button
                key={cls}
                className={`chip chip--toggle ${active ? 'chip--active' : ''}`}
                onClick={() => toggleClass(cls)}
                aria-pressed={active}
              >
                {classIcons[cls] ?? ''} {cls}
                <span className="chip__count">{levelClassCounts[cls] ?? 0}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="filter-group">
        <span className="filter-label">{t('filters.dangerRange')}</span>
        <div className="range-row">
          <label>
            {t('filters.min')}
            <input
              type="range"
              min={dangerBounds.min}
              max={dangerBounds.max}
              value={filters.dangerMin}
              onChange={(e) => setDanger('dangerMin', e.target.value)}
            />
            <output>{filters.dangerMin}</output>
          </label>
          <label>
            {t('filters.max')}
            <input
              type="range"
              min={dangerBounds.min}
              max={dangerBounds.max}
              value={filters.dangerMax}
              onChange={(e) => setDanger('dangerMax', e.target.value)}
            />
            <output>{filters.dangerMax}</output>
          </label>
        </div>
      </div>

      <div className="filter-group">
        <span className="filter-label">{t('filters.entities')}</span>
        <div className="chip-row">
          <button
            className={`chip chip--switch ${filters.entityPresence === 'with' ? 'chip--active' : ''}`}
            onClick={() => setEntityPresence('with')}
            aria-pressed={filters.entityPresence === 'with'}
          >
            👁️ {t('filters.withEntities')}
          </button>
          <button
            className={`chip chip--switch ${filters.entityPresence === 'without' ? 'chip--active' : ''}`}
            onClick={() => setEntityPresence('without')}
            aria-pressed={filters.entityPresence === 'without'}
          >
            🚫 {t('filters.withoutEntities')}
          </button>
        </div>
      </div>

      <div className="filter-group">
        <span className="filter-label">{t('filters.survival')}</span>
        <div className="chip-row">
          <button
            className={`chip chip--switch ${filters.safeOnly ? 'chip--active' : ''}`}
            onClick={() => onChange({ ...filters, safeOnly: !filters.safeOnly })}
            aria-pressed={filters.safeOnly}
          >
            ✅ {t('panel.safe')}
          </button>
          <button
            className={`chip chip--switch ${filters.securedOnly ? 'chip--active' : ''}`}
            onClick={() => onChange({ ...filters, securedOnly: !filters.securedOnly })}
            aria-pressed={filters.securedOnly}
          >
            🔒 {t('panel.secure')}
          </button>
        </div>
      </div>

      {topDangerTags.length > 0 && (
        <div className="filter-group">
          <span className="filter-label">{t('filters.commonHazards')}</span>
          <div className="chip-row">
            {topDangerTags.map(({ tag, count }) => {
              const active = filters.activeTags.has(tag)
              return (
                <button
                  key={tag}
                  className={`chip chip--switch chip--tag ${active ? 'chip--active' : ''}`}
                  onClick={() => toggleTag(tag)}
                  aria-pressed={active}
                >
                  {tag}
                  <span className="chip__count">{count}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {stubCount > 0 && (
        <div className="filter-group">
          <button
            className={`chip chip--switch ${filters.hideStubs ? 'chip--active' : ''}`}
            onClick={() => onChange({ ...filters, hideStubs: !filters.hideStubs })}
            aria-pressed={filters.hideStubs}
          >
            📄 {t('filters.hideStubs')}
            <span className="chip__count">{stubCount}</span>
          </button>
        </div>
      )}

      <div className="filter-footer">
        <span className="muted small">
          {t('filters.showing', { count: shownCount, total: TOTAL_LEVELS })}
        </span>
        <div className="filter-footer__actions">
          <button className="link-btn" onClick={onRandom} disabled={shownCount === 0}>
            🎲 {t('filters.random')}
          </button>
          <button className="link-btn" onClick={reset}>
            {t('filters.reset')}
          </button>
        </div>
      </div>
    </div>
  )
}
