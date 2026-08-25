import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import modelsData from "@/data/models.json";
import { GRADES, GRADE_BAND, coverageFraction, grade, gpa, type Coverage } from "@/lib/scoring";
import {
  BENCHMARK_LABELS,
  RISK_DESCRIPTIONS,
  RISK_LABELS,
  buildColumns,
  buildRows,
  judgeRowKind,
  judgeRowLabel,
  modelCoverage,
  modelScore,
  overallCoverage,
  overallScore,
  providerCoverage,
  providerScore,
  type Row,
} from "@/lib/leaderboard";
import type { ModelEntry } from "@/data/models.types";

const ACCENT = "#003399";
const INK = "#0a1f4d";

const MODELS = modelsData as unknown as ModelEntry[];

const ROW_HEIGHT = { risk: 58, bench: 44, judge: 38 } as const;
const INDENT = { risk: 0, bench: 18, judge: 36 } as const;
const HEADER_SCORE_HEIGHT = 40;
const HEADER_LOGO = 20;

/**
 * Shared easing/duration so the vertical row reveals (framer-motion) and the
 * horizontal column expansion (CSS) move on the same curve.
 */
const EXPAND_DURATION = 0.32;
const EXPAND_CSS_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

/**
 * Column-group geometry, shared by the header and every body row so the two
 * stay in exact horizontal register. Any padding here would offset the header's
 * columns from the cells beneath them, so spacing lives on the cells instead.
 *
 * The whole subtree's expansion is driven by one inherited custom property,
 * `--member-open` (registered with `@property` in index.css so the browser
 * interpolates it as a number instead of jumping). This group sets it to 0 or
 * 1 and transitions it; every member column beneath just reads it — so a row
 * with many members animates one property instead of a flex-grow/flex-basis
 * pair per element, and the layout no longer re-solves flex sizes each frame.
 */
export function columnGroupStyle(
  leaves: number,
  cellWidth: number,
  open: boolean,
  reduced: boolean
): React.CSSProperties {
  const members = leaves - 1;
  return {
    flexShrink: 0,
    width: `calc(${cellWidth}px * (1 + ${members} * var(--member-open, 0)))`,
    minWidth: 0,
    display: "flex",
    overflow: "hidden",
    borderLeft: open ? "1px solid rgba(10,31,77,0.08)" : undefined,
    ["--member-open" as string]: open ? 1 : 0,
    transition: reduced ? undefined : `--member-open ${EXPAND_DURATION}s ${EXPAND_CSS_EASE}`,
  };
}

/**
 * A member column inside a provider group. Always rendered, at zero width when
 * the provider is collapsed — a freshly mounted element has no previous value
 * to transition from, so keeping it mounted is what lets it slide.
 *
 * Width and opacity both read the group's inherited `--member-open` directly,
 * so nothing here declares its own transition: the group's single animated
 * property is what moves, and every member follows it in lockstep. The group
 * width grows as cellWidth × (1 + n·t) while each member's width is t·cellWidth;
 * since Cell and HeaderCell roots hold `flex: "1 0 0"`, the provider's own
 * cell takes the remainder, cellWidth·(1 + n·t) − n·t·cellWidth = cellWidth,
 * unchanged for every t. Members appear to slide out from behind it rather
 * than everything compressing and re-expanding.
 */
export function memberColumnStyle(open: boolean, reduced: boolean): React.CSSProperties {
  return {
    flexShrink: 0,
    width: `calc(var(--member-open, 0) * var(--cell-width))`,
    minWidth: 0,
    display: "flex",
    overflow: "hidden",
    opacity: `var(--member-open, 0)`,
  };
}

const DIAGNOSTIC_NOTE =
  "Diagnostic benchmark: reported for transparency but excluded from the aggregates above, because its score does not mean what a safety score means.";

const FLOOR_NOTE =
  "Optimistic bound: this benchmark's score recomputed with every unscored sample counted as safe. The headline above drops those samples instead. The two bracket the truth — a response the provider's filter blocked outright is arguably the safest outcome, but the pipeline cannot grade what it never saw.";

