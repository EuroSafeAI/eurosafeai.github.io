import { describe, it, expect } from "vitest";
import {
  CAPABILITY_MIDPOINT,
  PUBLISHED_CAPABILITY_WEIGHT,
  adjustedSafety,
  attainableFrontier,
  axisTicks,
  capabilityCost,
  capabilityScore,
  indexDomain,
  planeMedians,
  spreadLabels,
  safetyCapabilityCorrelation,
  scatterPoint,
} from "@/lib/capability-adjusted-safety";
import { scoreOverall } from "@/lib/scoring";
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

describe("indexDomain", () => {
  it("brackets every model in the roster", () => {
    const { min, max } = indexDomain(MODELS);
    for (const m of MODELS) {
      expect(m.aa_intelligence_index).toBeGreaterThanOrEqual(min);
      expect(m.aa_intelligence_index).toBeLessThanOrEqual(max);
    }
  });

  it("leaves margin so no model sits exactly on an axis edge", () => {
    const { min, max } = indexDomain(MODELS);
    const indices = MODELS.map((m) => m.aa_intelligence_index);
    expect(min).toBeLessThan(Math.min(...indices));
    expect(max).toBeGreaterThan(Math.max(...indices));
  });

  it("never inverts, even for a single model", () => {
    const { min, max } = indexDomain([MODELS[0]]);
    expect(max).toBeGreaterThan(min);
  });
});

describe("scatterPoint", () => {
  const BOX = { width: 640, height: 340, pad: 44 };
  const DOMAIN = { min: 0, max: 60 };

  it("puts the domain's lower bound at the left edge and its upper at the right", () => {
    expect(scatterPoint(0, 50, BOX, DOMAIN).x).toBeCloseTo(BOX.pad, 6);
    expect(scatterPoint(60, 50, BOX, DOMAIN).x).toBeCloseTo(BOX.width - BOX.pad, 6);
  });

  it("plots the raw index linearly, not the rescaled capability", () => {
    // Half the domain must land at half the width. The capability rescale is
    // concave, so it would landleft of centre and the axis would misreport it.
    expect(scatterPoint(30, 50, BOX, DOMAIN).x).toBeCloseTo(BOX.pad + (BOX.width - 2 * BOX.pad) / 2, 6);
  });

  it("puts full safety at the top and zero safety at the bottom", () => {
    expect(scatterPoint(30, 100, BOX, DOMAIN).y).toBeCloseTo(BOX.pad, 6);
    expect(scatterPoint(30, 0, BOX, DOMAIN).y).toBeCloseTo(BOX.height - BOX.pad, 6);
  });

  it("spreads the real roster across most of the plot", () => {
    const domain = indexDomain(MODELS);
    const xs = MODELS.map((m) => scatterPoint(m.aa_intelligence_index, 50, BOX, domain).x);
    const usable = BOX.width - 2 * BOX.pad;
    expect(Math.max(...xs) - Math.min(...xs)).toBeGreaterThan(usable * 0.75);
  });
});

describe("safetyCapabilityCorrelation", () => {
  it("is undefined when there is nothing to correlate", () => {
    expect(safetyCapabilityCorrelation([])).toBeUndefined();
    expect(safetyCapabilityCorrelation([MODELS[0]])).toBeUndefined();
  });

  it("returns 1 for a roster where safety rises exactly with capability", () => {
    const rising = MODELS.slice(0, 4).map((m, i) => ({
      ...m,
      aa_intelligence_index: 10 * (i + 1),
      aggregate: { ...m.aggregate, worst: 20 * (i + 1) },
    }));
    expect(safetyCapabilityCorrelation(rising)).toBeCloseTo(1, 10);
  });

  it("returns -1 when they move exactly opposite", () => {
    const falling = MODELS.slice(0, 4).map((m, i) => ({
      ...m,
      aa_intelligence_index: 10 * (i + 1),
      aggregate: { ...m.aggregate, worst: 100 - 20 * (i + 1) },
    }));
    expect(safetyCapabilityCorrelation(falling)).toBeCloseTo(-1, 10);
  });

  it("shows the real roster's safety scores are a poor stand-in for capability", () => {
    // The page argues capability must be measured rather than inferred from
    // safety. That argument only holds while the two are loosely coupled.
    const r = safetyCapabilityCorrelation(MODELS)!;
    expect(Math.abs(r)).toBeLessThan(0.8);
  });
});

