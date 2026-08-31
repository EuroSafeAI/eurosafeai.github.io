/**
 * Shape and invariant checks for src/data/jobs.json.
 *
 * jobs.json is hand-edited today (and machine-generated later), so the risk is
 * a malformed req shipping to production silently — a bad slug, a stale
 * posting, or structured data Google rejects. These run in CI before deploy.
 */

import { describe, it, expect } from "vitest";
import jobsData from "@/data/jobs.json";
import type { JobsData } from "@/data/jobs.types";
import {
  allJobs,
  buildJobPostingJsonLd,
  formatCompensation,
  getApplyHref,
  getBoardJobs,
  getJobBySlug,
  getProcess,
} from "@/lib/jobs";

const data = jobsData as JobsData;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}/;

describe("jobs.json shape", () => {
  it("has a valid updatedAt timestamp", () => {
    expect(Number.isNaN(Date.parse(data.updatedAt))).toBe(false);
  });

  it.each(data.jobs.map((j) => [j.slug, j] as const))(
    "%s has required fields",
    (_slug, job) => {
      expect(job.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(job.title.trim().length).toBeGreaterThan(0);
      expect(job.team.trim().length).toBeGreaterThan(0);
      expect(job.location.trim().length).toBeGreaterThan(0);
      expect(["draft", "open", "closed"]).toContain(job.status);
      expect(["on-site", "hybrid", "remote"]).toContain(job.workMode);
      expect([
        "full-time",
        "part-time",
        "contract",
        "internship",
        "fellowship",
      ]).toContain(job.employmentType);
      expect(job.postedAt).toMatch(ISO_DATE);
      expect(job.summary.trim().length).toBeGreaterThan(0);
      expect(job.description.length).toBeGreaterThan(0);
      expect(job.responsibilities.length).toBeGreaterThan(0);
      expect(job.requirements.length).toBeGreaterThan(0);
    },
  );

  it("has unique slugs", () => {
    const slugs = data.jobs.map((j) => j.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("closes after it posts, when a close date is set", () => {
    for (const job of data.jobs) {
      if (!job.closesAt) continue;
      expect(job.closesAt).toMatch(ISO_DATE);
      expect(Date.parse(job.closesAt)).toBeGreaterThan(Date.parse(job.postedAt));
    }
  });

  it("does not leave expired reqs open", () => {
    const now = Date.now();
    for (const job of data.jobs.filter((j) => j.status === "open")) {
      if (!job.closesAt) continue;
      expect(
        Date.parse(job.closesAt),
        `${job.slug} closed on ${job.closesAt} — set status to "closed"`,
      ).toBeGreaterThan(now);
    }
  });

  it("uses absolute https applyUrls when set", () => {
    for (const job of data.jobs) {
      if (job.applyUrl) expect(job.applyUrl).toMatch(/^https:\/\//);
    }
  });
});

describe("visibility rules", () => {
  it("hides drafts from the production board", () => {
    expect(getBoardJobs(false).some((j) => j.status === "draft")).toBe(false);
  });

  it("shows drafts in dev so reqs can be previewed", () => {
    const drafts = allJobs.filter((j) => j.status === "draft");
    expect(getBoardJobs(true).length).toBe(
      allJobs.filter((j) => j.status !== "closed").length,
    );
    for (const d of drafts) {
      expect(getBoardJobs(true)).toContain(d);
    }
  });

  it("keeps closed reqs off the board but resolvable by slug", () => {
    for (const job of allJobs.filter((j) => j.status === "closed")) {
      expect(getBoardJobs(true)).not.toContain(job);
      expect(getJobBySlug(job.slug, false)).toBe(job);
    }
  });

  it("404s draft slugs in production", () => {
    for (const job of allJobs.filter((j) => j.status === "draft")) {
      expect(getJobBySlug(job.slug, false)).toBeUndefined();
      expect(getJobBySlug(job.slug, true)).toBe(job);
    }
  });

  it("returns undefined for unknown slugs", () => {
    expect(getJobBySlug("not-a-real-role", true)).toBeUndefined();
  });
});

describe("helpers", () => {
  it("gives every req a candidate-facing process", () => {
    for (const job of allJobs) {
      expect(getProcess(job).length).toBeGreaterThan(0);
    }
  });

  it("falls back to a prefilled mailto when there is no applyUrl", () => {
    for (const job of allJobs.filter((j) => !j.applyUrl)) {
      const href = getApplyHref(job);
      expect(href.startsWith("mailto:")).toBe(true);
      expect(href).toContain(encodeURIComponent(job.title));
    }
  });

  it("formats a compensation range, or nothing when undisclosed", () => {
    for (const job of allJobs) {
      const formatted = formatCompensation(job);
      if (job.compensation?.min === undefined && job.compensation?.max === undefined) {
        expect(formatted).toBeUndefined();
      } else {
        expect(formatted).toContain(job.compensation!.currency);
      }
    }
  });
});

describe("JobPosting structured data", () => {
  it.each(allJobs.map((j) => [j.slug, j] as const))(
    "%s produces Google-required fields",
    (_slug, job) => {
      const ld = buildJobPostingJsonLd(job);
      expect(ld["@type"]).toBe("JobPosting");
      expect(ld.title).toBe(job.title);
      expect(ld.datePosted).toBe(job.postedAt);
      expect(ld.description).toContain("<p>");
      expect(ld.hiringOrganization).toMatchObject({ name: "EuroSafeAI" });
      expect(ld.jobLocation).toBeDefined();
      expect(ld.url).toBe(`https://safe.eu/careers/${job.slug}`);
      // Must serialize — it goes into the page as JSON.
      expect(() => JSON.stringify(ld)).not.toThrow();
    },
  );

  it("marks remote roles as telecommute", () => {
    for (const job of allJobs) {
      const ld = buildJobPostingJsonLd(job);
      expect(ld.jobLocationType).toBe(
        job.workMode === "remote" ? "TELECOMMUTE" : undefined,
      );
    }
  });
});
