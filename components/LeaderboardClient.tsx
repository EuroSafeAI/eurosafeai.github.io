'use client'

import { useState, useMemo, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import modelsData from '@/data/models.json'

// ─── Types ────────────────────────────────────────────────────────────────────

type Region = 'Frontier Leaders (USA)' | 'Asian Powerhouses' | 'Enterprise & Specialized'

interface ModelEntry {
  id: string
  name: string
  company: string
  region: Region
  specialty: string
  scores: { hr: number; harm: number; hist: number; auth: number }
}

type ScoreKey = keyof ModelEntry['scores']
type SortKey = ScoreKey | 'agg'

// ─── Static data — loaded from shared JSON (single source of truth) ───────────

const MODELS: ModelEntry[] = modelsData as ModelEntry[]

// ─── Metric definitions with paper citations ──────────────────────────────────

interface MetricDef {
  key: ScoreKey
  label: string
  shortLabel: string
  tooltip: React.ReactNode
}

const METRICS: MetricDef[] = [
  {
    key: 'hr',
    label: 'Human Rights',
    shortLabel: 'HR',
    tooltip: (
      <>
        <span className="block text-[10px] font-bold uppercase tracking-widest text-primary-300 mb-1.5">
          Human Rights Alignment
        </span>
        <span className="block text-[10px] italic text-gray-400 border-l-2 border-primary-500 pl-2 mb-2.5 leading-relaxed">
          EuroSafeAI Lab · Work in Progress
        </span>
        <span className="block text-[11px] text-gray-200 leading-relaxed">
          Evaluates alignment with international human rights standards across
          adversarial scenarios covering free expression, privacy, non-discrimination,
          and human dignity under red-team conditions.
        </span>
      </>
    ),
  },
  {
    key: 'harm',
    label: 'Harm Resistance',
    shortLabel: 'Harm',
    tooltip: (
      <>
        <span className="block text-[10px] font-bold uppercase tracking-widest text-primary-300 mb-1.5">
          Sociopolitical Harm Resistance
        </span>
        <span className="block text-[10px] italic text-gray-400 border-l-2 border-primary-500 pl-2 mb-2.5 leading-relaxed">
          Pandey et al. ·{' '}
          <a href="https://arxiv.org/abs/2510.04891" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary-300">
            arXiv:2510.04891
          </a>
          <br />
          &ldquo;SocialHarmBench: Revealing LLM Vulnerabilities to Socially Harmful Requests&rdquo;
        </span>
        <span className="block text-[11px] text-gray-200 leading-relaxed">
          Measures robustness against sociopolitical harms across 585 prompts spanning
          7 categories and 34 countries, including political manipulation, propaganda,
          disinformation, surveillance, and information control.
        </span>
      </>
    ),
  },
  {
    key: 'hist',
    label: 'Historical Accuracy',
    shortLabel: 'History',
    tooltip: (
      <>
        <span className="block text-[10px] font-bold uppercase tracking-widest text-primary-300 mb-1.5">
          Historical Revisionism Resistance
        </span>
        <span className="block text-[10px] italic text-gray-400 border-l-2 border-primary-500 pl-2 mb-2.5 leading-relaxed">
          EuroSafeAI Lab · IASEAI 2026 (forthcoming)<br />
          &ldquo;Preserving Historical Truth: Detecting Historical Revisionism in Large Language Models&rdquo;
        </span>
        <span className="block text-[11px] text-gray-200 leading-relaxed">
          Introduces HistoricalMisinfo, a dataset of 500 contested events from 45 countries,
          each with factual and revisionist references across 11 prompt scenarios. Evaluates
          model fidelity to documented historical facts and resistance to revisionist framing.
        </span>
      </>
    ),
  },
  {
    key: 'auth',
    label: 'Anti-Authoritarianism',
    shortLabel: 'Anti-Auth',
    tooltip: (
      <>
        <span className="block text-[10px] font-bold uppercase tracking-widest text-primary-300 mb-1.5">
          Anti-Authoritarian Alignment
        </span>
        <span className="block text-[10px] italic text-gray-400 border-l-2 border-primary-500 pl-2 mb-2.5 leading-relaxed">
          Guzman Piedrahita et al. ·{' '}
          <a href="https://arxiv.org/abs/2506.12758" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary-300">
            arXiv:2506.12758
          </a>
          <br />
          &ldquo;Democratic or Authoritarian? Probing a New Dimension of Political Biases in Large Language Models&rdquo;
        </span>
        <span className="block text-[11px] text-gray-200 leading-relaxed">
          Assesses alignment on the democracy–authoritarianism spectrum using the F-scale,
          FavScore for world leader favorability, and role-model probing. High-scoring models
          defend democratic values and resist promoting authoritarian governance under adversarial conditions.
        </span>
      </>
    ),
  },
]

const AGG_TOOLTIP: React.ReactNode = (
  <>
    <span className="block text-[10px] font-bold uppercase tracking-widest text-primary-300 mb-1.5">
      Composite Safety Score
    </span>
    <span className="block text-[10px] italic text-gray-400 border-l-2 border-primary-500 pl-2 mb-2.5 leading-relaxed">
      EuroSafeAI Lab · Technical Report (2025, in preparation)<br />
      &ldquo;EuroSafeAI Alignment Index: Methodology & Benchmarking Framework&rdquo;
    </span>
    <span className="block text-[11px] text-gray-200 leading-relaxed">
      Equal-weight mean of all four dimensions. Graded A–D following the
      EU AI Act risk-tiering structure. A ≥ 80 · B 65–79 · C 50–64 · D &lt;50.
    </span>
  </>
)

const REGIONS = [
  'All',
  'Frontier Leaders (USA)',
  'Asian Powerhouses',
  'Enterprise & Specialized',
] as const

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcAgg(s: ModelEntry['scores']): number {
  return Math.round((s.hr + s.harm + s.hist + s.auth) / 4)
}

function calcGrade(n: number): 'A' | 'B' | 'C' | 'D' {
  if (n >= 80) return 'A'
  if (n >= 65) return 'B'
  if (n >= 50) return 'C'
  return 'D'
}

const GRADE_BG: Record<string, string> = {
  A: 'bg-emerald-500',
  B: 'bg-blue-500',
  C: 'bg-amber-400',
  D: 'bg-red-500',
}

function barColor(n: number): string {
  if (n >= 80) return 'bg-emerald-400'
  if (n >= 65) return 'bg-blue-400'
  if (n >= 50) return 'bg-amber-400'
  return 'bg-red-400'
}

function textColor(n: number): string {
  if (n >= 80) return 'text-emerald-700'
  if (n >= 65) return 'text-blue-700'
  if (n >= 50) return 'text-amber-700'
  return 'text-red-600'
}

const REGION_PILL: Record<Region, string> = {
  'Frontier Leaders (USA)':  'bg-blue-50   text-blue-700   ring-1 ring-blue-200',
  'Asian Powerhouses':       'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
  'Enterprise & Specialized':'bg-teal-50   text-teal-700   ring-1 ring-teal-200',
}

const REGION_ABBR: Record<Region, string> = {
  'Frontier Leaders (USA)':  'USA Frontier',
  'Asian Powerhouses':       'Asian',
  'Enterprise & Specialized':'Enterprise',
}

// ─── Top-3 featured models — computed dynamically from scores ─────────────────

const FEATURED_MODELS = [...MODELS]
  .map((m) => ({ ...m, agg: calcAgg(m.scores) }))
  .sort((a, b) => b.agg - a.agg)
  .slice(0, 3)

// ─── Medal colours (gold / silver / bronze) ───────────────────────────────────

const MEDAL_BG    = ['bg-amber-400',   'bg-slate-400',  'bg-amber-700']  as const
const MEDAL_RING  = ['ring-amber-300', 'ring-slate-300', 'ring-amber-600'] as const
const MEDAL_LABEL = ['1st', '2nd', '3rd'] as const

const GRADE_RING: Record<string, string> = {
  A: 'ring-emerald-200',
  B: 'ring-blue-200',
  C: 'ring-amber-200',
  D: 'ring-red-200',
}

const GRADE_TEXT: Record<string, string> = {
  A: 'text-emerald-600',
  B: 'text-blue-600',
  C: 'text-amber-600',
  D: 'text-red-600',
}

const GRADE_BG_LIGHT: Record<string, string> = {
  A: 'bg-emerald-50',
  B: 'bg-blue-50',
  C: 'bg-amber-50',
  D: 'bg-red-50',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/**
 * Portal tooltip — renders on document.body so it's never clipped by
 * overflow-x-auto table wrappers or sticky bars. Position is computed from
 * the trigger's getBoundingClientRect() so it always aligns to the button.
 */
const TOOLTIP_W = 288 // w-72 = 18rem = 288px

function Tooltip({
  children,
  content,
}: {
  children: React.ReactNode
  content: React.ReactNode
}) {
  const triggerRef = useRef<HTMLSpanElement>(null)
  const [tip, setTip] = useState<{ top: number; left: number; arrowLeft: number } | null>(null)
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cancelClose = useCallback(() => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current)
      closeTimeout.current = null
    }
  }, [])

  const open = useCallback(() => {
    cancelClose()
    if (!triggerRef.current) return
    const r = triggerRef.current.getBoundingClientRect()
    const centerX = r.left + r.width / 2
    const left = Math.max(8, Math.min(centerX - TOOLTIP_W / 2, window.innerWidth - TOOLTIP_W - 8))
    const arrowLeft = Math.max(10, Math.min(centerX - left, TOOLTIP_W - 10))
    setTip({ top: r.top - 8, left, arrowLeft })
  }, [cancelClose])

  const scheduleClose = useCallback(() => {
    closeTimeout.current = setTimeout(() => setTip(null), 150)
  }, [])

  return (
    <span
      ref={triggerRef}
      className="relative inline-flex items-center"
      onMouseEnter={open}
      onMouseLeave={scheduleClose}
      onFocus={open}
      onBlur={scheduleClose}
    >
      {children}
      {tip !== null && typeof window !== 'undefined' &&
        createPortal(
          <div
            role="tooltip"
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
            style={{
              position: 'fixed',
              top: tip.top,
              left: tip.left,
              width: TOOLTIP_W,
              transform: 'translateY(-100%)',
              zIndex: 9999,
              paddingBottom: 12,
            }}
          >
            <div className="rounded-lg bg-gray-950 border border-gray-800 px-3.5 py-3 shadow-2xl whitespace-normal">
              {content}
            </div>
            {/* Arrow pointing down at trigger */}
            <div
              style={{ left: tip.arrowLeft }}
              className="absolute top-full -translate-x-1/2 w-0 h-0 border-x-[5px] border-x-transparent border-t-[5px] border-t-gray-950"
            />
          </div>,
          document.body
        )}
    </span>
  )
}

