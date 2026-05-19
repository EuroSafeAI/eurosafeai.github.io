import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Globe, Linkedin, Twitter } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { PaperCard } from "@/components/PaperCard";
import { getMemberBySlug, getPapersForMember } from "@/lib/team";

const ACCENT = "#003399";
const INK = "#0a1f4d";

const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

const MemberPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const member = slug ? getMemberBySlug(slug) : undefined;

  if (!member) {
    return (
      <div style={{ padding: "10rem 1.5rem 6rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: INK }}>Member not found</h1>
        <Link
          to="/team"
          onClick={() => window.scrollTo({ top: 0 })}
          style={{ marginTop: "1rem", display: "inline-block", color: ACCENT }}
        >
          ← Back to Team
        </Link>
      </div>
    );
  }

  const publications = getPapersForMember(member);

  return (
    <div>
      <Helmet>
        <title>{member.name} — EuroSafeAI Team</title>
        <meta name="description" content={`${member.name} is ${member.role} at EuroSafeAI, a nonprofit research organization advancing AI safety.`} />
      </Helmet>
      {/* Header */}
      <section style={{ background: "#ffffff", padding: "7rem 0 3rem" }}>
        <div className="mx-auto px-6" style={{ maxWidth: "1100px" }}>
          <AnimatedSection>
            <Link
              to="/team"
              onClick={() => window.scrollTo({ top: 0 })}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.85rem",
                color: "rgba(10,31,77,0.65)",
                textDecoration: "none",
                marginBottom: "2.5rem",
              }}
            >
              <ArrowLeft size={16} /> Back to Team
            </Link>
          </AnimatedSection>

          <AnimatedSection delay={0.05}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 200px) minmax(0, 1fr)",
                gap: "2.5rem",
                alignItems: "center",
              }}
              className="member-header-grid"
            >
              <div
                style={{
                  width: "200px",
                  height: "200px",
                  maxWidth: "100%",
                  borderRadius: "9999px",
                  overflow: "hidden",
                  background: "#dbe4f5",
                  border: "1px solid rgba(10,31,77,0.08)",
                  boxShadow: "0 10px 26px -16px rgba(10,31,77,0.35)",
                }}
              >
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: ACCENT,
                      fontWeight: 700,
                      fontSize: "2rem",
                    }}
                  >
                    {getInitials(member.name)}
                  </div>
                )}
              </div>

              <div>
                <h1
                  style={{
                    fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)",
                    fontWeight: 800,
                    lineHeight: 1.05,
                    color: INK,
                    letterSpacing: "-0.025em",
                    margin: 0,
                    marginBottom: "0.6rem",
                  }}
                >
                  {member.name}
                </h1>
                <p
                  style={{
                    fontSize: "1.05rem",
                    color: "rgba(10,31,77,0.7)",
                    lineHeight: 1.5,
                    margin: 0,
                    marginBottom: member.linkedin || member.website || member.twitter ? "1.4rem" : 0,
                  }}
                >
                  {member.role}
                </p>
                {(member.linkedin || member.website || member.twitter) && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem" }}>
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.45rem",
                          padding: "0.5rem 0.95rem",
                          borderRadius: "999px",
                          border: `1px solid rgba(0,51,153,0.35)`,
                          color: ACCENT,
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          textDecoration: "none",
                          transition: "background 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(0,51,153,0.06)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <Linkedin size={15} /> LinkedIn
                      </a>
                    )}
                    {member.website && (
                      <a
                        href={member.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.45rem",
                          padding: "0.5rem 0.95rem",
                          borderRadius: "999px",
                          border: `1px solid rgba(0,51,153,0.35)`,
                          color: ACCENT,
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          textDecoration: "none",
                          transition: "background 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(0,51,153,0.06)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <Globe size={15} /> Website
                      </a>
                    )}
                    {member.twitter && (
                      <a
                        href={member.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.45rem",
                          padding: "0.5rem 0.95rem",
                          borderRadius: "999px",
                          border: `1px solid rgba(0,51,153,0.35)`,
                          color: ACCENT,
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          textDecoration: "none",
                          transition: "background 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(0,51,153,0.06)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <Twitter size={15} /> Twitter
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Publications */}
      <section style={{ background: "#f5f7fb", padding: "4rem 0 6rem" }}>
        <div className="mx-auto px-6" style={{ maxWidth: "1100px" }}>
          <AnimatedSection>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: INK,
                letterSpacing: "-0.01em",
                margin: 0,
                marginBottom: "1.75rem",
              }}
            >
              Publications
              {publications.length > 0 && (
                <span
                  style={{
                    marginLeft: "0.6rem",
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "rgba(10,31,77,0.45)",
                  }}
                >
                  ({publications.length})
                </span>
              )}
            </h2>
          </AnimatedSection>

          {publications.length === 0 ? (
            <p style={{ color: "rgba(10,31,77,0.6)", fontSize: "0.95rem" }}>
              No publications listed yet.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {publications.map((p, i) => (
                <AnimatedSection key={p.slug} delay={Math.min(i * 0.04, 0.3)}>
                  <PaperCard paper={p} />
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 720px) {
          .member-header-grid {
            grid-template-columns: 1fr !important;
            justify-items: center;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default MemberPage;
