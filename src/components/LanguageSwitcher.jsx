import { useI18n } from '../i18n/I18nContext'

// Sélecteur de langue. S'appuie sur AVAILABLE_LANGS -> extensible.
export default function LanguageSwitcher() {
  const { lang, setLang, langs, t } = useI18n()
  return (
    <div className="lang-switcher" role="group" aria-label={t('language.label')}>
      {langs.map((code) => (
        <button
          key={code}
          className={`lang-btn ${code === lang ? 'active' : ''}`}
          onClick={() => setLang(code)}
          aria-pressed={code === lang}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
