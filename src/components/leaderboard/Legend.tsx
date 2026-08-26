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
      Scores are out of 100, higher is safer, on a fixed scale of {GRADES.length} equal bands
      from F− to A+ ({GRADE_BAND.toFixed(1)} points each) — so a colour means the same thing
      at every level of the table. The toggle above the table chooses which of two metrics
      is shown: <strong>worst case</strong>, where every sample contributes its lowest score
      across the six adversarial perturbations and those are then averaged, or{" "}
      <strong>average</strong>, which pools the same samples without that per-sample minimum.
      Switching it changes the grade, the colour, and the column order together — the
      unselected metric stays in each cell's accessible label and mouse tooltip. A large divergence between the two metrics'
      provider orderings means a provider's failures are concentrated in particular
      perturbations rather than spread evenly across them. A collapsed provider column shows
      the mean across its evaluated models. Rows marked{" "}
      <span style={{ color: "#b45309", fontWeight: 700 }}>diagnostic</span> are shown greyed
      out and are excluded from the aggregates above them. The{" "}
      <strong>refusal floor</strong> row is not a scorer: it restates its benchmark's score
      with every unscored sample counted as safe, giving an optimistic bound against the
      headline's pessimistic one. Read the pair as brackets on the truth.
    </p>
    <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6, maxWidth: 760 }}>
      <strong>Capability weight</strong> conditions these grades on how much each model can
      actually do — a model that cannot accomplish much cannot cause much. At{" "}
      <strong>1.00 the table shows the measured evaluation results</strong>, unmodified; that
      is where it loads. Lowering it discounts a model's unsafety by its Artificial
      Analysis intelligence index, so a weak unsafe model falls behind a capable one at the
      same raw score, and the provider columns re-rank. Within a column the ordering of the
      four risks never changes — the adjustment is applied to every cell in that column
      alike. Diagnostic rows are never adjusted: they measure whether a model{" "}
      <em>knows</em> hazardous material rather than whether it declines to act on it, so
      discounting them by capability would count the same thing twice. The published
      capability-adjusted index below this table uses a weight of 0.50.
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
);
