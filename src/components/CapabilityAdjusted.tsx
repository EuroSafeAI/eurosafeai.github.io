import { useMemo } from "react";
import type { ModelEntry } from "@/data/models.types";
import { heatColor } from "@/lib/heat";
import {
  CAPABILITY_EXPONENT,
  CAPABILITY_REFERENCE,
  adjustedRanking,
  scatterPoint,
  type ScatterBox,
} from "@/lib/risk-index";

const INK = "#0a1f4d";
const BOX: ScatterBox = { width: 640, height: 340, pad: 44 };

export const CapabilityAdjustedSection = ({ models }: { models: ModelEntry[] }) => {
  const ranking = useMemo(() => adjustedRanking(models), [models]);

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: "2rem" }}>
        {ranking.map((entry) => {
          const heat = heatColor(entry.adjusted);
          return (
            <div
              key={entry.model.id}
              title={`Matched to ${entry.model.aa_model_match}`}
              style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12.5 }}
            >
              <span style={{ flex: "0 0 170px", color: INK, fontWeight: 600 }}>
                {entry.model.name}
              </span>
              <span style={{ flex: 1, minWidth: 0, height: 18, background: "rgba(10,31,77,0.05)", borderRadius: 4 }}>
                <span
                  style={{
                    display: "block",
                    height: "100%",
                    width: `${entry.adjusted}%`,
                    background: heat.background,
                    borderRadius: 4,
                  }}
                />
              </span>
              <span style={{ flex: "0 0 46px", textAlign: "right", fontWeight: 700, color: INK, fontVariantNumeric: "tabular-nums" }}>
                {entry.adjusted.toFixed(1)}
              </span>
              <span style={{ flex: "0 0 190px", color: "#6b7280", fontVariantNumeric: "tabular-nums" }}>
                safety {entry.safety.toFixed(1)} · capability {entry.index.toFixed(1)}
              </span>
            </div>
          );
        })}
      </div>

      <svg
        viewBox={`0 0 ${BOX.width} ${BOX.height}`}
        role="img"
        aria-label="Raw safety against capability, one point per model"
        style={{ width: "100%", maxWidth: BOX.width, height: "auto" }}
      >
        <line x1={BOX.pad} y1={BOX.height - BOX.pad} x2={BOX.width - BOX.pad} y2={BOX.height - BOX.pad} stroke="rgba(10,31,77,0.2)" />
        <line x1={BOX.pad} y1={BOX.pad} x2={BOX.pad} y2={BOX.height - BOX.pad} stroke="rgba(10,31,77,0.2)" />
        <text x={BOX.width - BOX.pad} y={BOX.height - BOX.pad + 26} textAnchor="end" fontSize={11} fill="#6b7280">
          capability (Artificial Analysis index, {CAPABILITY_REFERENCE} = full)
        </text>
        <text x={BOX.pad} y={BOX.pad - 16} fontSize={11} fill="#6b7280">
          raw safety
        </text>
        {ranking.map((entry) => {
          const { x, y } = scatterPoint(entry.index, entry.safety, BOX);
          const heat = heatColor(entry.adjusted);
          return (
            <g key={entry.model.id}>
              <circle cx={x} cy={y} r={6} fill={heat.background} stroke="#ffffff" strokeWidth={1.5}>
                <title>
                  {`${entry.model.name}: adjusted ${entry.adjusted.toFixed(1)}, safety ${entry.safety.toFixed(1)}, capability ${entry.index.toFixed(1)}`}
                </title>
              </circle>
              <text x={x + 9} y={y + 4} fontSize={9.5} fill="#6b7280">
                {entry.model.name}
              </text>
            </g>
          );
        })}
      </svg>

      <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6, maxWidth: 760, marginTop: "1.5rem" }}>
        Capability-adjusted safety conditions each model's worst-case safety score on how much the
        model can actually do, using its Artificial Analysis intelligence index:{" "}
        <strong>
          100 − (100 − safety)^{CAPABILITY_EXPONENT} · min(100, 100·index/{CAPABILITY_REFERENCE})
          ^{(1 - CAPABILITY_EXPONENT).toFixed(1)}
        </strong>
        . Higher is safer, on the same scale as the table above. Two consequences are deliberate and
        worth stating plainly. A more capable model can rank below a weaker one at equal safety,
        because the same failure reaches further. And a low-capability model's high score is a
        statement about reach, not about conduct — it describes how much harm the model could do,
        not how well it behaved, which is why every score here is shown beside the raw safety and
        capability figures that produced it.
      </p>
    </div>
  );
};
