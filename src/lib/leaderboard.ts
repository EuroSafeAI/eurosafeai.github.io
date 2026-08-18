/**
 * Row and column model for the systemic-risk heatmap, plus the display names
 * for the ids that models.json carries bare.
 *
 * Pure data — no React — so the whole shape of the table is unit-testable.
 * Columns are providers (expandable into their models); rows are a three-level
 * tree: systemic risk → benchmark → LLM judge.
 */

import { RISKS, type ModelEntry, type Risk } from "@/data/models.types";
import {
  coverageForBenchmark,
  coverageForRisk,
  coverageOverall,
  mean,
  optimisticScore,
  scoreForBenchmark,
  scoreForJudge,
  scoreForRisk,
  scoreOverall,
  sumCoverage,
  type Aggregation,
  type Coverage,
} from "@/lib/scoring";

export interface Column {
  provider: string;
  models: ModelEntry[];
}

export type Row =
  | { key: string; level: "risk"; risk: Risk }
  | { key: string; level: "bench"; risk: Risk; bench: string; diagnostic: boolean }
  | {
      key: string;
      level: "judge";
      risk: Risk;
      bench: string;
      scorer: string;
      floor: boolean;
      /** Inherited from the parent benchmark — the caveat covers the breakdown too. */
      diagnostic: boolean;
    };

export const riskKey = (risk: Risk) => risk;
export const benchKey = (risk: Risk, bench: string) => `${risk}/${bench}`;

/** Verbatim from the pipeline's evals/clusters.py, which defines the taxonomy. */
export const RISK_LABELS: Record<Risk, string> = {
  cbrn: "CBRN",
  cyber: "Cyber",
  loss_of_control: "Loss of Control",
  manipulation: "Manipulation",
};

export const RISK_DESCRIPTIONS: Record<Risk, string> = {
  cbrn: "Chemical, biological, radiological and nuclear misuse",
  cyber: "Offensive cyber capability, and refusal of benign security work",
  loss_of_control: "Scheming, instrumental convergence, oversight subversion",
  manipulation: "Dark patterns, unethical influence, political manipulation",
};

export const BENCHMARK_LABELS: Record<string, string> = {
  harmbench: "HarmBench",
  sosbench: "SOSBench",
  wmdp: "WMDP",
  agentharm: "AgentHarm",
  cyber_false_refusal: "MITRE False Refusal",
  cyberseceval_mitre: "CyberSecEval MITRE",
  cysecbench: "CySecBench",
  injecagent: "InjecAgent",
  advanced_ai_risk: "Advanced AI Risk",
  authoritarian_values: "Authoritarian Values",
  darkbench: "DarkBench",
  historical_revisionism: "Historical Revisionism",
  human_rights_echr: "Human Rights (ECHR)",
  human_rights_persona_gap: "Human Rights Persona Gap",
  human_rights_udhr: "Human Rights (UDHR)",
  leader_favorability: "Leader Favorability",
  persusafety: "PersuSafety",
  role_model_bias: "Role Model Bias",
  social_harm: "SocialHarmBench",
  sycophancy_mimicry: "Sycophancy (Mimicry)",
};

const JUDGE_LABELS: Record<string, string> = {
  "openrouter/anthropic/claude-sonnet-4.5": "Claude Sonnet 4.5",
  "openrouter/openai/gpt-5.6-luna": "GPT-5.6 Luna",
};

const DETECTOR_LABELS: Record<string, string> = {
  exact_match: "Exact match",
  refusal_regex: "Refusal regex",
  scale_parse: "Scale parse",
  accept_reject_token: "Accept/reject token",
  attribution_mimicry: "Attribution mimicry",
  react_attacker_tool_call: "ReAct attacker tool call",
};

/** Judge keys are OpenRouter model ids; everything else is a deterministic detector. */
export function isLlmJudge(scorer: string): boolean {
  return scorer.startsWith("openrouter/");
}

/**
 * The one benchmark that scores with `refusal_regex` natively — it has no judge
 * (datasets/prepare/cluster/sources/cyber.py declares `detector=REFUSAL_REGEX`
 * for this source alone).
 */
const NATIVE_REFUSAL_REGEX_BENCHMARK = "cyber_false_refusal";

/**
 * True when a `refusal_regex` entry is the *refusal floor* rather than a
 * measurement.
 *
 * The floor (pipeline/stage1_evaluation/scorers/cluster.py::_refusal_floor)
 * fires only when a compliance-family sample was plainly refused and no judge
 * reached a verdict, and it always emits SAFE — so its value is invariably
 * 100.0. Grading it alongside the judges would read as "this scorer rated the
 * model perfectly safe" when it actually means "the judges abstained on some
 * refusals". It is shown without a grade instead.
 *
 * The floor is gated away from cyber_false_refusal, whose prompts are benign:
 * there refusing is the failure, and a floor would score over-refusal as safe.
 */
export function isRefusalFloor(bench: string, scorer: string): boolean {
  return scorer === "refusal_regex" && bench !== NATIVE_REFUSAL_REGEX_BENCHMARK;
}

export function judgeRowLabel(row: Extract<Row, { level: "judge" }>): string {
  return row.floor ? "Refusal floor" : scorerLabel(row.scorer);
}

export function judgeRowKind(row: Extract<Row, { level: "judge" }>): string {
  if (row.floor) return "unscored counted safe";
  return isLlmJudge(row.scorer) ? "LLM judge" : "deterministic scorer";
}

export function scorerLabel(scorer: string): string {
  return (
    JUDGE_LABELS[scorer] ??
    DETECTOR_LABELS[scorer] ??
    // A judge the roster hasn't been taught yet: show the bare model name.
    (isLlmJudge(scorer) ? scorer.split("/").pop()! : scorer)
  );
}

