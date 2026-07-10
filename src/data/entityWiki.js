// Lien externe best-effort vers la page wiki d'une entité. Le slug de l'entité
// (déjà lowercase-hyphenated) ne correspond pas toujours exactement à la page
// réelle du wiki (pluriels, alias) : certains liens peuvent mener à un 404.
const SOURCE = 'backrooms-wiki.wikidot.com'

export function entityWikiUrl(id) {
  return `https://${SOURCE}/${id}`
}
