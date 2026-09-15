export const ACCENT = "#003399";
export const INK = "#0a1f4d";

/**
 * Each row must fit its label's two blocks of text: the name plus the gloss
 * that wraps under it. The gloss column is LABEL_WIDTH (320) minus the label's
 * horizontal chrome (paddingLeft 10 + INDENT.bench 18, paddingRight 8, the
 * chevron's 11px slot and its 7px gap), leaving 250px.
 *
 * Measured against that width rather than estimated from character counts:
 *   bench  name 15.625 + 2 + 4 gloss lines at 13.65 = 72.2. Four benchmarks
 *          reach that; none needs five.
 *   risk   CBRN's name takes 2 lines at 17.5 (the Code of Practice names are
 *          long) + 2 + its 2 gloss lines = 64.3; the other three fit one name
 *          line and three gloss lines, which is less.
 *
 * Overflow is clipped by the row (DataRow's `overflow: clip`), so a longer
 * gloss loses its tail rather than bleeding into the next row.
 */
export const ROW_HEIGHT = { risk: 68, bench: 76 } as const;

export const LEADERBOARD_WIDTH = 1360;
export const LABEL_WIDTH = 320;

/**
 * Space before the row labels. The grid runs edge to edge and the label column
 * is sticky at the viewport's left, so this is the only thing keeping the text
 * off the window edge.
 */
export const LABEL_GUTTER = 26;
/**
 * The same job on a phone, where 26 plus the section's own padding put 42px
 * of nothing between the window edge and the first chevron, on a screen with
 * 390 to spend.
 */
export const LABEL_GUTTER_MOBILE = 10;
export const CELL_MIN = 88;
/**
 * The widest a cell grows. 180 lets the grid fill a laptop, desktop and large
 * display completely at nine providers; the previous 140 left between 15 and
 * 32 per cent of those screens empty, which read as the table floating.
 */
export const CELL_MAX = 180;

/**
 * Cell width fitted to the space the grid actually has.
 *
 * `available` is the measured container width. The grid is no longer capped at
 * LEADERBOARD_WIDTH, so deriving from that constant would leave the table
 * floating in whitespace on a wide display. LEADERBOARD_WIDTH remains the
 * fallback for the first paint, before a measurement exists, and for any
 * environment without ResizeObserver.
 *
 * A hardcoded width would also strand whitespace or overflow the moment a
 * provider is added, which is why this is derived at all.
 */
export function deriveCellWidth(providers: number, available?: number): number {
  const width = available !== undefined && available > 0 ? available : LEADERBOARD_WIDTH;
  const fitted = Math.floor((width - LABEL_WIDTH) / providers);
  return Math.min(CELL_MAX, Math.max(CELL_MIN, fitted));
}
export const INDENT = { risk: 0, bench: 18 } as const;
export const HEADER_SCORE_HEIGHT = 40;
export const HEADER_LOGO = 20;

/**
 * Lines reserved for a column's name. Every name gets the same height whether
 * it uses one line or two, so the header is a constant height and the logos
 * above the names sit on one baseline instead of floating with the text.
 * Two lines holds every name in the roster at the model view's cell width.
 */
export const HEADER_NAME_LINES = 2;
export const HEADER_NAME_LINE_HEIGHT = 1.25;

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
  "Diagnostic: shown but kept out of the scores above, because it does not measure what the others measure.";

export const OVERALL_NOTE = "The four risk scores below, averaged.";

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

/**
 * The leaderboard's resting capability weight: 0, where the adjustment is the
 * identity and the table shows measured evaluation results. Weighing
 * capability in is an explicit act by the reader, not the default a
 * screenshot would capture.
 */
export const RAW_CAPABILITY_WEIGHT = 0;