describe("planeMedians", () => {
  it("splits the roster at its median capability and safety", () => {
    const medians = planeMedians(MODELS)!;
    const above = MODELS.filter((m) => m.aa_intelligence_index >= medians.index).length;
    expect(above).toBeGreaterThanOrEqual(MODELS.length / 2 - 1);
    expect(above).toBeLessThanOrEqual(MODELS.length / 2 + 1);
  });

  it("is undefined when there is nothing to split", () => {
    expect(planeMedians([])).toBeUndefined();
  });
});

describe("attainableFrontier", () => {
  it("keeps only models nothing else beats on both axes", () => {
    const frontier = attainableFrontier(MODELS);
    for (const entry of frontier) {
      const beaten = MODELS.some(
        (other) =>
          other.id !== entry.id &&
          other.aa_intelligence_index >= entry.aa_intelligence_index &&
          scoreOverall(other)! >= scoreOverall(entry)! &&
          (other.aa_intelligence_index > entry.aa_intelligence_index ||
            scoreOverall(other)! > scoreOverall(entry)!)
      );
      expect(beaten).toBe(false);
    }
  });

  it("excludes every model that something else beats on both", () => {
    const frontier = new Set(attainableFrontier(MODELS).map((m) => m.id));
    for (const model of MODELS) {
      if (frontier.has(model.id)) continue;
      const beaten = MODELS.some(
        (other) =>
          other.id !== model.id &&
          other.aa_intelligence_index >= model.aa_intelligence_index &&
          scoreOverall(other)! >= scoreOverall(model)!
      );
      expect(beaten).toBe(true);
    }
  });

  it("returns the single model of a one-model roster", () => {
    expect(attainableFrontier([MODELS[0]]).map((m) => m.id)).toEqual([MODELS[0].id]);
  });

  it("is ordered by capability so it can be drawn as a line", () => {
    const indices = attainableFrontier(MODELS).map((m) => m.aa_intelligence_index);
    expect([...indices].sort((a, b) => a - b)).toEqual(indices);
  });

  it("is empty for an empty roster", () => {
    expect(attainableFrontier([])).toEqual([]);
  });
});

