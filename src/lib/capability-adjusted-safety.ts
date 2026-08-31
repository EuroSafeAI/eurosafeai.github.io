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
import { RISKS, type ModelEntry } from "@/data/models.types";
import { median, scoreOverall } from "@/lib/scoring";

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

export interface IndexDomain {
  min: number;
  max: number;
}

/** Padding either side of the roster, as a share of its spread. */
const DOMAIN_MARGIN = 0.08;

/**
 * The x-axis range for the scatter, fitted to the roster so the models fill
 * the plot instead of huddling in one corner.
 *
 * Deliberately NOT capabilityScore's 0-100 scale: that rescaling is
 * asymptotic because the formula needs a ceiling it can never reach, which
 * would leave the right of the plot permanently empty. An axis should show
 * the data. The trade is that the domain moves when the roster changes, so
 * the axis label states its range.
 */
export function indexDomain(models: readonly ModelEntry[]): IndexDomain {
  const indices = models.map((m) => m.aa_intelligence_index);
  const low = Math.min(...indices);
  const high = Math.max(...indices);
  // A single model would give a zero spread and divide by zero downstream.
  const margin = Math.max((high - low) * DOMAIN_MARGIN, 1);
  return { min: low - margin, max: high + margin };
}

/** Intelligence index on x, raw safety on y, y inverted for SVG's downward axis. */
export function scatterPoint(
  index: number,
  safety: number,
  box: ScatterBox,
  domain: IndexDomain
): { x: number; y: number } {
  const span = box.width - 2 * box.pad;
  const rise = box.height - 2 * box.pad;
  const across = (index - domain.min) / (domain.max - domain.min);
  return {
    x: box.pad + span * across,
    y: box.pad + rise * (1 - safety / 100),
  };
}

/**
 * Pearson correlation between the intelligence index and worst-case safety
 * across a roster.
 *
 * Published on the page rather than asserted: the claim that a safety score
 * is a poor stand-in for capability is empirical, and it should be recomputed
 * from whatever roster is on screen instead of quoted from a run that has
 * since been replaced.
 */
export function safetyCapabilityCorrelation(models: readonly ModelEntry[]): number | undefined {
  const pairs = models
    .map((m) => [m.aa_intelligence_index, scoreOverall(m)] as const)
    .filter((p): p is readonly [number, number] => p[1] !== undefined);
  if (pairs.length < 2) return undefined;

  const mean = (values: number[]) => values.reduce((a, b) => a + b, 0) / values.length;
  const xs = pairs.map((p) => p[0]);
  const ys = pairs.map((p) => p[1]);
  const mx = mean(xs);
  const my = mean(ys);
  const covariance = pairs.reduce((sum, [x, y]) => sum + (x - mx) * (y - my), 0);
  const spread = Math.sqrt(
    xs.reduce((s, x) => s + (x - mx) ** 2, 0) * ys.reduce((s, y) => s + (y - my) ** 2, 0)
  );
  return spread === 0 ? undefined : covariance / spread;
}

export interface PlaneMedians {
  index: number;
  safety: number;
}

/**
 * Where to split the plot into quadrants.
 *
 * Medians rather than fixed cut-offs: no defensible absolute threshold exists
 * yet, and a median at least states plainly what it is, which half of this
 * roster a model falls in. It moves when the roster does, so anything drawn
 * from it must be labelled as relative to the field.
 */
export function planeMedians(models: readonly ModelEntry[]): PlaneMedians | undefined {
  const index = median(models.map((m) => m.aa_intelligence_index));
  const safety = median(models.map((m) => scoreOverall(m)));
  return index === undefined || safety === undefined ? undefined : { index, safety };
}

/**
 * Models that nothing else beats on both capability and safety at once,
 * ordered by capability so they can be drawn as a line.
 *
 * The shape of this frontier answers whether safety costs capability. On the
 * current roster it does not: the second and third entries carry nearly the
 * same safety at almost double the capability of the first, so a capable and
 * unsafe model is a choice rather than a necessity.
 */
export function attainableFrontier(models: readonly ModelEntry[]): ModelEntry[] {
  const scored = models
    .map((model) => ({ model, safety: scoreOverall(model) }))
    .filter((entry): entry is { model: ModelEntry; safety: number } => entry.safety !== undefined);

  return scored
    .filter(
      (entry) =>
        !scored.some(
          (other) =>
            other.model.id !== entry.model.id &&
            other.model.aa_intelligence_index >= entry.model.aa_intelligence_index &&
            other.safety >= entry.safety &&
            (other.model.aa_intelligence_index > entry.model.aa_intelligence_index ||
              other.safety > entry.safety)
        )
    )
    .map((entry) => entry.model)
    .sort((a, b) => a.aa_intelligence_index - b.aa_intelligence_index);
}

export interface LabelBox {
  x: number;
  y: number;
  width: number;
}

/**
 * Vertical positions for point labels, stepped apart where they would collide.
 *
 * Only labels whose horizontal spans actually overlap can collide, so labels
 * at opposite ends of the plot keep their exact position however close their
 * heights. Placement runs top down and pushes a colliding label below the one
 * already placed, which keeps the result deterministic: the same roster always
 * produces the same plot.
 */
