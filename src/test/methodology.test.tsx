import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CertificatePage from "@/pages/CertificatePage";
import { HelmetProvider } from "react-helmet-async";
import { Methodology } from "@/components/Methodology";
import { COVERAGE_FLAG } from "@/components/leaderboard/constants";

/**
 * Claims the page must keep making, whatever else changes about how it reads.
 * A concision pass is exactly where caveats die quietly, and on this page the
 * caveats are the honesty: each of these qualifies a number a policy-maker
 * might otherwise take at face value.
 */
const SUBSTANTIVE_CLAIMS: RegExp[] = [
  /paraphrase/i,
  /register shift/i,
  /identity stripping/i,
  /framing/i,
  /reconsideration pressure/i,
  /agentic scenarios/i,
  /never enters an aggregate/i,
  /ensemble of LLM judges/i,
  /counted as safe/i,
  /excluded from the aggregates/i,
  /excluded rather than counted as safe/i,
  /per perturbation condition rather than per scorer/i,
  /higher is safer/i,
  /peer-reviewed/i,
];

const renderPage = () =>
  render(
    <HelmetProvider>
      <CertificatePage />
    </HelmetProvider>
  );

/** Whitespace-normalised, so a phrase split over source lines still matches. */
const pageText = () => (document.body.textContent ?? "").replace(/\s+/g, " ");

describe("the page's substantive claims", () => {
  it("makes every one of them somewhere", () => {
    renderPage();
    const missing = SUBSTANTIVE_CLAIMS.filter((claim) => !claim.test(pageText()));
    expect(missing.map(String)).toEqual([]);
  });
});

const TOPICS = [
  /how these scores are made/i,
  /reading the grid/i,
  /coverage and what's missing/i,
  /capability adjustment/i,
];

describe("Methodology", () => {
  it("offers every topic", () => {
    render(<Methodology />);
    for (const topic of TOPICS) {
      expect(screen.getByRole("button", { name: topic })).toBeInTheDocument();
    }
  });

  it("starts with every topic collapsed", () => {
    render(<Methodology />);
    for (const topic of TOPICS) {
      expect(screen.getByRole("button", { name: topic })).toHaveAttribute(
        "aria-expanded",
        "false"
      );
    }
  });

  it("opens a topic when its trigger is clicked", () => {
    render(<Methodology />);
    const trigger = screen.getByRole("button", { name: TOPICS[0] });

    // "CBRN misuse" appears nowhere else in the component, so its presence
    // is proof the collapsed prose genuinely mounted rather than having
    // been in the document (but visually hidden) all along.
    expect(document.body.textContent).not.toContain("CBRN misuse");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(document.body.textContent).toContain("CBRN misuse");
  });

  it("scales the coverage fraction into a percentage", () => {
    render(<Methodology />);
    fireEvent.click(screen.getByRole("button", { name: /coverage/i }));
    expect(document.body.textContent).toContain(`${Math.round(COVERAGE_FLAG * 100)}%`);
    expect(document.body.textContent).not.toContain("0.95%");
  });
});