describe("spreadLabels", () => {
  const gap = 11;

  it("leaves labels alone when nothing overlaps", () => {
    const boxes = [
      { x: 0, y: 0, width: 40 },
      { x: 0, y: 50, width: 40 },
    ];
    expect(spreadLabels(boxes, gap)).toEqual([0, 50]);
  });

  it("does not move labels that are far apart horizontally", () => {
    // Same height, but nowhere near each other across the plot.
    const boxes = [
      { x: 0, y: 20, width: 40 },
      { x: 300, y: 20, width: 40 },
    ];
    expect(spreadLabels(boxes, gap)).toEqual([20, 20]);
  });

  it("steps overlapping labels apart", () => {
    const boxes = [
      { x: 0, y: 20, width: 60 },
      { x: 10, y: 24, width: 60 },
    ];
    const [first, second] = spreadLabels(boxes, gap);
    expect(Math.abs(second - first)).toBeGreaterThanOrEqual(gap);
  });

  it("separates a whole cluster, not just the first pair", () => {
    const boxes = [0, 2, 4, 6].map((y) => ({ x: 0, y, width: 60 }));
    const placed = spreadLabels(boxes, gap);
    const sorted = [...placed].sort((a, b) => a - b);
    for (let i = 1; i < sorted.length; i += 1) {
      expect(sorted[i] - sorted[i - 1]).toBeGreaterThanOrEqual(gap);
    }
  });

  it("returns one position per label, in the order given", () => {
    const boxes = [
      { x: 0, y: 30, width: 50 },
      { x: 5, y: 32, width: 50 },
      { x: 400, y: 31, width: 50 },
    ];
    const placed = spreadLabels(boxes, gap);
    expect(placed).toHaveLength(3);
    expect(placed[2]).toBe(31);
  });

  it("resolves every collision on the real roster", () => {
    const domain = indexDomain(MODELS);
    const box = { width: 820, height: 430, pad: 48 };
    const boxes = MODELS.map((m) => {
      const point = scatterPoint(m.aa_intelligence_index, m.aggregate.worst!, box, domain);
      return { x: point.x + 9, y: point.y + 4, width: m.name.length * 5 };
    });
    const placed = spreadLabels(boxes, gap);
    for (let a = 0; a < boxes.length; a += 1) {
      for (let b = a + 1; b < boxes.length; b += 1) {
        const overlapX = boxes[a].x < boxes[b].x + boxes[b].width && boxes[a].x + boxes[a].width > boxes[b].x;
        if (overlapX) expect(Math.abs(placed[a] - placed[b])).toBeGreaterThanOrEqual(gap);
      }
    }
  });
});

describe("capabilityCost", () => {
  it("reports a near-zero gap when high capability costs no safety", () => {
    const cost = capabilityCost(MODELS)!;
    expect(cost.gap).toBeCloseTo(cost.bestOverall - cost.bestAtHighCapability, 10);
    expect(cost.gap).toBeLessThan(5);
    expect(cost.forcesATradeoff).toBe(false);
  });

  it("reports a tradeoff when the capable half really is less safe", () => {
    // The branch the real roster never exercises. Without this the flag could
    // be hardcoded false and every other test would still pass.
    const roster = MODELS.slice(0, 4).map((m, i) => ({
      ...m,
      aa_intelligence_index: i < 2 ? 10 : 90,
      aggregate: { ...m.aggregate, worst: i < 2 ? 95 : 20 },
    }));
    const cost = capabilityCost(roster)!;
    expect(cost.forcesATradeoff).toBe(true);
    expect(cost.gap).toBeGreaterThan(50);
  });

  it("is undefined when there is nothing to compare", () => {
    expect(capabilityCost([])).toBeUndefined();
  });
});

describe("axisTicks", () => {
  it("returns round numbers a reader can hold in their head", () => {
    expect(axisTicks(0, 100, 5)).toEqual([0, 25, 50, 75, 100]);
  });

  it("stays inside the domain it is given", () => {
    const ticks = axisTicks(3.5, 59.7, 5);
    for (const tick of ticks) {
      expect(tick).toBeGreaterThanOrEqual(3.5);
      expect(tick).toBeLessThanOrEqual(59.7);
    }
  });

  it("is evenly spaced and ascending", () => {
    const ticks = axisTicks(3.5, 59.7, 5);
    expect(ticks.length).toBeGreaterThanOrEqual(2);
    const step = ticks[1] - ticks[0];
    for (let i = 1; i < ticks.length; i += 1) {
      expect(ticks[i] - ticks[i - 1]).toBeCloseTo(step, 6);
      expect(ticks[i]).toBeGreaterThan(ticks[i - 1]);
    }
  });

  it("uses a step from the 1, 2, 5, 10 family rather than an arbitrary one", () => {
    const step = axisTicks(0, 57, 5)[1] - axisTicks(0, 57, 5)[0];
    const mantissa = step / 10 ** Math.floor(Math.log10(step));
    expect([1, 2, 5, 10]).toContain(Math.round(mantissa));
  });

  it("copes with a degenerate domain rather than looping", () => {
    expect(axisTicks(5, 5, 5)).toEqual([5]);
  });
});
