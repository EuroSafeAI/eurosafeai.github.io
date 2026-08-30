import { useMemo } from "react";
import type { ModelEntry } from "@/data/models.types";
import { heatColor } from "@/lib/heat";
import {
  PUBLISHED_CAPABILITY_WEIGHT,
  CAPABILITY_MIDPOINT,
  adjustedRanking,
  scatterPoint,
  type ScatterBox,
} from "@/lib/capability-adjusted-safety";

const INK = "#0a1f4d";
const BOX: ScatterBox = { width: 640, height: 340, pad: 44 };

export const CapabilityAdjustedSection = ({ models }: { models: ModelEntry[] }) => {
  // Plotted at the published exponent: the leaderboard below carries the
  // interactive weight, and this stays the fixed reference it is cited as.
  const ranking = useMemo(() => adjustedRanking(models, PUBLISHED_CAPABILITY_WEIGHT), [models]);

  return (
    <div>

      <svg
        viewBox={`0 0 ${BOX.width} ${BOX.height}`}
        role="img"
        aria-label="Raw safety against capability, coloured by capability-adjusted grade, one point per model"
        style={{ width: "100%", maxWidth: BOX.width, height: "auto" }}
      >
        <line x1={BOX.pad} y1={BOX.height - BOX.pad} x2={BOX.width - BOX.pad} y2={BOX.height - BOX.pad} stroke="rgba(10,31,77,0.2)" />
        <line x1={BOX.pad} y1={BOX.pad} x2={BOX.pad} y2={BOX.height - BOX.pad} stroke="rgba(10,31,77,0.2)" />
        <text x={BOX.width - BOX.pad} y={BOX.height - BOX.pad + 26} textAnchor="end" fontSize={11} fill="#6b7280">
          capability (Artificial Analysis index, {CAPABILITY_MIDPOINT} = full)
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
        A model that cannot do much cannot do much harm. This score combines how safely a model
        behaved with how little it can reach:
      </p>
      <p
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: INK,
          margin: "0 0 0.75rem",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        safety<sup>{(1 - PUBLISHED_CAPABILITY_WEIGHT).toFixed(2)}</sup> ×  (100 −
        capability)<sup>{PUBLISHED_CAPABILITY_WEIGHT.toFixed(2)}</sup>
      </p>
      <p style={{ fontSize: 12.5, color: "#6b7280", lineHeight: 1.7, maxWidth: 760, marginBottom: "0.75rem" }}>
        Capability rescales the Artificial Analysis intelligence index onto 0 to 100, as
        100·index / (index + {CAPABILITY_MIDPOINT}). Both terms mean higher is better, so the
        result does too, on the same scale as the table below.
      </p>
      <p style={{ fontSize: 12.5, color: "#6b7280", lineHeight: 1.7, maxWidth: 760, marginBottom: "0.75rem" }}>
        {PUBLISHED_CAPABILITY_WEIGHT.toFixed(2)} is the published weight. The slider below the
        table changes it without changing what is published: at 0 the score is measured safety
        alone, at 1 it is capability alone.
      </p>
      <p style={{ fontSize: 12.5, color: "#6b7280", lineHeight: 1.7, maxWidth: 760 }}>
        Two consequences are deliberate. A more capable model can rank below a weaker one at
        equal safety, because the same failure reaches further. And a low-capability model's high
        score is a statement about reach, not about conduct: how much harm it could do, not how
        well it behaved. Every score appears beside the raw safety and capability figures behind
        it.
      </p>
    </div>
  );
};
