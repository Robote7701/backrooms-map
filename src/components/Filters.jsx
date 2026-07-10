import { useI18n } from '../i18n/I18nContext'
import { levelClasses, dangerBounds } from '../data/loadLevels'
import { classIcons } from '../data/icons'

// Filtres : par classe (toggle) et par plage de danger (min/max).
export default function Filters({ filters, onChange, shownCount }) {
  const { t } = useI18n()

  function toggleClass(cls) {
    const hidden = new Set(filters.hiddenClasses)
    hidden.has(cls) ? hidden.delete(cls) : hidden.add(cls)
    onChange({ ...filters, hiddenClasses: hidden })
  }

  function setDanger(key, value) {
    const v = Number(value)
    const next = { ...filters, [key]: v }
    // Garde min <= max.
    if (key === 'dangerMin' && v > filters.dangerMax) next.dangerMax = v
    if (key === 'dangerMax' && v < filters.dangerMin) next.dangerMin = v
    onChange(next)
  }

  function reset() {
    onChange({
      hiddenClasses: new Set(),
      dangerMin: dangerBounds.min,
      dangerMax: dangerBounds.max,
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

      <div className="filter-footer">
        <span className="muted small">{t('filters.showing', { count: shownCount })}</span>
        <button className="link-btn" onClick={reset}>
          {t('filters.reset')}
        </button>
      </div>
    </div>
  )
}
