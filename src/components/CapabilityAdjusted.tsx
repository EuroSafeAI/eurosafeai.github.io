import { useMemo } from "react";
import { useReducedMotion } from "framer-motion";
import type { ModelEntry } from "@/data/models.types";
import { ACCENT } from "@/components/leaderboard/constants";
import {
  PUBLISHED_CAPABILITY_WEIGHT,
  adjustedRanking,
  indexDomain,
  axisTicks,
  planeMedians,
  spreadLabels,
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
const LABEL_LINE_HEIGHT = 11;

export const CapabilityAdjustedSection = ({
  models,
  highlight,
}: {
  models: ModelEntry[];
  /** A provider or model name to pick out, mirroring the grid below. */
  highlight?: string | null;
}) => {
  const reduced = useReducedMotion() ?? false;
  // Plotted at the published exponent: the leaderboard below carries the
  // interactive weight, and this stays the fixed reference it is cited as.
  const ranking = useMemo(() => adjustedRanking(models, PUBLISHED_CAPABILITY_WEIGHT), [models]);
  const domain = useMemo(() => indexDomain(models), [models]);
  const medians = useMemo(() => planeMedians(models), [models]);

  // Label positions are stepped apart where they would collide. Roughly 5px
  // per character is enough to spot an overlap; exact text metrics are not
  // available without measuring in the DOM, and would not change the outcome.
  const labelY = useMemo(() => {
    const boxes = ranking.map((entry) => {
      const point = scatterPoint(entry.index, entry.safety, BOX, domain);
      return { x: point.x + 9, y: point.y + 4, width: entry.model.name.length * 5 };
    });
    return spreadLabels(boxes, LABEL_LINE_HEIGHT);
  }, [ranking, domain]);
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
        {/* Ticks and gridlines: the axes carried a title each and no values,
            so a point's position could not be read off them. */}
        {axisTicks(domain.min, domain.max, 6).map((tick) => {
          const { x } = scatterPoint(tick, 0, BOX, domain);
          return (
            <g key={`x-${tick}`}>
              <line x1={x} y1={BOX.height - BOX.pad} x2={x} y2={BOX.height - BOX.pad + 5} stroke="rgba(10,31,77,0.3)" />
              <text x={x} y={BOX.height - BOX.pad + 17} textAnchor="middle" fontSize={10} fill="#9ca3af">
                {tick.toFixed(0)}
              </text>
            </g>
          );
        })}
        {axisTicks(0, 100, 5).map((tick) => {
          const { y } = scatterPoint(domain.min, tick, BOX, domain);
          return (
            <g key={`y-${tick}`}>
              <line x1={BOX.pad} y1={y} x2={BOX.width - BOX.pad} y2={y} stroke="rgba(10,31,77,0.05)" />
              <line x1={BOX.pad - 5} y1={y} x2={BOX.pad} y2={y} stroke="rgba(10,31,77,0.3)" />
              <text x={BOX.pad - 9} y={y + 3.5} textAnchor="end" fontSize={10} fill="#9ca3af">
                {tick.toFixed(0)}
              </text>
            </g>
          );
        })}
        <text x={BOX.width - BOX.pad} y={BOX.height - BOX.pad + 34} textAnchor="end" fontSize={11} fontWeight={600} fill="#6b7280">
          more capable, by Artificial Analysis intelligence index
        </text>
        <text x={BOX.pad - 9} y={BOX.pad - 14} textAnchor="start" fontSize={11} fontWeight={600} fill="#6b7280">
          safer, worst-case score out of 100
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
        {ranking.map((entry, i) => {
          const { x, y } = scatterPoint(entry.index, entry.safety, BOX, domain);
          const textY = labelY[i];
          const colour = REGION_COLOUR[entry.model.region] ?? REGION_FALLBACK;
          // The grid groups by organisation or by model, so a highlight can
          // name either. Matching both means one prop serves both modes.
          const picked =
            !highlight ||
            entry.model.company === highlight ||
            entry.model.name === highlight;
          return (
            <g
              key={entry.model.id}
              opacity={picked ? 1 : 0.18}
              data-picked={picked}
              // Eased rather than instant: a hover that snaps the whole plot
              // reads as a glitch, and the eye needs a moment to follow which
              // points survived.
              style={{ transition: reduced ? undefined : "opacity 0.22s ease" }}
            >
              <circle
                cx={x}
                cy={y}
                r={picked && highlight ? 8 : 6}
                style={{ transition: reduced ? undefined : "r 0.22s ease" }} fill={colour} stroke="#ffffff" strokeWidth={1.5}>
                <title>
                  {`${entry.model.name} (${entry.model.region}): adjusted ${entry.adjusted.toFixed(1)}, safety ${entry.safety.toFixed(1)}, intelligence index ${entry.index.toFixed(1)}`}
                </title>
              </circle>
              {/* A leader line where the label had to move, so it stays
                  attached to the dot it names. */}
              {Math.abs(textY - (y + 4)) > 1 && (
                <line x1={x + 6} y1={y} x2={x + 8} y2={textY - 3} stroke="rgba(10,31,77,0.25)" />
              )}
              <text x={x + 9} y={textY} fontSize={9.5} fill="#6b7280">
                {entry.model.name}
              </text>
            </g>
          );
        })}
      </svg>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "0.5rem", alignItems: "center" }}>
        {/* The shaded corner is the one mark a reader cannot infer from the
            axes, so it is named here rather than only in the prose. */}
        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#6b7280" }}>
          <span aria-hidden style={{ width: 14, height: 10, background: "rgba(220,38,38,0.12)", borderRadius: 2 }} />
          more capable, less safe than the median
        </span>
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
          field.
        </p>
        <p style={{ fontSize: 12.5, color: "#6b7280", lineHeight: 1.7 }}>
          Both reference lines are medians of this roster, not thresholds, so they move as models
          are added. Combining the two axes into one capability-adjusted grade is explained under{" "}
          <a href="#methodology" style={{ color: ACCENT, textDecoration: "underline", textUnderlineOffset: 2 }}>Methodology</a>.
        </p>
      </div>
    </div>
  );
};