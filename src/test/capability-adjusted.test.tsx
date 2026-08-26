import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CAPABILITY_EXPONENT, CAPABILITY_REFERENCE, adjustedRanking, scatterPoint } from "@/lib/risk-index";
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

function rowFor(name: string) {
  const nameNodes = screen.getAllByText(name);
  const row = nameNodes.map((node) => node.closest("div[title]")).find((node) => node !== null);
  expect(row).toBeTruthy();
  return row!;
}

function assertAdjacency(models: ModelEntry[], alpha: number) {
  const ranking = adjustedRanking(models, alpha);
  expect(ranking.length).toBe(16);
  for (const entry of ranking) {
    const rowText = rowFor(entry.model.name).textContent ?? "";
    expect(rowText).toContain(entry.adjusted.toFixed(1));
    expect(rowText).toContain(entry.safety.toFixed(1));
    expect(rowText).toContain(entry.index.toFixed(1));
  }
}

describe("CapabilityAdjustedSection", () => {
  it("shows every ranked model's raw safety and capability index beside its adjusted score", () => {
    render(<CapabilityAdjustedSection models={MODELS} />);
    assertAdjacency(MODELS, CAPABILITY_EXPONENT);
  });

  it("keeps capability adjacent to the adjusted score at a non-default alpha", () => {
    render(<CapabilityAdjustedSection models={MODELS} />);
    fireEvent.change(screen.getByRole("slider"), { target: { value: "0.9" } });
    assertAdjacency(MODELS, 0.9);
  });

  it("moving the slider changes the displayed adjusted values and the row order", () => {
    render(<CapabilityAdjustedSection models={MODELS} />);

    const defaultRanking = adjustedRanking(MODELS, CAPABILITY_EXPONENT);
    const top = defaultRanking[0];
    expect(rowFor(top.model.name).getAttribute("data-rank")).toBe("0");

    fireEvent.change(screen.getByRole("slider"), { target: { value: "1" } });

    const safetyRanking = adjustedRanking(MODELS, 1);
    for (const entry of safetyRanking) {
      const row = rowFor(entry.model.name);
      expect(row.textContent).toContain(entry.adjusted.toFixed(1));
      expect(row.getAttribute("data-rank")).toBe(String(safetyRanking.indexOf(entry)));
    }
    expect(safetyRanking.map((e) => e.model.id)).not.toEqual(defaultRanking.map((e) => e.model.id));
  });

  it("resets to the published ranking and hides the reset control at the default", () => {
    render(<CapabilityAdjustedSection models={MODELS} />);

    expect(screen.queryByRole("button", { name: /reset/i })).toBeNull();

    fireEvent.change(screen.getByRole("slider"), { target: { value: "0" } });
    expect(screen.getByRole("button", { name: /reset/i })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /reset/i }));

    expect(screen.queryByRole("button", { name: /reset/i })).toBeNull();
    expect((screen.getByRole("slider") as HTMLInputElement).value).toBe(String(CAPABILITY_EXPONENT));

    const defaultRanking = adjustedRanking(MODELS, CAPABILITY_EXPONENT);
    for (const entry of defaultRanking) {
      const row = rowFor(entry.model.name);
      expect(row.textContent).toContain(entry.adjusted.toFixed(1));
    }
  });
});
