/**
 * Grading and score-access primitives for the systemic-risk leaderboard.
 *
 * Every score in the pipeline's output is 0–100, higher = safer. Absence has
 * two encodings (`null` and the `-1` sentinel); `toScore` is the single place
 * that collapses both, so the rest of the app only ever sees `number | undefined`.
 */

import { RISKS, type ModelEntry, type Risk } from "@/data/models.types";

/**
 * Absolute, linear grade scale: 15 equal bands across 0–100, F− at the bottom
 * and A+ at the top. The same function grades a risk, a benchmark and a single
 * judge, so a colour means the same thing everywhere in the heatmap.
 */
export const GRADES = [
  "F−", "F", "F+",
  "D−", "D", "D+",
  "C−", "C", "C+",
  "B−", "B", "B+",
  "A−", "A", "A+",
] as const;

export type Grade = (typeof GRADES)[number];

export const GRADE_BAND = 100 / GRADES.length;

export function grade(score: number): Grade {
  const index = Math.floor(score / GRADE_BAND);
  return GRADES[Math.min(GRADES.length - 1, Math.max(0, index))];
}

/** The same score on a 4.0 scale, for readers who think in GPAs. */
export function gpa(score: number): number {
  return Math.round((score / 25) * 100) / 100;
}

/**
 * Normalise a raw value from models.json. `null` means the quantity is
 * undefined for that node; `-1` is certify.py's sentinel for a risk whose
 * aggregate never resolved. Both render as an em-dash.
 */
export function toScore(value: number | null | undefined): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return undefined;
  return value;
}

/** Mean of the defined values; undefined if there are none. Not rounded. */
export function mean(values: readonly (number | undefined)[]): number | undefined {
  const present = values.filter((v): v is number => v !== undefined);
  if (present.length === 0) return undefined;
  return present.reduce((a, b) => a + b, 0) / present.length;
}

/**
 * Which of the two aggregates a cell reads.
 *
 * `worst` is the headline: each sample contributes its lowest safety across the
 * non-control conditions, and the figure is the mean of those. `mean` pools the
 * same samples without the per-sample minimum. They diverge when a model's
 * failures are spread across different perturbations rather than concentrated
 * in one — which is why both are shown (pipeline/utils/results.py: "when the
 * two diverge, one transform is carrying the result").
 */
/**
 * Median of the defined values.
 *
 * An even count averages the two middle values rather than taking either one:
 * the roster has 16 models, where a naive midpoint index reports 58.0 against
 * a true median of 55.6.
 */
export function median(values: readonly (number | undefined)[]): number | undefined {
  const defined = values.filter((v): v is number => v !== undefined).sort((a, b) => a - b);
  if (defined.length === 0) return undefined;
  const middle = Math.floor(defined.length / 2);
  return defined.length % 2 === 1 ? defined[middle] : (defined[middle - 1] + defined[middle]) / 2;
}

export type Aggregation = "worst" | "mean";

export function scoreForRisk(
  model: ModelEntry,
  risk: Risk,
  how: Aggregation = "worst"
): number | undefined {
  return toScore(model.results[risk]?.aggregate[how]);
}

export function scoreForBenchmark(
  model: ModelEntry,
  risk: Risk,
  bench: string,
  how: Aggregation = "worst"
): number | undefined {
  return toScore(model.results[risk]?.benchmarks[bench]?.aggregate[how]);
}

export interface Coverage {
  scored: number;
  total: number;
}

/**
 * How many samples reached a verdict, summed over the non-control conditions.
 *
 * A judge that abstains on a sample is dropped rather than coerced, so a cell's
 * grade can rest on a fraction of the suite — and how large that fraction is
 * varies by model, because different judge rosters abstain at different rates.
 * Counts live on the condition, not the scorer, so this is the finest grain the
 * data supports: every judge within a benchmark shares one coverage figure.
 */
export function coverageForBenchmark(
  model: ModelEntry,
  risk: Risk,
  bench: string
): Coverage | undefined {
  const conditions = model.results[risk]?.benchmarks[bench]?.conditions;
  if (!conditions) return undefined;
  return sumCoverage(
    Object.entries(conditions)
      .filter(([name]) => name !== "control")
      .map(([, c]) => ({ scored: c.scored, total: c.total }))
  );
}

/** Coverage across the risk's non-diagnostic benchmarks — the ones its score is built from. */
export function coverageForRisk(model: ModelEntry, risk: Risk): Coverage | undefined {
  const benchmarks = model.results[risk]?.benchmarks;
  if (!benchmarks) return undefined;
  return sumCoverage(
    Object.entries(benchmarks)
      .filter(([, b]) => b.diagnostic !== true)
      .map(([bench]) => coverageForBenchmark(model, risk, bench))
  );
}

export function sumCoverage(parts: readonly (Coverage | undefined)[]): Coverage | undefined {
  const present = parts.filter((c): c is Coverage => c !== undefined && c.total > 0);
  if (present.length === 0) return undefined;
  return {
    scored: present.reduce((n, c) => n + c.scored, 0),
    total: present.reduce((n, c) => n + c.total, 0),
  };
}

export const coverageFraction = (c: Coverage) => c.scored / c.total;

/** A model's headline: the mean of its four systemic-risk scores, precomputed upstream. */
export function scoreOverall(model: ModelEntry, how: Aggregation = "worst"): number | undefined {
  return toScore(model.aggregate[how]);
}

export function coverageOverall(model: ModelEntry): Coverage | undefined {
  return sumCoverage(RISKS.map((risk) => coverageForRisk(model, risk)));
}
