#!/usr/bin/env node
// Génère src/data/levels/level-N.json à partir des lots de scripts/import/raw/*.json.
// Chaque fichier de raw/ est un tableau JSON d'enregistrements de niveaux (format enrichi).
// Idempotent : régénérer après avoir ajouté un lot réconcilie les connexions.
// N'écrase QUE les niveaux numériques présents dans raw/. Les ancres faites main
// (level-0 + niveaux spéciaux non numériques) ne sont jamais touchées mais restent
// des cibles de connexion valides.

import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', '..')
const LEVELS_DIR = join(ROOT, 'src', 'data', 'levels')
const RAW_DIR = join(__dirname, 'raw')
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
const CLASS_FALLBACK = { class: 'instable', danger: 3 }

// Type de route du wiki (anglais) -> type interne (voir cytoscapeStyle/Legend).
const TYPE_MAP = {
  door: 'porte',
  stairs: 'escalier',
  stair: 'escalier',
  staircase: 'escalier',
  noclip: 'noclip',
  'no-clip': 'noclip',
  other: 'autre',
}
const DIRECTION_MAP = { 'one-way': 'one-way', oneway: 'one-way', 'two-way': 'bidirectional' }

function entityCountLabel(n) {
  if (n === 0) return 'aucune'
  if (n <= 2) return 'faible'
  if (n <= 4) return 'moyen'
  return 'eleve'
}

// Supporte l'ancien format (connectionsTo:[int]) ET le nouveau (connections:[{to,type,direction}]).
function rawConnections(raw) {
  if (Array.isArray(raw.connections)) return raw.connections
  if (Array.isArray(raw.connectionsTo))
    return raw.connectionsTo.map((to) => ({ to, type: 'noclip', direction: 'two-way' }))
  return []
}

function mapLevel(raw, validTargets) {
  const cm = raw.survivalClass == null ? CLASS_FALLBACK : CLASS_MAP[raw.survivalClass] ?? CLASS_FALLBACK
  const tags = [...(raw.tags ?? [])]
  if (raw.survivalClass == null) tags.push('difficulte-estimee')

  const seen = new Set()
  const connections = []
  for (const c of rawConnections(raw)) {
    const to = typeof c.to === 'number' ? c.to : Number(c.to)
    if (!Number.isInteger(to) || to === raw.number) continue
    const targetId = `level-${to}`
    if (!validTargets.has(targetId) || seen.has(targetId)) continue
    seen.add(targetId)
    const type = TYPE_MAP[(c.type ?? '').toLowerCase()] ?? 'noclip'
    const direction = DIRECTION_MAP[(c.direction ?? '').toLowerCase()] ?? 'bidirectional'
    connections.push({
      to: targetId,
      type,
      direction,
      method: {
        en: 'From this level\'s entrances/exits on the source wiki.',
        fr: 'D\'après les entrées/sorties de ce niveau sur le wiki source.',
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
    meta: { addedOn: ADDED_ON, status: raw.noData ? 'stub' : 'published', source: SOURCE },
  }
}

// --- Chargement des lots raw/ ---
let rawFiles = []
try {
  rawFiles = readdirSync(RAW_DIR).filter((f) => f.endsWith('.json'))
} catch {
  console.error(`Dossier introuvable: ${RAW_DIR}`)
  process.exit(1)
}

// Fusion par numéro (le dernier lot chargé gagne).
const byNumber = new Map()
for (const f of rawFiles.sort()) {
  const arr = JSON.parse(readFileSync(join(RAW_DIR, f), 'utf8'))
  const records = Array.isArray(arr) ? arr : arr.levels ?? []
  for (const r of records) byNumber.set(r.number, r)
}
const rawLevels = [...byNumber.values()]

// Cibles valides = niveaux du raw + fichiers level-N.json déjà présents (ex: level-0).
const existingNumeric = readdirSync(LEVELS_DIR)
  .map((f) => /^level-(\d+)\.json$/.exec(f))
  .filter(Boolean)
  .map((m) => `level-${m[1]}`)
const validTargets = new Set([...existingNumeric, ...rawLevels.map((r) => `level-${r.number}`)])

let written = 0
for (const raw of rawLevels) {
  const out = mapLevel(raw, validTargets)
  writeFileSync(join(LEVELS_DIR, `${out.id}.json`), JSON.stringify(out, null, 2) + '\n', 'utf8')
  written++
}

console.log(`Généré ${written} niveaux depuis ${rawFiles.length} lot(s). Cibles valides: ${validTargets.size}.`)
