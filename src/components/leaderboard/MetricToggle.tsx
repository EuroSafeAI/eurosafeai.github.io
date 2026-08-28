import type { Aggregation } from "@/lib/scoring";
import { SegmentedToggle, type SegmentedOption } from "./SegmentedToggle";

export interface MetricToggleProps {
  metric: Aggregation;
  onChange: (metric: Aggregation) => void;
}

const OPTIONS: readonly SegmentedOption<Aggregation>[] = [
  { value: "worst", label: "Worst case" },
  { value: "mean", label: "Average" },
];

/** Switches which metric the grid, its colours, and its column order use. */
export const MetricToggle: React.FC<MetricToggleProps> = ({ metric, onChange }) => (
  <SegmentedToggle label="Score shown" options={OPTIONS} value={metric} onChange={onChange} />
);
