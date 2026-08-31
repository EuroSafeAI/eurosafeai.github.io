/**
 * The roster as published, derived from the pipeline export rather than by
 * editing it.
 *
 * One model, gpt-5.6-sol, had its CBRN and cyber runs fail partway. The
 * pipeline kept the numbers it did get in a separate `partial_scores` field
 * rather than in `scores`, left `results` empty for those risks, and marked
 * them failed. Publishing it was a deliberate editorial decision, so the
 * promotion lives here in code where it is visible and tested, and the export
 * on disk stays byte-identical to what the pipeline wrote.
 *
 * What a promotion does NOT do is invent detail. Those runs produced no
 * per-benchmark or per-family results, so the promoted risks stay empty there
 * and the model is flagged as partially evaluated for the page to say so.
 */
import { RISKS, type ModelEntry, type Risk } from "@/data/models.types";

type PartialScores = Partial<Record<Risk, { worst: number | null; mean: number | null }>>;

const partialScoresOf = (model: ModelEntry): PartialScores =>
  (model as unknown as { partial_scores?: PartialScores }).partial_scores ?? {};

/** True when any of a model's four risk runs did not complete. */
export function isPartiallyEvaluated(model: ModelEntry): boolean {
  return Object.values(model.status ?? {}).some((entry) => entry?.status !== "success");
}

const mean = (values: number[]) =>
  values.length === 0 ? null : values.reduce((a, b) => a + b, 0) / values.length;

/**
 * Fills any risk whose run failed with the partial figure the pipeline
 * recorded, and recomputes the headline over all four risks so it is measured
 * on the same basis as every other model's.
 */
export function publishedRoster(models: readonly ModelEntry[]): ModelEntry[] {
  return models.map((model) => {
    const partial = partialScoresOf(model);
    const promoted = RISKS.filter((risk) => partial[risk] && model.results[risk]?.aggregate == null);
    if (promoted.length === 0) return model;

    const results = { ...model.results };
    const scores = { ...model.scores };
    for (const risk of promoted) {
      const figures = partial[risk]!;
      // benchmarks and by_family are absent, not empty, on a failed run, and
      // the grid dereferences both. Normalise them so a promoted risk is a
      // well-formed risk with nothing in it, rather than a hole.
      results[risk] = {
        ...results[risk],
        aggregate: { worst: figures.worst, mean: figures.mean },
        benchmarks: results[risk]?.benchmarks ?? {},
        by_family: results[risk]?.by_family ?? {},
      };
      if (figures.worst !== null) scores[risk] = figures.worst;
    }

    const across = (how: "worst" | "mean") =>
      mean(
        RISKS.map((risk) => results[risk]?.aggregate?.[how]).filter(
          (value): value is number => typeof value === "number"
        )
      );

    return { ...model, results, scores, aggregate: { worst: across("worst"), mean: across("mean") } };
  });
}
