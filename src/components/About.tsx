import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motions";
import { about } from "@/lib/data";
import { 
  Code2, 
  Cpu, 
  GraduationCap, 
  Sparkles, 
  Star 
} from "lucide-react";
import { usePortfolioCounts } from "@/hooks/use-portfolio-data";
import profileImg from "@/assets/profile.jpeg";
import { useState, useEffect } from "react";

function CountUp({ to }: { to: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    if (to <= 0) return;
    const end = to;
    const duration = 1200; // 1.2s count up duration
    const stepTime = Math.max(Math.floor(duration / end), 20);

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [to]);

  return <span>{count}+</span>;
}

/** Display a count or a loading pulse skeleton */
function CountBadge({ value, loading }: { value: number; loading: boolean }) {
  if (loading) {
    return (
      <span className="inline-block w-8 h-6 rounded-md bg-slate-700/35 animate-pulse" />
    );
  }
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <CountUp to={value} />
    </motion.span>
  );
}

export default function About() {
  const { counts, loading: countsLoading } = usePortfolioCounts();

  const stats = [
    {
      value: <CountBadge value={3} loading={false} />,
      label: "Years Coding",
      icon: Code2,
      desc: "Developing systems"
    },
    {
      value: <CountBadge value={counts.projects} loading={countsLoading} />,
      label: "Projects Built",
      icon: Cpu,
      desc: "Models & dashboards"
    },
    {
      value: <CountBadge value={counts.skills} loading={countsLoading} />,
      label: "Skills Mastered",
      icon: Sparkles,
      desc: "Languages & models"
    },
    {
      value: <CountBadge value={counts.education} loading={countsLoading} />,
      label: "Qualifications",
      icon: GraduationCap,
      desc: "Degrees & certs"
    },
  ];

  return (
    <section id="about" className="section-padding relative overflow-hidden bg-background">
      {/* Visual background decor elements */}

      
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-20px" }}
        className="container max-w-6xl mx-auto relative z-10 space-y-12"
      >
        {/* Section Header */}
        <motion.div variants={fadeUp} className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[#00FF88]">
              <Star size={16} fill="currentColor" />
            </span>
            <p className="font-mono text-xs text-zinc-400 tracking-widest uppercase">
              About
            </p>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold font-space tracking-tight text-white">
            Who <span className="text-[#00FF88] text-gradient">I Am</span>
          </h2>

          <div className="mt-4 h-px w-full bg-[rgba(255,255,255,0.08)] relative">
            <div className="absolute top-0 left-0 h-px w-24 bg-[#00FF88]" />
          </div>
        </motion.div>

        {/* Row 1: Profile Image & Bio Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Profile Photo Container */}
          <motion.div 
            variants={fadeUp} 
            className="lg:col-span-5 flex flex-col items-center justify-center relative w-full max-w-sm mx-auto select-none"
          >
            {/* Ambient shadow glow behind profile */}
            <div className="absolute inset-0 bg-[#00FF88]/10 rounded-2xl blur-2xl -z-10" />

            {/* Simple and attractive frame wrapper */}
            <div className="relative p-1 rounded-2xl bg-gradient-to-br from-[#00FF88]/20 via-transparent to-[#22d3ee]/20 group w-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-pointer">
              {/* Photo Area */}
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-slate-900 border border-[rgba(255,255,255,0.04)]">
                <img 
                  src={profileImg} 
                  alt={about.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            {/* Quick Stats Overlay Tags - simplified and static */}
            <div className="absolute -bottom-3 right-4 bg-[#0B1220] border border-[#00FF88]/30 px-3 py-1.5 rounded-lg text-[10px] font-mono text-[#00FF88] shadow-lg flex items-center gap-1.5 hover:border-[#00FF88] transition-all">
              <span>#</span> AI // DATA SCIENCE
            </div>
          </motion.div>

          {/* Biography, Quote & Stats Dossier */}
          <motion.div 
            variants={fadeUp} 
            className="lg:col-span-7 space-y-6"
          >
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-space">
              {about.bio}
            </p>

            {/* Glowing quote box */}
            <div className="pl-4 border-l-2 border-[#00FF88] bg-[#00FF88]/[0.02] p-4 rounded-r-xl relative py-3 border-[rgba(255,255,255,0.04)] border">
              <p className="text-sm text-zinc-200 italic font-space tracking-wide">
                "Turning ideas into digital experiences — one line at a time."
              </p>
            </div>

            {/* System Milestones 2-column grid directly under Who Am I info */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              {stats.map(({ value, label, icon: Icon, desc }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, type: "spring", stiffness: 80 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="glass-card rounded-xl p-4 border border-[rgba(255,255,255,0.06)] bg-[#0B1220]/45 backdrop-blur-xl hover:border-[#00FF88]/30 hover:shadow-[0_0_25px_rgba(0,255,136,0.06)] transition-all duration-300 group flex items-start gap-4 overflow-hidden relative"
                >
                  {/* Subtle inner hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00FF88]/[0.01] to-[#22d3ee]/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <div className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] text-zinc-400 group-hover:text-[#00FF88] group-hover:border-[#00FF88]/35 flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
                    <Icon size={16} className="transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                  </div>

                  <div className="space-y-0.5 min-w-0 z-10">
                    <div className="text-xl font-bold font-space text-white group-hover:text-[#00FF88] transition-colors duration-300 flex items-center">
                      {value}
                    </div>
                    <p className="text-xs font-semibold text-zinc-300 font-space truncate">{label}</p>
                    <p className="text-[10px] text-zinc-500 font-space leading-tight truncate">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
