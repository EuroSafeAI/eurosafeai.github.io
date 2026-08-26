import { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RowLabel } from "@/components/leaderboard/RowLabel";
import { Legend } from "@/components/leaderboard/Legend";
import { Leaderboard } from "@/components/leaderboard/Leaderboard";
import { MetricToggle } from "@/components/leaderboard/MetricToggle";
import type { Aggregation } from "@/lib/scoring";
import { GRADES } from "@/lib/scoring";
import type { Row } from "@/lib/leaderboard";
import {
  deriveCellWidth,
  LEADERBOARD_WIDTH,
  LABEL_WIDTH,
  CELL_MIN,
  CELL_MAX,
} from "@/components/leaderboard/constants";
import modelsData from "@/data/models.json";
import type { ModelEntry } from "@/data/models.types";

const MODELS = modelsData as unknown as ModelEntry[];

const riskRow: Row = { key: "cbrn", level: "risk", risk: "cbrn" };
const benchRow: Row = { key: "cbrn/wmdp", level: "bench", risk: "cbrn", bench: "wmdp", diagnostic: true };

describe("RowLabel", () => {
  it("renders a risk row as a toggle carrying its description", () => {
    render(<RowLabel row={riskRow} labelWidth={250} isMobile={false} open={false} onToggle={() => {}} />);
    const button = screen.getByRole("rowheader");
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button.textContent).toContain("CBRN");
    expect(button.textContent).toContain("Chemical, biological");
  });

  it("hides the risk description on mobile", () => {
    render(<RowLabel row={riskRow} labelWidth={168} isMobile onToggle={() => {}} open={false} />);
    expect(screen.getByRole("rowheader").textContent).not.toContain("Chemical, biological");
  });

  it("marks a diagnostic benchmark row", () => {
    render(<RowLabel row={benchRow} labelWidth={250} isMobile={false} open={false} onToggle={() => {}} />);
    expect(screen.getByRole("rowheader").textContent).toContain("diagnostic");
  });

  it("calls onToggle with the row", () => {
    const onToggle = vi.fn();
    render(<RowLabel row={riskRow} labelWidth={250} isMobile={false} open={false} onToggle={onToggle} />);
    screen.getByRole("rowheader").click();
    expect(onToggle).toHaveBeenCalledWith(riskRow);
  });

  it("renders the benchmark gloss under the benchmark name", () => {
    render(<RowLabel row={benchRow} labelWidth={250} isMobile={false} open={false} onToggle={() => {}} />);
    expect(screen.getByRole("rowheader").textContent).toContain("weaponisation knowledge");
  });

  it("hides the benchmark gloss on mobile", () => {
    render(<RowLabel row={benchRow} labelWidth={168} isMobile open={false} onToggle={() => {}} />);
    expect(screen.getByRole("rowheader").textContent).not.toContain("weaponisation knowledge");
  });
});

describe("Legend", () => {
  it("shows every grade band", () => {
    render(<Legend />);
    // The explanatory prose also names F- and A+, so a single-match query
    // would throw for a reason that has nothing to do with the chips.
    for (const g of GRADES) expect(screen.getAllByText(g).length).toBeGreaterThan(0);
  });

  it("explains the coverage bar", () => {
    render(<Legend />);
    expect(document.body.textContent).toContain("coverage");
  });
});

describe("deriveCellWidth", () => {
  const unclamped = [8, 9, 10, 11];

  it("fills the container across the unclamped range", () => {
    for (const n of unclamped) {
      const total = LABEL_WIDTH + n * deriveCellWidth(n);
      expect(LEADERBOARD_WIDTH - total).toBeGreaterThanOrEqual(0);
      expect(LEADERBOARD_WIDTH - total).toBeLessThanOrEqual(n);
    }
  });

  it("pins to the maximum when there are few providers", () => {
    expect(deriveCellWidth(1)).toBe(CELL_MAX);
    expect(deriveCellWidth(7)).toBe(CELL_MAX);
  });

  it("pins to the minimum when there are many, and overflows", () => {
    expect(deriveCellWidth(20)).toBe(CELL_MIN);
    expect(LABEL_WIDTH + 20 * deriveCellWidth(20)).toBeGreaterThan(LEADERBOARD_WIDTH);
  });

  it("gives the current roster a materially wider cell than before", () => {
    expect(deriveCellWidth(9)).toBe(115);
  });
});

describe("metric toggle", () => {
  it("shows one number per cell, not a worst-dot-mean pair", () => {
    render(<Leaderboard models={MODELS} />);
    const cells = screen.getAllByRole("gridcell");
    const scored = cells.filter((c) => !c.textContent?.includes("—"));
    expect(scored.length).toBeGreaterThan(0);
    for (const cell of scored) {
      expect(cell.textContent).not.toContain("·");
      expect(cell.textContent).toMatch(/\d+\.\d/);
    }
  });

  it("keeps the unselected metric in the cell's title", () => {
    render(<Leaderboard models={MODELS} />);
    const labelled = screen.getAllByRole("gridcell").find((c) => c.getAttribute("title")?.includes("out of 100"));
    expect(labelled?.getAttribute("title")).toContain("average");
  });

  it("reorders the provider columns when the metric changes", () => {
    render(<Leaderboard models={MODELS} />);
    const namesNow = () => screen.getAllByRole("columnheader").map((h) => h.textContent);
    const before = namesNow();
    fireEvent.click(screen.getByRole("radio", { name: /average/i }));
    expect(namesNow()).not.toEqual(before);
  });
});

describe("grid role structure", () => {
  it("gives the row label and the corner cell a header role", () => {
    render(<Leaderboard models={MODELS} />);
    expect(screen.getByRole("rowheader", { name: /CBRN/ })).toBeTruthy();
    expect(screen.getByRole("columnheader", { name: /Systemic risk/ })).toBeTruthy();
  });
});

describe("MetricToggle", () => {
  const Controlled = () => {
    const [metric, setMetric] = useState<Aggregation>("worst");
    return <MetricToggle metric={metric} onChange={setMetric} />;
  };

  it("labels the radiogroup via the visible text instead of a duplicate aria-label", () => {
    render(<Controlled />);
    const group = screen.getByRole("radiogroup");
    expect(group).not.toHaveAttribute("aria-label");
    expect(group).toHaveAttribute("aria-labelledby");
    const label = document.getElementById(group.getAttribute("aria-labelledby")!);
    expect(label?.textContent).toBe("Score shown");
  });

  it("gives only the checked option a tab stop — roving tabindex", () => {
    render(<Controlled />);
    const worst = screen.getByRole("radio", { name: "Worst case" });
    const average = screen.getByRole("radio", { name: "Average" });
    expect(worst).toHaveAttribute("tabindex", "0");
    expect(average).toHaveAttribute("tabindex", "-1");
  });

  it("moves selection and focus together on ArrowRight/ArrowLeft", () => {
    render(<Controlled />);
    const group = screen.getByRole("radiogroup");
    const worst = screen.getByRole("radio", { name: "Worst case" });
    const average = screen.getByRole("radio", { name: "Average" });

    worst.focus();
    fireEvent.keyDown(group, { key: "ArrowRight" });
    expect(average).toHaveAttribute("aria-checked", "true");
    expect(average).toHaveAttribute("tabindex", "0");
    expect(average).toHaveFocus();

    fireEvent.keyDown(group, { key: "ArrowLeft" });
    expect(worst).toHaveAttribute("aria-checked", "true");
    expect(worst).toHaveFocus();
  });
});
