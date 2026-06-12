import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "@/lib/motions";
import { useProjects } from "@/hooks/use-portfolio-data";
import {
  Code2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Star,
} from "lucide-react";

interface ProjectType {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  tech: string[];
  image: string;
  demoUrl?: string;
  repoUrl?: string;
  featured?: boolean;
}

export default function ProjectsGrid() {
  const { projects: dbProjects, loading } = useProjects();
  const [selected, setSelected] = useState(0);

  // Map database projects to our frontend shape
  const projects: ProjectType[] = dbProjects.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    shortDesc: p.short_desc || "",
    tech: p.tech || [],
    image: p.image_url || "",
    demoUrl: p.demo_url || undefined,
    repoUrl: p.repo_url || undefined,
    featured: p.featured || false,
  }));

  /* Keyboard Navigation */
  useEffect(() => {
    if (projects.length === 0) return;
    const fn = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setSelected((p) => (p - 1 + projects.length) % projects.length);
      }
      if (e.key === "ArrowRight") {
        setSelected((p) => (p + 1) % projects.length);
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [projects.length]);

  const prev = () => setSelected((p) => (p - 1 + projects.length) % projects.length);
  const next = () => setSelected((p) => (p + 1) % projects.length);

  const spotlightRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (spotlightRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spotlightRef.current.style.setProperty("--spotlight-x", `${x}px`);
      spotlightRef.current.style.setProperty("--spotlight-y", `${y}px`);
    }
  };

  const active = projects[selected];

  return (
    <section id="projects" className="section-padding relative overflow-hidden bg-background">
      <div className="container max-w-6xl mx-auto relative z-10 px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20px" }}
          className="space-y-12"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="border-b border-[rgba(255,255,255,0.05)] pb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[#00FF88]">
                <Code2 size={16} />
              </span>
              <p className="font-mono text-xs text-zinc-400 tracking-widest uppercase">
                Selected Work
              </p>
            </div>
            <div className="flex items-end justify-between flex-wrap gap-4">
              <h2 className="text-3xl sm:text-5xl font-bold font-space tracking-tight text-white">
                Featured <span className="text-[#00FF88] text-gradient">Projects</span>
              </h2>
              {!loading && projects.length > 0 && (
                <span className="font-mono text-xs text-zinc-500 border border-[rgba(255,255,255,0.07)] px-3 py-1 rounded-full">
                  {projects.length} project{projects.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </motion.div>

          {/* Skeleton or Slider */}
          {loading ? (
            <div className="relative rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#0b1120] p-5 md:p-6 min-h-[480px] animate-pulse">
              <div className="h-6 bg-slate-700/25 rounded w-1/4 mb-6" />
              <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 min-h-[380px]">
                <div className="h-[320px] lg:h-full bg-slate-700/15 rounded-xl" />
                <div className="space-y-6">
                  <div className="h-4 bg-slate-700/25 rounded w-1/3" />
                  <div className="h-8 bg-slate-700/25 rounded w-3/4" />
                  <div className="h-20 bg-slate-700/20 rounded w-full" />
                  <div className="h-10 bg-slate-700/15 rounded w-1/2" />
                </div>
              </div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-[rgba(255,255,255,0.1)] rounded-2xl">
              <p className="text-zinc-500 font-mono text-sm">NO PROJECTS REGISTERS IN SYSTEM</p>
            </div>
          ) : (
            <motion.div variants={fadeUp} className="w-full">
              {/* Slider Card */}
              <div className="relative rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#0b1120] p-5 md:p-6 flex flex-col gap-6 overflow-hidden">
                {/* Back backing glow */}
                <div className="absolute -left-12 -top-12 w-36 h-36 rounded-full bg-[#00FF88]/5 blur-3xl pointer-events-none" />

                {/* Card Header: Navigation & Indices */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[rgba(255,255,255,0.05)] pb-5 z-10">
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-[#00FF88]/8 border border-[#00FF88]/20 flex items-center justify-center text-[#00FF88] shadow-[0_0_12px_rgba(0,255,136,0.05)]">
                      <Code2 size={22} />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-semibold block">
                        ACTIVE DOSSIER
                      </span>
                      <span className="text-xs font-mono text-zinc-300 font-bold uppercase">
                        {active.title}
                      </span>
                    </div>
                  </div>

                  {/* Navigation Controls */}
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 bg-black/20 p-1 rounded-xl border border-[rgba(255,255,255,0.04)]">
                    <button
                      onClick={prev}
                      className="p-2 rounded-lg border border-[rgba(255,255,255,0.05)] text-zinc-400 hover:text-white hover:bg-white/5 hover:border-[rgba(255,255,255,0.15)] transition-all"
                      aria-label="Previous Project"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="text-xs font-mono text-zinc-500 min-w-[50px] text-center">
                      {String(selected + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                    </span>
                    <button
                      onClick={next}
                      className="p-2 rounded-lg border border-[rgba(255,255,255,0.05)] text-zinc-400 hover:text-white hover:bg-white/5 hover:border-[rgba(255,255,255,0.15)] transition-all"
                      aria-label="Next Project"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Card Body: Split Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 items-stretch min-h-[380px] z-10">
                  {/* Left Column: Preloaded Project Image Frame with Spotlight & Crosshair Tracker */}
                  <div 
                    ref={spotlightRef}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="relative rounded-xl overflow-hidden border border-[rgba(255,255,255,0.05)] bg-[#060913] flex items-center justify-center min-h-[300px] lg:min-h-[360px] xl:min-h-[400px] group cursor-pointer"
                  >
                    {/* Interactive Cursor Spotlight Glow overlay */}
                    <div
                      className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-30 opacity-0 group-hover:opacity-100"
                      style={{
                        background: `radial-gradient(180px circle at var(--spotlight-x, -500px) var(--spotlight-y, -500px), rgba(0, 255, 136, 0.15), transparent 85%)`
                      }}
                    />

                    {/* Cyber scanning crosshair tracking line */}
                    <div 
                      className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300 opacity-0 group-hover:opacity-15"
                      style={{
                        background: `linear-gradient(to right, transparent calc(var(--spotlight-x, -500px) - 1px), #00FF88 var(--spotlight-x, -500px), transparent calc(var(--spotlight-x, -500px) + 1px)),
                                     linear-gradient(to bottom, transparent calc(var(--spotlight-y, -500px) - 1px), #00FF88 var(--spotlight-y, -500px), transparent calc(var(--spotlight-y, -500px) + 1px))`
                      }}
                    />

                    {/* HUD corner frame accents that highlight on hover */}
                    {[
                      "top-3 left-3 border-t-2 border-l-2",
                      "top-3 right-3 border-t-2 border-r-2",
                      "bottom-3 left-3 border-b-2 border-l-2",
                      "bottom-3 right-3 border-b-2 border-r-2",
                    ].map((c) => (
                      <div
                        key={c}
                        className={`absolute w-3.5 h-3.5 ${c} border-[#00FF88]/40 group-hover:border-[#00FF88] group-hover:shadow-[0_0_8px_rgba(0,255,136,0.3)] transition-all duration-300 pointer-events-none z-35`}
                      />
                    ))}

                    {/* Top neon light line */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00FF88]/30 to-transparent z-35" />

                    {/* Parallel Preloaded stack for instant switching */}
                    <div className="absolute inset-0 w-full h-full select-none overflow-hidden">
                      {projects.map((item, idx) => {
                        const isActive = idx === selected;
                        if (!item.image) return null;

                        return (
                          <div
                            key={item.id}
                            className={`absolute inset-0 w-full h-full ${
                              isActive
                                ? "opacity-100 z-10 pointer-events-auto"
                                : "opacity-0 z-0 pointer-events-none"
                            }`}
                          >
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                              loading="eager"
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* Dark gradient & Grid overlap */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050816]/60 via-[#050816]/10 to-transparent z-20 pointer-events-none" />
                    <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none z-20" />
                  </div>

                  {/* Right Column: Project Specifications Dossier */}
                  <div className="flex flex-col gap-5 justify-between bg-black/15 rounded-xl border border-[rgba(255,255,255,0.03)] p-4 md:p-6">
                    <div className="flex flex-col gap-4">
                      {/* Sub-header */}
                      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.05)] pb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" />
                          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-semibold">
                            Project Specifications
                          </span>
                        </div>
                        {active.featured && (
                          <span className="flex items-center gap-1 text-[9px] uppercase tracking-wider font-mono font-bold px-2 py-0.5 rounded bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/20 shadow-[0_0_10px_rgba(0,255,136,0.05)]">
                            <Star size={8} fill="currentColor" />
                            Featured
                          </span>
                        )}
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-3">
                        <h4 className="text-xl md:text-2xl font-bold font-space text-white leading-tight">
                          {active.title}
                        </h4>
                        <p className="text-xs md:text-sm text-zinc-400 font-sans leading-relaxed">
                          {active.shortDesc}
                        </p>
                      </div>
                    </div>

                    {/* Footer Specifications (Tech stack & CTAs) */}
                    <div className="space-y-4">
                      {/* Tech stack badges */}
                      <div className="space-y-2">
                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">
                          Technologies Used:
                        </span>
                        <div className="flex flex-wrap gap-1.5 max-h-[72px] overflow-y-auto pr-1 cert-scroll">
                          {active.tech.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] font-mono px-2 py-0.5 rounded border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] text-zinc-300 hover:border-[#00FF88]/25 hover:text-white transition-colors cursor-default"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* CTA Links */}
                      <div className="flex items-center gap-6 pt-4 border-t border-[rgba(255,255,255,0.05)]">
                        {active.demoUrl && (
                          <a
                            href={active.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-300 hover:text-[#00FF88] transition-all hover:translate-x-0.5 duration-200 font-mono uppercase tracking-wider"
                          >
                            <ExternalLink size={14} className="text-[#00FF88]" />
                            <span>Live Demo</span>
                          </a>
                        )}
                        {active.repoUrl && (
                          <a
                            href={active.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white transition-all hover:translate-x-0.5 duration-200 font-mono uppercase tracking-wider"
                          >
                            <Github size={14} />
                            <span>Source Code</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pagination Dots Footer */}
                <div className="border-t border-[rgba(255,255,255,0.05)] pt-4 flex items-center justify-between z-10">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    Viewing project {String(selected + 1).padStart(2, "0")} of {String(projects.length).padStart(2, "0")}
                  </span>

                  <div className="flex flex-wrap items-center justify-end gap-1.5 max-w-[200px] sm:max-w-none">
                    {projects.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setSelected(i)}
                        className={`rounded-full transition-all duration-300 ${
                          i === selected
                            ? "w-6 h-1.5 bg-[#00FF88]"
                            : "w-1.5 h-1.5 bg-zinc-700 hover:bg-zinc-500"
                        }`}
                        aria-label={`Go to project ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
