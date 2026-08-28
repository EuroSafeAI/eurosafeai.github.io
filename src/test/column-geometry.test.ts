import { describe, it, expect } from "vitest";
import { columnGroupStyle, memberColumnStyle, memberContentStyle } from "@/lib/column-geometry";

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

  it("sets a transform reading the shift property when one is given", () => {
    const style = columnGroupStyle(leaves, cellWidth, false, false, "--col-shift-a");
    expect(style.transform).toBe("translateX(var(--col-shift-a, 0px))");
    expect(style.transition).toContain("transform");
  });

  it("omits the transform, and its transition, without a shift property", () => {
    const style = columnGroupStyle(leaves, cellWidth, false, false);
    expect(style.transform).toBeUndefined();
    expect(style.transition).not.toContain("transform");
  });
});

describe("memberColumnStyle", () => {
  it("returns the expected width calc", () => {
    const style = memberColumnStyle();
    expect(style.width).toBe(`calc(var(--member-open, 0) * var(--cell-width))`);
  });

  it("never carries its own transition — it inherits --member-open from its group", () => {
    expect(memberColumnStyle().transition).toBeUndefined();
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
    .split("var(--member-open, 0)").join(String(memberOpen))
    .split("var(--cell-width)").join(String(cellWidthPx))
    .split("px").join("");
  return Function(`"use strict"; return (${expr});`)() as number;
}

/**
 * The whole mechanism rests on one invariant: whatever --member-open is, the
 * provider's own cell (which takes the remainder via `flex: "1 0 0"` on Cell
 * and HeaderCell) stays exactly cellWidth. If this drifted, the provider's
 * column would visibly shift under the cursor mid-animation — the exact defect
 * the flex-grow arrangement this replaces was built to prevent.
 *
 * This calls the real columnGroupStyle/memberColumnStyle the way production
 * does: `leaves` is the provider's unconditional member count (models.length +
 * 1), never varied with `open` — only `open` (and so --member-open) differs
 * between the collapsed and expanded calls. It then evaluates the returned
 * width calc strings at several values of `t` (--member-open), including
 * midpoints, because the bug this guards against — collapse computing a
 * different, non-t-dependent width than expand — only shows up mid-animation:
 * both endpoints (t=0, t=1) can coincidentally agree even when the two states
 * take different formulas to get there.
 *   groupWidth(t) = cellWidth * (1 + members * t)      [from columnGroupStyle]
 *   memberWidth(t) = t * cellWidth                     [from memberColumnStyle]
 *   providerCell(t) = groupWidth(t) - members * memberWidth(t) = cellWidth
 */
describe("provider-cell invariant", () => {
  const cellWidth = 88;
  const members = 4;
  const leaves = members + 1;

  function providerCellWidth(open: boolean, memberOpen: number): number {
    const groupStyle = columnGroupStyle(leaves, cellWidth, open, false);
    const memberStyle = memberColumnStyle();
    const groupWidth = evaluateWidthCalc(groupStyle.width as string, memberOpen, cellWidth);
    const memberWidth = evaluateWidthCalc(memberStyle.width as string, memberOpen, cellWidth);
    return groupWidth - members * memberWidth;
  }

  it.each([0, 0.25, 0.5, 0.75, 1])(
    "holds the provider cell at cellWidth while collapsing, at t=%s",
    (t) => {
      expect(providerCellWidth(false, t)).toBe(cellWidth);
    }
  );

  it.each([0, 0.25, 0.5, 0.75, 1])(
    "holds the provider cell at cellWidth while expanding, at t=%s",
    (t) => {
      expect(providerCellWidth(true, t)).toBe(cellWidth);
    }
  );
});

describe("memberContentStyle", () => {
  // A member column's own width animates from 0, so laying its content out at
  // that width would re-wrap the text on every frame — and at zero width a
  // wrapping name collapses to one character per line, growing the header row
  // to the height of its tallest content even while nothing is expanded.
  it("lays content out at a full cell width regardless of the column's width", () => {
    expect(memberContentStyle().width).toBe("var(--cell-width)");
  });

  it("does not shrink with its container", () => {
    expect(memberContentStyle().flexShrink).toBe(0);
  });
});
