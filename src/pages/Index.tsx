import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LazySection from "@/components/LazySection";
import { lazy, Suspense } from "react";

// ── Below-fold sections: lazy-loaded JS chunks ───────────────────────────────
// These are not needed on initial paint. They only download when the user
// scrolls near them (or LazySection's rootMargin fires first).
const About           = lazy(() => import("@/components/About"));
const ProjectsGrid    = lazy(() => import("@/components/ProjectsGrid"));
const SkillsViz       = lazy(() => import("@/components/SkillsViz"));
const AchievementsViz = lazy(() => import("@/components/AchievementsViz"));
const Timeline        = lazy(() => import("@/components/Timeline"));
const Contact         = lazy(() => import("@/components/Contact"));
const Footer          = lazy(() => import("@/components/Footer"));

// Minimal section skeleton shown while a chunk loads — preserves scroll layout
function SectionSkeleton({ height = "400px" }: { height?: string }) {
  return (
    <div
      style={{ minHeight: height }}
      className="flex items-center justify-center"
      aria-hidden="true"
    >
      <div className="w-6 h-6 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
    </div>
  );
}

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main>
        {/* Hero: above the fold — render immediately */}
        <Hero />

        {/* Below-fold sections: lazy-loaded per section with 300px look-ahead */}
        <LazySection id="about" rootMargin="300px" minHeight="600px">
          <Suspense fallback={<SectionSkeleton height="600px" />}>
            <About />
          </Suspense>
        </LazySection>

        <LazySection id="projects" rootMargin="300px" minHeight="700px">
          <Suspense fallback={<SectionSkeleton height="700px" />}>
            <ProjectsGrid />
          </Suspense>
        </LazySection>

        <LazySection id="skills" rootMargin="300px" minHeight="600px">
          <Suspense fallback={<SectionSkeleton height="600px" />}>
            <SkillsViz />
          </Suspense>
        </LazySection>

        <LazySection id="achievements" rootMargin="300px" minHeight="500px">
          <Suspense fallback={<SectionSkeleton height="500px" />}>
            <AchievementsViz />
          </Suspense>
        </LazySection>

        <LazySection id="education" rootMargin="300px" minHeight="500px">
          <Suspense fallback={<SectionSkeleton height="500px" />}>
            <Timeline />
          </Suspense>
        </LazySection>

        <LazySection id="contact" rootMargin="200px" minHeight="500px">
          <Suspense fallback={<SectionSkeleton height="500px" />}>
            <Contact />
          </Suspense>
        </LazySection>
      </main>

      <LazySection rootMargin="100px" minHeight="200px">
        <Suspense fallback={<SectionSkeleton height="200px" />}>
          <Footer />
        </Suspense>
      </LazySection>
    </div>
  );
};

export default Index;
