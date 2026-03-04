// ─── Types ────────────────────────────────────────────────────────────────────

export interface MapMetric {
  key: string
  label: string
  description: string
  lowLabel: string
  highLabel: string
  /** d3-scale-chromatic interpolator to use */
  colorScale: 'RdYlGn' | 'YlGnBu' | 'PuBuGn'
}

export interface CountryData {
  /** Matches TopoJSON feature numeric IDs */
  isoNumeric: string
  isoAlpha3: string
  name: string
  /** 0..1 score per metric key */
  scores: Record<string, number>
}

// ─── Metric definitions ───────────────────────────────────────────────────────

export const METRICS: MapMetric[] = [
  {
    key: 'democracy',
    label: 'Democracy Level',
    description: 'Based on V-Dem electoral democracy index (2023 data). Reflects free elections, political pluralism, and civil liberties.',
    lowLabel: 'Autocracy',
    highLabel: 'Full Democracy',
    colorScale: 'RdYlGn',
  },
  {
    key: 'ai_readiness',
    label: 'AI Readiness',
    description: 'Government AI readiness index reflecting infrastructure, data availability, and institutional capacity to adopt AI.',
    lowLabel: 'Low Readiness',
    highLabel: 'High Readiness',
    colorScale: 'YlGnBu',
  },
  {
    key: 'ai_regulation',
    label: 'AI Regulation',
    description: 'Strength and comprehensiveness of national AI governance frameworks and regulatory readiness.',
    lowLabel: 'Weak Governance',
    highLabel: 'Strong Governance',
    colorScale: 'PuBuGn',
  },
]

// ─── Country data ─────────────────────────────────────────────────────────────
// Scores are 0..1 — placeholder values, to be replaced with real data.
// isoNumeric matches the `id` field in the world-atlas 50m TopoJSON.

