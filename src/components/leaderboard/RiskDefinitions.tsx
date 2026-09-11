import { LearnMore } from "@/components/LearnMore";
import { RISK_DESCRIPTIONS_PLAIN, RISK_LABELS } from "@/lib/leaderboard";
import { RISKS } from "@/data/models.types";

const note: React.CSSProperties = {
  fontSize: 12,
  color: "#6b7280",
  lineHeight: 1.6,
  maxWidth: 760,
  margin: 0,
};

/**
 * What the four risks are, on mobile only.
 *
 * Sits above the board rather than below it: the question arrives when a
 * reader meets the column headings, and on a phone those are abbreviated to
 * CBRN, CYBER, CONTROL and MANIP. Answering afterwards is answering late.
 * Everything about reading the cells stays underneath, where it belongs.
 */
export const RiskDefinitions: React.FC = () => (
  <div style={{ marginBottom: "0.5rem" }}>
    {/* The inline glosses are hidden at this width, so "CBRN" would otherwise
        go undefined for the reader least likely to know it. */}
      <LearnMore label="What does CBRN, or Loss of Control, mean?" swapLabel={false}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem", paddingBottom: "0.3rem" }}>
              {RISKS.map((risk) => (
                <p key={risk} style={note}>
                  <span style={{ fontWeight: 700, color: "#374151" }}>{RISK_LABELS[risk]}</span>{" "}
                  {RISK_DESCRIPTIONS_PLAIN[risk]}
                </p>
              ))}
            </div>
      </LearnMore>
  </div>
);
