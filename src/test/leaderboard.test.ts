import { describe, it, expect } from "vitest";
import {
  BENCHMARK_DESCRIPTIONS,
  BENCHMARK_LABELS,
  RISK_DESCRIPTIONS,
  RISK_LABELS,
  buildColumns,
  buildRows,
  isLlmJudge,
  isRefusalFloor,
  judgeRowKind,
  judgeRowLabel,
  modelCoverage,
  modelScore,
  overallCoverage,
  overallScore,
  providerCoverage,
  providerScore,
  scorerLabel,
  type Row,
} from "@/lib/leaderboard";
import { coverageFraction } from "@/lib/scoring";
import { RISKS, type BenchmarkResult, type ModelEntry, type Risk } from "@/data/models.types";

/**
 * Minimal ModelEntry with one risk populated. Everything the leaderboard reads
 * is explicit here; the rest is filled with inert values so the fixtures stay
 * readable.
 */
function model(
  id: string,
  company: string,
  benchmarks: Record<string, BenchmarkResult>,
  riskWorst: number | null = 50,
  risk: Risk = "cbrn"
): ModelEntry {
  const empty = { aggregate: { worst: null, mean: null }, baseline: null, by_family: {}, benchmarks: {} };
  const results = Object.fromEntries(RISKS.map((r) => [r, { ...empty }])) as ModelEntry["results"];
  results[risk] = { aggregate: { worst: riskWorst, mean: null }, baseline: null, by_family: {}, benchmarks };
  return {
    id,
    name: id,
    company,
    region: "US",
    specialty: null,
    scores: Object.fromEntries(RISKS.map((r) => [r, r === risk ? (riskWorst ?? -1) : -1])) as ModelEntry["scores"],
    aggregate: { worst: riskWorst, mean: riskWorst },
    results,
    status: Object.fromEntries(
      RISKS.map((r) => [r, { status: "success" as const, completed_samples: 1, total_samples: 1 }])
    ) as ModelEntry["status"],
    aa_intelligence_index: 50,
    aa_model_match: `${id} (AA match)`,
  };
}

function benchmark(
  worst: number | null,
  conditions: Record<string, Record<string, number>>,
  diagnostic = false
): BenchmarkResult {
  return {
    aggregate: { worst, mean: worst },
    baseline: null,
    ...(diagnostic ? { diagnostic: true } : {}),
    conditions: Object.fromEntries(
      Object.entries(conditions).map(([name, scorers]) => [
        name,
        { safety: worst ?? 0, stability: null, scored: 1, abstained: 0, total: 1, scorers },
      ])
    ) as BenchmarkResult["conditions"],
  };
}

const JUDGE = "openrouter/anthropic/claude-sonnet-4.5";

describe("buildColumns", () => {
  it("groups models by company", () => {
    const columns = buildColumns([
      model("a1", "Anthropic", {}, 80),
      model("o1", "OpenAI", {}, 70),
      model("a2", "Anthropic", {}, 60),
    ]);
    expect(columns.map((c) => c.provider)).toEqual(["Anthropic", "OpenAI"]);
    expect(columns[0].models.map((m) => m.id)).toEqual(["a1", "a2"]);
  });

  it("orders providers by descending mean of their models", () => {
    // Anthropic mean 70, OpenAI 75 → OpenAI first despite Anthropic's higher peak.
    const columns = buildColumns([
      model("a1", "Anthropic", {}, 90),
      model("a2", "Anthropic", {}, 50),
      model("o1", "OpenAI", {}, 75),
    ]);
    expect(columns.map((c) => c.provider)).toEqual(["OpenAI", "Anthropic"]);
  });
});

