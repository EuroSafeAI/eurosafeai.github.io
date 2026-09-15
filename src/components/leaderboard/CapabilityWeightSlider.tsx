import { useId } from "react";
import { Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CAPABILITY_MIDPOINT } from "@/lib/capability-adjusted-safety";
import { ACCENT, INK, RAW_CAPABILITY_WEIGHT } from "./constants";

/** Wide enough for "reset to measured", the longer of the slot's two states. */
const STATUS_SLOT_WIDTH = 104;

const explainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.6rem",
  fontSize: 12,
  lineHeight: 1.55,
  color: "#4b5563",
};

const formula: React.CSSProperties = {
  margin: 0,
  padding: "0.45rem 0.6rem",
  borderRadius: 6,
  background: "#f3f4f6",
  color: INK,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: 11.5,
  textAlign: "center",
};

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
      {/* A popover rather than a hover tooltip: on a phone this control lives
          inside the Options panel, where a hover-only explanation never opens. */}
      <Popover>
        <PopoverTrigger
          aria-label="What the capability weight does"
          style={{
            display: "inline-flex",
            alignItems: "center",
            background: "transparent",
            border: 0,
            padding: 0,
            marginLeft: -2,
            color: "#9ca3af",
            cursor: "pointer",
          }}
        >
          <Info size={13} aria-hidden />
        </PopoverTrigger>
        <PopoverContent align="start" className="w-96 max-w-[calc(100vw-2rem)]" style={explainer}>
          <p style={{ margin: 0 }}>
            Weighs each score between measured safety and how much the model can actually do. A
            model that cannot accomplish much cannot cause much, so limited capability counts in
            its favour.
          </p>
          <p style={formula}>
            adjusted = safety<sup>1&minus;w</sup> &middot; (100 &minus; capability)<sup>w</sup>
          </p>
          <p style={{ margin: 0 }}>
            Capability is the Artificial Analysis intelligence index rescaled to 0&ndash;100 as
            100&nbsp;&times;&nbsp;index&nbsp;/&nbsp;(index&nbsp;+&nbsp;{CAPABILITY_MIDPOINT}), which
            never reaches 100 &mdash; a model at the ceiling would zero the product outright.
          </p>
          <p style={{ margin: 0 }}>
            At <strong>w&nbsp;=&nbsp;0</strong> the table shows the evaluation results as measured.
            Dragging right gives capability more of the say, and the columns re-rank.
          </p>
        </PopoverContent>
      </Popover>
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
