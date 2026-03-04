'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ComposableMap, Geographies, Geography } from '@vnedyalk0v/react19-simple-maps'
import { scaleLinear } from 'd3-scale'
import {
  interpolateRdYlGn,
  interpolateYlGnBu,
  interpolatePuBuGn,
} from 'd3-scale-chromatic'
import { motion, useReducedMotion } from 'motion/react'
import { METRICS, COUNTRIES, COUNTRY_BY_ISO, type MapMetric } from '@/data/europe-countries'

// ─── Constants ────────────────────────────────────────────────────────────────

const INTERPOLATORS: Record<MapMetric['colorScale'], (t: number) => string> = {
  RdYlGn: interpolateRdYlGn,
  YlGnBu: interpolateYlGnBu,
  PuBuGn: interpolatePuBuGn,
}

// Countries with data — keyed by isoNumeric for O(1) lookup
const COUNTRY_SET = new Set(COUNTRIES.map((c) => c.isoNumeric))

// ─── Color helpers ────────────────────────────────────────────────────────────

function getColor(score: number | undefined, metric: MapMetric): string {
  if (score === undefined) return '#e5e7eb' // gray-200 — European, no data
  const interpolate = INTERPOLATORS[metric.colorScale]
  const scale = scaleLinear<number>().domain([0, 1]).range([0, 1]).clamp(true)
  return interpolate(scale(score))
}

// ─── Tooltip portal ───────────────────────────────────────────────────────────

interface TooltipState {
  x: number
  y: number
  isoNumeric: string
}

