import { useId } from "react";
import { ACCENT, INK, RAW_ALPHA } from "./constants";

export interface AlphaSliderProps {
  alpha: number;
  onChange: (alpha: number) => void;
}

/**
 * Weights the grid between measured safety and capability-discounted safety.
 * At RAW_ALPHA the adjustment is the identity and the grid shows evaluation
 * results; below it, a model's unsafety is discounted by how much it can
 * actually do, and the columns re-rank accordingly.
 */
export const AlphaSlider: React.FC<AlphaSliderProps> = ({ alpha, onChange }) => {
  const id = useId();
  const isRaw = alpha === RAW_ALPHA;

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
        value={alpha}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-valuetext={isRaw ? "1.00, measured safety" : `${alpha.toFixed(2)}, capability-adjusted`}
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
        {alpha.toFixed(2)}
      </span>
      {isRaw ? (
        <span style={{ fontSize: "0.66rem", color: "#9ca3af" }}>measured</span>
      ) : (
        <button
          type="button"
          onClick={() => onChange(RAW_ALPHA)}
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
    </div>
  );
};
