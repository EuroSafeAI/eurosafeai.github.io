/**
 * Single access point for job requisitions.
 *
 * Pages import from here, never from `@/data/jobs.json` directly — so when the
 * JSON becomes build-time generated from the hiring app, only this file
 * changes. Mirrors the `src/lib/team.ts` / `src/lib/papers.ts` pattern.
 */

import jobsData from "@/data/jobs.json";
import {
  CAREERS_CONTACT_EMAIL,
  DEFAULT_PROCESS,
  SITE_ORIGIN,
  type EmploymentType,
  type Job,
  type JobsData,
  type JobStage,
} from "@/data/jobs.types";

const data = jobsData as JobsData;

/** Every req regardless of status, newest first. */
export const allJobs: Job[] = [...data.jobs].sort(
  (a, b) => Date.parse(b.postedAt) - Date.parse(a.postedAt),
);

/** ISO timestamp of the last edit to jobs.json. */
export const jobsUpdatedAt: string = data.updatedAt;

/** Live reqs accepting applications. This is what production renders. */
export const openJobs: Job[] = allJobs.filter((j) => j.status === "open");

/**
 * What the public board shows.
 *
 * Drafts are included in `npm run dev` only, so a req can be previewed at its
 * real URL before it goes live — the board marks them with a badge. Production
 * builds see open reqs and nothing else.
 */
export const getBoardJobs = (
  includeDrafts: boolean = import.meta.env.DEV,
): Job[] =>
  includeDrafts
    ? allJobs.filter((j) => j.status === "open" || j.status === "draft")
    : openJobs;

/**
 * Resolve a slug for the detail page.
 *
 * Closed reqs resolve deliberately — inbound links from job boards and search
 * results outlive the posting, and a closed-role page is a better landing than
 * a 404. Drafts resolve in dev only, matching `getBoardJobs`.
 */
export const getJobBySlug = (
  slug: string,
  includeDrafts: boolean = import.meta.env.DEV,
): Job | undefined => {
  const job = allJobs.find((j) => j.slug === slug);
  if (!job) return undefined;
  if (job.status === "draft" && !includeDrafts) return undefined;
  return job;
};

/** Stages shown to candidates — per-req override, else the standard loop. */
export const getProcess = (job: Job): JobStage[] => job.process ?? DEFAULT_PROCESS;

/** Where role questions go. */
export const getContactEmail = (job: Job): string =>
  job.contactEmail ?? CAREERS_CONTACT_EMAIL;

/**
 * Destination of the apply button.
 *
 * With no backend, this falls back to a mailto carrying the role in the
 * subject and nothing else: the draft opens empty so applicants write their
 * own note rather than filling in a template. Setting `applyUrl` on a req
 * switches it to a hosted intake form with no page changes.
 */
export const getApplyHref = (job: Job): string => {
  if (job.applyUrl) return job.applyUrl;
  const subject = encodeURIComponent(`Application: ${job.title}`);
  return `mailto:${getContactEmail(job)}?subject=${subject}`;
};

/** True when the apply action opens an email client rather than a form. */
export const isMailtoApply = (job: Job): boolean => !job.applyUrl;

/* ────────────────── body copy ────────────────── */

/** A run of body copy: plain text, or text carrying a link. */
export interface TextSegment {
  text: string;
  href?: string;
}

/**
 * Matches exactly `[label](https://…)`. Deliberately narrow: job copy is plain
 * text, and adverts only ever need the odd citation or reference link, so this
 * buys inline links without a markdown dependency or a sanitiser.
 */
const MARKDOWN_LINK = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;

/** Split one paragraph into plain and linked runs, in order. */
export const parseBodyText = (para: string): TextSegment[] => {
  const segments: TextSegment[] = [];
  let cursor = 0;

  for (const match of para.matchAll(MARKDOWN_LINK)) {
    const start = match.index ?? 0;
    if (start > cursor) segments.push({ text: para.slice(cursor, start) });
    segments.push({ text: match[1], href: match[2] });
    cursor = start + match[0].length;
  }

  if (cursor < para.length) segments.push({ text: para.slice(cursor) });
  return segments;
};

/** Same copy as HTML, for the structured data blob. */
const bodyTextToHtml = (para: string): string =>
  para.replace(MARKDOWN_LINK, '<a href="$2">$1</a>');

/* ────────────────── display helpers ────────────────── */

