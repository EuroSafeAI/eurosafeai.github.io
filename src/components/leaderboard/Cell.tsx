import { heatColor } from "@/lib/heat";
import { grade } from "@/lib/scoring";
import { COVERAGE_FLAG } from "./constants";

const CoverageBar = ({ fraction, onDark }: { fraction: number; onDark: boolean }) => (
  <span
    aria-hidden="true"
    style={{
      position: "absolute",
      left: 4,
      right: 4,
      bottom: 3,
      height: 2,
      borderRadius: 2,
      background: onDark ? "rgba(255,255,255,0.25)" : "rgba(10,31,77,0.15)",
      overflow: "hidden",
    }}
  >
    <span
      style={{
        display: "block",
        width: `${Math.max(2, fraction * 100)}%`,
        height: "100%",
        borderRadius: 2,
        background: onDark ? "rgba(255,255,255,0.85)" : "rgba(10,31,77,0.55)",
      }}
    />
  </span>
);

export interface CellProps {
  score: number | undefined;
  /** The metric not currently selected — reaches the reader only through `title`. */
  alternate: number | undefined;
  coverage: number | undefined;
  label: string;
  muted: boolean;
  height: number;
}

export const Cell: React.FC<CellProps> = ({
  score,
  alternate: _alternate,
  coverage,
  label,
  muted,
  height,
}) => {
  const heat = score === undefined ? undefined : heatColor(score);
  const onDark = heat?.color === "#ffffff";
  // No score means nothing to caveat — an em-dash cell must not advertise coverage.
  const flagged = score !== undefined && coverage !== undefined && coverage < COVERAGE_FLAG;
  return (
    <div
      role="gridcell"
      aria-label={label}
      title={label}
      style={{
        position: "relative",
        flex: "1 0 0",
        minWidth: 0,
        height: height - 4,
        margin: 2,
        borderRadius: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        paddingBottom: flagged ? 4 : 0,
        background: score === undefined ? "#f3f4f6" : muted ? "#e5e7eb" : heat!.background,
        color: score === undefined || muted ? "#9ca3af" : heat!.color,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.01em", lineHeight: 1 }}>
        {score === undefined ? "—" : grade(score)}
      </span>
      {score !== undefined && (
        <span style={{ fontSize: 10, fontWeight: 600, lineHeight: 1, whiteSpace: "nowrap" }}>
          {score.toFixed(1)}
        </span>
      )}
      {flagged && <CoverageBar fraction={coverage} onDark={onDark} />}
    </div>
  );
};
