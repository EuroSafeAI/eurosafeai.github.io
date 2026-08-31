import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import { Globe, Users, BookOpen, Compass, Target, Zap, MessageSquare, Briefcase, MapPin, ArrowRight } from "lucide-react";
import { CAREERS_CONTACT_EMAIL, type Job } from "@/data/jobs.types";
import { formatEmploymentType, formatLocation, getBoardJobs } from "@/lib/jobs";

const ACCENT = "#003399";
const INK = "#0a1f4d";
const MUTED = "rgba(10,31,77,0.55)";
const PAGE_BG = "#f5f7fb";
const BORDER = "rgba(10,31,77,0.08)";

/** How we work — the dispositions we actually select for, not aspirations. */
const values = [
  {
    icon: Compass,
    title: "Truth Seeking",
    desc: "We would rather be right than impressive. We change our minds when the evidence says so.",
  },
  {
    icon: Target,
    title: "Impact Oriented",
    desc: "We target areas we believe are neglected relative to how much they matter.",
  },
  {
    icon: Zap,
    title: "Bias to Action",
    desc: "We run cheap experiments early and go formal where it earns its cost.",
  },
  {
    icon: MessageSquare,
    title: "Honest Collaboration",
    desc: "We give real feedback early, on the work rather than the person, and assume good faith.",
  },
];

/** The honest version of "benefits" — what the job is like, not a perks list. */
const benefits = [
  {
    icon: Users,
    title: "Ownership, not tickets",
    desc: "The core team is small and everyone shapes the agenda. You will help decide which questions are worth attacking, then run them. A lot of the job is judgement about what to do at all.",
  },
  {
    icon: BookOpen,
    title: "Your work gets seen",
    desc: "Everything we produce is published: papers, code, datasets, and policy briefings. Junior researchers coauthor what they contribute to, and you will present your own work to collaborators and at workshops.",
  },
  {
    icon: Globe,
    title: "A wide research network",
    desc: "We work with researchers across ETH Zürich, Google DeepMind, the UK AI Security Institute, and the University of Toronto, and you will too. The core team is based in Zurich, with hybrid possibility and relocation support.",
  },
];

/**
 * Hiring stages, shown publicly — candidates should be able to plan around this.
 *
 * Keep in sync with DEFAULT_PROCESS in `src/data/jobs.types.ts`, which renders
 * the same loop on every job detail page. A candidate who reads both should see
 * one process, not two.
 */
const hiringSteps = [
  {
    title: "Screening",
    desc: "A CV and a few sentences on why this problem. No cover letter, and please don't write us an essay about your passion for the mission. We read every application ourselves and reply either way.",
  },
  {
    title: "First interview",
    desc: "A short call to settle the basics: what the role actually involves, your timing and eligibility, and whether it is worth both our time to go further.",
  },
  {
    title: "In-depth research and technical interview",
    desc: "The substantive stage. You present something you have worked on, we dig into it together, and we work through a problem close to the role. We are looking for how you reason, not whether you recall the right answer.",
  },
  {
    title: "Review and offer",
    desc: "We score against criteria written before we started, then come back with a decision: a concrete salary number and a written scope for the first six months, or a clear account of where it fell short.",
  },
];

/** Faint concentric rings behind the hero — the page's only decoration. */
const HeroRings = () => (
  <svg
    className="careers-hero-rings"
    viewBox="0 0 600 600"
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="300" cy="300" r="290" fill="none" stroke={ACCENT} strokeOpacity="0.07" strokeWidth="1" />
    <circle cx="300" cy="300" r="225" fill="none" stroke={ACCENT} strokeOpacity="0.09" strokeWidth="1" />
    <circle cx="300" cy="300" r="160" fill="none" stroke={ACCENT} strokeOpacity="0.11" strokeWidth="1" />
    <circle cx="300" cy="300" r="95" fill="none" stroke={ACCENT} strokeOpacity="0.13" strokeWidth="1" />
  </svg>
);

