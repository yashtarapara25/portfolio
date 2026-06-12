import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motions";
import { about } from "@/lib/data";
import { ArrowDown, Github, Linkedin, Sparkles, Download, Keyboard, Zap } from "lucide-react";
import profileImg from "@/assets/profile-portrait.jpg";
import AnimatedBackground from "./AnimatedBackground";
import { useState, useEffect } from "react";
import { useSiteSettings } from "@/hooks/use-portfolio-data";

// ─── Orbiting Code-Icon data ────────────────────────────────────────────
const CODE_ICONS = [
  { label: "</>", color: "#22d3ee" },
  { label: "{}", color: "#a855f7" },
  { label: "⚙", color: "#3b82f6" },
  { label: "#", color: "#ec4899" },
  { label: "[]", color: "#10b981" },
  { label: "=>", color: "#f59e0b" },
  { label: "⚡", color: "#22d3ee" },
  { label: "∅", color: "#a855f7" },
];

/** A single code-icon that orbits around the profile frame */
function OrbitIcon({
  label,
  color,
  index,
  total,
  radius,
}: {
  label: string;
  color: string;
  index: number;
  total: number;
  radius: number;
}) {
  const angle = (index / total) * 360;
  const duration = 12 + (index % 3) * 3; // each icon slightly different speed
  const delay = -(angle / 360) * duration; // stagger start positions

  return (
    <motion.div
      className="absolute top-1/2 left-1/2"
      style={{ width: 0, height: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear", delay }}
    >
      {/* the icon stays upright while its container rotates */}
      <motion.div
        style={{
          position: "absolute",
          left: radius,
          top: 0,
          transform: "translate(-50%, -50%)",
        }}
        animate={{ rotate: -360 }}
        transition={{ duration, repeat: Infinity, ease: "linear", delay }}
        whileHover={{ scale: 1.5 }}
      >
        <span
          className="block text-xs font-bold font-mono px-1.5 py-0.5 rounded-md select-none"
          style={{
            color,
            background: `${color}18`,
            border: `1px solid ${color}50`,
            boxShadow: `0 0 8px ${color}60`,
            textShadow: `0 0 6px ${color}`,
            fontSize: "10px",
            letterSpacing: "0.05em",
          }}
        >
          {label}
        </span>
      </motion.div>
    </motion.div>
  );
}

// ─── Resume Download Button ─────────────────────────────────────────────────
function ResumeButton() {
  const { settings } = useSiteSettings();
  const resumeUrl = settings.resume_url;

  if (!resumeUrl) {
    return (
      <motion.span
        whileHover={{ scale: 1.02 }}
        className="inline-flex items-center gap-2 px-8 py-4 rounded-lg border-2 border-slate-600/40 text-slate-500 font-semibold text-sm font-space cursor-not-allowed select-none"
      >
        <Download size={16} />
        Resume Coming Soon
      </motion.span>
    );
  }

  return (
    <motion.a
      href={resumeUrl}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.05, borderColor: "rgb(34,211,238)", boxShadow: "0 0 24px rgba(34,211,238,0.35)" }}
      whileTap={{ scale: 0.97 }}
      className="inline-flex items-center gap-2 px-8 py-4 rounded-lg border-2 border-cyan-500/40 text-foreground font-semibold hover:bg-cyan-500/8 transition-all text-sm font-space relative overflow-hidden group"
    >
      <motion.span
        animate={{ y: [0, 3, 0] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
      >
        <Download size={16} className="text-cyan-400" />
      </motion.span>
      Download Resume
      {/* shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
    </motion.a>
  );
}

export default function Hero() {
  const profileImage = profileImg;
  const { settings } = useSiteSettings();

  const ROLES = ["Data Analytics", "Data Scientist", "AI Engineer", "AI Developer"];
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setRoleIndex((i) => (i + 1) % ROLES.length), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated particle background */}
      <AnimatedBackground />

      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#080c18]/60 to-[#080c18]" />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 container max-w-6xl mx-auto px-6 pt-20 pb-20"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          {/* ── LEFT: Text Content ── */}
          <motion.div className="md:col-span-7 flex flex-col justify-center">
            {/* Hello badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00FF88]/20 bg-[#00FF88]/5 text-[10px] font-mono tracking-widest text-white mb-6 select-none w-fit hover:border-[#00FF88]/40 hover:bg-[#00FF88]/10 transition-colors duration-300"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF88] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF88]"></span>
              </span>
              HELLO, I'M
            </motion.div>

            {/* Name */}
            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-7xl lg:text-[86px] font-black font-space tracking-tight text-white mb-2 leading-[0.95] select-none flex flex-wrap gap-x-4"
            >
              <span>Tarapara</span>
              <motion.span
                className="bg-clip-text text-transparent bg-gradient-to-r from-[#00FF88] via-[#22d3ee] to-[#00FF88] bg-[length:200%_auto] select-none filter drop-shadow-[0_0_20px_rgba(0,255,136,0.35)]"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                Yash
              </motion.span>
            </motion.h1>

            {/* Roles — AnimatePresence word-swap */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex items-center gap-2 text-2xl md:text-3xl font-bold mt-2 min-h-[2.5rem] overflow-hidden text-[#00FF88] font-space"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={roleIndex}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  {ROLES[roleIndex]}
                </motion.span>
              </AnimatePresence>
              <Sparkles size={20} className="text-[#00FF88] animate-pulse flex-shrink-0" />
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-base md:text-lg text-zinc-400 max-w-xl mt-4 leading-relaxed font-space"
            >
              {about.tagline}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={fadeUp} 
              className="flex flex-wrap gap-4 mt-8"
            >
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#00FF88] text-[#050816] font-bold transition-all text-sm font-space hover:bg-[#00FF88]/90 shadow-[0_0_25px_rgba(0,255,136,0.2)]"
              >
                <Zap size={16} className="text-[#050816]" />
                <span>Let's Talk</span>
              </motion.a>

              <motion.a
                href={settings.resume_url || about.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-zinc-800 bg-[#0B1220]/45 backdrop-blur-xl text-white font-semibold hover:border-zinc-700 hover:text-[#00FF88] transition-all text-sm font-space"
              >
                <Download size={16} className="text-[#00FF88]" />
                <span>Download Resume</span>
              </motion.a>
            </motion.div>

            {/* Social Links */}
            <motion.div 
              variants={fadeUp} 
              className="flex items-center gap-3 mt-10"
            >
              {[
                { icon: Github, href: settings.github_url || about.github, label: "GitHub" },
                { icon: Linkedin, href: settings.linkedin_url || about.linkedin, label: "LinkedIn" },
                { icon: Keyboard, href: settings.monkeytype_url || about.monkeytype, label: "MonkeyType" },
              ].map(({ icon: Icon, href, label }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.08, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl border border-zinc-800 bg-[#0B1220]/45 backdrop-blur-md flex items-center justify-center text-zinc-400 hover:text-[#00FF88] hover:border-[#00FF88]/50 hover:bg-[#00FF88]/5 hover:shadow-[0_0_20px_rgba(0,255,136,0.25)] transition-all duration-300 group relative"
                >
                  <Icon size={18} className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 text-zinc-400 group-hover:text-[#00FF88]" />

                  {/* Pulsing ripple ring */}
                  <motion.div
                    className="absolute inset-0 rounded-xl border border-[#00FF88] pointer-events-none"
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileHover={{ scale: 1.3, opacity: [0, 0.4, 0] }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />

                  {/* High-tech cyberpunk tooltip */}
                  <span className="absolute opacity-0 group-hover:opacity-100 translate-y-2 group-hover:-translate-y-7 transition-all duration-300 whitespace-nowrap text-[10px] font-mono font-semibold px-2.5 py-1 rounded bg-[#0B1220]/95 border border-[#00FF88]/30 text-[#00FF88] shadow-[0_0_15px_rgba(0,255,136,0.15)] pointer-events-none left-1/2 -translate-x-1/2 z-20">
                    {label}
                  </span>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Profile Photo Container ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="md:col-span-5 flex items-center justify-center relative select-none"
          >
            {/* Orbiting Code Icons behind the profile card */}
            <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none scale-90 sm:scale-100">
              {CODE_ICONS.map((icon, i) => (
                <OrbitIcon
                  key={i}
                  label={icon.label}
                  color={icon.color}
                  index={i}
                  total={CODE_ICONS.length}
                  radius={225}
                />
              ))}
            </div>

            {/* Glowing spotlight container with continuous float and hover scale */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{ scale: 1.03, y: -14 }}
              className="relative w-full max-w-[420px] aspect-square rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#0B1220]/45 backdrop-blur-xl flex items-center justify-center overflow-hidden shadow-2xl group cursor-pointer"
            >
              {/* Internal abstract grid */}
              <div 
                className="absolute inset-0 opacity-[0.03] grid-pattern pointer-events-none"
                style={{ backgroundSize: "30px 30px" }}
              />
              {/* Radial gradient sheen */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 70%)"
                }}
              />

              {/* Vertical Scanner Sweep — Pure Framer Motion GPU-composited overlay */}
              <motion.div
                className="absolute left-6 right-6 h-[1.5px] bg-[#00FF88] shadow-[0_0_8px_#00FF88] z-20 pointer-events-none"
                style={{ top: 0 }}
                animate={{
                  y: [24, 348, 24]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* High-tech Corner Brackets */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#00FF88]/40 pointer-events-none group-hover:border-[#00FF88]/80 transition-colors" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#00FF88]/40 pointer-events-none group-hover:border-[#00FF88]/80 transition-colors" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#00FF88]/40 pointer-events-none group-hover:border-[#00FF88]/80 transition-colors" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#00FF88]/40 pointer-events-none group-hover:border-[#00FF88]/80 transition-colors" />

              {/* Target & status indicators */}
              <div className="absolute top-6 left-6 flex items-center gap-1.5 px-2 py-0.5 bg-[#050816]/75 backdrop-blur-md border border-[rgba(255,255,255,0.06)] rounded text-[9px] font-mono tracking-widest text-[#00FF88] uppercase select-none pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse" />
                <span>SYS: ACTIVE</span>
              </div>
              <div className="absolute top-6 right-6 flex items-center px-2 py-0.5 bg-[#050816]/75 backdrop-blur-md border border-[rgba(255,255,255,0.06)] rounded text-[9px] font-mono tracking-widest text-zinc-400 uppercase select-none pointer-events-none">
                <span>SRC: YASH.IMG</span>
              </div>

              {/* Profile Photo */}
              <img
                src={profileImg}
                alt="Tarapara Yash"
                className="w-[88%] h-[88%] object-cover rounded-xl border border-white/5 transition-transform duration-700 group-hover:scale-[1.03]"
              />

              {/* Minimal coordinate HUD element */}
              <div className="absolute bottom-6 left-6 text-[9px] font-mono text-zinc-500 flex gap-4 uppercase tracking-widest pointer-events-none">
                <span>SCAN_MODE: ON</span>
                <span>CONFIRM_ID: 8080</span>
              </div>

              {/* Interactive availability badge */}
              <div className="absolute bottom-6 right-6 flex items-center gap-1.5 px-2.5 py-1 bg-[#050816]/85 backdrop-blur-md border border-[#00FF88]/30 rounded-md text-[9px] font-mono tracking-widest text-[#00FF88] uppercase select-none pointer-events-none group-hover:border-[#00FF88] group-hover:shadow-[0_0_15px_rgba(0,255,136,0.15)] transition-all duration-300">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF88] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00FF88]"></span>
                </span>
                <span>AVAILABLE FOR PROJECTS</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          className="w-6 h-10 rounded-full border border-zinc-800 bg-[#0B1220]/25 flex justify-center pt-2"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-1 h-2 rounded-full bg-[#00FF88]"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
