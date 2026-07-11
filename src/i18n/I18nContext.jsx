import { createContext, useContext, useMemo, useState, useCallback } from 'react'
import fr from './locales/fr.json'
import en from './locales/en.json'
import de from './locales/de.json'

// Registre des langues UI. Ajouter une langue :
//   1. créer locales/xx.json  2. l'importer  3. l'ajouter ici.
const DICTIONARIES = { fr, en, de }
export const AVAILABLE_LANGS = Object.keys(DICTIONARIES)
const DEFAULT_LANG = 'fr'
const STORAGE_KEY = 'backrooms.lang'

const I18nContext = createContext(null)

// Résout "a.b.c" dans un objet imbriqué.
function resolve(dict, path) {
  return path.split('.').reduce((acc, k) => (acc == null ? acc : acc[k]), dict)
}

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const saved = typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY)
    return saved && DICTIONARIES[saved] ? saved : DEFAULT_LANG
  })

  const setLang = useCallback((next) => {
    if (!DICTIONARIES[next]) return
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
      document.documentElement.lang = next
    } catch {
      /* localStorage indisponible : on ignore */
    }
  }, [])

  const t = useCallback(
    (key, vars) => {
      let val = resolve(DICTIONARIES[lang], key) ?? resolve(DICTIONARIES[DEFAULT_LANG], key) ?? key
      if (typeof val === 'string' && vars) {
        for (const [k, v] of Object.entries(vars)) {
          val = val.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v))
        }
      }
      return val
    },
    [lang],
  )

  const value = useMemo(() => ({ lang, setLang, t, langs: AVAILABLE_LANGS }), [lang, setLang, t])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n doit être utilisé dans <I18nProvider>')
  return ctx
}
