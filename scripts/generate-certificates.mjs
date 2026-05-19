#!/usr/bin/env node
/**
 * Pipeline: read models → validate → for each, set up a deterministic jsPDF
 * doc, hand it to the active renderer, write to disk.
 *
 * Visual code lives in cert-render-v*.mjs. Scoring math lives in
 * src/lib/scoring.ts (mirrored here for the Node-side, contract v1.0.0).
 *
 * Usage:
 *   node scripts/generate-certificates.mjs              # all models
 *   node scripts/generate-certificates.mjs claude-4.6-opus  # single model
 *
 * Output: public/certificate/<model-id>.pdf
 *
 * Env:
 *   CERT_SECRET  PRNG seed for deterministic stamp position. Required for
 *                cross-deploy byte stability. Reads from process.env or .env.
 */

import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { jsPDF } from 'jspdf'
import { renderCertificateV1 } from './cert-render-v1.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

// ── .env loader (no external dependency) ────────────────────────────────────

function loadEnv() {
  const result = {}
  const envPath = resolve(ROOT, '.env')
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
      const t = line.trim()
      if (!t || t.startsWith('#')) continue
      const eq = t.indexOf('=')
      if (eq === -1) continue
      result[t.slice(0, eq).trim()] = t.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
    }
  }
  if (process.env.CERT_SECRET) result.CERT_SECRET = process.env.CERT_SECRET
  return result
}

const ENV = loadEnv()

// ── Seeded PRNG (FNV-1a → mulberry32) — used here ONLY for file id ─────────
// The renderer has its own copy for the stamp position, using a different
// seed namespace (`secret + model.id`) so the two PRNGs never collide.

function fnv1aSeed(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619)
  }
  return h >>> 0
}

function makePrng(seed) {
  let s = seed
  return () => {
    s += 0x6D2B79F5
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Derive a stable 32-char hex PDF file ID. Without this jsPDF picks a random
 * one per invocation, breaking byte-determinism even when everything visible
 * is fixed. Uses a `:fileid:` namespace so the seed never collides with the
 * stamp-position PRNG inside the renderer.
 */
function deriveFileId(secret, modelId) {
  const rng = makePrng(fnv1aSeed(secret + ':fileid:' + modelId))
  let hex = ''
  for (let i = 0; i < 32; i++) hex += Math.floor(rng() * 16).toString(16)
  return hex
}

// ── Scoring contract (mirrored in src/lib/scoring.ts, v1.1.0) ───────────────
//   calcAgg:   mean of defined { hr, harm, hist, auth } values, rounded.
//              Tolerates any subset being undefined so the script can run
//              against data where one dimension hasn't been measured yet.
//   calcGrade: A >= 80, B >= 65, C >= 50, else D

function calcAgg(scores) {
  const values = [scores.hr, scores.harm, scores.auth, scores.hist]
    .filter((v) => typeof v === 'number' && Number.isFinite(v))
  if (values.length === 0) return 0
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length)
}

function calcGrade(n) {
  if (n >= 80) return 'A'
  if (n >= 65) return 'B'
  if (n >= 50) return 'C'
  return 'D'
}

// ── Data load + validation ──────────────────────────────────────────────────

const models = JSON.parse(readFileSync(resolve(ROOT, 'src/data/models.json'), 'utf-8'))

// Fails the build if any model is missing top-level fields the renderer reads.
// Scores are validated as numbers in [0, 100] WHEN PRESENT — but any subset
// (including the empty set) is allowed. Today the deployed data has no `hist`
// on any model; the renderer + leaderboard both render an em-dash for
// missing dimensions, and calcAgg averages whichever are present.
const REQUIRED_TOP = ['id', 'name', 'company']
const OPTIONAL_SCORES = ['hr', 'harm', 'hist', 'auth']
const dataErrors = []
for (const m of models) {
  for (const k of REQUIRED_TOP) {
    if (typeof m?.[k] !== 'string' || !m[k]) {
      dataErrors.push(`${m?.id ?? '(no id)'}: missing or empty ${k}`)
    }
  }
  for (const k of OPTIONAL_SCORES) {
    const v = m?.scores?.[k]
    if (v === undefined) continue   // explicitly OK
    if (typeof v !== 'number' || !Number.isFinite(v)) {
      dataErrors.push(`${m?.id ?? '(no id)'}: scores.${k} is ${v} (expected finite number or absent)`)
    } else if (v < 0 || v > 100) {
      dataErrors.push(`${m?.id ?? '(no id)'}: scores.${k} = ${v} is out of [0, 100]`)
    }
  }
}
if (dataErrors.length > 0) {
  console.error('✗ src/data/models.json validation failed:')
  for (const err of dataErrors) console.error('  - ' + err)
  process.exit(1)
}

// ── Stamp asset (preloaded once, shared across all models) ──────────────────

const stampPath = resolve(ROOT, 'public/images/stamp.png')
const stampBase64 = 'data:image/png;base64,' + readFileSync(stampPath).toString('base64')

// ── Single-cert generation ──────────────────────────────────────────────────

function generateCertificate(model, env = {}) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

  // Pin both sources of jsPDF default non-determinism so output is byte-stable
  // across runs, machines, and clocks:
  //   /ID          — random per-invocation by default
  //   /CreationDate — wall-clock to the second by default
  doc.setFileId(deriveFileId(env.CERT_SECRET || '', model.id))
  doc.setCreationDate(new Date('2026-01-01T00:00:00Z'))

  const agg = calcAgg(model.scores)
  const grade = calcGrade(agg)

  renderCertificateV1(doc, model, { agg, grade }, env, stampBase64)

  return doc
}

// ── Main ────────────────────────────────────────────────────────────────────

const targetId = process.argv[2]
const outDir = resolve(ROOT, 'public/certificate')
mkdirSync(outDir, { recursive: true })

const targets = targetId
  ? models.filter(m => m.id === targetId)
  : models

if (targets.length === 0) {
  console.error(`No model found with id "${targetId}"`)
  process.exit(1)
}

for (const model of targets) {
  const doc = generateCertificate(model, ENV)
  const outPath = resolve(outDir, `${model.id}.pdf`)
  const buffer = Buffer.from(doc.output('arraybuffer'))
  writeFileSync(outPath, buffer)
  console.log(`✓ ${model.name} → ${outPath}`)
}

console.log(`\nDone — ${targets.length} certificate(s) generated.`)
