import { describe, it, expect } from "vitest";
import { publishedRoster, isPartiallyEvaluated } from "@/lib/roster";
import { RISKS } from "@/data/models.types";
import modelsData from "@/data/models.json";
import type { ModelEntry } from "@/data/models.types";

const RAW = modelsData as unknown as ModelEntry[];
const ROSTER = publishedRoster(RAW);

describe("publishedRoster", () => {
  it("keeps every model", () => {
    expect(ROSTER).toHaveLength(RAW.length);
  });

  it("gives every model a score for all four risks", () => {
    for (const model of ROSTER) {
      for (const risk of RISKS) {
        expect(typeof model.scores[risk], `${model.id}.${risk}`).toBe("number");
      }
    }
  });

  it("promotes a partial score into the risk it belongs to", () => {
    const sol = ROSTER.find((m) => m.id === "gpt-5.6-sol")!;
    const raw = RAW.find((m) => m.id === "gpt-5.6-sol")!;
    const partial = (raw as unknown as { partial_scores: Record<string, { worst: number }> }).partial_scores;
    expect(sol.scores.cbrn).toBe(partial.cbrn.worst);
    expect(sol.scores.cyber).toBe(partial.cyber.worst);
  });

  it("recomputes the headline over all four risks, not the two that succeeded", () => {
    const sol = ROSTER.find((m) => m.id === "gpt-5.6-sol")!;
    const raw = RAW.find((m) => m.id === "gpt-5.6-sol")!;
    const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
    expect(sol.aggregate.worst).toBeCloseTo(mean(RISKS.map((r) => sol.results[r].aggregate!.worst!)), 6);
    expect(sol.aggregate.worst).not.toBe(raw.aggregate.worst);
  });

  it("leaves a fully evaluated model untouched", () => {
    const before = RAW.find((m) => m.id === "claude-sonnet-5")!;
    const after = ROSTER.find((m) => m.id === "claude-sonnet-5")!;
    expect(JSON.stringify(after)).toBe(JSON.stringify(before));
  });

  it("does not invent benchmark detail it does not have", () => {
    // The partial runs produced no per-benchmark or per-family results, so a
    // promoted risk must stay empty there rather than look complete.
    const sol = ROSTER.find((m) => m.id === "gpt-5.6-sol")!;
    // Empty, not absent: the grid dereferences both, and "?? {}" in the test
    // would have hidden an undefined that crashes the page.
    expect(sol.results.cbrn.benchmarks).toEqual({});
    expect(sol.results.cbrn.by_family).toEqual({});
    expect(sol.results.cyber.benchmarks).toEqual({});
  });
});

describe("isPartiallyEvaluated", () => {
  it("flags a model whose risks did not all succeed", () => {
    expect(isPartiallyEvaluated(ROSTER.find((m) => m.id === "gpt-5.6-sol")!)).toBe(true);
  });

  it("does not flag a model that completed every risk", () => {
    for (const model of ROSTER.filter((m) => m.id !== "gpt-5.6-sol")) {
      expect(isPartiallyEvaluated(model), model.id).toBe(false);
    }
  });
});