/** Sort direction arrow (inline SVG — no library import) */
function SortArrow({ active, asc }: { active: boolean; asc: boolean }) {
  return (
    <svg
      className={`w-3 h-3 inline-block ml-0.5 flex-shrink-0 transition-colors ${
        active ? 'text-primary-600' : 'text-gray-300'
      }`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      {active ? (
        asc ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        )
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
      )}
    </svg>
  )
}

/** Animated score bar — Motion width expand from 0 */
function ScoreBar({
  score,
  delay,
  reduced,
}: {
  score: number
  delay: number
  reduced: boolean
}) {
  return (
    <div className="flex items-center gap-2 min-w-[88px]">
      <div
        className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden"
        aria-hidden="true"
      >
        <motion.div
          className={`h-full rounded-full score-bar-fill ${barColor(score)}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{
            duration: reduced ? 0 : 0.75,
            ease: [0.16, 1, 0.3, 1],
            delay: reduced ? 0 : delay,
          }}
        />
      </div>
      <span
        className={`text-xs font-mono font-semibold w-6 text-right tabular-nums ${textColor(score)}`}
      >
        {score}
      </span>
    </div>
  )
}

/** Animated grade badge */
function GradeBadge({
  score,
  delay,
  reduced,
}: {
  score: number
  delay: number
  reduced: boolean
}) {
  const g = calcGrade(score)
  return (
    <div className="flex items-center gap-2">
      <motion.span
        className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-sm font-bold shadow-sm flex-shrink-0 ${GRADE_BG[g]}`}
        initial={{ scale: reduced ? 1 : 0, opacity: reduced ? 1 : 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: reduced ? 0 : 0.35,
          ease: [0.34, 1.56, 0.64, 1],
          delay: reduced ? 0 : delay,
        }}
        aria-label={`Grade ${g}`}
      >
        {g}
      </motion.span>
      <span className="text-sm font-semibold text-gray-700 tabular-nums font-jost">{score}</span>
    </div>
  )
}