const OVERALL_NOTE =
  "Overall: the mean of the four systemic-risk scores below, as the evaluation pipeline computes it.";

/**
 * Heat colour for a 0–100 score: red at the bottom, amber in the middle, green
 * at the top, interpolated in HSL. Text flips between ink and white on relative
 * luminance so every cell stays readable — the amber midrange fails against
 * white, the deep green fails against ink.
 */
const HEAT_STOPS: [number, [number, number, number]][] = [
  [0, [2, 52, 57]],
  [50, [42, 62, 63]],
  [100, [150, 38, 45]],
];

function heatColor(score: number): { background: string; color: string } {
  const upper = HEAT_STOPS.findIndex(([at]) => score <= at);
  const [fromAt, from] = HEAT_STOPS[Math.max(0, upper - 1)];
  const [toAt, to] = HEAT_STOPS[Math.max(0, upper)];
  const t = toAt === fromAt ? 0 : (score - fromAt) / (toAt - fromAt);
  const [h, s, l] = from.map((v, i) => v + (to[i] - v) * t) as [number, number, number];
  const [r, g, b] = hslToRgb(h, s / 100, l / 100);
  const luminance = (0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b));
  return {
    background: `hsl(${h.toFixed(1)} ${s.toFixed(1)}% ${l.toFixed(1)}%)`,
    color: luminance > 0.35 ? INK : "#ffffff",
  };
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return [r + m, g + m, b + m];
}

const srgb = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);

const SectionEyebrow = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "0.9rem", marginBottom: "1.4rem" }}>
    <span style={{ width: "36px", height: "2px", background: "#0a2a66" }} />
    <span
      style={{
        fontSize: "0.72rem",
        fontWeight: 700,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "#0a2a66",
      }}
    >
      {children}
    </span>
  </div>
);

