import { useMemo } from "react";
import type { ModelEntry } from "@/data/models.types";
import { scoreOverall } from "@/lib/scoring";
import {
  PUBLISHED_CAPABILITY_WEIGHT,
  adjustedRanking,
  attainableFrontier,
  indexDomain,
  planeMedians,
  scatterPoint,
  type ScatterBox,
} from "@/lib/capability-adjusted-safety";


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
const BOX: ScatterBox = { width: 820, height: 430, pad: 48 };

export const CapabilityAdjustedSection = ({ models }: { models: ModelEntry[] }) => {
  // Plotted at the published exponent: the leaderboard below carries the
  // interactive weight, and this stays the fixed reference it is cited as.
  const ranking = useMemo(() => adjustedRanking(models, PUBLISHED_CAPABILITY_WEIGHT), [models]);
  const domain = useMemo(() => indexDomain(models), [models]);
  const medians = useMemo(() => planeMedians(models), [models]);
  const frontier = useMemo(() => attainableFrontier(models), [models]);
  const regions = useMemo(
    () => [...new Set(models.map((m) => m.region))].filter((r) => r in REGION_COLOUR),
    [models]
  );

  return (
    // Two columns so the plot can use the leaderboard's full width and the
    // explanation sits beside it rather than pushing the grid down the page.
    // flexWrap with a basis rather than a JS breakpoint: the columns stack on
    // their own once there is no room for both.
    <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", alignItems: "flex-start" }}>
      <div style={{ flex: "1 1 620px", minWidth: 0 }}>
      <svg
        viewBox={`0 0 ${BOX.width} ${BOX.height}`}
        role="img"
        aria-label="Raw safety against the Artificial Analysis intelligence index, one point per model, coloured by region"
        // No maxWidth: the viewBox is a coordinate system, not a size cap, and
        // capping it left the plot floating in its column.
        style={{ width: "100%", height: "auto" }}
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
        {medians && (
          <g>
            {/* The concern region: more capable than half the field, less safe
                than half of it. Shaded rather than outlined so it reads as
                context behind the models, not as another datum. */}
            <rect
              x={scatterPoint(medians.index, 0, BOX, domain).x}
              y={scatterPoint(0, medians.safety, BOX, domain).y}
              width={BOX.width - BOX.pad - scatterPoint(medians.index, 0, BOX, domain).x}
              height={BOX.height - BOX.pad - scatterPoint(0, medians.safety, BOX, domain).y}
              fill="rgba(220,38,38,0.05)"
            />
            <line
              x1={scatterPoint(medians.index, 0, BOX, domain).x}
              y1={BOX.pad}
              x2={scatterPoint(medians.index, 0, BOX, domain).x}
              y2={BOX.height - BOX.pad}
              stroke="rgba(10,31,77,0.12)"
              strokeDasharray="4 4"
            />
            <line
              x1={BOX.pad}
              y1={scatterPoint(0, medians.safety, BOX, domain).y}
              x2={BOX.width - BOX.pad}
              y2={scatterPoint(0, medians.safety, BOX, domain).y}
              stroke="rgba(10,31,77,0.12)"
              strokeDasharray="4 4"
            />
            <text
              x={BOX.width - BOX.pad - 6}
              y={BOX.height - BOX.pad - 8}
              textAnchor="end"
              fontSize={10.5}
              fill="#b91c1c"
            >
              more capable, less safe than the field median
            </text>
          </g>
        )}
        {frontier.length > 1 && (
          <polyline
            points={frontier
              .map((m) => {
                const point = scatterPoint(m.aa_intelligence_index, scoreOverall(m)!, BOX, domain);
                return `${point.x},${point.y}`;
              })
              .join(" ")}
            fill="none"
            stroke="rgba(10,31,77,0.3)"
            strokeWidth={1.5}
            strokeDasharray="6 3"
          />
        )}
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
      </div>

      <div style={{ flex: "1 1 320px", minWidth: 0, maxWidth: 460 }}>
        <p style={{ fontSize: 12.5, color: "#6b7280", lineHeight: 1.7, marginBottom: "0.75rem" }}>
          A safety score measures how often a model refuses a harmful request. It does not measure
          what happens when it complies, and the EU AI Act presumes systemic risk from
          high-impact capabilities rather than from behaviour alone. Reach and conduct are
          separate axes, so they are drawn separately here.
        </p>
        <p style={{ fontSize: 12.5, color: "#6b7280", lineHeight: 1.7, marginBottom: "0.75rem" }}>
          The shaded corner holds the models that are more capable and less safe than half the
          field. The dashed line traces those nothing else beats on both counts: it stays close to
          flat, so the safest model at high capability gives up almost nothing against the safest
          at low capability. A capable model scoring badly here is a choice, not a cost of being
          capable.
        </p>
        <p style={{ fontSize: 12.5, color: "#6b7280", lineHeight: 1.7 }}>
          Both reference lines are medians of this roster, not thresholds, so they move as models
          are added. Combining the two axes into one capability-adjusted grade is explained under
          Methodology.
        </p>
      </div>
    </div>
  );
};