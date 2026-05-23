import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import modelsData from "@/data/models.json";
import { calcAgg, calcGrade, type ScoreKey } from "@/lib/scoring";
import type { ModelEntry } from "@/data/models.types";

const ACCENT = "#003399";
const INK = "#0a1f4d";

type SortKey = ScoreKey | "agg";

const MODELS = modelsData as ModelEntry[];

const METRICS: { key: ScoreKey; label: string; shortLabel: string }[] = [
  { key: "hr",   label: "Human Rights",          shortLabel: "HR"        },
  { key: "hist", label: "Historical Accuracy",   shortLabel: "History"   },
  { key: "auth", label: "Anti-Authoritarianism", shortLabel: "Anti-Auth" },
  { key: "harm", label: "Anti-Harm",             shortLabel: "Anti-Harm" },
];




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

const ScoreBar = ({ score, delay, reduced }: { score: number | undefined; delay: number; reduced: boolean }) => {
  // Render an em-dash placeholder when the dimension has no value for this model.
  // Mirrors the pre-rebuild LeaderboardClient.tsx:325-331 behavior — the History
  // column today shows '—' for every row because no model has a hist score yet.
  if (score === undefined) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", minWidth: 96 }} aria-label="no score">
        <div style={{ flex: 1, height: 9, borderRadius: 999, background: "#e2e8f0" }} aria-hidden="true" />
        <span style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", width: 24, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
          —
        </span>
      </div>
    );
  }
  // Round to integer for display (old behavior: LeaderboardClient.tsx:333).
  // Bar width still uses the precise float so visual position is exact.
  const rounded = Math.round(score);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", minWidth: 96 }}>
      <div style={{ flex: 1, height: 9, borderRadius: 999, background: "#e2e8f0", overflow: "hidden" }}>
        <motion.div
          style={{ height: "100%", borderRadius: 999, background: "#1e3a8a" }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: reduced ? 0 : 0.75, delay: reduced ? 0 : delay, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color: "#374151", width: 24, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
        {rounded}
      </span>
    </div>
  );
};

const GradeBadge = ({ score, delay, reduced }: { score: number; delay: number; reduced: boolean }) => {
  const g = calcGrade(score);
  return (
    <motion.div
      style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
      initial={{ opacity: reduced ? 1 : 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : delay }}
    >
      <span style={{ fontSize: 14, fontWeight: 700, color: "#374151", fontVariantNumeric: "tabular-nums" }}>{score}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.04em" }}>{g}</span>
    </motion.div>
  );
};

const SortArrow = ({ active, asc }: { active: boolean; asc: boolean }) => (
  <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={active ? ACCENT : "#cbd5e1"} style={{ marginLeft: 2, flexShrink: 0 }}>
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
);

const COMPANY_LOGO: Record<string, string> = {
  "OpenAI": "/logos/openai.svg",
  "Google": "/logos/google.svg",
  "Google DeepMind": "/logos/deepmind.svg",
  "Anthropic": "/logos/anthropic.svg",
  "Meta": "/logos/meta.svg",
  "xAI": "/logos/xai.png",
  "Alibaba (Qwen)": "/logos/qwen.svg",
  "DeepSeek": "/logos/deepseek.svg",
  "Moonshot AI": "/logos/kimi.png",
  "Zhipu AI": "/logos/zhipu.svg",
  "MiniMax / Xiaomi": "/logos/minimax.png",
  "Mistral AI": "/logos/mistral.png",
  "Microsoft": "/logos/microsoft.png",
};

