/**
 * Shape and constants for job requisitions on the public careers board.
 *
 * The job array lives in `src/data/jobs.json` (committed, hand-edited for
 * now) and is consumed through `src/lib/jobs.ts` — nothing should import the
 * JSON directly. This file owns the TypeScript boundary, mirroring the
 * `src/data/events.types.ts` / `src/data/models.types.ts` pattern.
 *
 * PUBLIC DATA ONLY. This file and the JSON it describes are compiled into the
 * browser bundle and served from a public GitHub Pages site. Applicant data —
 * names, CVs, interview notes, rejection reasons — must never appear here.
 * That lives in the (separate, private, auth-gated) hiring app.
 *
 * Later phase: `jobs.json` becomes build-time generated from the ATS by a
 * `scripts/sync-jobs.mjs` (same contract as `scripts/sync-luma.mjs`), at which
 * point it gets gitignored. Consumers keep importing `@/lib/jobs` unchanged.
 */

/**
 * Requisition lifecycle.
 *
 * - `draft`  — being written. Hidden in production, shown in `npm run dev`
 *              with a badge so it can be previewed before going live.
 * - `open`   — live on the public board, accepting applications.
 * - `closed` — no longer accepting applications. Hidden from the board; the
 *              detail page still resolves so old links and search results
 *              don't 404.
 */
export type JobStatus = "draft" | "open" | "closed";

/** Maps to schema.org `employmentType` — see EMPLOYMENT_TYPE_SCHEMA in lib/jobs.ts. */
export type EmploymentType =
  | "full-time"
  | "part-time"
  | "contract"
  | "internship"
  | "fellowship";

export type WorkMode = "on-site" | "hybrid" | "remote";

/** One stage of the interview pipeline, as shown to candidates. */
export interface JobStage {
  /** Candidate-facing stage name, e.g. "Research conversation". */
  name: string;
  /** What happens in this stage and roughly how long it takes. */
  description: string;
}

export interface JobCompensation {
  /** Annual gross, in whole currency units. Omit both bounds for "not disclosed". */
  min?: number;
  max?: number;
  /** ISO 4217, e.g. "CHF". */
  currency: string;
  period: "year" | "month" | "hour";
  /** Free-text caveat, e.g. "pro-rated for part-time". */
  note?: string;
}

export interface Job {
  /** URL slug — the `/careers/:slug` path segment. Must be unique. */
  slug: string;
  title: string;
  /** Internal team or function, e.g. "Research", "Engineering", "Operations". */
  team: string;
  /** Human-readable primary location, e.g. "Zurich, Switzerland". */
  location: string;
  workMode: WorkMode;
  employmentType: EmploymentType;
  status: JobStatus;
  /** ISO 8601 date. Drives `datePosted` in the JobPosting structured data. */
  postedAt: string;
  /** ISO 8601 date. Drives `validThrough`; also used to flag stale postings. */
  closesAt?: string;
  /**
   * How many people we are hiring into this req. Omit (or 1) for a single
   * position — the UI only surfaces it when there is more than one, so the
   * common case stays quiet. Feeds `totalJobOpenings` in the structured data.
   */
  openings?: number;
  /** One or two sentences. Used on the board card and as the meta description. */
  summary: string;
  /**
   * Heading above `description`. Defaults to "About the role"; a research req
   * that leads with the science can set "The project" instead.
   */
  descriptionHeading?: string;
  /**
   * Body copy, one string per paragraph. Plain text, except that inline
   * `[label](https://…)` links are parsed out — see `parseBodyText` in
   * `src/lib/jobs.ts`. No other markdown is rendered.
   */
  description: string[];
  responsibilities: string[];
  requirements: string[];
  niceToHave?: string[];
  /**
   * Paragraph closing the "Nice to have" block. Defaults to the standard "none
   * of these are required" line when omitted.
   */
  niceToHaveNote?: string;
  /** "About us" paragraphs. Omitted reqs simply don't render the section. */
  aboutUs?: string[];
  /** "Practicalities" paragraphs: contract, salary, location, start date. */
  practicalities?: string[];
  /** Last line of the body, after every other section. */
  closingNote?: string;
  compensation?: JobCompensation;
  /**
   * Interview pipeline shown to candidates. Falls back to DEFAULT_PROCESS
   * when omitted, so most reqs don't need to restate the standard loop.
   */
  process?: JobStage[];
  /**
   * External application URL (hosted intake form or ATS). When absent, the
   * apply button falls back to a prefilled mailto — see `getApplyHref` in
   * `src/lib/jobs.ts`. This field is the seam where a real intake endpoint
   * plugs in without touching page code.
   */
  applyUrl?: string;
  /** Overrides CAREERS_CONTACT_EMAIL for role-specific questions. */
  contactEmail?: string;
}

/** Shape of `src/data/jobs.json`. */
export interface JobsData {
  /** ISO 8601 timestamp of the last edit (or sync, once automated). */
  updatedAt: string;
  jobs: Job[];
}

/** Where general and role-specific applications land today. */
export const CAREERS_CONTACT_EMAIL = "careers@safe.eu";

/** Canonical site origin — needed for absolute URLs in structured data. */
export const SITE_ORIGIN = "https://safe.eu";

/**
 * The standard interview loop, used for any req that doesn't define its own
 * `process`. Keep this in sync with the stage list configured in the hiring
 * app so candidates aren't told one thing and moved through another.
 */
export const DEFAULT_PROCESS: JobStage[] = [
  {
    name: "Screening",
    description:
      "We read every application ourselves and reply either way, usually within a week.",
  },
  {
    name: "First interview",
    description:
      "A 10-minute call on the basics: what the role involves, your timing and eligibility, and whether it is worth going further.",
  },
  {
    name: "In-depth research and technical interview",
    description:
      "90 minutes. You present something you've worked on, we dig into it together, and we work through a problem close to the role.",
  },
  {
    name: "Review and offer",
    description:
      "We score against criteria agreed before we started, then come back within a week with an offer or a clear account of where it fell short.",
  },
];
