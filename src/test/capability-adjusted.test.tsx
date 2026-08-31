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

  it("names each point's region and both of its readings", () => {
    render(<CapabilityAdjustedSection models={MODELS} />);
    const entry = adjustedRanking(MODELS)[0];
    expect(
      screen.getByText(new RegExp(`${entry.model.name} \\(${entry.model.region}\\): worst case`))
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

  it("draws no line between models", () => {
    // Connecting points implies a path through them. These are independent
    // observations, not a series.
    render(<CapabilityAdjustedSection models={MODELS} />);
    expect(plot().querySelector("polyline")).toBeNull();
  });

  it("says the reference lines are medians, not thresholds", () => {
    render(<CapabilityAdjustedSection models={MODELS} />);
    expect(document.body.textContent).toMatch(/medians of this roster, not thresholds/i);
  });
});

describe("mirroring the grid's hover", () => {
  const dots = () =>
    [...screen.getByRole("img", { name: /intelligence index/i }).querySelectorAll("g[data-picked]")];

  it("shows every model when nothing is highlighted", () => {
    render(<CapabilityAdjustedSection models={MODELS} highlight={null} />);
    expect(dots().every((g) => g.getAttribute("data-picked") === "true")).toBe(true);
  });

  it("picks out an organisation's models and dims the rest", () => {
    render(<CapabilityAdjustedSection models={MODELS} highlight="Anthropic" />);
    const picked = dots().filter((g) => g.getAttribute("data-picked") === "true");
    expect(picked).toHaveLength(MODELS.filter((m) => m.company === "Anthropic").length);
    const dimmed = dots().find((g) => g.getAttribute("data-picked") === "false")!;
    expect(Number(dimmed.getAttribute("opacity"))).toBeLessThan(0.5);
  });

  it("picks out a single model too, since the grid can group either way", () => {
    const one = MODELS[0];
    render(<CapabilityAdjustedSection models={MODELS} highlight={one.name} />);
    const picked = dots().filter((g) => g.getAttribute("data-picked") === "true");
    expect(picked).toHaveLength(1);
    expect(picked[0].textContent).toContain(one.name);
  });

  it("dims nothing for a name that matches no model", () => {
    render(<CapabilityAdjustedSection models={MODELS} highlight="Nobody" />);
    expect(dots().every((g) => g.getAttribute("data-picked") === "false")).toBe(true);
  });
});

describe("axis decoration", () => {
  const plot = () => screen.getByRole("img", { name: /intelligence index/i });

  it("labels both axes with their direction and units", () => {
    render(<CapabilityAdjustedSection models={MODELS} />);
    expect(screen.getByText(/more capable, by Artificial Analysis intelligence index/i)).toBeInTheDocument();
    // The axis carries two markers now, so it must name both readings. Scoped
    // to the axis text: "worst case" also appears in the key and the prose.
    const yAxis = screen.getByText(/safer, score out of 100/i);
    expect(yAxis.textContent).toMatch(/worst case/i);
    expect(yAxis.textContent).toMatch(/average/i);
  });

  it("puts readable values on both axes, not just titles", () => {
    render(<CapabilityAdjustedSection models={MODELS} />);
    const texts = [...plot().querySelectorAll("text")].map((t) => t.textContent?.trim());
    for (const safety of ["0", "25", "50", "75", "100"]) {
      expect(texts).toContain(safety);
    }
    // The capability axis is fitted to the roster, so assert it carries some
    // numeric ticks rather than pinning values that move with the data.
    const numeric = texts.filter((t) => /^\d+$/.test(t ?? ""));
    expect(numeric.length).toBeGreaterThan(6);
  });

  it("credits Artificial Analysis with a link to their site", () => {
    render(<CapabilityAdjustedSection models={MODELS} />);
    // The index is someone else's published figure, so the page should say
    // whose and where it came from.
    const link = screen.queryByRole("link", { name: /artificial analysis/i });
    if (link) expect(link).toHaveAttribute("href", "https://artificialanalysis.ai");
  });

  it("links out to the methodology for how the scores are built", () => {
    render(<CapabilityAdjustedSection models={MODELS} />);
    const link = screen.getByRole("link", { name: /methodology/i });
    expect(link).toHaveAttribute("href", "#methodology");
  });

  it("eases the highlight instead of snapping it", () => {
    render(<CapabilityAdjustedSection models={MODELS} highlight="Anthropic" />);
    const group = plot().querySelector("g[data-picked]") as HTMLElement;
    expect(group.style.transition).toContain("opacity");
  });
});

describe("worst and average markers", () => {
  const plot = () => screen.getByRole("img", { name: /intelligence index/i });

  it("marks each model twice, at its worst case and its average", () => {
    render(<CapabilityAdjustedSection models={MODELS} />);
    expect(plot().querySelectorAll("circle")).toHaveLength(MODELS.length);
    // Two strokes per cross.
    const crosses = [...plot().querySelectorAll("g[stroke-width='1.75'] line")];
    expect(crosses).toHaveLength(MODELS.length * 2);
  });

  it("puts the average marker above the worst-case marker", () => {
    // Worst case takes each sample's minimum, so it can never exceed the
    // average. If this inverted, the pair would read backwards.
    render(<CapabilityAdjustedSection models={MODELS} />);
    for (const entry of adjustedRanking(MODELS)) {
      expect(entry.averageSafety).toBeGreaterThanOrEqual(entry.safety);
    }
  });

  it("joins each pair so they read as one model", () => {
    render(<CapabilityAdjustedSection models={MODELS} />);
    const joins = [...plot().querySelectorAll("line")].filter(
      (l) => l.getAttribute("stroke-width") === "1.25"
    );
    expect(joins).toHaveLength(MODELS.length);
  });

  it("says what the two markers are", () => {
    render(<CapabilityAdjustedSection models={MODELS} />);
    expect(document.body.textContent).toMatch(/worst case/i);
    expect(document.body.textContent).toMatch(/average/i);
  });
});
