import { GRADES, GRADE_BAND, gpa } from "@/lib/scoring";
import { heatColor } from "@/lib/heat";
import { COVERAGE_FLAG } from "./constants";

/** The grade-chip key and explanatory prose shown beneath the heatmap. */
export const Legend: React.FC = () => (
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
      Scores run 0–100, higher is safer, on a fixed scale of {GRADES.length} equal bands from
      F− to A+ — so a colour means the same thing at every level of the table. Each cell shows
      the selected metric; the other is in its tooltip. Greyed rows are{" "}
      <span style={{ color: "#b45309", fontWeight: 700 }}>diagnostic</span> and excluded from
      the aggregates above them. A bar under a cell flags{" "}
      <strong>coverage below {Math.round(COVERAGE_FLAG * 100)}%</strong>.
    </p>
  </div>
);
