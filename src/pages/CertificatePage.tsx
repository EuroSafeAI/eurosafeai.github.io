import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import modelsData from "@/data/models.json";
import { buildColumns } from "@/lib/leaderboard";
import type { ModelEntry } from "@/data/models.types";
import { CapabilityAdjustedSection } from "@/components/CapabilityAdjusted";
import { CAPABILITY_EXPONENT } from "@/lib/risk-index";
import { ACCENT, INK, LEADERBOARD_WIDTH } from "@/components/leaderboard/constants";
import { Leaderboard } from "@/components/leaderboard/Leaderboard";
import { Methodology } from "@/components/Methodology";

const MODELS = modelsData as unknown as ModelEntry[];

const SectionEyebrow = ({
  as: Tag = "div",
  children,
}: {
  as?: "div" | "h2";
  children: React.ReactNode;
}) => (
  <Tag style={{ display: "flex", alignItems: "center", gap: "0.9rem", marginBottom: "1.4rem" }}>
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
  </Tag>
);

const CertificatePage = () => {
  const isMobile = useIsMobile();
  const providerCount = useMemo(() => buildColumns(MODELS).length, []);

  return (
    <div>
      <Helmet>
        <title>AI Safety Certificate — EuroSafeAI</title>
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
            EU AI Safety Index
            <br />
            <span style={{ color: ACCENT, fontStyle: "italic" }}></span>
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
            {MODELS.length} models · {providerCount} providers · 4 systemic risks
          </p>
        </div>
      </section>

      {/* Heatmap */}
      <section style={{ background: "#ffffff", padding: isMobile ? "1.25rem 0 3rem" : "2.5rem 0 4rem" }}>
        <div className="mx-auto px-6" style={{ maxWidth: LEADERBOARD_WIDTH }}>
          <Leaderboard models={MODELS} />
        </div>
      </section>

      {/* About / Methodology */}
      <section style={{ background: "#ffffff", borderTop: "1px solid rgba(10,31,77,0.06)", padding: "4rem 0" }}>
        <div className="mx-auto px-6" style={{ maxWidth: "1100px" }}>
          <div style={{ maxWidth: 760 }}>
            <SectionEyebrow as="h2">Methodology</SectionEyebrow>
            <Methodology />
          </div>

          <div style={{ marginTop: "3rem" }}>
            <SectionEyebrow>Safety Against Capability</SectionEyebrow>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "rgba(10,31,77,0.55)", marginBottom: "1.25rem", maxWidth: 760 }}>
              Every evaluated model plotted by what it can do against how safely it does it, with
              each point coloured by its capability-adjusted grade at the published weight of{" "}
              {CAPABILITY_EXPONENT.toFixed(2)}. The leaderboard above ranks the same adjustment
              interactively; this is the fixed reference it is measured against.
            </p>
            <CapabilityAdjustedSection models={MODELS} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default CertificatePage;
