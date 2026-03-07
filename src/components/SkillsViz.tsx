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
  const [active, setActive] = useState<string>("all");
  const { skills, loading } = useSkills();

  const filtered = active === "all" ? skills : skills.filter((s) => s.category === active);

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

  return (
    <section id="skills" className="section-padding relative overflow-hidden">
      <div className="absolute top-1/4 -left-16 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-16 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 grid-pattern opacity-15 pointer-events-none" />

      <div className="container max-w-4xl mx-auto relative z-10">
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
                animate={{
                  scale: [1, 1.4, 1],
                  rotate: [0, 15, -15, 0],
                }}
                transition={{ duration: 2.5, repeat: Infinity }}
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

          {/* Category filters */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-12">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <motion.button
                  key={cat.key}
                  onClick={() => setActive(cat.key)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-1.5 text-xs font-space font-semibold px-4 py-2.5 rounded-xl transition-all relative overflow-hidden ${active === cat.key
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/40"
                    : "glass-card text-muted-foreground hover:text-cyan-300 hover:border-cyan-500/50"
                    }`}
                >
                  <Icon size={13} />
                  {cat.label}

                  {active === cat.key && (
                    <>
                      <motion.div
                        layoutId="activePill"
                        className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-xl"
                        initial={false}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                      {/* Shimmer sweep */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer rounded-xl" />
                    </>
                  )}
                </motion.button>
              );
            })}
          </motion.div>

          {/* Skill bars */}
          {loading ? (
            <motion.div variants={fadeUp} className="space-y-5">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="glass-card rounded-xl p-4 animate-pulse">
                  <div className="h-4 bg-slate-700 rounded w-1/3 mb-3" />
                  <div className="h-3 bg-slate-700 rounded w-full" />
                </div>
              ))}
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                {filtered.map((skill, i) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, type: "spring", stiffness: 150 }}
                    className="group glass-card rounded-xl p-4 hover:border-cyan-500/40 transition-all"
                    whileHover={{ x: 4 }}
                  >
                    {/* Name + percentage */}
                    <div className="flex justify-between items-center mb-3">
                      <motion.span
                        className={`text-sm font-semibold font-space bg-clip-text text-transparent bg-gradient-to-r ${getGradient(skill.category)}`}
                        whileHover={{ letterSpacing: "0.05em" }}
                        transition={{ duration: 0.2 }}
                      >
                        {skill.name}
                      </motion.span>
                      <motion.span
                        className="text-xs font-bold font-orbitron text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/30"
                        whileHover={{ scale: 1.15, boxShadow: "0 0 10px rgba(34,211,238,0.4)" }}
                      >
                        {skill.level}%
                      </motion.span>
                    </div>

                    {/* Progress bar track */}
                    <div className="h-2.5 rounded-full bg-slate-800/60 border border-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: i * 0.06, ease: [0.2, 0.9, 0.3, 1] }}
                        className="h-full rounded-full relative"
                        style={{
                          background: getGradientCSS(skill.category),
                          boxShadow: `0 0 12px rgba(34,211,238,${skill.level > 80 ? 0.6 : 0.3})`,
                        }}
                      >
                        {/* Shimmer sweep inside bar */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent rounded-full"
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: i * 0.1 }}
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </section>
  );
}
