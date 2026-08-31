import { useId } from "react";
import { ACCENT, INK, RAW_CAPABILITY_WEIGHT } from "./constants";

/** Wide enough for "reset to measured", the longer of the slot's two states. */
const STATUS_SLOT_WIDTH = 104;

export interface CapabilityWeightSliderProps {
  weight: number;
  onChange: (weight: number) => void;
}

/**
 * Weighs the grid between measured safety and how much each model can
 * actually do. At RAW_CAPABILITY_WEIGHT the adjustment is the identity and
 * the grid shows evaluation results; dragging right gives capability more of
 * the say, and the columns re-rank.
 */
export const CapabilityWeightSlider: React.FC<CapabilityWeightSliderProps> = ({
  weight,
  onChange,
}) => {
  const id = useId();
  const isRaw = weight === RAW_CAPABILITY_WEIGHT;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
      <label htmlFor={id} style={{ fontSize: "0.7rem", fontWeight: 600, color: "#6b7280" }}>
        Capability weight
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={weight}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-valuetext={
          isRaw ? "0.00, measured safety" : `${weight.toFixed(2)}, capability-adjusted`
        }
        style={{ width: 132, accentColor: ACCENT, cursor: "pointer" }}
      />
      <span
        style={{
          fontSize: "0.7rem",
          fontWeight: 700,
          color: isRaw ? "#6b7280" : INK,
          fontVariantNumeric: "tabular-nums",
          minWidth: 30,
        }}
      >
        {weight.toFixed(2)}
      </span>
      {/* Fixed width, sized to the wider "reset to measured" label: this slot
          swaps content, and in a right-aligned row an intrinsic width change
          here would shift the slider itself sideways as you reach the end. */}
      <span style={{ width: STATUS_SLOT_WIDTH, flexShrink: 0 }} data-weight-status>
        {isRaw ? (
          <span style={{ fontSize: "0.66rem", color: "#9ca3af" }}>measured</span>
        ) : (
          <button
            type="button"
            onClick={() => onChange(RAW_CAPABILITY_WEIGHT)}
            style={{
              fontSize: "0.66rem",
              fontWeight: 600,
              color: ACCENT,
              background: "transparent",
              border: 0,
              padding: 0,
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            reset to measured
          </button>
        )}
      </span>
    </div>
  );
};
