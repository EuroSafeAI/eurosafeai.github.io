import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RowLabel } from "@/components/leaderboard/RowLabel";
import type { Row } from "@/lib/leaderboard";

const riskRow: Row = { key: "cbrn", level: "risk", risk: "cbrn" };
const benchRow: Row = { key: "cbrn/wmdp", level: "bench", risk: "cbrn", bench: "wmdp", diagnostic: true };

describe("RowLabel", () => {
  it("renders a risk row as a toggle carrying its description", () => {
    render(<RowLabel row={riskRow} labelWidth={250} isMobile={false} open={false} onToggle={() => {}} />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button.textContent).toContain("CBRN");
    expect(button.textContent).toContain("Chemical, biological");
  });

  it("hides the risk description on mobile", () => {
    render(<RowLabel row={riskRow} labelWidth={168} isMobile onToggle={() => {}} open={false} />);
    expect(screen.getByRole("button").textContent).not.toContain("Chemical, biological");
  });

  it("marks a diagnostic benchmark row", () => {
    render(<RowLabel row={benchRow} labelWidth={250} isMobile={false} open={false} onToggle={() => {}} />);
    expect(screen.getByRole("button").textContent).toContain("diagnostic");
  });

  it("calls onToggle with the row", () => {
    const onToggle = vi.fn();
    render(<RowLabel row={riskRow} labelWidth={250} isMobile={false} open={false} onToggle={onToggle} />);
    screen.getByRole("button").click();
    expect(onToggle).toHaveBeenCalledWith(riskRow);
  });
});

import { Legend } from "@/components/leaderboard/Legend";
import { GRADES } from "@/lib/scoring";

describe("Legend", () => {
  it("shows every grade band", () => {
    render(<Legend />);
    // The explanatory prose also names F- and A+, so a single-match query
    // would throw for a reason that has nothing to do with the chips.
    for (const g of GRADES) expect(screen.getAllByText(g).length).toBeGreaterThan(0);
  });

  it("explains the coverage bar", () => {
    render(<Legend />);
    expect(document.body.textContent).toContain("coverage");
  });
});
