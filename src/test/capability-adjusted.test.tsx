import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CapabilityAdjustedSection } from "@/components/CapabilityAdjusted";
import modelsData from "@/data/models.json";
import type { ModelEntry } from "@/data/models.types";

const MODELS = modelsData as unknown as ModelEntry[];

const PROVIDERS = [...new Set(MODELS.map((m) => m.company))];
const plot = () => screen.getByRole("img", { name: /intelligence index/i });

describe("CapabilityAdjustedSection", () => {
  it("plots one point per provider, not per model", () => {
    render(<CapabilityAdjustedSection models={MODELS} />);
    for (const provider of PROVIDERS) {
      expect(screen.getAllByText(provider).length).toBeGreaterThan(0);
    }
  });

  it("keeps every model's marker mounted so opening can be animated", () => {
    // A mount cannot be transitioned, so the models are always present and
    // parked on their provider until it opens.
    render(<CapabilityAdjustedSection models={MODELS} />);
    expect(plot().querySelectorAll("g[data-model]")).toHaveLength(MODELS.length);
  });

  it("hides the models until their provider is opened", () => {
    render(<CapabilityAdjustedSection models={MODELS} />);
    for (const g of plot().querySelectorAll("g[data-model]")) {
      expect(g.getAttribute("data-open")).toBe("false");
      expect(g.getAttribute("opacity")).toBe("0");
    }
  });

  it("opens one provider's models when the grid highlights it", () => {
    render(<CapabilityAdjustedSection models={MODELS} highlight="Anthropic" />);
    const open = [...plot().querySelectorAll('g[data-model][data-open="true"]')];
    expect(open).toHaveLength(MODELS.filter((m) => m.company === "Anthropic").length);
  });

  it("parks a closed provider's models on the provider marker", () => {
    // Closed, every model sits at the same place: its provider's point. That
    // is what makes the open look like the models moving out of it.
    render(<CapabilityAdjustedSection models={MODELS} />);
    const anthropic = MODELS.filter((m) => m.company === "Anthropic").map((m) => m.id);
    const positions = anthropic.map((id) => {
      const c = plot().querySelector(`g[data-model="${id}"] circle`)!;
      return `${c.getAttribute("cx")},${c.getAttribute("cy")}`;
    });
    expect(new Set(positions).size).toBe(1);
  });

  it("moves them apart once open", () => {
    render(<CapabilityAdjustedSection models={MODELS} highlight="Anthropic" />);
    const anthropic = MODELS.filter((m) => m.company === "Anthropic").map((m) => m.id);
    const positions = anthropic.map((id) => {
      const c = plot().querySelector(`g[data-model="${id}"] circle`)!;
      return `${c.getAttribute("cx")},${c.getAttribute("cy")}`;
    });
    expect(new Set(positions).size).toBe(anthropic.length);
  });

  it("eases the move rather than snapping it", () => {
    render(<CapabilityAdjustedSection models={MODELS} />);
    const circle = plot().querySelector("g[data-model] circle") as SVGElement;
    expect(circle.style.transition).toMatch(/cx/);
  });

  it("carries no slider of its own", () => {
    render(<CapabilityAdjustedSection models={MODELS} />);
    expect(screen.queryByRole("slider")).not.toBeInTheDocument();
  });

  it("labels both axes with their direction and units", () => {
    render(<CapabilityAdjustedSection models={MODELS} />);
    const yAxis = screen.getByText(/safer, score out of 100/i);
    expect(yAxis.textContent).toMatch(/worst case/i);
    expect(yAxis.textContent).toMatch(/average/i);
    expect(screen.getByText(/more capable, by Artificial Analysis intelligence index/i)).toBeInTheDocument();
  });

  it("puts readable values on both axes", () => {
    render(<CapabilityAdjustedSection models={MODELS} />);
    const texts = [...plot().querySelectorAll("text")].map((t) => t.textContent?.trim());
    for (const safety of ["0", "25", "50", "75", "100"]) expect(texts).toContain(safety);
  });

  it("links to the methodology and to Artificial Analysis", () => {
    render(<CapabilityAdjustedSection models={MODELS} />);
    expect(screen.getByRole("link", { name: /methodology/i })).toHaveAttribute("href", "#methodology");
  });

  it("draws no line between models", () => {
    render(<CapabilityAdjustedSection models={MODELS} />);
    expect(plot().querySelector("polyline")).toBeNull();
  });

  it("splits the field at its medians and names the concern corner", () => {
    render(<CapabilityAdjustedSection models={MODELS} />);
    expect(plot().querySelectorAll("line[stroke-dasharray]")).toHaveLength(2);
    expect(screen.getByText(/more capable, less safe than the field median/i)).toBeInTheDocument();
  });

  it("plots nothing for an empty roster", () => {
    render(<CapabilityAdjustedSection models={[]} />);
    expect(screen.getByRole("img", { name: /intelligence index/i }).querySelectorAll("circle")).toHaveLength(0);
  });
});
