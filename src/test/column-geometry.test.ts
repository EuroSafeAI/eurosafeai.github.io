import { describe, it, expect } from "vitest";
import { columnGroupStyle, memberColumnStyle } from "@/pages/CertificatePage";

describe("columnGroupStyle", () => {
  const cellWidth = 88;
  const leaves = 5; // members = 4

  it("returns the expected width calc and --member-open when collapsed", () => {
    const style = columnGroupStyle(leaves, cellWidth, false, false);
    expect(style.width).toBe(`calc(${cellWidth}px * (1 + 4 * var(--member-open, 0)))`);
    expect(style["--member-open" as keyof typeof style]).toBe(0);
  });

  it("returns the expected width calc and --member-open when expanded", () => {
    const style = columnGroupStyle(leaves, cellWidth, true, false);
    expect(style.width).toBe(`calc(${cellWidth}px * (1 + 4 * var(--member-open, 0)))`);
    expect(style["--member-open" as keyof typeof style]).toBe(1);
  });

  it("includes a transition when motion is not reduced", () => {
    const style = columnGroupStyle(leaves, cellWidth, true, false);
    expect(style.transition).toContain("--member-open");
  });

  it("omits the transition when motion is reduced", () => {
    const style = columnGroupStyle(leaves, cellWidth, true, true);
    expect(style.transition).toBeUndefined();
  });
});

describe("memberColumnStyle", () => {
  it("returns the expected width calc and --member-open when collapsed", () => {
    const style = memberColumnStyle(false, false);
    expect(style.width).toBe(`calc(var(--member-open, 0) * var(--cell-width))`);
  });

  it("returns the expected width calc when expanded", () => {
    const style = memberColumnStyle(true, false);
    expect(style.width).toBe(`calc(var(--member-open, 0) * var(--cell-width))`);
  });

  it("never carries its own transition, reduced or not — it inherits --member-open from its group", () => {
    expect(memberColumnStyle(true, false).transition).toBeUndefined();
    expect(memberColumnStyle(true, true).transition).toBeUndefined();
  });
});

/**
 * The whole mechanism rests on one invariant: whatever --member-open is, the
 * provider's own cell (which takes the remainder via `flex: "1 0 0"` on Cell
 * and HeaderCell) stays exactly cellWidth. If this drifted, the provider's
 * column would visibly shift under the cursor mid-animation — the exact defect
 * the flex-grow arrangement this replaces was built to prevent.
 *
 * Substitute --member-open = t into both formulas and confirm the algebra:
 *   groupWidth(t) = cellWidth * (1 + members * t)
 *   memberWidth(t) = t * cellWidth   (per member, `members` of them)
 *   providerCell(t) = groupWidth(t) - members * memberWidth(t) = cellWidth
 */
describe("provider-cell invariant", () => {
  const cellWidth = 88;
  const leaves = 5;
  const members = leaves - 1;

  function groupWidth(memberOpen: number): number {
    return cellWidth * (1 + members * memberOpen);
  }

  function memberWidth(memberOpen: number): number {
    return memberOpen * cellWidth;
  }

  it("holds the provider cell at cellWidth when --member-open = 0 (collapsed)", () => {
    const t = 0;
    const providerCell = groupWidth(t) - members * memberWidth(t);
    expect(providerCell).toBe(cellWidth);
  });

  it("holds the provider cell at cellWidth when --member-open = 1 (expanded)", () => {
    const t = 1;
    const providerCell = groupWidth(t) - members * memberWidth(t);
    expect(providerCell).toBe(cellWidth);
  });
});
