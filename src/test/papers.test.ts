/**
 * Shape and invariant checks for src/lib/papers.ts.
 *
 * papers.ts is hand-edited every time a paper lands, and until now nothing
 * imported it from a test, so a malformed entry reached `npm run build`
 * before anything complained. These are the cheap invariants: a broken one
 * here is a broken publications page.
 */

import { describe, it, expect } from "vitest";
import { papers, getHighlightedPapers, getPapersByCategory, type Category } from "@/lib/papers";

const CATEGORIES: Category[] = ["multi-agent-safety", "democracy-defense", "safety"];

describe("papers.ts entries", () => {
  it("has at least one paper", () => {
    expect(papers.length).toBeGreaterThan(0);
  });

  it("gives every paper a unique slug", () => {
    const slugs = papers.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("uses url-safe slugs", () => {
    for (const p of papers) {
      expect(p.slug, p.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it("fills in the required text fields", () => {
    for (const p of papers) {
      expect(p.title.trim(), p.slug).not.toBe("");
      expect(p.summary.trim(), p.slug).not.toBe("");
    }
  });

  it("credits at least one author, none of them blank", () => {
    for (const p of papers) {
      expect(p.authors.length, p.slug).toBeGreaterThan(0);
      for (const a of p.authors) expect(a.trim(), p.slug).not.toBe("");
    }
  });

  it("files every paper under at least one known category", () => {
    for (const p of papers) {
      expect(p.categories.length, p.slug).toBeGreaterThan(0);
      for (const c of p.categories) expect(CATEGORIES, p.slug).toContain(c);
    }
  });

  it("links out over https when it links out at all", () => {
    for (const p of papers) {
      if (p.paperUrl === undefined) continue;
      expect(() => new URL(p.paperUrl as string), p.slug).not.toThrow();
      expect(p.paperUrl, p.slug).toMatch(/^https:\/\//);
    }
  });

  it("names a venue that is not left blank", () => {
    for (const p of papers) {
      if (p.venue === undefined) continue;
      expect(p.venue.trim(), p.slug).not.toBe("");
    }
  });
});

describe("getPapersByCategory", () => {
  it("returns only papers in the requested category", () => {
    for (const c of CATEGORIES) {
      for (const p of getPapersByCategory(c)) expect(p.categories, p.slug).toContain(c);
    }
  });

  it("accounts for every paper across the three categories", () => {
    const seen = new Set(CATEGORIES.flatMap((c) => getPapersByCategory(c).map((p) => p.slug)));
    expect(seen.size).toBe(papers.length);
  });
});

describe("getHighlightedPapers", () => {
  it("returns exactly the flagged papers", () => {
    const flagged = papers.filter((p) => p.highlight).map((p) => p.slug).sort();
    expect(getHighlightedPapers().map((p) => p.slug).sort()).toEqual(flagged);
  });

  it("gives every highlighted paper a rank", () => {
    for (const p of getHighlightedPapers()) {
      expect(p.highlightRank, p.slug).toBeTypeOf("number");
    }
  });

  it("does not let two highlighted papers claim the same rank", () => {
    const ranks = getHighlightedPapers().map((p) => p.highlightRank);
    expect(new Set(ranks).size).toBe(ranks.length);
  });

  it("returns them in ascending rank order", () => {
    const ranks = getHighlightedPapers().map((p) => p.highlightRank as number);
    expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
  });

  it("keeps the highlight count to what the 2-up grid can show", () => {
    expect(getHighlightedPapers().length).toBeLessThanOrEqual(4);
  });

  it("does not leave a research line unrepresented", () => {
    const covered = new Set(getHighlightedPapers().flatMap((p) => p.categories));
    for (const c of CATEGORIES) expect(covered, `no highlighted paper for ${c}`).toContain(c);
  });
});
