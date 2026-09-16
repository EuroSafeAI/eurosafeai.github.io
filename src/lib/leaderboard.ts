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

/**
 * The four specified systemic risks, named as the GPAI Code of Practice names
 * them (Appendix 1, Measure 2.1). The pipeline's evals/clusters.py keys are
 * unchanged; only the public-facing wording follows the Code.
 */
export const RISK_LABELS: Record<Risk, string> = {
  cbrn: "Chemical, biological, radiological and nuclear",
  cyber: "Cyber offence",
  loss_of_control: "Loss of control",
  manipulation: "Harmful manipulation",
};

/** The risks named short enough for a headline or a sentence. */
export const RISK_SHORT_LABELS: Record<Risk, string> = {
  cbrn: "CBRN",
  cyber: "Cyber",
  loss_of_control: "Control",
  manipulation: "Manipulation",
};

/**
 * What each systemic risk *is*, compressed from the Code of Practice's own
 * definitions. These describe the risk, not the benchmarks: the benchmark
 * glosses one level down say what is actually measured.
 */
export const RISK_DESCRIPTIONS: Record<Risk, string> = {
  cbrn: "Lowering the barrier to building or obtaining these weapons, or increasing the damage an attack does.",
  cyber:
    "Putting cyber-attacks within reach that were previously too sophisticated or too large to mount, including against critical infrastructure.",
  loss_of_control:
    "Humans losing the ability to reliably direct, correct or shut a model down, whether through deception, power-seeking or plain misalignment.",
  manipulation:
    "Shifting the behaviour or beliefs of whole populations, or of the people making high-stakes decisions, without their noticing it happen.",
};

/**
 * The same four risks at a length the phone layout has room for, shown under
 * the hero where a reader first meets "CBRN". The row glosses above are
 * hidden at phone widths, so this is the only place the terms get defined
 * there.
 */
export const RISK_DESCRIPTIONS_PLAIN: Record<Risk, string> = {
  cbrn: "Whether a model helps someone design, obtain or use a chemical, biological, radiological or nuclear weapon, or makes doing so meaningfully easier.",
  cyber:
    "Whether a model can find vulnerabilities, write working exploits and scale an attack up, and whether it refuses legitimate security work in the process.",
  loss_of_control:
    "Whether a model stays supervisable: that it can be corrected and shut down, and does not deceive its operators, seek power, or work around the oversight placed on it.",
  manipulation:
    "Whether a model can shift behaviour or beliefs at scale, through persuasion, deception, or targeting so personalised the subject cannot reasonably detect it.",
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
  human_rights: "Human Rights",
  human_rights_echr: "Human Rights (ECHR)",
  human_rights_persona_gap: "Human Rights Persona Gap",
  human_rights_udhr: "Human Rights (UDHR)",
  leader_favorability: "Leader Favorability",
  persusafety: "PersuSafety",
  role_model_bias: "Role Model Bias",
  social_harm: "SocialHarmBench",
  sycophancy_mimicry: "Mimicry",
};

/**
 * For each benchmark: what it sends the model (the input), what the model
 * produces (the output), what property is being measured, and how the reply is
 * graded — in the words a reader who has never met the benchmark needs. Follows
 * datasets/BENCHMARKS.md and the pipeline's source definitions
 * (datasets/prepare/cluster/sources/*.py), so the claims can be checked rather
 * than taken on trust.
 */
/**
 * Where each benchmark comes from: the paper that defines it, or the
 * repository that publishes it. Partial on purpose — a benchmark with no
 * entry here renders as plain text rather than a guessed link, because a
 * wrong citation is worse than none.
 */
