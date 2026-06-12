import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, fadeUp } from "@/lib/motions";
import { useEducation } from "@/hooks/use-portfolio-data";
import { BookOpen, GraduationCap, Cpu, Shield, Terminal } from "lucide-react";

export default function Timeline() {
  const { education, loading } = useEducation();
  const [activeIndex, setActiveIndex] = useState(0);

  const activeEdu = education[activeIndex];

  return (
    <section id="education" className="section-padding relative overflow-hidden bg-background">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Background glow effects */}


      <div className="container max-w-5xl mx-auto relative z-10">
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
                <BookOpen size={16} />
              </span>
              <p className="font-mono text-xs text-zinc-400 tracking-widest uppercase">
                Education
              </p>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold font-space tracking-tight text-white">
              Academic <span className="text-[#00FF88] text-gradient">Registry</span>
            </h2>
            <div className="mt-4 h-px w-full bg-[rgba(255,255,255,0.08)] relative">
              <div className="absolute top-0 left-0 h-px w-24 bg-[#00FF88]" />
            </div>
          </motion.div>

          {loading ? (
            /* Loading Skeleton */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 min-h-[350px]">
              <div className="md:col-span-4 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 rounded-xl bg-slate-800/20 border border-[rgba(255,255,255,0.04)] animate-pulse" />
                ))}
              </div>
              <div className="md:col-span-8 h-[350px] rounded-xl bg-[#0B1220]/30 border border-[rgba(255,255,255,0.06)] animate-pulse" />
            </div>
          ) : education.length === 0 ? (
            <div className="text-center py-10 font-mono text-xs text-zinc-500">
              NO EDUCATION REGISTRY RECORDED.
            </div>
          ) : (
            <div className="space-y-6 md:space-y-0">
              
              {/* Mobile Selector: Horizontal scroll tab bar */}
              <div className="flex md:hidden gap-3 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar">
                {education.map((edu, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={edu.id}
                      onClick={() => setActiveIndex(idx)}
                      className={`flex-shrink-0 snap-start px-5 py-3 rounded-xl border flex items-center gap-3 transition-all duration-300 ${
                        isActive
                          ? "border-[#00FF88]/45 bg-[#00FF88]/10 text-white shadow-[0_0_15px_rgba(0,255,136,0.05)]"
                          : "border-[rgba(255,255,255,0.06)] bg-[#0B1220]/35 text-zinc-400"
                      }`}
                    >
                      <span className={`font-mono text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                        isActive ? "bg-[#00FF88]/20 text-white" : "bg-zinc-800 text-zinc-500"
                      }`}>
                        NODE_0{idx + 1}
                      </span>
                      <span className="text-sm font-bold font-space whitespace-nowrap">{edu.institution}</span>
                    </button>
                  );
                })}
              </div>

              {/* Main Desktop Dashboard Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                
                {/* Left side rack of selectors (Hidden on Mobile) */}
                <div className="hidden md:flex md:col-span-5 flex-col">
                  {/* Section label */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-px flex-1 bg-[rgba(255,255,255,0.06)]" />
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-[0.2em]">
                      Node Registry
                    </span>
                    <div className="h-px flex-1 bg-[rgba(255,255,255,0.06)]" />
                  </div>

                  {/* Cards */}
                  <div className="flex-1 flex flex-col justify-center relative">
                    <div className="flex flex-col gap-4 max-h-[380px] overflow-y-auto pr-1.5 cert-scroll">
                    {education.map((edu, idx) => {
                      const isActive = idx === activeIndex;
                      return (
                        <motion.button
                          key={edu.id}
                          onClick={() => setActiveIndex(idx)}
                          whileHover={{ x: 4, scale: 1.01 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          className={`w-full text-left rounded-2xl border transition-all duration-300 relative group cursor-pointer overflow-hidden ${
                            isActive
                              ? "border-[#00FF88]/35 bg-[#0B1220]/50 shadow-[0_0_20px_rgba(0,255,136,0.06),inset_0_1px_0_rgba(0,255,136,0.06)]"
                              : "border-[rgba(255,255,255,0.06)] bg-[#0B1220]/40 hover:border-[rgba(255,255,255,0.12)] hover:bg-[#0B1220]/60"
                          }`}
                        >
                          {/* Active left glow bar */}
                          <div className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl transition-all duration-500 ${
                            isActive
                              ? "bg-gradient-to-b from-[#00FF88] to-[#00FF88]/40 shadow-[2px_0_12px_rgba(0,255,136,0.5)]"
                              : "bg-transparent group-hover:bg-[#00FF88]/20"
                          }`} />

                          {/* Scan sweep on active */}
                          {isActive && (
                            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                              <div className="hud-scan-slow" />
                            </div>
                          )}

                          <div className="p-4 pl-5">
                            {/* Top row: Node badge + status */}
                            <div className="flex items-center justify-between mb-3">
                              <div className={`font-mono text-[9px] font-bold px-2.5 py-1 rounded-lg border transition-all duration-300 ${
                                isActive
                                  ? "bg-[#00FF88]/15 border-[#00FF88]/30 text-white shadow-[0_0_8px_rgba(0,255,136,0.2)]"
                                  : "bg-zinc-900/50 border-zinc-800 text-zinc-500"
                              }`}>
                                NODE_0{idx + 1}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                  isActive ? "bg-[#00FF88] shadow-[0_0_6px_#00FF88] animate-pulse" : "bg-zinc-700 group-hover:bg-zinc-500"
                                }`} />
                                <span className={`text-[8px] font-mono uppercase tracking-wider transition-colors duration-300 ${
                                  isActive ? "text-[#00FF88] font-semibold" : "text-zinc-600 group-hover:text-zinc-400"
                                }`}>
                                  {isActive ? "ACTIVE" : "SELECT"}
                                </span>
                              </div>
                            </div>

                            {/* Institution name */}
                            <h4 className={`text-base font-bold font-space leading-snug transition-colors duration-300 mb-1.5 ${
                              isActive ? "text-[#00FF88]" : "text-zinc-400 group-hover:text-zinc-200"
                            }`}>
                              {edu.institution}
                            </h4>

                            {/* Degree (truncated) */}
                            <p className={`text-xs font-mono truncate transition-colors duration-300 mb-2.5 ${
                              isActive ? "text-white" : "text-zinc-600 group-hover:text-zinc-500"
                            }`}>
                              {edu.degree}
                            </p>

                            {/* Year tag */}
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-mono transition-all duration-300 ${
                              isActive
                                ? "border-[#00FF88]/30 bg-[#00FF88]/10 text-white shadow-[0_0_10px_rgba(0,255,136,0.1)]"
                                : "border-zinc-800/60 bg-zinc-900/20 text-zinc-500"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-[#00FF88]" : "bg-zinc-700"}`} />
                              {edu.year}
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                    </div>
                  </div> {/* end cards wrapper */}

                  {/* Bottom registry count */}
                  <div className="flex items-center justify-between mt-4 px-1 pt-3 border-t border-[rgba(255,255,255,0.04)]">
                    <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider">
                      Total Nodes
                    </span>
                    <span className="text-[9px] font-mono text-[#00FF88]/50 font-bold">
                      {String(education.length).padStart(2, "0")} / {String(education.length).padStart(2, "0")} LOADED
                    </span>
                  </div>
                </div>

                {/* Right side: Detailed Terminal Dossier Card */}
                <div className="md:col-span-7 flex flex-col">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2 pl-1 hidden md:block">
                    Memory Module Decrypter
                  </div>
                  
                  <div className="relative p-6 sm:p-8 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#0B1220]/45 backdrop-blur-xl transition-all duration-300 shadow-2xl flex-1 flex flex-col justify-between">
                    
                    {/* Laser scanning sweep — CSS transform (GPU, zero layout cost) */}
                    <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-10">
                      <div className="hud-scan" />
                    </div>

                    {/* Corner Brackets */}
                    <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#00FF88]/30 pointer-events-none" />
                    <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#00FF88]/30 pointer-events-none" />
                    <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#00FF88]/30 pointer-events-none" />
                    <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#00FF88]/30 pointer-events-none" />

                    <AnimatePresence mode="wait">
                      {activeEdu && (
                        <motion.div
                          key={activeIndex}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -12 }}
                          transition={{ duration: 0.35, ease: [0.2, 0.9, 0.3, 1] }}
                          className="flex flex-col h-full justify-between gap-6"
                        >
                          <div>
                            {/* Header log indicator */}
                            <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.05)] pb-4 mb-6">
                              <div className="flex items-center gap-2">
                                <span className="text-[#00FF88] opacity-80 animate-pulse text-[8px]">●</span>
                                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                                  SYS_LOG // ACAD_NODE_0{activeIndex + 1}
                                </span>
                              </div>
                              <span className="text-[8px] font-mono text-white border border-[#00FF88]/30 px-2 py-0.5 bg-[#00FF88]/5 rounded-md uppercase font-semibold flex items-center gap-1.5 shadow-[0_0_8px_rgba(0,255,136,0.1)]">
                                <Shield size={10} className="text-[#00FF88]" />
                                VERIFIED
                              </span>
                            </div>

                            {/* Institution & Degree */}
                            <div className="flex items-start gap-4 mb-4">
                              <div className="w-12 h-12 rounded-xl bg-[#00FF88]/5 border border-[#00FF88]/20 text-[#00FF88] flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(0,255,136,0.06)]">
                                <GraduationCap size={22} />
                              </div>
                              <div className="min-w-0">
                                <h3 className="text-xl sm:text-2xl font-extrabold font-space text-white leading-snug">
                                  {activeEdu.institution}
                                </h3>
                                <p className="text-[11px] sm:text-xs font-mono text-[#00FF88] uppercase tracking-wider font-bold mt-1.5">
                                  {activeEdu.degree}
                                </p>
                              </div>
                            </div>

                            {/* Summary description */}
                            <div className="relative text-xs sm:text-sm text-zinc-300 leading-relaxed font-space bg-[#050816]/30 p-5 rounded-xl border border-[rgba(255,255,255,0.04)] my-5">
                              <div className="absolute top-0 left-4 h-px w-12 bg-[#00FF88]" />
                              {activeEdu.summary}
                            </div>
                          </div>

                          {/* Telemetry Logs Footer */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[9px] font-mono text-zinc-500 border-t border-[rgba(255,255,255,0.05)] pt-6 mt-auto">
                            <div className="space-y-1">
                              <p className="uppercase text-zinc-400 font-semibold flex items-center gap-1">
                                <Terminal size={10} className="text-[#00FF88]" />
                                DURATION
                              </p>
                              <p className="text-xs font-bold text-[#00FF88]">{activeEdu.year}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="uppercase text-zinc-400 font-semibold flex items-center gap-1">
                                <Cpu size={10} className="text-[#00FF88]" />
                                REGISTRY
                              </p>
                              <p className="text-[#00FF88]">ACTIVE // ONLINE</p>
                            </div>
                            <div className="space-y-1">
                              <p className="uppercase text-zinc-400 font-semibold flex items-center gap-1 text-[8px]">
                                ADDR_HEX
                              </p>
                              <p className="text-zinc-300">0xAC_N0{activeIndex + 1}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="uppercase text-zinc-400 font-semibold flex items-center gap-1 text-[8px]">
                                CONTEXT
                              </p>
                              <p className="text-[#00FF88]">SECURE</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
