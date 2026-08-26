import type { Aggregation } from "@/lib/scoring";
import { ACCENT, INK } from "./constants";

export interface MetricToggleProps {
  metric: Aggregation;
  onChange: (metric: Aggregation) => void;
}

const OPTIONS: { value: Aggregation; label: string }[] = [
  { value: "worst", label: "Worst case" },
  { value: "mean", label: "Average" },
];

/** Switches which metric the grid, its colours, and its column order use. */
export const MetricToggle: React.FC<MetricToggleProps> = ({ metric, onChange }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.5rem" }}>
    <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#6b7280" }}>Score shown</span>
    <div
      role="radiogroup"
      aria-label="Score shown"
      style={{ display: "flex", gap: 2, background: "#f3f4f6", borderRadius: 6, padding: 2 }}
    >
      {OPTIONS.map((option) => {
        const checked = option.value === metric;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={checked}
            onClick={() => onChange(option.value)}
            style={{
              border: 0,
              borderRadius: 5,
              padding: "0.3rem 0.6rem",
              fontSize: "0.72rem",
              fontWeight: 600,
              cursor: "pointer",
              background: checked ? ACCENT : "transparent",
              color: checked ? "#ffffff" : INK,
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  </div>
);
