import { describe, it, expect } from "vitest";
import {
  CAPABILITY_MIDPOINT,
  PUBLISHED_CAPABILITY_WEIGHT,
  adjustedSafety,
  capabilityScore,
} from "@/lib/capability-adjusted-safety";
import modelsData from "@/data/models.json";
import type { ModelEntry } from "@/data/models.types";

const MODELS = modelsData as unknown as ModelEntry[];

describe("capabilityScore", () => {
  it("reads zero for a model that can do nothing", () => {
    expect(capabilityScore(0)).toBe(0);
  });

  it("reads half-capable at the midpoint", () => {
    expect(capabilityScore(CAPABILITY_MIDPOINT)).toBeCloseTo(50, 10);
  });

  it("rises with the index", () => {
    const scores = [0, 10, 30, 55.8, 60, 120].map(capabilityScore);
    expect([...scores].sort((a, b) => a - b)).toEqual(scores);
  });

  it("approaches 100 without ever reaching it, so capability alone cannot zero a score", () => {
    // The index is unbounded and the roster's top value climbs with each
    // frontier release. A ceiling that could be *reached* would make the
    // headroom term zero and annihilate the safety term entirely.
    for (const index of [60, 120, 1000, 1e9]) {
      expect(capabilityScore(index)).toBeLessThan(100);
    }
    expect(capabilityScore(1e9)).toBeGreaterThan(99);
  });
});

describe("adjustedSafety", () => {
  it("returns measured safety exactly at zero capability weight", () => {
    // Exact, not close: s**1 * x**0 is s in IEEE754. These six scores are ones
    // the previous formula could not round-trip.
    for (const safety of [7.94, 26.19, 21.62, 19.51, 17.95, 29.27, 73.09]) {
      expect(adjustedSafety(safety, 45.3, 0)).toBe(safety);
    }
  });

  it("ignores capability entirely at zero weight", () => {
    for (const index of [0, 12.5, 60, 500]) {
      expect(adjustedSafety(63.4, index, 0)).toBe(63.4);
    }
  });

  it("ignores measured safety entirely at full weight", () => {
    const index = 30;
    const expected = 100 - capabilityScore(index);
    for (const safety of [0, 40, 100]) {
      expect(adjustedSafety(safety, index, 1)).toBeCloseTo(expected, 10);
    }
  });

  it("ranks a weak model above a capable one at equal measured safety", () => {
    expect(adjustedSafety(40, 8, 0.5)).toBeGreaterThan(adjustedSafety(40, 55, 0.5));
  });

  it("ranks a safer model above a less safe one at equal capability", () => {
    expect(adjustedSafety(70, 30, 0.5)).toBeGreaterThan(adjustedSafety(40, 30, 0.5));
  });

  it("never zeroes a perfectly safe model, however capable", () => {
    for (const index of [60, 120, 1000]) {
      expect(adjustedSafety(100, index, PUBLISHED_CAPABILITY_WEIGHT)).toBeGreaterThan(0);
    }
  });

  it("stays within the 0-100 scale for every model in the roster at every weight", () => {
    for (const model of MODELS) {
      for (const weight of [0, 0.25, 0.5, 0.75, 1]) {
        const value = adjustedSafety(model.aggregate.worst ?? 0, model.aa_intelligence_index, weight);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(100);
      }
    }
  });

  it("moves monotonically as the weight rises", () => {
    const series = [0, 0.2, 0.4, 0.6, 0.8, 1].map((w) => adjustedSafety(40, 8, w));
    expect([...series].sort((a, b) => a - b)).toEqual(series);
  });
});
