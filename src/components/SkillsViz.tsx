import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "@/lib/motions";
import { useSkills } from "@/hooks/use-portfolio-data";
import { Zap, Code, Layers, Brain, Wrench } from "lucide-react";

export default function SkillsViz() {
  const { skills, loading } = useSkills();

  return (
    <section id="skills" className="section-padding relative overflow-hidden bg-background">
      <div className="container max-w-6xl mx-auto relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20px" }}
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="mb-14">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[#00FF88]">
                <Zap size={16} />
              </span>
              <p className="font-mono text-xs text-zinc-400 tracking-widest uppercase">
                Tech Stack
              </p>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold font-space tracking-tight text-white">
              Skills &amp; <span className="text-[#00FF88] text-gradient">Technologies</span>
            </h2>
            <div className="mt-4 h-px w-full bg-[rgba(255,255,255,0.08)] relative">
              <div className="absolute top-0 left-0 h-px w-24 bg-[#00FF88]" />
            </div>
          </motion.div>

          {/* High-tech HUD Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="glass-card rounded-xl p-6 border border-[rgba(255,255,255,0.06)] bg-[#0B1220]/30 animate-pulse min-h-[220px]">
                  <div className="h-5 w-1/2 bg-slate-700/35 rounded-md mb-6" />
                  <div className="space-y-3">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="h-4 bg-slate-700/35 rounded w-full" />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <>
                {/* 1. Languages Card */}
                {(() => {
                  const items = skills.filter((s) => s.category?.trim().toLowerCase() === "languages");
                  if (items.length === 0) return null;
                  const sorted = [...items].sort((a, b) => b.level - a.level);
                  return (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={fadeUp}
                      whileHover={{ y: -6, scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="group relative rounded-xl p-6 border border-[rgba(255,255,255,0.06)] bg-[#0B1220]/45 backdrop-blur-xl hover:border-[#00FF88]/30 hover:shadow-[0_0_30px_rgba(0,255,136,0.08)] transition-all duration-300 flex flex-col justify-between cursor-pointer"
                    >
                      {/* Laser scanning sweep — CSS transform (GPU, zero layout cost) */}
                      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none z-10">
                        <div className="hud-scan opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Corner Brackets */}
                      <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#00FF88]/20 group-hover:border-[#00FF88]/60 transition-colors duration-300 pointer-events-none" />
                      <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#00FF88]/20 group-hover:border-[#00FF88]/60 transition-colors duration-300 pointer-events-none" />
                      <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-[#00FF88]/20 group-hover:border-[#00FF88]/60 transition-colors duration-300 pointer-events-none" />
                      <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-[#00FF88]/20 group-hover:border-[#00FF88]/60 transition-colors duration-300 pointer-events-none" />

                      <div>
                        {/* Header indicators */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                            <span className="text-[#00FF88] opacity-80">
                              <Code size={16} />
                            </span>
                            <h3 className="text-sm font-bold font-space text-white">Languages</h3>
                          </div>
                          <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">
                            SYS: LANG
                          </span>
                        </div>

                        <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1.5 cert-scroll">
                          {sorted.map((skill) => {
                            const filledDots = Math.round((skill.level || 80) / 20);
                            return (
                              <div key={skill.name} className="flex items-center justify-between font-space py-1.5 border-b border-[rgba(255,255,255,0.03)] last:border-none">
                                <span className="text-xs text-zinc-300 font-semibold group-hover:text-white transition-colors duration-300">{skill.name}</span>
                                <div className="flex gap-1.5">
                                  {Array.from({ length: 5 }).map((_, idx) => (
                                    <span
                                      key={idx}
                                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                        idx < filledDots
                                          ? "bg-[#00FF88] shadow-[0_0_6px_rgba(0,255,136,0.8)]"
                                          : "bg-zinc-800"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}

                {/* 2. Frameworks & Libs Card */}
                {(() => {
                  const items = skills.filter((s) => s.category?.trim().toLowerCase() === "frameworks");
                  if (items.length === 0) return null;
                  const sorted = [...items].sort((a, b) => b.level - a.level);
                  return (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={fadeUp}
                      whileHover={{ y: -6, scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="group relative rounded-xl p-6 border border-[rgba(255,255,255,0.06)] bg-[#0B1220]/45 backdrop-blur-xl hover:border-[#00FF88]/30 hover:shadow-[0_0_30px_rgba(0,255,136,0.08)] transition-all duration-300 flex flex-col justify-between cursor-pointer"
                    >
                      {/* Laser scanning sweep — CSS transform (GPU, zero layout cost) */}
                      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none z-10">
                        <div className="hud-scan hud-scan-delay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Corner Brackets */}
                      <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#00FF88]/20 group-hover:border-[#00FF88]/60 transition-colors duration-300 pointer-events-none" />
                      <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#00FF88]/20 group-hover:border-[#00FF88]/60 transition-colors duration-300 pointer-events-none" />
                      <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-[#00FF88]/20 group-hover:border-[#00FF88]/60 transition-colors duration-300 pointer-events-none" />
                      <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-[#00FF88]/20 group-hover:border-[#00FF88]/60 transition-colors duration-300 pointer-events-none" />

                      <div>
                        {/* Header indicators */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                            <span className="text-[#00FF88] opacity-80">
                              <Layers size={16} />
                            </span>
                            <h3 className="text-sm font-bold font-space text-white">Frameworks</h3>
                          </div>
                          <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">
                            SYS: FRAME
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 max-h-[380px] overflow-y-auto pr-1.5 cert-scroll">
                          {sorted.map((skill) => (
                            <span
                              key={skill.name}
                              className="text-xs font-mono px-3 py-1.5 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] text-zinc-300 hover:border-[#00FF88]/30 hover:text-white hover:bg-[#00FF88]/5 hover:shadow-[0_0_10px_rgba(0,255,136,0.1)] transition-all duration-200 cursor-default flex items-center gap-1.5"
                            >
                              <span className="w-1 h-1 rounded-full bg-zinc-600 group-hover:bg-[#00FF88] transition-colors duration-300" />
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}

                {/* 3. AI & ML (Core Focus Area) */}
                {(() => {
                  const items = skills.filter((s) => {
                    const cat = s.category?.trim().toLowerCase();
                    return cat === "ai-ml" || cat === "ai/ml" || cat === "ai & ml" || cat === "ai ml" || cat === "ai_ml" || cat === "ai" || cat === "ml";
                  });
                  if (items.length === 0) return null;
                  const sorted = [...items].sort((a, b) => b.level - a.level);
                  return (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={fadeUp}
                      whileHover={{ y: -6, scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="group relative rounded-xl p-6 border border-[#00FF88]/30 bg-[#0B1220]/60 backdrop-blur-xl hover:border-[#00FF88]/50 hover:shadow-[0_0_30px_rgba(0,255,136,0.1)] transition-all duration-300 flex flex-col justify-between cursor-pointer"
                    >
                      {/* Special Focus Indicator Tag */}
                      <div className="absolute -top-2.5 right-4 px-2 py-0.5 rounded bg-[#00FF88] text-[#050816] text-[9px] font-mono uppercase font-extrabold tracking-widest shadow-[0_0_10px_rgba(0,255,136,0.4)] z-20">
                        Focus
                      </div>

                      {/* Laser scanning sweep — CSS transform (GPU, zero layout cost) */}
                      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none z-10">
                        <div className="hud-scan-thick" />
                      </div>

                      {/* Corner Brackets */}
                      <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#00FF88]/60 pointer-events-none" />
                      <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#00FF88]/60 pointer-events-none" />
                      <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-[#00FF88]/60 pointer-events-none" />
                      <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-[#00FF88]/60 pointer-events-none" />

                      <div>
                        {/* Header indicators */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                            <span className="text-[#00FF88] opacity-90">
                              <Brain size={16} />
                            </span>
                            <h3 className="text-sm font-bold font-space text-white">AI / ML</h3>
                          </div>
                          <span className="text-[8px] font-mono text-[#00FF88] uppercase tracking-widest font-semibold">
                            SYS: AI_CORE
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 max-h-[380px] overflow-y-auto pr-1.5 cert-scroll">
                          {sorted.map((skill) => (
                            <span
                              key={skill.name}
                              className="text-xs font-mono px-3 py-1.5 rounded-lg border border-[#00FF88]/20 bg-[#00FF88]/5 text-white hover:border-[#00FF88] hover:shadow-[0_0_15px_rgba(0,255,136,0.15)] transition-all duration-200 cursor-default flex items-center gap-1.5"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse" />
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}

                {/* 4. Tools & Infra Card */}
                {(() => {
                  const items = skills.filter((s) => s.category?.trim().toLowerCase() === "tools");
                  if (items.length === 0) return null;
                  const sorted = [...items].sort((a, b) => b.level - a.level);
                  return (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={fadeUp}
                      whileHover={{ y: -6, scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="group relative rounded-xl p-6 border border-[rgba(255,255,255,0.06)] bg-[#0B1220]/45 backdrop-blur-xl hover:border-[#00FF88]/30 hover:shadow-[0_0_30px_rgba(0,255,136,0.08)] transition-all duration-300 flex flex-col justify-between cursor-pointer"
                    >
                      {/* Laser scanning sweep — CSS transform (GPU, zero layout cost) */}
                      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none z-10">
                        <div className="hud-scan hud-scan-delay-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Corner Brackets */}
                      <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#00FF88]/20 group-hover:border-[#00FF88]/60 transition-colors duration-300 pointer-events-none" />
                      <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#00FF88]/20 group-hover:border-[#00FF88]/60 transition-colors duration-300 pointer-events-none" />
                      <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-[#00FF88]/20 group-hover:border-[#00FF88]/60 transition-colors duration-300 pointer-events-none" />
                      <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-[#00FF88]/20 group-hover:border-[#00FF88]/60 transition-colors duration-300 pointer-events-none" />

                      <div>
                        {/* Header indicators */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                            <span className="text-[#00FF88] opacity-80">
                              <Wrench size={16} />
                            </span>
                            <h3 className="text-sm font-bold font-space text-white">Infrastructure</h3>
                          </div>
                          <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">
                            SYS: INFRA
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 max-h-[380px] overflow-y-auto pr-1.5 cert-scroll">
                          {sorted.map((skill) => (
                            <span
                              key={skill.name}
                              className="text-xs font-mono px-3 py-1.5 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] text-zinc-300 hover:border-[#00FF88]/30 hover:text-white hover:bg-[#00FF88]/5 hover:shadow-[0_0_10px_rgba(0,255,136,0.1)] transition-all duration-200 cursor-default flex items-center gap-1.5"
                            >
                              <span className="w-1 h-1 rounded-full bg-zinc-600 group-hover:bg-[#00FF88] transition-colors duration-300" />
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
