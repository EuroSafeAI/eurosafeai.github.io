/**
 * Certificate visual renderer — version 1 (the layout inherited from the
 * pre-rebuild EuroSafeAI Next.js site).
 *
 * This module owns everything visual: layout, colors, typography, stamp
 * placement, footer text. It does NOT own:
 *   - data shape           → src/data/models.types.ts
 *   - scoring math         → src/lib/scoring.ts (mirrored in generate-certificates.mjs)
 *   - file I/O, secrets    → scripts/generate-certificates.mjs
 *   - jsPDF lifecycle      → scripts/generate-certificates.mjs
 *
 * When the design is redesigned:
 *   1. Copy this file to cert-render-v2.mjs and edit there.
 *   2. Change the import in generate-certificates.mjs to point at v2.
 *   3. v1 stays available for regenerating historical / archival certificates
 *      with the original look.
 *
 * Contract this module relies on (see scripts/CERT-CONTRACT.md):
 *   model:    { id, name, company, scores: { hr, harm, hist, auth } }
 *   computed: { agg, grade }
 *   env:      { CERT_SECRET? }    — used only for deterministic stamp jitter
 *   doc:      a fresh jsPDF instance with file id + creation date already set
 *   stampBase64: the EuroSafeAI seal preloaded as a data URI
 */

// ── Seeded PRNG (FNV-1a → mulberry32) ───────────────────────────────────────
// Local copy so the renderer is self-contained — the pipeline uses an
// independent PRNG for the file id, so there's no cross-coupling.

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

function rand(rng, min, max) {
  return min + rng() * (max - min)
}

// ── Brand colors (RGB triplets for jsPDF set*Color) ─────────────────────────

const BRAND = {
  primary:    [26, 127, 196],   // #1a7fc4
  primaryDk:  [19, 68, 104],    // #134468
  white:      [255, 255, 255],
  nearWhite:  [248, 250, 252],
  lightGray:  [229, 231, 235],
  midGray:    [156, 163, 175],
  darkGray:   [75, 85, 99],
  nearBlack:  [31, 41, 55],
}

const GRADE_COLORS = {
  A: [16, 185, 129],   // emerald-500
  B: [59, 130, 246],   // blue-500
  C: [245, 158, 11],   // amber-500
  D: [239, 68, 68],    // red-500
}

const GRADE_BG_LIGHT = {
  A: [236, 253, 245],  // emerald-50
  B: [239, 246, 255],  // blue-50
  C: [255, 251, 235],  // amber-50
  D: [254, 242, 242],  // red-50
}

// ── Dimension metadata (titles + descriptions printed on each cert) ─────────

const DIMENSIONS = [
  {
    key: 'hr',
    title: 'Human Rights Alignment',
    description: 'Alignment with international human rights standards across adversarial scenarios covering free expression, privacy, non-discrimination, and human dignity.',
  },
  {
    key: 'harm',
    title: 'Sociopolitical Harm Resistance',
    description: 'Robustness against sociopolitical harms including political manipulation, propaganda, disinformation, surveillance, and information control.',
  },
  {
    key: 'hist',
    title: 'Historical Revisionism Resistance',
    description: 'Fidelity to documented historical facts and resistance to revisionist framing across contested events from multiple countries.',
  },
  {
    key: 'auth',
    title: 'Anti-Authoritarian Alignment',
    description: 'Alignment on the democracy–authoritarianism spectrum, defending democratic values and resisting promotion of authoritarian governance.',
  },
]

const GRADE_LABELS = { A: 'Excellent', B: 'Good', C: 'Fair', D: 'Poor' }

function calcGradeLocal(n) {
  if (n >= 80) return 'A'
  if (n >= 65) return 'B'
  if (n >= 50) return 'C'
  return 'D'
}

// ── Renderer ────────────────────────────────────────────────────────────────

/**
 * Draw the certificate for a single model onto the provided jsPDF document.
 * Mutates `doc` in place; returns nothing.
 */
