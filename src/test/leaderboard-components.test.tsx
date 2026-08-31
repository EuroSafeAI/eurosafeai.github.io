import { useState } from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
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
  COVERAGE_FLAG,
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

describe("the legend after the cut", () => {
  it("keeps the grade key and the scale", () => {
    render(<Leaderboard models={MODELS} />);
    for (const g of GRADES) expect(screen.getAllByText(g).length).toBeGreaterThan(0);
    expect(document.body.textContent).toContain(`${GRADES.length} equal bands`);
  });

  it("keeps the coverage flag, scaled to a percentage", () => {
    render(<Leaderboard models={MODELS} />);
    expect(document.body.textContent).toContain(`${Math.round(COVERAGE_FLAG * 100)}%`);
  });

  it("is short enough to actually be read", () => {
    render(<Leaderboard models={MODELS} />);
    const words = (document.body.textContent ?? "").trim().split(/\s+/).length;
    // The grid's own cell text dominates this count; the assertion exists to
    // catch a legend that grows back, not to police an exact length.
    expect(words).toBeLessThan(1200);
  });
});

describe("deriveCellWidth", () => {
  // At the design width the clamp binds outside 6..11 providers.
  const unclamped = [6, 7, 8, 9, 10, 11];

  it("fills the container across the unclamped range", () => {
    for (const n of unclamped) {
      const total = LABEL_WIDTH + n * deriveCellWidth(n);
      expect(LEADERBOARD_WIDTH - total).toBeGreaterThanOrEqual(0);
      expect(LEADERBOARD_WIDTH - total).toBeLessThanOrEqual(n);
    }
  });

  it("pins to the maximum when there are few providers", () => {
    expect(deriveCellWidth(1)).toBe(CELL_MAX);
    expect(deriveCellWidth(5)).toBe(CELL_MAX);
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
    expect(slider).toHaveValue("0");
    expect(screen.getByText("measured")).toBeInTheDocument();
  });

  it("leaves every cell untouched while the slider is at rest", () => {
    // The guard that matters: the default table must be the evaluation
    // results, not a derived quantity someone could screenshot as one.
    const { unmount } = render(<Leaderboard models={MODELS} />);
    const before = cellText();
    unmount();

    render(<Leaderboard models={MODELS} />);
    const slider = screen.getByRole("slider", { name: /capability weight/i });
    fireEvent.change(slider, { target: { value: "0.5" } });
    fireEvent.change(slider, { target: { value: "0" } });
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
    expect(slider).toHaveValue("0");
    expect(cellText()).toEqual(before);
  });
});

describe("capability slider and the column aggregates", () => {
  const setWeight = (value: string) =>
    fireEvent.change(screen.getByRole("slider", { name: /capability weight/i }), {
      target: { value },
    });

  // Keyed by provider, never positional: raising the weight also re-orders the
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
    setWeight("0.5");
    const adjusted = overallByProvider();
    expect(Object.keys(adjusted).sort()).toEqual(Object.keys(measured).sort());
    for (const provider of Object.keys(measured)) {
      expect(adjusted[provider]).not.toBe(measured[provider]);
    }
  });

  it("returns the measured Overall scores when reset", () => {
    render(<Leaderboard models={MODELS} />);
    const measured = overallByProvider();
    setWeight("0.35");
    setWeight("0");
    expect(overallByProvider()).toEqual(measured);
  });
});

describe("capability slider layout stability", () => {
  // The trailing slot swaps between "measured" and a "reset to measured"
  // button. In a right-aligned row an intrinsic width change there shifts
  // every control to its left, so the slot reserves a fixed width instead.
  it("reserves a fixed-width trailing slot in both states", () => {
    const { rerender } = render(<Leaderboard models={MODELS} />);
    const slot = () => document.querySelector<HTMLElement>("[data-weight-status]")!;
    const rawWidth = slot().style.width;
    expect(rawWidth).not.toBe("");

    fireEvent.change(screen.getByRole("slider", { name: /capability weight/i }), {
      target: { value: "0.5" },
    });
    rerender(<Leaderboard models={MODELS} />);
    expect(slot().style.width).toBe(rawWidth);
  });
});

