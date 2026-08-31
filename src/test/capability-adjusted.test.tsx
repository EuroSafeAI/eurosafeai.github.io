import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { adjustedRanking } from "@/lib/capability-adjusted-safety";
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
  it("gives the plot the full width and puts its explanation below", () => {
    // The two-column arrangement was built when this section was capped at
    // 1100px. Spanning the page, a narrow text column beside a very wide plot
    // read as a leftover rather than a pairing.
    const { container } = render(<CapabilityAdjustedSection models={MODELS} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.display).not.toBe("flex");

    const [plot, prose] = [...root.children] as HTMLElement[];
    expect(plot.querySelector("svg")).not.toBeNull();
    expect(prose.textContent).toContain("does not measure what happens when it complies");
  });

  it("keeps the explanation at a readable measure rather than page width", () => {
    const { container } = render(<CapabilityAdjustedSection models={MODELS} />);
    const prose = [...(container.firstElementChild as HTMLElement).children][1] as HTMLElement;
    expect(Number(prose.style.maxWidth.replace("px", ""))).toBeLessThanOrEqual(800);
  });
});
