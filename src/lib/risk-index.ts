/**
 * Capability-adjusted safety: the published safety grade conditioned on how
 * much the model can actually do. A model that cannot accomplish much cannot
 * cause much, so its unsafety is discounted by its Artificial Analysis
 * intelligence index.
 *
 *   adjusted = 100 − (100 − safety)^α · min(100, 100·AA/AA_ref)^(1−α)
 *
 * Higher is safer, matching every other number on the certificate page.
 *
 * Both constants live here rather than in the pipeline: this is presentation
 * math over two already-published numbers, and α is meant to be tunable
 * without re-running an evaluation. The form is roster-independent on
 * purpose — adding a model never moves another model's score, which a
 * regression against the roster would.
 */
import type { ModelEntry } from "@/data/models.types";
import { scoreOverall } from "@/lib/scoring";

/** α: how much of the result is unsafety rather than capability. */
export const CAPABILITY_EXPONENT = 0.5;

/**
 * AA_ref: the intelligence index treated as full capability. The highest index
 * in the roster today is 56.8, so the clamp in capabilityWeight is not
 * hypothetical — the next frontier release crosses it.
 */
export const CAPABILITY_REFERENCE = 60;

export function capabilityWeight(index: number): number {
  return Math.min(100, (100 * index) / CAPABILITY_REFERENCE);
}

export function adjustedSafety(
  safety: number,
  index: number,
  alpha: number = CAPABILITY_EXPONENT
): number {
  return 100 - (100 - safety) ** alpha * capabilityWeight(index) ** (1 - alpha);
}

export interface AdjustedEntry {
  model: ModelEntry;
  adjusted: number;
  safety: number;
  index: number;
}

export function adjustedRanking(models: readonly ModelEntry[]): AdjustedEntry[] {
  const entries: AdjustedEntry[] = [];
  for (const model of models) {
    const safety = scoreOverall(model);
    if (safety === undefined) continue;
    entries.push({
      model,
      safety,
      index: model.aa_intelligence_index,
      adjusted: adjustedSafety(safety, model.aa_intelligence_index),
    });
  }
  return entries.sort((a, b) => b.adjusted - a.adjusted);
}
