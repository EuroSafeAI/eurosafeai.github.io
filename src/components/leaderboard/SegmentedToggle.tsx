import { useId, useRef } from "react";
import { ACCENT, INK } from "./constants";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedToggleProps<T extends string> {
  label: string;
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

/**
 * An ARIA radiogroup rendered as a segmented control. Selection and focus move
 * together under the arrow keys, and Tab reaches only the checked option, as
 * the radiogroup pattern requires.
 */
export function SegmentedToggle<T extends string>({
  label,
  options,
  value,
  onChange,
}: SegmentedToggleProps<T>) {
  const labelId = useId();
  const buttons = useRef(new Map<T, HTMLButtonElement>());

  const selectByOffset = (offset: number) => {
    const index = options.findIndex((o) => o.value === value);
    const next = options[(index + offset + options.length) % options.length];
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
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <span id={labelId} style={{ fontSize: "0.7rem", fontWeight: 600, color: "#6b7280" }}>
        {label}
      </span>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        onKeyDown={onKeyDown}
        style={{ display: "flex", gap: 2, background: "#f3f4f6", borderRadius: 6, padding: 2 }}
      >
        {options.map((option) => {
          const checked = option.value === value;
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
}