const WORK_MODE_LABEL: Record<Job["workMode"], string> = {
  "on-site": "On-site",
  hybrid: "Hybrid",
  remote: "Remote",
};

const EMPLOYMENT_TYPE_LABEL: Record<EmploymentType, string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  internship: "Internship",
  fellowship: "Fellowship",
};

export const formatWorkMode = (job: Job): string => WORK_MODE_LABEL[job.workMode];

export const formatEmploymentType = (job: Job): string =>
  EMPLOYMENT_TYPE_LABEL[job.employmentType];

/** e.g. "Zurich, Switzerland · Hybrid", or just the mode when fully remote. */
export const formatLocation = (job: Job): string =>
  job.workMode === "remote"
    ? `Remote · ${job.location}`
    : `${job.location} · ${WORK_MODE_LABEL[job.workMode]}`;

const CURRENCY_PERIOD_SUFFIX: Record<
  NonNullable<Job["compensation"]>["period"],
  string
> = { year: "per year", month: "per month", hour: "per hour" };

/** e.g. "CHF 110,000 to 145,000 per year". Undefined when not disclosed. */
export const formatCompensation = (job: Job): string | undefined => {
  const c = job.compensation;
  if (!c || (c.min === undefined && c.max === undefined)) return undefined;
  const num = (n: number) => n.toLocaleString("en-US");
  const range =
    c.min !== undefined && c.max !== undefined
      ? `${num(c.min)} to ${num(c.max)}`
      : num((c.min ?? c.max) as number);
  return `${c.currency} ${range} ${CURRENCY_PERIOD_SUFFIX[c.period]}`;
};

/** e.g. "17 August 2026". */
export const formatPostedDate = (job: Job): string =>
  new Date(job.postedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

/** Absolute canonical URL for a req. */
export const getJobUrl = (job: Job): string => `${SITE_ORIGIN}/careers/${job.slug}`;

/* ────────────────── structured data ────────────────── */

/** schema.org employmentType vocabulary. */
const EMPLOYMENT_TYPE_SCHEMA: Record<EmploymentType, string> = {
  "full-time": "FULL_TIME",
  "part-time": "PART_TIME",
  contract: "CONTRACTOR",
  internship: "INTERN",
  fellowship: "OTHER",
};

/** Split "Zurich, Switzerland" into its locality and country parts. */
const splitLocation = (location: string) => {
  const parts = location.split(",").map((p) => p.trim()).filter(Boolean);
  return {
    addressLocality: parts[0] ?? location,
    addressCountry: parts.length > 1 ? parts[parts.length - 1] : undefined,
  };
};

/**
 * `JobPosting` structured data, so open roles are eligible for Google Jobs.
 * Free distribution in a small hiring market — worth the few lines.
 *
 * Serialize into a `<script type="application/ld+json">` on the detail page.
 */
export const buildJobPostingJsonLd = (job: Job): Record<string, unknown> => {
  const { addressLocality, addressCountry } = splitLocation(job.location);

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    // Google expects an HTML string here; paragraphs keep it readable.
    description: [
      job.summary,
      ...job.description,
      ...(job.aboutUs ?? []),
      ...(job.practicalities ?? []),
    ]
      .map((p) => `<p>${bodyTextToHtml(p)}</p>`)
      .join(""),
    datePosted: job.postedAt,
    employmentType: EMPLOYMENT_TYPE_SCHEMA[job.employmentType],
    directApply: !job.applyUrl,
    hiringOrganization: {
      "@type": "Organization",
      name: "EuroSafeAI",
      sameAs: SITE_ORIGIN,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality,
        ...(addressCountry ? { addressCountry } : {}),
      },
    },
    url: getJobUrl(job),
  };

  if (job.closesAt) jsonLd.validThrough = job.closesAt;

  if (job.openings && job.openings > 1) jsonLd.totalJobOpenings = job.openings;

  // Remote roles need the telecommute marker or Google mis-files them.
  if (job.workMode === "remote") jsonLd.jobLocationType = "TELECOMMUTE";

  const c = job.compensation;
  if (c && (c.min !== undefined || c.max !== undefined)) {
    jsonLd.baseSalary = {
      "@type": "MonetaryAmount",
      currency: c.currency,
      value: {
        "@type": "QuantitativeValue",
        ...(c.min !== undefined ? { minValue: c.min } : {}),
        ...(c.max !== undefined ? { maxValue: c.max } : {}),
        unitText: c.period.toUpperCase(),
      },
    };
  }

  return jsonLd;
};
