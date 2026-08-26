export const ACCENT = "#003399";
export const INK = "#0a1f4d";

export const ROW_HEIGHT = { risk: 58, bench: 44, judge: 38 } as const;
export const INDENT = { risk: 0, bench: 18, judge: 36 } as const;
export const HEADER_SCORE_HEIGHT = 40;
export const HEADER_LOGO = 20;

/**
 * Shared easing/duration so the vertical row reveals (framer-motion) and the
 * horizontal column expansion (CSS) move on the same curve.
 *
 * Also declared privately in `src/lib/column-geometry.ts`. That copy is left
 * alone deliberately — importing across that boundary would invert the
 * dependency (a pure lib depending on a component module).
 */
export const EXPAND_DURATION = 0.32;
export const EXPAND_CSS_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

export const DIAGNOSTIC_NOTE =
  "Diagnostic benchmark: reported for transparency but excluded from the aggregates above, because its score does not mean what a safety score means.";

export const FLOOR_NOTE =
  "Optimistic bound: this benchmark's score recomputed with every unscored sample counted as safe. The headline above drops those samples instead. The two bracket the truth — a response the provider's filter blocked outright is arguably the safest outcome, but the pipeline cannot grade what it never saw.";

export const OVERALL_NOTE =
  "Overall: the mean of the four systemic-risk scores below, as the evaluation pipeline computes it.";

/**
 * Keyed on the `company` string the pipeline writes. Spellings have shifted
 * across runs ("Mistral AI" → "Mistral", "Zhipu AI" → "Z.ai"), so both are
 * kept — a miss costs only the logo, and the provider name still renders.
 */
export const COMPANY_LOGO: Record<string, string> = {
  "OpenAI": "/logos/openai.svg",
  "Google": "/logos/google.svg",
  "Google DeepMind": "/logos/deepmind.svg",
  "Anthropic": "/logos/anthropic.svg",
  "Meta": "/logos/meta.svg",
  "xAI": "/logos/xai.png",
  "Alibaba": "/logos/qwen.svg",
  "Alibaba (Qwen)": "/logos/qwen.svg",
  "DeepSeek": "/logos/deepseek.svg",
  "Moonshot AI": "/logos/kimi.png",
  "Z.ai": "/logos/zhipu.svg",
  "Zhipu AI": "/logos/zhipu.svg",
  "MiniMax / Xiaomi": "/logos/minimax.png",
  "Mistral": "/logos/mistral.png",
  "Mistral AI": "/logos/mistral.png",
  "Microsoft": "/logos/microsoft.png",
};

/**
 * Coverage below this reads as a caveat on the grade rather than noise, so the
 * cell grows an under-bar showing how much of the suite actually got scored.
 * Most cells sit at or near 100%; the ones that don't are concentrated in a few
 * model × benchmark pairs where the judges abstained heavily.
 */
export const COVERAGE_FLAG = 0.95;