export function buildColumns(models: ModelEntry[]): Column[] {
  const byProvider = new Map<string, ModelEntry[]>();
  for (const model of models) {
    const group = byProvider.get(model.company);
    if (group) group.push(model);
    else byProvider.set(model.company, [model]);
  }
  return [...byProvider.entries()]
    .map(([provider, group]) => ({ provider, models: group }))
    .sort((a, b) => providerAggregate(b) - providerAggregate(a));
}

function providerAggregate(column: Column): number {
  return mean(column.models.map((m) => m.aggregate.worst ?? undefined)) ?? -1;
}

/**
 * Flatten the row tree to the currently visible rows. A benchmark's judges stay
 * hidden while its risk is collapsed, so `expandedBenches` need not be pruned
 * when a risk closes — reopening it restores the previous depth.
 */
export function buildRows(
  models: ModelEntry[],
  expandedRisks: ReadonlySet<string>,
  expandedBenches: ReadonlySet<string>
): Row[] {
  const rows: Row[] = [];
  for (const risk of RISKS) {
    rows.push({ key: riskKey(risk), level: "risk", risk });
    if (!expandedRisks.has(riskKey(risk))) continue;

    for (const bench of orderedBenchmarks(models, risk)) {
      const key = benchKey(risk, bench);
      const diagnostic = isDiagnostic(models, risk, bench);
      rows.push({ key, level: "bench", risk, bench, diagnostic });
      if (!expandedBenches.has(key)) continue;

      for (const scorer of orderedScorers(models, risk, bench)) {
        rows.push({
          key: `${key}/${scorer}`,
          level: "judge",
          risk,
          bench,
          scorer,
          floor: isRefusalFloor(bench, scorer),
          diagnostic,
        });
      }
    }
  }
  return rows;
}

/** Best-scoring first, but diagnostics always last — their scores aren't safety. */
function orderedBenchmarks(models: ModelEntry[], risk: Risk): string[] {
  const names = new Set<string>();
  for (const model of models) {
    for (const bench of Object.keys(model.results[risk]?.benchmarks ?? {})) names.add(bench);
  }
  return [...names].sort((a, b) => {
    const diagnostic = Number(isDiagnostic(models, risk, a)) - Number(isDiagnostic(models, risk, b));
    if (diagnostic !== 0) return diagnostic;
    return cohortScore(models, risk, b) - cohortScore(models, risk, a);
  });
}

function cohortScore(models: ModelEntry[], risk: Risk, bench: string): number {
  return mean(models.map((m) => scoreForBenchmark(m, risk, bench))) ?? -1;
}

function isDiagnostic(models: ModelEntry[], risk: Risk, bench: string): boolean {
  return models.some((m) => m.results[risk]?.benchmarks[bench]?.diagnostic === true);
}

/** LLM judges, then deterministic detectors, then the refusal floor; alphabetical within each. */
function orderedScorers(models: ModelEntry[], risk: Risk, bench: string): string[] {
  const names = new Set<string>();
  for (const model of models) {
    const conditions = model.results[risk]?.benchmarks[bench]?.conditions ?? {};
    for (const [name, condition] of Object.entries(conditions)) {
      if (name === "control") continue;
      for (const scorer of Object.keys(condition.scorers)) names.add(scorer);
    }
  }
  const rank = (scorer: string) =>
    isRefusalFloor(bench, scorer) ? 2 : isLlmJudge(scorer) ? 0 : 1;
  return [...names].sort(
    (a, b) => rank(a) - rank(b) || scorerLabel(a).localeCompare(scorerLabel(b))
  );
}

export function modelScore(
  model: ModelEntry,
  row: Row,
  how: Aggregation = "worst"
): number | undefined {
  switch (row.level) {
    case "risk":
      return scoreForRisk(model, row.risk, how);
    case "bench":
      return scoreForBenchmark(model, row.risk, row.bench, how);
    case "judge":
      // The floor row reports its benchmark's optimistic bound — the same score
      // with every unscored sample counted as safe — because that, not the
      // floor's own constant 1.0, is the quantity a reader wants from it.
      if (row.floor) {
        return optimisticScore(
          scoreForBenchmark(model, row.risk, row.bench, how),
          coverageForBenchmark(model, row.risk, row.bench)
        );
      }
      // A judge's per-sample scores aren't in this file, so there is no
      // worst-case counterpart — only its mean across the conditions.
      return how === "worst" ? scoreForJudge(model, row.risk, row.bench, row.scorer) : undefined;
  }
}

/** A collapsed provider column shows the mean across the models it covers. */
export function providerScore(
  models: ModelEntry[],
  row: Row,
  how: Aggregation = "worst"
): number | undefined {
  return mean(models.map((m) => modelScore(m, row, how)));
}

export function modelCoverage(model: ModelEntry, row: Row): Coverage | undefined {
  return row.level === "risk"
    ? coverageForRisk(model, row.risk)
    : coverageForBenchmark(model, row.risk, row.bench);
}

/**
 * The headline that sits under a column's name: the mean of the four
 * systemic-risk scores, pooled across whichever models the column covers — one
 * model for a member column, all of them for a collapsed provider.
 */
export function overallScore(
  models: ModelEntry[],
  how: Aggregation = "worst"
): number | undefined {
  return mean(models.map((m) => scoreOverall(m, how)));
}

export function overallCoverage(models: ModelEntry[]): Coverage | undefined {
  return sumCoverage(models.map(coverageOverall));
}

/** Provider coverage pools the raw counts rather than averaging fractions. */
export function providerCoverage(models: ModelEntry[], row: Row): Coverage | undefined {
  return sumCoverage(models.map((m) => modelCoverage(m, row)));
}
