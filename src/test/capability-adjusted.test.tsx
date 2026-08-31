import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { adjustedRanking, attainableFrontier } from "@/lib/capability-adjusted-safety";
import { CapabilityAdjustedSection } from "@/components/CapabilityAdjusted";
import modelsData from "@/data/models.json";
import type { ModelEntry } from "@/data/models.types";

const MODELS = modelsData as unknown as ModelEntry[];

describe("CapabilityAdjustedSection", () => {
  it("plots one point per scored model", () => {
    render(<CapabilityAdjustedSection models={MODELS} />);
    const plot = screen.getByRole("img", { name: /intelligence index/i });
    expect(plot.querySelectorAll("circle")).toHaveLength(adjustedRanking(MODELS).length);
  });

  it("places each point by raw safety and intelligence index, not by the adjusted score", () => {
    render(<CapabilityAdjustedSection models={MODELS} />);
    const circles = [...screen.getByRole("img", { name: /intelligence index/i }).querySelectorAll("circle")];
    const at = (name: string) => circles.find((c) => c.textContent?.includes(name))!;
    const entries = adjustedRanking(MODELS);
    const mostCapable = [...entries].sort((a, b) => b.index - a.index)[0];
    const leastCapable = [...entries].sort((a, b) => a.index - b.index)[0];
    const safest = [...entries].sort((a, b) => b.safety - a.safety)[0];
    const leastSafe = [...entries].sort((a, b) => a.safety - b.safety)[0];

    // x rises with capability; y falls with safety, since SVG y grows downward.
    expect(Number(at(mostCapable.model.name).getAttribute("cx"))).toBeGreaterThan(
      Number(at(leastCapable.model.name).getAttribute("cx"))
    );
    expect(Number(at(safest.model.name).getAttribute("cy"))).toBeLessThan(
      Number(at(leastSafe.model.name).getAttribute("cy"))
    );
  });

  it("names each point's region, adjusted score, safety and index", () => {
    render(<CapabilityAdjustedSection models={MODELS} />);
    const entry = adjustedRanking(MODELS)[0];
    expect(
      screen.getByText(new RegExp(`${entry.model.name} \\(${entry.model.region}\\): adjusted`))
    ).toBeInTheDocument();
  });

  it("colours points by region rather than by a value read off the axes", () => {
    // The adjusted grade is a pure function of the two axes, so colouring by
    // it would encode nothing the position does not already say. Region is
    // independent of both.
    render(<CapabilityAdjustedSection models={MODELS} />);
    const circles = [...screen.getByRole("img", { name: /intelligence index/i }).querySelectorAll("circle")];
    const colourOf = (name: string) =>
      circles.find((c) => c.textContent?.includes(name))!.getAttribute("fill");
    const byRegion = new Map<string, string[]>();
    for (const m of MODELS) {
      byRegion.set(m.region, [...(byRegion.get(m.region) ?? []), colourOf(m.name)!]);
    }
    for (const [, colours] of byRegion) expect(new Set(colours).size).toBe(1);
    expect(new Set([...byRegion.values()].map((c) => c[0])).size).toBe(byRegion.size);
  });

  it("shows a key for every region plotted", () => {
    render(<CapabilityAdjustedSection models={MODELS} />);
    for (const region of new Set(MODELS.map((m) => m.region))) {
      expect(screen.getByText(region)).toBeInTheDocument();
    }
  });

  // The ranked bars and their capability-weight slider moved into the leaderboard, which
  // shows the same ranking against all four risks. This section is now the
  // fixed published reference the page cites, so it carries no control.
  it("carries no slider of its own", () => {
    render(<CapabilityAdjustedSection models={MODELS} />);
    expect(screen.queryByRole("slider")).not.toBeInTheDocument();
  });

  it("no longer renders the ranked bar list", () => {
    render(<CapabilityAdjustedSection models={MODELS} />);
    expect(screen.queryByText(/reset to published/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/α sensitivity/i)).not.toBeInTheDocument();
  });
});

describe("scatter layout", () => {
  it("puts the plot and its explanation side by side, not stacked", () => {
    // Stacked, the prose pushed the leaderboard roughly a screen further down
    // while the right of the page sat empty. jsdom has no layout engine, so
    // this pins the contract rather than the rendered result.
    const { container } = render(<CapabilityAdjustedSection models={MODELS} />);
    const row = container.firstElementChild as HTMLElement;
    expect(row.style.display).toBe("flex");
    expect(row.style.flexWrap).toBe("wrap");

    const columns = [...row.children] as HTMLElement[];
    expect(columns).toHaveLength(2);
    expect(columns[0].querySelector("svg")).not.toBeNull();
    expect(columns[1].textContent).toContain("does not measure what happens when it complies");
  });

  it("lets the columns stack on their own rather than at a scripted breakpoint", () => {
    const { container } = render(<CapabilityAdjustedSection models={MODELS} />);
    const columns = [...(container.firstElementChild as HTMLElement).children] as HTMLElement[];
    for (const column of columns) expect(column.style.flex).toMatch(/^1 1 \d+px$/);
  });
});

describe("plot reference furniture", () => {
  const plot = () => screen.getByRole("img", { name: /intelligence index/i });

  it("splits the field at its medians and names the concern corner", () => {
    render(<CapabilityAdjustedSection models={MODELS} />);
    expect(plot().querySelectorAll("line[stroke-dasharray]")).toHaveLength(2);
    expect(screen.getByText(/more capable, less safe than the field median/i)).toBeInTheDocument();
  });

  it("shades the concern quadrant rather than outlining it", () => {
    render(<CapabilityAdjustedSection models={MODELS} />);
    const shade = plot().querySelector("rect")!;
    expect(shade.getAttribute("fill")).toMatch(/rgba\(220,38,38/);
    expect(Number(shade.getAttribute("width"))).toBeGreaterThan(0);
    expect(Number(shade.getAttribute("height"))).toBeGreaterThan(0);
  });

  it("draws the frontier through exactly the undominated models", () => {
    render(<CapabilityAdjustedSection models={MODELS} />);
    const points = plot().querySelector("polyline")!.getAttribute("points")!.trim().split(" ");
    expect(points).toHaveLength(attainableFrontier(MODELS).length);
  });

  it("places each frontier vertex on its own model's point", () => {
    // A polyline through the right count of wrong places would still pass the
    // test above.
    render(<CapabilityAdjustedSection models={MODELS} />);
    const drawn = plot().querySelector("polyline")!.getAttribute("points")!.trim().split(" ");
    const circles = [...plot().querySelectorAll("circle")];
    for (const model of attainableFrontier(MODELS)) {
      const dot = circles.find((c) => c.textContent?.includes(model.name))!;
      const at = `${dot.getAttribute("cx")},${dot.getAttribute("cy")}`;
      expect(drawn).toContain(at);
    }
  });

  it("says the reference lines are medians, not thresholds", () => {
    render(<CapabilityAdjustedSection models={MODELS} />);
    expect(document.body.textContent).toMatch(/medians of this roster, not thresholds/i);
  });
});
