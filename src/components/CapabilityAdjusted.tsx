import { useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useElementWidth } from "@/hooks/use-element-width";
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
/**
 * The plot's height is fixed and its width tracks its column.
 *
 * A fixed viewBox scaled to fill the column made the plot grow *taller* as the
 * page widened, 573px at 1680 and 699px at 1920, which is what stopped it
 * fitting on screen beside the grid. Matching the coordinate system to the
 * rendered box keeps the height constant and spreads the points sideways
 * instead, and stops the labels scaling up with it.
 */
const PLOT_HEIGHT = 420;
const PLOT_PAD = 48;
const FALLBACK_WIDTH = 820;
const LABEL_LINE_HEIGHT = 12;
const DOT_RADIUS = 6;
const LABEL_OFFSET = 11;
const CROSS_RADIUS = 5;

export const CapabilityAdjustedSection = ({
  models,
  highlight,
}: {
  models: ModelEntry[];
  /** A provider or model name to pick out, mirroring the grid below. */
  highlight?: string | null;
}) => {
  const reduced = useReducedMotion() ?? false;
  const [column, setColumn] = useState<HTMLElement | null>(null);
  const measured = useElementWidth(column);
  const BOX: ScatterBox = useMemo(
    () => ({ width: Math.max(FALLBACK_WIDTH, measured ?? FALLBACK_WIDTH), height: PLOT_HEIGHT, pad: PLOT_PAD }),
    [measured]
  );
  // Plotted at the published exponent: the leaderboard below carries the
  // interactive weight, and this stays the fixed reference it is cited as.
  const ranking = useMemo(() => adjustedRanking(models, PUBLISHED_CAPABILITY_WEIGHT), [models]);
  const domain = useMemo(() => indexDomain(models), [models]);
  const medians = useMemo(() => planeMedians(models), [models]);

  // Label positions are stepped apart where they would collide. Roughly 5px
  // per character is enough to spot an overlap; exact text metrics are not
  // available without measuring in the DOM, and would not change the outcome.
  const labels = useMemo(() => {
    const points = ranking.map((entry) => scatterPoint(entry.index, entry.safety, BOX, domain));
    // 6px per character, measured against the rendered plot: 5 under-counted
    // and let collisions through.
    const widths = ranking.map((entry) => entry.model.name.length * 6);

    // Left when the right would run past the plot, which four labels did.
    const onLeft = points.map((point, i) => point.x + LABEL_OFFSET + widths[i] > BOX.width - BOX.pad);
    const boxes = points.map((point, i) => ({
      x: onLeft[i] ? point.x - LABEL_OFFSET - widths[i] : point.x + LABEL_OFFSET,
      y: point.y + 4,
      width: widths[i],
    }));
    // Both markers are obstacles. Avoiding only the worst-case dots left
    // labels struck through by the crosses, which sit above them in the
    // crowded upper half of the plot.
    const obstacles = [
      ...points.map((p) => ({ ...p, r: DOT_RADIUS })),
      ...ranking.map((entry) => ({
        x: scatterPoint(entry.index, entry.averageSafety, BOX, domain).x,
        y: scatterPoint(entry.index, entry.averageSafety, BOX, domain).y,
        r: CROSS_RADIUS,
      })),
    ];
    const y = spreadLabels(boxes, LABEL_LINE_HEIGHT, obstacles);
    return ranking.map((_, i) => ({ y: y[i], onLeft: onLeft[i] }));
  }, [ranking, domain, BOX]);
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
      <div ref={setColumn} style={{ flex: "1 1 620px", minWidth: 0 }}>
      <svg
        viewBox={`0 0 ${BOX.width} ${BOX.height}`}
        role="img"
        aria-label="Raw safety against the Artificial Analysis intelligence index, one point per model, coloured by region"
        // No maxWidth: the viewBox is a coordinate system, not a size cap, and
        // capping it left the plot floating in its column.
        style={{ width: "100%", height: PLOT_HEIGHT }}
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
          safer, score out of 100 (worst case ● and average ✕)
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
          const { y: textY, onLeft } = labels[i];
          const colour = REGION_COLOUR[entry.model.region] ?? REGION_FALLBACK;
          // The grid groups by organisation or by model, so a highlight can
          // name either. Matching both means one prop serves both modes.
          const averageY = scatterPoint(entry.index, entry.averageSafety, BOX, domain).y;
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
                  {`${entry.model.name} (${entry.model.region}): worst case ${entry.safety.toFixed(1)}, average ${entry.averageSafety.toFixed(1)}, intelligence index ${entry.index.toFixed(1)}, adjusted ${entry.adjusted.toFixed(1)}`}
                </title>
              </circle>
              {/* Two readings of the same model: the score it holds under the
                  worst pressure applied, and its average across conditions.
                  Joined so the pair reads as one model rather than two. */}
              <line x1={x} y1={y} x2={x} y2={averageY} stroke={colour} strokeWidth={1.25} opacity={0.4} />
              <g stroke={colour} strokeWidth={1.75} opacity={0.85}>
                <line x1={x - 4} y1={averageY - 4} x2={x + 4} y2={averageY + 4} />
                <line x1={x - 4} y1={averageY + 4} x2={x + 4} y2={averageY - 4} />
              </g>
              {/* A leader line where the label had to move, so it stays
                  attached to the dot it names. */}
              {Math.abs(textY - (y + 4)) > 1 && (
                <line
                  x1={onLeft ? x - 6 : x + 6}
                  y1={y}
                  x2={onLeft ? x - 8 : x + 8}
                  y2={textY - 3}
                  stroke="rgba(10,31,77,0.25)"
                />
              )}
              <text
                x={onLeft ? x - LABEL_OFFSET : x + LABEL_OFFSET}
                y={textY}
                textAnchor={onLeft ? "end" : "start"}
                fontSize={9.5}
                fill="#6b7280"
              >
                {entry.model.name}
              </text>
            </g>
          );
        })}
      </svg>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "0.5rem", alignItems: "center" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#6b7280" }}>
          <svg width={14} height={12} aria-hidden>
            <circle cx={6} cy={6} r={5} fill="#6b7280" />
          </svg>
          worst case
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#6b7280" }}>
          <svg width={14} height={12} aria-hidden>
            <g stroke="#6b7280" strokeWidth={1.75}>
              <line x1={2} y1={2} x2={10} y2={10} />
              <line x1={2} y1={10} x2={10} y2={2} />
            </g>
          </svg>
          average
        </span>
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
          field. Each model is marked twice: a filled dot at its worst case, and a cross at its
          average. The gap between them is what adversarial pressure costs that model, and the
          dot can never sit above the cross, because the worst case takes each sample's lowest
          result. Capability is marked once; it is a single published figure, not a measurement
          made here.
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