import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "@/lib/motions";
import { useProjects } from "@/hooks/use-portfolio-data";
import ProjectCard from "./ProjectCard";
import { Code2 } from "lucide-react";

export default function ProjectsGrid() {
  const { projects, loading } = useProjects();

  return (
    <section id="projects" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-1/3 -right-16 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -left-16 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 grid-pattern opacity-15 pointer-events-none" />

      <div className="container max-w-6xl mx-auto relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="mb-12">
            <div className="flex items-center gap-2 mb-3">
              <motion.span
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="text-cyan-400"
              >
                <Code2 size={18} />
              </motion.span>
              <p className="font-display text-sm text-cyan-400 tracking-widest uppercase">
                // selected work
              </p>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-orbitron leading-tight">
              <span className="text-gradient-aurora">Featured Projects</span>
            </h2>
            <motion.div
              className="mt-3 h-0.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full"
              initial={{ scaleX: 0, originX: "left" }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              style={{ width: "180px" }}
            />
          </motion.div>

          {/* Skeleton or grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-slate-700/50" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-slate-700 rounded w-2/3" />
                    <div className="h-3 bg-slate-700 rounded w-full" />
                    <div className="h-3 bg-slate-700 rounded w-4/5" />
                    <div className="flex gap-2 mt-4">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="h-5 w-14 bg-slate-700 rounded-full" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  index={index}
                  project={{
                    id: project.id,
                    title: project.title,
                    slug: project.slug,
                    shortDesc: project.short_desc,
                    tech: project.tech || [],
                    image: project.image_url || "",
                    demoUrl: project.demo_url || undefined,
                    repoUrl: project.repo_url || undefined,
                    featured: project.featured || false,
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

