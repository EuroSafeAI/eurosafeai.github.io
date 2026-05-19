import type { ModelScores } from "@/lib/scoring";

/**
 * Region taxonomy is intentionally loose — the deployed data file uses
 * "USA Frontier Models" today; an in-progress migration uses the three-bucket
 * naming ("Frontier Leaders (USA)" / "Asian Powerhouses" / "Enterprise &
 * Specialized"). Keep this `string` until the data settles, then tighten.
 */
export type Region = string;

/**
 * Shape every entry in src/data/models.json must satisfy. Used by the
 * leaderboard UI, the per-model certificate page, and (informally — kept
 * in sync by convention) by scripts/generate-certificates.mjs.
 *
 * scores_meta is a raw eval-pipeline export (subscores like UDHR/ECHR
 * breakdowns). No UI consumes it; carried through the schema so the eval
 * pipeline's output shape and the deployed data shape stay aligned.
 */
export interface ModelEntry {
  id: string;
  name: string;
  company: string;
  region: Region;
  specialty: string;
  scores: ModelScores;
  scores_meta?: Record<string, unknown>;
}
