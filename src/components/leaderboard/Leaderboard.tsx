import { AnimatePresence } from "framer-motion";
import type { ModelEntry } from "@/data/models.types";
import { shiftVar } from "@/lib/column-order";
import { EXPAND_DURATION, EXPAND_CSS_EASE } from "./constants";
import { HeaderRow } from "./HeaderRow";
import { DataRow } from "./DataRow";
import { Legend } from "./Legend";
import { MetricToggle } from "./MetricToggle";
import { CapabilityWeightSlider } from "./CapabilityWeightSlider";
import { GroupingToggle } from "./GroupingToggle";
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
    metric,
    setMetric,
    capabilityWeight,
    setCapabilityWeight,
    grouping,
    setGrouping,
    membersOf,
    columnShifts,
    columnShiftsInstant,
  } = useLeaderboard(models);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "1.25rem",
          flexWrap: "wrap",
          marginBottom: "0.6rem",
        }}
      >
        <CapabilityWeightSlider weight={capabilityWeight} onChange={setCapabilityWeight} />
        <GroupingToggle grouping={grouping} onChange={setGrouping} />
        <MetricToggle metric={metric} onChange={setMetric} />
      </div>
      <div
        style={{
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
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
            // Published once here, on the shared ancestor of the header and body,
            // so both inherit identical values and cannot drift out of register.
            ...Object.fromEntries(
              columns.map((column) => [shiftVar(column.provider), `${columnShifts[column.provider] ?? 0}px`])
            ),
          }}
        >
          {/* Provider header */}
          <HeaderRow
          weight={capabilityWeight}
          membersOf={membersOf}
            columns={columns}
            labelWidth={labelWidth}
            cellWidth={cellWidth}
            reduced={reduced}
            expandedProviders={expandedProviders}
            onProviderToggle={toggleProvider}
            metric={metric}
            columnShiftsInstant={columnShiftsInstant}
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
              membersOf={membersOf}
                open={isRowOpen(row)}
                onToggle={toggleRow}
                metric={metric}
                columnShiftsInstant={columnShiftsInstant}
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
