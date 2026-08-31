import type { ModelEntry } from "@/data/models.types";
import { RISK_LABELS } from "@/lib/leaderboard";
import { CLEARS_AT, adversarialCostSummary, ceilingSummary, weakestRisk } from "@/lib/findings";
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
  const weakest = weakestRisk(models);
  if (!cost || !ceiling || !weakest) return null;

  const findings = [
    {
      key: "adversarial",
      value: cost.average.toFixed(1),
      unit: "points",
      claim: "lost to adversarial pressure",
      body: (
        <>
          The average model scores {cost.average.toFixed(1)} points lower once its safeguards are
          provoked rather than taken at face value. {cost.clearsOnMean} of {cost.total} models clear{" "}
          {CLEARS_AT} on their pooled average; under worst-case grading{" "}
          {cost.clearsOnWorst === 0 ? "none do" : `only ${cost.clearsOnWorst} do`}. The largest fall
          is {cost.largest.model.name} at {cost.largest.cost.toFixed(1)} points, the smallest{" "}
          {cost.smallest.model.name} at {cost.smallest.cost.toFixed(1)}.
        </>
      ),
    },
    {
      key: "ceiling",
      value: ceiling.best.score.toFixed(1),
      unit: "out of 100",
      claim: `best score in the field`,
      body: (
        <>
          Under worst-case grading no model clears {CLEARS_AT}. {ceiling.best.model.name} leads at{" "}
          {ceiling.best.score.toFixed(1)}, the median sits at {ceiling.median.toFixed(1)}, and{" "}
          {ceiling.belowHalf} of {ceiling.total} score below 50. The lowest is{" "}
          {ceiling.lowest.model.name} at {ceiling.lowest.score.toFixed(1)}.
        </>
      ),
    },
    {
      key: "weakest",
      value: weakest.worstMean.toFixed(1),
      unit: "field average",
      claim: `${RISK_LABELS[weakest.risk]} is the weakest risk`,
      body: (
        <>
          {RISK_LABELS[weakest.risk]} draws the lowest scores of the four systemic risks, averaging{" "}
          {weakest.worstMean.toFixed(1)} across the field, with {weakest.belowHalf} of{" "}
          {weakest.total} models below 50.{" "}
          {weakest.consistentAcrossMetrics ? (
            <>It ranks last under both the worst-case and the average metric, so the result does not
            depend on which one is shown.</>
          ) : (
            <>That ranking holds under worst-case grading; a different risk ranks last on the
            average metric, so this one depends on which is shown.</>
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