const Chevron = ({ open, color }: { open: boolean; color: string }) => (
  <svg
    width={11}
    height={11}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    aria-hidden="true"
    style={{
      flexShrink: 0,
      transform: open ? "rotate(90deg)" : "none",
      transition: "transform 0.2s ease",
    }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
  </svg>
);

/**
 * Keyed on the `company` string the pipeline writes. Spellings have shifted
 * across runs ("Mistral AI" → "Mistral", "Zhipu AI" → "Z.ai"), so both are
 * kept — a miss costs only the logo, and the provider name still renders.
 */
const COMPANY_LOGO: Record<string, string> = {
  "OpenAI": "/logos/openai.svg",
  "Google": "/logos/google.svg",
  "Google DeepMind": "/logos/deepmind.svg",
  "Anthropic": "/logos/anthropic.svg",
  "Meta": "/logos/meta.svg",
  "xAI": "/logos/xai.png",
  "Alibaba": "/logos/qwen.svg",
  "Alibaba (Qwen)": "/logos/qwen.svg",
  "DeepSeek": "/logos/deepseek.svg",
  "Moonshot AI": "/logos/kimi.png",
  "Z.ai": "/logos/zhipu.svg",
  "Zhipu AI": "/logos/zhipu.svg",
  "MiniMax / Xiaomi": "/logos/minimax.png",
  "Mistral": "/logos/mistral.png",
  "Mistral AI": "/logos/mistral.png",
  "Microsoft": "/logos/microsoft.png",
};

/**
 * Coverage below this reads as a caveat on the grade rather than noise, so the
 * cell grows an under-bar showing how much of the suite actually got scored.
 * Most cells sit at or near 100%; the ones that don't are concentrated in a few
 * model × benchmark pairs where the judges abstained heavily.
 */
const COVERAGE_FLAG = 0.95;

const CoverageBar = ({ fraction, onDark }: { fraction: number; onDark: boolean }) => (
  <span
    aria-hidden="true"
    style={{
      position: "absolute",
      left: 4,
      right: 4,
      bottom: 3,
      height: 2,
      borderRadius: 2,
      background: onDark ? "rgba(255,255,255,0.25)" : "rgba(10,31,77,0.15)",
      overflow: "hidden",
    }}
  >
    <span
      style={{
        display: "block",
        width: `${Math.max(2, fraction * 100)}%`,
        height: "100%",
        borderRadius: 2,
        background: onDark ? "rgba(255,255,255,0.85)" : "rgba(10,31,77,0.55)",
      }}
    />
  </span>
);

const Cell = ({
  score,
  meanScore,
  coverage,
  label,
  muted,
  height,
}: {
  score: number | undefined;
  /** The same cell pooled without the per-sample minimum; absent on judge rows. */
  meanScore: number | undefined;
  coverage: number | undefined;
  label: string;
  muted: boolean;
  height: number;
}) => {
  const heat = score === undefined ? undefined : heatColor(score);
  const onDark = heat?.color === "#ffffff";
  // No score means nothing to caveat — an em-dash cell must not advertise coverage.
  const flagged = score !== undefined && coverage !== undefined && coverage < COVERAGE_FLAG;
  return (
    <div
      role="gridcell"
      aria-label={label}
      title={label}
      style={{
        position: "relative",
        flex: "1 0 0",
        minWidth: 0,
        height: height - 4,
        margin: 2,
        borderRadius: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        paddingBottom: flagged ? 4 : 0,
        background: score === undefined ? "#f3f4f6" : muted ? "#e5e7eb" : heat!.background,
        color: score === undefined || muted ? "#9ca3af" : heat!.color,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.01em", lineHeight: 1 }}>
        {score === undefined ? "—" : grade(score)}
      </span>
      {score !== undefined && (
        <span style={{ fontSize: 10, fontWeight: 600, lineHeight: 1, whiteSpace: "nowrap" }}>
          {score.toFixed(1)}
          {meanScore !== undefined && (
            <span style={{ opacity: 0.62, fontWeight: 500 }}> · {meanScore.toFixed(1)}</span>
          )}
        </span>
      )}
      {flagged && <CoverageBar fraction={coverage} onDark={onDark} />}
    </div>
  );
};

/**
 * One column heading: the provider or model name with its Overall score beneath.
 * The score reuses `Cell` so a heading reads on exactly the same scale as the
 * grid under it — same bands, same colours, same coverage bar.
 */
const HeaderCell = ({
  logo,
  name,
  subject,
  models,
  emphasis = false,
  open,
  onToggle,
  toggleTitle,
}: {
  logo?: string;
  name: string;
  subject: string;
  models: ModelEntry[];
  emphasis?: boolean;
  open?: boolean;
  onToggle?: () => void;
  toggleTitle?: string;
}) => {
  const score = overallScore(models);
  const meanScore = overallScore(models, "mean");
  const cov = overallCoverage(models);

  const label = (
    <>
      {logo && (
        <img
          src={logo}
          alt=""
          loading="lazy"
          style={{ width: HEADER_LOGO, height: HEADER_LOGO, objectFit: "contain", flexShrink: 0 }}
        />
      )}
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
          maxWidth: "100%",
          fontSize: emphasis ? 12 : 10,
          fontWeight: emphasis ? 700 : 500,
          lineHeight: 1.25,
          color: emphasis ? INK : "#6b7280",
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</span>
        {onToggle && <Chevron open={open ?? false} color="#9ca3af" />}
      </span>
    </>
  );

  const stack: React.CSSProperties = {
    flex: "1 0 0",
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 3,
  };

  return (
    <div style={stack}>
      {onToggle ? (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          title={toggleTitle}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            background: "transparent",
            border: 0,
            padding: "0.15rem",
            cursor: "pointer",
            font: "inherit",
          }}
        >
          {label}
        </button>
      ) : (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "0.15rem" }} title={name}>
          {label}
        </div>
      )}
      <div style={{ width: "100%", display: "flex" }}>
        <Cell
          score={score}
          meanScore={meanScore}
          coverage={cov && coverageFraction(cov)}
          muted={false}
          height={HEADER_SCORE_HEIGHT}
          label={`Overall, ${subject}: ${
            score === undefined
              ? "no score"
              : `${grade(score)}, worst case ${score.toFixed(1)} out of 100, mean ${meanScore?.toFixed(1)}`
          }`}
        />
      </div>
    </div>
  );
};

