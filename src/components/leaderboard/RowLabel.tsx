import {
  BENCHMARK_DESCRIPTIONS,
  RISK_DESCRIPTIONS,
  judgeRowKind,
  rowLabel,
  type Row,
} from "@/lib/leaderboard";
import { ACCENT, DIAGNOSTIC_NOTE, FLOOR_NOTE, INDENT, INK, ROW_HEIGHT } from "./constants";
import { Chevron } from "./Chevron";

const isExpandable = (row: Row) => row.level === "risk" || row.level === "bench";

export interface RowLabelProps {
  row: Row;
  labelWidth: number;
  isMobile: boolean;
  open: boolean;
  onToggle: (row: Row) => void;
}

/** The sticky left-hand cell naming a row: a risk, benchmark, or judge. */
export const RowLabel: React.FC<RowLabelProps> = ({ row, labelWidth, isMobile, open, onToggle }) => {
  const height = ROW_HEIGHT[row.level];
  const diagnostic = row.level === "bench" && row.diagnostic;
  const content = (
    <>
      {isExpandable(row) ? <Chevron open={open} color={row.level === "risk" ? ACCENT : "#9ca3af"} /> : <span style={{ width: 11 }} />}
      <span style={{ minWidth: 0 }}>
        <span
          style={{
            display: "block",
            fontSize: row.level === "risk" ? 14 : row.level === "bench" ? 12.5 : 12,
            fontWeight: row.level === "risk" ? 800 : row.level === "bench" ? 600 : 500,
            color: row.level === "judge" ? "#6b7280" : INK,
            lineHeight: 1.25,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {rowLabel(row)}
          {diagnostic && (
            <span style={{ marginLeft: 5, fontSize: 10, fontWeight: 700, color: "#b45309" }}>
              diagnostic
            </span>
          )}
        </span>
        {row.level === "risk" && !isMobile && (
          <span style={{ display: "block", fontSize: 10.5, color: "rgba(10,31,77,0.5)", lineHeight: 1.3, marginTop: 2 }}>
            {RISK_DESCRIPTIONS[row.risk]}
          </span>
        )}
        {row.level === "bench" && !isMobile && (
          <span style={{ display: "block", fontSize: 10.5, color: "rgba(10,31,77,0.5)", lineHeight: 1.3, marginTop: 2 }}>
            {BENCHMARK_DESCRIPTIONS[row.bench]}
          </span>
        )}
        {row.level === "judge" && !isMobile && (
          <span style={{ display: "block", fontSize: 9.5, color: row.floor ? "#c08a3e" : "#b0b7c3", lineHeight: 1.2, marginTop: 1 }}>
            {judgeRowKind(row)}
          </span>
        )}
      </span>
    </>
  );

  const base: React.CSSProperties = {
    position: "sticky",
    left: 0,
    zIndex: 2,
    width: labelWidth,
    flex: `0 0 ${labelWidth}px`,
    height,
    display: "flex",
    alignItems: "center",
    gap: 7,
    paddingLeft: 10 + INDENT[row.level],
    paddingRight: 8,
    background: row.level === "risk" ? "#ffffff" : "#fbfcfe",
    borderRight: "1px solid rgba(10,31,77,0.08)",
    textAlign: "left",
    minWidth: 0,
  };

  if (!isExpandable(row)) {
    const note = row.level === "judge" && row.floor ? FLOOR_NOTE : row.level === "judge" ? row.scorer : undefined;
    return (
      <div role="rowheader" style={base} title={note}>
        {content}
      </div>
    );
  }
  return (
    <button
      type="button"
      role="rowheader"
      onClick={() => onToggle(row)}
      aria-expanded={open}
      title={diagnostic ? DIAGNOSTIC_NOTE : row.level === "risk" ? RISK_DESCRIPTIONS[row.risk] : undefined}
      style={{ ...base, border: 0, borderRight: base.borderRight as string, cursor: "pointer", font: "inherit" }}
    >
      {content}
    </button>
  );
};