const CertificatePage = () => {
  const [sortKey, setSortKey] = useState<SortKey>("agg");
  const [sortAsc, setSortAsc] = useState(false);
  const reduced = useReducedMotion() ?? false;
  const isMobile = useIsMobile();

  const ranked = useMemo(() => {
    return [...MODELS]
      .map((m) => ({ ...m, agg: calcAgg(m.scores) }))
      .sort((a, b) => {
        const va = sortKey === "agg" ? a.agg : a.scores[sortKey as ScoreKey];
        const vb = sortKey === "agg" ? b.agg : b.scores[sortKey as ScoreKey];
        return sortAsc ? va - vb : vb - va;
      });
  }, [sortKey, sortAsc]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((p) => !p);
    else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const colHeader = (label: string, colKey: SortKey) => (
    <th key={colKey} style={{ padding: "0.85rem 0.75rem", textAlign: "left", whiteSpace: "nowrap" }}>
      <button
        type="button"
        onClick={() => handleSort(colKey)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 2,
          fontSize: "0.7rem",
          fontWeight: 700,
          color: "#6b7280",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          background: "transparent",
          border: 0,
          cursor: "pointer",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT)}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
      >
        {label}
        <SortArrow active={sortKey === colKey} asc={sortAsc} />
      </button>
    </th>
  );

  return (
    <div>
      <Helmet>
        <title>AI Safety Certificates — EuroSafeAI</title>
        <meta name="description" content="Explore AI model safety certificates issued by EuroSafeAI, covering risk assessments for frontier AI systems." />
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
            Safe AI Certificate
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
            We benchmark all frontier large language models (LLMs) according to EuroSafeAI's evaluation protocols across four key criteria: adherence to human rights principles, endorsement of democracy, historical accuracy (countering revisionism), and avoidance of socially harmful actions, in conformity with the EU AI Act.
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
              <strong style={{ fontWeight: 700 }}>Preliminary data.</strong> Scores are indicative and based on ongoing research. Methodology and results will be revised as evaluations are peer-reviewed. <span style={{ color: "#b45309" }}>Last updated: Q1 2026.</span>
            </span>
          </motion.div>
        </div>
      </section>

      {/* Counts */}
      <section style={{ background: "#ffffff", borderBottom: "1px solid rgba(10,31,77,0.06)" }}>
        <div className="mx-auto px-6" style={{ maxWidth: "1100px", padding: "0.85rem 1.5rem" }}>
          <p style={{ fontSize: "0.75rem", color: "rgba(10,31,77,0.5)" }}>
            {ranked.length} model{ranked.length !== 1 ? "s" : ""}
          </p>
        </div>
      </section>

      {/* Table */}
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
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#f9fafb", borderBottom: "1px solid rgba(10,31,77,0.08)" }}>
                  <th
                    style={{
                      width: 64,
                      padding: "0.85rem 0.75rem",
                      textAlign: "left",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: "#9ca3af",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      background: "#f3f4f6",
                      borderRight: "1px solid rgba(10,31,77,0.07)",
                    }}
                  >
                    #
                  </th>
                  <th
                    style={{
                      padding: "0.85rem 0.75rem",
                      textAlign: "left",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      minWidth: 180,
                    }}
                  >
                    Model
                  </th>
                  {[
                    { label: "Score", colKey: "agg" as SortKey },
                    ...METRICS.map((m) => ({ label: m.shortLabel, colKey: m.key as SortKey })),
                  ].map(({ label, colKey }) => colHeader(label, colKey))}
                </tr>
              </thead>
              <AnimatePresence mode="wait">
                <motion.tbody key="all" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                  {ranked.map((model, idx) => {
                    const rowDelay = reduced ? 0 : idx * 0.028;
                    const barDelay = reduced ? 0 : rowDelay + 0.12;
                    return (
                      <motion.tr
                        key={model.id}
                        style={{ borderBottom: "1px solid rgba(10,31,77,0.05)" }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: reduced ? 0 : 0.35, delay: rowDelay }}
                      >
                        <td
                          style={{
                            padding: "0.85rem 0.75rem",
                            background: "#f9fafb",
                            borderRight: "1px solid rgba(10,31,77,0.07)",
                          }}
                        >
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", fontVariantNumeric: "tabular-nums" }}>
                            {idx + 1}
                          </span>
                        </td>
                        <td style={{ padding: "0.85rem 0.75rem", minWidth: 200 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            {COMPANY_LOGO[model.company] && (
                              <img
                                src={COMPANY_LOGO[model.company]}
                                alt={model.company}
                                loading="lazy"
                                style={{ width: 22, height: 22, objectFit: "contain", flexShrink: 0 }}
                              />
                            )}
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 6, minWidth: 0 }}>
                              <div style={{ minWidth: 0 }}>
                                <p style={{ fontWeight: 700, color: INK, lineHeight: 1.3, margin: 0 }}>{model.name}</p>
                                <p style={{ fontSize: 12, color: "#9ca3af", margin: "2px 0 0" }}>{model.company}</p>
                              </div>
                              <a
                                href={`/certificate/${model.id}.pdf`}
                                download
                                aria-label={`Download certificate for ${model.name}`}
                                style={{
                                  width: 18,
                                  height: 18,
                                  borderRadius: "50%",
                                  background: "#f3f4f6",
                                  color: "#9ca3af",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  marginTop: 2,
                                  flexShrink: 0,
                                  transition: "background 0.2s, color 0.2s",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = "rgba(0,51,153,0.1)";
                                  e.currentTarget.style.color = ACCENT;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = "#f3f4f6";
                                  e.currentTarget.style.color = "#9ca3af";
                                }}
                              >
                                <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v10m0 0l-3-3m3 3l3-3M4 17v1a2 2 0 002 2h12a2 2 0 002-2v-1" />
                                </svg>
                              </a>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "0.85rem 0.75rem" }}>
                          <GradeBadge score={model.agg} delay={barDelay} reduced={reduced} />
                        </td>
                        {METRICS.map((m) => (
                          <td key={m.key} style={{ padding: "0.85rem 0.75rem" }}>
                            <ScoreBar score={model.scores[m.key]} delay={barDelay} reduced={reduced} />
                          </td>
                        ))}
                      </motion.tr>
                    );
                  })}
                </motion.tbody>
              </AnimatePresence>
            </table>
          </div>

          {/* Legend */}
          <div
            style={{
              marginTop: "1.5rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              alignItems: "center",
              justifyContent: isMobile ? "center" : "space-between",
              textAlign: isMobile ? "center" : "left",
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", fontSize: 12, color: "#6b7280" }}>
              <span style={{ fontWeight: 600, color: "#4b5563", marginRight: 4 }}>Grade:</span>
              {(["A", "B", "C", "D"] as const).map((g) => {
                const labels: Record<string, string> = {
                  A: "A — Excellent (≥ 80)",
                  B: "B — Good (65–79)",
                  C: "C — Fair (50–64)",
                  D: "D — Poor (< 50)",
                };
                return (
                  <span key={g} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af" }}>{g}</span>
                    <span>{labels[g].replace(`${g} — `, "")}</span>
                  </span>
                );
              })}
            </div>
            <p style={{ fontSize: 12, color: "#9ca3af" }}>
              Scores out of 100{isMobile ? "" : " · Click column headers to sort"}
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
              The EuroSafeAI Alignment Index evaluates frontier AI models across four independent dimensions derived from EU AI Act requirements, European Court of Human Rights jurisprudence, and EuroSafeAI's internal evaluation protocols. Each dimension is scored 0–100 via its specific evaluation and aggregated with equal weighting into an overall grade.
            </p>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "rgba(10,31,77,0.55)", marginBottom: "2rem" }}>
              Full methodology, dataset descriptions, and reproducibility information are published in the peer-reviewed papers listed below.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              {
                title: "Democratic or Authoritarian? Probing a New Dimension of Political Biases in Large Language Models",
                venue: "EACL 2026",
                summary: "An investigation into embedded political orientations in AI systems.",
                url: "http://arxiv.org/abs/2506.12758",
              },
              {
                title: "Preserving Historical Truth: Detecting Historical Revisionism in Large Language Models",
                venue: "IASEAI 2026",
                summary: "Methods for identifying AI-generated historical misinformation.",
                url: "https://arxiv.org/abs/2602.17433",
              },
              {
                title: "SocialHarmBench: Revealing LLM Vulnerabilities to Socially Harmful Requests",
                venue: "ICLR 2026",
                summary: "A comprehensive benchmark for evaluating AI vulnerability to harmful sociopolitical queries.",
                url: "https://arxiv.org/abs/2510.04891",
              },
              {
                title: "When Do Language Models Endorse Limitations on Universal Human Rights Principles?",
                venue: "EACL 2026 Findings",
                summary: "Analysis of conditions under which AI systems may compromise fundamental human rights principles.",
                url: "https://arxiv.org/abs/2603.04217",
              },
              {
                title: "Revealing Hidden Mechanisms of Cross-Country Content Moderation with Natural Language Processing",
                venue: "ACL 2025 Findings",
                summary: "",
                url: "https://arxiv.org/abs/2503.05280",
              },
            ].map((paper) => (
              <div
                key={paper.url}
                style={{
                  background: "#ffffff",
                  border: "1px solid rgba(10,31,77,0.08)",
                  borderRadius: 12,
                  padding: "1.25rem",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "1rem",
                  transition: "transform 0.25s, box-shadow 0.25s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 14px 30px -18px rgba(10,31,77,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ flex: 1, minWidth: 240 }}>
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: 11,
                      fontWeight: 600,
                      background: "#f3f4f6",
                      color: "#4b5563",
                      padding: "0.25rem 0.65rem",
                      borderRadius: 999,
                      marginBottom: "0.5rem",
                    }}
                  >
                    {paper.venue}
                  </span>
                  <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: INK, marginBottom: "0.35rem", lineHeight: 1.3 }}>
                    {paper.title}
                  </h4>
                  {paper.summary && (
                    <p style={{ fontSize: "0.85rem", color: "rgba(10,31,77,0.6)", lineHeight: 1.55 }}>{paper.summary}</p>
                  )}
                </div>
                <a
                  href={paper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4em",
                    padding: "0.55rem 1rem",
                    background: ACCENT,
                    color: "#ffffff",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    borderRadius: 8,
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#002277")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = ACCENT)}
                >
                  Paper
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CertificatePage;
