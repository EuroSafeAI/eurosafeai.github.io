import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ModelEntry } from "@/data/models.types";
import { heatColor } from "@/lib/heat";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  CAPABILITY_EXPONENT,
  CAPABILITY_REFERENCE,
  adjustedRanking,
  scatterPoint,
  type AdjustedEntry,
  type ScatterBox,
} from "@/lib/risk-index";

const INK = "#0a1f4d";
const BOX: ScatterBox = { width: 640, height: 340, pad: 44 };
const ROW_HEIGHT = 34;

export const CapabilityAdjustedSection = ({ models }: { models: ModelEntry[] }) => {
  const [alpha, setAlpha] = useState(CAPABILITY_EXPONENT);
  const reducedMotion = useReducedMotion() ?? false;
  const isMobile = useIsMobile();

  // The scatter is alpha-independent (its axes are raw safety and capability),
  // so its ranking only needs computing once at the published exponent.
  const scatterRanking = useMemo(() => adjustedRanking(models, CAPABILITY_EXPONENT), [models]);

  // Rows keep a stable DOM order across alpha changes — sorted by id here, not
  // by score — so React never remounts a row; only its rank (and therefore its
  // translateY) changes, which is what lets the reorder animate on the
  // compositor instead of re-flowing the list.
  const stableOrder = useMemo(
    () => [...scatterRanking].sort((a, b) => a.model.id.localeCompare(b.model.id)),
    [scatterRanking]
  );

  const currentRanking = useMemo(() => adjustedRanking(models, alpha), [models, alpha]);
  const rankById = useMemo(() => {
    const ranks = new Map<string, number>();
    currentRanking.forEach((entry, rank) => ranks.set(entry.model.id, rank));
    return ranks;
  }, [currentRanking]);
  const entryById = useMemo(
    () => new Map(currentRanking.map((entry) => [entry.model.id, entry])),
    [currentRanking]
  );

  const isDefaultAlpha = alpha === CAPABILITY_EXPONENT;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: "0.75rem", flexWrap: "wrap" }}>
        <label htmlFor="capability-alpha" style={{ fontSize: 12.5, color: INK, fontWeight: 600 }}>
          α sensitivity: {alpha.toFixed(2)}
        </label>
        <input
          id="capability-alpha"
          role="slider"
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={alpha}
          onChange={(e) => setAlpha(Number(e.target.value))}
          style={{ flex: "1 1 160px", maxWidth: 260 }}
        />
        {!isDefaultAlpha && (
          <button
            type="button"
            onClick={() => setAlpha(CAPABILITY_EXPONENT)}
            style={{
              fontSize: 11.5,
              color: INK,
              background: "rgba(10,31,77,0.06)",
              border: "none",
              borderRadius: 4,
              padding: "2px 8px",
              cursor: "pointer",
            }}
          >
            reset to published ({CAPABILITY_EXPONENT})
          </button>
        )}
      </div>

      <div
        style={{
          position: "relative",
          height: stableOrder.length * ROW_HEIGHT,
          marginBottom: "2rem",
        }}
      >
        {stableOrder.map((stableEntry) => {
          const entry = entryById.get(stableEntry.model.id) as AdjustedEntry;
          const rank = rankById.get(stableEntry.model.id) ?? 0;
          const heat = heatColor(entry.adjusted);
          return (
            <div
              key={entry.model.id}
              data-rank={rank}
              title={`Matched to ${entry.model.aa_model_match}`}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: ROW_HEIGHT,
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "flex-start" : "center",
                justifyContent: "center",
                gap: isMobile ? 2 : 12,
                fontSize: 12.5,
                transform: `translateY(${rank * ROW_HEIGHT}px)`,
                transition: reducedMotion ? "none" : "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", minWidth: 0 }}>
                <span style={{ flex: "0 1 170px", minWidth: 0, color: INK, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {entry.model.name}
                </span>
                <span style={{ flex: 1, minWidth: 0, height: 18, background: "rgba(10,31,77,0.05)", borderRadius: 4, overflow: "hidden" }}>
                  <motion.span
                    style={{
                      display: "block",
                      height: "100%",
                      width: "100%",
                      transformOrigin: "left",
                      background: heat.background,
                      borderRadius: 4,
                    }}
                    animate={{ scaleX: entry.adjusted / 100 }}
                    transition={reducedMotion ? { duration: 0 } : { duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  />
                </span>
                <span style={{ flex: "0 0 46px", textAlign: "right", fontWeight: 700, color: INK, fontVariantNumeric: "tabular-nums" }}>
                  {entry.adjusted.toFixed(1)}
                </span>
                {!isMobile && (
                  <span style={{ flex: "0 1 190px", minWidth: 0, color: "#6b7280", fontVariantNumeric: "tabular-nums" }}>
                    safety {entry.safety.toFixed(1)} · capability {entry.index.toFixed(1)}
                  </span>
                )}
              </div>
              {isMobile && (
                <span style={{ color: "#6b7280", fontVariantNumeric: "tabular-nums", fontSize: 11 }}>
                  safety {entry.safety.toFixed(1)} · capability {entry.index.toFixed(1)}
                </span>
              )}
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
        {scatterRanking.map((stableEntry) => {
          const entry = entryById.get(stableEntry.model.id) as AdjustedEntry;
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
        . Higher is safer, on the same scale as the table above. α = {CAPABILITY_EXPONENT} is the
        published figure; the slider above lets you explore how much the ranking depends on that
        choice, without changing what is published. At α = 1 the number is raw safety; at α = 0 it
        is pure capability, inverted. Two consequences are deliberate and worth stating plainly. A
        more capable model can rank below a weaker one at equal safety, because the same failure
        reaches further. And a low-capability model's high score is a statement about reach, not
        about conduct — it describes how much harm the model could do, not how well it behaved,
        which is why every score here is shown beside the raw safety and capability figures that
        produced it, at every value of α.
      </p>
    </div>
  );
};