export function spreadLabels(boxes: readonly LabelBox[], lineHeight: number): number[] {
  const order = boxes.map((_, index) => index).sort((a, b) => boxes[a].y - boxes[b].y);
  const placed: number[] = new Array(boxes.length);

  for (const index of order) {
    const box = boxes[index];
    let y = box.y;
    let moved = true;
    while (moved) {
      moved = false;
      for (const other of order) {
        if (other === index || placed[other] === undefined) continue;
        const overlapsHorizontally =
          box.x < boxes[other].x + boxes[other].width && box.x + box.width > boxes[other].x;
        if (overlapsHorizontally && Math.abs(y - placed[other]) < lineHeight) {
          y = placed[other] + lineHeight;
          moved = true;
        }
      }
    }
    placed[index] = y;
  }
  return placed;
}

/** Beyond this many points, the field is treated as forcing a real tradeoff. */
const TRADEOFF_POINTS = 5;

export interface CapabilityCost {
  bestOverall: number;
  bestAtHighCapability: number;
  gap: number;
  forcesATradeoff: boolean;
}

/**
 * What safety costs at the capable end of the field.
 *
 * Compares the best safety score achieved above the median capability against
 * the best achieved anywhere. A small gap means capable models can be as safe
 * as any other, so a capable model scoring badly is a choice. The page states
 * that, and the flag exists so the claim is checked against the roster rather
 * than asserted: a future field really could force the tradeoff.
 */
export function capabilityCost(models: readonly ModelEntry[]): CapabilityCost | undefined {
  const medians = planeMedians(models);
  if (!medians) return undefined;

  const safety = (model: ModelEntry) => scoreOverall(model);
  const all = models.map(safety).filter((s): s is number => s !== undefined);
  const capable = models
    .filter((m) => m.aa_intelligence_index >= medians.index)
    .map(safety)
    .filter((s): s is number => s !== undefined);
  if (all.length === 0 || capable.length === 0) return undefined;

  const bestOverall = Math.max(...all);
  const bestAtHighCapability = Math.max(...capable);
  const gap = bestOverall - bestAtHighCapability;
  return { bestOverall, bestAtHighCapability, gap, forcesATradeoff: gap > TRADEOFF_POINTS };
}

/**
 * Round tick values spanning a domain.
 *
 * Steps come from the 1, 2, 5, 10 family, so a reader gets numbers they can
 * hold in their head rather than whatever the data's range happened to divide
 * into. Ticks stay inside the domain: one drawn beyond the axis has nowhere
 * to sit.
 */
export function axisTicks(min: number, max: number, target: number): number[] {
  if (!(max > min)) return [min];

  const build = (step: number) => {
    const ticks: number[] = [];
    for (let value = Math.ceil(min / step) * step; value <= max + 1e-9; value += step) {
      ticks.push(Number(value.toFixed(6)));
    }
    return ticks;
  };

  // 2.5 belongs in the family: without it a 0-100 axis steps by 50, which is
  // too coarse to read a position from.
  const rough = (max - min) / Math.max(1, target - 1);
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const candidates = [0.5, 1, 2, 2.5, 5, 10].map((m) => m * magnitude);

  // Closest tick count to the target, rather than the first step wide enough:
  // that rounded up every time and left axes with two labels on them.
  let best = build(candidates[0]);
  for (const step of candidates.slice(1)) {
    const ticks = build(step);
    if (ticks.length >= 2 && Math.abs(ticks.length - target) < Math.abs(best.length - target)) {
      best = ticks;
    }
  }
  return best;
}

export interface SafetyBand {
  low: number;
  high: number;
  families: number;
}

/**
 * How much a model's safety depends on which attack it faces.
 *
 * Each of the six adversarial families is averaged across the four risks, and
 * the band spans the weakest and strongest of those. It is the closest thing
 * to an uncertainty interval the evaluation produces: not sampling error, but
 * the spread of outcomes across the kinds of pressure applied.
 *
 * The band sits at or above the plotted worst-case score, because that score
 * takes each sample's minimum across families and is therefore more
 * pessimistic than any single family's average.
 */
export function safetyBand(model: ModelEntry): SafetyBand | undefined {
  const risks = RISKS.map((risk) => model.results[risk]?.by_family).filter(Boolean);
  if (risks.length === 0) return undefined;

  const families = [...new Set(risks.flatMap((byFamily) => Object.keys(byFamily!)))];
  const perFamily = families
    .map((family) => {
      const scores = risks
        .map((byFamily) => byFamily![family])
        .filter((value): value is number => typeof value === "number");
      return scores.length === 0 ? undefined : scores.reduce((a, b) => a + b, 0) / scores.length;
    })
    .filter((value): value is number => value !== undefined);
  if (perFamily.length === 0) return undefined;

  return { low: Math.min(...perFamily), high: Math.max(...perFamily), families: perFamily.length };
}
