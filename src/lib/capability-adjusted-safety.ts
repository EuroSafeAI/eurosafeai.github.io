/**
 * Capability-adjusted safety: a model's measured safety weighed against how
 * much it can actually do. A model that cannot accomplish much cannot cause
 * much, so limited capability counts in its favour.
 *
 *   adjusted = safety^(1−w) · (100 − capability)^w
 *
 * A weighted geometric mean of two quantities on the same 0–100 scale, both
 * of which mean "higher is better": measured safety, and the room a model
 * does *not* have to cause harm. Higher is safer, matching every other number
 * on the certificate page.
 *
 * Both constants live here rather than in the pipeline: this is presentation
 * math over two already-published numbers, and the weight is meant to be
 * tunable without re-running an evaluation. The form is roster-independent on
 * purpose — adding a model never moves another model's score, which a
 * regression against the roster would.
 */
import type { ModelEntry } from "@/data/models.types";
import { scoreOverall } from "@/lib/scoring";

/**
 * The Artificial Analysis intelligence index at which a model reads
 * half-capable. The index is unbounded and its frontier climbs with each
 * release, so this is a midpoint rather than a maximum — treating any value
 * as "full capability" would put a reachable ceiling in the formula.
 */
export const CAPABILITY_MIDPOINT = 60;

/**
 * The published weight, cited on the page. 0 is measured safety alone; 1 is
 * capability alone.
 */
export const PUBLISHED_CAPABILITY_WEIGHT = 0.5;

/**
 * The intelligence index rescaled to 0–100. Asymptotic, never reaching 100:
 * the formula subtracts this from 100, and a capability that could reach the
 * ceiling would zero the product outright — annihilating the safety term and
 * scoring even a perfectly safe model at 0.
 */
export function capabilityScore(index: number): number {
  return (100 * index) / (index + CAPABILITY_MIDPOINT);
}

export function adjustedSafety(
  safety: number,
  index: number,
  weight: number = PUBLISHED_CAPABILITY_WEIGHT
): number {
  const capability = capabilityScore(index);
  return safety ** (1 - weight) * (100 - capability) ** weight;
}

export interface AdjustedEntry {
  model: ModelEntry;
  adjusted: number;
  safety: number;
  index: number;
}

export function adjustedRanking(
  models: readonly ModelEntry[],
  weight: number = PUBLISHED_CAPABILITY_WEIGHT
): AdjustedEntry[] {
  const entries: AdjustedEntry[] = [];
  for (const model of models) {
    const safety = scoreOverall(model);
    if (safety === undefined) continue;
    entries.push({
      model,
      safety,
      index: model.aa_intelligence_index,
      adjusted: adjustedSafety(safety, model.aa_intelligence_index, weight),
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
  return {
    x: box.pad + span * (capabilityScore(index) / 100),
    y: box.pad + rise * (1 - safety / 100),
  };
}
