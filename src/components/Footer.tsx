import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const links = [
  { label: "Research", to: "/research" },
  { label: "Team", to: "/team" },
  { label: "Careers", to: "/careers" },
];

const Footer = () => {
  const isMobile = useIsMobile();
  return (
  <footer style={{ background: "#ffffff", borderTop: "1px solid rgba(10,31,77,0.08)" }}>
    <div className="mx-auto px-6" style={{ maxWidth: "1100px", padding: "2.25rem 1.5rem" }}>
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          flexWrap: "wrap",
          alignItems: isMobile ? "flex-start" : "center",
          justifyContent: "space-between",
          gap: isMobile ? "1rem" : "1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            gap: isMobile ? "0.25rem" : "1rem",
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0 })}
            style={{ fontWeight: 700, color: "#0a1f4d", fontSize: "1rem", textDecoration: "none", letterSpacing: "-0.01em" }}
          >
            EuroSafeAI
          </Link>
          <span style={{ fontSize: "0.85rem", color: "rgba(10,31,77,0.55)" }}>
            Swiss nonprofit advancing AI safety research.
          </span>
        </div>

        <nav style={{ display: "flex", flexWrap: "wrap", gap: isMobile ? "1rem 1.25rem" : "1.75rem", alignItems: "center" }}>
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => window.scrollTo({ top: 0 })}
              style={{ fontSize: "0.85rem", color: "rgba(10,31,77,0.7)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#003399"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(10,31,77,0.7)"; }}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="mailto:eurosafeai.zurich@gmail.com"
            style={{ fontSize: "0.85rem", color: "rgba(10,31,77,0.7)", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#003399"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(10,31,77,0.7)"; }}
          >
            Contact
          </a>
        </nav>
      </div>

      <div
        style={{
          marginTop: isMobile ? "1.25rem" : "1.5rem",
          paddingTop: "1.25rem",
          borderTop: "1px solid rgba(10,31,77,0.06)",
          fontSize: "0.75rem",
          color: "rgba(10,31,77,0.5)",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: isMobile ? "0.35rem" : "0.5rem",
        }}
      >
        <span>© 2026 EuroSafeAI · Zurich, Switzerland</span>
        <span>Registered under Swiss Law · CHE-153.508.763</span>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