describe("buildRows", () => {
  const models = [
    model("a1", "Anthropic", {
      harmbench: benchmark(90, { control: { [JUDGE]: 99 }, paraphrase: { [JUDGE]: 90 } }),
      sosbench: benchmark(70, { paraphrase: { [JUDGE]: 70 } }),
      wmdp: benchmark(10, { paraphrase: { exact_match: 10 } }, true),
    }),
  ];

  it("shows only the four risks when nothing is expanded", () => {
    const rows = buildRows(models, new Set(), new Set());
    expect(rows).toHaveLength(RISKS.length);
    expect(rows.every((r) => r.level === "risk")).toBe(true);
  });

  it("inserts a risk's benchmarks directly beneath it when expanded", () => {
    const rows = buildRows(models, new Set(["cbrn"]), new Set());
    expect(rows[0]).toMatchObject({ level: "risk", risk: "cbrn" });
    expect(rows.slice(1, 4).map((r) => (r as { bench: string }).bench)).toEqual([
      "harmbench",
      "sosbench",
      "wmdp",
    ]);
    expect(rows[4].level).toBe("risk");
  });

  it("sorts benchmarks by score descending, with diagnostics last regardless", () => {
    const shuffled = [
      model("a1", "Anthropic", {
        sosbench: benchmark(70, {}),
        wmdp: benchmark(99, {}, true), // highest score, but diagnostic
        harmbench: benchmark(90, {}),
      }),
    ];
    const rows = buildRows(shuffled, new Set(["cbrn"]), new Set());
    expect(rows.slice(1, 4).map((r) => (r as { bench: string }).bench)).toEqual([
      "harmbench",
      "sosbench",
      "wmdp",
    ]);
    expect(rows[3]).toMatchObject({ diagnostic: true });
  });

  it("inserts judge rows beneath an expanded benchmark, LLM judges before detectors", () => {
    const mixed = [
      model("a1", "Anthropic", {
        harmbench: benchmark(90, { paraphrase: { refusal_regex: 80, [JUDGE]: 90 } }),
      }),
    ];
    const rows = buildRows(mixed, new Set(["cbrn"]), new Set(["cbrn/harmbench"]));
    expect(rows.slice(2, 4).map((r) => (r as { scorer: string }).scorer)).toEqual([
      JUDGE,
      "refusal_regex",
    ]);
  });

  it("sorts the refusal floor last, after real deterministic scorers", () => {
    const mixed = [
      model("a1", "Anthropic", {
        harmbench: benchmark(90, { paraphrase: { refusal_regex: 100, exact_match: 80, [JUDGE]: 90 } }),
      }),
    ];
    const rows = buildRows(mixed, new Set(["cbrn"]), new Set(["cbrn/harmbench"]));
    expect(rows.slice(2, 5).map((r) => (r as { scorer: string }).scorer)).toEqual([
      JUDGE,
      "exact_match",
      "refusal_regex",
    ]);
  });

  it("flags refusal_regex rows as the floor, except on cyber_false_refusal", () => {
    const floored = [
      model("a1", "Anthropic", {
        harmbench: benchmark(90, { paraphrase: { refusal_regex: 100 } }),
      }),
    ];
    const rows = buildRows(floored, new Set(["cbrn"]), new Set(["cbrn/harmbench"]));
    expect(rows[2]).toMatchObject({ level: "judge", scorer: "refusal_regex", floor: true });

    const native = [
      model(
        "a1",
        "Anthropic",
        { cyber_false_refusal: benchmark(90, { paraphrase: { refusal_regex: 77 } }) },
        50,
        "cyber"
      ),
    ];
    const nativeRows = buildRows(native, new Set(["cyber"]), new Set(["cyber/cyber_false_refusal"]));
    const judgeRow = nativeRows.find((r) => r.level === "judge");
    expect(judgeRow).toMatchObject({ scorer: "refusal_regex", floor: false });
  });

  it("propagates the diagnostic flag from a benchmark down to its judge rows", () => {
    const rows = buildRows(models, new Set(["cbrn"]), new Set(["cbrn/wmdp", "cbrn/harmbench"]));
    const judges = rows.filter((r) => r.level === "judge") as { bench: string; diagnostic: boolean }[];
    expect(judges.length).toBeGreaterThan(0);
    for (const row of judges) {
      expect(row.diagnostic, row.bench).toBe(row.bench === "wmdp");
    }
  });

  it("never flags an LLM judge as the floor", () => {
    const rows = buildRows(models, new Set(["cbrn"]), new Set(["cbrn/harmbench"]));
    for (const row of rows.filter((r) => r.level === "judge")) {
      if ((row as { scorer: string }).scorer !== "refusal_regex") {
        expect(row).toMatchObject({ floor: false });
      }
    }
  });

  it("keeps a benchmark's judge rows hidden while its risk is collapsed", () => {
    const rows = buildRows(models, new Set(), new Set(["cbrn/harmbench"]));
    expect(rows).toHaveLength(RISKS.length);
  });

  it("gives every row a unique key", () => {
    const rows = buildRows(models, new Set(["cbrn"]), new Set(["cbrn/harmbench"]));
    expect(new Set(rows.map((r) => r.key)).size).toBe(rows.length);
  });
});

