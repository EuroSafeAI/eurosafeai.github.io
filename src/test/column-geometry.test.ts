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
 * Evaluates a `width` calc string produced by columnGroupStyle/memberColumnStyle
 * at a concrete `--member-open` value, so the invariant test below exercises the
 * actual production formula rather than a hand-copied restatement of it. Any
 * edit to the arithmetic inside either function — an off-by-one in `members`,
 * a different combination rule — changes what this evaluates to and so is
 * caught by the invariant test, instead of silently passing a duplicated copy.
 */
function evaluateWidthCalc(calc: string, memberOpen: number, cellWidthPx: number): number {
  const expr = calc
    .trim()
    .replace(/^calc\((.*)\)$/, "$1")
    .replaceAll("var(--member-open, 0)", String(memberOpen))
    .replaceAll("var(--cell-width)", String(cellWidthPx))
    .replaceAll("px", "");
  // eslint-disable-next-line no-new-func -- evaluating a small arithmetic
  // expression sourced from our own calc() string, not external input.
  return Function(`"use strict"; return (${expr});`)() as number;
}

/**
 * The whole mechanism rests on one invariant: whatever --member-open is, the
 * provider's own cell (which takes the remainder via `flex: "1 0 0"` on Cell
 * and HeaderCell) stays exactly cellWidth. If this drifted, the provider's
 * column would visibly shift under the cursor mid-animation — the exact defect
 * the flex-grow arrangement this replaces was built to prevent.
 *
 * This calls the real columnGroupStyle/memberColumnStyle, takes the `width`
 * calc strings they return, and evaluates them at --member-open = 0 and = 1:
 *   groupWidth(t) = cellWidth * (1 + members * t)      [from columnGroupStyle]
 *   memberWidth(t) = t * cellWidth                     [from memberColumnStyle]
 *   providerCell(t) = groupWidth(t) - members * memberWidth(t) = cellWidth
 * A formula change in either production function changes these evaluated
 * numbers, so this test fails rather than silently passing.
 */
describe("provider-cell invariant", () => {
  const cellWidth = 88;
  const leaves = 5;
  const members = leaves - 1;

  function providerCellWidth(memberOpen: number): number {
    const groupStyle = columnGroupStyle(leaves, cellWidth, memberOpen === 1, false);
    const memberStyle = memberColumnStyle(memberOpen === 1, false);
    const groupWidth = evaluateWidthCalc(groupStyle.width as string, memberOpen, cellWidth);
    const memberWidth = evaluateWidthCalc(memberStyle.width as string, memberOpen, cellWidth);
    return groupWidth - members * memberWidth;
  }

  it("holds the provider cell at cellWidth when --member-open = 0 (collapsed)", () => {
    expect(providerCellWidth(0)).toBe(cellWidth);
  });

  it("holds the provider cell at cellWidth when --member-open = 1 (expanded)", () => {
    expect(providerCellWidth(1)).toBe(cellWidth);
  });
});
