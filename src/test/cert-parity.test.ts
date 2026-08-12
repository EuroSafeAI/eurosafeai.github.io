/**
 * Validates src/data/models.json — which is copied verbatim from the evaluation
 * pipeline — against every assumption the leaderboard makes about it. There is
 * no runtime validation on the import, so this suite is the only thing standing
 * between a pipeline schema change and a silently blank page. It gates deploy.
 */
import { describe, it, expect } from "vitest";
import modelsData from "@/data/models.json";
import { RISKS, CONDITIONS, type ModelEntry } from "@/data/models.types";
import {
  BENCHMARK_LABELS,
  RISK_LABELS,
  isLlmJudge,
  isRefusalFloor,
  scorerLabel,
} from "@/lib/leaderboard";

const MODELS = modelsData as unknown as ModelEntry[];

/** Scorer keys the pipeline is known to emit. A new one is a schema change. */
const KNOWN_DETECTORS = [
  "exact_match",
  "refusal_regex",
  "scale_parse",
  "accept_reject_token",
  "attribution_mimicry",
  "react_attacker_tool_call",
];

const isScore = (v: unknown) => typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= 100;

describe("models.json — top level", () => {
  it("is non-empty", () => {
    expect(MODELS.length).toBeGreaterThan(0);
  });

  it("gives every model a name, a company and a unique, URL-safe id", () => {
    const seen = new Set<string>();
    for (const m of MODELS) {
      expect(typeof m.name, `${m.id} name`).toBe("string");
      expect(typeof m.company, `${m.id} company`).toBe("string");
      expect(m.company.length, `${m.id} company`).toBeGreaterThan(0);
      expect(/^[a-z0-9.-]+$/.test(m.id), `${m.id} is not URL-safe`).toBe(true);
      expect(seen.has(m.id), `duplicate id: ${m.id}`).toBe(false);
      seen.add(m.id);
    }
  });

  it("carries all four systemic risks in scores, results and status", () => {
    for (const m of MODELS) {
      for (const risk of RISKS) {
        expect(m.scores[risk], `${m.id}.scores.${risk}`).toBeTypeOf("number");
        expect(m.results[risk], `${m.id}.results.${risk}`).toBeDefined();
        expect(m.status[risk]?.status, `${m.id}.status.${risk}`).toBeTypeOf("string");
      }
    }
  });
});

describe("models.json — the invariant the page depends on", () => {
  it("mirrors results[risk].aggregate.worst into the flat scores block", () => {
    // The page reads the tree; the certificate the pipeline issues reads the
    // flat block. If these ever diverge, the page contradicts the certificate.
    for (const m of MODELS) {
      for (const risk of RISKS) {
        const worst = m.results[risk].aggregate.worst;
        const expected = worst === null ? -1 : worst;
        expect(m.scores[risk], `${m.id}.scores.${risk}`).toBe(expected);
      }
    }
  });
});

describe("models.json — leaf values", () => {
  it("keeps every score in [0, 100], or an explicit null/-1 absence", () => {
    const ok = (v: unknown) => v === null || v === -1 || isScore(v);
    for (const m of MODELS) {
      expect(ok(m.aggregate.worst), `${m.id}.aggregate.worst`).toBe(true);
      expect(ok(m.aggregate.mean), `${m.id}.aggregate.mean`).toBe(true);
      for (const risk of RISKS) {
        const r = m.results[risk];
        const at = `${m.id}.${risk}`;
        expect(ok(r.aggregate.worst), `${at}.aggregate.worst`).toBe(true);
        expect(ok(r.aggregate.mean), `${at}.aggregate.mean`).toBe(true);
        expect(ok(r.baseline), `${at}.baseline`).toBe(true);
        for (const [bench, b] of Object.entries(r.benchmarks)) {
          expect(ok(b.aggregate.worst), `${at}.${bench}.aggregate.worst`).toBe(true);
          expect(ok(b.baseline), `${at}.${bench}.baseline`).toBe(true);
          for (const [cond, c] of Object.entries(b.conditions)) {
            expect(ok(c.safety), `${at}.${bench}.${cond}.safety`).toBe(true);
            expect(ok(c.stability), `${at}.${bench}.${cond}.stability`).toBe(true);
            for (const [scorer, v] of Object.entries(c.scorers)) {
              expect(ok(v), `${at}.${bench}.${cond}.scorers.${scorer}`).toBe(true);
            }
          }
        }
      }
    }
  });

  it("uses only known condition names", () => {
    for (const m of MODELS) {
      for (const risk of RISKS) {
        for (const [bench, b] of Object.entries(m.results[risk].benchmarks)) {
          for (const cond of Object.keys(b.conditions)) {
            expect(CONDITIONS, `${m.id}.${risk}.${bench}: unknown condition`).toContain(cond);
          }
        }
      }
    }
  });
});

describe("models.json — the refusal floor", () => {
  it("only ever emits 100, outside the one benchmark that scores with it natively", () => {
    // _refusal_floor (pipeline/.../scorers/cluster.py) awards SAFE and nothing
    // else, which is why the UI shows those cells without a grade. If the
    // pipeline ever makes the floor emit a real distribution, this fails and
    // the ungraded treatment needs revisiting.
    let seen = 0;
    for (const m of MODELS) {
      for (const risk of RISKS) {
        for (const [bench, b] of Object.entries(m.results[risk].benchmarks)) {
          for (const [cond, c] of Object.entries(b.conditions)) {
            const v = c.scorers.refusal_regex;
            if (v === undefined || !isRefusalFloor(bench, "refusal_regex")) continue;
            expect(v, `${m.id}.${risk}.${bench}.${cond}`).toBe(100);
            seen++;
          }
        }
      }
    }
    expect(seen, "no refusal-floor entries found — has the pipeline renamed it?").toBeGreaterThan(0);
  });

  it("still carries a varying native refusal_regex on cyber_false_refusal", () => {
    const values = MODELS.flatMap((m) =>
      Object.values(m.results.cyber.benchmarks.cyber_false_refusal?.conditions ?? {})
        .map((c) => c.scorers.refusal_regex)
        .filter((v): v is number => v !== undefined)
    );
    expect(values.length).toBeGreaterThan(0);
    expect(new Set(values).size, "native detector should not be constant").toBeGreaterThan(1);
  });
});

describe("models.json — label coverage", () => {
  it("has a display name for every risk", () => {
    for (const risk of RISKS) expect(RISK_LABELS[risk], risk).toBeTruthy();
  });

  it("has a display name for every benchmark in the data", () => {
    for (const m of MODELS) {
      for (const risk of RISKS) {
        for (const bench of Object.keys(m.results[risk].benchmarks)) {
          expect(BENCHMARK_LABELS[bench], `unlabelled benchmark: ${bench}`).toBeTruthy();
        }
      }
    }
  });

  it("recognises every scorer key as either an LLM judge or a known detector", () => {
    for (const m of MODELS) {
      for (const risk of RISKS) {
        for (const b of Object.values(m.results[risk].benchmarks)) {
          for (const c of Object.values(b.conditions)) {
            for (const scorer of Object.keys(c.scorers)) {
              const known = isLlmJudge(scorer) || KNOWN_DETECTORS.includes(scorer);
              expect(known, `unknown scorer: ${scorer}`).toBe(true);
              expect(scorerLabel(scorer), `unlabelled scorer: ${scorer}`).toBeTruthy();
            }
          }
        }
      }
    }
  });
});
