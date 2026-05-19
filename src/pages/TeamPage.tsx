import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import { advisors, leadership, technicalStaff, type TeamMember } from "@/lib/team";

const ACCENT = "#003399";
const INK = "#0a1f4d";

const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

const PhotoTile = ({ member }: { member: TeamMember }) => (
  <Link
    to={`/team/${member.slug}`}
    onClick={() => window.scrollTo({ top: 0 })}
    className="team-photo-tile"
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      transition: "transform 0.3s",
      textDecoration: "none",
      color: "inherit",
    }}
  >
    <div
      style={{
        width: "180px",
        height: "180px",
        maxWidth: "60vw",
        aspectRatio: "1 / 1",
        borderRadius: "9999px",
        overflow: "hidden",
        background: "#dbe4f5",
        border: "1px solid rgba(10,31,77,0.08)",
        boxShadow: "0 6px 18px -12px rgba(10,31,77,0.35)",
        marginBottom: "1rem",
      }}
    >
      {member.image ? (
        <img
          src={member.image}
          alt={member.name}
          loading="lazy"
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
            fontSize: "1.6rem",
          }}
        >
          {getInitials(member.name)}
        </div>
      )}
    </div>
    <p
      className="team-tile-name"
      style={{
        fontWeight: 700,
        color: INK,
        margin: 0,
        marginBottom: "0.25rem",
        letterSpacing: "-0.005em",
      }}
    >
      {member.name}
    </p>
    <p
      className="team-tile-role"
      style={{
        color: "rgba(10,31,77,0.65)",
        margin: 0,
        lineHeight: 1.4,
        maxWidth: "28ch",
      }}
    >
      {member.role}
    </p>
  </Link>
);

const SectionRow = ({
  label,
  members,
  bg = "#ffffff",
  columns = 4,
}: {
  label: string;
  members: TeamMember[];
  bg?: string;
  columns?: number;
}) => (
  <section className="team-section" style={{ background: bg }}>
    <div className="mx-auto px-6" style={{ maxWidth: "1200px" }}>
      <div className="team-section-grid">
        <div>
          <h2 className="team-section-label" style={{ color: INK }}>
            {label}
          </h2>
        </div>
        <div
          className="team-section-photos"
          style={{ ["--cols" as string]: columns }}
        >
          {members.map((m, i) => (
            <AnimatedSection key={m.slug} delay={Math.min(i * 0.04, 0.4)}>
              <PhotoTile member={m} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const TeamPage = () => (
  <div>
    <Helmet>
      <title>Team — EuroSafeAI</title>
      <meta name="description" content="Meet the researchers, advisors, and leadership behind EuroSafeAI's mission for safe AI systems." />
    </Helmet>
    {/* Hero */}
    <section className="team-hero" style={{ background: "#ffffff" }}>
      <div className="mx-auto px-6" style={{ maxWidth: "1200px" }}>
        <AnimatedSection>
          <div style={{ maxWidth: "920px" }}>
            <h1
              style={{
                fontSize: "clamp(2.25rem, 6.5vw, 5.4rem)",
                fontWeight: 800,
                lineHeight: 1.04,
                color: INK,
                letterSpacing: "-0.03em",
                margin: 0,
                marginBottom: "1.4rem",
              }}
            >
              Meet Our Team
            </h1>
            <p
              className="team-hero-sub"
              style={{
                lineHeight: 1.55,
                color: "rgba(10,31,77,0.72)",
                margin: 0,
                maxWidth: "780px",
              }}
            >
              Experts in AI safety and strategic research, dedicated to advancing AI safety through innovative research.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>

    <SectionRow label="Leadership" members={leadership} bg="#ffffff" columns={4} />
    <SectionRow label="Our team" members={technicalStaff} bg="#f5f7fb" columns={4} />
    <SectionRow label="Advisory board" members={advisors} bg="#ffffff" columns={3} />

    {/* CTA */}
    <section className="team-cta" style={{ background: ACCENT }}>
      <div className="mx-auto px-6" style={{ maxWidth: "900px", textAlign: "center" }}>
        <AnimatedSection>
          <h2
            style={{
              fontSize: "clamp(1.75rem, 4vw, 3rem)",
              fontWeight: 800,
              lineHeight: 1.12,
              color: "#ffffff",
              letterSpacing: "-0.025em",
              marginBottom: "1.25rem",
            }}
          >
            Want to Join Our Team?
          </h2>
          <p
            className="team-cta-sub"
            style={{
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.85)",
              maxWidth: "620px",
              margin: "0 auto 2.5rem",
            }}
          >
            We're always looking for talented individuals passionate about AI safety.
          </p>
          <Link
            to="/careers"
            onClick={() => window.scrollTo({ top: 0 })}
            className="team-cta-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5em",
              padding: "0.95rem 1.6rem",
              minHeight: "44px",
              background: "#ffffff",
              color: ACCENT,
              borderRadius: "999px",
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "background 0.2s",
            }}
          >
            View Open Positions <span aria-hidden>›</span>
          </Link>
        </AnimatedSection>
      </div>
    </section>

    <style>{`
      .team-hero { padding: clamp(5rem, 8vw, 7rem) 0 clamp(1.5rem, 3vw, 2.5rem); }
      .team-hero-sub { font-size: clamp(1.0625rem, 1.3vw, 1.2rem); }
      .team-cta { padding: clamp(3.5rem, 7vw, 6rem) 0 clamp(4rem, 8vw, 7rem); }
      .team-cta-sub { font-size: clamp(1rem, 1.2vw, 1.05rem); }
      .team-section { padding: clamp(2.5rem, 6vw, 5rem) 0; }
      .team-section-grid {
        display: grid;
        grid-template-columns: minmax(0, 220px) minmax(0, 1fr);
        gap: 3rem;
        align-items: start;
      }
      .team-section-label {
        font-size: 1.6rem;
        font-weight: 700;
        letter-spacing: -0.01em;
        margin: 0;
        position: sticky;
        top: 6rem;
      }
      .team-section-photos {
        display: grid;
        grid-template-columns: repeat(var(--cols), 1fr);
        gap: 2.5rem 1.5rem;
        justify-items: center;
      }
      .team-tile-name { font-size: 1rem; }
      .team-tile-role { font-size: 0.85rem; }
      .team-photo-tile:hover { transform: translateY(-4px); }
      .team-cta-btn:hover { background: rgba(255,255,255,0.92); }

      @media (max-width: 800px) {
        .team-section-grid { grid-template-columns: 1fr; gap: 1.5rem; }
        .team-section-label {
          position: static;
          text-align: center;
          margin-bottom: 2rem;
          font-size: 1.5rem;
        }
        .team-section-photos {
          grid-template-columns: 1fr;
          gap: 2.75rem;
        }
        .team-tile-name { font-size: 1.125rem; }
        .team-tile-role { font-size: 0.95rem; }
      }
    `}</style>
  </div>
);

export default TeamPage;