describe("grouping toggle", () => {
  const groupBy = (label: RegExp) =>
    fireEvent.click(screen.getByRole("radio", { name: label }));
  const scoredHeaders = () =>
    screen.getAllByRole("columnheader").filter((h) => h.querySelector('[role="gridcell"]'));
  const expandToggles = () =>
    scoredHeaders().filter((h) => h.querySelector("button[aria-expanded]"));

  it("defaults to organisation columns, expandable as before", () => {
    render(<Leaderboard models={MODELS} />);
    expect(screen.getByRole("radio", { name: /organisation/i })).toHaveAttribute(
      "aria-checked",
      "true"
    );
    expect(scoredHeaders()).toHaveLength(9);
    // The toggle's accessible name is the provider name (its title attribute
    // is not used once the button has text), so identify it by its state.
    expect(expandToggles()).toHaveLength(9);
  });

  it("shows one column per model when grouped by model", () => {
    render(<Leaderboard models={MODELS} />);
    groupBy(/^model$/i);
    expect(scoredHeaders()).toHaveLength(MODELS.length);
  });

  it("offers nothing to expand in model view", () => {
    render(<Leaderboard models={MODELS} />);
    groupBy(/^model$/i);
    expect(expandToggles()).toHaveLength(0);
  });

  it("keeps each model's organisation visible", () => {
    render(<Leaderboard models={MODELS} />);
    groupBy(/^model$/i);
    const logos = scoredHeaders().filter((h) => h.querySelector("img"));
    expect(logos).toHaveLength(scoredHeaders().length);
  });

  it("re-ranks model columns when the capability weight changes", () => {
    render(<Leaderboard models={MODELS} />);
    groupBy(/^model$/i);
    const before = scoredHeaders().map((h) => h.textContent);
    fireEvent.change(screen.getByRole("slider", { name: /capability weight/i }), {
      target: { value: "0.4" },
    });
    expect(scoredHeaders().map((h) => h.textContent)).not.toEqual(before);
  });

  it("returns to the organisation view unchanged", () => {
    render(<Leaderboard models={MODELS} />);
    const before = scoredHeaders().map((h) => h.textContent);
    groupBy(/^model$/i);
    groupBy(/organisation/i);
    expect(scoredHeaders().map((h) => h.textContent)).toEqual(before);
  });

  it("never applies a NaN transform when the column set is swapped", () => {
    render(<Leaderboard models={MODELS} />);
    groupBy(/^model$/i);
    for (const group of document.querySelectorAll<HTMLElement>('[role="row"] > div')) {
      expect(group.style.transform ?? "").not.toContain("NaN");
    }
  });
});

describe("column header names", () => {
  // Only the name element: a header also holds its score, whose digits are
  // legitimately nowrap.
  const nameSpans = () => {
    const spans = [...document.querySelectorAll<HTMLElement>("[data-column-name]")];
    expect(spans.length).toBeGreaterThan(0);
    return spans;
  };

  it("never truncates a name in the organisation view", () => {
    render(<Leaderboard models={MODELS} />);
    for (const span of nameSpans()) {
      expect(span.style.whiteSpace).not.toBe("nowrap");
      expect(span.style.textOverflow).not.toBe("ellipsis");
      expect(span.style.webkitLineClamp ?? "").toBe("");
    }
  });

  it("never truncates a name in the model view", () => {
    render(<Leaderboard models={MODELS} />);
    fireEvent.click(screen.getByRole("radio", { name: /^model$/i }));
    for (const span of nameSpans()) {
      expect(span.style.whiteSpace).not.toBe("nowrap");
      expect(span.style.textOverflow).not.toBe("ellipsis");
    }
  });

  it("never truncates an expanded model's name inside its organisation", () => {
    render(<Leaderboard models={MODELS} />);
    const toggle = screen
      .getAllByRole("columnheader")
      .map((h) => h.querySelector<HTMLElement>("button[aria-expanded]"))
      .find(Boolean)!;
    fireEvent.click(toggle);
    for (const span of nameSpans()) {
      expect(span.style.whiteSpace).not.toBe("nowrap");
      expect(span.style.textOverflow).not.toBe("ellipsis");
    }
  });

  it("still carries the full name for assistive technology and hover", () => {
    render(<Leaderboard models={MODELS} />);
    fireEvent.click(screen.getByRole("radio", { name: /^model$/i }));
    const longest = [...MODELS].sort((a, b) => b.name.length - a.name.length)[0];
    expect(screen.getByText(longest.name)).toBeInTheDocument();
  });
});

