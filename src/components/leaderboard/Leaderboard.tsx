import { AnimatePresence } from "framer-motion";
import type { ModelEntry } from "@/data/models.types";
import { shiftVar } from "@/lib/column-order";
import { EXPAND_DURATION, EXPAND_CSS_EASE } from "./constants";
import { HeaderRow } from "./HeaderRow";
import { DataRow } from "./DataRow";
import { Legend } from "./Legend";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ACCENT } from "./constants";
import { MetricToggle } from "./MetricToggle";
import { CapabilityWeightSlider } from "./CapabilityWeightSlider";
import { GroupingToggle } from "./GroupingToggle";
import { useLeaderboard } from "./useLeaderboard";

/** The scrollable systemic-risk heatmap, plus the legend explaining it. */
export const Leaderboard: React.FC<{
  models: ModelEntry[];
  onHighlight?: (provider: string | null) => void;
}> = ({ models, onHighlight }) => {
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
    containerRef,
    columnShifts,
    columnShiftsInstant,
  } = useLeaderboard(models);

  return (
    <div ref={containerRef}>
      {/* On a phone these three stacked into roughly a screen of height before
          any data appeared, so they fold away. On desktop they sit in a row as
          before, where there is room for them. */}
      {isMobile ? (
        <Accordion type="single" collapsible style={{ marginBottom: "0.6rem" }}>
          <AccordionItem value="options">
            <AccordionTrigger style={{ fontSize: 12, color: ACCENT, paddingTop: "0.5rem", paddingBottom: "0.5rem" }}>
              Options
            </AccordionTrigger>
            <AccordionContent>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem", paddingBottom: "0.4rem" }}>
                <CapabilityWeightSlider weight={capabilityWeight} onChange={setCapabilityWeight} />
                <GroupingToggle grouping={grouping} onChange={setGrouping} />
                <MetricToggle metric={metric} onChange={setMetric} />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
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
      )}
      {/* The grid is far wider than a phone, and a clipped cell at the edge was
          the only hint that six more providers existed. The fade says so. */}
      <div
        style={{
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          WebkitMaskImage: isMobile
            ? "linear-gradient(to right, #000 calc(100% - 28px), transparent 100%)"
            : undefined,
          maskImage: isMobile
            ? "linear-gradient(to right, #000 calc(100% - 28px), transparent 100%)"
            : undefined,
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
          onHighlight={onHighlight}
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
    </div>
  );
};
