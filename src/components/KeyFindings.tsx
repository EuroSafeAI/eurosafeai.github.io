import type { ModelEntry } from "@/data/models.types";
import { RISK_LABELS } from "@/lib/leaderboard";
import { CLEARS_AT, adversarialCostSummary, ceilingSummary, highestRisk } from "@/lib/findings";
import { ACCENT, INK } from "@/components/leaderboard/constants";
import AnimatedSection from "@/components/AnimatedSection";

const card: React.CSSProperties = {
  // PaperCard's surface, without its hover lift: these are not links and
  // should not behave as though they lead somewhere.
  background: "#ffffff",
  border: "1px solid rgba(10,31,77,0.08)",
  borderRadius: "12px",
  padding: "1.4rem 1.4rem 1.25rem",
  height: "100%",
};

const figure: React.CSSProperties = {
  fontSize: "clamp(1.9rem, 4vw, 2.5rem)",
  fontWeight: 800,
  color: INK,
  lineHeight: 1.05,
  fontVariantNumeric: "tabular-nums",
};

const claim: React.CSSProperties = {
  fontSize: "0.82rem",
  fontWeight: 700,
  color: ACCENT,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  margin: "0.5rem 0 0.6rem",
};

const support: React.CSSProperties = {
  fontSize: "0.85rem",
  lineHeight: 1.65,
  color: "rgba(10,31,77,0.6)",
  margin: 0,
};

/**
 * What the study found, before a reader meets the instruments that produced
 * it. Every figure is derived from the roster on screen.
 */
export const KeyFindings: React.FC<{ models: ModelEntry[] }> = ({ models }) => {
  const cost = adversarialCostSummary(models);
  const ceiling = ceilingSummary(models, "worst");
  const highest = highestRisk(models);
  if (!cost || !ceiling || !highest) return null;

  // Every headline is a share of the field — the count a general reader can
  // read without a scale — with the raw scores kept to the supporting line.
  const droppedUnderPressure = cost.clearsOnMean - cost.clearsOnWorst;
  const findings = [
    {
      key: "adversarial",
      value: `${droppedUnderPressure}`,
      unit: `of ${cost.total}`,
      claim: "pass on paper but fail under pressure",
      body: (
        <>
          Taken at face value, {cost.clearsOnMean} of {cost.total} models clear the safety bar; provoke
          their safeguards and {cost.clearsOnWorst === 0 ? "none do" : `only ${cost.clearsOnWorst} do`}.
          Safety falls {cost.average.toFixed(1)} points on average, most for {cost.largest.model.name}{" "}
          ({cost.largest.cost.toFixed(1)}) and least for {cost.smallest.model.name}{" "}
          ({cost.smallest.cost.toFixed(1)}).
        </>
      ),
    },
    {
      key: "ceiling",
      value: `${ceiling.clears}`,
      unit: `of ${ceiling.total}`,
      claim: "models are reliably safe",
      body: (
        <>
          Under worst-case grading not one model clears {CLEARS_AT} out of 100. The safest,{" "}
          {ceiling.best.model.name}, reaches {ceiling.best.score.toFixed(1)}; the median is{" "}
          {ceiling.median.toFixed(1)}, and {ceiling.belowHalf} of {ceiling.total} fall below halfway.
          The lowest is {ceiling.lowest.model.name} at {ceiling.lowest.score.toFixed(1)}.
        </>
      ),
    },
    {
      key: "highest",
      value: `${highest.belowHalf}`,
      unit: `of ${highest.total}`,
      claim: `fail on ${RISK_LABELS[highest.risk]}`,
      body: (
        <>
          {RISK_LABELS[highest.risk]} is the weakest of the four systemic risks, averaging{" "}
          {highest.worstMean.toFixed(1)} out of 100 across the field.{" "}
          {highest.consistentAcrossMetrics ? (
            <>It ranks weakest under both the worst-case and the average metric, so the result does
            not depend on which one is shown.</>
          ) : (
            <>That ranking holds under worst-case grading; a different risk is weakest on the average
            metric, so this one depends on which is shown.</>
          )}
        </>
      ),
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1.5rem",
        alignItems: "stretch",
      }}
    >
      {findings.map((finding, i) => (
        <AnimatedSection key={finding.key} delay={i * 0.15}>
          <div style={card}>
            <div style={figure}>
              {finding.value}
              <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#9ca3af", marginLeft: 6 }}>
                {finding.unit}
              </span>
            </div>
            <p style={claim}>{finding.claim}</p>
            <p style={support}>{finding.body}</p>
          </div>
        </AnimatedSection>
      ))}
    </div>
  );
};
