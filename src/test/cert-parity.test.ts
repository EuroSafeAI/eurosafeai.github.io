/**
 * Validates src/data/models.json — which is copied verbatim from the evaluation
 * pipeline — against every assumption the leaderboard makes about it. There is
 * no runtime validation on the import, so this suite is the only thing standing
 * between a pipeline schema change and a silently blank page. It gates deploy.
 */
import { describe, it, expect } from "vitest";
import modelsData from "@/data/models.json";
import { publishedRoster } from "@/lib/roster";
import { CONDITIONS, RISKS, type ModelEntry, type Risk } from "@/data/models.types";
import {
  BENCHMARK_LABELS,
  RISK_LABELS,
  isLlmJudge,
  isRefusalFloor,
  scorerLabel,
} from "@/lib/leaderboard";

// The promoted roster, because that is what the site publishes. Checking the
// raw export instead would pass over a model whose scores the site fills in.
/**
 * Model/risk pairs whose evaluation actually produced results. A risk whose
 * run failed carries no baseline, conditions or benchmarks, so asserting the
 * full shape over it would fail for a reason that is not a defect.
 */
const evaluated = (m: ModelEntry, risk: Risk) =>
  Object.keys(m.results[risk]?.benchmarks ?? {}).length > 0;

const MODELS = publishedRoster(modelsData as unknown as ModelEntry[]);

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
        if (!evaluated(m, risk)) continue;
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
        if (!evaluated(m, risk)) continue;
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
        if (!evaluated(m, risk)) continue;
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
        if (!evaluated(m, risk)) continue;
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
        if (!evaluated(m, risk)) continue;
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
      Object.values(m.results.cyber?.benchmarks?.cyber_false_refusal?.conditions ?? {})
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
        if (!evaluated(m, risk)) continue;
        for (const bench of Object.keys(m.results[risk].benchmarks)) {
          expect(BENCHMARK_LABELS[bench], `unlabelled benchmark: ${bench}`).toBeTruthy();
        }
      }
    }
  });

  it("recognises every scorer key as either an LLM judge or a known detector", () => {
    for (const m of MODELS) {
      for (const risk of RISKS) {
        if (!evaluated(m, risk)) continue;
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

/**
 * The published roster and the retired judges are pruned site-side after each
 * verbatim refresh from the pipeline, so nothing upstream enforces them. This
 * block is what makes the next refresh fail loudly instead of silently
 * republishing what we removed.
 */
const PUBLISHED_IDS = [
  "claude-sonnet-5",
  "claude-haiku-4.5",
  "gpt-5.6-luna-pro",
  "gemma-4-31b-it",
  "gemini-3.6-flash",
  "llama-3.1-8b-instruct",
  "glm-5.2",
  "glm-5",
  "qwen3.7-flash",
  "grok-4.5",
  "grok-4.3",
  "deepseek-v4-flash",
  "deepseek-v4-pro",
  "mistral-medium-3-5",
  "mistral-small-2603",
  "gpt-oss-120b",
  "llama-4-maverick",
  "gpt-5.6-sol",
];

/** Present in the pipeline export but deliberately not published, and why. */
const WITHHELD: Record<string, string> = {};

const RETIRED_SCORERS = [
  "openrouter/openai/gpt-5-mini",
  "openrouter/google/gemini-3-flash-preview",
];

describe("models.json — the site-side prune", () => {
  it("publishes exactly the expected roster", () => {
    expect([...MODELS.map((m) => m.id)].sort()).toEqual([...PUBLISHED_IDS].sort());
  });

  it("withholds models that are not comparable, for a stated reason", () => {
    for (const id of Object.keys(WITHHELD)) {
      expect(MODELS.some((m) => m.id === id), `${id} should not be published`).toBe(false);
    }
  });

  it("gives every published model a score for every risk", () => {
    // Not the same as every run succeeding: gpt-5.6-sol's CBRN and cyber runs
    // failed and its scores come from the samples that did complete. What must
    // hold is that no risk is simply absent from a published grade.
    for (const m of MODELS) {
      for (const risk of RISKS) {
        if (!evaluated(m, risk)) continue;
        expect(typeof m.scores[risk], `${m.id}.${risk}`).toBe("number");
      }
    }
  });

  it("carries no retired scorer keys", () => {
    const serialised = JSON.stringify(modelsData);
    for (const scorer of RETIRED_SCORERS) {
      expect(serialised.includes(`"${scorer}"`), `${scorer} is back`).toBe(false);
    }
  });

  it("gives every model an Artificial Analysis intelligence index and match", () => {
    for (const m of MODELS) {
      expect(m.aa_intelligence_index, `${m.id}.aa_intelligence_index`).toBeTypeOf("number");
      expect(m.aa_intelligence_index, `${m.id}.aa_intelligence_index`).toBeGreaterThan(0);
      expect(m.aa_intelligence_index, `${m.id}.aa_intelligence_index`).toBeLessThanOrEqual(100);
      expect(m.aa_model_match, `${m.id}.aa_model_match`).toBeTypeOf("string");
      expect(m.aa_model_match.length, `${m.id}.aa_model_match`).toBeGreaterThan(0);
    }
  });
});
