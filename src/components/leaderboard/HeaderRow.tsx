import { adjustedOverallScore, overallCoverage, type Column } from "@/lib/leaderboard";
import { coverageFraction, grade, type Aggregation } from "@/lib/scoring";
import { columnGroupStyle, memberColumnStyle, memberContentStyle } from "@/lib/column-geometry";
import { shiftVar } from "@/lib/column-order";
import type { ModelEntry } from "@/data/models.types";
import {
  COMPANY_LOGO,
  HEADER_LOGO,
  HEADER_NAME_LINES,
  HEADER_NAME_LINE_HEIGHT,
  LABEL_GUTTER,
  HEADER_SCORE_HEIGHT,
  INK,
  OVERALL_NOTE,
} from "./constants";
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
  weight,
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
  weight: number;
  emphasis?: boolean;
  open?: boolean;
  onToggle?: () => void;
  toggleTitle?: string;
  metric: Aggregation;
}) => {
  const alternateMetric: Aggregation = metric === "worst" ? "mean" : "worst";
  const score = adjustedOverallScore(models, metric, weight);
  const alternate = adjustedOverallScore(models, alternateMetric, weight);
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
          alignItems: "flex-start",
          justifyContent: "center",
          gap: 3,
          width: "100%",
          fontSize: emphasis ? 12 : 10,
          fontWeight: emphasis ? 700 : 500,
          lineHeight: HEADER_NAME_LINE_HEIGHT,
          color: emphasis ? INK : "#6b7280",
        }}
      >
        {/* Wraps rather than truncating: at the model view's cell width most
            names need two lines, and an ellipsis there hides which model a
            column is. The header grows to its tallest name instead, which
            degrades visibly rather than silently if a longer name arrives. */}
        <span
          data-column-name
          style={{
            minWidth: 0,
            textAlign: "center",
            overflowWrap: "break-word",
            // A fixed reservation, not a maximum: a one-line name occupies the
            // same box as a two-line one, which is what keeps the logos above
            // them level and the header a constant height.
            height: `${HEADER_NAME_LINES * HEADER_NAME_LINE_HEIGHT}em`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {name}
        </span>
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
  weight: number;
  membersOf: (column: Column) => ModelEntry[];
  columns: Column[];
  labelWidth: number;
  cellWidth: number;
  reduced: boolean;
  expandedProviders: ReadonlySet<string>;
  onProviderToggle: (provider: string) => void;
  metric: Aggregation;
  columnShiftsInstant: boolean;
}

/** The sticky provider/model header row above the grid body. */
export const HeaderRow: React.FC<HeaderRowProps> = ({
  weight,
  membersOf,
  columns,
  labelWidth,
  cellWidth,
  reduced,
  expandedProviders,
  onProviderToggle,
  metric,
  columnShiftsInstant,
}) => (
  <div
    role="row"
    style={{
      display: "flex",
      // No fill: a grey band across the top is what makes a grid read as a
      // widget dropped on the page. The rule alone carries the separation.
      borderBottom: "1px solid rgba(10,31,77,0.12)",
    }}
  >
    <div
      role="columnheader"
      style={{
        position: "sticky",
        left: 0,
        zIndex: 3,
        flex: `0 0 ${labelWidth}px`,
        // Opaque, because this cell is sticky and columns must not show
        // through it when the grid is scrolled sideways.
        background: "#ffffff",
        display: "flex",
        alignItems: "flex-end",
        paddingTop: "0.6rem",
        paddingBottom: "0.6rem",
        paddingRight: "0.7rem",
        // Matches the row labels below it: this cell is sticky at the
        // viewport's left edge too, now the grid is full bleed.
        paddingLeft: LABEL_GUTTER,
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
      const members = membersOf(column);
      const expandable = members.length > 0;
      const open = expandable && expandedProviders.has(column.provider);
      // A model column carries its organisation's logo for provenance; an
      // organisation column is already named for it.
      const logo = COMPANY_LOGO[column.provider] ?? COMPANY_LOGO[column.models[0]?.company];
      return (
        <div
          key={column.provider}
          role="presentation"
          style={{
            ...columnGroupStyle(
              members.length + 1,
              cellWidth,
              open,
              reduced,
              shiftVar(column.provider),
              columnShiftsInstant
            ),
            alignItems: "stretch",
            paddingTop: "0.6rem",
            paddingBottom: "0.15rem",
          }}
        >
          <HeaderCell
            logo={logo}
            name={column.provider}
            emphasis
            open={expandable ? open : undefined}
            onToggle={expandable ? () => onProviderToggle(column.provider) : undefined}
            toggleTitle={
              open
                ? `Collapse ${column.provider}`
                : `Expand ${column.provider} into its ${members.length} evaluated model${members.length === 1 ? "" : "s"}`
            }
            subject={column.provider}
            models={column.models}
            weight={weight}
            metric={metric}
          />
          {members.map((model) => (
            <div key={model.id} role="presentation" aria-hidden={!open} style={memberColumnStyle()}>
              <div data-member-content style={memberContentStyle()}>
                <HeaderCell name={model.name} subject={model.name} models={[model]} metric={metric} weight={weight} />
              </div>
            </div>
          ))}
        </div>
      );
    })}
  </div>
);