/** Small ring that precedes every section eyebrow. */
const EyebrowMark = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
    <circle cx="7" cy="7" r="5.5" fill="none" stroke={ACCENT} strokeWidth="1.6" strokeDasharray="3 2.2" />
  </svg>
);

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <span className="careers-eyebrow">
    <EyebrowMark />
    {children}
  </span>
);

/**
 * Two-tone section heading — the leading word carries the ink weight, the rest
 * recedes. Same shape on every section so the page reads as one system.
 */
const SectionHeading = ({
  eyebrow,
  lead,
  rest,
  align = "left",
}: {
  eyebrow: string;
  lead: string;
  rest: string;
  align?: "left" | "center";
}) => (
  <div style={{ textAlign: align }}>
    <Eyebrow>{eyebrow}</Eyebrow>
    <h2 className="careers-section-title" style={{ color: INK }}>
      {lead} <span style={{ color: MUTED, fontWeight: 400 }}>{rest}</span>
    </h2>
  </div>
);

const Section = ({
  id,
  bg = "transparent",
  children,
}: {
  id?: string;
  bg?: string;
  children: React.ReactNode;
}) => (
  <section id={id} className="careers-section" style={{ background: bg }}>
    <div className="mx-auto px-6" style={{ maxWidth: "1200px" }}>
      {children}
    </div>
  </section>
);

/* ────────────────── open positions ────────────────── */

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      fontSize: "0.8rem",
      fontWeight: 500,
      color: INK,
      background: "rgba(0,51,153,0.06)",
      border: `1px solid ${BORDER}`,
      borderRadius: "999px",
      padding: "0.3rem 0.75rem",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </span>
);

/** One requisition on the board. Links to /careers/:slug for the full posting. */
const JobCard = ({ job }: { job: Job }) => (
  <Link
    to={`/careers/${job.slug}`}
    onClick={() => window.scrollTo({ top: 0 })}
    className="careers-job-card"
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "0.85rem",
      height: "100%",
      background: "#ffffff",
      border: `1px solid ${BORDER}`,
      borderRadius: "16px",
      padding: "1.75rem 1.6rem 1.5rem",
      textDecoration: "none",
      transition: "transform 0.25s, box-shadow 0.25s, border-color 0.25s",
    }}
  >
    <p className="careers-job-title" style={{ fontWeight: 600, color: INK, letterSpacing: "-0.015em", margin: 0, lineHeight: 1.25 }}>
      {job.title}
    </p>

    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", fontSize: "0.95rem", color: MUTED }}>
      <MapPin size={16} color={ACCENT} style={{ flexShrink: 0 }} /> {formatLocation(job)}
    </span>

    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
      <Chip>{job.team} Team</Chip>
      <Chip>{formatEmploymentType(job)}</Chip>
      {job.openings != null && job.openings > 1 && (
        <Chip>{job.openings} positions</Chip>
      )}
      {/* Drafts only reach here in local dev — see getBoardJobs(). */}
      {job.status === "draft" && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#8a5a00",
            background: "#fff8e1",
            border: "1px solid rgba(180,120,0,0.25)",
            borderRadius: "999px",
            padding: "0.3rem 0.7rem",
          }}
        >
          Draft
        </span>
      )}
    </div>

    <span
      style={{
        marginTop: "auto",
        paddingTop: "0.75rem",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        fontSize: "0.98rem",
        color: MUTED,
      }}
    >
      View role <ArrowRight size={17} className="careers-job-arrow" />
    </span>
  </Link>
);