describe("modelScore", () => {
  const subject = model("a1", "Anthropic", {
    harmbench: benchmark(88, {
      control: { [JUDGE]: 100 },
      paraphrase: { [JUDGE]: 90 },
      register: { [JUDGE]: 70 },
    }),
  });

  const riskRow: Row = { key: "cbrn", level: "risk", risk: "cbrn" };
  const benchRow: Row = { key: "k", level: "bench", risk: "cbrn", bench: "harmbench", diagnostic: false };
  const judgeRow: Row = {
    key: "k",
    level: "judge",
    risk: "cbrn",
    bench: "harmbench",
    scorer: JUDGE,
    floor: false,
    diagnostic: false,
  };

  it("reads the risk's worst aggregate", () => {
    expect(modelScore(subject, riskRow)).toBe(50);
  });

  it("reads the benchmark's worst aggregate", () => {
    expect(modelScore(subject, benchRow)).toBe(88);
  });

  it("means a judge across conditions, excluding the control baseline", () => {
    // (90 + 70) / 2 — the 100 under `control` must not lift it.
    expect(modelScore(subject, judgeRow)).toBe(80);
  });

  it("is undefined when the judge abstained everywhere outside control", () => {
    const abstained = model("a1", "Anthropic", {
      harmbench: benchmark(88, { control: { [JUDGE]: 100 }, paraphrase: { refusal_regex: 50 } }),
    });
    expect(modelScore(abstained, judgeRow)).toBeUndefined();
  });

  it("is undefined for a risk the model never completed", () => {
    const failed = model("a1", "Anthropic", {}, null);
    expect(modelScore(failed, riskRow)).toBeUndefined();
  });

  it("is undefined for a benchmark this model does not carry", () => {
    expect(modelScore(model("a1", "Anthropic", {}), benchRow)).toBeUndefined();
  });
});

describe("overall (the column heading score)", () => {
  it("is not a row — the grid holds only the four risks", () => {
    const rows = buildRows([model("a1", "Anthropic", {})], new Set(), new Set());
    expect(rows).toHaveLength(RISKS.length);
    expect(rows.every((r) => r.level === "risk")).toBe(true);
  });

  it("reads the model-level aggregate the pipeline already computed", () => {
    const subject = model("a1", "Anthropic", {}, 60);
    subject.aggregate = { worst: 73.09, mean: 86.98 };
    expect(overallScore([subject])).toBe(73.09);
    expect(overallScore([subject], "mean")).toBe(86.98);
  });

  it("means across a provider's models, as a collapsed column does", () => {
    const a = model("a1", "Anthropic", {});
    const b = model("a2", "Anthropic", {});
    a.aggregate = { worst: 80, mean: 90 };
    b.aggregate = { worst: 60, mean: 70 };
    expect(overallScore([a, b])).toBe(70);
    expect(overallScore([a, b], "mean")).toBe(80);
  });

  it("is undefined when no model resolved an aggregate", () => {
    const a = model("a1", "Anthropic", {});
    a.aggregate = { worst: null, mean: null };
    expect(overallScore([a])).toBeUndefined();
  });

  it("pools coverage across the risks, excluding diagnostics", () => {
    const b = benchmark(90, { paraphrase: { [JUDGE]: 90 } });
    b.conditions.paraphrase!.scored = 20;
    b.conditions.paraphrase!.total = 56;
    const diag = benchmark(90, { paraphrase: { [JUDGE]: 90 } }, true);
    diag.conditions.paraphrase!.scored = 1;
    diag.conditions.paraphrase!.total = 999;
    const subject = model("a1", "Anthropic", { harmbench: b, wmdp: diag });
    expect(overallCoverage([subject])).toEqual({ scored: 20, total: 56 });
  });
});

describe("refusal floor as an optimistic bound", () => {
  const floorRow: Row = {
    key: "k", level: "judge", risk: "cbrn", bench: "harmbench",
    scorer: "refusal_regex", floor: true, diagnostic: false,
  };

  const subject = () => {
    const b = benchmark(60, { paraphrase: { refusal_regex: 100 } });
    b.conditions.paraphrase!.scored = 25;
    b.conditions.paraphrase!.total = 100;
    return model("a1", "Anthropic", { harmbench: b });
  };

  it("restates the benchmark score with unscored samples counted safe", () => {
    // 60 over the 25 scored, 100 over the 75 unscored → 90
    expect(modelScore(subject(), floorRow)).toBe(90);
  });

  it("never reports below the benchmark's own score", () => {
    const score = modelScore(subject(), floorRow)!;
    expect(score).toBeGreaterThanOrEqual(60);
  });

  it("equals the benchmark score exactly at full coverage", () => {
    const b = benchmark(60, { paraphrase: { refusal_regex: 100 } });
    b.conditions.paraphrase!.scored = 100;
    b.conditions.paraphrase!.total = 100;
    expect(modelScore(model("a1", "Anthropic", { harmbench: b }), floorRow)).toBe(60);
  });

  it("adjusts the mean aggregate too, so the cell can show both", () => {
    const s = subject();
    s.results.cbrn.benchmarks.harmbench.aggregate.mean = 80;
    expect(modelScore(s, floorRow, "mean")).toBe(95); // 80*0.25 + 100*0.75
  });
});

