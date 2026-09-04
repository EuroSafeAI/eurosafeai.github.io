import { describe, it, expect } from "vitest";
import { isPartiallyEvaluated } from "@/lib/roster";
import modelsData from "@/data/models.json";
import type { ModelEntry } from "@/data/models.types";

const RAW = modelsData as unknown as ModelEntry[];

describe("isPartiallyEvaluated", () => {
  it("flags a model whose risks did not all succeed", () => {
    // gpt-5.6-sol's CBRN and cyber runs failed on provider content-filter
    // refusals; the export carries their partial results with coverage, and the
    // status still says failed, which is what this reads.
    expect(isPartiallyEvaluated(RAW.find((m) => m.id === "gpt-5.6-sol")!)).toBe(true);
  });

  it("does not flag a model that completed every risk", () => {
    for (const model of RAW.filter((m) => m.id !== "gpt-5.6-sol")) {
      expect(isPartiallyEvaluated(model), model.id).toBe(false);
    }
  });
});
