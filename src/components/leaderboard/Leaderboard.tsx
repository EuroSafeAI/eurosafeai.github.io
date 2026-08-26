import { AnimatePresence } from "framer-motion";
import type { ModelEntry } from "@/data/models.types";
import { EXPAND_DURATION, EXPAND_CSS_EASE } from "./constants";
import { HeaderRow } from "./HeaderRow";
import { DataRow } from "./DataRow";
import { Legend } from "./Legend";
import { useLeaderboard } from "./useLeaderboard";

/** The scrollable systemic-risk heatmap, plus the legend explaining it. */
export const Leaderboard: React.FC<{ models: ModelEntry[] }> = ({ models }) => {
  const {
    columns,
    rows,
    cellValues,
    labelWidth,
    cellWidth,
    totalLeaves,
    expandedProviders,
    reduced,
    isMobile,
    isRowOpen,
    toggleRow,
    toggleProvider,
  } = useLeaderboard(models);

  return (
    <>
      <div
        style={{
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          borderRadius: 12,
          border: "1px solid rgba(10,31,77,0.08)",
          background: "#ffffff",
        }}
      >
        {/* minWidth eases alongside the column groups; letting it jump would make
            the collapsed columns twitch as the leftover slack is redistributed. */}
        <div
          role="grid"
          style={{
            minWidth: labelWidth + totalLeaves * cellWidth,
            ["--cell-width" as string]: `${cellWidth}px`,
            transition: reduced ? undefined : `min-width ${EXPAND_DURATION}s ${EXPAND_CSS_EASE}`,
          }}
        >
          {/* Provider header */}
          <HeaderRow
            columns={columns}
            labelWidth={labelWidth}
            cellWidth={cellWidth}
            reduced={reduced}
            expandedProviders={expandedProviders}
            onProviderToggle={toggleProvider}
          />

          {/* Rows */}
          <AnimatePresence initial={false}>
            {rows.map((row) => (
              <DataRow
                key={row.key}
                row={row}
                columns={columns}
                values={cellValues.get(row.key)!}
                labelWidth={labelWidth}
                cellWidth={cellWidth}
                reduced={reduced}
                isMobile={isMobile}
                expandedProviders={expandedProviders}
                open={isRowOpen(row)}
                onToggle={toggleRow}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Legend */}
      <Legend />
    </>
  );
};
