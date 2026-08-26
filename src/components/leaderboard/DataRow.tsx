import { motion } from "framer-motion";
import { rowLabel, type Column, type Row } from "@/lib/leaderboard";
import { coverageFraction, grade, type Aggregation, type Coverage } from "@/lib/scoring";
import { columnGroupStyle, memberColumnStyle } from "@/lib/column-geometry";
import { shiftVar } from "@/lib/column-order";
import { ROW_HEIGHT } from "./constants";
import { Cell } from "./Cell";
import { RowLabel } from "./RowLabel";

export interface CellData {
  score?: number;
  alternate?: number;
  coverage?: Coverage;
}
export interface RowValues {
  provider: Map<string, CellData>;
  model: Map<string, CellData>;
}

/** Diagnostic rows are greyed: their numbers aren't safety grades. */
const isMutedRow = (row: Row) =>
  (row.level === "bench" || row.level === "judge") && row.diagnostic;

const cellLabel = (
  row: Row,
  subject: string,
  score: number | undefined,
  alternate: number | undefined,
  coverage: Coverage | undefined,
  metric: Aggregation
) => {
  const where = `${rowLabel(row)}, ${subject}`;
  if (score === undefined) return `${where}: no score`;

  const headline = metric === "worst" ? "worst case" : "average";
  const other = metric === "worst" ? "average" : "worst case";
  const parts: string[] = [];
  if (row.level === "judge" && row.floor) {
    parts.push(`${grade(score)}, ${score.toFixed(1)} out of 100 with unscored samples counted safe`);
    if (alternate !== undefined) parts.push(`${other} ${alternate.toFixed(1)}`);
  } else {
    parts.push(`${grade(score)}, ${headline} ${score.toFixed(1)} out of 100`);
    if (alternate !== undefined) parts.push(`${other} ${alternate.toFixed(1)}`);
  }
  if (coverage && coverage.total > 0) {
    parts.push(
      `coverage ${Math.round(100 * coverageFraction(coverage))}% (${coverage.scored} of ${coverage.total} samples scored)`
    );
  }
  return `${where}: ${parts.join(", ")}`;
};

export interface DataRowProps {
  row: Row;
  columns: Column[];
  values: RowValues;
  labelWidth: number;
  cellWidth: number;
  reduced: boolean;
  isMobile: boolean;
  expandedProviders: ReadonlySet<string>;
  open: boolean;
  onToggle: (row: Row) => void;
  metric: Aggregation;
  columnShiftsInstant: boolean;
}

/** One animated grid row: the row label plus every provider/model cell. */
export const DataRow: React.FC<DataRowProps> = ({
  row,
  columns,
  values,
  labelWidth,
  cellWidth,
  reduced,
  isMobile,
  expandedProviders,
  open,
  onToggle,
  metric,
  columnShiftsInstant,
}) => {
  const height = ROW_HEIGHT[row.level];
  const muted = isMutedRow(row);
  const top = row.level === "risk";
  return (
    <motion.div
      role="row"
      initial={reduced || top ? false : { height: 0, opacity: 0 }}
      animate={{ height, opacity: 1 }}
      exit={reduced ? { height: 0, opacity: 0, transition: { duration: 0 } } : { height: 0, opacity: 0 }}
      transition={{ duration: reduced ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: "flex",
        // `clip` rather than `hidden`: both clip the height animation, but
        // `hidden` creates a scroll container, which would capture the sticky
        // label cell and strand it in a row that never scrolls.
        overflow: "clip",
        background: top ? "#ffffff" : "#fbfcfe",
        borderTop: top ? "1px solid rgba(10,31,77,0.08)" : "1px solid rgba(10,31,77,0.03)",
      }}
    >
      <RowLabel row={row} labelWidth={labelWidth} isMobile={isMobile} open={open} onToggle={onToggle} />
      {columns.map((column) => {
        const columnOpen = expandedProviders.has(column.provider);
        const pooled = values.provider.get(column.provider)!;
        return (
          <div
            key={column.provider}
            style={columnGroupStyle(
              column.models.length + 1,
              cellWidth,
              columnOpen,
              reduced,
              shiftVar(column.provider),
              columnShiftsInstant
            )}
          >
            <Cell
              score={pooled.score}
              coverage={pooled.coverage && coverageFraction(pooled.coverage)}
              muted={muted}
              height={height}
              label={cellLabel(row, column.provider, pooled.score, pooled.alternate, pooled.coverage, metric)}
            />
            {column.models.map((model) => {
              const own = values.model.get(model.id)!;
              return (
                <div key={model.id} aria-hidden={!columnOpen} style={memberColumnStyle()}>
                  <Cell
                    score={own.score}
                    coverage={own.coverage && coverageFraction(own.coverage)}
                    muted={muted}
                    height={height}
                    label={cellLabel(row, model.name, own.score, own.alternate, own.coverage, metric)}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </motion.div>
  );
};
