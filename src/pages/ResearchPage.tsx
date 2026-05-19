import { Fragment, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import { papers, type Category, type Paper } from "@/lib/papers";
import { findMemberByAuthorName } from "@/lib/team";
import { ExternalLink } from "lucide-react";

const ACCENT = "#003399";
const INK = "#0a1f4d";
const PANEL_BG = "#f5f7fb";
const TAG_BG = "rgba(0,51,153,0.10)";
const BORDER = "rgba(10,31,77,0.08)";

const CATEGORY_LABEL: Record<Category, string> = {
  "multi-agent-safety": "Multi-Agent Safety",
  "democracy-defense": "Democracy Defense",
  safety: "Frontier AI Safety",
};

type FilterKey = "all" | Category;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "multi-agent-safety", label: "Multi-Agent Safety" },
  { key: "democracy-defense", label: "Democracy Defense" },
  { key: "safety", label: "Frontier AI Safety" },
];

const media = [
  { outlet: "WIRED", year: "2025", title: "AI Social Media Users Are Not Always a Totally Dumb Idea", link: "https://www.wired.com/story/ai-social-media-users-are-not-always-a-totally-dumb-idea/" },
  { outlet: "AXRP Podcast", year: "2024", title: "Zhijing Jin on LLMs, Causality, and Multi-Agent Systems", link: "https://www.youtube.com/watch?v=4K-lHz2_QGg" },
  { outlet: "The AI Purity Podcast", year: "2024", title: "Zhijing Jin on Socially Responsible NLP", link: "https://www.youtube.com/watch?v=SOhhxniom_w" },
];

const AuthorList = ({ authors }: { authors: string[] }) => (
  <>
    {authors.map((author, i) => {
      const member = findMemberByAuthorName(author);
      return (
        <Fragment key={`${author}-${i}`}>
          {i > 0 && ", "}
          {member ? (
            <Link
              to={`/team/${member.slug}`}
              onClick={() => window.scrollTo({ top: 0 })}
              style={{
                color: ACCENT,
                textDecoration: "none",
                fontWeight: 600,
                borderBottom: "1px solid rgba(0,51,153,0.25)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderBottomColor = ACCENT;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderBottomColor = "rgba(0,51,153,0.25)";
              }}
            >
              {author}
            </Link>
          ) : (
            author
          )}
        </Fragment>
      );
    })}
  </>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      display: "inline-block",
      fontSize: "0.7rem",
      fontWeight: 700,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: ACCENT,
      background: TAG_BG,
      border: `1px solid rgba(0,51,153,0.18)`,
      padding: "0.4rem 0.85rem",
      borderRadius: "999px",
    }}
  >
    {children}
  </span>
);

const CategoryTag = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      display: "inline-block",
      fontSize: "0.65rem",
      fontWeight: 700,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: ACCENT,
      background: TAG_BG,
      padding: "0.25rem 0.65rem",
      borderRadius: "4px",
    }}
  >
    {children}
  </span>
);

