/**
 * Roster statistics stated as findings on the certificate page.
 *
 * Every figure here is derived rather than typed, following
 * safetyCapabilityCorrelation in capability-adjusted-safety.ts. The principle
 * extends further than that one does, though: an *invariant* can go stale as
 * easily as a number. "Manipulation is weakest under both metrics" is true of
 * today's roster, not a law, so weakestRisk recomputes it and the page's copy
 * branches on the answer instead of asserting it.
 */
import type { ModelEntry, Risk } from "@/data/models.types";
import { RISKS } from "@/data/models.types";
import { mean, median, scoreForRisk, scoreOverall, type Aggregation } from "@/lib/scoring";

/** The score a model has to beat to be described as clearing the bar. */
export const CLEARS_AT = 75;

/** Below this a score is described as failing rather than merely weak. */
const HALF = 50;

export interface AdversarialCost {
  model: ModelEntry;
  /** The worst-case score. Never named `worst` alone: that reads as an Aggregation. */
  worstScore: number;
  meanScore: number;
  cost: number;
}

export interface AdversarialCostSummary {
  average: number;
  largest: AdversarialCost;
  smallest: AdversarialCost;
  countOverAverage: number;
  clearsOnMean: number;
  clearsOnWorst: number;
  total: number;
}

/**
 * What adversarial perturbation costs each model: the distance between its
 * pooled average and the worst case it can be pushed to.
 */
export function adversarialCostSummary(
  models: readonly ModelEntry[]
): AdversarialCostSummary | undefined {
  const costs: AdversarialCost[] = [];
  for (const model of models) {
    const worstScore = scoreOverall(model, "worst");
    const meanScore = scoreOverall(model, "mean");
    if (worstScore === undefined || meanScore === undefined) continue;
    costs.push({ model, worstScore, meanScore, cost: meanScore - worstScore });
  }
  if (costs.length === 0) return undefined;

  const average = mean(costs.map((c) => c.cost))!;
  const ranked = [...costs].sort((a, b) => b.cost - a.cost);
  return {
    average,
    largest: ranked[0],
    smallest: ranked[ranked.length - 1],
    countOverAverage: costs.filter((c) => c.cost > average).length,
    clearsOnMean: costs.filter((c) => c.meanScore > CLEARS_AT).length,
    clearsOnWorst: costs.filter((c) => c.worstScore > CLEARS_AT).length,
    total: costs.length,
  };
}

export interface CeilingSummary {
  best: { model: ModelEntry; score: number };
  lowest: { model: ModelEntry; score: number };
  median: number;
  clears: number;
  belowHalf: number;
  total: number;
  how: Aggregation;
}

/** Where the field tops out, and how far the rest trails it. */
export function ceilingSummary(
  models: readonly ModelEntry[],
  how: Aggregation = "worst"
): CeilingSummary | undefined {
  const scored = models
    .map((model) => ({ model, score: scoreOverall(model, how) }))
    .filter((entry): entry is { model: ModelEntry; score: number } => entry.score !== undefined);
  if (scored.length === 0) return undefined;

  const ranked = [...scored].sort((a, b) => b.score - a.score);
  return {
    best: ranked[0],
    lowest: ranked[ranked.length - 1],
    median: median(scored.map((entry) => entry.score))!,
    clears: scored.filter((entry) => entry.score > CLEARS_AT).length,
    belowHalf: scored.filter((entry) => entry.score < HALF).length,
    total: scored.length,
    how,
  };
}

export interface WeakestRisk {
  risk: Risk;
  worstMean: number;
  meanMean: number;
  belowHalf: number;
  total: number;
  /** True when the same risk ranks last under both aggregations. */
  consistentAcrossMetrics: boolean;
}

const fieldMean = (models: readonly ModelEntry[], risk: Risk, how: Aggregation) =>
  mean(models.map((model) => scoreForRisk(model, risk, how)));

/** The systemic risk the field handles least well. */
export function weakestRisk(models: readonly ModelEntry[]): WeakestRisk | undefined {
  const rows = RISKS.map((risk) => ({
    risk,
    worstMean: fieldMean(models, risk, "worst"),
    meanMean: fieldMean(models, risk, "mean"),
  })).filter(
    (row): row is { risk: Risk; worstMean: number; meanMean: number } =>
      row.worstMean !== undefined && row.meanMean !== undefined
  );
  if (rows.length === 0) return undefined;

  const byWorst = [...rows].sort((a, b) => a.worstMean - b.worstMean)[0];
  const byMean = [...rows].sort((a, b) => a.meanMean - b.meanMean)[0];
  const scored = models.filter((m) => scoreForRisk(m, byWorst.risk, "worst") !== undefined);

  return {
    risk: byWorst.risk,
    worstMean: byWorst.worstMean,
    meanMean: byWorst.meanMean,
    belowHalf: scored.filter((m) => scoreForRisk(m, byWorst.risk, "worst")! < HALF).length,
    total: scored.length,
    consistentAcrossMetrics: byWorst.risk === byMean.risk,
  };
}
