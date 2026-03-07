import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, fadeUp } from "@/lib/motions";
import { useSkills } from "@/hooks/use-portfolio-data";
import { Zap, Code, Layers, Brain, Wrench } from "lucide-react";

const categories = [
  { key: "all", label: "All", icon: Zap },
  { key: "languages", label: "Languages", icon: Code },
  { key: "frameworks", label: "Frameworks", icon: Layers },
  { key: "ai-ml", label: "AI / ML", icon: Brain },
  { key: "tools", label: "Tools & Infra", icon: Wrench },
] as const;

export default function SkillsViz() {
  const { skills, loading } = useSkills();

  const getGradient = (category: string) => {
    switch (category) {
      case "languages": return "from-cyan-400 to-blue-500";
      case "frameworks": return "from-blue-400 to-purple-500";
      case "tools": return "from-purple-400 to-pink-500";
      case "ai-ml": return "from-teal-400 to-cyan-500";
      default: return "from-cyan-400 to-blue-500";
    }
  };

  const getGradientCSS = (category: string) => {
    switch (category) {
      case "languages": return "linear-gradient(90deg, #22d3ee, #3b82f6)";
      case "frameworks": return "linear-gradient(90deg, #60a5fa, #a855f7)";
      case "tools": return "linear-gradient(90deg, #c084fc, #ec4899)";
      case "ai-ml": return "linear-gradient(90deg, #2dd4bf, #22d3ee)";
      default: return "linear-gradient(90deg, #22d3ee, #3b82f6)";
    }
  };

  // Skip the "all" option for grouping, leaving only specific categories
  const groupingCategories = categories.filter((c) => c.key !== "all");

  return (
    <section id="skills" className="section-padding relative overflow-hidden">
      <div className="absolute top-1/4 -left-16 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-16 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 grid-pattern opacity-15 pointer-events-none" />

      <div className="container max-w-6xl mx-auto relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="mb-14">
            <div className="flex items-center gap-2 mb-3">
              <motion.span
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
                className="text-cyan-400"
              >
                <Zap size={18} fill="currentColor" />
              </motion.span>
              <p className="font-display text-sm text-cyan-400 tracking-widest uppercase">
                // tech stack
              </p>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-orbitron leading-tight">
              <span className="text-gradient-aurora">Skills &amp; Technologies</span>
            </h2>
            <motion.div
              className="mt-3 h-0.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full"
              initial={{ scaleX: 0, originX: "left" }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              style={{ width: "160px" }}
            />
          </motion.div>

          {/* Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              // Loading skeletons for grid
              [1, 2, 3].map(i => (
                <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
                  <div className="h-6 w-1/2 bg-slate-700 rounded-md mb-6" />
                  <div className="space-y-5">
                    {[1, 2, 3].map(j => (
                      <div key={j}>
                        <div className="flex justify-between mb-2">
                          <div className="h-4 w-1/3 bg-slate-700 rounded" />
                          <div className="h-4 w-10 bg-slate-700 rounded" />
                        </div>
                        <div className="h-2.5 bg-slate-700 rounded-full w-full" />
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              groupingCategories.map((cat, groupIndex) => {
                const categorySkills = skills.filter((s) => s.category === cat.key);
                // Return null if no skills exist for this category
                if (categorySkills.length === 0) return null;

                const Icon = cat.icon;

                return (
                  <motion.div
                    key={cat.key}
                    variants={fadeUp}
                    className="glass-card rounded-2xl p-6 border border-white/5 hover:border-cyan-500/20 transition-all duration-300"
                  >
                    {/* Category Header */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`p-2 rounded-xl bg-gradient-to-br ${getGradient(cat.key)} bg-opacity-10 shadow-lg shadow-black/20`}>
                        <Icon size={18} className="text-white" />
                      </div>
                      <h3 className="text-lg font-bold font-orbitron text-white">
                        {cat.label}
                      </h3>
                    </div>

                    {/* Category Skills */}
                    <div className="space-y-6">
                      {categorySkills.map((skill, i) => (
                        <div key={skill.name} className="group">
                          <div className="flex justify-between items-end mb-2">
                            <span className="text-sm font-space font-semibold text-slate-200 group-hover:text-white transition-colors">
                              {skill.name}
                            </span>
                            <span className={`text-xs font-bold font-space bg-clip-text text-transparent bg-gradient-to-r ${getGradient(cat.key)}`}>
                              {skill.level}%
                            </span>
                          </div>

                          {/* Progress bar track */}
                          <div className="h-2 rounded-full bg-slate-800/80 border border-white/5 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.2, delay: groupIndex * 0.1 + i * 0.05, ease: "easeOut" }}
                              className="h-full rounded-full relative"
                              style={{
                                background: getGradientCSS(cat.key),
                                boxShadow: `0 0 10px rgba(34,211,238,${skill.level > 80 ? 0.4 : 0.2})`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
