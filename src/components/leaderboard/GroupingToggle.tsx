import type { Grouping } from "@/lib/leaderboard";
import { SegmentedToggle, type SegmentedOption } from "./SegmentedToggle";

export interface GroupingToggleProps {
  grouping: Grouping;
  onChange: (grouping: Grouping) => void;
}

const OPTIONS: readonly SegmentedOption<Grouping>[] = [
  { value: "org", label: "Organisation" },
  { value: "model", label: "Model" },
];

/**
 * Switches the columns between one per organisation, expandable into its
 * models, and one per model standing alone.
 */
export const GroupingToggle: React.FC<GroupingToggleProps> = ({ grouping, onChange }) => (
  <SegmentedToggle label="Group by" options={OPTIONS} value={grouping} onChange={onChange} />
);