export const BENCHMARK_SOURCES: Record<string, string> = {
  harmbench: "https://arxiv.org/abs/2402.04249",
  sosbench: "https://arxiv.org/abs/2505.21605",
  wmdp: "https://arxiv.org/abs/2403.03218",
  agentharm: "https://arxiv.org/abs/2410.09024",
  cysecbench: "https://arxiv.org/abs/2501.01335",
  // Both the MITRE ATT&CK helpfulness tests and the false-refusal tests built
  // on top of them are defined in CyberSecEval 2.
  cyberseceval_mitre: "https://arxiv.org/abs/2404.13161",
  cyber_false_refusal: "https://arxiv.org/abs/2404.13161",
  injecagent: "https://arxiv.org/abs/2403.02691",
  advanced_ai_risk: "https://arxiv.org/abs/2212.09251",
  social_harm: "https://arxiv.org/abs/2510.04891",
  darkbench: "https://arxiv.org/abs/2503.10728",
  persusafety: "https://arxiv.org/abs/2504.10430",
  // "Towards Understanding Sycophancy in Language Models": the mimicry eval,
  // where a poem is put to the model under the wrong poet's name.
  sycophancy_mimicry: "https://arxiv.org/abs/2310.13548",
  // "Democratic or Authoritarian?" contributes three of the four political
  // evals: the F-scale, FavScore, and role-model probing.
  authoritarian_values: "https://arxiv.org/abs/2506.12758",
  leader_favorability: "https://arxiv.org/abs/2506.12758",
  role_model_bias: "https://arxiv.org/abs/2506.12758",
  // "When Do Language Models Endorse Limitations on Human Rights Principles?"
  // The ECHR scenarios are its Appendix D.1; the persona gap is its
  // steerability score between the two opposing persona framings.
  human_rights: "https://arxiv.org/abs/2603.04217",
  human_rights_udhr: "https://arxiv.org/abs/2603.04217",
  human_rights_echr: "https://arxiv.org/abs/2603.04217",
  human_rights_persona_gap: "https://arxiv.org/abs/2603.04217",
  historical_revisionism: "https://arxiv.org/abs/2602.17433",
};

export const BENCHMARK_DESCRIPTIONS: Record<string, string> = {
  // cbrn.py
  harmbench:
    "Direct requests to carry out chemical or biological harm. The model fails if it walks the requester through the task, even with a warning attached.",
  sosbench:
    "Requests for CBRN help specific enough to be operationally useful. What counts against the model is whether its answer leaves the requester more capable than general knowledge would.",
  wmdp:
    "Multiple-choice questions about weaponisation. Scored in reverse: a correct answer means the model holds the hazardous knowledge, so a high score is the worrying one.",
  // cyber.py
  cysecbench:
    "Requests for offensive cyber capability, rated from a flat refusal up to a complete answer with working code. The complete answer is the worst case.",
  cyberseceval_mitre:
    "Prompts drawn from the MITRE ATT&CK catalogue of real attacker techniques. The model fails when its reply genuinely helps carry the technique out.",
  agentharm:
    "Cybercrime and fraud jobs put to the model with no tools to do them with. What is measured is whether it agrees to help, not whether it could finish.",
  cyber_false_refusal:
    "Legitimate security questions a model ought to answer. The failure runs the other way here: refusing the honest request counts against it, answering does not.",
  injecagent:
    "A routine agent task with an attacker's instruction buried in a tool response. The model fails if its next step obeys the attacker rather than the user.",
  // loss_of_control.py
  advanced_ai_risk:
    "Forced-choice questions about whether the model wants power, resources or survival, and whether it would side with other AI systems over the people running it.",
  // manipulation.py
  social_harm:
    "Requests for harmful social and political content, drawn from 34 countries and two centuries. Producing the content is the failure; declining or redirecting is not.",
  historical_revisionism:
    "Prompts that invite the model to retell a documented historical event the way a revisionist would. Going along with the revision instead of correcting it is the failure.",
  human_rights:
    "Scenarios arguing for limits on a named right, rated one to five; endorsing the limit scores badly. Pools the two charter sets below, which ask one question twice.",
  human_rights_udhr:
    "Scenarios arguing for limits on a right from the Universal Declaration, with the model's answer rated one to five. Endorsing the limit scores badly.",
  human_rights_echr:
    "The same scenarios, built instead from rights named in the European Convention on Human Rights.",
  human_rights_persona_gap:
    "The human-rights scenarios put twice: once to a model told to defend individual liberty, once told to defend state authority. A wide gap between the two answers is the failure.",
  authoritarian_values:
    "Statements from the F-scale, a mid-century measure of authoritarian personality, answered on a six-point agree/disagree scale. Agreement points toward authoritarian preference.",
  leader_favorability:
    "Approval ratings for real political leaders. What matters is the distance between how the model rates democratic leaders and autocratic ones, not how warm it is overall.",
  role_model_bias:
    "Asks the model who a given nationality's role models are. A list leaning toward figures from autocratic regimes counts against it.",
  darkbench:
    "Ordinary conversations designed to draw out dark patterns: pushing the developer's own products, flattering the user, or steering them into staying longer.",
  persusafety:
    "The model is cast as a persuader for an unethical goal and pressed to succeed, then asked to accept or decline the job. Accepting it is the failure.",
  sycophancy_mimicry:
    "A well-known quote put to the model under the wrong author's name. It fails if it plays along instead of naming the real one.",
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
