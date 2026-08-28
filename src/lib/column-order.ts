/**
 * Where each column *was*, relative to where it now is — the inverse offset a
 * FLIP animation starts from. The widths are known, so this needs no DOM
 * measurement: a column's x position is the sum of the widths preceding it.
 */
export function columnShifts(
  before: readonly string[],
  after: readonly string[],
  widthOf: (provider: string) => number
): Record<string, number> {
  const positions = (order: readonly string[]) => {
    const at: Record<string, number> = {};
    let x = 0;
    for (const provider of order) {
      at[provider] = x;
      x += widthOf(provider);
    }
    return at;
  };
  // A column present in one order but not the other has no previous position
  // to invert from, so there is nothing to animate: switching org/model
  // grouping replaces the whole set rather than reordering it. Subtracting an
  // absent position would emit NaN transforms and blank every column.
  const sameSet =
    before.length === after.length && new Set(before).size === new Set([...before, ...after]).size;
  if (!sameSet) return {};

  const from = positions(before);
  const to = positions(after);
  const shifts: Record<string, number> = {};
  for (const provider of after) shifts[provider] = from[provider] - to[provider];
  return shifts;
}

/**
 * `Z.ai` contains a dot, which is not valid in a custom-property name, hence
 * the sanitiser.
 */
export const shiftVar = (provider: string) =>
  `--col-shift-${provider.replace(/[^a-zA-Z0-9]/g, "-")}`;
