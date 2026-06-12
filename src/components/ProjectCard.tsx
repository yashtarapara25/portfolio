import { memo } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motions";
import type { Project } from "@/lib/data";
import { ExternalLink, Github, Star } from "lucide-react";

interface Props {
  project: Project;
  index?: number;
}

const ProjectCard = memo(function ProjectCard({ project, index = 0 }: Props) {
  return (
    <motion.article
      variants={fadeUp}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
      whileHover={{ y: -4 }}
      className="group relative rounded-xl overflow-hidden bg-[#0B1220]/50 backdrop-blur-xl border border-[rgba(255,255,255,0.06)] hover:border-[#00FF88]/20 hover:shadow-[0_0_35px_rgba(0,255,136,0.06)] transition-all duration-300 flex flex-col h-full"
    >
      {/* Project Image */}
      <div className="relative overflow-hidden w-full h-48 flex-shrink-0">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          loading="lazy"
          decoding="async"
        />

        {/* Ambient Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/20 to-transparent" />

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] uppercase tracking-wider font-mono font-bold px-2 py-1 rounded bg-[#050816] text-white border border-[#00FF88]/25 shadow-lg shadow-[#00FF88]/10 z-20">
            <Star size={10} fill="currentColor" className="mr-0.5" />
            Featured
          </div>
        )}
      </div>

      {/* Project Content */}
      <div className="p-6 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-lg font-bold font-space text-white group-hover:text-[#00FF88] transition-colors duration-300 mb-2 leading-snug">
            {project.title}
          </h3>

          <p className="text-sm text-zinc-400 leading-relaxed mb-6 font-space">
            {project.shortDesc}
          </p>

          {/* Tech stack badges */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {project.tech.map((t) => (
              <span
                key={t}
                className="text-[10px] font-mono px-2 py-0.5 rounded border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] text-zinc-300 hover:border-[#00FF88]/25 hover:text-white transition-colors cursor-default"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Action Links */}
        <div className="flex items-center gap-4 pt-4 border-t border-[rgba(255,255,255,0.06)]">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-300 hover:text-[#00FF88] transition-colors font-space"
            >
              <ExternalLink size={12} />
              <span>Demo</span>
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-white transition-colors font-space"
            >
              <Github size={12} />
              <span>Code</span>
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
});

export default ProjectCard;
