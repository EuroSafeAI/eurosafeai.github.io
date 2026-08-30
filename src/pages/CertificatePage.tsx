import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import modelsData from "@/data/models.json";
import { buildColumns } from "@/lib/leaderboard";
import type { ModelEntry } from "@/data/models.types";
import { CapabilityAdjustedSection } from "@/components/CapabilityAdjusted";
import { PUBLISHED_CAPABILITY_WEIGHT } from "@/lib/capability-adjusted-safety";
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
        <title>EU AI Safety Index — EuroSafeAI</title>
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
            We grade frontier language models against the four systemic risks named in the EU AI
            Act Code of Practice: CBRN misuse, offensive cyber, loss of control, and manipulation.
            Every grade opens down to the benchmarks and the individual judges behind it.
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
              <strong style={{ fontWeight: 700 }}>Preliminary data.</strong> Scores and methodology
              are indicative and will be revised as evaluations are peer-reviewed.
            </span>
          </motion.div>
        </div>
      </section>

      {/* The Field */}
      <section style={{ background: "#ffffff", borderBottom: "1px solid rgba(10,31,77,0.06)", padding: "2.5rem 0 3rem" }}>
        <div className="mx-auto px-6" style={{ maxWidth: "1100px" }}>
          <SectionEyebrow as="h2">The Field</SectionEyebrow>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "rgba(10,31,77,0.55)", marginBottom: "0.5rem", maxWidth: 760 }}>
            Each dot is one model, placed by how much it can do (left to right) and how safely it
            does it (bottom to top). Colour is its capability-adjusted grade at the published
            weight of {PUBLISHED_CAPABILITY_WEIGHT.toFixed(2)}.
          </p>
          <p style={{ fontSize: "0.75rem", color: "rgba(10,31,77,0.5)", marginBottom: "1.25rem" }}>
            {MODELS.length} models · {providerCount} providers · 4 systemic risks
          </p>
          <CapabilityAdjustedSection models={MODELS} />
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
        </div>
      </section>
    </div>
  );
};

export default CertificatePage;
