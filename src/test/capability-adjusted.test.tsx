import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CAPABILITY_REFERENCE, adjustedRanking, scatterPoint } from "@/lib/risk-index";
import { CapabilityAdjustedSection } from "@/components/CapabilityAdjusted";
import modelsData from "@/data/models.json";
import type { ModelEntry } from "@/data/models.types";

const MODELS = modelsData as unknown as ModelEntry[];

const BOX = { width: 600, height: 320, pad: 40 };

describe("scatterPoint", () => {
  it("puts the origin at the bottom left of the plot area", () => {
    expect(scatterPoint(0, 0, BOX)).toEqual({ x: 40, y: 280 });
  });

  it("puts full capability and full safety at the top right", () => {
    expect(scatterPoint(CAPABILITY_REFERENCE, 100, BOX)).toEqual({ x: 560, y: 40 });
  });

  it("clamps an index above the reference to the right edge", () => {
    expect(scatterPoint(CAPABILITY_REFERENCE * 2, 50, BOX).x).toBe(560);
  });
});



describe("CapabilityAdjustedSection", () => {
  it("plots one point per scored model", () => {
    render(<CapabilityAdjustedSection models={MODELS} />);
    const plot = screen.getByRole("img", { name: /capability/i });
    expect(plot.querySelectorAll("circle")).toHaveLength(adjustedRanking(MODELS).length);
  });

  it("places each point by raw safety and capability, not by the adjusted score", () => {
    render(<CapabilityAdjustedSection models={MODELS} />);
    const circles = [...screen.getByRole("img", { name: /capability/i }).querySelectorAll("circle")];
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

  it("names each point's adjusted score, safety and capability", () => {
    render(<CapabilityAdjustedSection models={MODELS} />);
    const entry = adjustedRanking(MODELS)[0];
    expect(screen.getByText(new RegExp(`${entry.model.name}: adjusted`))).toBeInTheDocument();
  });

  // The ranked bars and their alpha slider moved into the leaderboard, which
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
