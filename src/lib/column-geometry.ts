const EXPAND_DURATION = 0.32;
const EXPAND_CSS_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

/**
 * Column-group geometry, shared by the header and every body row so the two
 * stay in exact horizontal register. Any padding here would offset the header's
 * columns from the cells beneath them, so spacing lives on the cells instead.
 *
 * The whole subtree's expansion is driven by one inherited custom property,
 * `--member-open` (registered with `@property` in index.css so the browser
 * interpolates it as a number instead of jumping). This group sets it to 0 or
 * 1 and transitions it; every member column beneath just reads it — so a row
 * with many members animates one property instead of a flex-grow/flex-basis
 * pair per element, and the layout no longer re-solves flex sizes each frame.
 *
 * `leaves` must be the provider's unconditional member count (`models.length +
 * 1`), never the expansion-conditioned count used for `totalLeaves`/grid width.
 * If it were conditioned on `open`, `members` would be 0 while collapsed, the
 * emitted width would stop referencing `--member-open` at all, and only the
 * member columns (which do reference it) would animate — collapsing the group
 * in a single frame while its members are still sliding shut inside it.
 *
 * `shiftProperty`, when given, names a custom property (see `shiftVar` in
 * `column-order.ts`) holding the group's FLIP offset for a metric reorder. It
 * must be the single place the transform is written: `HeaderRow` and
 * `DataRow` both call this function, and writing the transform out separately
 * in each would risk the two falling out of byte-identical agreement, which
 * would drift the header out of horizontal register with the body mid-animation.
 *
 * `instantShift`, when true, drops `transform` from the transition list. FLIP
 * needs two distinct writes of the same property: the *invert* (jumping to the
 * pre-reorder offset) must be instantaneous or the browser animates the jump
 * itself, and only the *release* (back to 0) should transition. The caller is
 * responsible for sequencing which write happens with which flag.
 */
export function columnGroupStyle(
  leaves: number,
  cellWidth: number,
  open: boolean,
  reduced: boolean,
  shiftProperty?: string,
  instantShift = false
): React.CSSProperties {
  const members = leaves - 1;
  const transitions = ["--member-open"];
  if (shiftProperty && !instantShift) transitions.push("transform");
  return {
    flexShrink: 0,
    width: `calc(${cellWidth}px * (1 + ${members} * var(--member-open, 0)))`,
    minWidth: 0,
    display: "flex",
    overflow: "hidden",
    borderLeft: open ? "1px solid rgba(10,31,77,0.08)" : undefined,
    ["--member-open" as string]: open ? 1 : 0,
    transform: shiftProperty ? `translateX(var(${shiftProperty}, 0px))` : undefined,
    transition: reduced
      ? undefined
      : transitions.map((p) => `${p} ${EXPAND_DURATION}s ${EXPAND_CSS_EASE}`).join(", "),
  };
}

/**
 * A member column inside a provider group. Always rendered, at zero width when
 * the provider is collapsed — a freshly mounted element has no previous value
 * to transition from, so keeping it mounted is what lets it slide.
 *
 * Width and opacity both read the group's inherited `--member-open` directly,
 * so nothing here declares its own transition: the group's single animated
 * property is what moves, and every member follows it in lockstep. The group
 * width grows as cellWidth × (1 + n·t) while each member's width is t·cellWidth;
 * since Cell and HeaderCell roots hold `flex: "1 0 0"`, the provider's own
 * cell takes the remainder, cellWidth·(1 + n·t) − n·t·cellWidth = cellWidth,
 * unchanged for every t. Members appear to slide out from behind it rather
 * than everything compressing and re-expanding.
 */
export function memberColumnStyle(): React.CSSProperties {
  return {
    flexShrink: 0,
    width: `calc(var(--member-open, 0) * var(--cell-width))`,
    minWidth: 0,
    display: "flex",
    overflow: "hidden",
    opacity: `var(--member-open, 0)`,
  };
}
