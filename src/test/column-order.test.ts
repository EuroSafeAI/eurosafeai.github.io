import { describe, it, expect } from "vitest";
import { columnShifts, shiftVar } from "@/lib/column-order";

const uniform = () => 100;

describe("columnShifts", () => {
  it("is all zero when the order does not change", () => {
    const shifts = columnShifts(["a", "b", "c"], ["a", "b", "c"], uniform);
    expect(Object.values(shifts)).toEqual([0, 0, 0]);
  });

  it("reports where each column was, relative to where it now is", () => {
    const shifts = columnShifts(["a", "b"], ["b", "a"], uniform);
    expect(shifts.a).toBe(-100);
    expect(shifts.b).toBe(100);
  });

  it("accounts for expanded columns being wider", () => {
    const widthOf = (p: string) => (p === "a" ? 300 : 100);
    const shifts = columnShifts(["a", "b", "c"], ["b", "c", "a"], widthOf);
    expect(shifts.a).toBe(-200);
    expect(shifts.b).toBe(300);
    expect(shifts.c).toBe(300);
  });

  it("preserves total width across the reorder", () => {
    const widthOf = (p: string) => (p === "a" ? 300 : 100);
    const total = (order: string[]) => order.reduce((n, p) => n + widthOf(p), 0);
    expect(total(["a", "b", "c"])).toBe(total(["b", "c", "a"]));
  });

  it("sanitises a provider name into a legal custom property", () => {
    expect(shiftVar("Z.ai")).toBe("--col-shift-Z-ai");
  });
});

describe("columnShifts when the column set changes", () => {
  const uniform = () => 100;

  it("returns no shifts when the set is replaced rather than reordered", () => {
    // Switching org/model grouping swaps 9 organisation columns for 16 model
    // columns. Every name is new, so there is no previous position to invert
    // from; computing one anyway yields NaN transforms.
    const shifts = columnShifts(["Anthropic", "OpenAI"], ["Claude Sonnet 5", "GPT-5.6 Luna"], uniform);
    expect(shifts).toEqual({});
  });

  it("returns no shifts when the set only partly overlaps", () => {
    expect(columnShifts(["a", "b"], ["b", "c"], uniform)).toEqual({});
  });

  it("still shifts a genuine reorder of the same set", () => {
    expect(columnShifts(["a", "b"], ["b", "a"], uniform)).toEqual({ a: -100, b: 100 });
  });

  it("never emits NaN", () => {
    for (const after of [["x"], ["a", "b", "c"], ["b", "a"]]) {
      for (const shift of Object.values(columnShifts(["a", "b"], after, uniform))) {
        expect(Number.isFinite(shift)).toBe(true);
      }
    }
  });
});