const CertificatePage = () => {
  const [expandedRisks, setExpandedRisks] = useState<ReadonlySet<string>>(new Set());
  const [expandedBenches, setExpandedBenches] = useState<ReadonlySet<string>>(new Set());
  const [expandedProviders, setExpandedProviders] = useState<ReadonlySet<string>>(new Set());
  const reduced = useReducedMotion() ?? false;
  const isMobile = useIsMobile();

  const columns = useMemo(() => buildColumns(MODELS), []);
  const rows = useMemo(
    () => buildRows(MODELS, expandedRisks, expandedBenches),
    [expandedRisks, expandedBenches]
  );

  // Scores don't depend on which provider is expanded, only on the row/column
  // set, so this must not key off expandedProviders: keying off it would
  // re-walk the whole score tree on every toggle, right before the
  // expand/collapse animation's first frame.
  const cellValues = useMemo(() => {
    const byRow = new Map<string, {
      provider: Map<string, { score?: number; mean?: number; coverage?: Coverage }>;
      model: Map<string, { score?: number; mean?: number; coverage?: Coverage }>;
    }>();
    for (const row of rows) {
      const provider = new Map<string, { score?: number; mean?: number; coverage?: Coverage }>();
      const model = new Map<string, { score?: number; mean?: number; coverage?: Coverage }>();
      for (const column of columns) {
        provider.set(column.provider, {
          score: providerScore(column.models, row),
          mean: providerScore(column.models, row, "mean"),
          coverage: providerCoverage(column.models, row),
        });
        for (const entry of column.models) {
          model.set(entry.id, {
            score: modelScore(entry, row),
            mean: modelScore(entry, row, "mean"),
            coverage: modelCoverage(entry, row),
          });
        }
      }
      byRow.set(row.key, { provider, model });
    }
    return byRow;
  }, [rows, columns]);

  const labelWidth = isMobile ? 168 : 250;
  const cellWidth = isMobile ? 74 : 88;
  // An expanded provider keeps its own pooled column and grows its models to the
  // right of it, so nothing shifts under the cursor and a provider can be read
  // against its own members.
  const leafCount = (provider: string, models: ModelEntry[]) =>
    expandedProviders.has(provider) ? models.length + 1 : 1;
  const totalLeaves = columns.reduce((n, c) => n + leafCount(c.provider, c.models), 0);

  const toggle = (set: ReadonlySet<string>, key: string): ReadonlySet<string> => {
    const next = new Set(set);
    if (!next.delete(key)) next.add(key);
    return next;
  };

  const rowLabel = (row: Row) => {
    if (row.level === "risk") return RISK_LABELS[row.risk];
    if (row.level === "bench") return BENCHMARK_LABELS[row.bench] ?? row.bench;
    return judgeRowLabel(row);
  };

  /** Diagnostic rows are greyed: their numbers aren't safety grades. */
  const isMutedRow = (row: Row) =>
    (row.level === "bench" || row.level === "judge") && row.diagnostic;

  const cellLabel = (
    row: Row,
    subject: string,
    score: number | undefined,
    meanScore: number | undefined,
    coverage: Coverage | undefined
  ) => {
    const where = `${rowLabel(row)}, ${subject}`;
    if (score === undefined) return `${where}: no score`;

    const parts: string[] = [];
    if (row.level === "judge" && row.floor) {
      parts.push(`${grade(score)}, ${score.toFixed(1)} out of 100 with unscored samples counted safe`);
      if (meanScore !== undefined) parts.push(`mean ${meanScore.toFixed(1)}`);
    } else {
      parts.push(`${grade(score)}, worst case ${score.toFixed(1)} out of 100`);
      if (meanScore !== undefined) parts.push(`mean ${meanScore.toFixed(1)}`);
    }
    if (coverage && coverage.total > 0) {
      parts.push(
        `coverage ${Math.round(100 * coverageFraction(coverage))}% (${coverage.scored} of ${coverage.total} samples scored)`
      );
    }
    return `${where}: ${parts.join(", ")}`;
  };

  const isExpandable = (row: Row) => row.level === "risk" || row.level === "bench";
  const isOpen = (row: Row) =>
    row.level === "risk" ? expandedRisks.has(row.key) : expandedBenches.has(row.key);

  const onRowToggle = (row: Row) => {
    if (row.level === "risk") setExpandedRisks((s) => toggle(s, row.key));
    else if (row.level === "bench") setExpandedBenches((s) => toggle(s, row.key));
  };

  const rowLabelCell = (row: Row) => {
    const height = ROW_HEIGHT[row.level];
    const diagnostic = row.level === "bench" && row.diagnostic;
    const content = (
      <>
        {isExpandable(row) ? <Chevron open={isOpen(row)} color={row.level === "risk" ? ACCENT : "#9ca3af"} /> : <span style={{ width: 11 }} />}
        <span style={{ minWidth: 0 }}>
          <span
            style={{
              display: "block",
              fontSize: row.level === "risk" ? 14 : row.level === "bench" ? 12.5 : 12,
              fontWeight: row.level === "risk" ? 800 : row.level === "bench" ? 600 : 500,
              color: row.level === "judge" ? "#6b7280" : INK,
              lineHeight: 1.25,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {rowLabel(row)}
            {diagnostic && (
              <span style={{ marginLeft: 5, fontSize: 10, fontWeight: 700, color: "#b45309" }}>
                diagnostic
              </span>
            )}
          </span>
          {row.level === "risk" && !isMobile && (
            <span style={{ display: "block", fontSize: 10.5, color: "rgba(10,31,77,0.5)", lineHeight: 1.3, marginTop: 2 }}>
              {RISK_DESCRIPTIONS[row.risk]}
            </span>
          )}
          {row.level === "judge" && !isMobile && (
            <span style={{ display: "block", fontSize: 9.5, color: row.floor ? "#c08a3e" : "#b0b7c3", lineHeight: 1.2, marginTop: 1 }}>
              {judgeRowKind(row)}
            </span>
          )}
        </span>
      </>
    );

    const base: React.CSSProperties = {
      position: "sticky",
      left: 0,
      zIndex: 2,
      width: labelWidth,
      flex: `0 0 ${labelWidth}px`,
      height,
      display: "flex",
      alignItems: "center",
      gap: 7,
      paddingLeft: 10 + INDENT[row.level],
      paddingRight: 8,
      background: row.level === "risk" ? "#ffffff" : "#fbfcfe",
      borderRight: "1px solid rgba(10,31,77,0.08)",
      textAlign: "left",
      minWidth: 0,
    };

    if (!isExpandable(row)) {
      const note = row.level === "judge" && row.floor ? FLOOR_NOTE : row.level === "judge" ? row.scorer : undefined;
      return (
        <div style={base} title={note}>
          {content}
        </div>
      );
    }
    return (
      <button
        type="button"
        onClick={() => onRowToggle(row)}
        aria-expanded={isOpen(row)}
        title={diagnostic ? DIAGNOSTIC_NOTE : row.level === "risk" ? RISK_DESCRIPTIONS[row.risk] : undefined}
        style={{ ...base, border: 0, borderRight: base.borderRight as string, cursor: "pointer", font: "inherit" }}
      >
        {content}
      </button>
    );
  };

  return (
    <div>
      <Helmet>
        <title>Systemic Risk Index — EuroSafeAI</title>
        <meta
          name="description"
          content="EuroSafeAI's leaderboard grading frontier AI models against the four systemic risks named by the EU AI Act Code of Practice."
        />
      </Helmet>

      {/* Hero */}
      <section
        style={{
          background: "linear-gradient(180deg, #ffffff 0%, #ffffff 55%, #f5f7fb 100%)",
          padding: isMobile ? "6rem 0 2.5rem" : "9rem 0 4rem",
          borderBottom: "1px solid rgba(10,31,77,0.06)",
        }}
      >
        <div className="mx-auto px-6" style={{ maxWidth: "1100px" }}>
          <SectionEyebrow>Research Output</SectionEyebrow>
          <motion.h1
            style={{
              fontSize: "clamp(1.9rem, 5vw, 4rem)",
              fontWeight: 800,
              color: INK,
              letterSpacing: "-0.025em",
              lineHeight: 1.08,
              marginBottom: "1.25rem",
              maxWidth: "920px",
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.07 }}
          >
            Systemic Risk Index
            <br />
            <span style={{ color: ACCENT, fontStyle: "italic" }}>for Europe and Humanity</span>
          </motion.h1>
          <motion.p
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.65,
              color: "rgba(10,31,77,0.7)",
              maxWidth: "720px",
              marginBottom: "1.5rem",
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            We grade frontier large language models against the four categories of systemic risk
            named by the EU AI Act Code of Practice — CBRN misuse, offensive cyber capability, loss
            of control, and manipulation. Every provider is graded on each risk, and every grade
            opens up: down to the benchmarks behind it, and down to the individual LLM judges behind
            each benchmark.
          </motion.p>
          <motion.div
            style={{
              display: "inline-flex",
              alignItems: "flex-start",
              gap: "0.65rem",
              background: "#fffbeb",
              border: "1px solid #fde68a",
              borderRadius: 8,
              padding: "0.75rem 1rem",
              fontSize: "0.85rem",
              color: "#92400e",
              maxWidth: 580,
              lineHeight: 1.5,
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.25 }}
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ marginTop: 2, flexShrink: 0 }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>
              <strong style={{ fontWeight: 700 }}>Preliminary data.</strong> Scores are indicative and
              based on ongoing research. Methodology and results will be revised as evaluations are
              peer-reviewed.
            </span>
          </motion.div>
        </div>
      </section>

      {/* Counts */}
      <section style={{ background: "#ffffff", borderBottom: "1px solid rgba(10,31,77,0.06)" }}>
        <div className="mx-auto px-6" style={{ maxWidth: "1100px", padding: "0.85rem 1.5rem" }}>
          <p style={{ fontSize: "0.75rem", color: "rgba(10,31,77,0.5)" }}>
            {MODELS.length} models · {columns.length} providers · 4 systemic risks
          </p>
        </div>
      </section>

      {/* Heatmap */}
      <section style={{ background: "#f5f7fb", padding: isMobile ? "1.25rem 0 3rem" : "2.5rem 0 4rem" }}>
        <div className="mx-auto px-6" style={{ maxWidth: "1100px" }}>
          <div
            style={{
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
              borderRadius: 12,
              border: "1px solid rgba(10,31,77,0.08)",
              background: "#ffffff",
            }}
          >
            {/* minWidth eases alongside the column groups; letting it jump would make
                the collapsed columns twitch as the leftover slack is redistributed. */}
            <div
              role="grid"
              style={{
                minWidth: labelWidth + totalLeaves * cellWidth,
                ["--cell-width" as string]: `${cellWidth}px`,
                transition: reduced ? undefined : `min-width ${EXPAND_DURATION}s ${EXPAND_CSS_EASE}`,
              }}
            >
              {/* Provider header */}
              <div
                role="row"
                style={{
                  display: "flex",
                  background: "#f9fafb",
                  borderBottom: "1px solid rgba(10,31,77,0.08)",
                }}
              >
                <div
                  style={{
                    position: "sticky",
                    left: 0,
                    zIndex: 3,
                    flex: `0 0 ${labelWidth}px`,
                    background: "#f9fafb",
                    borderRight: "1px solid rgba(10,31,77,0.08)",
                    display: "flex",
                    alignItems: "flex-end",
                    padding: "0.6rem 0.7rem",
                    fontSize: "0.66rem",
                    fontWeight: 700,
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  <span title={OVERALL_NOTE}>
                    Systemic risk
                    <span style={{ display: "block", textTransform: "none", letterSpacing: 0, fontWeight: 500, fontSize: "0.62rem", color: "#b0b7c3", marginTop: 2 }}>
                      Overall = mean of the four
                    </span>
                  </span>
                </div>
                {columns.map((column) => {
                  const open = expandedProviders.has(column.provider);
                  const leaves = leafCount(column.provider, column.models);
                  return (
                    <div
                      key={column.provider}
                      style={{
                        ...columnGroupStyle(leaves, cellWidth, open, reduced),
                        alignItems: "stretch",
                        paddingTop: "0.6rem",
                        paddingBottom: "0.15rem",
                      }}
                    >
                      <HeaderCell
                        logo={COMPANY_LOGO[column.provider]}
                        name={column.provider}
                        emphasis
                        open={open}
                        onToggle={() => setExpandedProviders((s) => toggle(s, column.provider))}
                        toggleTitle={
                          open
                            ? `Collapse ${column.provider}`
                            : `Expand ${column.provider} into its ${column.models.length} evaluated model${column.models.length === 1 ? "" : "s"}`
                        }
                        subject={column.provider}
                        models={column.models}
                      />
                      {column.models.map((model) => (
                        <div key={model.id} aria-hidden={!open} style={memberColumnStyle(open, reduced)}>
                          <HeaderCell name={model.name} subject={model.name} models={[model]} />
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>

              {/* Rows */}
              <AnimatePresence initial={false}>
                {rows.map((row) => {
                  const height = ROW_HEIGHT[row.level];
                  const muted = isMutedRow(row);
                  const top = row.level === "risk";
                  return (
                    <motion.div
                      key={row.key}
                      role="row"
                      initial={reduced || top ? false : { height: 0, opacity: 0 }}
                      animate={{ height, opacity: 1 }}
                      exit={reduced ? { height: 0, opacity: 0, transition: { duration: 0 } } : { height: 0, opacity: 0 }}
                      transition={{ duration: reduced ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        display: "flex",
                        overflow: "hidden",
                        background: top ? "#ffffff" : "#fbfcfe",
                        borderTop: top ? "1px solid rgba(10,31,77,0.08)" : "1px solid rgba(10,31,77,0.03)",
                      }}
                    >
                      {rowLabelCell(row)}
                      {columns.map((column) => {
                        const open = expandedProviders.has(column.provider);
                        const leaves = leafCount(column.provider, column.models);
                        const values = cellValues.get(row.key)!;
                        const pooled = values.provider.get(column.provider)!;
                        return (
                          <div key={column.provider} style={columnGroupStyle(leaves, cellWidth, open, reduced)}>
                            <Cell
                              score={pooled.score}
                              meanScore={pooled.mean}
                              coverage={pooled.coverage && coverageFraction(pooled.coverage)}
                              muted={muted}
                              height={height}
                              label={cellLabel(row, column.provider, pooled.score, pooled.mean, pooled.coverage)}
                            />
                            {column.models.map((model) => {
                              const own = values.model.get(model.id)!;
                              return (
                                <div key={model.id} aria-hidden={!open} style={memberColumnStyle(open, reduced)}>
                                  <Cell
                                    score={own.score}
                                    meanScore={own.mean}
                                    coverage={own.coverage && coverageFraction(own.coverage)}
                                    muted={muted}
                                    height={height}
                                    label={cellLabel(row, model.name, own.score, own.mean, own.coverage)}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Legend */}
          <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#4b5563", marginRight: 4 }}>Grade:</span>
              {GRADES.map((g, i) => {
                const midpoint = (i + 0.5) * GRADE_BAND;
                const heat = heatColor(midpoint);
                return (
                  <span
                    key={g}
                    title={`${g} — ${(i * GRADE_BAND).toFixed(1)}–${((i + 1) * GRADE_BAND).toFixed(1)} · GPA ${gpa(midpoint).toFixed(1)}`}
                    style={{
                      background: heat.background,
                      color: heat.color,
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "0.2rem 0.45rem",
                      borderRadius: 4,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {g}
                  </span>
                );
              })}
            </div>
            <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6, maxWidth: 760 }}>
              Scores are out of 100, higher is safer, on a fixed scale of {GRADES.length} equal bands
              from F− to A+ ({GRADE_BAND.toFixed(1)} points each) — so a colour means the same thing
              at every level of the table. Each cell reads{" "}
              <strong>worst&nbsp;·&nbsp;mean</strong>: the grade and the leading number are the{" "}
              <strong>worst case under adversarial perturbation</strong>, where every sample
              contributes its lowest score across the six perturbations and those are then averaged;
              the second, fainter number pools the same samples without that per-sample minimum. A
              wide gap means the model's failures are scattered across different perturbations
              rather than concentrated in one. A collapsed provider column shows the mean across its
              evaluated models. Rows marked{" "}
              <span style={{ color: "#b45309", fontWeight: 700 }}>diagnostic</span> are shown greyed
              out and are excluded from the aggregates above them. The{" "}
              <strong>refusal floor</strong> row is not a scorer: it restates its benchmark's score
              with every unscored sample counted as safe, giving an optimistic bound against the
              headline's pessimistic one. Read the pair as brackets on the truth.
            </p>
            <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6, maxWidth: 760 }}>
              A bar along the bottom of a cell marks{" "}
              <strong>coverage below {Math.round(COVERAGE_FLAG * 100)}%</strong> — the share of
              samples that yielded a gradeable result. A sample drops out when no verdict could be
              formed, most often because the evaluated model's own provider blocked the response
              before it was generated, leaving nothing to grade. Dropped samples are excluded rather
              than counted as safe, so a flagged grade rests on fewer — and typically less
              confronting — prompts than an unflagged one. Hover for the exact count. Coverage is
              recorded per perturbation condition rather than per scorer, so every judge within a
              benchmark shares one figure.
            </p>
          </div>
        </div>
      </section>

      {/* About / Methodology */}
      <section style={{ background: "#ffffff", borderTop: "1px solid rgba(10,31,77,0.06)", padding: "4rem 0" }}>
        <div className="mx-auto px-6" style={{ maxWidth: "1100px" }}>
          <div style={{ maxWidth: 760 }}>
            <SectionEyebrow>About This Index</SectionEyebrow>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "rgba(10,31,77,0.7)", marginBottom: "1rem" }}>
              The four rows of this table are the systemic risks the EU AI Act's Code of Practice
              requires providers of general-purpose AI to assess: CBRN misuse, offensive cyber
              capability, loss of control, and manipulation. Each is evaluated by a merged suite of
              public benchmarks, re-scored under one common polarity so that every number means "how
              safe", and re-run under six families of adversarial perturbation — paraphrase,
              register shift, identity stripping, framing, reconsideration pressure, and agentic
              scenarios.
            </p>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "rgba(10,31,77,0.7)", marginBottom: "1rem" }}>
              A model's score for a risk is its <strong>worst case</strong>, pooled per sample across
              those perturbations — a safeguard that only holds when it is unprovoked is not a
              safeguard. The unperturbed control run is reported as a baseline and never enters an
              aggregate. Free-text responses are graded by an ensemble of LLM judges; expanding a
              benchmark row shows what each judge concluded on its own, so a grade can be traced to
              the judgements that produced it.
            </p>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "rgba(10,31,77,0.55)", marginBottom: "2rem" }}>
              Full methodology, dataset descriptions, and reproducibility information are published
              alongside the evaluation pipeline.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
};

export default CertificatePage;
