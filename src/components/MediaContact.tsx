import AnimatedSection from "@/components/AnimatedSection";

const ACCENT = "#003399";
const INK = "#0a1f4d";

const contacts = [
  {
    name: "Zhijing Jin",
    role: "Founder & Head, EuroSafeAI",
    email: "zjin.admin@cs.toronto.edu",
    profile: "https://zhijing-jin.com/home/",
    image: "/images/team/zhijing-jin.webp",
  },
  {
    name: "Pepijn Cobben",
    role: "Cofounder, EuroSafeAI",
    email: "pcobben@ethz.ch",
    profile: "https://www.linkedin.com/in/pepijn-cobben?originalSubdomain=ch",
    image: "/images/team/pepijn-cobben.webp",
  },
  {
    name: "Punya Syon Pandey",
    role: "Lab Assistant",
    email: "ppandey@cs.toronto.edu",
    profile: "https://vesaterra.github.io/",
    image: "/images/team/punya-pandey.webp",
  },
];

const social = [
  { label: "Bluesky", href: "https://bsky.app/profile/zhijingjin.bsky.social" },
  { label: "X / Twitter", href: "https://x.com/ZhijingJin" },
  { label: "YouTube", href: "https://youtube.com/@Zhijing" },
];

const SectionEyebrow = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "0.9rem", marginBottom: "1.6rem" }}>
    <span style={{ width: "36px", height: "2px", background: "#0a2a66" }} />
    <span
      style={{
        fontSize: "0.72rem",
        fontWeight: 700,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "#0a2a66",
      }}
    >
      {children}
    </span>
  </div>
);

const MediaContact = () => (
  <section style={{ background: "#f5f7fb", padding: "5rem 0 6rem" }}>
    <div className="mx-auto px-6" style={{ maxWidth: "1100px" }}>
      <AnimatedSection>
        <SectionEyebrow>Media Contact</SectionEyebrow>
        <h2
          style={{
            fontSize: "clamp(1.6rem, 2.6vw, 2.1rem)",
            fontWeight: 800,
            color: INK,
            letterSpacing: "-0.02em",
            marginBottom: "2.5rem",
            lineHeight: 1.15,
          }}
        >
          Get in touch
        </h2>
      </AnimatedSection>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2rem",
        }}
      >
        {contacts.map((c, i) => (
          <AnimatedSection key={c.name} delay={i * 0.06}>
            <div
              style={{
                background: "#ffffff",
                border: "1px solid rgba(10,31,77,0.08)",
                borderRadius: "12px",
                padding: "1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                height: "100%",
              }}
            >
              <a href={c.profile} target="_blank" rel="noopener noreferrer" style={{ flexShrink: 0 }}>
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", border: "1px solid rgba(10,31,77,0.1)" }}
                />
              </a>
              <div style={{ minWidth: 0 }}>
                <a
                  href={c.profile}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontWeight: 700, color: INK, fontSize: "0.95rem", textDecoration: "none" }}
                >
                  {c.name}
                </a>
                <p style={{ fontSize: "0.78rem", color: "rgba(10,31,77,0.55)", margin: "0.15rem 0 0.25rem" }}>
                  {c.role}
                </p>
                <a
                  href={`mailto:${c.email}`}
                  style={{ fontSize: "0.8rem", color: ACCENT, textDecoration: "none", wordBreak: "break-word" }}
                >
                  {c.email}
                </a>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
      <AnimatedSection delay={0.18}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
          {social.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "0.78rem",
                fontWeight: 600,
                color: INK,
                border: "1px solid rgba(10,31,77,0.12)",
                background: "#ffffff",
                padding: "0.5rem 1rem",
                borderRadius: "999px",
                textDecoration: "none",
                transition: "border-color 0.2s, background 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(0,51,153,0.4)";
                e.currentTarget.style.background = "rgba(0,51,153,0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(10,31,77,0.12)";
                e.currentTarget.style.background = "#ffffff";
              }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </AnimatedSection>
    </div>
  </section>
);

export default MediaContact;
