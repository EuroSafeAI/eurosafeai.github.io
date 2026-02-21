'use client'

import { useState, useMemo } from 'react'

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

// ─── Static data — defined outside component (no re-init on re-render) ────────

const MODELS: ModelEntry[] = [
  // Frontier Leaders (USA) — OpenAI
  { id: 'gpt-5.2', name: 'GPT-5.2', company: 'OpenAI', region: 'Frontier Leaders (USA)', specialty: 'Peak general intelligence & complex reasoning', scores: { hr: 88, harm: 82, hist: 85, auth: 87 } },
  { id: 'gpt-5', name: 'GPT-5', company: 'OpenAI', region: 'Frontier Leaders (USA)', specialty: 'High-throughput multimodal agent engine', scores: { hr: 85, harm: 79, hist: 83, auth: 84 } },
  { id: 'o3-mini', name: 'o3-mini', company: 'OpenAI', region: 'Frontier Leaders (USA)', specialty: 'SOTA for mathematics and logical coding tasks', scores: { hr: 82, harm: 76, hist: 80, auth: 81 } },
  { id: 'gpt-oss-120b', name: 'GPT-OSS-120B', company: 'OpenAI', region: 'Frontier Leaders (USA)', specialty: "OpenAI's flagship open-weight contribution", scores: { hr: 78, harm: 72, hist: 77, auth: 75 } },
  // Frontier Leaders (USA) — Google DeepMind
  { id: 'gemini-3-pro', name: 'Gemini 3 Pro', company: 'Google DeepMind', region: 'Frontier Leaders (USA)', specialty: 'Multimodal champion with 2M+ context window', scores: { hr: 84, harm: 80, hist: 82, auth: 83 } },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', company: 'Google DeepMind', region: 'Frontier Leaders (USA)', specialty: 'Industry leader for low-latency high-volume tasks', scores: { hr: 80, harm: 77, hist: 78, auth: 80 } },
  { id: 'gemma-3-27b', name: 'Gemma 3 27B', company: 'Google DeepMind', region: 'Frontier Leaders (USA)', specialty: 'Top-tier small model for edge devices', scores: { hr: 72, harm: 68, hist: 70, auth: 71 } },
  // Frontier Leaders (USA) — Anthropic
  { id: 'claude-4.5-opus', name: 'Claude Opus 4.5', company: 'Anthropic', region: 'Frontier Leaders (USA)', specialty: 'Leading model for nuanced writing and safety', scores: { hr: 92, harm: 88, hist: 90, auth: 91 } },
  { id: 'claude-4.6-sonnet', name: 'Claude Sonnet 4.6', company: 'Anthropic', region: 'Frontier Leaders (USA)', specialty: 'The standard for software engineering workflows', scores: { hr: 90, harm: 85, hist: 88, auth: 89 } },
  { id: 'claude-4-haiku', name: 'Claude Haiku 4', company: 'Anthropic', region: 'Frontier Leaders (USA)', specialty: 'Best-in-class speed/cost ratio for simple tasks', scores: { hr: 86, harm: 82, hist: 84, auth: 85 } },
  // Frontier Leaders (USA) — Meta
  { id: 'llama-4-maverick', name: 'Llama 4 Maverick', company: 'Meta', region: 'Frontier Leaders (USA)', specialty: '405B parameter open-weight frontier model', scores: { hr: 74, harm: 70, hist: 72, auth: 73 } },
  { id: 'llama-4-scout', name: 'Llama 4 Scout', company: 'Meta', region: 'Frontier Leaders (USA)', specialty: '17B–70B models optimized for efficient inference', scores: { hr: 71, harm: 67, hist: 69, auth: 70 } },
  // Frontier Leaders (USA) — xAI
  { id: 'grok-4.1-thinking', name: 'Grok 4.1 Thinking', company: 'xAI', region: 'Frontier Leaders (USA)', specialty: 'Deep reasoning model with real-time X integration', scores: { hr: 62, harm: 58, hist: 55, auth: 52 } },
  { id: 'grok-4-mini', name: 'Grok 4 Mini', company: 'xAI', region: 'Frontier Leaders (USA)', specialty: 'Efficient conversational agent for mobile', scores: { hr: 60, harm: 55, hist: 52, auth: 50 } },
  // Asian Powerhouses — Alibaba (Qwen)
  { id: 'qwen-3.5-plus', name: 'Qwen 3.5 Plus', company: 'Alibaba (Qwen)', region: 'Asian Powerhouses', specialty: 'Dominates global open-source benchmarks', scores: { hr: 58, harm: 52, hist: 48, auth: 45 } },
  { id: 'qwen-3-max-thinking', name: 'Qwen 3 Max Think', company: 'Alibaba (Qwen)', region: 'Asian Powerhouses', specialty: 'Specialized logic engine for scientific research', scores: { hr: 60, harm: 54, hist: 50, auth: 47 } },
  { id: 'qwen3-coder-next', name: 'Qwen3 Coder Next', company: 'Alibaba (Qwen)', region: 'Asian Powerhouses', specialty: 'SOTA for autonomous programming and debugging', scores: { hr: 55, harm: 50, hist: 46, auth: 43 } },
  // Asian Powerhouses — DeepSeek
  { id: 'deepseek-v3.2-exp', name: 'DeepSeek V3.2', company: 'DeepSeek', region: 'Asian Powerhouses', specialty: 'Extreme efficiency through Mixture-of-Experts (MoE)', scores: { hr: 50, harm: 45, hist: 42, auth: 38 } },
  { id: 'deepseek-r1-reasoning', name: 'DeepSeek R1', company: 'DeepSeek', region: 'Asian Powerhouses', specialty: 'Chain-of-thought reasoning model rivaling GPT-o series', scores: { hr: 48, harm: 42, hist: 40, auth: 36 } },
  // Asian Powerhouses — Moonshot AI (Kimi)
  { id: 'kimi-k2.5', name: 'Kimi K2.5', company: 'Moonshot AI', region: 'Asian Powerhouses', specialty: 'Leading context-handling for massive documents', scores: { hr: 62, harm: 56, hist: 52, auth: 50 } },
  { id: 'kimi-k2-thinking', name: 'Kimi K2 Thinking', company: 'Moonshot AI', region: 'Asian Powerhouses', specialty: 'Advanced logic for academic and professional analysis', scores: { hr: 64, harm: 58, hist: 54, auth: 52 } },
  // Asian Powerhouses — Zhipu AI (GLM)
  { id: 'glm-5', name: 'GLM-5', company: 'Zhipu AI', region: 'Asian Powerhouses', specialty: 'Premier bilingual (CN/EN) foundation model', scores: { hr: 52, harm: 46, hist: 44, auth: 40 } },
  { id: 'glm-4.7-vision', name: 'GLM-4.7 Vision', company: 'Zhipu AI', region: 'Asian Powerhouses', specialty: 'SOTA for document parsing and visual OCR', scores: { hr: 54, harm: 48, hist: 46, auth: 42 } },
  // Asian Powerhouses — Xiaomi / MiniMax
  { id: 'mimo-v2-flash', name: 'MiMo V2 Flash', company: 'MiniMax / Xiaomi', region: 'Asian Powerhouses', specialty: 'Ultra-fast reasoning model from Xiaomi', scores: { hr: 58, harm: 52, hist: 50, auth: 48 } },
  { id: 'minimax-m2.1-agent', name: 'MiniMax M2.1', company: 'MiniMax / Xiaomi', region: 'Asian Powerhouses', specialty: 'Specialized for autonomous agentic workflows', scores: { hr: 60, harm: 54, hist: 52, auth: 50 } },
  // Enterprise & Specialized — Mistral AI
  { id: 'mistral-large-3', name: 'Mistral Large 3', company: 'Mistral AI', region: 'Enterprise & Specialized', specialty: 'European champion for multilingual enterprise tasks', scores: { hr: 82, harm: 78, hist: 80, auth: 83 } },
  { id: 'pixtral-12b', name: 'Pixtral 12B', company: 'Mistral AI', region: 'Enterprise & Specialized', specialty: 'Specialized native vision-language model', scores: { hr: 76, harm: 72, hist: 74, auth: 77 } },
  // Enterprise & Specialized — Microsoft
  { id: 'phi-4-mini', name: 'Phi-4 Mini', company: 'Microsoft', region: 'Enterprise & Specialized', specialty: 'SOTA "Small Language Model" for local privacy', scores: { hr: 74, harm: 70, hist: 72, auth: 73 } },
  { id: 'phi-3.5-vision', name: 'Phi-3.5 Vision', company: 'Microsoft', region: 'Enterprise & Specialized', specialty: 'Lightweight visual reasoning engine', scores: { hr: 72, harm: 68, hist: 70, auth: 71 } },
  // Enterprise & Specialized — Amazon AWS
  { id: 'nova-pro', name: 'Nova Pro', company: 'Amazon AWS', region: 'Enterprise & Specialized', specialty: 'Native multimodal powerhouse for Bedrock', scores: { hr: 76, harm: 72, hist: 73, auth: 74 } },
  { id: 'nova-lite', name: 'Nova Lite', company: 'Amazon AWS', region: 'Enterprise & Specialized', specialty: 'Cost-optimized vision model for retail/logistics', scores: { hr: 73, harm: 69, hist: 70, auth: 71 } },
  // Enterprise & Specialized — NVIDIA
  { id: 'nemotron-4-340b', name: 'Nemotron 4 340B', company: 'NVIDIA', region: 'Enterprise & Specialized', specialty: 'SOTA for synthetic data generation', scores: { hr: 78, harm: 74, hist: 75, auth: 76 } },
  { id: 'nemotron-3-nano', name: 'Nemotron 3 Nano', company: 'NVIDIA', region: 'Enterprise & Specialized', specialty: '32B MoE model optimized for RTX hardware', scores: { hr: 70, harm: 66, hist: 68, auth: 69 } },
]

