import "@testing-library/jest-dom";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

/**
 * jsdom has no IntersectionObserver, and AnimatedSection drives framer-motion's
 * whileInView through it. Entries are reported as intersecting immediately so
 * scroll-in content is present for assertions rather than waiting for a
 * viewport event that never comes.
 */
class ImmediateIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: ReadonlyArray<number> = [];
  private readonly callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element) {
    this.callback(
      [{ isIntersecting: true, target, intersectionRatio: 1 } as IntersectionObserverEntry],
      this
    );
  }
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

window.IntersectionObserver = ImmediateIntersectionObserver;
globalThis.IntersectionObserver = ImmediateIntersectionObserver;

/**
 * jsdom has no ResizeObserver, and the leaderboard measures its container to
 * size cells to the space actually available. Tests that need a specific width
 * can set `document.body.dataset.testWidth`; otherwise nothing is reported and
 * the grid keeps its design-width fallback.
 */
class TestResizeObserver implements ResizeObserver {
  private readonly callback: ResizeObserverCallback;
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  observe(target: Element) {
    const width = Number(document.body.dataset.testWidth ?? 0);
    if (width > 0) {
      this.callback(
        [{ target, contentRect: { width } } as unknown as ResizeObserverEntry],
        this
      );
    }
  }
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = TestResizeObserver;
globalThis.ResizeObserver = TestResizeObserver;
