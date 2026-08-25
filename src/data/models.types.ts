/**
 * Shape of src/data/models.json, copied verbatim from the evaluation pipeline
 * at ~/projects/certificate/models/models.json (written by certify.py).
 *
 * Every number in this tree is 0–100 where **higher is safer**. Two absence
 * conventions coexist and both must be treated as "no score":
 *   - `null`  — the quantity is undefined for that node (e.g. `stability` on a
 *               derived source that has no samples of its own)
 *   - `-1`    — certify.py's sentinel for a risk whose aggregate never resolved
 *
 * Use the accessors in src/lib/scoring.ts rather than reading the tree directly;
 * they collapse both conventions to `undefined`.
 */

export const RISKS = ["cbrn", "cyber", "loss_of_control", "manipulation"] as const;
export type Risk = (typeof RISKS)[number];

/** Perturbation families. `control` is the unperturbed baseline, never an attack. */
export const CONDITIONS = [
  "control",
  "framing",
  "identity_strip",
  "paraphrase",
  "reconsideration",
  "register",
  "scenario",
] as const;
export type Condition = (typeof CONDITIONS)[number];

export interface Aggregate {
  worst: number | null;
  mean: number | null;
}

/**
 * Per-scorer breakdown of one condition. Keys are either OpenRouter model ids
 * (LLM judges, e.g. "openrouter/anthropic/claude-sonnet-4.5") or deterministic
 * detector names (e.g. "exact_match"). The key set is ragged — judges that
 * abstained on every sample of a condition are absent from it entirely — so
 * never assume a fixed set and never index positionally.
 */
export type ScorerScores = Record<string, number>;

export interface ConditionResult {
  safety: number;
  stability: number | null;
  scored: number;
  abstained: number;
  total: number;
  scorers: ScorerScores;
}

export interface BenchmarkResult {
  aggregate: Aggregate;
  baseline: number | null;
  /**
   * Present only when true. Diagnostic benchmarks are reported but deliberately
   * excluded from every aggregate above them, because their scores don't mean
   * what a safety score means (wmdp scores ignorance as restraint;
   * cyber_false_refusal is a counter-metric that blanket refusal would game).
   */
  diagnostic?: boolean;
  conditions: Partial<Record<Condition, ConditionResult>>;
}

export interface RiskResult {
  aggregate: Aggregate;
  baseline: number | null;
  by_family: Record<string, number>;
  benchmarks: Record<string, BenchmarkResult>;
}

export interface RiskStatus {
  status: "success" | "partial" | "failed";
  completed_samples: number;
  total_samples: number;
  error?: string;
}

export interface ModelEntry {
  id: string;
  name: string;
  company: string;
  region: string;
  specialty: string | null;
  /** Flat headline per risk. Equal to results[risk].aggregate.worst, or -1. */
  scores: Record<Risk, number>;
  aggregate: Aggregate;
  results: Record<Risk, RiskResult>;
  status: Record<Risk, RiskStatus>;
  /** Artificial Analysis intelligence index, matched upstream by scripts/match_aa_index.py. */
  aa_intelligence_index: number;
  /** The AA variant this model was matched to, e.g. "Gemini 3.6 Flash (high)". */
  aa_model_match: string;
}
