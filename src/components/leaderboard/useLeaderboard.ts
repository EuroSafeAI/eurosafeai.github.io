import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useElementWidth } from "@/hooks/use-element-width";
import { useReducedMotion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ModelEntry } from "@/data/models.types";
import type { Aggregation, Coverage } from "@/lib/scoring";
import {
  adjustedCellScore,
  adjustedProviderCellScore,
  buildColumns,
  buildRows,
  modelCoverage,
  providerCoverage,
  type Column,
  type Grouping,
  type Row,
} from "@/lib/leaderboard";
import { columnShifts } from "@/lib/column-order";
import type { RowValues } from "./DataRow";
import { LABEL_WIDTH, RAW_CAPABILITY_WEIGHT, deriveCellWidth } from "./constants";

export interface LeaderboardState {
  columns: Column[];
  rows: Row[];
  cellValues: Map<string, RowValues>;
  labelWidth: number;
  cellWidth: number;
  totalLeaves: number;
  expandedProviders: ReadonlySet<string>;
  reduced: boolean;
  isMobile: boolean;
  isRowOpen: (row: Row) => boolean;
  toggleRow: (row: Row) => void;
  toggleProvider: (provider: string) => void;
  metric: Aggregation;
  setMetric: (metric: Aggregation) => void;
  capabilityWeight: number;
  setCapabilityWeight: (weight: number) => void;
  grouping: Grouping;
  setGrouping: (grouping: Grouping) => void;
  /** What a column expands into: its models by organisation, nothing by model. */
  membersOf: (column: Column) => ModelEntry[];
  /** Attach to the element whose width the grid should fill. */
  containerRef: (element: HTMLElement | null) => void;
  columnShifts: Record<string, number>;
  /** True for the one frame the shift is an un-transitioned FLIP invert. */
  columnShiftsInstant: boolean;
}

const toggle = (set: ReadonlySet<string>, key: string): ReadonlySet<string> => {
  const next = new Set(set);
  if (!next.delete(key)) next.add(key);
  return next;
};

export function useLeaderboard(models: ModelEntry[]): LeaderboardState {
  const [expandedRisks, setExpandedRisks] = useState<ReadonlySet<string>>(new Set());
  const [expandedProviders, setExpandedProviders] = useState<ReadonlySet<string>>(new Set());
  const [metric, setMetric] = useState<Aggregation>("worst");
  const [capabilityWeight, setCapabilityWeight] = useState(RAW_CAPABILITY_WEIGHT);
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const availableWidth = useElementWidth(container);
  const [grouping, setGrouping] = useState<Grouping>("org");
  const reduced = useReducedMotion() ?? false;
  const isMobile = useIsMobile();

  const columns = useMemo(
    () => buildColumns(models, metric, capabilityWeight, grouping),
    [models, metric, capabilityWeight, grouping]
  );

  // A model column is already the model, so it has nothing to expand into.
  // This depends on the grouping mode only, never on whether a column is
  // currently open — the leaf count fed to columnGroupStyle must stay constant
  // while a column expands, or the group snaps shut in a single frame.
  const membersOf = (column: Column) => (grouping === "org" ? column.models : []);
  const rows = useMemo(() => buildRows(models, expandedRisks), [models, expandedRisks]);

  // Scores don't depend on which provider is expanded, only on the row/column
  // set, so this must not key off expandedProviders: keying off it would
  // re-walk the whole score tree on every toggle, right before the
  // expand/collapse animation's first frame.
  const cellValues = useMemo(() => {
    const alternateMetric: Aggregation = metric === "worst" ? "mean" : "worst";
    const byRow = new Map<string, RowValues>();
    for (const row of rows) {
      const provider = new Map<string, { score?: number; alternate?: number; coverage?: Coverage }>();
      const model = new Map<string, { score?: number; alternate?: number; coverage?: Coverage }>();
      for (const column of columns) {
        provider.set(column.provider, {
          score: adjustedProviderCellScore(column.models, row, metric, capabilityWeight),
          alternate: adjustedProviderCellScore(column.models, row, alternateMetric, capabilityWeight),
          coverage: providerCoverage(column.models, row),
        });
        for (const entry of column.models) {
          model.set(entry.id, {
            score: adjustedCellScore(entry, row, metric, capabilityWeight),
            alternate: adjustedCellScore(entry, row, alternateMetric, capabilityWeight),
            coverage: modelCoverage(entry, row),
          });
        }
      }
      byRow.set(row.key, { provider, model });
    }
    return byRow;
  }, [rows, columns, metric, capabilityWeight]);

  const labelWidth = isMobile ? 168 : LABEL_WIDTH;
  const cellWidth = isMobile ? 74 : deriveCellWidth(columns.length, availableWidth);
  // An expanded provider keeps its own pooled column and grows its models to the
  // right of it, so nothing shifts under the cursor and a provider can be read
  // against its own members.
  const leafCount = (provider: string, providerModels: ModelEntry[]) =>
    expandedProviders.has(provider) && grouping === "org" ? providerModels.length + 1 : 1;
  const totalLeaves = columns.reduce((n, c) => n + leafCount(c.provider, c.models), 0);

  // FLIP: capture where each provider column was before the metric-driven
  // reorder, apply that as an inverse transform, then release it on the next
  // frame so the browser animates the column sliding to its new position
  // instead of the header/body just snapping there.
  const widthOf = (provider: string) => {
    const column = columns.find((c) => c.provider === provider);
    return leafCount(provider, column?.models ?? []) * cellWidth;
  };
  const order = columns.map((c) => c.provider);
  const previousOrderRef = useRef(order);
  const [shifts, setShifts] = useState<Record<string, number>>({});
  const [shiftsInstant, setShiftsInstant] = useState(false);

  // useLayoutEffect, not useEffect: the invert write below must land before the
  // browser's next paint, or that paint shows the columns already in their new
  // positions and there is nothing left to animate from.
  useLayoutEffect(() => {
    const previous = previousOrderRef.current;
    previousOrderRef.current = order;
    if (reduced || previous.join() === order.join()) return;

    // Invert: jump to the pre-reorder offset with no transition, synchronously
    // before paint, so the browser's first paint of the new order still shows
    // the columns where they used to be.
    setShifts(columnShifts(previous, order, widthOf));
    setShiftsInstant(true);

    // Release: after that inverted frame has actually been painted, turn the
    // transition back on and drop the shift to 0 so the browser animates the
    // slide. A single rAF can still fire before the browser has painted the
    // invert (rAF callbacks run pre-paint), so this waits for two.
    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        setShiftsInstant(false);
        setShifts({});
      });
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
    // Intentionally keyed on order.join() rather than the `widthOf`/`columns`
    // closure: this must fire only on a metric-driven reorder, not on every
    // provider toggle. Depending on `expandedProviders` (a new Set each
    // toggle, which `widthOf` reads through `columns`) would rerun this FLIP
    // effect on every expand/collapse instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order.join(), reduced]);

  // Only risks expand now; a benchmark is a leaf.
  const isRowOpen = (row: Row) => row.level === "risk" && expandedRisks.has(row.key);

  const toggleRow = (row: Row) => {
    if (row.level === "risk") setExpandedRisks((s) => toggle(s, row.key));
  };

  const toggleProvider = (provider: string) =>
    setExpandedProviders((s) => toggle(s, provider));

  return {
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
    containerRef: setContainer,
    columnShifts: shifts,
    columnShiftsInstant: shiftsInstant,
  };
}
