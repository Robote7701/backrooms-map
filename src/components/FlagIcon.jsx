// Drapeaux en SVG plutôt qu'en emoji (🇫🇷 🇬🇧 🇩🇪) : Windows n'embarque pas
// de police d'emoji couleur par défaut, donc les drapeaux "region indicator"
// s'affichaient comme du texte brut ("FR", "GB"...) au lieu d'une image.
// Un SVG inline rend de façon identique sur toutes les plateformes.
const FLAGS = {
  fr: (
    <svg viewBox="0 0 3 2" aria-hidden="true">
      <rect width="1" height="2" x="0" fill="#0055A4" />
      <rect width="1" height="2" x="1" fill="#FFFFFF" />
      <rect width="1" height="2" x="2" fill="#EF4135" />
    </svg>
  ),
  de: (
    <svg viewBox="0 0 3 2" aria-hidden="true">
      <rect width="3" height="0.667" y="0" fill="#000000" />
      <rect width="3" height="0.667" y="0.667" fill="#DD0000" />
      <rect width="3" height="0.667" y="1.333" fill="#FFCE00" />
    </svg>
  ),
  en: (
    <svg viewBox="0 0 60 36" aria-hidden="true">
      <rect width="60" height="36" fill="#00247d" />
      <path d="M0,0 L60,36 M60,0 L0,36" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,36 M60,0 L0,36" stroke="#cf142b" strokeWidth="2" />
      <path d="M30,0 V36 M0,18 H60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 V36 M0,18 H60" stroke="#cf142b" strokeWidth="6" />
    </svg>
  ),
}

export default function FlagIcon({ code }) {
  const flag = FLAGS[code]
  if (!flag) return null
  return <span className="flag-icon">{flag}</span>
}
