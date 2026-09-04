import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { KeyFindings } from "@/components/KeyFindings";
import { adversarialCostSummary, ceilingSummary, highestRisk } from "@/lib/findings";
import { RISK_LABELS } from "@/lib/leaderboard";
import modelsData from "@/data/models.json";
import type { ModelEntry } from "@/data/models.types";

const MODELS = modelsData as unknown as ModelEntry[];

/** The card whose claim line matches, so assertions are scoped to one finding. */
const cardFor = (pattern: RegExp): HTMLElement => {
  const claim = screen.getAllByText(pattern).find((el) => el.tagName === "P");
  return claim!.parentElement as HTMLElement;
};

describe("KeyFindings", () => {
  it("renders one card per finding", () => {
    const { container } = render(<KeyFindings models={MODELS} />);
    expect(container.querySelectorAll("p").length).toBeGreaterThanOrEqual(6);
    expect(screen.getByText(/pass on paper but fail under pressure/i)).toBeInTheDocument();
    expect(screen.getByText(/models are reliably safe/i)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`fail on ${RISK_LABELS[highestRisk(MODELS)!.risk]}`, "i"))).toBeInTheDocument();
  });

  it("headlines each finding as a share of the field", () => {
    const { container } = render(<KeyFindings models={MODELS} />);
    const ceiling = ceilingSummary(MODELS, "worst")!;
    const highest = highestRisk(MODELS)!;
    // The headline of each card is an "N of total" fraction, derived not typed.
    // Whitespace-stripped, since the value and unit are adjacent spans.
    const packed = (container.textContent ?? "").replace(/\s+/g, "");
    expect(packed).toContain(`${ceiling.clears}of${ceiling.total}`);
    expect(packed).toContain(`${highest.belowHalf}of${highest.total}`);
  });

  it("keeps the raw scores in the supporting line", () => {
    const { container } = render(<KeyFindings models={MODELS} />);
    const text = container.textContent ?? "";
    expect(text).toContain(adversarialCostSummary(MODELS)!.average.toFixed(1));
    expect(text).toContain(ceilingSummary(MODELS, "worst")!.best.score.toFixed(1));
  });

  it("qualifies the ceiling claim with its metric IN THAT CARD", () => {
    // Scoped deliberately. A page-wide search for the phrase passes even when
    // this card drops it, because the adversarial card also says it. The
    // ceiling finding inverts under the average metric, so the qualifier has
    // to sit beside the number it qualifies.
    render(<KeyFindings models={MODELS} />);
    expect(cardFor(/models are reliably safe/i).textContent).toMatch(/worst-case/i);
  });

  it("names the highest risk from the data rather than hardcoding it", () => {
    render(<KeyFindings models={MODELS} />);
    const finding = highestRisk(MODELS)!;
    expect(cardFor(/fail on/i).textContent).toContain(RISK_LABELS[finding.risk]);
  });

  it("only claims cross-metric agreement when the data supports it", () => {
    render(<KeyFindings models={MODELS} />);
    const text = cardFor(/fail on/i).textContent!;
    if (highestRisk(MODELS)!.consistentAcrossMetrics) {
      expect(text).toMatch(/under both/i);
    } else {
      expect(text).toMatch(/depends on which/i);
    }
  });

  it("renders nothing rather than a broken card for an empty roster", () => {
    const { container } = render(<KeyFindings models={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
