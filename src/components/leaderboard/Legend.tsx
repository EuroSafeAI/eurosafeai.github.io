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
      Scores run 0 to 100 and higher is safer, on {GRADES.length} equal bands from F− to A+.
      A colour means the same thing at every level of the table. Each cell shows the selected
      metric; the other is in its tooltip.
    </p>
    <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6, maxWidth: 760 }}>
      Greyed rows are <span style={{ color: "#b45309", fontWeight: 700 }}>diagnostic</span> and
      excluded from the aggregates above them. The refusal floor row counts every unscored
      sample as safe, so it reads high by construction. Treat it as an optimistic bound.
    </p>
    <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6, maxWidth: 760 }}>
      A bar under a cell flags{" "}
      <strong>coverage below {Math.round(COVERAGE_FLAG * 100)}%</strong>. Dropped samples are
      excluded rather than counted as safe, so a flagged grade rests on fewer, and typically
      easier, prompts than an unflagged one.
    </p>
  </div>
);
