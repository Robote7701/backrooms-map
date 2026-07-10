#!/usr/bin/env node
// Valide les fichiers de niveaux : schéma minimal + intégrité du graphe
// (chaque connections.to doit pointer vers un niveau existant).
// Usage: node scripts/validate-levels.mjs   (npm run validate)

import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const LEVELS_DIR = join(__dirname, '..', 'src', 'data', 'levels')

const KNOWN_TYPES = ['noclip', 'porte', 'escalier', 'autre']
const KNOWN_DIRECTIONS = ['bidirectional', 'one-way']

const errors = []
const warnings = []

function fail(file, msg) {
  errors.push(`✗ ${file}: ${msg}`)
}
function warn(file, msg) {
  warnings.push(`! ${file}: ${msg}`)
}

// --- Chargement ---
let files
try {
  files = readdirSync(LEVELS_DIR).filter((f) => f.endsWith('.json'))
} catch (e) {
  console.error(`Impossible de lire ${LEVELS_DIR}: ${e.message}`)
  process.exit(1)
}

if (files.length === 0) {
  console.error(`Aucun niveau trouvé dans ${LEVELS_DIR}`)
  process.exit(1)
}

const levels = []
const ids = new Set()

for (const file of files) {
  let data
  try {
    data = JSON.parse(readFileSync(join(LEVELS_DIR, file), 'utf8'))
  } catch (e) {
    fail(file, `JSON invalide — ${e.message}`)
    continue
  }
  levels.push({ file, data })

  // Champs requis a minima.
  if (!data.id) fail(file, 'champ "id" manquant')
  if (!data.class) fail(file, 'champ "class" manquant')
  if (!data.danger || typeof data.danger.level !== 'number')
    fail(file, 'champ "danger.level" manquant ou invalide')
  if (!data.i18n?.fr && !data.i18n?.en)
    fail(file, 'i18n manquant (au moins fr ou en requis)')

  if (data.id) {
    if (ids.has(data.id)) fail(file, `id dupliqué "${data.id}"`)
    ids.add(data.id)
  }
}

// --- Intégrité des connexions ---
let edgeCount = 0
for (const { file, data } of levels) {
  for (const conn of data.connections ?? []) {
    edgeCount++
    if (!conn.to) {
      fail(file, 'connexion sans "to"')
      continue
    }
    if (!ids.has(conn.to))
      fail(file, `connexion "to": "${conn.to}" ne pointe vers aucun niveau existant`)
    if (conn.type && !KNOWN_TYPES.includes(conn.type))
      warn(file, `type de route inconnu "${conn.type}" (attendu: ${KNOWN_TYPES.join(', ')})`)
    if (conn.direction && !KNOWN_DIRECTIONS.includes(conn.direction))
      warn(file, `direction inconnue "${conn.direction}"`)
    if (conn.to === data.id) warn(file, 'connexion vers soi-même')
  }
}

// --- Rapport ---
for (const w of warnings) console.warn(w)
for (const e of errors) console.error(e)

console.log(
  `\n${levels.length} niveaux, ${edgeCount} connexions — ` +
    `${errors.length} erreur(s), ${warnings.length} avertissement(s).`,
)

process.exit(errors.length > 0 ? 1 : 0)