describe("column header geometry", () => {
  const names = () => [...document.querySelectorAll<HTMLElement>("[data-column-name]")];

  it("reserves the same height for every name, so logos share a baseline", () => {
    render(<Leaderboard models={MODELS} />);
    const heights = new Set(names().map((n) => n.style.height));
    expect(heights.size).toBe(1);
    expect([...heights][0]).not.toBe("");
  });

  it("keeps that reservation in the model view", () => {
    render(<Leaderboard models={MODELS} />);
    const orgHeight = names()[0].style.height;
    fireEvent.click(screen.getByRole("radio", { name: /^model$/i }));
    for (const name of names()) expect(name.style.height).toBe(orgHeight);
  });

  it("gives a collapsed member column's content a fixed layout width", () => {
    render(<Leaderboard models={MODELS} />);
    const contents = [...document.querySelectorAll<HTMLElement>("[data-member-content]")];
    expect(contents.length).toBeGreaterThan(0);
    for (const content of contents) expect(content.style.width).toBe("var(--cell-width)");
  });
});

describe("deriveCellWidth against a measured container", () => {
  it("fills a wide container instead of the fixed design width", () => {
    // The grid is no longer capped at LEADERBOARD_WIDTH, so cells must size
    // to the space actually available or the table floats in whitespace.
    const wide = deriveCellWidth(9, 2400);
    expect(wide).toBeGreaterThan(deriveCellWidth(9, LEADERBOARD_WIDTH));
  });

  it("still respects the clamp at both ends", () => {
    expect(deriveCellWidth(2, 4000)).toBe(CELL_MAX);
    expect(deriveCellWidth(40, 900)).toBe(CELL_MIN);
  });

  it("falls back to the design width before the container is measured", () => {
    expect(deriveCellWidth(9, undefined)).toBe(deriveCellWidth(9, LEADERBOARD_WIDTH));
  });

  it("ignores a zero or negative measurement rather than collapsing", () => {
    for (const bogus of [0, -50]) {
      expect(deriveCellWidth(9, bogus)).toBe(deriveCellWidth(9, LEADERBOARD_WIDTH));
    }
  });
});

describe("the grid fills its container", () => {
  const gridWidth = () => {
    const grid = screen.getByRole("grid");
    return Number((grid.style.minWidth || "0").replace("px", ""));
  };

  afterEach(() => {
    delete document.body.dataset.testWidth;
  });

  it("grows with the measured container rather than a fixed design width", () => {
    document.body.dataset.testWidth = "2000";
    render(<Leaderboard models={MODELS} />);
    const wide = gridWidth();
    cleanup();

    document.body.dataset.testWidth = "1360";
    render(<Leaderboard models={MODELS} />);
    expect(wide).toBeGreaterThan(gridWidth());
  });

  it("uses most of a wide container instead of floating in it", () => {
    document.body.dataset.testWidth = "1800";
    render(<Leaderboard models={MODELS} />);
    expect(gridWidth()).toBeGreaterThan(1800 * 0.9);
  });
});
