import { useId, useRef } from "react";
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
export const MetricToggle: React.FC<MetricToggleProps> = ({ metric, onChange }) => {
  const labelId = useId();
  const buttons = useRef(new Map<Aggregation, HTMLButtonElement>());

  // Roving tabindex: arrow keys move both selection and focus together, per
  // the ARIA radiogroup pattern — Tab only ever lands on the checked option.
  const selectByOffset = (offset: number) => {
    const index = OPTIONS.findIndex((o) => o.value === metric);
    const next = OPTIONS[(index + offset + OPTIONS.length) % OPTIONS.length];
    onChange(next.value);
    buttons.current.get(next.value)?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      selectByOffset(1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      selectByOffset(-1);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.5rem" }}>
      <span id={labelId} style={{ fontSize: "0.7rem", fontWeight: 600, color: "#6b7280" }}>Score shown</span>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        onKeyDown={onKeyDown}
        style={{ display: "flex", gap: 2, background: "#f3f4f6", borderRadius: 6, padding: 2 }}
      >
        {OPTIONS.map((option) => {
          const checked = option.value === metric;
          return (
            <button
              key={option.value}
              ref={(el) => {
                if (el) buttons.current.set(option.value, el);
                else buttons.current.delete(option.value);
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={checked ? 0 : -1}
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
                outlineOffset: 2,
              }}
              // Focus ring is a CSS class, not inline: only a real
              // stylesheet rule can key off :focus-visible.
              className="leaderboard-metric-toggle-option"
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
