/**
 * Heat colour for a 0–100 score: red at the bottom, amber in the middle, green
 * at the top, interpolated in HSL. Text flips between ink and white on relative
 * luminance so every cell stays readable — the amber midrange fails against
 * white, the deep green fails against ink.
 */
const HEAT_STOPS: [number, [number, number, number]][] = [
  [0, [2, 52, 57]],
  [50, [42, 62, 63]],
  [100, [150, 38, 45]],
];

const INK = "#0a1f4d";

export function heatColor(score: number): { background: string; color: string } {
  const upper = HEAT_STOPS.findIndex(([at]) => score <= at);
  const [fromAt, from] = HEAT_STOPS[Math.max(0, upper - 1)];
  const [toAt, to] = HEAT_STOPS[Math.max(0, upper)];
  const t = toAt === fromAt ? 0 : (score - fromAt) / (toAt - fromAt);
  const [h, s, l] = from.map((v, i) => v + (to[i] - v) * t) as [number, number, number];
  const [r, g, b] = hslToRgb(h, s / 100, l / 100);
  const luminance = (0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b));
  return {
    background: `hsl(${h.toFixed(1)} ${s.toFixed(1)}% ${l.toFixed(1)}%)`,
    color: luminance > 0.35 ? INK : "#ffffff",
  };
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return [r + m, g + m, b + m];
}

const srgb = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
