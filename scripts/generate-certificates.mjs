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
<<<<<<< Updated upstream
  const values = [scores.hr, scores.harm, scores.auth, scores.hist]
    .filter((v) => typeof v === 'number' && Number.isFinite(v))
=======
  const values = [scores.hr, scores.harm, scores.hist, scores.auth].filter(v => v !== undefined)
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
  renderCertificateV1(doc, model, { agg, grade }, env, stampBase64)
=======
  // ── Helper: set color from [r,g,b] array ──────────────────────────────
  const setFill = (c) => doc.setFillColor(c[0], c[1], c[2])
  const setDraw = (c) => doc.setDrawColor(c[0], c[1], c[2])
  const setText = (c) => doc.setTextColor(c[0], c[1], c[2])

  // ── Background ────────────────────────────────────────────────────────
  setFill(BRAND.white)
  doc.rect(0, 0, W, H, 'F')

  // ── Decorative outer border (double line) ─────────────────────────────
  setDraw(BRAND.primary)
  doc.setLineWidth(0.8)
  doc.rect(8, 6, W - 16, H - 12)
  doc.setLineWidth(0.3)
  doc.rect(10.5, 8.5, W - 21, H - 17)

  // ── Top accent stripe ─────────────────────────────────────────────────
  setFill(BRAND.primary)
  doc.rect(10.5, 8.5, W - 21, 2.2, 'F')

  // ── Header: Organisation name ─────────────────────────────────────────
  const headerY = 20

  // "EuroSafeAI" left-aligned
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  setText(BRAND.primary)
  doc.text('EuroSafeAI', 20, headerY)

  // Tagline
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  setText(BRAND.midGray)
  doc.text('Developing Multi-Agent AI Safety for Democracy  ·  Zurich, Switzerland', 20, headerY + 4.5)

  // Right header: evaluation date
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  setText(BRAND.midGray)
  doc.text('Evaluation Period: Q1 2026', W - 20, headerY, { align: 'right' })
  doc.text('eurosafe.ai.toronto.edu/certificate/' + model.id, W - 20, headerY + 4.5, { align: 'right' })

  // ── Thin separator ────────────────────────────────────────────────────
  setDraw(BRAND.lightGray)
  doc.setLineWidth(0.25)
  doc.line(20, headerY + 8, W - 20, headerY + 8)

  // ── Title block ───────────────────────────────────────────────────────
  const titleY = headerY + 16

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  setText(BRAND.primary)
  doc.text('AI SAFETY ALIGNMENT CERTIFICATE', W / 2, titleY, { align: 'center' })

  // Model name (large)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(28)
  setText(BRAND.nearBlack)
  doc.text(model.name, W / 2, titleY + 13, { align: 'center' })

  // Company
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  setText(BRAND.darkGray)
  doc.text(`by ${model.company}`, W / 2, titleY + 20.5, { align: 'center' })

  // Specialty (italic)
