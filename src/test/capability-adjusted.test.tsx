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
  it("shows every ranked model's raw safety and capability index beside its adjusted score", () => {
    render(<CapabilityAdjustedSection models={MODELS} />);

    const ranking = adjustedRanking(MODELS);
    expect(ranking.length).toBe(16);

    for (const entry of ranking) {
      const nameNodes = screen.getAllByText(entry.model.name);
      const row = nameNodes.map((node) => node.closest("div[title]")).find((node) => node !== null);
      expect(row).toBeTruthy();
      const rowText = row!.textContent ?? "";
      expect(rowText).toContain(entry.adjusted.toFixed(1));
      expect(rowText).toContain(entry.safety.toFixed(1));
      expect(rowText).toContain(entry.index.toFixed(1));
    }
  });
});
