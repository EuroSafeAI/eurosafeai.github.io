import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { GRADES, GRADE_BAND, gpa } from "@/lib/scoring";
import { RISK_DESCRIPTIONS_PLAIN, RISK_LABELS } from "@/lib/leaderboard";
import { RISKS } from "@/data/models.types";
import { heatColor } from "@/lib/heat";
import { ACCENT, COVERAGE_FLAG } from "./constants";

const note: React.CSSProperties = {
  fontSize: 12,
  color: "#6b7280",
  lineHeight: 1.6,
  maxWidth: 760,
  margin: 0,
};

/**
 * One line on how to read a score, and the marker glosses behind a disclosure.
 *
 * The grade chips moved inside it. A over B over C is a convention every
 * reader already has, and the grid prints a number beside every letter, so
 * the full scale is reference material rather than something to lead with.
 * What stays visible is the one thing a reader cannot assume on a safety
 * leaderboard, which way the scale runs.
 */
export const Legend: React.FC<{ isMobile: boolean }> = ({ isMobile }) => (
    <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>

      <p style={note}>Scores run 0 to 100 and higher is safer.</p>

      {/* The inline glosses are hidden at this width, so "CBRN" would otherwise
          go undefined for the reader least likely to know it. */}
      {isMobile && (
        <Accordion type="single" collapsible style={{ maxWidth: 760 }}>
          <AccordionItem value="risks">
            <AccordionTrigger style={{ fontSize: 12, color: ACCENT, paddingTop: "0.5rem", paddingBottom: "0.5rem" }}>
              What these risks mean
            </AccordionTrigger>
            <AccordionContent>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem", paddingBottom: "0.3rem" }}>
                {RISKS.map((risk) => (
                  <p key={risk} style={note}>
                    <span style={{ fontWeight: 700, color: "#374151" }}>{RISK_LABELS[risk]}</span>{" "}
                    {RISK_DESCRIPTIONS_PLAIN[risk]}
                  </p>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
      <Accordion type="single" collapsible style={{ maxWidth: 760 }}>
        <AccordionItem value="markers">
          <AccordionTrigger style={{ fontSize: 12, color: ACCENT, paddingTop: "0.6rem", paddingBottom: "0.6rem" }}>
            Reading the markers
          </AccordionTrigger>
          <AccordionContent>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
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
              <p style={note}>
                The {GRADES.length} bands are equal width, and a colour means the same thing at every
                level of the table. Each cell shows the selected metric; the other is in its tooltip.
              </p>
              <p style={note}>
                A provider marked <span style={{ color: "#b45309", fontWeight: 700 }}>partial</span> had at
                least one risk evaluation fail: its grade for that risk comes from the samples that did
                complete, and that row does not open into benchmarks.
              </p>
              <p style={note}>
                Greyed rows are <span style={{ color: "#b45309", fontWeight: 700 }}>diagnostic</span> and
                excluded from the aggregates above them.
              </p>
              <p style={note}>
                A bar under a cell flags{" "}
                <strong>coverage below {Math.round(COVERAGE_FLAG * 100)}%</strong>. Dropped samples are
                excluded rather than counted as safe, so a flagged grade rests on fewer, and typically
                easier, prompts than an unflagged one.
              </p>
              <p style={note}>
                <a href="#methodology" style={{ color: ACCENT, textDecoration: "none", fontWeight: 600 }}>
                  Methodology
                </a>
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

    </div>
);