//   doc.setFont('helvetica', 'italic')
//   doc.setFontSize(8)
//   setText(BRAND.midGray)
//   doc.text(model.specialty, W / 2, titleY + 26.5, { align: 'center' })

  // ── Central grade badge ───────────────────────────────────────────────
  const badgeCenterX = W / 2
  const badgeY = titleY + 38
  const badgeR = 14

  // Circle background
  setFill(gColor)
  doc.circle(badgeCenterX, badgeY, badgeR, 'F')

  // Grade letter
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(32)
  setText(BRAND.white)
  doc.text(grade, badgeCenterX, badgeY + 4.5, { align: 'center' })

  // Score below badge
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  setText(gColor)
  doc.text(`${agg} / 100`, badgeCenterX, badgeY + badgeR + 7, { align: 'center' })

  // Grade label
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  setText(BRAND.darkGray)
  doc.text(`Composite Rating: ${gradeLabel(grade)}`, badgeCenterX, badgeY + badgeR + 12.5, { align: 'center' })

  // ── Four dimension cards ──────────────────────────────────────────────
  const cardsY = badgeY + badgeR + 22
  const cardW = 60
  const cardH = 38
  const cardGap = 6
  const totalCardsW = 4 * cardW + 3 * cardGap
  const cardsStartX = (W - totalCardsW) / 2

  DIMENSIONS.forEach((dim, i) => {
    const score = model.scores[dim.key]
    const hasScore = score !== undefined
    const dGrade = hasScore ? calcGrade(score) : null
    const dColor = hasScore ? GRADE_COLORS[dGrade] : BRAND.midGray
    const dBg = hasScore ? GRADE_BG_LIGHT[dGrade] : BRAND.nearWhite
    const x = cardsStartX + i * (cardW + cardGap)

    // Card background
    setFill(dBg)
    doc.roundedRect(x, cardsY, cardW, cardH, 2, 2, 'F')

    // Card border
    setDraw([...dColor.map(c => Math.min(255, c + 60))])
    doc.setLineWidth(0.3)
    doc.roundedRect(x, cardsY, cardW, cardH, 2, 2, 'S')

    if (hasScore) {
      // Grade pill (top-right of card)
      const pillX = x + cardW - 12
      const pillY = cardsY + 3.5
      setFill(dColor)
      doc.roundedRect(pillX, pillY, 9, 6, 1.5, 1.5, 'F')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      setText(BRAND.white)
      doc.text(dGrade, pillX + 4.5, pillY + 4.3, { align: 'center' })
    }

    // Score (or placeholder)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(18)
    setText(dColor)
    doc.text(hasScore ? String(Math.round(score)) : '—', x + 5, cardsY + 10.5)

    // Dimension title (wrapped so long names like "Anti-Authoritarian Alignment" stay inside the card)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    setText(BRAND.nearBlack)
    const titleLines = doc.splitTextToSize(dim.title, cardW - 9)
    doc.text(titleLines, x + 4, cardsY + 17)

    // Description (wrapped) — starts below the last title line
    const titleLineH = 3.2 // ~7pt × line-height in mm
    const descY = cardsY + 17 + titleLines.length * titleLineH
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(5.8)
    setText(BRAND.darkGray)
    const lines = doc.splitTextToSize(dim.description, cardW - 8)
    doc.text(lines, x + 4, descY)
  })

  // ── Grade legend (bottom) ─────────────────────────────────────────────
  const legendY = cardsY + cardH + 8
  const legendItems = [
    { g: 'A', label: 'Excellent (>= 80)' },
    { g: 'B', label: 'Good (65-79)' },
    { g: 'C', label: 'Fair (50-64)' },
    { g: 'D', label: 'Poor (< 50)' },
  ]
  const legendTotalW = 200
  const legendStartX = (W - legendTotalW) / 2

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6)
  setText(BRAND.midGray)
  doc.text('Grade Scale:', legendStartX, legendY + 3)

  legendItems.forEach((item, i) => {
    const lx = legendStartX + 22 + i * 44
    setFill(GRADE_COLORS[item.g])
    doc.circle(lx, legendY + 2, 2.2, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(6)
    setText(BRAND.white)
    doc.text(item.g, lx, legendY + 2.8, { align: 'center' })
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(5.8)
    setText(BRAND.darkGray)
    doc.text(item.label, lx + 4, legendY + 3)
  })

  // ── EuroSafeAI stamp (bottom-right, overlapping cards/footer area) ───
  // Position and rotation are deterministically jittered using a PRNG seeded
  // from CERT_SECRET + model.id — two PDFs with the same secret will always
  // produce identical stamp placement, making tampering detectable.
  const secret = env.CERT_SECRET || ''
  const rng = makePrng(fnv1aSeed(secret + model.id))

  const stampW = 55
  const stampH = stampW * (341 / 731) // preserve aspect ratio
  const stampRotDeg = rand(rng, -8, 8)        // ±8° rotation
  const stampDX    = rand(rng, -5, 5)         // ±5 mm horizontal jitter
  const stampDY    = rand(rng, -5, 5)         // ±5 mm vertical jitter

  const stampX = W - 20 - stampW + stampDX
  const stampY = cardsY + cardH - stampH + 4 + stampDY
  doc.addImage(stampBase64, 'PNG', stampX, stampY, stampW, stampH, undefined, 'FAST', stampRotDeg)

  // ── Footer ────────────────────────────────────────────────────────────
  const footerY = H - 23

  setDraw(BRAND.lightGray)
  doc.setLineWidth(0.25)
  doc.line(20, footerY, W - 20, footerY)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6.5)
  setText(BRAND.midGray)
  doc.text(
    'This certificate reflects preliminary evaluation data from the EuroSafeAI Alignment Index. Methodology follows EU AI Act requirements and ECHR jurisprudence.',
    W / 2, footerY + 4, { align: 'center' }
  )
  doc.text(
    'Scores are indicative and subject to revision as evaluations are peer-reviewed.  |  eurosafe.ai.toronto.edu  |  Certificate ID: ESAI-' + model.id.toUpperCase(),
    W / 2, footerY + 8, { align: 'center' }
  )

  // ── Bottom accent stripe ──────────────────────────────────────────────
  setFill(BRAND.primary)
  doc.rect(10.5, H - 10.7, W - 21, 2.2, 'F')
>>>>>>> Stashed changes

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
