import { Fragment } from "react";
import { Link } from "react-router-dom";
import type { Category, Paper } from "@/lib/papers";
import { findMemberByAuthorName } from "@/lib/team";

const ACCENT = "#003399";
const INK = "#0a1f4d";
const TAG_BG = "rgba(0,51,153,0.10)";

const CATEGORY_LABEL: Record<Category, string> = {
  "multi-agent-safety": "Multi-Agent Safety",
  "democracy-defense": "Democracy Defense",
  safety: "Frontier AI Safety",
};

const CategoryChip = ({ label }: { label: string }) => (
  <span
    style={{
      display: "inline-block",
      fontSize: "0.62rem",
      fontWeight: 700,
      letterSpacing: "0.13em",
      textTransform: "uppercase",
      color: ACCENT,
      background: TAG_BG,
      padding: "0.22rem 0.6rem",
      borderRadius: "4px",
    }}
  >
    {label}
  </span>
);

export const PaperCard = ({ paper }: { paper: Paper }) => (
  <article
    style={{
      background: "#ffffff",
      border: "1px solid rgba(10,31,77,0.08)",
      borderRadius: "12px",
      padding: "1.4rem 1.4rem 1.25rem",
      display: "flex",
      flexDirection: "column",
      height: "100%",
      transition: "transform 0.25s, box-shadow 0.25s",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-3px)";
      e.currentTarget.style.boxShadow = "0 14px 30px -18px rgba(10,31,77,0.25)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "none";
    }}
  >
    {/* Category chips + venue row */}
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", alignItems: "center", marginBottom: "0.75rem" }}>
      {paper.categories.map((c) => (
        <CategoryChip key={c} label={CATEGORY_LABEL[c]} />
      ))}
      {paper.venue ? (
        <span
          style={{
            fontSize: "0.64rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "rgba(10,31,77,0.5)",
          }}
        >
          {paper.venue}
        </span>
      ) : (
        <span
          style={{
            fontSize: "0.66rem",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#b58400",
            background: "#fff8e3",
            border: "1px solid #f4d97f",
            borderRadius: "999px",
            padding: "0.18rem 0.55rem",
          }}
        >
          Coming soon
        </span>
      )}
    </div>

    <h3
      style={{
        fontSize: "1rem",
        fontWeight: 700,
        color: INK,
        lineHeight: 1.35,
        letterSpacing: "-0.01em",
        marginBottom: "0.6rem",
      }}
    >
      {paper.paperUrl ? (
        <a href={paper.paperUrl} target="_blank" rel="noopener noreferrer" style={{ color: INK, textDecoration: "none" }}>
          {paper.title}
        </a>
      ) : paper.blogSlug ? (
        <Link to={`/blog/${paper.blogSlug}`} style={{ color: INK, textDecoration: "none" }}>
          {paper.title}
        </Link>
      ) : (
        paper.title
      )}
    </h3>

    <p
      style={{
        fontSize: "0.85rem",
        lineHeight: 1.55,
        color: "rgba(10,31,77,0.65)",
        flex: 1,
        marginBottom: "0.85rem",
      }}
    >
      {paper.summary}
    </p>

    {paper.authors.length > 0 && (
      <p style={{ fontSize: "0.72rem", color: "rgba(10,31,77,0.5)", marginBottom: "0.85rem", lineHeight: 1.4 }}>
        {paper.authors.map((author, i) => {
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
      </p>
    )}

    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
      {paper.paperUrl ? (
        <a
          href={paper.paperUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "0.7rem",
            fontWeight: 600,
            letterSpacing: "0.04em",
            color: ACCENT,
            border: `1px solid rgba(0,51,153,0.35)`,
            background: "transparent",
            padding: "0.32rem 0.65rem",
            borderRadius: "999px",
            textDecoration: "none",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,51,153,0.06)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          Read paper ↗
        </a>
      ) : (
        <span
          style={{
            fontSize: "0.7rem",
            fontWeight: 600,
            color: "#b35858",
            border: "1px solid rgba(179,88,88,0.35)",
            padding: "0.32rem 0.65rem",
            borderRadius: "999px",
          }}
        >
          Paper coming soon
        </span>
      )}
      {paper.blogSlug && (
        <Link
          to={`/blog/${paper.blogSlug}`}
          onClick={() => window.scrollTo({ top: 0 })}
          style={{
            fontSize: "0.7rem",
            fontWeight: 600,
            letterSpacing: "0.04em",
            color: "rgba(10,31,77,0.65)",
            border: "1px solid rgba(10,31,77,0.15)",
            padding: "0.32rem 0.65rem",
            borderRadius: "999px",
            textDecoration: "none",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(10,31,77,0.04)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          Blog post
        </Link>
      )}
    </div>

    {paper.tags && paper.tags.length > 0 && (
      <div
        style={{
          marginTop: "0.85rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.35rem",
        }}
      >
        {paper.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontSize: "0.66rem",
              fontWeight: 600,
              color: ACCENT,
              background: "rgba(0,51,153,0.08)",
              padding: "0.18rem 0.55rem",
              borderRadius: "999px",
              letterSpacing: "0.01em",
            }}
          >
            #{tag.replace(/\s+/g, "-")}
          </span>
        ))}
      </div>
    )}
  </article>
);
