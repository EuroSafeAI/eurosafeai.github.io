import { lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import FloatingNav from "@/components/FloatingNav";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";

const ResearchPage = lazy(() => import("@/pages/ResearchPage"));
const MultiAgentSafetyPage = lazy(() => import("@/pages/MultiAgentSafetyPage"));
const DemocracyDefensePage = lazy(() => import("@/pages/DemocracyDefensePage"));
const FrontierAISafetyPage = lazy(() => import("@/pages/FrontierAISafetyPage"));
const CertificatePage = lazy(() => import("@/pages/CertificatePage"));
const CertificateDetailPage = lazy(() => import("@/pages/CertificateDetailPage"));
const TeamPage = lazy(() => import("@/pages/TeamPage"));
const MemberPage = lazy(() => import("@/pages/MemberPage"));
const CareersPage = lazy(() => import("@/pages/CareersPage"));
const BlogPage = lazy(() => import("@/pages/BlogPage"));
const BlogPostPage = lazy(() => import("@/pages/BlogPostPage"));
const EventsPage = lazy(() => import("@/pages/EventsPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const InstituteEffortsPage = lazy(() => import("@/pages/InstituteEffortsPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));

/** Routes that render their own full-page chrome (no global nav/footer). */
const BARE_ROUTES = ["/institute-efforts"];

const AppShell = () => {
  const { pathname } = useLocation();
  const bare = BARE_ROUTES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  return (
    <>
      {!bare && <FloatingNav />}
      <main className="min-h-screen pt-0">
        <Suspense fallback={<div className="min-h-screen" aria-hidden />}>
          <Routes>
            <Route path="/" element={<ErrorBoundary><HomePage /></ErrorBoundary>} />
            <Route path="/research" element={<ErrorBoundary><ResearchPage /></ErrorBoundary>} />
            <Route path="/multi-agent-safety" element={<ErrorBoundary><MultiAgentSafetyPage /></ErrorBoundary>} />
            <Route path="/democracy-defense" element={<ErrorBoundary><DemocracyDefensePage /></ErrorBoundary>} />
            <Route path="/frontier-ai-safety" element={<ErrorBoundary><FrontierAISafetyPage /></ErrorBoundary>} />
            <Route path="/certificate" element={<ErrorBoundary><CertificatePage /></ErrorBoundary>} />
            <Route path="/certificate/:slug" element={<ErrorBoundary><CertificateDetailPage /></ErrorBoundary>} />
            <Route path="/certificates" element={<ErrorBoundary><CertificatePage /></ErrorBoundary>} />
            <Route path="/certificates/:slug" element={<ErrorBoundary><CertificateDetailPage /></ErrorBoundary>} />
            <Route path="/team" element={<ErrorBoundary><TeamPage /></ErrorBoundary>} />
            <Route path="/team/:slug" element={<ErrorBoundary><MemberPage /></ErrorBoundary>} />
            <Route path="/careers" element={<ErrorBoundary><CareersPage /></ErrorBoundary>} />
            <Route path="/blog" element={<ErrorBoundary><BlogPage /></ErrorBoundary>} />
            <Route path="/blog/:slug" element={<ErrorBoundary><BlogPostPage /></ErrorBoundary>} />
            <Route path="/events" element={<ErrorBoundary><EventsPage /></ErrorBoundary>} />
            <Route path="/events/past" element={<ErrorBoundary><EventsPage /></ErrorBoundary>} />
            <Route path="/institute-efforts" element={<ErrorBoundary><InstituteEffortsPage /></ErrorBoundary>} />
            <Route path="/contact" element={<ErrorBoundary><ContactPage /></ErrorBoundary>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {!bare && <Footer />}
    </>
  );
};

const App = () => (
  <HelmetProvider>
    <ErrorBoundary>
      <TooltipProvider>
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </TooltipProvider>
    </ErrorBoundary>
  </HelmetProvider>
);

export default App;
