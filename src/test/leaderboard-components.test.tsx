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
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button.textContent).toContain("CBRN");
    expect(button.textContent).toContain("Chemical, biological");
  });

  it("wraps the toggle button in a rowheader cell without overriding its role", () => {
    render(<RowLabel row={riskRow} labelWidth={250} isMobile={false} open onToggle={() => {}} />);
    const cell = screen.getByRole("rowheader");
    const button = screen.getByRole("button");
    expect(cell).toContainElement(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(button).not.toHaveAttribute("role");
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
    screen.getByRole("button").click();
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

describe("sticky label column", () => {
  // `position: sticky` resolves against the nearest scroll container, and any
  // overflow other than visible/clip creates one. A row that clipped with
  // `overflow: hidden` therefore captured the sticky label cell and, having no
  // horizontal scroll of its own, left it to travel with the content.
  const SCROLL_CONTAINER_OVERFLOWS = ["hidden", "auto", "scroll", "overlay"];

  it("clips rows without making them a scroll container", () => {
    render(<Leaderboard models={MODELS} />);
    for (const row of screen.getAllByRole("row")) {
      expect(SCROLL_CONTAINER_OVERFLOWS).not.toContain(row.style.overflow);
      expect(SCROLL_CONTAINER_OVERFLOWS).not.toContain(row.style.overflowX);
    }
  });

  it("keeps the row header sticky at the left edge", () => {
    render(<Leaderboard models={MODELS} />);
    for (const header of screen.getAllByRole("rowheader")) {
      expect(header.style.position).toBe("sticky");
      expect(header.style.left).toBe("0px");
    }
  });
});

describe("capability slider", () => {
  const cellText = () =>
    screen.getAllByRole("gridcell").map((c) => c.textContent);
  const columnNames = () =>
    screen.getAllByRole("columnheader").map((h) => h.textContent);

  it("rests at measured safety, showing no adjustment by default", () => {
    render(<Leaderboard models={MODELS} />);
    const slider = screen.getByRole("slider", { name: /capability weight/i });
    expect(slider).toHaveValue("1");
    expect(screen.getByText("measured")).toBeInTheDocument();
  });

  it("leaves every cell untouched while the slider is at 1", () => {
    // The guard that matters: the default table must be the evaluation
    // results, not a derived quantity someone could screenshot as one.
    const { unmount } = render(<Leaderboard models={MODELS} />);
    const before = cellText();
    unmount();

    render(<Leaderboard models={MODELS} />);
    const slider = screen.getByRole("slider", { name: /capability weight/i });
    fireEvent.change(slider, { target: { value: "0.5" } });
    fireEvent.change(slider, { target: { value: "1" } });
    expect(cellText()).toEqual(before);
  });

  it("changes the grid when the weight is lowered", () => {
    render(<Leaderboard models={MODELS} />);
    const before = cellText();
    fireEvent.change(screen.getByRole("slider", { name: /capability weight/i }), {
      target: { value: "0.5" },
    });
    expect(cellText()).not.toEqual(before);
  });

  it("re-ranks the provider columns as the weight falls", () => {
    render(<Leaderboard models={MODELS} />);
    const before = columnNames();
    fireEvent.change(screen.getByRole("slider", { name: /capability weight/i }), {
      target: { value: "0.3" },
    });
    expect(columnNames()).not.toEqual(before);
  });

  it("offers a reset once adjusted, and returns to measured", () => {
    render(<Leaderboard models={MODELS} />);
    const before = cellText();
    const slider = screen.getByRole("slider", { name: /capability weight/i });
    fireEvent.change(slider, { target: { value: "0.4" } });
    fireEvent.click(screen.getByRole("button", { name: /reset to measured/i }));
    expect(slider).toHaveValue("1");
    expect(cellText()).toEqual(before);
  });
});

describe("capability slider and the column aggregates", () => {
  const setAlpha = (value: string) =>
    fireEvent.change(screen.getByRole("slider", { name: /capability weight/i }), {
      target: { value },
    });

  // Keyed by provider, never positional: lowering alpha also re-orders the
  // columns, so comparing the header list in document order would differ even
  // if every Overall score were left raw.
  const overallByProvider = () => {
    const byProvider: Record<string, string> = {};
    for (const header of screen.getAllByRole("columnheader")) {
      // The sticky corner is a columnheader too and carries no score.
      const score = header.querySelector<HTMLElement>('[role="gridcell"]');
      if (!score) continue;
      const name = header.textContent!.replace(score.textContent ?? "", "").trim();
      byProvider[name] = score.textContent ?? "";
    }
    expect(Object.keys(byProvider).length).toBeGreaterThan(1);
    return byProvider;
  };

  it("adjusts each column's Overall score, not just the risk cells", () => {
    render(<Leaderboard models={MODELS} />);
    const measured = overallByProvider();
    setAlpha("0.5");
    const adjusted = overallByProvider();
    expect(Object.keys(adjusted).sort()).toEqual(Object.keys(measured).sort());
    for (const provider of Object.keys(measured)) {
      expect(adjusted[provider]).not.toBe(measured[provider]);
    }
  });

  it("returns the measured Overall scores when reset to 1", () => {
    render(<Leaderboard models={MODELS} />);
    const measured = overallByProvider();
    setAlpha("0.35");
    setAlpha("1");
    expect(overallByProvider()).toEqual(measured);
  });
});

describe("capability slider layout stability", () => {
  // The trailing slot swaps between "measured" and a "reset to measured"
  // button. In a right-aligned row an intrinsic width change there shifts
  // every control to its left, so the slot reserves a fixed width instead.
  it("reserves a fixed-width trailing slot in both states", () => {
    const { rerender } = render(<Leaderboard models={MODELS} />);
    const slot = () => document.querySelector<HTMLElement>("[data-alpha-status]")!;
    const rawWidth = slot().style.width;
    expect(rawWidth).not.toBe("");

    fireEvent.change(screen.getByRole("slider", { name: /capability weight/i }), {
      target: { value: "0.5" },
    });
    rerender(<Leaderboard models={MODELS} />);
    expect(slot().style.width).toBe(rawWidth);
  });
});