export function renderCertificateV1(doc, model, computed, env, stampBase64) {
  const W = 297 // A4 landscape width mm
  const H = 210 // A4 landscape height mm

  const { agg, grade } = computed
  const gColor = GRADE_COLORS[grade]

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

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  setText(BRAND.primary)
  doc.text('EuroSafeAI', 20, headerY)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  setText(BRAND.midGray)
  doc.text('Developing Multi-Agent AI Safety for Democracy  ·  Zurich, Switzerland', 20, headerY + 4.5)

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

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(28)
  setText(BRAND.nearBlack)
  doc.text(model.name, W / 2, titleY + 13, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  setText(BRAND.darkGray)
  doc.text(`by ${model.company}`, W / 2, titleY + 20.5, { align: 'center' })

  // ── Central grade badge ───────────────────────────────────────────────
  const badgeCenterX = W / 2
  const badgeY = titleY + 38
  const badgeR = 14

  setFill(gColor)
  doc.circle(badgeCenterX, badgeY, badgeR, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(32)
  setText(BRAND.white)
  doc.text(grade, badgeCenterX, badgeY + 4.5, { align: 'center' })

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  setText(gColor)
  doc.text(`${agg} / 100`, badgeCenterX, badgeY + badgeR + 7, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  setText(BRAND.darkGray)
  doc.text(`Composite Rating: ${GRADE_LABELS[grade]}`, badgeCenterX, badgeY + badgeR + 12.5, { align: 'center' })

  // ── Four dimension cards ──────────────────────────────────────────────
  const cardsY = badgeY + badgeR + 22
  const cardW = 60
  const cardH = 38
  const cardGap = 6
  const totalCardsW = 4 * cardW + 3 * cardGap
  const cardsStartX = (W - totalCardsW) / 2

  // Neutral palette for "no data yet" dimension cards — gray instead of D-red,
  // so a missing score doesn't look like a failure grade.
  const NEUTRAL_BG     = [243, 244, 246]   // gray-100
  const NEUTRAL_BORDER = [209, 213, 219]   // gray-300
  const NEUTRAL_FG     = [156, 163, 175]   // gray-400

  DIMENSIONS.forEach((dim, i) => {
    const score = model.scores[dim.key]
    const hasScore = typeof score === 'number' && Number.isFinite(score)
    const dGrade  = hasScore ? calcGradeLocal(score) : null
    const dColor  = hasScore ? GRADE_COLORS[dGrade] : NEUTRAL_FG
    const dBg     = hasScore ? GRADE_BG_LIGHT[dGrade] : NEUTRAL_BG
    const dBorder = hasScore ? dColor.map(c => Math.min(255, c + 60)) : NEUTRAL_BORDER
    const x = cardsStartX + i * (cardW + cardGap)

    setFill(dBg)
    doc.roundedRect(x, cardsY, cardW, cardH, 2, 2, 'F')

    setDraw(dBorder)
    doc.setLineWidth(0.3)
    doc.roundedRect(x, cardsY, cardW, cardH, 2, 2, 'S')

    const pillX = x + cardW - 12
    const pillY = cardsY + 3.5
    setFill(dColor)
    doc.roundedRect(pillX, pillY, 9, 6, 1.5, 1.5, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    setText(BRAND.white)
    doc.text(hasScore ? dGrade : '—', pillX + 4.5, pillY + 4.3, { align: 'center' })

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(18)
    setText(dColor)
    doc.text(hasScore ? String(Math.round(score)) : '—', x + 5, cardsY + 10.5)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    setText(BRAND.nearBlack)
    const titleLines = doc.splitTextToSize(dim.title, cardW - 9)
    doc.text(titleLines, x + 4, cardsY + 17)

    const titleLineH = 3.2
    const descY = cardsY + 17 + titleLines.length * titleLineH
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(5.8)
    setText(BRAND.darkGray)
    const lines = doc.splitTextToSize(dim.description, cardW - 8)
    doc.text(lines, x + 4, descY)
  })

  // ── Grade legend ──────────────────────────────────────────────────────
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

  // ── EuroSafeAI stamp (bottom-right, deterministically jittered) ──────
  // Seed format matches the pre-rebuild generator exactly:
  //   fnv1aSeed(CERT_SECRET + model.id)   ← no separator, no namespace
  // Do not change without coordinating — any drift here makes every PDF's
  // stamp position visibly different from prior certificates with the same id.
  // The pipeline's file-id PRNG uses a separate `:fileid:` namespace so the
  // two never collide on the same input.
  const secret = env.CERT_SECRET || ''
  const rng = makePrng(fnv1aSeed(secret + model.id))

  const stampW = 55
  const stampH = stampW * (341 / 731)
  const stampRotDeg = rand(rng, -8, 8)
  const stampDX    = rand(rng, -5, 5)
  const stampDY    = rand(rng, -5, 5)

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
}
