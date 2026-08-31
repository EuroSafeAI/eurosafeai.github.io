import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Banknote,
  Briefcase,
  Clock,
  MapPin,
  UserPlus,
  Users,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { CAREERS_CONTACT_EMAIL } from "@/data/jobs.types";
import {
  buildJobPostingJsonLd,
  formatCompensation,
  formatEmploymentType,
  formatLocation,
  formatPostedDate,
  getApplyHref,
  getContactEmail,
  getJobBySlug,
  getJobUrl,
  getProcess,
  isMailtoApply,
  parseBodyText,
} from "@/lib/jobs";

/* Tokens mirrored from CareersPage so the two pages read as one surface. */
const ACCENT = "#003399";
const INK = "#0a1f4d";
const PANEL_BG = "#f5f7fb";
const BORDER = "rgba(10,31,77,0.08)";
const MUTED = "rgba(10,31,77,0.65)";

const toTop = () => window.scrollTo({ top: 0 });

const BackLink = () => (
  <Link
    to="/careers"
    onClick={toTop}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "0.4rem",
      fontSize: "0.85rem",
      color: MUTED,
      textDecoration: "none",
      marginBottom: "2rem",
    }}
  >
    <ArrowLeft size={16} /> Back to Careers
  </Link>
);

/** Icon + label row used in the "At a glance" sidebar. */
const MetaRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) => (
  <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
    <Icon size={17} color={ACCENT} style={{ flexShrink: 0, marginTop: "0.15rem" }} />
    <div>
      <p
        style={{
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "rgba(10,31,77,0.45)",
          margin: 0,
          marginBottom: "0.2rem",
        }}
      >
        {label}
      </p>
      <p style={{ fontSize: "0.92rem", color: INK, margin: 0, lineHeight: 1.45 }}>
        {value}
      </p>
    </div>
  </div>
);

const BulletList = ({ items }: { items: string[] }) => (
  <ul className="job-bullets">
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

/** One paragraph of body copy, with any inline links resolved to anchors. */
const Para = ({ text, style }: { text: string; style?: React.CSSProperties }) => (
  <p className="job-para" style={style}>
    {parseBodyText(text).map((seg, i) =>
      seg.href ? (
        <a
          key={i}
          href={seg.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: ACCENT }}
        >
          {seg.text}
        </a>
      ) : (
        <span key={i}>{seg.text}</span>
      ),
    )}
  </p>
);

const Block = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <AnimatedSection>
    <section style={{ marginBottom: "2.75rem" }}>
      <h2
        style={{
          fontSize: "1.25rem",
          fontWeight: 700,
          color: INK,
          letterSpacing: "-0.01em",
          margin: 0,
          marginBottom: "1rem",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  </AnimatedSection>
);

const ApplyButton = ({ href, label }: { href: string; label: string }) => (
  <a
    href={href}
    className="job-apply-btn"
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      padding: "0.9rem 1.9rem",
      minHeight: "44px",
      background: ACCENT,
      color: "#ffffff",
      borderRadius: "999px",
      fontSize: "0.78rem",
      fontWeight: 700,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      textDecoration: "none",
      transition: "background 0.2s, transform 0.15s",
    }}
  >
    {label} <span aria-hidden>›</span>
  </a>
);

const CareersJobPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const job = slug ? getJobBySlug(slug) : undefined;

  if (!job) {
    return (
      <div style={{ padding: "10rem 1.5rem 6rem", textAlign: "center" }}>
        <Helmet>
          <title>Role not found — EuroSafeAI</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: INK }}>
          Role not found
        </h1>
        <p style={{ color: MUTED, marginTop: "0.75rem" }}>
          This posting may have closed. See what else is open.
        </p>
        <Link
          to="/careers"
          onClick={toTop}
          style={{ marginTop: "1rem", display: "inline-block", color: ACCENT }}
        >
          ← Back to Careers
        </Link>
      </div>
    );
  }

  const isClosed = job.status === "closed";
  const isDraft = job.status === "draft";
  const compensation = formatCompensation(job);
  const process = getProcess(job);
  const applyHref = getApplyHref(job);

  return (
    <div>
      <Helmet>
        <title>{`${job.title} — Careers at EuroSafeAI`}</title>
        <meta name="description" content={job.summary} />
        <link rel="canonical" href={getJobUrl(job)} />
        {/* Structured data only for live reqs — Google penalises JobPosting
            markup left on expired postings, and drafts aren't public at all. */}
        {job.status === "open" ? (
          <script type="application/ld+json">
            {JSON.stringify(buildJobPostingJsonLd(job))}
          </script>
        ) : (
          <meta name="robots" content="noindex" />
        )}
      </Helmet>

      {/* ─── Header ─── */}
      <section className="job-header" style={{ background: "#ffffff" }}>
        <div className="mx-auto px-6" style={{ maxWidth: "1100px" }}>
          <AnimatedSection>
            <BackLink />
          </AnimatedSection>

          {isDraft && (
            <AnimatedSection>
              <div
                className="job-banner"
                style={{ background: "#fff8e1", borderColor: "rgba(180,120,0,0.25)" }}
              >
                <strong>Draft, not published.</strong> Visible in local
                development only. Set <code>"status": "open"</code> in{" "}
                <code>src/data/jobs.json</code> to publish.
              </div>
            </AnimatedSection>
          )}

          {isClosed && (
            <AnimatedSection>
              <div
                className="job-banner"
                style={{ background: PANEL_BG, borderColor: BORDER }}
              >
                <strong>This role is closed.</strong> We're no longer accepting
                applications, but you're welcome to{" "}
                <a href={`mailto:${CAREERS_CONTACT_EMAIL}`} style={{ color: ACCENT }}>
                  introduce yourself
                </a>
                .
              </div>
            </AnimatedSection>
          )}

          <AnimatedSection delay={0.05}>
            <p
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: ACCENT,
                margin: 0,
                marginBottom: "0.85rem",
              }}
            >
              {job.team}
            </p>
            <h1
              style={{
                fontSize: "clamp(2rem, 4.5vw, 3.4rem)",
                fontWeight: 800,
                lineHeight: 1.06,
                color: INK,
                letterSpacing: "-0.03em",
                margin: 0,
                marginBottom: "1.1rem",
                maxWidth: "820px",
              }}
            >
              {job.title}
            </h1>
            <p
              style={{
                fontSize: "clamp(1.0625rem, 1.3vw, 1.15rem)",
                lineHeight: 1.6,
                color: "rgba(10,31,77,0.72)",
                margin: 0,
                marginBottom: "2rem",
                maxWidth: "660px",
              }}
            >
              {job.summary}
            </p>
            {!isClosed && (
              <ApplyButton
                href={applyHref}
                label={isDraft ? "Apply (preview)" : "Apply for this role"}
              />
            )}
          </AnimatedSection>
        </div>
      </section>

      {/* ─── Body + sidebar ─── */}
      <section className="job-body" style={{ background: "#ffffff" }}>
        <div className="mx-auto px-6" style={{ maxWidth: "1100px" }}>
          <div className="job-grid">
            <div>
              <Block title={job.descriptionHeading ?? "About the role"}>
                {job.description.map((para) => (
                  <Para key={para} text={para} />
                ))}
              </Block>

              <Block title="What you'll do">
                <BulletList items={job.responsibilities} />
              </Block>

              <Block title="What we're looking for">
                <BulletList items={job.requirements} />
              </Block>

              {job.niceToHave && job.niceToHave.length > 0 && (
                <Block title="Nice to have">
                  <BulletList items={job.niceToHave} />
                  <Para
                    text={
                      job.niceToHaveNote ??
                      "None of these are required. Apply if the role fits you, even if you don't tick every box."
                    }
                    style={{ marginTop: "1rem" }}
                  />
                </Block>
              )}

              {job.aboutUs && job.aboutUs.length > 0 && (
                <Block title="About us">
                  {job.aboutUs.map((para) => (
                    <Para key={para} text={para} />
                  ))}
                </Block>
              )}

              {job.practicalities && job.practicalities.length > 0 && (
                <Block title="Practicalities">
                  {job.practicalities.map((para) => (
                    <Para key={para} text={para} />
                  ))}
                </Block>
              )}

              {job.closingNote && (
                <AnimatedSection>
                  <Para
                    text={job.closingNote}
                    style={{ marginBottom: "2.75rem", fontWeight: 600, color: INK }}
                  />
                </AnimatedSection>
              )}
            </div>

            {/* Sidebar */}
            <aside>
              <AnimatedSection delay={0.05}>
                <div
                  className="job-card"
                  style={{ background: PANEL_BG, border: `1px solid ${BORDER}` }}
                >
                  <p className="job-card-title" style={{ color: INK }}>
                    At a glance
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.15rem" }}>
                    <MetaRow icon={MapPin} label="Location" value={formatLocation(job)} />
                    <MetaRow
                      icon={Briefcase}
                      label="Employment"
                      value={formatEmploymentType(job)}
                    />
                    <MetaRow icon={Users} label="Team" value={job.team} />
                    {job.openings != null && job.openings > 1 && (
                      <MetaRow
                        icon={UserPlus}
                        label="Openings"
                        value={`${job.openings} positions`}
                      />
                    )}
                    {compensation && (
                      <MetaRow icon={Banknote} label="Compensation" value={compensation} />
                    )}
                    <MetaRow icon={Clock} label="Posted" value={formatPostedDate(job)} />
                  </div>
                  {job.compensation?.note && (
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: MUTED,
                        lineHeight: 1.55,
                        margin: 0,
                        marginTop: "1.25rem",
                        paddingTop: "1.25rem",
                        borderTop: `1px solid ${BORDER}`,
                      }}
                    >
                      {job.compensation.note}
                    </p>
                  )}
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.1}>
                <div
                  className="job-card"
                  style={{
                    background: "#ffffff",
                    border: `1px solid ${BORDER}`,
                    marginTop: "1.25rem",
                  }}
                >
                  <p className="job-card-title" style={{ color: INK }}>
                    Questions
                  </p>
                  <p style={{ fontSize: "0.9rem", color: MUTED, lineHeight: 1.6, margin: 0 }}>
                    Ask us anything before applying at{" "}
                    <a href={`mailto:${getContactEmail(job)}`} style={{ color: ACCENT }}>
                      {getContactEmail(job)}
                    </a>
                    . A real person answers.
                  </p>
                </div>
              </AnimatedSection>
            </aside>
          </div>
        </div>
      </section>

      {/* ─── Hiring process ─── */}
      <section className="job-process" style={{ background: PANEL_BG }}>
        <div className="mx-auto px-6" style={{ maxWidth: "1100px" }}>
          <AnimatedSection>
            <h2
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                fontWeight: 700,
                color: INK,
                letterSpacing: "-0.015em",
                margin: 0,
                marginBottom: "0.75rem",
              }}
            >
              How we hire
            </h2>
            <p
              style={{
                fontSize: "1rem",
                color: MUTED,
                lineHeight: 1.65,
                margin: 0,
                marginBottom: "2.25rem",
                maxWidth: "620px",
              }}
            >
              The whole process, up front. Every stage is scored against written
              criteria we agree on before we start.
            </p>
          </AnimatedSection>

          <ol className="job-steps">
            {process.map((stage, i) => (
              <AnimatedSection key={stage.name} delay={Math.min(i * 0.05, 0.3)}>
                <li>
                  <span className="job-step-num" aria-hidden>
                    {i + 1}
                  </span>
                  <div>
                    <p className="job-step-name" style={{ color: INK }}>
                      {stage.name}
                    </p>
                    <p className="job-step-desc">{stage.description}</p>
                  </div>
                </li>
              </AnimatedSection>
            ))}
          </ol>
        </div>
      </section>

      {/* ─── Apply CTA ─── */}
      {!isClosed && (
        <section className="job-cta" style={{ background: ACCENT }}>
          <div className="mx-auto px-6" style={{ maxWidth: "1100px" }}>
            <AnimatedSection>
              <h2
                style={{
                  fontSize: "clamp(1.6rem, 3.6vw, 2.6rem)",
                  fontWeight: 800,
                  lineHeight: 1.14,
                  color: "#ffffff",
                  letterSpacing: "-0.025em",
                  margin: 0,
                  marginBottom: "1rem",
                  maxWidth: "680px",
                }}
              >
                Apply for {job.title}
              </h2>
              <p
                style={{
                  fontSize: "1rem",
                  lineHeight: 1.65,
                  color: "rgba(255,255,255,0.82)",
                  margin: 0,
                  marginBottom: "2rem",
                  maxWidth: "560px",
                }}
              >
                {isMailtoApply(job)
                  ? `Send your CV and a brief note showing your interest to ${getContactEmail(job)}. No cover letter needed.`
                  : "The form takes about ten minutes. A CV and a brief note showing your interest is all we need."}
              </p>
              <a
                href={applyHref}
                className="job-cta-btn"
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
                Apply now <span aria-hidden>›</span>
              </a>
            </AnimatedSection>
          </div>
        </section>
      )}

      <style>{`
        .job-header { padding: clamp(6rem, 9vw, 8rem) 0 clamp(2rem, 4vw, 3rem); }
        .job-body { padding: 0 0 clamp(2.5rem, 5vw, 4rem); }
        .job-process { padding: clamp(3rem, 6vw, 5rem) 0; }
        .job-cta { padding: clamp(3.5rem, 7vw, 5.5rem) 0 clamp(4rem, 8vw, 6rem); }

        .job-banner {
          border: 1px solid;
          border-radius: 12px;
          padding: 1rem 1.25rem;
          margin-bottom: 2rem;
          font-size: 0.92rem;
          line-height: 1.6;
          color: ${INK};
        }
        .job-banner code {
          font-size: 0.85em;
          background: rgba(10,31,77,0.06);
          padding: 0.1rem 0.35rem;
          border-radius: 4px;
        }

        .job-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 320px);
          gap: 3.5rem;
          align-items: start;
        }

        .job-para {
          font-size: 1rem;
          line-height: 1.75;
          color: ${MUTED};
          margin: 0 0 1rem;
        }
        .job-para:last-child { margin-bottom: 0; }

        .job-bullets { margin: 0; padding: 0; list-style: none; }
        .job-bullets li {
          position: relative;
          padding-left: 1.4rem;
          margin-bottom: 0.7rem;
          font-size: 1rem;
          line-height: 1.7;
          color: ${MUTED};
        }
        .job-bullets li:last-child { margin-bottom: 0; }
        .job-bullets li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0.65em;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${ACCENT};
          opacity: 0.5;
        }

        .job-card { border-radius: 14px; padding: 1.6rem 1.5rem; }
        .job-card-title {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin: 0 0 1.25rem;
        }

        .job-steps {
          margin: 0;
          padding: 0;
          list-style: none;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1.5rem 2.5rem;
        }
        .job-steps li {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }
        .job-step-num {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          border-radius: 999px;
          background: rgba(0,51,153,0.1);
          color: ${ACCENT};
          font-size: 0.85rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .job-step-name {
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          margin: 0 0 0.3rem;
        }
        .job-step-desc {
          font-size: 0.92rem;
          line-height: 1.6;
          color: ${MUTED};
          margin: 0;
        }

        .job-apply-btn:hover { background: #002a80; transform: translateY(-1px); }
        .job-cta-btn:hover { background: #e8eef8; transform: translateY(-1px); }

        @media (max-width: 900px) {
          .job-grid { grid-template-columns: 1fr; gap: 2.5rem; }
          .job-steps { grid-template-columns: 1fr; gap: 1.25rem; }
        }
      `}</style>
    </div>
  );
};

export default CareersJobPage;
