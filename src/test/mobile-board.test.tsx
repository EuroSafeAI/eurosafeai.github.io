/**
 * The phone layout shows the same numbers as the wide grid, in a different
 * arrangement. That is the whole contract, and it is the one a future change
 * to either layout could quietly break.
 */

import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MobileBoard } from "@/components/leaderboard/MobileBoard";
import { adjustedOverallScore, adjustedProviderCellScore, buildColumns, riskKey } from "@/lib/leaderboard";
import { grade } from "@/lib/scoring";
import modelsData from "@/data/models.json";
import type { ModelEntry } from "@/data/models.types";
import { RISKS } from "@/data/models.types";

const MODELS = modelsData as unknown as ModelEntry[];
const board = () => render(<MobileBoard models={MODELS} metric="worst" weight={0} grouping="org" />);

describe("MobileBoard", () => {
  it("gives every provider a row", () => {
    board();
    const providers = buildColumns(MODELS, "worst", 0, "org").map((c) => c.provider);
    expect(providers.length).toBeGreaterThan(0);
    for (const p of providers) expect(screen.getByText(p)).toBeInTheDocument();
  });

  it("ranks providers in the same order as the wide grid", () => {
    board();
    const expected = buildColumns(MODELS, "worst", 0, "org").map((c) => c.provider);
    const shown = screen.getAllByRole("rowheader").map((r) => r.textContent?.trim());
    expect(shown).toEqual(expected);
  });

  it("shows an overall column plus one per systemic risk", () => {
    board();
    const rows = buildColumns(MODELS, "worst", 0, "org").length;
    // +1 header row's worth of cells is not counted: headers are columnheaders.
    expect(screen.getAllByRole("cell").length).toBe(rows * (RISKS.length + 1));
  });

  it("prints the same grade the scoring library derives", () => {
    board();
    const column = buildColumns(MODELS, "worst", 0, "org")[0];
    const overall = adjustedOverallScore(column.models, "worst", 0);
    expect(overall).toBeDefined();
    const cell = screen.getByTitle(new RegExp(`^${column.provider} — overall`));
    expect(cell.textContent).toContain(grade(overall as number));
    expect(cell.textContent).toContain((overall as number).toFixed(1));
  });

  it("prints each risk score to one decimal, matching the grid's own helper", () => {
    board();
    const column = buildColumns(MODELS, "worst", 0, "org")[0];
    for (const risk of RISKS) {
      const score = adjustedProviderCellScore(
        column.models,
        { key: riskKey(risk), level: "risk", risk },
        "worst",
        0
      );
      if (score === undefined) continue;
      const cells = screen.getAllByTitle(new RegExp(`^${column.provider} — `));
      expect(cells.some((c) => c.textContent?.includes(score.toFixed(1)))).toBe(true);
    }
  });

  it("follows the metric toggle", () => {
    const { rerender } = board();
    const column = buildColumns(MODELS, "worst", 0, "org")[0];
    const worst = adjustedOverallScore(column.models, "worst", 0) as number;
    rerender(<MobileBoard models={MODELS} metric="mean" weight={0} grouping="org" />);
    const mean = adjustedOverallScore(column.models, "mean", 0) as number;
    // The two aggregations differ on this roster; if they ever stop differing
    // this assertion is the wrong way to prove the toggle is wired up.
    expect(mean).not.toBeCloseTo(worst, 1);
    expect(screen.getByText(mean.toFixed(1))).toBeInTheDocument();
  });

  it("opens the benchmarks behind a grade when its cell is tapped", () => {
    board();
    const column = buildColumns(MODELS, "worst", 0, "org")[0];
    const cell = screen.getByTitle(new RegExp(`^${column.provider} — CBRN`));
    expect(cell).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(cell);
    expect(cell).toHaveAttribute("aria-expanded", "true");
    // The evidence is the point: a grade the reader cannot open is a number
    // they have to take on trust.
    expect(document.body.textContent).toMatch(/benchmarks/i);
  });

  it("closes it again on a second tap", () => {
    board();
    const column = buildColumns(MODELS, "worst", 0, "org")[0];
    const cell = screen.getByTitle(new RegExp(`^${column.provider} — CBRN`));
    fireEvent.click(cell);
    fireEvent.click(cell);
    expect(cell).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps only one panel open, since each one is full width", () => {
    board();
    const column = buildColumns(MODELS, "worst", 0, "org")[0];
    const cbrn = screen.getByTitle(new RegExp(`^${column.provider} — CBRN`));
    const cyber = screen.getByTitle(new RegExp(`^${column.provider} — Cyber`));
    fireEvent.click(cbrn);
    fireEvent.click(cyber);
    expect(cbrn).toHaveAttribute("aria-expanded", "false");
    expect(cyber).toHaveAttribute("aria-expanded", "true");
  });
});
