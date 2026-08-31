import { describe, it, expect } from "vitest";
import {
  CLEARS_AT,
  adversarialCostSummary,
  ceilingSummary,
  highestRisk,
} from "@/lib/findings";
import { scoreOverall, scoreForRisk } from "@/lib/scoring";
import { RISKS, type ModelEntry, type Risk } from "@/data/models.types";
import modelsData from "@/data/models.json";

const MODELS = modelsData as unknown as ModelEntry[];

/**
 * A roster entry with every risk set explicitly under both aggregations, so a
 * fixture's expected output is arithmetic rather than a snapshot.
 */
function synthetic(
  id: string,
  worst: number | null,
  meanScore: number | null,
  perRisk: Partial<Record<Risk, { worst: number; mean: number }>> = {}
): ModelEntry {
  const results = Object.fromEntries(
    RISKS.map((r) => [
      r,
      {
        aggregate: { worst: perRisk[r]?.worst ?? worst, mean: perRisk[r]?.mean ?? meanScore },
        baseline: null,
        by_family: {},
        benchmarks: {},
      },
    ])
  ) as ModelEntry["results"];
  return {
    id,
    name: id,
    company: "Acme",
    region: "US",
    specialty: null,
    scores: Object.fromEntries(RISKS.map((r) => [r, perRisk[r]?.worst ?? worst ?? -1])) as ModelEntry["scores"],
    aggregate: { worst, mean: meanScore },
    results,
    status: Object.fromEntries(
      RISKS.map((r) => [r, { status: "success" as const, completed_samples: 1, total_samples: 1 }])
    ) as ModelEntry["status"],
    aa_intelligence_index: 40,
    aa_model_match: `${id} (AA match)`,
  };
}

describe("adversarialCostSummary", () => {
  it("computes the gap as mean minus worst, not the reverse", () => {
    // A sign flip is the likeliest bug here and a property test on the real
    // roster would not necessarily catch it.
    const summary = adversarialCostSummary([synthetic("a", 40, 70), synthetic("b", 50, 60)])!;
    expect(summary.largest.cost).toBe(30);
    expect(summary.smallest.cost).toBe(10);
    expect(summary.average).toBe(20);
  });

  it("counts how many clear the threshold under each aggregation", () => {
    const summary = adversarialCostSummary([synthetic("a", 40, 80), synthetic("b", 76, 90)])!;
    expect(summary.clearsOnWorst).toBe(1);
    expect(summary.clearsOnMean).toBe(2);
    expect(summary.total).toBe(2);
  });

  it("drops a model missing an aggregate rather than yielding NaN", () => {
    const summary = adversarialCostSummary([synthetic("a", 40, 70), synthetic("b", null, 60)])!;
    expect(summary.total).toBe(1);
    expect(Number.isFinite(summary.average)).toBe(true);
  });

  it("is undefined for a roster with nothing to measure", () => {
    expect(adversarialCostSummary([])).toBeUndefined();
    expect(adversarialCostSummary([synthetic("a", null, null)])).toBeUndefined();
  });

  it("agrees with the scores recomputed from the real roster", () => {
    const summary = adversarialCostSummary(MODELS)!;
    expect(summary.total).toBe(MODELS.length);
    for (const entry of [summary.largest, summary.smallest]) {
      expect(entry.cost).toBeCloseTo(
        scoreOverall(entry.model, "mean")! - scoreOverall(entry.model, "worst")!,
        10
      );
    }
    expect(summary.average).toBeGreaterThanOrEqual(summary.smallest.cost);
    expect(summary.average).toBeLessThanOrEqual(summary.largest.cost);
    expect(summary.clearsOnWorst).toBe(
      MODELS.filter((m) => scoreOverall(m, "worst")! > CLEARS_AT).length
    );
  });
});

describe("ceilingSummary", () => {
  it("reports the extremes and the median by construction", () => {
    const summary = ceilingSummary([
      synthetic("a", 10, 10),
      synthetic("b", 20, 20),
      synthetic("c", 30, 30),
      synthetic("d", 90, 90),
    ])!;
    expect(summary.best.score).toBe(90);
    expect(summary.lowest.score).toBe(10);
    expect(summary.median).toBe(25);
    expect(summary.belowHalf).toBe(3);
    expect(summary.clears).toBe(1);
  });

  it("honours the aggregation it is asked for", () => {
    const roster = [synthetic("a", 40, 80), synthetic("b", 45, 85)];
    expect(ceilingSummary(roster, "worst")!.best.score).toBe(45);
    expect(ceilingSummary(roster, "mean")!.best.score).toBe(85);
  });

  it("matches a manual filter over the real roster", () => {
    const summary = ceilingSummary(MODELS, "worst")!;
    expect(summary.clears).toBe(MODELS.filter((m) => scoreOverall(m, "worst")! > CLEARS_AT).length);
    expect(summary.belowHalf).toBe(MODELS.filter((m) => scoreOverall(m, "worst")! < 50).length);
    expect(summary.best.score).toBeGreaterThanOrEqual(summary.median);
    expect(summary.median).toBeGreaterThanOrEqual(summary.lowest.score);
  });

  it("is undefined for an empty roster", () => {
    expect(ceilingSummary([])).toBeUndefined();
  });
});

describe("highestRisk", () => {
  it("finds the lowest-scoring risk area", () => {
    const roster = [
      synthetic("a", 60, 60, { manipulation: { worst: 20, mean: 20 } }),
      synthetic("b", 60, 60, { manipulation: { worst: 30, mean: 30 } }),
    ];
    const finding = highestRisk(roster)!;
    expect(finding.risk).toBe("manipulation");
    expect(finding.worstMean).toBe(25);
    expect(finding.belowHalf).toBe(2);
  });

  it("reports consistentAcrossMetrics false when the two aggregations disagree", () => {
    // The single most important case here. On the real roster this is always
    // true, so an implementation hardcoding true would pass every other test.
    const roster = [
      synthetic("a", 60, 60, {
        manipulation: { worst: 10, mean: 90 },
        cyber: { worst: 90, mean: 10 },
      }),
    ];
    const finding = highestRisk(roster)!;
    expect(finding.consistentAcrossMetrics).toBe(false);
  });

  it("reports true when the same risk ranks last under both", () => {
    const roster = [
      synthetic("a", 60, 60, { manipulation: { worst: 10, mean: 15 } }),
    ];
    expect(highestRisk(roster)!.consistentAcrossMetrics).toBe(true);
  });

  it("holds on the real roster, so the page's unconditional wording stays true", () => {
    const finding = highestRisk(MODELS)!;
    expect(finding.consistentAcrossMetrics).toBe(true);
    expect(finding.belowHalf).toBe(
      MODELS.filter((m) => scoreForRisk(m, finding.risk, "worst")! < 50).length
    );
  });

  it("is undefined for an empty roster", () => {
    expect(highestRisk([])).toBeUndefined();
  });
});

describe("the counts strip is not accidentally reproduced", () => {
  it("no finding assembles the strip's literal wording", () => {
    // An existing page test asserts /\d+ models · \d+ providers · 4 systemic
    // risks/ appears exactly once. Prose like "16 models, 4 risks" could
    // collide with it by accident.
    const cost = adversarialCostSummary(MODELS)!;
    const rendered = `${cost.total} models ${cost.clearsOnMean} of ${cost.total}`;
    expect(rendered).not.toMatch(/\d+ models · \d+ providers · 4 systemic risks/);
  });
});
