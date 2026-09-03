/**
 * Roster helpers over the published pipeline export.
 *
 * The export now describes a partially-evaluated model on its own: a cluster
 * whose run failed still carries its per-benchmark results over the samples that
 * scored, its `status` says the run failed, and the coverage counts fold in the
 * provider's content-filter refusals (the certificate pipeline's
 * results.py::_coverage counts a refused sample in the denominator). The
 * headline is computed across all four risks in the export itself.
 *
 * So the editorial promotion that used to live here — filling a failed risk from
 * a separate `partial_scores` field, normalising its results to empty, and
 * recomputing the headline — is gone: the numbers come straight from the data.
 */
import type { ModelEntry } from "@/data/models.types";

/** True when any of a model's four risk runs did not complete. */
export function isPartiallyEvaluated(model: ModelEntry): boolean {
  return Object.values(model.status ?? {}).some((entry) => entry?.status !== "success");
}
