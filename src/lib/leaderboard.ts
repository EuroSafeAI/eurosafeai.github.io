/**
 * Row and column model for the systemic-risk heatmap, plus the display names
 * for the ids that models.json carries bare.
 *
 * Pure data — no React — so the whole shape of the table is unit-testable.
 * Columns are providers (expandable into their models); rows are a three-level
 * tree: systemic risk → benchmark → LLM judge.
 */

import { RISKS, type ModelEntry, type Risk } from "@/data/models.types";
import { adjustedSafety } from "@/lib/risk-index";
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

/**
 * What the model was asked to do, and what counts as failing — in the words a
 * reader who has never met the benchmark needs. Derived from the pipeline's
 * source definitions (datasets/prepare/cluster/sources/*.py); the citation on
 * each line is where the claim comes from and is why these can be checked
 * rather than taken on trust.
 */
export const BENCHMARK_DESCRIPTIONS: Record<string, string> = {
  // cbrn.py
  harmbench:
    "Direct requests to carry out chemical or biological harm; only that category enters this risk. Failing means carrying the request out.",
  sosbench:
    "Requests for operationally useful CBRN help. Failing means content that materially increases the requester's capability, including in visible reasoning.",
  wmdp:
    "Multiple-choice questions on weaponisation knowledge: whether the model knows hazardous material, not whether it declines to act on it.",
  // cyber.py
  cysecbench:
    "Requests for offensive cyber capability, rated from refusal to a fully working answer, so a vague reply is not scored as a usable exploit.",
  cyberseceval_mitre:
    "Requests mapped to MITRE ATT&CK techniques; failing means assisting the technique.",
  agentharm:
    "Cybercrime and fraud tasks. No tools are granted, so what is measured is whether the model takes the job on, not whether it completes it.",
  cyber_false_refusal:
    "Benign security questions. Failing means refusing legitimate work — the opposite error to the rest of this risk.",
  injecagent:
    "A poisoned tool response planted in the agent's scratchpad. Failing means acting on the injected instruction instead of the user's.",
  // loss_of_control.py
  advanced_ai_risk:
    "Forced-choice questions asking directly whether the model wants power, resources, survival, or to coordinate with other AIs against its principals.",
  // manipulation.py
  social_harm:
    "Requests for harmful social or political content. Failing means producing it rather than declining or redirecting.",
  historical_revisionism:
    "Prompts inviting the model to distort documented history; judged as a binary truth call.",
  human_rights_udhr:
    "Prompts arguing to limit a right named in the Universal Declaration, scored on how far the response endorses the limitation.",
  human_rights_echr:
    "The same, for rights named in the European Convention on Human Rights.",
  human_rights_persona_gap:
    "Not a benchmark: the difference between how the model answers the same human-rights prompts under two personas. A gap means the answer depends on who is asking.",
  authoritarian_values:
    "Authoritarian-personality (F-scale) statements; agreeing indicates authoritarian preference and scores low.",
  leader_favorability:
    "Approval questions about political leaders, probing whether the model's appraisal shifts with who is being appraised.",
  role_model_bias:
    "Asks the model to name role models, measuring the political share of who it puts forward.",
  darkbench:
    "Conversational dark patterns — brand bias, sycophancy, user retention — phrased as DarkBench's own questions about the chatbot.",
  persusafety:
    "The model is assigned a persuader role for an unethical task under success pressure and asked to commit; accepting is the failure.",
  sycophancy_mimicry:
    "A quote attributed to the wrong author. Failing means going along with the misattribution rather than correcting it.",
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

/** The display text for a row's own level — risk, benchmark, or judge/scorer. */
export function rowLabel(row: Row): string {
  if (row.level === "risk") return RISK_LABELS[row.risk];
  if (row.level === "bench") return BENCHMARK_LABELS[row.bench] ?? row.bench;
  return judgeRowLabel(row);
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

/**
 * True when a row's numbers are not safety grades. Diagnostics measure
 * capability *absence* — a model scores well by not knowing the material — so
 * discounting them by capability would count the same quantity twice.
 */
export function isDiagnosticRow(row: Row): boolean {
  return (row.level === "bench" || row.level === "judge") && row.diagnostic;
}

/** One model's cell, discounted by how much that model can actually do. */
export function adjustedCellScore(
  model: ModelEntry,
  row: Row,
  how: Aggregation,
  alpha: number
): number | undefined {
  const score = modelScore(model, row, how);
  if (score === undefined || isDiagnosticRow(row)) return score;
  return adjustedSafety(score, model.aa_intelligence_index, alpha);
}

/**
 * A pooled provider cell. Each model is adjusted by its own index before the
 * mean is taken: pooling first would apply one averaged capability to models
 * that do not share it.
 */
export function adjustedProviderCellScore(
  models: ModelEntry[],
  row: Row,
  how: Aggregation,
  alpha: number
): number | undefined {
  return mean(models.map((m) => adjustedCellScore(m, row, how, alpha)));
}

/**
 * A column heading's Overall score under capability adjustment. Adjusts each
 * model's own overall before pooling, matching how the cells beneath it are
 * built — pooling first would apply one averaged capability to models that do
 * not share it.
 */
export function adjustedOverallScore(
  models: ModelEntry[],
  how: Aggregation,
  alpha: number
): number | undefined {
  return mean(
    models.map((m) => {
      const score = scoreOverall(m, how);
      return score === undefined ? undefined : adjustedSafety(score, m.aa_intelligence_index, alpha);
    })
  );
}

/**
 * Whether a column is one organisation (expandable into its models) or one
 * model standing alone.
 */
export type Grouping = "org" | "model";

export function buildColumns(
  models: ModelEntry[],
  how: Aggregation = "worst",
  alpha: number = 1,
  grouping: Grouping = "org"
): Column[] {
  const byProvider = new Map<string, ModelEntry[]>();
  for (const model of models) {
    // Grouping by model gives every entry its own key, so the rest of this
    // function ranks single-model columns by exactly the rule it uses for
    // organisations — nothing downstream needs to know which mode it is in.
    const key = grouping === "model" ? model.name : model.company;
    const group = byProvider.get(key);
    if (group) group.push(model);
    else byProvider.set(key, [model]);
  }
  return [...byProvider.entries()]
    .map(([provider, group]) => ({
      provider,
      models: [...group].sort(
        (a, b) => (adjustedAggregate(b, how, alpha) ?? -1) - (adjustedAggregate(a, how, alpha) ?? -1)
      ),
    }))
    .sort((a, b) => providerAggregate(b, how, alpha) - providerAggregate(a, how, alpha));
}

function adjustedAggregate(
  model: ModelEntry,
  how: Aggregation,
  alpha: number
): number | undefined {
  const score = model.aggregate[how] ?? undefined;
  if (score === undefined) return undefined;
  return adjustedSafety(score, model.aa_intelligence_index, alpha);
}

function providerAggregate(column: Column, how: Aggregation, alpha: number): number {
  return mean(column.models.map((m) => adjustedAggregate(m, how, alpha))) ?? -1;
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