/** Shown when the board has no live requisitions. */
const NoOpenPositions = () => (
  <div
    className="careers-positions-panel"
    style={{
      background: "#ffffff",
      border: `1px solid ${BORDER}`,
      borderRadius: "16px",
    }}
  >
    <div
      className="careers-positions-icon"
      style={{
        flexShrink: 0,
        borderRadius: "16px",
        background: "rgba(0,51,153,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Briefcase size={30} color={ACCENT} />
    </div>
    <div>
      <h3
        className="careers-positions-title"
        style={{
          fontWeight: 700,
          color: INK,
          margin: 0,
          marginBottom: "0.55rem",
          letterSpacing: "-0.01em",
        }}
      >
        Nothing open right now
      </h3>
      <p
        className="careers-positions-text"
        style={{
          lineHeight: 1.65,
          color: "rgba(10,31,77,0.65)",
          margin: 0,
          maxWidth: "620px",
        }}
      >
        We post roles here first, so this page is the thing to watch. In the meantime we do read speculative applications. Tell us what you have been working on and which of these problems you would want to take on.
      </p>
    </div>
  </div>
);

/* ────────────────── how we hire ────────────────── */

/**
 * One stage on the hiring timeline.
 *
 * Each stage animates on its own `whileInView` rather than on a fixed delay, so
 * the rail draws and the cards land as the reader scrolls into them — the
 * sequence is tied to reading position, not to when the section first mounts.
 * The connector between nodes scales from the top, which is why it needs its
 * own motion element instead of a static border.
 */
const HiringStep = ({
  step,
  index,
  isLast,
}: {
  step: (typeof hiringSteps)[number];
  index: number;
  isLast: boolean;
}) => {
  const reduce = useReducedMotion();
  const viewport = { once: true, margin: "-80px" } as const;

  return (
    <motion.li
      className="careers-tl-item"
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <div className="careers-tl-rail" aria-hidden>
        <motion.span
          className="careers-tl-node"
          style={{ color: ACCENT }}
          initial={reduce ? { opacity: 0 } : { scale: 0.4, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={viewport}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {index + 1}
        </motion.span>
        {!isLast && (
          <motion.span
            className="careers-tl-line"
            initial={{ scaleY: reduce ? 1 : 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={viewport}
            transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
          />
        )}
      </div>

      <div className="careers-tl-card">
        <p className="careers-tl-title" style={{ color: INK }}>
          {step.title}
        </p>
        <p className="careers-tl-desc">{step.desc}</p>
      </div>
    </motion.li>
  );
};

const HiringTimeline = () => (
  <ol className="careers-tl">
    {hiringSteps.map((step, i) => (
      <HiringStep
        key={step.title}
        step={step}
        index={i}
        isLast={i === hiringSteps.length - 1}
      />
    ))}
  </ol>
);

const ALL = "All";

/**
 * Board contents, derived from src/data/jobs.json — the empty state is a
 * consequence of having no live reqs, not hardcoded copy. Adding a role is a
 * data edit; nothing here changes.
 *
 * The team filter appears only once there is something to filter, so a
 * one-role board doesn't show a control that can't do anything.
 */
const OpenPositions = () => {
  const jobs = useMemo(() => getBoardJobs(), []);
  const teams = useMemo(
    () => [...new Set(jobs.map((j) => j.team))].sort((a, b) => a.localeCompare(b)),
    [jobs],
  );
  const [team, setTeam] = useState<string>(ALL);

  const visible = team === ALL ? jobs : jobs.filter((j) => j.team === team);

  return (
    <>
      <div className="careers-board-head">
        <AnimatedSection>
          <SectionHeading eyebrow="Join us" lead="Open" rest="positions" />
        </AnimatedSection>
        {teams.length > 1 && (
          <AnimatedSection delay={0.08}>
            <div className="careers-filters">
              {[ALL, ...teams].map((t) => {
                const active = t === team;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTeam(t)}
                    aria-pressed={active}
                    className="careers-filter"
                    style={{
                      background: active ? ACCENT : "transparent",
                      color: active ? "#ffffff" : INK,
                      borderColor: active ? ACCENT : "rgba(0,51,153,0.25)",
                    }}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </AnimatedSection>
        )}
      </div>

      {visible.length === 0 ? (
        <AnimatedSection>
          <NoOpenPositions />
        </AnimatedSection>
      ) : (
        <div className="careers-job-grid">
          {visible.map((job, i) => (
            <AnimatedSection key={job.slug} delay={Math.min(i * 0.06, 0.3)}>
              <JobCard job={job} />
            </AnimatedSection>
          ))}
        </div>
      )}
    </>
  );
};

const CareersPage = () => (
  <div style={{ background: PAGE_BG }}>
    <Helmet>
      <title>Careers — EuroSafeAI</title>
      <meta name="description" content="Work on the ways advanced AI systems fail. EuroSafeAI is a Swiss nonprofit researching multi-agent safety, evaluations, and threat assessment. Open research and engineering roles in Zurich." />
    </Helmet>

    {/* Hero */}
    <section className="careers-hero">
      <HeroRings />
      <div className="mx-auto px-6" style={{ maxWidth: "1200px", position: "relative" }}>
        <AnimatedSection>
          <div style={{ textAlign: "center" }}>
            <Eyebrow>Careers</Eyebrow>
            <h1 className="careers-hero-title" style={{ color: INK }}>
              Study the ways AI systems<br />
              <span style={{ color: ACCENT }}>go wrong.</span>
            </h1>
            <p className="careers-hero-sub" style={{ color: "rgba(10,31,77,0.65)" }}>
              EuroSafeAI is a Swiss nonprofit working on safety and security for advanced AI systems. We focus on the cases where systems act contrary to what their developers intended, and on the evaluations, threat models, and policy work that make those cases easier to catch before they matter.
            </p>
            <div className="careers-hero-actions">
              <a href="#open-positions" className="careers-btn careers-btn-primary">
                See open roles
              </a>
              <a href="#how-we-hire" className="careers-btn careers-btn-ghost">
                How we hire
              </a>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>

    {/* Open positions */}
    <Section id="open-positions">
      <OpenPositions />
    </Section>

    {/* The case for the work */}
    <Section id="why-us">
      <AnimatedSection>
        <SectionHeading eyebrow="The case" lead="Why this" rest="work" align="center" />
      </AnimatedSection>
      <div className="careers-why-grid">
        <AnimatedSection>
          <div className="careers-why-text" style={{ display: "flex", flexDirection: "column", gap: "1.15rem" }}>
            <p style={{ lineHeight: 1.7, color: "rgba(10,31,77,0.7)", margin: 0 }}>
              AI systems are being handed real authority over markets, infrastructure, and decisions that are expensive to reverse, and this is happening faster than our ability to check what they will do with it. If the systems now being built end up more capable than the people meant to oversee them, whether they stay under meaningful human control becomes one of the most consequential questions of this century. Far fewer people work on it than the stakes warrant.
            </p>
            <p style={{ lineHeight: 1.7, color: "rgba(10,31,77,0.7)", margin: 0 }}>
              That is the gap we are here to close. We study how advanced AI systems could act against the intent of the people who deploy them: a single system slipping out of control, many systems coordinating in ways nobody designed, or capable AI being misused or used to concentrate power. We build evaluations, formalise the arguments that can be formalised, run experiments where they cannot, and turn what we learn into something a regulator or a frontier lab can act on. We publish what we find, including the results that cut against what we expected.
            </p>
            <p style={{ lineHeight: 1.7, color: "rgba(10,31,77,0.7)", margin: 0 }}>
              We are honest about the uncertainty. We do not know how large these risks are, and part of the job is finding out rather than assuming. What we do know is that the cost of being wrong is enormous and the number of people checking is small. If you want a settled field with a clear research agenda handed to you, this is the wrong place. If the open questions are what draws you in, we would love to work with you.
            </p>
          </div>
        </AnimatedSection>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {benefits.map((b, i) => (
            <AnimatedSection key={b.title} delay={0.1 + i * 0.08}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div
                  style={{
                    flexShrink: 0,
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "rgba(0,51,153,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <b.icon size={24} color={ACCENT} />
                </div>
                <div>
                  <p style={{ fontSize: "1.1rem", fontWeight: 700, color: INK, margin: 0, marginBottom: "0.4rem", letterSpacing: "-0.01em" }}>{b.title}</p>
                  <p style={{ fontSize: "0.95rem", color: "rgba(10,31,77,0.65)", margin: 0, lineHeight: 1.6 }}>{b.desc}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </Section>

    {/* Values */}
    <Section>
      <AnimatedSection>
        <SectionHeading eyebrow="At our core" lead="How we" rest="work" align="center" />
      </AnimatedSection>
      <div className="careers-values-grid">
        {values.map((v, i) => (
          <AnimatedSection key={v.title} delay={i * 0.1}>
            <div
              className="careers-value-card"
              style={{
                background: "#ffffff",
                border: `1px solid ${BORDER}`,
                borderRadius: "16px",
                padding: "2rem 1.75rem",
                height: "100%",
                transition: "transform 0.25s, box-shadow 0.25s, border-color 0.25s",
              }}
            >
              <v.icon size={28} color={ACCENT} strokeWidth={1.6} style={{ marginBottom: "1.75rem" }} />
              <p style={{ fontSize: "1.05rem", fontWeight: 700, color: INK, margin: 0, marginBottom: "0.6rem", letterSpacing: "-0.01em" }}>
                {v.title}
              </p>
              <p style={{ fontSize: "1rem", lineHeight: 1.65, color: "rgba(10,31,77,0.65)", margin: 0 }}>
                {v.desc}
              </p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </Section>

    {/* How we hire */}
    <Section id="how-we-hire">
      <AnimatedSection>
        <SectionHeading eyebrow="Process" lead="How we" rest="hire" align="center" />
      </AnimatedSection>
      <AnimatedSection delay={0.06}>
        <p className="careers-hire-intro" style={{ color: "rgba(10,31,77,0.7)" }}>
          Four stages, and about three weeks from application to decision.
        </p>
      </AnimatedSection>
      <HiringTimeline />
      <AnimatedSection delay={0.1}>
        <p className="careers-hire-note" style={{ borderLeft: `2px solid ${ACCENT}`, color: "rgba(10,31,77,0.7)" }}>
          If you are unsure whether you are qualified, apply anyway.
        </p>
      </AnimatedSection>
    </Section>

    {/* CTA */}
    <section className="careers-cta" style={{ background: ACCENT }}>
      <div className="mx-auto px-6" style={{ maxWidth: "1200px", textAlign: "center" }}>
        <AnimatedSection>
          <h2
            style={{
              fontSize: "clamp(1.75rem, 4vw, 3rem)",
              fontWeight: 700,
              lineHeight: 1.12,
              color: "#ffffff",
              letterSpacing: "-0.025em",
              marginBottom: "1.25rem",
            }}
          >
            Nothing here fits?
          </h2>
          <p
            className="careers-cta-sub"
            style={{
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.82)",
              margin: "0 auto 2.5rem",
              maxWidth: "560px",
            }}
          >
            Write to us anyway. Tell us what you have been working on and which problem you would take on here. A paragraph and a link is enough. We read all of it, and we keep the good ones on file for when the next role opens.
          </p>
          <a
            href={`mailto:${CAREERS_CONTACT_EMAIL}?subject=General Application`}
            className="careers-cta-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.95rem 2rem",
              minHeight: "44px",
              background: "#ffffff",
              color: ACCENT,
              borderRadius: "999px",
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "background 0.2s, transform 0.15s",
            }}
          >
            Get in touch <span aria-hidden>›</span>
          </a>
        </AnimatedSection>
      </div>
    </section>

    <style>{`
      .careers-eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 0.55rem;
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: rgba(10,31,77,0.6);
        margin-bottom: 0.85rem;
      }

      .careers-hero {
        position: relative;
        overflow: hidden;
        padding: clamp(4.5rem, 9vw, 7.5rem) 0 clamp(3rem, 6vw, 4.5rem);
      }
      .careers-hero-rings {
        position: absolute;
        top: -30%;
        left: 50%;
        transform: translateX(-50%);
        width: min(1100px, 130vw);
        height: auto;
        pointer-events: none;
      }
      .careers-hero-title {
        font-size: clamp(2.5rem, 6.5vw, 4.75rem);
        font-weight: 700;
        line-height: 1.06;
        letter-spacing: -0.03em;
        margin: 0 0 1.25rem;
      }
      .careers-hero-sub {
        font-size: clamp(1.0625rem, 1.4vw, 1.25rem);
        line-height: 1.55;
        margin: 0 auto;
        max-width: 720px;
      }
      .careers-hero-actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.85rem;
        margin-top: 2.25rem;
      }
      .careers-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 48px;
        padding: 0.85rem 1.9rem;
        border-radius: 999px;
        font-size: 1rem;
        font-weight: 600;
        text-decoration: none;
        border: 1px solid transparent;
        transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.15s;
      }
      .careers-btn-primary { background: ${ACCENT}; color: #ffffff; }
      .careers-btn-primary:hover { background: #002b80; transform: translateY(-1px); }
      .careers-btn-ghost { background: #ffffff; color: ${INK}; border-color: ${BORDER}; }
      .careers-btn-ghost:hover { border-color: rgba(0,51,153,0.35); transform: translateY(-1px); }

      .careers-section { padding: clamp(2.75rem, 6vw, 4.5rem) 0; }
      .careers-section-title {
        font-size: clamp(1.75rem, 3.4vw, 2.75rem);
        font-weight: 700;
        letter-spacing: -0.025em;
        margin: 0;
      }

      .careers-board-head {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 1.25rem;
        margin-bottom: 2rem;
      }
      .careers-filters { display: flex; flex-wrap: wrap; gap: 0.6rem; }
      .careers-filter {
        min-height: 40px;
        padding: 0.5rem 1.15rem;
        border-radius: 999px;
        border: 1px solid;
        font-size: 0.95rem;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s, color 0.2s, border-color 0.2s;
      }

      .careers-job-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1.5rem;
      }
      .careers-job-grid > * { height: 100%; }
      .careers-job-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 18px 34px -22px rgba(10,31,77,0.35);
        border-color: rgba(0,51,153,0.25);
      }
      .careers-job-card:hover .careers-job-arrow { transform: translateX(3px); }
      .careers-job-arrow { flex-shrink: 0; transition: transform 0.25s; }
      .careers-job-title { font-size: 1.3rem; }

      .careers-why-grid {
        display: grid;
        grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
        gap: 4rem;
        align-items: start;
        margin-top: 2.25rem;
      }
      .careers-why-text { font-size: clamp(1rem, 1.2vw, 1.05rem); }

      /* Four values, so two columns keeps them in a square block rather than
         leaving one card stranded on a second row. The max-width stops the
         square stretching into two wide bands at full page width. */
      .careers-values-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1.5rem;
        margin: 2.25rem auto 0;
        max-width: 820px;
      }
      .careers-value-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 18px 34px -22px rgba(10,31,77,0.35);
        border-color: rgba(0,51,153,0.25);
      }

      .careers-hire-intro {
        font-size: clamp(1rem, 1.2vw, 1.05rem);
        line-height: 1.7;
        margin: 1.75rem auto 0;
        max-width: 680px;
        text-align: center;
      }
      /* Hiring timeline — numbered rail on the left, one card per stage. */
      .careers-tl {
        list-style: none;
        margin: 2.5rem auto 0;
        padding: 0;
        max-width: 820px;
      }
      .careers-tl-item {
        display: grid;
        grid-template-columns: 40px minmax(0, 1fr);
        gap: 1.5rem;
        align-items: start;
      }
      /* Spacing lives on the card, not the row, so the rail stretches the whole
         way down and the connector meets the next node instead of stopping short. */
      .careers-tl-item:not(:last-child) .careers-tl-card { margin-bottom: 1.25rem; }
      .careers-tl-rail {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        align-self: stretch;
      }
      .careers-tl-node {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: 40px;
        height: 40px;
        border-radius: 999px;
        border: 1px solid rgba(0,51,153,0.25);
        background: #ffffff;
        box-shadow: 0 0 0 5px ${PAGE_BG};
        font-size: 0.9rem;
        font-weight: 700;
        font-variant-numeric: tabular-nums;
        z-index: 1;
      }
      /* Connector between nodes; scales from the top as the stage appears. */
      .careers-tl-line {
        flex: 1;
        width: 2px;
        margin-top: -2px;
        border-radius: 2px;
        background: linear-gradient(
          to bottom,
          rgba(0,51,153,0.28),
          rgba(0,51,153,0.10)
        );
        transform-origin: top;
      }
      .careers-tl-card {
        background: #ffffff;
        border: 1px solid ${BORDER};
        border-radius: 16px;
        padding: 1.35rem 1.5rem 1.45rem;
        transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
      }
      .careers-tl-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 18px 34px -24px rgba(10,31,77,0.35);
        border-color: rgba(0,51,153,0.22);
      }
      .careers-tl-title {
        font-size: 1.1rem;
        font-weight: 700;
        letter-spacing: -0.01em;
        margin: 0;
      }
      .careers-tl-desc {
        font-size: 0.98rem;
        line-height: 1.65;
        color: rgba(10,31,77,0.65);
        margin: 0.55rem 0 0;
      }
      .careers-hire-note {
        font-size: 1rem;
        line-height: 1.7;
        margin: 2.5rem auto 0;
        max-width: 720px;
        padding-left: 1.25rem;
      }

      .careers-positions-panel {
        padding: 3rem 2.5rem;
        display: flex;
        gap: 2rem;
        align-items: center;
      }
      .careers-positions-icon { width: 64px; height: 64px; }
      .careers-positions-title { font-size: 1.35rem; }
      .careers-positions-text { font-size: 1rem; }

      .careers-cta { padding: clamp(3.5rem, 7vw, 6rem) 0 clamp(4rem, 8vw, 7rem); }
      .careers-cta-sub { font-size: clamp(1rem, 1.2vw, 1.05rem); }
      .careers-cta-btn:hover { background: #e8eef8; transform: translateY(-1px); }

      @media (max-width: 1024px) {
        .careers-job-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      }

      @media (max-width: 760px) {
        .careers-job-grid { grid-template-columns: 1fr; }
        .careers-values-grid { grid-template-columns: 1fr; }
        .careers-why-grid { grid-template-columns: 1fr; gap: 2rem; }
        .careers-board-head { align-items: flex-start; }
        .careers-btn { width: 100%; }
        .careers-hero-rings { top: -12%; width: 180vw; }
        .careers-positions-panel {
          flex-direction: column;
          align-items: flex-start;
          gap: 1.25rem;
          padding: 2rem 1.5rem;
        }
        .careers-positions-icon { width: 52px; height: 52px; }
        .careers-positions-title { font-size: 1.2rem; }
        .careers-positions-text { font-size: 0.98rem; }
        .careers-job-title { font-size: 1.15rem; }
        .careers-tl-item { grid-template-columns: 34px minmax(0, 1fr); gap: 1rem; }
        .careers-tl-item:not(:last-child) .careers-tl-card { margin-bottom: 1rem; }
        .careers-tl-node { width: 34px; height: 34px; font-size: 0.85rem; box-shadow: 0 0 0 4px ${PAGE_BG}; }
        .careers-tl-title { font-size: 1.02rem; }
        .careers-tl-card { padding: 1.15rem 1.15rem 1.25rem; }
        .careers-hire-note { padding-left: 1rem; font-size: 0.98rem; }
      }
    `}</style>
  </div>
);

export default CareersPage;
