// Lit un texte localisé d'un niveau depuis son champ i18n, avec repli.
// Ordre de repli : langue demandée -> anglais -> français -> clé brute.
const FALLBACK_ORDER = ['en', 'fr']

export function getLevelText(level, lang, key) {
  const i18n = level?.i18n ?? {}
  if (i18n[lang]?.[key] != null) return i18n[lang][key]
  for (const fb of FALLBACK_ORDER) {
    if (i18n[fb]?.[key] != null) return i18n[fb][key]
  }
  return key
}

// Idem pour un objet {fr, en} isolé (ex: method d'une connexion, wikiUrl).
export function pickLang(obj, lang) {
  if (obj == null) return null
  if (typeof obj === 'string') return obj
  if (obj[lang] != null) return obj[lang]
  for (const fb of FALLBACK_ORDER) {
    if (obj[fb] != null) return obj[fb]
  }
  return null
}