const HighlightedPaperCard = ({ paper }: { paper: Paper }) => {
  const href = paper.paperUrl;
  const blogHref = paper.blogSlug ? `/blog/${paper.blogSlug}` : null;

  return (
    <div
      style={{
        background: "#ffffff",
        border: `1px solid ${BORDER}`,
        borderRadius: "14px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        boxShadow: "0 1px 2px rgba(10,31,77,0.04)",
        transition: "transform 0.25s, box-shadow 0.25s, border-color 0.25s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 18px 38px -20px rgba(10,31,77,0.32)";
        e.currentTarget.style.borderColor = "rgba(0,51,153,0.25)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 1px 2px rgba(10,31,77,0.04)";
        e.currentTarget.style.borderColor = BORDER;
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          height: "6px",
          width: "100%",
          background: `linear-gradient(90deg, ${INK} 0%, ${ACCENT} 100%)`,
        }}
      />

      <div
        style={{
          padding: "clamp(1.1rem, 4.5vw, 2rem) clamp(1.1rem, 4.5vw, 2rem) clamp(1rem, 4vw, 1.75rem)",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            marginBottom: "1.1rem",
            alignItems: "center",
          }}
        >
          {paper.categories.map((c) => (
            <CategoryTag key={c}>{CATEGORY_LABEL[c]}</CategoryTag>
          ))}
          {paper.venue && (
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "rgba(10,31,77,0.55)",
                background: "rgba(10,31,77,0.05)",
                padding: "0.25rem 0.65rem",
                borderRadius: "999px",
              }}
            >
              {paper.venue}
            </span>
          )}
        </div>

        <h3
          style={{
            fontSize: "1.45rem",
            fontWeight: 700,
            color: INK,
            lineHeight: 1.25,
            letterSpacing: "-0.015em",
            margin: 0,
            marginBottom: "0.85rem",
          }}
        >
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: INK, textDecoration: "none" }}
            >
              {paper.title}
            </a>
          ) : blogHref ? (
            <Link
              to={blogHref}
              onClick={() => window.scrollTo({ top: 0 })}
              style={{ color: INK, textDecoration: "none" }}
            >
              {paper.title}
            </Link>
          ) : (
            paper.title
          )}
        </h3>

        <p
          style={{
            fontSize: "0.95rem",
            lineHeight: 1.65,
            color: "rgba(10,31,77,0.72)",
            margin: 0,
            marginBottom: "1.25rem",
            flex: 1,
          }}
        >
          {paper.summary}
        </p>

        {paper.authors.length > 0 && (
          <p
            style={{
              fontSize: "0.75rem",
              color: "rgba(10,31,77,0.5)",
              margin: 0,
              marginBottom: "1.25rem",
              lineHeight: 1.5,
            }}
          >
            <AuthorList authors={paper.authors} />
          </p>
        )}

        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          {href && (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "#ffffff",
                background: ACCENT,
                border: `1px solid ${ACCENT}`,
                padding: "0.6rem 1.1rem",
                borderRadius: "8px",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = INK)}
              onMouseLeave={(e) => (e.currentTarget.style.background = ACCENT)}
            >
              <ExternalLink size={14} /> Paper
            </a>
          )}
          {blogHref && (
            <Link
              to={blogHref}
              onClick={() => window.scrollTo({ top: 0 })}
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: ACCENT,
                background: "transparent",
                border: `1px solid ${ACCENT}`,
                padding: "0.6rem 1.1rem",
                borderRadius: "8px",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,51,153,0.08)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              Blog post →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

const PaperCard = ({ paper }: { paper: Paper }) => {
  const href = paper.paperUrl;
  const blogHref = paper.blogSlug ? `/blog/${paper.blogSlug}` : null;

  const titleNode = href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: INK, textDecoration: "none" }}
    >
      {paper.title}
    </a>
  ) : blogHref ? (
    <Link
      to={blogHref}
      onClick={() => window.scrollTo({ top: 0 })}
      style={{ color: INK, textDecoration: "none" }}
    >
      {paper.title}
    </Link>
  ) : (
    paper.title
  );

  return (
    <div
      style={{
        background: "#ffffff",
        border: `1px solid ${BORDER}`,
        borderRadius: "10px",
        padding: "1.6rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "transform 0.25s, box-shadow 0.25s, border-color 0.25s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 14px 30px -18px rgba(10,31,77,0.25)";
        e.currentTarget.style.borderColor = "rgba(0,51,153,0.25)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = BORDER;
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.4rem",
          marginBottom: "0.9rem",
          alignItems: "center",
        }}
      >
        {paper.categories.map((c) => (
          <CategoryTag key={c}>{CATEGORY_LABEL[c]}</CategoryTag>
        ))}
        {paper.venue && (
          <span
            style={{
              fontSize: "0.68rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(10,31,77,0.5)",
            }}
          >
            {paper.venue}
          </span>
        )}
      </div>
      <h3
        style={{
          fontSize: "1.1rem",
          fontWeight: 600,
          color: INK,
          lineHeight: 1.3,
          letterSpacing: "-0.01em",
          margin: 0,
          marginBottom: "0.75rem",
        }}
      >
        {titleNode}
      </h3>
      <p
        style={{
          fontSize: "0.9rem",
          lineHeight: 1.6,
          color: "rgba(10,31,77,0.7)",
          margin: 0,
          marginBottom: "0.95rem",
          flex: 1,
          display: "-webkit-box",
          WebkitLineClamp: 5,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {paper.summary}
      </p>
      {paper.authors.length > 0 && (
        <p
          style={{
            fontSize: "0.72rem",
            color: "rgba(10,31,77,0.5)",
            margin: 0,
            marginBottom: "0.95rem",
            lineHeight: 1.45,
          }}
        >
          <AuthorList authors={paper.authors} />
        </p>
      )}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={chipPrimary}
          >
            Read paper <ExternalLink size={12} />
          </a>
        )}
        {blogHref && (
          <Link
            to={blogHref}
            onClick={() => window.scrollTo({ top: 0 })}
            style={chipSecondary}
          >
            Blog post →
          </Link>
        )}
      </div>
    </div>
  );
};

