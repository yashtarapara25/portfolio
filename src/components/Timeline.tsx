import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "@/lib/motions";
import { useEducation } from "@/hooks/use-portfolio-data";
import { BookOpen, GraduationCap, Calendar } from "lucide-react";

export default function Timeline() {
  const { education, loading } = useEducation();

  return (
    <section id="education" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
      <div className="absolute inset-0 grid-pattern opacity-15 pointer-events-none" />
      <div className="absolute top-20 right-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-blob pointer-events-none" />

      <div className="container max-w-4xl mx-auto relative z-10">
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
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="text-blue-400"
              >
                <BookOpen size={18} />
              </motion.span>
              <p className="font-display text-sm text-blue-400 tracking-widest uppercase">
                // education
              </p>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-orbitron leading-tight">
              <span className="text-gradient-animated">Education &amp; Learning</span>
            </h2>
            <motion.div
              className="mt-3 h-0.5 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 rounded-full"
              initial={{ scaleX: 0, originX: "left" }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              style={{ width: "180px" }}
            />
          </motion.div>

          {loading ? (
            <motion.div variants={fadeUp} className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="glass-card rounded-xl p-6 animate-pulse flex gap-6">
                  <div className="w-12 h-12 bg-slate-700 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-slate-700 rounded w-2/3" />
                    <div className="h-3 bg-slate-700 rounded w-1/2" />
                    <div className="h-3 bg-slate-700 rounded w-full" />
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <div className="relative">
              {/* Animated vertical line */}
              <div className="absolute left-5 md:left-7 top-0 bottom-0 w-px overflow-hidden">
                <motion.div
                  className="w-full h-full bg-gradient-to-b from-cyan-500 via-blue-500 to-purple-600"
                  initial={{ scaleY: 0, originY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
                {/* Glowing orb descending the line */}
                <motion.div
                  className="absolute w-2 h-2 rounded-full bg-cyan-400 left-1/2 -translate-x-1/2 blur-sm"
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>

              <div className="space-y-10">
                {education.map((edu, i) => (
                  <motion.div
                    key={edu.id}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: i * 0.12, type: "spring", stiffness: 120 }}
                    className="relative pl-14 md:pl-20 group"
                  >
                    {/* Timeline dot with ping */}
                    <div className="absolute left-3 md:left-5 top-3">
                      <motion.div
                        className="w-5 h-5 rounded-full border-2 border-cyan-400 bg-slate-900 flex items-center justify-center"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 250, delay: i * 0.12 }}
                        whileHover={{ scale: 1.4, boxShadow: "0 0 20px rgba(34,211,238,0.8)" }}
                      >
                        <motion.div
                          className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                        />
                      </motion.div>
                      {/* Ping ring */}
                      <div className="absolute inset-0 rounded-full border border-cyan-400/40 animate-ping-slow" />
                    </div>

                    {/* Year badge */}
                    <motion.div
                      className="inline-flex items-center gap-1.5 font-display text-xs font-bold px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/40 text-cyan-300 mb-3"
                      initial={{ opacity: 0, y: -8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.12 + 0.15 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Calendar size={11} />
                      {edu.year}
                    </motion.div>

                    {/* Card */}
                    <motion.div
                      whileHover={{ x: 8, boxShadow: "0 15px 40px rgba(34,211,238,0.15)" }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="glass-card rounded-xl p-5 group-hover:border-cyan-500/40 transition-all relative overflow-hidden"
                    >
                      {/* Hover gradient wash */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      />

                      <div className="relative z-10 flex gap-4">
                        {/* Icon */}
                        <motion.div
                          className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30"
                          whileHover={{ rotate: 15, scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <GraduationCap size={20} className="text-white" />
                        </motion.div>

                        <div className="flex-1 min-w-0">
                          <motion.h3
                            className="text-lg font-bold font-space text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400 mb-1 leading-tight"
                            whileHover={{ letterSpacing: "0.02em" }}
                            transition={{ duration: 0.2 }}
                          >
                            {edu.institution}
                          </motion.h3>
                          <p className="text-sm font-semibold text-blue-300/80 mb-2 font-rajdhani tracking-wide">
                            {edu.degree}
                          </p>
                          <p className="text-sm text-muted-foreground leading-relaxed font-space">
                            {edu.summary}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
