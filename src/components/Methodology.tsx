import type { ModelEntry } from "@/data/models.types";
import { safetyCapabilityCorrelation } from "@/lib/capability-adjusted-safety";
import { GRADES, GRADE_BAND } from "@/lib/scoring";
import { ACCENT } from "@/components/leaderboard/constants";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { COVERAGE_FLAG, INK } from "@/components/leaderboard/constants";
import { PUBLISHED_CAPABILITY_WEIGHT } from "@/lib/capability-adjusted-safety";

const bodyStyle: React.CSSProperties = {
  color: "#6b7280",
  fontSize: 13,
  lineHeight: 1.65,
};

const titleStyle: React.CSSProperties = {
  color: INK,
};

export const Methodology: React.FC<{ models: ModelEntry[] }> = ({ models }) => {
  const correlation = safetyCapabilityCorrelation(models);
  return (
  <div style={{ maxWidth: 760 }}>
    <Accordion type="multiple">
      <AccordionItem value="how-these-scores-are-made">
        <AccordionTrigger style={titleStyle}>How these scores are made</AccordionTrigger>
        <AccordionContent style={bodyStyle}>
          <p>
            The four rows are the systemic risks the EU AI Act's Code of Practice requires
            providers of general-purpose AI to assess: CBRN misuse, offensive cyber capability,
            loss of control, and manipulation.
          </p>
          <p>
            Each is evaluated by a merged suite of public benchmarks, re-scored under one common
            polarity so every number means "how safe", then re-run under six families of
            adversarial perturbation: paraphrase, register shift, identity stripping, framing,
            reconsideration pressure, and agentic scenarios.
          </p>
          <p>
            A model's score for a risk is its worst case, pooled per sample across those
            perturbations. A safeguard that only holds when it is unprovoked is not a safeguard.
            The unperturbed control run is reported as a baseline and never enters an aggregate.
          </p>
          <p>
            Free-text responses are graded by an ensemble of LLM judges. Expanding a benchmark row
            shows what each judge concluded on its own, so a grade traces back to the judgements
            that produced it.
          </p>
          <p>
            <strong>How a number becomes a grade.</strong> Every scorer emits a value on 0 to 100
            under one common polarity, where 100 means fully safe. A benchmark's score is the mean
            across its scorers; a risk's score is the mean across its benchmarks; and a model's
            headline is the mean of its four risk scores. Nothing is weighted: a benchmark with
            twenty samples counts the same as one with two hundred, because the suite is built to
            give each source a comparable quota rather than to pool raw samples.
          </p>
          <p>
            <strong>Worst case, precisely.</strong> Each sample is run under six adversarial
            families and the control. The worst case takes the minimum across those runs
            <em> per sample</em>, then averages those minima. That is stricter than taking the
            worst family average, which is why a model's plotted score sits below the range its
            individual families produce.
          </p>
          <p>
            <strong>Grades.</strong> The 0 to 100 scale is cut into {GRADES.length} equal bands of{" "}
            {GRADE_BAND.toFixed(1)} points, from F− at the bottom to A+ at the top. The bands are
            absolute, not a curve: a grade means the same thing in every cell of the table and does
            not move when the roster changes. The colour of a cell is a continuous interpolation of
            the same scale rather than one colour per band, so neighbouring scores never look
            identical because they happen to share a letter.
          </p>
          <p>
            Full methodology, dataset descriptions, and reproducibility information are published
            alongside the evaluation pipeline.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="reading-the-grid">
        <AccordionTrigger style={titleStyle}>Reading the grid</AccordionTrigger>
        <AccordionContent style={bodyStyle}>
          <p>
            <strong>Score shown</strong> picks the metric. Worst case gives every sample its
            lowest score across the six perturbations and averages those; average pools the same
            samples without that per-sample minimum. Switching changes the grade, the colour and
            the column order together, and the unselected metric stays in each cell's tooltip and
            accessible label. When the two metrics order providers very differently, that
            provider's failures are concentrated in particular perturbations rather than spread
            across them.
          </p>
          <p>
            <strong>Group by</strong> switches between one column per organisation and one
            column per model. An organisation column expands into its models and shows the mean
            across them; a model column stands alone. The model view is wider than the page
            and scrolls sideways; the row labels stay pinned to the left edge.
          </p>
          <p>
            Rows marked <strong>diagnostic</strong> are greyed and excluded from the aggregates
            above them. The <strong>refusal floor</strong> row is not a scorer: it restates its
            benchmark's score with every unscored sample counted as safe, an optimistic bound
            against the headline's pessimistic one. Read the pair as brackets on the truth.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="coverage-and-whats-missing">
        <AccordionTrigger style={titleStyle}>Coverage and what's missing</AccordionTrigger>
        <AccordionContent style={bodyStyle}>
          <p>
            A bar along the bottom of a cell marks coverage below {Math.round(COVERAGE_FLAG * 100)}
            %, the share of samples that yielded a gradeable result. Hover for the exact count.
          </p>
          <p>
            A sample drops out when no verdict could be formed, most often because the evaluated
            model's own provider blocked the response before it was generated, leaving nothing to
            grade. Dropped samples are excluded rather than counted as safe, so a flagged grade
            rests on fewer, and typically easier, prompts than an unflagged one.
          </p>
          <p>
            Coverage is recorded per perturbation condition rather than per scorer, so every judge
            within a benchmark shares one figure.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="capability-adjustment">
        <AccordionTrigger style={titleStyle}>Capability adjustment</AccordionTrigger>
        <AccordionContent style={bodyStyle}>
          <p>
            Risk is how likely something is to go wrong multiplied by how bad it is when it
            does. A safety evaluation estimates the first part only: how often a model complies
            with a request it should refuse. Capability bounds the second. Leaving it out does
            not approximate the severity of a failure, it drops that side of the estimate.
          </p>
          <p>
            Nor can safety stand in for capability. Across the models on this page the two
            correlate at {correlation?.toFixed(2) ?? "no measurable degree"}, on a scale where
            1.00 would mean they rise and fall together. Knowing how safely a model behaves says
            little about how far its failures reach. The slider above the table weighs the two together,
            using the{" "}
            <a href="https://artificialanalysis.ai" target="_blank" rel="noopener noreferrer" style={{ color: ACCENT, textDecoration: "underline", textUnderlineOffset: 2 }}>Artificial Analysis</a> intelligence index.
          </p>
          <p>
            At 0.00, where the table loads, capability carries no weight and the grid shows the
            measured evaluation results. Raising it gives capability more of the say, so a weak
            unsafe model rises above a capable one with the same measured score, and the columns
            re-rank. At 1.00 the measured score drops out entirely and only reach remains.
          </p>
          <p>
            Within a column the four risks keep their order: the same adjustment applies to every
            cell in that column. Diagnostic rows are never adjusted. They measure whether a model
            knows hazardous material rather than whether it declines to act on it, so discounting
            them by capability would count the same thing twice.
          </p>
          <p>
            Two consequences are deliberate. A more capable model can rank below a weaker one at
            equal safety, because the same failure reaches further. And a low-capability model's
            high score is a statement about reach, not about conduct: how much harm it could do,
            not how well it behaved. Every score appears beside the raw safety and index figures
            behind it.
          </p>
          <p>The scatter above uses the published weight of {PUBLISHED_CAPABILITY_WEIGHT.toFixed(2)}.</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
);
};