export const COUNTRIES: CountryData[] = [
  { isoNumeric: '8',   isoAlpha3: 'ALB', name: 'Albania',                scores: { democracy: 0.54, ai_readiness: 0.38, ai_regulation: 0.30 } },
  { isoNumeric: '20',  isoAlpha3: 'AND', name: 'Andorra',                scores: { democracy: 0.82, ai_readiness: 0.55, ai_regulation: 0.50 } },
  { isoNumeric: '40',  isoAlpha3: 'AUT', name: 'Austria',                scores: { democracy: 0.87, ai_readiness: 0.73, ai_regulation: 0.78 } },
  { isoNumeric: '112', isoAlpha3: 'BLR', name: 'Belarus',                scores: { democracy: 0.07, ai_readiness: 0.40, ai_regulation: 0.15 } },
  { isoNumeric: '56',  isoAlpha3: 'BEL', name: 'Belgium',                scores: { democracy: 0.86, ai_readiness: 0.76, ai_regulation: 0.80 } },
  { isoNumeric: '70',  isoAlpha3: 'BIH', name: 'Bosnia & Herzegovina',   scores: { democracy: 0.47, ai_readiness: 0.36, ai_regulation: 0.28 } },
  { isoNumeric: '100', isoAlpha3: 'BGR', name: 'Bulgaria',               scores: { democracy: 0.70, ai_readiness: 0.55, ai_regulation: 0.62 } },
  { isoNumeric: '191', isoAlpha3: 'HRV', name: 'Croatia',                scores: { democracy: 0.76, ai_readiness: 0.59, ai_regulation: 0.65 } },
  { isoNumeric: '196', isoAlpha3: 'CYP', name: 'Cyprus',                 scores: { democracy: 0.78, ai_readiness: 0.60, ai_regulation: 0.64 } },
  { isoNumeric: '203', isoAlpha3: 'CZE', name: 'Czechia',                scores: { democracy: 0.82, ai_readiness: 0.68, ai_regulation: 0.70 } },
  { isoNumeric: '208', isoAlpha3: 'DNK', name: 'Denmark',                scores: { democracy: 0.93, ai_readiness: 0.87, ai_regulation: 0.86 } },
  { isoNumeric: '233', isoAlpha3: 'EST', name: 'Estonia',                scores: { democracy: 0.89, ai_readiness: 0.84, ai_regulation: 0.82 } },
  { isoNumeric: '246', isoAlpha3: 'FIN', name: 'Finland',                scores: { democracy: 0.94, ai_readiness: 0.86, ai_regulation: 0.85 } },
  { isoNumeric: '250', isoAlpha3: 'FRA', name: 'France',                 scores: { democracy: 0.84, ai_readiness: 0.80, ai_regulation: 0.83 } },
  { isoNumeric: '276', isoAlpha3: 'DEU', name: 'Germany',                scores: { democracy: 0.89, ai_readiness: 0.81, ai_regulation: 0.85 } },
  { isoNumeric: '300', isoAlpha3: 'GRC', name: 'Greece',                 scores: { democracy: 0.75, ai_readiness: 0.58, ai_regulation: 0.65 } },
  { isoNumeric: '348', isoAlpha3: 'HUN', name: 'Hungary',                scores: { democracy: 0.48, ai_readiness: 0.57, ai_regulation: 0.55 } },
  { isoNumeric: '352', isoAlpha3: 'ISL', name: 'Iceland',                scores: { democracy: 0.95, ai_readiness: 0.82, ai_regulation: 0.80 } },
  { isoNumeric: '372', isoAlpha3: 'IRL', name: 'Ireland',                scores: { democracy: 0.90, ai_readiness: 0.79, ai_regulation: 0.78 } },
  { isoNumeric: '380', isoAlpha3: 'ITA', name: 'Italy',                  scores: { democracy: 0.80, ai_readiness: 0.68, ai_regulation: 0.72 } },
  { isoNumeric: '383', isoAlpha3: 'XKX', name: 'Kosovo',                 scores: { democracy: 0.52, ai_readiness: 0.30, ai_regulation: 0.25 } },
  { isoNumeric: '428', isoAlpha3: 'LVA', name: 'Latvia',                 scores: { democracy: 0.85, ai_readiness: 0.72, ai_regulation: 0.74 } },
  { isoNumeric: '438', isoAlpha3: 'LIE', name: 'Liechtenstein',          scores: { democracy: 0.84, ai_readiness: 0.65, ai_regulation: 0.60 } },
  { isoNumeric: '440', isoAlpha3: 'LTU', name: 'Lithuania',              scores: { democracy: 0.86, ai_readiness: 0.73, ai_regulation: 0.74 } },
  { isoNumeric: '442', isoAlpha3: 'LUX', name: 'Luxembourg',             scores: { democracy: 0.88, ai_readiness: 0.80, ai_regulation: 0.82 } },
  { isoNumeric: '470', isoAlpha3: 'MLT', name: 'Malta',                  scores: { democracy: 0.81, ai_readiness: 0.65, ai_regulation: 0.68 } },
  { isoNumeric: '498', isoAlpha3: 'MDA', name: 'Moldova',                scores: { democracy: 0.57, ai_readiness: 0.33, ai_regulation: 0.28 } },
  { isoNumeric: '492', isoAlpha3: 'MCO', name: 'Monaco',                 scores: { democracy: 0.70, ai_readiness: 0.60, ai_regulation: 0.55 } },
  { isoNumeric: '499', isoAlpha3: 'MNE', name: 'Montenegro',             scores: { democracy: 0.60, ai_readiness: 0.40, ai_regulation: 0.38 } },
  { isoNumeric: '528', isoAlpha3: 'NLD', name: 'Netherlands',            scores: { democracy: 0.91, ai_readiness: 0.85, ai_regulation: 0.87 } },
  { isoNumeric: '807', isoAlpha3: 'MKD', name: 'North Macedonia',        scores: { democracy: 0.58, ai_readiness: 0.37, ai_regulation: 0.33 } },
  { isoNumeric: '578', isoAlpha3: 'NOR', name: 'Norway',                 scores: { democracy: 0.95, ai_readiness: 0.88, ai_regulation: 0.84 } },
  { isoNumeric: '616', isoAlpha3: 'POL', name: 'Poland',                 scores: { democracy: 0.72, ai_readiness: 0.64, ai_regulation: 0.68 } },
  { isoNumeric: '620', isoAlpha3: 'PRT', name: 'Portugal',               scores: { democracy: 0.87, ai_readiness: 0.69, ai_regulation: 0.72 } },
  { isoNumeric: '642', isoAlpha3: 'ROU', name: 'Romania',                scores: { democracy: 0.72, ai_readiness: 0.54, ai_regulation: 0.60 } },
  { isoNumeric: '643', isoAlpha3: 'RUS', name: 'Russia',                 scores: { democracy: 0.10, ai_readiness: 0.52, ai_regulation: 0.20 } },
  { isoNumeric: '674', isoAlpha3: 'SMR', name: 'San Marino',             scores: { democracy: 0.85, ai_readiness: 0.55, ai_regulation: 0.50 } },
  { isoNumeric: '688', isoAlpha3: 'SRB', name: 'Serbia',                 scores: { democracy: 0.53, ai_readiness: 0.42, ai_regulation: 0.38 } },
  { isoNumeric: '703', isoAlpha3: 'SVK', name: 'Slovakia',               scores: { democracy: 0.76, ai_readiness: 0.60, ai_regulation: 0.63 } },
  { isoNumeric: '705', isoAlpha3: 'SVN', name: 'Slovenia',               scores: { democracy: 0.82, ai_readiness: 0.65, ai_regulation: 0.68 } },
  { isoNumeric: '724', isoAlpha3: 'ESP', name: 'Spain',                  scores: { democracy: 0.84, ai_readiness: 0.72, ai_regulation: 0.75 } },
  { isoNumeric: '752', isoAlpha3: 'SWE', name: 'Sweden',                 scores: { democracy: 0.93, ai_readiness: 0.87, ai_regulation: 0.86 } },
  { isoNumeric: '756', isoAlpha3: 'CHE', name: 'Switzerland',            scores: { democracy: 0.92, ai_readiness: 0.84, ai_regulation: 0.80 } },
  { isoNumeric: '792', isoAlpha3: 'TUR', name: 'Turkey',                 scores: { democracy: 0.28, ai_readiness: 0.55, ai_regulation: 0.35 } },
  { isoNumeric: '804', isoAlpha3: 'UKR', name: 'Ukraine',                scores: { democracy: 0.55, ai_readiness: 0.45, ai_regulation: 0.40 } },
  { isoNumeric: '826', isoAlpha3: 'GBR', name: 'United Kingdom',         scores: { democracy: 0.88, ai_readiness: 0.84, ai_regulation: 0.82 } },
  { isoNumeric: '336', isoAlpha3: 'VAT', name: 'Vatican City',           scores: { democracy: 0.40, ai_readiness: 0.30, ai_regulation: 0.25 } },
]

// Fast lookup by isoNumeric string
export const COUNTRY_BY_ISO: Record<string, CountryData> = Object.fromEntries(
  COUNTRIES.map((c) => [c.isoNumeric, c])
)
