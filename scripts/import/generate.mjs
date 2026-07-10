#!/usr/bin/env node
// Génère src/data/levels/level-N.json à partir de scripts/import/raw-levels.json.
// Idempotent : régénérer après avoir ajouté des niveaux réconcilie les connexions.
// N'écrase QUE les niveaux numériques présents dans raw-levels.json.
// Les niveaux "ancres" faits main (level-0 + niveaux spéciaux non numériques)
// ne sont jamais touchés, mais restent des cibles de connexion valides.

import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', '..')
const LEVELS_DIR = join(ROOT, 'src', 'data', 'levels')
const RAW = join(__dirname, 'raw-levels.json')
const ADDED_ON = '2026-07-10'
const SOURCE = 'backrooms-wiki.wikidot.com'

// survivalClass (0-5) -> classe interne + niveau de danger (1-5).
const CLASS_MAP = {
  0: { class: 'sur', danger: 1 },
  1: { class: 'habitable', danger: 2 },
  2: { class: 'instable', danger: 3 },
  3: { class: 'dangereux', danger: 4 },
  4: { class: 'dangereux', danger: 5 },
  5: { class: 'mortel', danger: 5 },
}
// Repli quand la classe de survie est inconnue sur le wiki.
const CLASS_FALLBACK = { class: 'instable', danger: 3 }

function entityCountLabel(n) {
  if (n === 0) return 'aucune'
  if (n <= 2) return 'faible'
  if (n <= 4) return 'moyen'
  return 'eleve'
}

function mapLevel(raw, validTargets) {
  const cm = raw.survivalClass == null ? CLASS_FALLBACK : CLASS_MAP[raw.survivalClass] ?? CLASS_FALLBACK
  const tags = [...(raw.tags ?? [])]
  if (raw.survivalClass == null) tags.push('difficulte-estimee')

  // Connexions : cibles numériques existantes, dédupliquées, sans self.
  const seen = new Set()
  const connections = []
  for (const to of raw.connectionsTo ?? []) {
    if (!Number.isInteger(to)) continue // ignore sous-niveaux type 6.1
    if (to === raw.number) continue
    const targetId = `level-${to}`
    if (!validTargets.has(targetId)) continue
    if (seen.has(targetId)) continue
    seen.add(targetId)
    connections.push({
      to: targetId,
      type: 'noclip',
      direction: 'bidirectional',
      method: {
        en: 'Listed among this level\'s entrances/exits on the source wiki.',
        fr: 'Figure parmi les entrées/sorties de ce niveau sur le wiki source.',
      },
      reliability: 'inconnue',
    })
  }

  const entities = (raw.entities ?? []).map((e) => ({
    id: e.id,
    presence: e.presence ?? 'unknown',
    zones: [],
  }))

  return {
    id: `level-${raw.number}`,
    slug: `level-${raw.number}`,
    class: cm.class,
    danger: { level: cm.danger, scale: 5, tags },
    survival: {
      safe: !!raw.safe,
      secure: !!raw.secure,
      entityCount: entityCountLabel(entities.length),
    },
    entities,
    connections,
    i18n: {
      // EN d'abord ; i18n.fr retombe sur l'anglais via le repli applicatif.
      en: {
        name: `Level ${raw.number} — ${raw.title}`,
        shortDescription: raw.shortDescription ?? '',
        atmosphere: raw.atmosphere ?? '',
        tips: raw.tips ?? '',
      },
    },
    media: {
      thumbnail: `/images/levels/level-${raw.number}-thumb.webp`,
      banner: `/images/levels/level-${raw.number}-banner.webp`,
    },
    wikiUrl: {
      en: `https://${SOURCE}/level-${raw.number}`,
      fr: `https://${SOURCE}/level-${raw.number}`,
    },
    layers: { danger: true, entities: true, resources: false },
    meta: {
      addedOn: ADDED_ON,
      status: raw.noData ? 'stub' : 'published',
      source: SOURCE,
    },
  }
}

// --- Exécution ---
const { levels: rawLevels } = JSON.parse(readFileSync(RAW, 'utf8'))

// Cibles valides = niveaux du raw + fichiers level-N.json déjà présents (ex: level-0).
const existingNumeric = readdirSync(LEVELS_DIR)
  .map((f) => /^level-(\d+)\.json$/.exec(f))
  .filter(Boolean)
  .map((m) => `level-${m[1]}`)
const validTargets = new Set([
  ...existingNumeric,
  ...rawLevels.map((r) => `level-${r.number}`),
])

let written = 0
for (const raw of rawLevels) {
  const out = mapLevel(raw, validTargets)
  const file = join(LEVELS_DIR, `${out.id}.json`)
  writeFileSync(file, JSON.stringify(out, null, 2) + '\n', 'utf8')
  written++
}

console.log(`Généré ${written} niveaux depuis le wiki. Cibles valides: ${validTargets.size}.`)