const METRICS: Array<{ key: ScoreKey; label: string; description: string }> = [
  {
    key: 'hr',
    label: 'Human Rights',
    description:
      'Alignment with international human rights standards and the European Convention on Human Rights. Covers freedom of expression, non-discrimination, privacy, and human dignity under stress-test prompts.',
  },
  {
    key: 'harm',
    label: 'Harm Resistance',
    description:
      'Robustness against socially and politically harmful requests. A high score means the model refuses to generate content enabling disinformation, radicalization, targeted harassment, or political manipulation.',
  },
  {
    key: 'hist',
    label: 'Historical Accuracy',
    description:
      'Fidelity to documented historical facts without revisionist tendencies. Penalizes models that distort, minimize, or reframe established historical events to serve political narratives.',
  },
  {
    key: 'auth',
    label: 'Anti-Authoritarianism',
    description:
      'Resistance to promoting authoritarian governance, censorship, or suppression of democratic institutions. Models scoring high consistently defend civil liberties, rule of law, and pluralistic values.',
  },
]

const REGIONS = [
  'All',
  'Frontier Leaders (USA)',
  'Asian Powerhouses',
  'Enterprise & Specialized',
] as const

// ─── Helpers (pure functions — stable references) ─────────────────────────────

function calcAgg(scores: ModelEntry['scores']): number {
  return Math.round((scores.hr + scores.harm + scores.hist + scores.auth) / 4)
}