/** Sortable column header with tooltip */
function SortableColHeader({
  label,
  colKey,
  tooltip,
  currentSort,
  sortAsc,
  onSort,
}: {
  label: string
  colKey: SortKey
  tooltip: React.ReactNode
  currentSort: SortKey
  sortAsc: boolean
  onSort: (k: SortKey) => void
}) {
  return (
    <th scope="col" className="px-3 py-3.5 text-left whitespace-nowrap">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onSort(colKey)}
          className="inline-flex items-center gap-0.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-primary-600 focus-visible:outline-none focus-visible:text-primary-600 transition-colors font-jost"
          aria-label={`Sort by ${label}`}
        >
          {label}
          <SortArrow active={currentSort === colKey} asc={sortAsc} />
        </button>
        <Tooltip content={tooltip}>
          <button
            type="button"
            aria-label={`About the ${label} score`}
            className="w-4 h-4 rounded-full bg-gray-100 text-gray-400 text-[9px] font-bold flex items-center justify-center hover:bg-primary-100 hover:text-primary-700 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 transition-colors flex-shrink-0 cursor-help"
          >
            i
          </button>
        </Tooltip>
      </div>
    </th>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function LeaderboardClient() {
  const [region, setRegion]   = useState<string>('All')
  const [sortKey, setSortKey] = useState<SortKey>('agg')
  const [sortAsc, setSortAsc] = useState(false)
  const reduced = useReducedMotion() ?? false

  const ranked = useMemo(() => {
    const filtered = region === 'All' ? MODELS : MODELS.filter((m) => m.region === region)
    return [...filtered]
      .map((m) => ({ ...m, agg: calcAgg(m.scores) }))
      .sort((a, b) => {
        const va = sortKey === 'agg' ? a.agg : a.scores[sortKey as ScoreKey]
        const vb = sortKey === 'agg' ? b.agg : b.scores[sortKey as ScoreKey]
        return sortAsc ? va - vb : vb - va
      })
  }, [region, sortKey, sortAsc])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((p) => !p)
    else { setSortKey(key); setSortAsc(false) }
  }

  return (
    <div>
      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-slate-50 via-primary-50/40 to-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-14 lg:py-18">
          <motion.p
            className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-3 font-jost"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0 }}
          >
            Research Output · EuroSafeAI
          </motion.p>
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.07 }}
          >
            AI Safety Alignment
            <br />
            <span className="text-primary-600 italic">Leaderboard</span>
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl leading-relaxed mb-6 font-jost"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            Benchmarking large language models across four independent dimensions derived
            from EU AI Act requirements, European Court of Human Rights jurisprudence,
            and EuroSafeAI&apos;s evaluation protocols.
          </motion.p>

          {/* Disclaimer */}
          <motion.div
            className="inline-flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800 max-w-xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.25 }}
          >
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-jost">
              <strong className="font-semibold">Preliminary data.</strong>{' '}
              Scores are indicative and based on ongoing research. Methodology and results
              will be revised as evaluations are peer-reviewed.{' '}
              <span className="text-amber-600">Last updated: Q1&nbsp;2026.</span>
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── Top 3 Featured Certificates ── */}
      <section className="bg-white py-10 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Top-Rated Models</h2>
            <p className="text-sm text-gray-500 font-jost">
              The highest-scoring models across all four safety dimensions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURED_MODELS.map((model, i) => {
              const grade = calcGrade(model.agg)
              return (
                <motion.div
                  key={model.id}
                  className={`relative rounded-2xl border bg-white overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 ${GRADE_RING[grade]} ring-1`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.35 + i * 0.1 }}
                >
                  {/* Medal rank badge */}
                  <div
                    className={`absolute top-4 right-4 w-9 h-9 rounded-full flex flex-col items-center justify-center shadow-md ring-2 ${MEDAL_BG[i]} ${MEDAL_RING[i]} text-white`}
                    aria-label={`Ranked ${MEDAL_LABEL[i]}`}
                  >
                    <span className="text-[11px] font-extrabold leading-none">{i + 1}</span>
                    <span className="text-[7px] font-semibold leading-none opacity-90 tracking-wide">{MEDAL_LABEL[i].slice(1)}</span>
                  </div>

                  {/* Top accent bar */}
                  <div className={`h-1.5 ${GRADE_BG[grade]}`} />

                  <div className="p-6">
                    {/* Grade + score header */}
                    <div className="flex items-center gap-4 mb-4">
                      <span className={`inline-flex items-center justify-center w-14 h-14 rounded-full text-white text-2xl font-bold shadow-md ${GRADE_BG[grade]}`}>
                        {grade}
                      </span>
                      <div className="min-w-0">
                        <p className="text-lg font-bold text-gray-900 truncate leading-tight">
                          {model.name}
                        </p>
                        <p className="text-sm text-gray-500 font-jost truncate">{model.company}</p>
                      </div>
                    </div>

                    {/* Composite score */}
                    <div className={`inline-flex items-baseline gap-1.5 px-3 py-1.5 rounded-lg mb-5 ${GRADE_BG_LIGHT[grade]}`}>
                      <span className={`text-2xl font-extrabold tabular-nums ${GRADE_TEXT[grade]}`}>{model.agg}</span>
                      <span className="text-xs text-gray-400 font-jost">/&nbsp;100</span>
                    </div>

                    {/* Dimension breakdown */}
                    <div className="space-y-2.5 mb-6">
                      {METRICS.map((m) => {
                        const score = model.scores[m.key]
                        const dGrade = calcGrade(score)
                        return (
                          <div key={m.key} className="flex items-center gap-3">
                            <span className="text-xs text-gray-500 font-jost w-14 flex-shrink-0 text-right">{m.shortLabel}</span>
                            <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${barColor(score)}`}
                                style={{ width: `${score}%` }}
                              />
                            </div>
                            <span className={`text-xs font-mono font-semibold w-5 text-right tabular-nums ${textColor(score)}`}>
                              {score}
                            </span>
                            <span className={`w-5 h-5 rounded-full text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0 ${GRADE_BG[dGrade]}`}>
                              {dGrade}
                            </span>
                          </div>
                        )
                      })}
                    </div>

                    {/* Download certificate link */}
                    <a
                      href={`/certificates/${model.id}.pdf`}
                      download
                      className={`flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 ${GRADE_BG[grade]} text-white hover:opacity-90 active:scale-[0.98]`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download Certificate
                    </a>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Controls ── */}
      <section className="bg-white border-b border-gray-100 sticky top-[65px] z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-3 flex flex-wrap items-center gap-2 justify-between">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by region">
            {REGIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRegion(r)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 font-jost active:scale-95 ${
                  region === r
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                aria-pressed={region === r}
              >
                {r}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 font-jost">
            {ranked.length} model{ranked.length !== 1 ? 's' : ''}
          </p>
        </div>
      </section>

      {/* ── Table ── */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
            <table
              className="w-full text-sm border-collapse"
              aria-label="AI Safety Alignment Leaderboard"
            >
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th
                    scope="col"
                    className="w-10 px-3 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider font-jost sticky left-0 bg-gray-50 z-10"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-jost min-w-[180px]"
                  >
                    Model
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-jost whitespace-nowrap"
                  >
                    Category
                  </th>
                  <SortableColHeader
                    label="Score"
                    colKey="agg"
                    tooltip={AGG_TOOLTIP}
                    currentSort={sortKey}
                    sortAsc={sortAsc}
                    onSort={handleSort}
                  />
                  {METRICS.map((m, i) => (
                    <SortableColHeader
                      key={m.key}
                      label={m.shortLabel}
                      colKey={m.key}
                      tooltip={m.tooltip}
                      currentSort={sortKey}
                      sortAsc={sortAsc}
                      onSort={handleSort}
                    />
                  ))}
                </tr>
              </thead>

              {/* Key on tbody causes rows to remount (replay animations) when region changes */}
              <AnimatePresence mode="wait">
                <motion.tbody
                  key={region}
                  className="divide-y divide-gray-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  {ranked.map((model, idx) => {
                    const rowDelay = reduced ? 0 : idx * 0.028
                    const barDelay = reduced ? 0 : rowDelay + 0.12

                    return (
                      <motion.tr
                        key={model.id}
                        className="hover:bg-primary-50/30 transition-colors duration-150"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: reduced ? 0 : 0.35,
                          ease: 'easeOut',
                          delay: rowDelay,
                        }}
                      >
                        {/* Rank */}
                        <td className="px-3 py-3.5 sticky left-0 bg-white z-10">
                          {idx < 3 ? (
                            <span
                              className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-extrabold text-white shadow-sm ring-1 ${MEDAL_BG[idx]} ${MEDAL_RING[idx]}`}
                              aria-label={`Ranked ${MEDAL_LABEL[idx]}`}
                            >
                              {idx + 1}
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-gray-400 tabular-nums font-jost">{idx + 1}</span>
                          )}
                        </td>

                        {/* Model name + info tooltip */}
                        <td className="px-3 py-3.5 min-w-[180px]">
                          <div className="flex items-start gap-1.5">
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 truncate leading-snug">
                                {model.name}
                              </p>
                              <p className="text-xs text-gray-400 truncate font-jost">{model.company}</p>
                            </div>
                            {/* removing tooltip, just random information that needs to be checked. */}
                            {/* <Tooltip
                              content={
                                <>
                                  <span className="block text-[10px] font-bold uppercase tracking-widest text-primary-300 mb-1">
                                    {model.name}
                                  </span>
                                  <span className="block text-[10px] text-gray-400 mb-1.5">{model.company}</span>
                                  <span className="block text-[11px] text-gray-200 leading-relaxed">{model.specialty}</span>
                                </>
                              }
                            >
                              <button
                                type="button"
                                aria-label={`About ${model.name}`}
                                className="w-4 h-4 rounded-full bg-gray-100 text-gray-400 text-[9px] font-bold flex-shrink-0 flex items-center justify-center hover:bg-primary-100 hover:text-primary-700 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 transition-colors mt-0.5 cursor-help"
                              >
                                i
                              </button>
                            </Tooltip> */}
                            <a
                              href={`/certificates/${model.id}.pdf`}
                              download
                              aria-label={`Download certificate for ${model.name}`}
                              className="w-4 h-4 rounded-full bg-gray-100 text-gray-400 flex-shrink-0 flex items-center justify-center hover:bg-primary-100 hover:text-primary-700 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 transition-colors mt-0.5"
                            >
                              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v10m0 0l-3-3m3 3l3-3M4 17v1a2 2 0 002 2h12a2 2 0 002-2v-1" />
                              </svg>
                            </a>
                          </div>
                        </td>

                        {/* Region pill */}
                        <td className="px-3 py-3.5 whitespace-nowrap">
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold font-jost ${
                              REGION_PILL[model.region]
                            }`}
                          >
                            {REGION_ABBR[model.region]}
                          </span>
                        </td>

                        {/* Aggregate score */}
                        <td className="px-3 py-3.5 whitespace-nowrap">
                          <GradeBadge score={model.agg} delay={barDelay} reduced={reduced} />
                        </td>

                        {/* Individual metric scores */}
                        {METRICS.map((m) => (
                          <td key={m.key} className="px-3 py-3.5">
                            <ScoreBar
                              score={model.scores[m.key]}
                              delay={barDelay}
                              reduced={reduced}
                            />
                          </td>
                        ))}
                      </motion.tr>
                    )
                  })}
                </motion.tbody>
              </AnimatePresence>
            </table>
          </div>

          {/* ── Grade legend ── */}
          <motion.div
            className="mt-6 flex flex-wrap gap-4 items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex flex-wrap gap-3 text-xs text-gray-500 font-jost">
              <span className="font-semibold text-gray-600 mr-1">Grade:</span>
              {(['A', 'B', 'C', 'D'] as const).map((g) => {
                const labels: Record<string, string> = {
                  A: 'A — Excellent (≥ 80)',
                  B: 'B — Good (65–79)',
                  C: 'C — Fair (50–64)',
                  D: 'D — Poor (< 50)',
                }
                return (
                  <span key={g} className="flex items-center gap-1.5">
                    <span
                      className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-[10px] font-bold ${GRADE_BG[g]}`}
                    >
                      {g}
                    </span>
                    <span>{labels[g]}</span>
                  </span>
                )
              })}
            </div>
            <p className="text-xs text-gray-400 font-jost">
              Scores out of 100 · Click column headers to sort · Hover{' '}
              <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-gray-200 text-gray-500 text-[8px] font-bold">i</span>{' '}
              for methodology
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Methodology note ── */}
      <section className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-3">About This Index</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4 font-jost">
              The EuroSafeAI Alignment Index evaluates frontier AI models across four independent
              dimensions derived from EU AI Act requirements, European Court of Human Rights
              jurisprudence, and EuroSafeAI&apos;s internal red-teaming protocols. Each dimension is
              scored 0–100 via its specific evaluation and aggregated with equal weighting
              into an overall grade.
            </p>
            <p className="text-sm text-gray-500 leading-relaxed font-jost">
              Full methodology, dataset descriptions, and reproducibility information will be
              published alongside the peer-reviewed working papers listed above. Regional
              categorization reflects primary corporate headquarters.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
