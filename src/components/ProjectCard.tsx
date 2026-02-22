import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motions";
import type { Project } from "@/lib/data";
import { ExternalLink, Github, Sparkles, Star } from "lucide-react";

interface Props {
  project: Project;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: Props) {
  return (
    <motion.article
      variants={fadeUp}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 120 }}
      whileHover={{ y: -10, transition: { type: "spring", stiffness: 300 } }}
      className="group relative rounded-2xl overflow-hidden bg-slate-900/50 backdrop-blur-sm h-full flex flex-col cursor-pointer"
    >
      {/* Spinning gradient border effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          padding: "1px",
          background: "linear-gradient(90deg, #22d3ee, #3b82f6, #a855f7, #ec4899, #22d3ee)",
          backgroundSize: "300% 300%",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />

      {/* Inner card */}
      <div className="relative h-full flex flex-col rounded-2xl overflow-hidden border border-cyan-500/15 group-hover:border-transparent transition-colors duration-500">
        {/* Image */}
        <div className="relative h-52 overflow-hidden flex-shrink-0">
          <motion.img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            loading="lazy"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6 }}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />

          {/* Hover glow overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-purple-600/20"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          />

          {/* Featured badge */}
          {project.featured && (
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: index * 0.1 + 0.3 }}
              className="absolute top-3 right-3 flex items-center gap-1 text-xs font-orbitron font-bold px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/40"
            >
              <motion.span
                animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Star size={11} fill="currentColor" />
              </motion.span>
              Featured
            </motion.div>
          )}

          {/* Sparkle overlay on hover */}
          <motion.div
            className="absolute top-3 left-3 text-cyan-400 opacity-0 group-hover:opacity-100"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles size={16} />
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          <motion.h3
            className="text-lg font-bold font-space text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400 mb-2 leading-snug group-hover:from-cyan-200 group-hover:to-purple-400 transition-all duration-300"
            whileHover={{ x: 4 }}
          >
            {project.title}
          </motion.h3>

          <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-grow font-space">
            {project.shortDesc}
          </p>

          {/* Tech chips */}
          <div className="flex flex-wrap gap-2 mb-5">
            {project.tech.map((t, i) => (
              <motion.span
                key={t}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.12,
                  backgroundColor: "rgba(34,211,238,0.2)",
                  boxShadow: "0 0 12px rgba(34,211,238,0.3)",
                }}
                transition={{ delay: i * 0.04, type: "spring", stiffness: 400 }}
                className="text-xs font-display px-2.5 py-1 rounded-full bg-cyan-500/8 text-cyan-300 border border-cyan-500/25 hover:border-cyan-500/60 transition-all cursor-default"
              >
                {t}
              </motion.span>
            ))}
          </div>

          {/* Links */}
          <motion.div
            className="flex items-center gap-4 pt-4 border-t border-cyan-500/15"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {project.demoUrl && (
              <motion.a
                href={project.demoUrl}
                target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.1, x: 4 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-200 font-space relative group/link"
              >
                <ExternalLink size={13} />
                <span>Demo</span>
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-cyan-400 to-blue-500 group-hover/link:w-full transition-all duration-300" />
              </motion.a>
            )}
            {project.repoUrl && (
              <motion.a
                href={project.repoUrl}
                target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.1, x: 4 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-cyan-400 font-space relative group/link"
              >
                <Github size={13} />
                <span>Code</span>
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-cyan-400 to-blue-500 group-hover/link:w-full transition-all duration-300" />
              </motion.a>
            )}
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
}
