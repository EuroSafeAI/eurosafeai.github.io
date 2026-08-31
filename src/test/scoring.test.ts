import { describe, it, expect } from "vitest";
import { GRADES, GRADE_BAND, grade, gpa, mean, median, toScore } from "@/lib/scoring";

describe("grade scale", () => {
  it("spans A+ down to F− in 15 equal bands", () => {
    expect(GRADES).toHaveLength(15);
    expect(GRADES[0]).toBe("F−");
    expect(GRADES[GRADES.length - 1]).toBe("A+");
    expect(GRADE_BAND).toBeCloseTo(100 / 15);
  });

  it("pins the endpoints", () => {
    expect(grade(0)).toBe("F−");
    expect(grade(100)).toBe("A+");
  });

  it("puts band boundaries exactly at multiples of the band width", () => {
    expect(grade(GRADE_BAND - 0.01)).toBe("F−");
    expect(grade(GRADE_BAND)).toBe("F");
    expect(grade(14 * GRADE_BAND - 0.01)).toBe("A");
    expect(grade(14 * GRADE_BAND)).toBe("A+");
  });

  it("hands every band its own score", () => {
    // Midpoint of band i must grade as GRADES[i] — catches an off-by-one that
    // endpoint tests alone would miss.
    GRADES.forEach((g, i) => {
      expect(grade((i + 0.5) * GRADE_BAND)).toBe(g);
    });
  });

  it("is monotonic across the range", () => {
    let previous = -1;
    for (let s = 0; s <= 100; s += 0.5) {
      const index = GRADES.indexOf(grade(s));
      expect(index).toBeGreaterThanOrEqual(previous);
      previous = index;
    }
  });

  it("clamps rather than throwing on out-of-range input", () => {
    expect(grade(-5)).toBe("F−");
    expect(grade(140)).toBe("A+");
  });
});

describe("gpa", () => {
  it("maps 0–100 onto 0–4", () => {
    expect(gpa(0)).toBe(0);
    expect(gpa(50)).toBe(2);
    expect(gpa(100)).toBe(4);
  });

  it("rounds to two decimals", () => {
    expect(gpa(61.62)).toBe(2.46);
  });
});

describe("toScore", () => {
  it("passes through real scores", () => {
    expect(toScore(0)).toBe(0);
    expect(toScore(61.62)).toBe(61.62);
    expect(toScore(100)).toBe(100);
  });

  it("treats every absence convention as undefined", () => {
    expect(toScore(null)).toBeUndefined();
    expect(toScore(undefined)).toBeUndefined();
    expect(toScore(-1)).toBeUndefined();
    expect(toScore(NaN)).toBeUndefined();
    expect(toScore(Infinity)).toBeUndefined();
  });
});

describe("mean", () => {
  it("averages the defined values and ignores the rest", () => {
    expect(mean([10, undefined, 20])).toBe(15);
  });

  it("is undefined when nothing is defined", () => {
    expect(mean([])).toBeUndefined();
    expect(mean([undefined, undefined])).toBeUndefined();
  });

  it("does not round — display rounding is the caller's job", () => {
    expect(mean([1, 2])).toBeCloseTo(1.5);
  });
});

describe("median", () => {
  it("returns the middle value for an odd count", () => {
    expect(median([3, 1, 2])).toBe(2);
  });

  it("averages the two middle values for an even count", () => {
    // The case a naive midpoint index gets wrong. On the real roster that
    // error reports 58.0 where the median is 55.6.
    expect(median([1, 2, 3, 4])).toBe(2.5);
  });

  it("does not depend on input order", () => {
    expect(median([4, 1, 3, 2])).toBe(median([1, 2, 3, 4]));
  });

  it("ignores undefined values rather than counting them", () => {
    expect(median([1, undefined, 2, undefined, 3])).toBe(2);
  });

  it("is undefined when nothing is defined", () => {
    expect(median([])).toBeUndefined();
    expect(median([undefined, undefined])).toBeUndefined();
  });

  it("handles a single value", () => {
    expect(median([7])).toBe(7);
  });
});
