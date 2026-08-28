import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import CertificatePage from "@/pages/CertificatePage";
import { HelmetProvider } from "react-helmet-async";

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
