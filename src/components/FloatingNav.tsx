import { useState, useEffect } from "react";
import { BookOpen, Users, Briefcase, Calendar, Mail, Menu, X, ChevronDown } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const researchFocuses = [
  { label: "Multi-Agent Safety", path: "/multi-agent-safety" },
  { label: "Democracy Defense", path: "/democracy-defense" },
  { label: "Frontier AI Safety", path: "/frontier-ai-safety" },
];

const navItems = [
  { label: "Research", path: "/research", icon: BookOpen },
  { label: "Team", path: "/team", icon: Users },
  { label: "Events", path: "/events", icon: Calendar },
  { label: "Careers", path: "/careers", icon: Briefcase },
  { label: "Contact", path: "mailto:eurosafeai.zurich@gmail.com", icon: Mail, external: true },
];

const FloatingNav = () => {
  const [open, setOpen] = useState(false);
  const [researchOpen, setResearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const goTo = (path: string) => {
    window.scrollTo({ top: 0 });
    navigate(path);
    setResearchOpen(false);
    setOpen(false);
  };

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  const handleNav = (item: (typeof navItems)[0]) => {
    if (item.external) {
      window.location.href = item.path;
    } else {
      window.scrollTo({ top: 0 });
      navigate(item.path);
    }
    setOpen(false);
  };

  return (
    <>
      {/* Top bar — always transparent */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="hidden md:block absolute top-0 left-0 right-0 z-50 bg-transparent"
      >
        <div className="container mx-auto px-6">
          <div className="hidden md:flex items-center justify-between h-16">
            {/* Logo left */}
            <button
              onClick={() => { navigate("/"); window.scrollTo({ top: 0 }); }}
              className="font-display font-bold text-lg hover:opacity-80 transition-opacity"
              style={{ color: "#001233" }}
            >
              EuroSafeAI
            </button>

            {/* Nav links right */}
            <nav className="flex items-center gap-10">
              {navItems.map((item) => {
                const researchPaths = ["/research", ...researchFocuses.map((r) => r.path)];
                const active = !item.external && (
                  item.label === "Research"
                    ? researchPaths.includes(location.pathname)
                    : location.pathname === item.path
                );

                if (item.label === "Research") {
                  return (
                    <div
                      key={item.label}
                      className="relative"
                      onMouseEnter={() => setResearchOpen(true)}
                      onMouseLeave={() => setResearchOpen(false)}
                    >
                      <button
                        onClick={() => handleNav(item)}
                        className={`text-sm font-medium transition-colors relative pb-0.5 flex items-center gap-1 ${
                          active ? "text-primary" : "hover:opacity-70"
                        }`}
                        style={!active ? { color: "#001233" } : undefined}
                      >
                        {item.label}
                        <ChevronDown
                          className={`h-3.5 w-3.5 transition-transform ${researchOpen ? "rotate-180" : ""}`}
                        />
                        {active && (
                          <motion.div
                            layoutId="nav-underline"
                            className="absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full bg-primary"
                          />
                        )}
                      </button>
                      <AnimatePresence>
                        {researchOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                            className="absolute right-0 top-full pt-3 z-50"
                          >
                            <div
                              className="rounded-xl border border-black/5 bg-white shadow-xl overflow-hidden"
                              style={{
                                minWidth: "240px",
                                maxWidth: "calc(100vw - 2rem)",
                                maxHeight: "220px",
                                overflowY: "auto",
                              }}
                            >
                              <button
                                onClick={() => goTo("/research")}
                                className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors border-b border-black/5 ${
                                  location.pathname === "/research"
                                    ? "text-primary bg-primary/5"
                                    : "text-muted-foreground hover:text-foreground hover:bg-black/[0.03]"
                                }`}
                              >
                                All Research
                              </button>
                              {researchFocuses.map((focus) => {
                                const focusActive = location.pathname === focus.path;
                                return (
                                  <button
                                    key={focus.path}
                                    onClick={() => goTo(focus.path)}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                                      focusActive
                                        ? "text-primary bg-primary/5 font-medium"
                                        : "text-muted-foreground hover:text-foreground hover:bg-black/[0.03]"
                                    }`}
                                  >
                                    {focus.label}
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <button
                    key={item.label}
                    onClick={() => handleNav(item)}
                    className={`text-sm font-medium transition-colors relative pb-0.5 ${
                      active ? "text-primary" : "hover:opacity-70"
                    }`}
                    style={!active ? { color: "#001233" } : undefined}
                  >
                    {item.label}
                    {active && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full bg-primary"
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden absolute top-4 right-4 z-[60] rounded-full bg-primary text-primary-foreground p-3 shadow-lg"
        aria-label="Toggle menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile logo */}
      <div className="md:hidden absolute top-4 left-4 z-[60]">
        <button
          onClick={() => { navigate("/"); window.scrollTo({ top: 0 }); setOpen(false); }}
          className="font-display font-bold text-foreground text-lg"
        >
          EuroSafeAI
        </button>
      </div>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 z-50 bg-background flex flex-col items-center justify-center gap-8"
          >
            <button
              onClick={() => { navigate("/"); window.scrollTo({ top: 0 }); setOpen(false); }}
              className="text-2xl font-display font-semibold text-foreground hover:text-primary transition-colors"
            >
              Home
            </button>
            {navItems.map((item) => {
              const active = !item.external && location.pathname === item.path;
              return (
                <button
                  key={item.label}
                  onClick={() => handleNav(item)}
                  className={`text-2xl font-display font-semibold transition-colors ${
                    active ? "text-primary" : "text-foreground hover:text-primary"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingNav;
