import { describe, it, expect } from "vitest";
import modelsData from "@/data/models.json";
import type { ModelEntry } from "@/data/models.types";
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
});
