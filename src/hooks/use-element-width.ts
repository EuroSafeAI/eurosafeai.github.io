import { useEffect, useState } from "react";

/**
 * The measured width of an element, or undefined until it has been measured.
 *
 * The leaderboard sizes its cells to the space it actually has rather than to
 * a design constant, so it needs the real container width. Callers must treat
 * undefined as "not yet known" and fall back to a sensible default: it is the
 * value on first paint, and in any environment without ResizeObserver.
 */
export function useElementWidth(element: HTMLElement | null): number | undefined {
  const [width, setWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!element || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver((entries) => {
      const measured = entries[0]?.contentRect.width;
      if (measured && measured > 0) setWidth(measured);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  return width;
}
