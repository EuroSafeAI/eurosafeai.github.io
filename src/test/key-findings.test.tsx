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
    expect(screen.getByText(/lost to adversarial pressure/i)).toBeInTheDocument();
    expect(screen.getByText(/best score in the field/i)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`${RISK_LABELS[highestRisk(MODELS)!.risk]} is the highest risk`, "i"))).toBeInTheDocument();
  });

  it("shows figures derived from the roster, not typed", () => {
    render(<KeyFindings models={MODELS} />);
    expect(screen.getByText(adversarialCostSummary(MODELS)!.average.toFixed(1))).toBeInTheDocument();
    expect(screen.getByText(ceilingSummary(MODELS, "worst")!.best.score.toFixed(1))).toBeInTheDocument();
  });

  it("qualifies the ceiling claim with its metric IN THAT CARD", () => {
    // Scoped deliberately. A page-wide search for the phrase passes even when
    // this card drops it, because the adversarial card also says it. The
    // ceiling finding inverts under the average metric, so the qualifier has
    // to sit beside the number it qualifies.
    render(<KeyFindings models={MODELS} />);
    expect(cardFor(/best score in the field/i).textContent).toMatch(/worst-case/i);
  });

  it("names the highest risk from the data rather than hardcoding it", () => {
    render(<KeyFindings models={MODELS} />);
    const finding = highestRisk(MODELS)!;
    expect(cardFor(/is the highest risk/i).textContent).toContain(RISK_LABELS[finding.risk]);
  });

  it("only claims cross-metric agreement when the data supports it", () => {
    render(<KeyFindings models={MODELS} />);
    const text = cardFor(/is the highest risk/i).textContent!;
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
