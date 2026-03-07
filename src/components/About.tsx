import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motions";
import { about } from "@/lib/data";
import { Code2, Cpu, GraduationCap, Sparkles, Star } from "lucide-react";
import { usePortfolioCounts } from "@/hooks/use-portfolio-data";

const colorMap: Record<string, string> = {
  cyan: "from-cyan-400 to-cyan-600 shadow-cyan-500/40",
  blue: "from-blue-400 to-blue-600 shadow-blue-500/40",
  purple: "from-purple-400 to-purple-600 shadow-purple-500/40",
  pink: "from-pink-400 to-pink-600 shadow-pink-500/40",
};

/** Display a count or "—" skeleton while loading */
function CountBadge({ value, loading }: { value: number; loading: boolean }) {
  if (loading) {
    return (
      <span className="inline-block w-10 h-7 rounded-md bg-slate-700/60 animate-pulse" />
    );
  }
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {value}+
    </motion.span>
  );
}

export default function About() {
  const { counts, loading } = usePortfolioCounts();

  const stats = [
    {
      value: <CountBadge value={3} loading={false} />,     // Years coding — keep static
      rawValue: "3+",
      label: "Years Coding",
      icon: Code2,
      color: "cyan",
    },
    {
      value: <CountBadge value={counts.projects} loading={loading} />,
      rawValue: loading ? "…" : `${counts.projects}+`,
      label: "Projects Built",
      icon: Cpu,
      color: "blue",
    },
    {
      value: <CountBadge value={counts.skills} loading={loading} />,
      rawValue: loading ? "…" : `${counts.skills}+`,
      label: "Skills Mastered",
      icon: Sparkles,
      color: "purple",
    },
    {
      value: <CountBadge value={counts.education} loading={loading} />,
      rawValue: loading ? "…" : `${counts.education}+`,
      label: "Qualifications",
      icon: GraduationCap,
      color: "pink",
    },
  ];

  return (
    <section id="about" className="section-padding relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-10 right-10 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="container max-w-5xl mx-auto relative z-10"
      >
        {/* Section header */}
        <motion.div variants={fadeUp} className="mb-14">
          <div className="flex items-center gap-2 mb-3">
            <motion.span
              whileHover={{ rotate: 180, scale: 1.2 }}
              transition={{ duration: 0.5 }}
              className="text-cyan-400"
            >
              <Star size={16} fill="currentColor" />
            </motion.span>
            <p className="font-display text-sm text-cyan-400 tracking-widest uppercase">
              // about
            </p>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold font-orbitron leading-tight">
            <span className="text-gradient-animated">Who I Am</span>
          </h2>

          <motion.div
            className="mt-3 h-0.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full"
            initial={{ scaleX: 0, originX: "left" }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{ width: "120px" }}
          />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-14 items-center">
          {/* Bio */}
          <motion.div variants={fadeUp}>
            <motion.p
              initial={{ opacity: 0, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-muted-foreground text-lg leading-relaxed font-space"
            >
              {about.bio}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 pl-4 border-l-2 border-cyan-500/50 relative">
              <motion.div
                className="absolute -left-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 to-purple-500"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
              />
              <p className="text-sm text-cyan-300/70 italic font-rajdhani tracking-wide">
                "Turning ideas into digital experiences — one line at a time."
              </p>
            </motion.div>
          </motion.div>

          {/* Dynamic Stats grid */}
          <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
            {stats.map(({ value, label, icon: Icon, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="glass-card rounded-xl p-5 text-center cursor-default group"
              >
                <motion.div
                  className={`w-10 h-10 mx-auto mb-3 rounded-lg bg-gradient-to-br ${colorMap[color]} flex items-center justify-center shadow-lg`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Icon size={18} className="text-white" />
                </motion.div>

                {/* Dynamic value with pulsing gradient text */}
                <motion.div
                  className="text-2xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400 min-h-[2rem] flex items-center justify-center"
                  // Removed repeat: Infinity
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  {value}
                </motion.div>

                <p className="text-xs text-muted-foreground mt-1 font-space">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
