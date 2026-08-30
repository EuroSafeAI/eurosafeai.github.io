import { useMemo } from "react";
import type { ModelEntry } from "@/data/models.types";
import {
  PUBLISHED_CAPABILITY_WEIGHT,
  CAPABILITY_MIDPOINT,
  adjustedRanking,
  indexDomain,
  scatterPoint,
  type ScatterBox,
} from "@/lib/capability-adjusted-safety";

const INK = "#0a1f4d";

/**
 * Where a model was built. An independent dimension: unlike the adjusted
 * grade, it cannot be read off the two axes, so it is worth the plot's only
 * spare visual channel.
 */
const REGION_COLOUR: Record<string, string> = {
  US: "#2563eb",
  China: "#dc2626",
  EU: "#f59e0b",
};
const REGION_FALLBACK = "#6b7280";
const BOX: ScatterBox = { width: 640, height: 340, pad: 44 };

export const CapabilityAdjustedSection = ({ models }: { models: ModelEntry[] }) => {
  // Plotted at the published exponent: the leaderboard below carries the
  // interactive weight, and this stays the fixed reference it is cited as.
  const ranking = useMemo(() => adjustedRanking(models, PUBLISHED_CAPABILITY_WEIGHT), [models]);
  const domain = useMemo(() => indexDomain(models), [models]);
  const regions = useMemo(
    () => [...new Set(models.map((m) => m.region))].filter((r) => r in REGION_COLOUR),
    [models]
  );

  return (
    <div>

      <svg
        viewBox={`0 0 ${BOX.width} ${BOX.height}`}
        role="img"
        aria-label="Raw safety against the Artificial Analysis intelligence index, one point per model, coloured by region"
        style={{ width: "100%", maxWidth: BOX.width, height: "auto" }}
      >
        <line x1={BOX.pad} y1={BOX.height - BOX.pad} x2={BOX.width - BOX.pad} y2={BOX.height - BOX.pad} stroke="rgba(10,31,77,0.2)" />
        <line x1={BOX.pad} y1={BOX.pad} x2={BOX.pad} y2={BOX.height - BOX.pad} stroke="rgba(10,31,77,0.2)" />
        <text x={BOX.width - BOX.pad} y={BOX.height - BOX.pad + 26} textAnchor="end" fontSize={11} fill="#6b7280">
          Artificial Analysis intelligence index ({domain.min.toFixed(0)} to{" "}
          {domain.max.toFixed(0)})
        </text>
        <text x={BOX.pad} y={BOX.pad - 16} fontSize={11} fill="#6b7280">
          raw safety
        </text>
        {ranking.map((entry) => {
          const { x, y } = scatterPoint(entry.index, entry.safety, BOX, domain);
          const colour = REGION_COLOUR[entry.model.region] ?? REGION_FALLBACK;
          return (
            <g key={entry.model.id}>
              <circle cx={x} cy={y} r={6} fill={colour} stroke="#ffffff" strokeWidth={1.5}>
                <title>
                  {`${entry.model.name} (${entry.model.region}): adjusted ${entry.adjusted.toFixed(1)}, safety ${entry.safety.toFixed(1)}, intelligence index ${entry.index.toFixed(1)}`}
                </title>
              </circle>
              <text x={x + 9} y={y + 4} fontSize={9.5} fill="#6b7280">
                {entry.model.name}
              </text>
            </g>
          );
        })}
      </svg>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
        {regions.map((region) => (
          <span key={region} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#6b7280" }}>
            <span
              aria-hidden
              style={{ width: 9, height: 9, borderRadius: "50%", background: REGION_COLOUR[region] }}
            />
            {region}
          </span>
        ))}
      </div>

      <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6, maxWidth: 760, marginTop: "1.5rem" }}>
        A safety score measures how often a model refuses a harmful request. It does not measure
        what happens when it complies. A model that rarely refuses but cannot produce anything
        usable is a nuisance; one that almost always refuses, then writes working attack code on
        the exception, is a systemic risk. The EU AI Act draws the same line, presuming systemic
        risk from high-impact capabilities rather than from behaviour alone.
      </p>
      <p style={{ fontSize: 12.5, color: "#6b7280", lineHeight: 1.7, maxWidth: 760, marginBottom: "0.75rem" }}>
        So capability has to be measured and combined in, not inferred from how a model behaves.
        This score does that, weighing how safely a model acted against how little it can reach:
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
