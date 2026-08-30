import { describe, it, expect } from "vitest";
import { heatColor } from "@/lib/heat";

describe("heatColor", () => {
  it("is red at the bottom and green at the top", () => {
    expect(heatColor(0).background).toContain("hsl(2.0");
    expect(heatColor(100).background).toContain("hsl(150.0");
  });

  it("flips the text colour so the amber midrange stays readable", () => {
    expect(heatColor(50).color).not.toBe(heatColor(100).color);
  });

  it("interpolates between stops", () => {
    const mid = heatColor(75).background;
    expect(mid).not.toBe(heatColor(50).background);
    expect(mid).not.toBe(heatColor(100).background);
  });
});
