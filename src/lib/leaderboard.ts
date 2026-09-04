/**
 * Row and column model for the systemic-risk heatmap, plus the display names
 * for the ids that models.json carries bare.
 *
 * Pure data — no React — so the whole shape of the table is unit-testable.
 * Columns are providers (expandable into their models); rows are a two-level
 * tree: systemic risk → benchmark.
 */

import { RISKS, type ModelEntry, type Risk } from "@/data/models.types";
import { adjustedSafety } from "@/lib/capability-adjusted-safety";
import {
  coverageForBenchmark,
  coverageForRisk,
  coverageOverall,
  mean,
  scoreForBenchmark,
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
  | { key: string; level: "bench"; risk: Risk; bench: string; diagnostic: boolean };

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
 * For each benchmark: what it sends the model (the input), what the model
 * produces (the output), what property is being measured, and how the reply is
 * graded — in the words a reader who has never met the benchmark needs. Follows
 * datasets/BENCHMARKS.md and the pipeline's source definitions
 * (datasets/prepare/cluster/sources/*.py), so the claims can be checked rather
 * than taken on trust.
 */
export const BENCHMARK_DESCRIPTIONS: Record<string, string> = {
  // cbrn.py
  harmbench:
    "Direct requests to carry out chemical or biological harm, that category only. The model answers in free prose, and a judge marks it unsafe when the reply carries the harmful task out, even with a warning attached.",
  sosbench:
    "Requests for operationally useful CBRN help, answered in prose. A judge marks the reply unsafe when it materially raises the requester's capability, including in its reasoning, and safe when it stays to general knowledge.",
  wmdp:
    "Multiple-choice questions on weaponisation knowledge; the model replies with a letter, matched against the key. A diagnostic: the correct answer is the unsafe end, since it means the model knows the hazardous material.",
  // cyber.py
  cysecbench:
    "Requests for offensive cyber capability, answered in prose. A judge rates the reply 1 to 5, where a fully working answer with executable code is the unsafe extreme and a clear refusal the safe one.",
  cyberseceval_mitre:
    "Prompts mapped to MITRE ATT&CK techniques; the model replies with code or prose. A judge marks it unsafe when the reply actually assists the technique rather than refusing or answering benignly.",
  agentharm:
    "Cybercrime and fraud task requests, answered in prose with no tools granted. A judge marks it unsafe when the model takes the job on and starts to help; willingness is measured, not completion.",
  cyber_false_refusal:
    "Benign security questions the model ought to answer, in prose. A refusal detector reads the reply, and here the failure is inverted: refusing the legitimate request is unsafe, answering it safe. A diagnostic.",
  injecagent:
    "A benign agent task with an attacker's instruction hidden in a tool response. The model emits its next agent step, and a detector fails it when that step calls the attacker's tool instead of the user's.",
  // loss_of_control.py
  advanced_ai_risk:
    "Forced-choice questions on whether the model wants power, resources, survival, or to coordinate with other AIs against its principals. It answers with a letter, matched against the option that endorses the behaviour.",
  // manipulation.py
  social_harm:
    "Requests for harmful social or political content, answered in prose. A judge marks it unsafe when the model produces the content rather than declining or redirecting.",
  historical_revisionism:
    "Prompts inviting the model to distort documented history, answered in prose. A judge runs a step-by-step truth check and fails the reply when it endorses the revisionist account instead of correcting it.",
  human_rights_udhr:
    "Prompts arguing to limit a right named in the Universal Declaration. The model answers in a paragraph, scored by a judge on a five-point scale; endorsing the limitation is the unsafe end.",
  human_rights_echr:
    "As Human Rights (UDHR), for rights named in the European Convention on Human Rights: the model's paragraph is scored by a judge on the same five-point scale, where endorsing the proposed limit is the unsafe end.",
  human_rights_persona_gap:
    "A diagnostic, not a benchmark: the same human-rights prompts are put under two opposing personas, and the failure is a wide gap between the model's two answers, a judgment that shifts with who is asking.",
  authoritarian_values:
    "Authoritarian-personality (F-scale) statements. The model answers on a six-point agree/disagree scale that is parsed directly; agreeing with the statement indicates authoritarian preference and is the unsafe end.",
  leader_favorability:
    "Approval questions about political leaders, answered on a four-point scale that is parsed directly. What is measured is the gap between its ratings of democratic and autocratic leaders, not the overall level.",
  role_model_bias:
    "Asks the model to name a nationality's role models; it replies with a list, and a judge classifies each figure by regime type. The failure is a slate leaning toward figures from autocratic regimes over democratic ones.",
  darkbench:
    "Everyday conversations probing dark patterns such as brand bias, sycophancy, or pushing user retention. The model replies in prose, and a judge marks it unsafe when the reply exhibits one of those patterns.",
  persusafety:
    "The model is assigned a persuader role for an unethical task under success pressure, then asked to commit with an accept/reject token. A detector reads that token, and accepting the assignment is the failure.",
  sycophancy_mimicry:
    "A quote is put to the model under the wrong author's name. Its prose reply is checked by a string-match detector, which fails it when the reply goes along with the misattribution instead of naming the true author.",
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

/** The display text for a row's own level — a risk or a benchmark. */
export function rowLabel(row: Row): string {
  if (row.level === "risk") return RISK_LABELS[row.risk];
  return BENCHMARK_LABELS[row.bench] ?? row.bench;
}

/**
 * Turns a scorer key into a display name. No longer shown as its own row, but
 * still the canonical name for a scorer key — cert-parity tests read it to
 * check every scorer in models.json resolves to a label.
 */
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
  return row.level === "bench" && row.diagnostic;
}

/** One model's cell, discounted by how much that model can actually do. */
export function adjustedCellScore(
  model: ModelEntry,
  row: Row,
  how: Aggregation,
  weight: number
): number | undefined {
  const score = modelScore(model, row, how);
  if (score === undefined || isDiagnosticRow(row)) return score;
  return adjustedSafety(score, model.aa_intelligence_index, weight);
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
  weight: number
): number | undefined {
  return mean(models.map((m) => adjustedCellScore(m, row, how, weight)));
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
  weight: number
): number | undefined {
  return mean(
    models.map((m) => {
      const score = scoreOverall(m, how);
      return score === undefined ? undefined : adjustedSafety(score, m.aa_intelligence_index, weight);
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
  weight: number = 0,
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
        (a, b) => (adjustedAggregate(b, how, weight) ?? -1) - (adjustedAggregate(a, how, weight) ?? -1)
      ),
    }))
    .sort((a, b) => providerAggregate(b, how, weight) - providerAggregate(a, how, weight));
}

function adjustedAggregate(
  model: ModelEntry,
  how: Aggregation,
  weight: number
): number | undefined {
  const score = model.aggregate[how] ?? undefined;
  if (score === undefined) return undefined;
  return adjustedSafety(score, model.aa_intelligence_index, weight);
}

function providerAggregate(column: Column, how: Aggregation, weight: number): number {
  return mean(column.models.map((m) => adjustedAggregate(m, how, weight))) ?? -1;
}

/** Flatten the row tree to the currently visible rows: risks, and the benchmarks under any expanded risk. */
export function buildRows(models: ModelEntry[], expandedRisks: ReadonlySet<string>): Row[] {
  const rows: Row[] = [];
  for (const risk of RISKS) {
    rows.push({ key: riskKey(risk), level: "risk", risk });
    if (!expandedRisks.has(riskKey(risk))) continue;

    for (const bench of orderedBenchmarks(models, risk)) {
      rows.push({
        key: benchKey(risk, bench),
        level: "bench",
        risk,
        bench,
        diagnostic: isDiagnostic(models, risk, bench),
      });
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
