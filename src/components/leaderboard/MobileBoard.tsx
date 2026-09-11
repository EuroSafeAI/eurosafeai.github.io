import { grade } from "@/lib/scoring";
import { heatColor } from "@/lib/heat";
import {
  adjustedOverallScore,
  adjustedProviderCellScore,
  buildColumns,
  riskKey,
  type Grouping,
} from "@/lib/leaderboard";
import type { Aggregation } from "@/lib/scoring";
import type { ModelEntry } from "@/data/models.types";
import { RISKS } from "@/data/models.types";
import { INK } from "./constants";

/**
 * The leaderboard transposed for a phone: providers down, risks across.
 *
 * The main grid puts providers in columns, which is right on a wide screen and
 * unworkable on a narrow one — nine columns plus a sticky label leave two and a
 * half providers visible, so the one thing a leaderboard is for, comparing,
 * needs horizontal scrolling. Four risks fit across 390px; nine providers do
 * not. Transposing is the only arrangement where the whole table is visible at
 * once.
 *
 * Deliberately not a port of the main grid: no drill-down into benchmarks or
 * models, no capability slider, no metric reorder animation. Those need width
 * this layout does not have, and they are all still there on a larger screen.
 */

/** Short enough for a 62px column; the full names are in the definitions panel. */
const SHORT: Record<(typeof RISKS)[number], string> = {
  cbrn: "CBRN",
  cyber: "Cyber",
  loss_of_control: "Control",
  manipulation: "Manip.",
};

const NAME_W = 96;

export const MobileBoard: React.FC<{
  models: ModelEntry[];
  metric: Aggregation;
  weight: number;
  grouping: Grouping;
}> = ({ models, metric, weight, grouping }) => {
  // Ranked by the same rule the wide grid uses, so the two orders agree.
  const columns = buildColumns(models, metric, weight, grouping);

  return (
    <div role="table" aria-label="Safety grades by provider and systemic risk">
      <div role="row" style={{ display: "flex", alignItems: "flex-end", gap: 3, marginBottom: 4 }}>
        <div role="columnheader" style={{ width: NAME_W, flexShrink: 0 }} />
        <div
          role="columnheader"
          style={{
            flex: 1,
            minWidth: 0,
            textAlign: "center",
            fontSize: 9.5,
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "#374151",
          }}
        >
          Overall
        </div>
        {RISKS.map((risk) => (
          <div
            key={risk}
            role="columnheader"
            style={{
              flex: 1,
              minWidth: 0,
              textAlign: "center",
              fontSize: 9.5,
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "#6b7280",
            }}
          >
            {SHORT[risk]}
          </div>
        ))}
      </div>

      {columns.map((column) => (
        <div key={column.provider} role="row" style={{ display: "flex", alignItems: "stretch", gap: 3, marginBottom: 3 }}>
          <div
            role="rowheader"
            style={{
              width: NAME_W,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              fontSize: 12,
              fontWeight: 700,
              color: INK,
              lineHeight: 1.15,
              paddingRight: 6,
            }}
          >
            {column.provider}
          </div>
          {(() => {
            const score = adjustedOverallScore(column.models, metric, weight);
            const heat = score === undefined ? undefined : heatColor(score);
            return (
              <div
                role="cell"
                title={`${column.provider} — overall: ${score === undefined ? "no score" : score.toFixed(1)}`}
                style={{
                  flex: 1,
                  minWidth: 0,
                  height: 42,
                  borderRadius: 5,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: heat ? heat.background : "#f3f4f6",
                  color: heat ? heat.color : "#9ca3af",
                  fontVariantNumeric: "tabular-nums",
                  outline: "1px solid rgba(10,31,77,0.18)",
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 800, lineHeight: 1 }}>
                  {score === undefined ? "—" : grade(score)}
                </span>
                {score !== undefined && (
                  <span style={{ fontSize: 9.5, fontWeight: 600, lineHeight: 1, marginTop: 2 }}>
                    {score.toFixed(1)}
                  </span>
                )}
              </div>
            );
          })()}
          {RISKS.map((risk) => {
            const score = adjustedProviderCellScore(
              column.models,
              { key: riskKey(risk), level: "risk", risk },
              metric,
              weight
            );
            const heat = score === undefined ? undefined : heatColor(score);
            return (
              <div
                key={risk}
                role="cell"
                title={`${column.provider} — ${SHORT[risk]}: ${score === undefined ? "no score" : score.toFixed(1)}`}
                style={{
                  flex: 1,
                  minWidth: 0,
                  height: 42,
                  borderRadius: 5,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: heat ? heat.background : "#f3f4f6",
                  color: heat ? heat.color : "#9ca3af",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 800, lineHeight: 1 }}>
                  {score === undefined ? "—" : grade(score)}
                </span>
                {score !== undefined && (
                  <span style={{ fontSize: 9.5, fontWeight: 600, lineHeight: 1, marginTop: 2 }}>
                    {score.toFixed(1)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
