import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { COVERAGE_FLAG, INK } from "@/components/leaderboard/constants";
import { CAPABILITY_EXPONENT } from "@/lib/risk-index";

const bodyStyle: React.CSSProperties = {
  color: "#6b7280",
  fontSize: 13,
  lineHeight: 1.65,
};

const titleStyle: React.CSSProperties = {
  color: INK,
};

export const Methodology: React.FC = () => (
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
            perturbations — a safeguard that only holds when it is unprovoked is not a safeguard.
            The unperturbed control run is reported as a baseline and never enters an aggregate.
          </p>
          <p>
            Free-text responses are graded by an ensemble of LLM judges. Expanding a benchmark row
            shows what each judge concluded on its own, so a grade traces back to the judgements
            that produced it.
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
            <strong>Group by</strong> switches between one column per organisation — expandable
            into its models, with the organisation's own column showing the mean across them —
            and one column per model, ranked individually. The model view is wider than the page
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
            % — the share of samples that yielded a gradeable result. Hover for the exact count.
          </p>
          <p>
            A sample drops out when no verdict could be formed, most often because the evaluated
            model's own provider blocked the response before it was generated, leaving nothing to
            grade. Dropped samples are excluded rather than counted as safe, so a flagged grade
            rests on fewer — and typically less confronting — prompts than an unflagged one.
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
            A model that cannot accomplish much cannot cause much. The slider above the table
            conditions every grade on how much each model can actually do, using its Artificial
            Analysis intelligence index.
          </p>
          <p>
            At 1.00 — where the table loads — no adjustment is applied and the grid shows the
            measured evaluation results. Moving the slider down discounts each model's shortfall
            from perfect safety by its capability, so a weak unsafe model rises above a capable
            one with the same measured score, and the columns re-rank.
          </p>
          <p>
            Within a column the four risks keep their order: the same adjustment applies to every
            cell in that column. Diagnostic rows are never adjusted — they measure whether a model
            knows hazardous material rather than whether it declines to act on it, so discounting
            them by capability would count the same thing twice.
          </p>
          <p>The scatter above uses the published weight of {CAPABILITY_EXPONENT}.</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
);
