import { describe, it, expect } from "vitest";
import { calcAgg, calcGrade } from "@/lib/scoring";
import modelsData from "@/data/models.json";
import type { ModelEntry } from "@/data/models.types";

const MODELS = modelsData as ModelEntry[];
const SCORE_KEYS = ["hr", "harm", "hist", "auth"] as const;

describe("certificate ↔ leaderboard parity", () => {
  it("data file is non-empty", () => {
    expect(MODELS.length).toBeGreaterThan(0);
  });

  it("every model has the required top-level fields", () => {
    for (const m of MODELS) {
      expect(typeof m.id, `id of ${JSON.stringify(m)}`).toBe("string");
      expect(m.id.length, `${m.id} id length`).toBeGreaterThan(0);
      expect(typeof m.name, `${m.id} name`).toBe("string");
      expect(typeof m.company, `${m.id} company`).toBe("string");
    }
  });

  it("model IDs are unique (PDF filenames depend on it)", () => {
    const seen = new Set<string>();
    for (const m of MODELS) {
      expect(seen.has(m.id), `duplicate id: ${m.id}`).toBe(false);
      seen.add(m.id);
    }
  });

  it("model IDs are URL-safe (used as path segments and filenames)", () => {
    const safe = /^[a-z0-9.-]+$/;
    for (const m of MODELS) {
      expect(safe.test(m.id), `${m.id} contains non-URL-safe chars`).toBe(true);
    }
  });

  it("every score value, where present, is a finite number in [0, 100]", () => {
    // Scores may be partial — the deployed data currently has no `hist` on any
    // model and the leaderboard shows '—' for missing dimensions. This test
    // only validates that scores that DO exist are well-formed.
    for (const m of MODELS) {
      for (const k of SCORE_KEYS) {
        const v = m.scores[k];
        if (v === undefined) continue;
        expect(Number.isFinite(v), `${m.id}: scores.${k} = ${v}`).toBe(true);
        expect(v, `${m.id}: scores.${k}`).toBeGreaterThanOrEqual(0);
        expect(v, `${m.id}: scores.${k}`).toBeLessThanOrEqual(100);
      }
    }
  });

  it("every model has at least one score so calcAgg doesn't fall back to 0", () => {
    for (const m of MODELS) {
      const present = SCORE_KEYS.filter((k) => typeof m.scores[k] === "number");
      expect(present.length, `${m.id}: no scores at all`).toBeGreaterThan(0);
    }
  });

  it("aggregate is an integer 0–100", () => {
    for (const m of MODELS) {
      const agg = calcAgg(m.scores);
      expect(Number.isInteger(agg), `${m.id}: agg = ${agg}`).toBe(true);
      expect(agg).toBeGreaterThanOrEqual(0);
      expect(agg).toBeLessThanOrEqual(100);
    }
  });

  it("grade thresholds match the contract", () => {
    // Same thresholds as scripts/generate-certificates.mjs (contract v1.0.0)
    expect(calcGrade(100)).toBe("A");
    expect(calcGrade(80)).toBe("A");
    expect(calcGrade(79)).toBe("B");
    expect(calcGrade(65)).toBe("B");
    expect(calcGrade(64)).toBe("C");
    expect(calcGrade(50)).toBe("C");
    expect(calcGrade(49)).toBe("D");
    expect(calcGrade(0)).toBe("D");
  });

  it("every model resolves to a valid grade", () => {
    for (const m of MODELS) {
      const g = calcGrade(calcAgg(m.scores));
      expect(["A", "B", "C", "D"]).toContain(g);
    }
  });
});
