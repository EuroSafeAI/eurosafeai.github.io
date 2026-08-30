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
  // Algebraically the formula already collapses to `safety` here, but
  // 100 - (100 - safety) does not round-trip in binary floating point for 351
  // of the roster's 16,269 scores. The leaderboard rests at alpha = 1 and has
  // to show its measured numbers untouched, so the identity is returned rather
  // than recomputed.
  if (alpha === 1) return safety;
  return 100 - (100 - safety) ** alpha * capabilityWeight(index) ** (1 - alpha);
}

export interface AdjustedEntry {
  model: ModelEntry;
  adjusted: number;
  safety: number;
  index: number;
}

export function adjustedRanking(
  models: readonly ModelEntry[],
  alpha: number = CAPABILITY_EXPONENT
): AdjustedEntry[] {
  const entries: AdjustedEntry[] = [];
  for (const model of models) {
    const safety = scoreOverall(model);
    if (safety === undefined) continue;
    entries.push({
      model,
      safety,
      index: model.aa_intelligence_index,
      adjusted: adjustedSafety(safety, model.aa_intelligence_index, alpha),
    });
  }
  return entries.sort((a, b) => b.adjusted - a.adjusted);
}

export interface ScatterBox {
  width: number;
  height: number;
  pad: number;
}

/** Capability on x, raw safety on y, y inverted for SVG's downward axis. */
export function scatterPoint(
  index: number,
  safety: number,
  box: ScatterBox
): { x: number; y: number } {
  const span = box.width - 2 * box.pad;
  const rise = box.height - 2 * box.pad;
  const capability = Math.min(1, index / CAPABILITY_REFERENCE);
  return {
    x: box.pad + span * capability,
    y: box.pad + rise * (1 - safety / 100),
  };
}