function calcGrade(score: number): 'A' | 'B' | 'C' | 'D' {
  if (score >= 80) return 'A'
  if (score >= 65) return 'B'
  if (score >= 50) return 'C'
  return 'D'
}

const GRADE_BG: Record<string, string> = {
  A: 'bg-emerald-500',
  B: 'bg-blue-500',
  C: 'bg-amber-400',
  D: 'bg-red-500',
}

function barColor(score: number): string {
  if (score >= 80) return 'bg-emerald-400'
  if (score >= 65) return 'bg-blue-400'
  if (score >= 50) return 'bg-amber-400'
  return 'bg-red-400'
}

function textColor(score: number): string {
  if (score >= 80) return 'text-emerald-700'
  if (score >= 65) return 'text-blue-700'
  if (score >= 50) return 'text-amber-700'
  return 'text-red-600'
}

const REGION_PILL: Record<Region, string> = {
  'Frontier Leaders (USA)': 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  'Asian Powerhouses': 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
  'Enterprise & Specialized': 'bg-teal-50 text-teal-700 ring-1 ring-teal-200',
}

const REGION_ABBR: Record<Region, string> = {
  'Frontier Leaders (USA)': 'USA Frontier',
  'Asian Powerhouses': 'Asian',
  'Enterprise & Specialized': 'Enterprise',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

// Tooltip — CSS-only via group-hover / group-focus-within (keyboard accessible)
function Tooltip({
  children,
  content,
  align = 'center',
}: {
  children: React.ReactNode
  content: string
  align?: 'left' | 'center' | 'right'
}) {
  const posClass =
    align === 'left'
      ? 'left-0'
      : align === 'right'
      ? 'right-0'
      : 'left-1/2 -translate-x-1/2'
  const arrowClass =
    align === 'left' ? 'left-3' : align === 'right' ? 'right-3' : 'left-1/2 -translate-x-1/2'

  return (
    <span className="group relative inline-flex items-center">
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute bottom-full ${posClass} mb-2 w-60 rounded-lg bg-gray-900 px-3 py-2.5 text-xs leading-relaxed text-gray-100 shadow-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 motion-safe:transition-opacity motion-safe:duration-150 z-30 whitespace-normal`}
      >
        {content}
        <span
          className={`absolute top-full ${arrowClass} w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900`}
        />
      </span>
    </span>
  )
}

// Sort arrow — inline SVG, no library import
function SortArrow({ active, asc }: { active: boolean; asc: boolean }) {
  return (
    <svg
      className={`w-3 h-3 inline-block ml-0.5 flex-shrink-0 ${
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

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden" aria-hidden="true">
        <div
          className={`h-full rounded-full ${barColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-xs font-mono font-semibold w-6 text-right tabular-nums ${textColor(score)}`}>
        {score}
      </span>
    </div>
  )
}

function GradeBadge({ score }: { score: number }) {
  const g = calcGrade(score)
  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-sm font-bold shadow-sm flex-shrink-0 ${GRADE_BG[g]}`}
        aria-label={`Grade ${g}`}
      >
        {g}
      </span>
      <span className="text-sm font-semibold text-gray-700 tabular-nums">{score}</span>
    </div>
  )
}

function SortableColHeader({
  label,
  colKey,
  tooltip,
  tooltipAlign,
  currentSort,
  sortAsc,
  onSort,
}: {
  label: string
  colKey: SortKey
  tooltip: string
  tooltipAlign?: 'left' | 'center' | 'right'
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
          className="inline-flex items-center gap-0.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-primary-600 focus-visible:outline-none focus-visible:text-primary-600 transition-colors"
          aria-label={`Sort by ${label}`}
        >
          {label}
          <SortArrow active={currentSort === colKey} asc={sortAsc} />
        </button>
        <Tooltip content={tooltip} align={tooltipAlign}>
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
  const [region, setRegion] = useState<string>('All')
  const [sortKey, setSortKey] = useState<SortKey>('agg')
  const [sortAsc, setSortAsc] = useState(false)

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
    if (sortKey === key) {
      setSortAsc((prev) => !prev)
    } else {
      setSortKey(key)
      setSortAsc(false)
    }
  }

  return (
    <div>
      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-slate-50 via-primary-50/40 to-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-3">
            Research Output
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4" style={{ textWrap: 'balance' } as React.CSSProperties}>
            AI Safety Alignment Leaderboard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl leading-relaxed mb-6">
            Benchmarking large language models on democratic values, human rights compliance,
            and resistance to harmful outputs — evaluated through an EU regulatory lens.
          </p>
          {/* Disclaimer */}
          <div className="inline-flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800 max-w-xl">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>
              <strong>Preliminary data.</strong> Scores are indicative and based on ongoing research.
              Methodology and results will be updated as evaluations mature.{' '}
              <span className="text-amber-600">Last updated: Q1&nbsp;2026.</span>
            </span>
          </div>
        </div>
      </section>

      {/* ── Controls ── */}
      <section className="bg-white border-b border-gray-100 sticky top-[65px] z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-3 flex flex-wrap items-center gap-2 justify-between">
          {/* Region filter tabs */}
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by region">
            {REGIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRegion(r)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
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
          <p className="text-xs text-gray-400">
            {ranked.length} model{ranked.length !== 1 ? 's' : ''}
          </p>
        </div>
      </section>

      {/* ── Table ── */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
            <table className="w-full text-sm border-collapse" aria-label="AI Safety Alignment Leaderboard">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {/* Rank */}
                  <th
                    scope="col"
                    className="w-10 px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10"
                  >
                    #
                  </th>
                  {/* Model */}
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[180px]"
                  >
                    Model
                  </th>
                  {/* Region */}
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    Category
                  </th>
                  {/* Aggregate */}
                  <SortableColHeader
                    label="Score"
                    colKey="agg"
                    tooltip="Aggregate safety score — an equally weighted average of Human Rights alignment, Harm Resistance, Historical Accuracy, and Anti-Authoritarianism. Graded A–D."
                    tooltipAlign="center"
                    currentSort={sortKey}
                    sortAsc={sortAsc}
                    onSort={handleSort}
                  />
                  {/* Individual metrics */}
                  {METRICS.map((m, i) => (
                    <SortableColHeader
                      key={m.key}
                      label={m.label}
                      colKey={m.key}
                      tooltip={m.description}
                      tooltipAlign={i === METRICS.length - 1 ? 'right' : 'center'}
                      currentSort={sortKey}
                      sortAsc={sortAsc}
                      onSort={handleSort}
                    />
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {ranked.map((model, idx) => (
                  <tr
                    key={model.id}
                    className="hover:bg-primary-50/30 transition-colors"
                  >
                    {/* Rank number */}
                    <td className="px-3 py-3.5 text-xs font-semibold text-gray-400 tabular-nums sticky left-0 bg-white group-hover:bg-primary-50/30 z-10">
                      {idx + 1}
                    </td>

                    {/* Model name + info tooltip */}
                    <td className="px-3 py-3.5 min-w-[180px]">
                      <div className="flex items-start gap-1.5">
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate leading-snug">
                            {model.name}
                          </p>
                          <p className="text-xs text-gray-400 truncate">{model.company}</p>
                        </div>
                        <Tooltip content={`${model.name} · ${model.company}\n${model.specialty}`} align="left">
                          <button
                            type="button"
                            aria-label={`About ${model.name}`}
                            className="w-4 h-4 rounded-full bg-gray-100 text-gray-400 text-[9px] font-bold flex-shrink-0 flex items-center justify-center hover:bg-primary-100 hover:text-primary-700 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 transition-colors mt-0.5 cursor-help"
                          >
                            i
                          </button>
                        </Tooltip>
                      </div>
                    </td>

                    {/* Region pill */}
                    <td className="px-3 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${REGION_PILL[model.region]}`}
                      >
                        {REGION_ABBR[model.region]}
                      </span>
                    </td>

                    {/* Aggregate score + grade */}
                    <td className="px-3 py-3.5 whitespace-nowrap">
                      <GradeBadge score={model.agg} />
                    </td>

                    {/* Individual metric scores */}
                    {METRICS.map((m) => (
                      <td key={m.key} className="px-3 py-3.5">
                        <ScoreBar score={model.scores[m.key]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Grade legend ── */}
          <div className="mt-6 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3 text-xs text-gray-500">
              <span className="font-semibold text-gray-600 mr-1">Grade:</span>
              {(['A', 'B', 'C', 'D'] as const).map((g) => {
                const labels: Record<string, string> = {
                  A: 'A — Excellent (≥80)',
                  B: 'B — Good (65–79)',
                  C: 'C — Fair (50–64)',
                  D: 'D — Poor (<50)',
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
            <p className="text-xs text-gray-400">
              Scores out of 100. Click column headers to sort.
            </p>
          </div>
        </div>
      </section>

      {/* ── Methodology note ── */}
      <section className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl">
            <h2 className="text-lg font-bold text-gray-900 mb-3">About This Index</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              The EuroSafeAI Alignment Index evaluates frontier AI models across four independent
              dimensions derived from EU AI Act requirements, European Court of Human Rights
              jurisprudence, and EuroSafeAI&apos;s internal red-teaming protocols. Each dimension is
              scored 0–100 and aggregated with equal weighting into an overall grade.
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              These results represent preliminary research findings. Scores will be revised as
              evaluation methodology is peer-reviewed and additional model versions are assessed.
              Regional categorization reflects primary corporate headquarters.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