const ResearchPage = () => {
  const [filter, setFilter] = useState<FilterKey>("all");

  const highlighted = useMemo(() => papers.filter((p) => p.highlight), []);

  const filtered = useMemo(() => {
    if (filter === "all") return papers;
    return papers.filter((p) => p.categories.includes(filter as Category));
  }, [filter]);

  return (
    <div style={{ background: "#ffffff" }}>
      <Helmet>
        <title>Research — EuroSafeAI</title>
        <meta name="description" content="Explore EuroSafeAI's peer-reviewed research on multi-agent safety, democracy defense, and frontier AI safety." />
      </Helmet>
      {/* Hero */}
      <section style={{ padding: "7rem 0 2.5rem" }}>
        <div className="mx-auto px-6" style={{ maxWidth: "1200px" }}>
          <AnimatedSection>
            <div
              style={{
                position: "relative",
                background: `linear-gradient(135deg, ${INK} 0%, ${ACCENT} 65%, #1e4dbf 100%)`,
                borderRadius: "20px",
                padding: "4.5rem 3.5rem",
                overflow: "hidden",
                boxShadow: "0 30px 60px -30px rgba(0,51,153,0.45)",
              }}
            >
              {/* radial accent */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  top: "-120px",
                  right: "-120px",
                  width: "420px",
                  height: "420px",
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 70%)",
                  pointerEvents: "none",
                }}
              />

              <div
                style={{
                  position: "relative",
                  maxWidth: "920px",
                  marginLeft: "auto",
                  marginRight: "auto",
                  textAlign: "center",
                }}
              >
                <h1
                  style={{
                    fontSize: "clamp(2.1rem, 6.5vw, 5.4rem)",
                    fontWeight: 800,
                    lineHeight: 1.02,
                    color: "#ffffff",
                    letterSpacing: "-0.03em",
                    margin: 0,
                    marginBottom: "1.4rem",
                  }}
                >
                  Our Research
                </h1>
                <p
                  style={{
                    fontSize: "1.2rem",
                    lineHeight: 1.55,
                    color: "rgba(255,255,255,0.88)",
                    margin: "0 auto",
                    maxWidth: "780px",
                  }}
                >
                  Our technical research focuses on developing methods to ensure
                  that AI systems act safely and cooperatively, even in
                  multi-agent settings and under adversarial conditions.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Highlighted Research */}
      <section style={{ padding: "1.25rem 0 2.5rem" }}>
        <div className="mx-auto px-6" style={{ maxWidth: "1200px" }}>
          <AnimatedSection>
            <div
              style={{
                position: "relative",
                background: PANEL_BG,
                border: `1px solid ${BORDER}`,
                borderRadius: "18px",
                padding: "1.75rem 1.75rem 2.25rem",
              }}
            >
              <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
                <SectionLabel>Highlighted Research</SectionLabel>
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "1.5rem",
                }}
              >
                {highlighted.map((paper) => (
                  <div
                    key={paper.slug}
                    style={{ flex: "1 1 360px", maxWidth: "520px" }}
                  >
                    <HighlightedPaperCard paper={paper} />
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* All Papers + filter */}
      <section style={{ padding: "1.25rem 0 5rem" }}>
        <div className="mx-auto px-6" style={{ maxWidth: "1200px" }}>
          <AnimatedSection>
            <div
              style={{
                background: PANEL_BG,
                border: `1px solid ${BORDER}`,
                borderRadius: "18px",
                padding: "1.75rem 1.75rem 2.5rem",
              }}
            >
              <div style={{ marginBottom: "1.25rem", textAlign: "center" }}>
                <SectionLabel>All Papers</SectionLabel>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  paddingBottom: "1.25rem",
                  borderBottom: `1px solid ${BORDER}`,
                  marginBottom: "1.5rem",
                }}
              >
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "rgba(10,31,77,0.55)",
                    marginRight: "0.4rem",
                  }}
                >
                  Filter
                </span>
                {FILTERS.map((f) => {
                  const active = filter === f.key;
                  return (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => setFilter(f.key)}
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: active ? "#ffffff" : ACCENT,
                        background: active ? ACCENT : TAG_BG,
                        border: `1px solid ${active ? ACCENT : "rgba(0,51,153,0.18)"}`,
                        padding: "0.4rem 0.85rem",
                        borderRadius: "999px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "1.25rem",
                }}
              >
                {filtered.map((paper) => (
                  <div
                    key={paper.slug}
                    style={{ flex: "1 1 300px", maxWidth: "380px" }}
                  >
                    <PaperCard paper={paper} />
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Media Coverage */}
      <section style={{ padding: "0 0 6rem" }}>
        <div className="mx-auto px-6" style={{ maxWidth: "1200px" }}>
          <AnimatedSection>
            <div
              style={{
                background: PANEL_BG,
                border: `1px solid ${BORDER}`,
                borderRadius: "18px",
                padding: "1.75rem 1.75rem 2.25rem",
              }}
            >
              <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
                <SectionLabel>Media Coverage</SectionLabel>
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "1.25rem",
                }}
              >
                {media.map((m) => (
                  <a
                    key={m.title}
                    href={m.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: "#ffffff",
                      border: `1px solid ${BORDER}`,
                      borderRadius: "10px",
                      padding: "1.4rem 1.4rem",
                      textDecoration: "none",
                      display: "flex",
                      flexDirection: "column",
                      flex: "1 1 260px",
                      maxWidth: "340px",
                      transition: "transform 0.25s, box-shadow 0.25s, border-color 0.25s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow =
                        "0 14px 30px -18px rgba(10,31,77,0.25)";
                      e.currentTarget.style.borderColor = "rgba(0,51,153,0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.borderColor = BORDER;
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: ACCENT,
                        marginBottom: "0.6rem",
                      }}
                    >
                      {m.outlet} · {m.year}
                    </span>
                    <h3
                      style={{
                        fontSize: "1rem",
                        fontWeight: 500,
                        color: INK,
                        lineHeight: 1.35,
                        letterSpacing: "-0.01em",
                        margin: 0,
                        marginBottom: "0.85rem",
                        flex: 1,
                      }}
                    >
                      {m.title}
                    </h3>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        color: ACCENT,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}
                    >
                      Read <ExternalLink size={12} />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

    </div>
  );
};

const chipPrimary: React.CSSProperties = {
  fontSize: "0.72rem",
  fontWeight: 600,
  letterSpacing: "0.04em",
  color: "#ffffff",
  background: ACCENT,
  border: `1px solid ${ACCENT}`,
  padding: "0.35rem 0.75rem",
  borderRadius: "999px",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.35rem",
};

const chipSecondary: React.CSSProperties = {
  fontSize: "0.72rem",
  fontWeight: 600,
  letterSpacing: "0.04em",
  color: ACCENT,
  background: "transparent",
  border: `1px solid rgba(0,51,153,0.35)`,
  padding: "0.35rem 0.75rem",
  borderRadius: "999px",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.3rem",
};

export default ResearchPage;