describe("mean aggregation", () => {
  const benchRow: Row = { key: "k", level: "bench", risk: "cbrn", bench: "harmbench", diagnostic: false };
  const judgeRow: Row = {
    key: "k",
    level: "judge",
    risk: "cbrn",
    bench: "harmbench",
    scorer: JUDGE,
    floor: false,
    diagnostic: false,
  };

  it("reads the other aggregate without touching the worst-case path", () => {
    const subject = model("a1", "Anthropic", { harmbench: benchmark(48, {}) });
    // benchmark() writes the same figure to both, so assert they're independently read
    subject.results.cbrn.benchmarks.harmbench.aggregate.mean = 78;
    expect(modelScore(subject, benchRow)).toBe(48);
    expect(modelScore(subject, benchRow, "mean")).toBe(78);
  });

  it("has no mean counterpart for a judge — the per-sample data isn't in the file", () => {
    const subject = model("a1", "Anthropic", {
      harmbench: benchmark(90, { paraphrase: { [JUDGE]: 90 } }),
    });
    expect(modelScore(subject, judgeRow)).toBe(90);
    expect(modelScore(subject, judgeRow, "mean")).toBeUndefined();
  });
});

describe("coverage", () => {
  const withCoverage = (scored: number, total: number, name = "paraphrase") => {
    const b = benchmark(90, { [name]: { [JUDGE]: 90 } });
    b.conditions[name as "paraphrase"]!.scored = scored;
    b.conditions[name as "paraphrase"]!.total = total;
    return b;
  };

  const benchRow: Row = { key: "k", level: "bench", risk: "cbrn", bench: "harmbench", diagnostic: false };
  const riskRow: Row = { key: "cbrn", level: "risk", risk: "cbrn" };

  it("sums scored and total over the benchmark's conditions", () => {
    const b = withCoverage(20, 56);
    b.conditions.register = {
      safety: 90, stability: null, scored: 30, abstained: 26, total: 56,
      scorers: { [JUDGE]: 90 },
    };
    const subject = model("a1", "Anthropic", { harmbench: b });
    expect(modelCoverage(subject, benchRow)).toEqual({ scored: 50, total: 112 });
  });

  it("excludes the control baseline, which never enters an aggregate", () => {
    const b = withCoverage(20, 56);
    b.conditions.control = {
      safety: 100, stability: null, scored: 56, abstained: 0, total: 56,
      scorers: { [JUDGE]: 100 },
    };
    const subject = model("a1", "Anthropic", { harmbench: b });
    expect(modelCoverage(subject, benchRow)).toEqual({ scored: 20, total: 56 });
  });

  it("gives a judge row its benchmark's coverage — counts are per condition, not per judge", () => {
    const subject = model("a1", "Anthropic", { harmbench: withCoverage(20, 56) });
    const judgeRow: Row = {
      key: "k", level: "judge", risk: "cbrn", bench: "harmbench",
      scorer: JUDGE, floor: false, diagnostic: false,
    };
    expect(modelCoverage(subject, judgeRow)).toEqual(modelCoverage(subject, benchRow));
  });

  it("excludes diagnostic benchmarks at the risk level, matching the score", () => {
    const diag = withCoverage(1, 999);
    diag.diagnostic = true;
    const subject = model("a1", "Anthropic", {
      harmbench: withCoverage(20, 56),
      wmdp: diag,
    });
    expect(modelCoverage(subject, riskRow)).toEqual({ scored: 20, total: 56 });
  });

  it("pools raw counts across a provider rather than averaging fractions", () => {
    // 10/100 and 90/100 pool to 50%, which is also the mean here; 10/10 + 0/90
    // would not be, so use lopsided totals to prove counts are what's summed.
    const models = [
      model("a1", "Anthropic", { harmbench: withCoverage(10, 10) }),
      model("a2", "Anthropic", { harmbench: withCoverage(0, 90) }),
    ];
    expect(providerCoverage(models, benchRow)).toEqual({ scored: 10, total: 100 });
    expect(coverageFraction(providerCoverage(models, benchRow)!)).toBeCloseTo(0.1);
  });

  it("is undefined when the benchmark is absent", () => {
    expect(modelCoverage(model("a1", "Anthropic", {}), benchRow)).toBeUndefined();
  });
});

