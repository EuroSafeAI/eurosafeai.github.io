import { overallCoverage, overallScore, type Column } from "@/lib/leaderboard";
import { coverageFraction, grade, type Aggregation } from "@/lib/scoring";
import { columnGroupStyle, memberColumnStyle } from "@/lib/column-geometry";
import { shiftVar } from "@/lib/column-order";
import type { ModelEntry } from "@/data/models.types";
import { COMPANY_LOGO, HEADER_LOGO, HEADER_SCORE_HEIGHT, INK, OVERALL_NOTE } from "./constants";
import { Cell } from "./Cell";
import { Chevron } from "./Chevron";

/**
 * One column heading: the provider or model name with its Overall score beneath.
 * The score reuses `Cell` so a heading reads on exactly the same scale as the
 * grid under it — same bands, same colours, same coverage bar.
 */
const HeaderCell = ({
  logo,
  name,
  subject,
  models,
  emphasis = false,
  open,
  onToggle,
  toggleTitle,
  metric,
}: {
  logo?: string;
  name: string;
  subject: string;
  models: ModelEntry[];
  emphasis?: boolean;
  open?: boolean;
  onToggle?: () => void;
  toggleTitle?: string;
  metric: Aggregation;
}) => {
  const alternateMetric: Aggregation = metric === "worst" ? "mean" : "worst";
  const score = overallScore(models, metric);
  const alternate = overallScore(models, alternateMetric);
  const cov = overallCoverage(models);
  const headline = metric === "worst" ? "worst case" : "average";
  const other = metric === "worst" ? "average" : "worst case";

  const label = (
    <>
      {logo && (
        <img
          src={logo}
          alt=""
          loading="lazy"
          style={{ width: HEADER_LOGO, height: HEADER_LOGO, objectFit: "contain", flexShrink: 0 }}
        />
      )}
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
          maxWidth: "100%",
          fontSize: emphasis ? 12 : 10,
          fontWeight: emphasis ? 700 : 500,
          lineHeight: 1.25,
          color: emphasis ? INK : "#6b7280",
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</span>
        {onToggle && <Chevron open={open ?? false} color="#9ca3af" />}
      </span>
    </>
  );

  const stack: React.CSSProperties = {
    flex: "1 0 0",
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 3,
  };

  return (
    <div role="columnheader" style={stack}>
      {onToggle ? (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          title={toggleTitle}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            background: "transparent",
            border: 0,
            padding: "0.15rem",
            cursor: "pointer",
            font: "inherit",
          }}
        >
          {label}
        </button>
      ) : (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "0.15rem" }} title={name}>
          {label}
        </div>
      )}
      <div style={{ width: "100%", display: "flex" }}>
        <Cell
          score={score}
          alternate={alternate}
          coverage={cov && coverageFraction(cov)}
          muted={false}
          height={HEADER_SCORE_HEIGHT}
          label={`Overall, ${subject}: ${
            score === undefined
              ? "no score"
              : `${grade(score)}, ${headline} ${score.toFixed(1)} out of 100${
                  alternate !== undefined ? `, ${other} ${alternate.toFixed(1)}` : ""
                }`
          }`}
        />
      </div>
    </div>
  );
};

export interface HeaderRowProps {
  columns: Column[];
  labelWidth: number;
  cellWidth: number;
  reduced: boolean;
  expandedProviders: ReadonlySet<string>;
  onProviderToggle: (provider: string) => void;
  metric: Aggregation;
}

/** The sticky provider/model header row above the grid body. */
export const HeaderRow: React.FC<HeaderRowProps> = ({
  columns,
  labelWidth,
  cellWidth,
  reduced,
  expandedProviders,
  onProviderToggle,
  metric,
}) => (
  <div
    role="row"
    style={{
      display: "flex",
      background: "#f9fafb",
      borderBottom: "1px solid rgba(10,31,77,0.08)",
    }}
  >
    <div
      style={{
        position: "sticky",
        left: 0,
        zIndex: 3,
        flex: `0 0 ${labelWidth}px`,
        background: "#f9fafb",
        borderRight: "1px solid rgba(10,31,77,0.08)",
        display: "flex",
        alignItems: "flex-end",
        padding: "0.6rem 0.7rem",
        fontSize: "0.66rem",
        fontWeight: 700,
        color: "#9ca3af",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
      }}
    >
      <span title={OVERALL_NOTE}>
        Systemic risk
        <span style={{ display: "block", textTransform: "none", letterSpacing: 0, fontWeight: 500, fontSize: "0.62rem", color: "#b0b7c3", marginTop: 2 }}>
          {metric === "worst" ? "Worst case" : "Average"} · mean of the four
        </span>
      </span>
    </div>
    {columns.map((column) => {
      const open = expandedProviders.has(column.provider);
      return (
        <div
          key={column.provider}
          style={{
            ...columnGroupStyle(column.models.length + 1, cellWidth, open, reduced, shiftVar(column.provider)),
            alignItems: "stretch",
            paddingTop: "0.6rem",
            paddingBottom: "0.15rem",
          }}
        >
          <HeaderCell
            logo={COMPANY_LOGO[column.provider]}
            name={column.provider}
            emphasis
            open={open}
            onToggle={() => onProviderToggle(column.provider)}
            toggleTitle={
              open
                ? `Collapse ${column.provider}`
                : `Expand ${column.provider} into its ${column.models.length} evaluated model${column.models.length === 1 ? "" : "s"}`
            }
            subject={column.provider}
            models={column.models}
            metric={metric}
          />
          {column.models.map((model) => (
            <div key={model.id} aria-hidden={!open} style={memberColumnStyle()}>
              <HeaderCell name={model.name} subject={model.name} models={[model]} metric={metric} />
            </div>
          ))}
        </div>
      );
    })}
  </div>
);