function CountryTooltip({
  tip,
  activeMetric,
  onClose,
}: {
  tip: TooltipState
  activeMetric: MapMetric
  onClose: () => void
}) {
  const country = COUNTRY_BY_ISO[tip.isoNumeric]
  if (!country) return null

  const TIP_W = 240
  const left = Math.max(8, Math.min(tip.x - TIP_W / 2, window.innerWidth - TIP_W - 8))
  const above = tip.y - 16

  return createPortal(
    <div
      role="tooltip"
      style={{
        position: 'fixed',
        top: above,
        left,
        width: TIP_W,
        transform: 'translateY(-100%)',
        zIndex: 9999,
        paddingBottom: 10,
        pointerEvents: 'none',
      }}
    >
      <div className="rounded-xl bg-gray-950 border border-gray-800 px-4 py-3 shadow-2xl">
        {/* Country name */}
        <p className="text-sm font-bold text-white mb-2.5">{country.name}</p>

        {/* All metric scores */}
        <div className="space-y-1.5">
          {METRICS.map((m) => {
            const score = country.scores[m.key]
            const interpolate = INTERPOLATORS[m.colorScale]
            const color = score !== undefined ? interpolate(score) : '#6b7280'
            const pct = score !== undefined ? Math.round(score * 100) : null
            const isActive = m.key === activeMetric.key

            return (
              <div key={m.key} className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: color }}
                />
                <span
                  className={`text-[11px] flex-1 ${
                    isActive ? 'text-white font-semibold' : 'text-gray-400'
                  }`}
                >
                  {m.label}
                </span>
                <span
                  className={`text-[11px] font-mono tabular-nums ${
                    isActive ? 'text-white font-semibold' : 'text-gray-400'
                  }`}
                >
                  {pct !== null ? `${pct}` : '—'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
      {/* Arrow */}
      <div
        style={{ left: tip.x - left }}
        className="absolute top-full -translate-x-1/2 w-0 h-0 border-x-[5px] border-x-transparent border-t-[5px] border-t-gray-950"
      />
    </div>,
    document.body
  )
}

// ─── Color legend ─────────────────────────────────────────────────────────────

function ColorLegend({ metric }: { metric: MapMetric }) {
  const interpolate = INTERPOLATORS[metric.colorScale]
  const ticks = [0, 0.25, 0.5, 0.75, 1.0]

  // Build gradient stops
  const stops = Array.from({ length: 11 }, (_, i) => {
    const t = i / 10
    return `${interpolate(t)} ${t * 100}%`
  }).join(', ')

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] text-gray-500 font-jost">{metric.lowLabel}</span>
        <span className="text-[11px] text-gray-500 font-jost">{metric.highLabel}</span>
      </div>
      <div
        className="h-3 rounded-full w-full"
        style={{ background: `linear-gradient(to right, ${stops})` }}
      />
      <div className="flex justify-between mt-1">
        {ticks.map((t) => (
          <span key={t} className="text-[10px] text-gray-400 font-mono">
            {Math.round(t * 100)}
          </span>
        ))}
      </div>
      {/* No-data swatch */}
      <div className="flex items-center gap-2 mt-2.5">
        <span className="w-4 h-3 rounded-sm bg-gray-200 border border-gray-300 flex-shrink-0" />
        <span className="text-[11px] text-gray-400 font-jost">No data available</span>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function EuropeMapClient() {
  const [activeMetricKey, setActiveMetricKey] = useState(METRICS[0].key)
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const [hoveredIso, setHoveredIso] = useState<string | null>(null)
const [mounted, setMounted] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [topology, setTopology] = useState<any>(null)
  const reduced = useReducedMotion() ?? false

  useEffect(() => {
    setMounted(true)
    fetch('/data/europe-50m.json')
      .then((r) => r.json())
      .then(setTopology)
      .catch((err) => console.error('Failed to load map data', err))
  }, [])

  const activeMetric = METRICS.find((m) => m.key === activeMetricKey) ?? METRICS[0]

  const hoveredIsoRef = useRef<string | null>(null)

  // Close tooltip on tap-away (mobile)
  const handleMapClick = useCallback(
    (e: React.MouseEvent<SVGElement>) => {
      const target = e.target as SVGElement
      if (!target.closest('[data-country]')) {
        setTooltip(null)
        setHoveredIso(null)
      }
    },
    []
  )

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
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
            European AI &amp; Democracy
            <br />
            <span className="text-primary-600 italic">Atlas</span>
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl leading-relaxed mb-6 font-jost"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            An interactive map showing European countries color-coded by democracy level,
            AI readiness, and AI regulatory strength. Hover a country to explore its scores.
          </motion.p>
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
              <strong className="font-semibold">Placeholder data.</strong>{' '}
              Scores are indicative and will be replaced with peer-reviewed data.{' '}
              <span className="text-amber-600">Last updated: Q1&nbsp;2026.</span>
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── Map + Controls ────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* ── Map ──────────────────────────────────────────────────────── */}
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {!topology && (
                  <div className="flex items-center justify-center h-96 text-gray-400 font-jost text-sm">
                    Loading map…
                  </div>
                )}
                {topology && (
                  // onMouseLeave on the container is the only place we close the tooltip —
                  // individual country leave events are unreliable between adjacent paths
                  <div
                    onMouseLeave={() => {
                      hoveredIsoRef.current = null
                      setTooltip(null)
                      setHoveredIso(null)
                    }}
                  >
                    <ComposableMap
                      projection="geoAzimuthalEqualArea"
                      projectionConfig={{
                        rotate: [-15, -52, 0] as [number, number, number] & { __brand: 'rotationAngles' },
                        scale: 680,
                      }}
                      width={800}
                      height={560}
                      style={{ width: '100%', height: 'auto' }}
                      onClick={handleMapClick}
                    >
                      <Geographies geography={topology}>
                        {({ geographies }) =>
                          geographies.map((geo) => {
                            const iso = String(geo.id)
                            const country = COUNTRY_BY_ISO[iso]
                            const score = country?.scores[activeMetricKey]
                            const isEuropean = COUNTRY_SET.has(iso)
                            const isHovered = hoveredIso === iso

                            let fill: string
                            if (!isEuropean) {
                              fill = '#f3f4f6' // gray-100 — non-European
                            } else if (score === undefined) {
                              fill = '#e5e7eb' // gray-200 — no data
                            } else {
                              fill = getColor(score, activeMetric)
                            }

                            return (
                              <Geography
                                key={String(geo.id)}
                                geography={geo}
                                data-country="1"
                                fill={fill}
                                stroke={isHovered ? '#1a7fc4' : '#ffffff'}
                                strokeWidth={isHovered ? 1.5 : 0.5}
                                style={{
                                  default: { outline: 'none', cursor: isEuropean ? 'pointer' : 'default' },
                                  hover:   { outline: 'none' },
                                  pressed: { outline: 'none' },
                                }}
                                onMouseEnter={(e) => {
                                  if (!isEuropean) return
                                  hoveredIsoRef.current = iso
                                  setHoveredIso(iso)
                                  setTooltip({ x: e.clientX, y: e.clientY, isoNumeric: iso })
                                }}
                                onMouseMove={(e) => {
                                  if (!isEuropean) return
                                  hoveredIsoRef.current = iso
                                  setHoveredIso(iso)
                                  setTooltip({ x: e.clientX, y: e.clientY, isoNumeric: iso })
                                }}
                                onTouchStart={(e) => {
                                  if (!isEuropean) return
                                  const touch = e.touches[0]
                                  setHoveredIso(iso)
                                  setTooltip({ x: touch.clientX, y: touch.clientY, isoNumeric: iso })
                                }}
                              />
                            )
                          })
                        }
                      </Geographies>
                    </ComposableMap>
                  </div>
                )}
              </div>
            </div>

            {/* ── Sidebar: controls + legend ────────────────────────────────── */}
            <div className="lg:w-72 flex flex-col gap-6">

              {/* Metric selector */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3 font-jost">
                  Select Metric
                </p>
                <div className="flex flex-col gap-2" role="group" aria-label="Select map metric">
                  {METRICS.map((m) => (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setActiveMetricKey(m.key)}
                      aria-pressed={activeMetricKey === m.key}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 font-jost active:scale-[0.98] ${
                        activeMetricKey === m.key
                          ? 'bg-primary-600 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1 font-jost">
                  Legend
                </p>
                <p className="text-xs text-gray-500 font-jost mb-3 leading-relaxed">
                  {activeMetric.description}
                </p>
                <ColorLegend metric={activeMetric} />
              </div>

              {/* Country count */}
              <p className="text-xs text-gray-400 font-jost text-center">
                {COUNTRIES.length} European countries · Hover to explore
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Methodology note ──────────────────────────────────────────────── */}
      <section className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-3">About This Atlas</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4 font-jost">
              The EuroSafeAI Atlas visualises country-level indicators relevant to AI safety and
              democratic resilience across Europe. Democracy scores draw on established political
              science indices; AI readiness and regulation scores reflect governmental capacity and
              governance frameworks. All scores will be replaced by peer-reviewed data as research matures.
            </p>
            <p className="text-sm text-gray-500 leading-relaxed font-jost">
              Full methodology and data sources will be published alongside forthcoming working papers.
            </p>
          </div>
        </div>
      </section>

      {/* Portal tooltip */}
      {mounted && tooltip && (
        <CountryTooltip
          tip={tooltip}
          activeMetric={activeMetric}
          onClose={() => { setTooltip(null); setHoveredIso(null) }}
        />
      )}
    </div>
  )
}
