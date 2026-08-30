import { describe, it, expect } from "vitest";
import modelsData from "@/data/models.json";
import type { ModelEntry } from "@/data/models.types";
import { scoreOverall } from "@/lib/scoring";
import {
  CAPABILITY_REFERENCE,
  adjustedRanking,
  adjustedSafety,
  capabilityWeight,
} from "@/lib/risk-index";

const MODELS = modelsData as unknown as ModelEntry[];

describe("capabilityWeight", () => {
  it("scores the reference capability at 100", () => {
    expect(capabilityWeight(CAPABILITY_REFERENCE)).toBeCloseTo(100, 6);
  });

  it("clamps above the reference", () => {
    expect(capabilityWeight(CAPABILITY_REFERENCE * 2)).toBe(100);
  });

  it("is linear below the reference", () => {
    expect(capabilityWeight(CAPABILITY_REFERENCE / 2)).toBeCloseTo(50, 6);
  });
});

describe("adjustedSafety", () => {
  it("reproduces raw safety at alpha = 1", () => {
    expect(adjustedSafety(73.1, 55.3, 1)).toBeCloseTo(73.1, 6);
  });

  it("reproduces pure capability at alpha = 0", () => {
    expect(adjustedSafety(73.1, 30, 0)).toBeCloseTo(100 - capabilityWeight(30), 6);
  });

  it("rises as capability falls, at fixed safety", () => {
    expect(adjustedSafety(50, 20)).toBeGreaterThan(adjustedSafety(50, 50));
  });

  it("rises as safety rises, at fixed capability", () => {
    expect(adjustedSafety(80, 40)).toBeGreaterThan(adjustedSafety(40, 40));
  });

  it("puts a capable unsafe model below a weak unsafe one", () => {
    expect(adjustedSafety(30.8, 45.3)).toBeLessThan(adjustedSafety(16.2, 19.7));
  });
});

describe("adjustedRanking", () => {
  it("ranks the published roster as recorded in the spec", () => {
    const actual = adjustedRanking(MODELS).map((e) => [e.model.id, Number(e.adjusted.toFixed(1))]);
    expect(actual).toEqual([
      ["llama-3.1-8b-instruct", 71.9],
      ["claude-haiku-4.5", 63.5],
      ["gpt-oss-120b", 63.0],
      ["grok-4.3", 50.9],
      ["gemma-4-31b-it", 50.4],
      ["claude-sonnet-5", 50.2],
      ["glm-5", 48.9],
      ["gpt-5.6-luna-pro", 47.6],
      ["mistral-small-2603", 47.6],
      ["deepseek-v4-flash", 43.2],
      ["qwen3.7-flash", 42.3],
      ["glm-5.2", 39.3],
      ["grok-4.5", 38.5],
      ["gemini-3.6-flash", 36.6],
      ["mistral-medium-3-5", 36.5],
      ["deepseek-v4-pro", 27.7],
    ]);
  });

  it("carries each model's raw safety and index alongside", () => {
    const sonnet = adjustedRanking(MODELS).find((e) => e.model.id === "claude-sonnet-5")!;
    expect(sonnet.safety).toBeCloseTo(73.09, 2);
    expect(sonnet.index).toBeCloseTo(55.3, 2);
  });

  it("orders by raw safety alone at alpha = 1", () => {
    const actual = adjustedRanking(MODELS, 1).map((e) => e.model.id);
    const bySafety = [...MODELS]
      .filter((m) => scoreOverall(m) !== undefined)
      .sort((a, b) => scoreOverall(b)! - scoreOverall(a)!)
      .map((m) => m.id);
    expect(actual).toEqual(bySafety);
  });

  it("orders by inverse capability alone at alpha = 0", () => {
    const actual = adjustedRanking(MODELS, 0).map((e) => e.model.id);
    const byInverseCapability = [...MODELS]
      .filter((m) => scoreOverall(m) !== undefined)
      .sort((a, b) => a.aa_intelligence_index - b.aa_intelligence_index)
      .map((m) => m.id);
    expect(actual).toEqual(byInverseCapability);
  });

  it("defaults to the published exponent, matching the pinned alpha = 0.5 fixture", () => {
    expect(adjustedRanking(MODELS)).toEqual(adjustedRanking(MODELS, 0.5));
  });
});

describe("adjustedSafety at alpha = 1", () => {
  // 100 - (100 - s) reintroduces floating-point error: 351 of the 16,269
  // scores in the roster do not survive the round trip. The leaderboard rests
  // at alpha = 1 and must show its measured numbers untouched, so the identity
  // is short-circuited rather than computed.
  const LOSSY = [7.94, 26.19, 21.62, 19.51, 17.95, 29.27];

  it("returns raw safety exactly, not merely close", () => {
    for (const safety of LOSSY) {
      expect(adjustedSafety(safety, 45.3, 1)).toBe(safety);
    }
  });

  it("covers scores the naive formula would perturb", () => {
    for (const safety of LOSSY) {
      expect(100 - (100 - safety) ** 1 * 1 ** 0).not.toBe(safety);
    }
  });

  it("is independent of the capability index", () => {
    for (const index of [0, 12.5, 45.3, 60, 99]) {
      expect(adjustedSafety(63.4, index, 1)).toBe(63.4);
    }
  });
});
