import { useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ModelEntry } from "@/data/models.types";
import type { Aggregation, Coverage } from "@/lib/scoring";
import {
  buildColumns,
  buildRows,
  modelCoverage,
  modelScore,
  providerCoverage,
  providerScore,
  type Column,
  type Row,
} from "@/lib/leaderboard";
import type { RowValues } from "./DataRow";
import { LABEL_WIDTH, deriveCellWidth } from "./constants";

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
}

const toggle = (set: ReadonlySet<string>, key: string): ReadonlySet<string> => {
  const next = new Set(set);
  if (!next.delete(key)) next.add(key);
  return next;
};

export function useLeaderboard(models: ModelEntry[]): LeaderboardState {
  const [expandedRisks, setExpandedRisks] = useState<ReadonlySet<string>>(new Set());
  const [expandedBenches, setExpandedBenches] = useState<ReadonlySet<string>>(new Set());
  const [expandedProviders, setExpandedProviders] = useState<ReadonlySet<string>>(new Set());
  const [metric, setMetric] = useState<Aggregation>("worst");
  const reduced = useReducedMotion() ?? false;
  const isMobile = useIsMobile();

  const columns = useMemo(() => buildColumns(models, metric), [models, metric]);
  const rows = useMemo(
    () => buildRows(models, expandedRisks, expandedBenches),
    [models, expandedRisks, expandedBenches]
  );

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
          score: providerScore(column.models, row, metric),
          alternate: providerScore(column.models, row, alternateMetric),
          coverage: providerCoverage(column.models, row),
        });
        for (const entry of column.models) {
          model.set(entry.id, {
            score: modelScore(entry, row, metric),
            alternate: modelScore(entry, row, alternateMetric),
            coverage: modelCoverage(entry, row),
          });
        }
      }
      byRow.set(row.key, { provider, model });
    }
    return byRow;
  }, [rows, columns, metric]);

  const labelWidth = isMobile ? 168 : LABEL_WIDTH;
  const cellWidth = isMobile ? 74 : deriveCellWidth(columns.length);
  // An expanded provider keeps its own pooled column and grows its models to the
  // right of it, so nothing shifts under the cursor and a provider can be read
  // against its own members.
  const leafCount = (provider: string, providerModels: ModelEntry[]) =>
    expandedProviders.has(provider) ? providerModels.length + 1 : 1;
  const totalLeaves = columns.reduce((n, c) => n + leafCount(c.provider, c.models), 0);

  const isRowOpen = (row: Row) =>
    row.level === "risk" ? expandedRisks.has(row.key) : expandedBenches.has(row.key);

  const toggleRow = (row: Row) => {
    if (row.level === "risk") setExpandedRisks((s) => toggle(s, row.key));
    else if (row.level === "bench") setExpandedBenches((s) => toggle(s, row.key));
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
  };
}
