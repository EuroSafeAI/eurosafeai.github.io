export const ACCENT = "#003399";
export const INK = "#0a1f4d";

/**
 * `bench` must fit the row-label button's two lines of text: the name (one
 * line, ellipsized) plus the gloss (wraps). The gloss column is LABEL_WIDTH
 * (320) minus the button's horizontal chrome — paddingLeft 10 + INDENT.bench
 * 18, paddingRight 8, the chevron 11, and its 7px gap — leaving ~266px at
 * fontSize 10.5 / lineHeight 1.3. At roughly 50 characters per line that's
 * ~53 characters short of the longest gloss (160 chars, human_rights_persona_gap
 * in src/lib/leaderboard.ts), which needs up to 4 wrapped lines once word
 * boundaries are accounted for (three 50-char lines only fit 150).
 * Height = name line (12.5 * 1.25 = 15.625) + gloss's 2px marginTop
 * + 4 gloss lines (10.5 * 1.3 = 13.65 each) = 72.225, rounded up for margin.
 */
export const ROW_HEIGHT = { risk: 64, bench: 76, judge: 42 } as const;

export const LEADERBOARD_WIDTH = 1360;
export const LABEL_WIDTH = 320;
export const CELL_MIN = 88;
export const CELL_MAX = 140;

/**
 * Hardcoding a cell width that happens to fill the container at today's nine
 * providers would strand whitespace or overflow the moment a tenth appears.
 */
export function deriveCellWidth(providers: number): number {
  const fitted = Math.floor((LEADERBOARD_WIDTH - LABEL_WIDTH) / providers);
  return Math.min(CELL_MAX, Math.max(CELL_MIN, fitted));
}
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