describe("providerScore", () => {
  const row: Row = { key: "cbrn", level: "risk", risk: "cbrn" };

  it("means across the provider's models", () => {
    const models = [model("a1", "Anthropic", {}, 90), model("a2", "Anthropic", {}, 70)];
    expect(providerScore(models, row)).toBe(80);
  });

  it("ignores models missing that score", () => {
    const models = [model("a1", "Anthropic", {}, 90), model("a2", "Anthropic", {}, null)];
    expect(providerScore(models, row)).toBe(90);
  });

  it("is undefined when no model has the score", () => {
    expect(providerScore([model("a1", "Anthropic", {}, null)], row)).toBeUndefined();
  });
});

describe("refusal floor naming", () => {
  const floorRow = {
    key: "k",
    level: "judge" as const,
    risk: "cbrn" as const,
    bench: "harmbench",
    scorer: "refusal_regex",
    floor: true,
    diagnostic: false,
  };
  const nativeRow = { ...floorRow, bench: "cyber_false_refusal", floor: false };

  it("distinguishes the floor from the native detector", () => {
    expect(isRefusalFloor("harmbench", "refusal_regex")).toBe(true);
    expect(isRefusalFloor("cyber_false_refusal", "refusal_regex")).toBe(false);
    expect(isRefusalFloor("harmbench", "exact_match")).toBe(false);
    expect(isRefusalFloor("harmbench", JUDGE)).toBe(false);
  });

  it("renames the floor so it does not read as a scorer's verdict", () => {
    expect(judgeRowLabel(floorRow)).toBe("Refusal floor");
    expect(judgeRowLabel(nativeRow)).toBe("Refusal regex");
  });

  it("describes what each judge row actually is", () => {
    expect(judgeRowKind(floorRow)).toBe("unscored counted safe");
    expect(judgeRowKind(nativeRow)).toBe("deterministic scorer");
    expect(judgeRowKind({ ...floorRow, scorer: JUDGE, floor: false })).toBe("LLM judge");
  });
});

describe("scorer naming", () => {
  it("distinguishes LLM judges from deterministic detectors", () => {
    expect(isLlmJudge(JUDGE)).toBe(true);
    expect(isLlmJudge("openrouter/openai/gpt-5.6-luna")).toBe(true);
    expect(isLlmJudge("exact_match")).toBe(false);
    expect(isLlmJudge("refusal_regex")).toBe(false);
  });

  it("strips the router prefix from judge names", () => {
    expect(scorerLabel(JUDGE)).toBe("Claude Sonnet 4.5");
    expect(scorerLabel("openrouter/openai/gpt-5.6-luna")).toBe("GPT-5.6 Luna");
  });

  it("gives detectors human names", () => {
    expect(scorerLabel("exact_match")).toBe("Exact match");
    expect(scorerLabel("refusal_regex")).toBe("Refusal regex");
  });

  it("falls back to the raw id rather than rendering blank", () => {
    expect(scorerLabel("openrouter/acme/some-future-judge")).toBe("some-future-judge");
    expect(scorerLabel("some_future_detector")).toBe("some_future_detector");
  });
});

describe("label coverage", () => {
  it("names every risk", () => {
    for (const risk of RISKS) {
      expect(RISK_LABELS[risk], risk).toBeTruthy();
      expect(RISK_DESCRIPTIONS[risk], risk).toBeTruthy();
    }
  });

  it("exports benchmark labels as a non-empty table", () => {
    expect(Object.keys(BENCHMARK_LABELS).length).toBeGreaterThan(0);
  });
});

describe("BENCHMARK_DESCRIPTIONS", () => {
  it("covers exactly the benchmarks that have labels", () => {
    expect(Object.keys(BENCHMARK_DESCRIPTIONS).sort()).toEqual(Object.keys(BENCHMARK_LABELS).sort());
  });

  it("never restates the label", () => {
    for (const [key, text] of Object.entries(BENCHMARK_DESCRIPTIONS)) {
      expect(text.trim().length).toBeGreaterThan(20);
      expect(text.trim()).not.toBe(BENCHMARK_LABELS[key]);
    }
  });

  it("gives every benchmark a distinct description", () => {
    const values = Object.values(BENCHMARK_DESCRIPTIONS);
    expect(new Set(values).size).toBe(Object.keys(BENCHMARK_DESCRIPTIONS).length);
  });
});
