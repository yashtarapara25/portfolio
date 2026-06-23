import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motions";
import { about } from "@/lib/data";
import { ArrowDown, Github, Linkedin, Sparkles, Download, Keyboard, Zap } from "lucide-react";
import profileImg from "@/assets/profile-portrait.jpg";
import AnimatedBackground from "./AnimatedBackground";
import { useState, useEffect } from "react";
import { useSiteSettings } from "@/hooks/use-portfolio-data";

// Orbiting icons removed for mobile performance and simplicity

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

      <div className="relative z-10 container max-w-6xl mx-auto px-6 pt-20 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          {/* ── LEFT: Text Content ── */}
          <div className="md:col-span-7 flex flex-col justify-center">
            {/* Hello badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00FF88]/20 bg-[#00FF88]/5 text-[10px] font-mono tracking-widest text-white mb-6 select-none w-fit hover:border-[#00FF88]/40 hover:bg-[#00FF88]/10 transition-colors duration-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF88] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF88]"></span>
              </span>
              HELLO, I'M
            </div>

            {/* Name */}
            <h1 className="text-5xl sm:text-7xl lg:text-[86px] font-black font-space tracking-tight text-white mb-2 leading-[0.95] select-none flex flex-wrap gap-x-4">
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
            </h1>

            {/* Roles — AnimatePresence word-swap */}
            <div className="flex items-center gap-2 text-2xl md:text-3xl font-bold mt-2 min-h-[2.5rem] overflow-hidden text-[#00FF88] font-space">
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
            </div>

            {/* Tagline */}
            <p className="text-base md:text-lg text-zinc-400 max-w-xl mt-4 leading-relaxed font-space">
              {about.tagline}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
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
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-10">
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

                  {/* Cyberpunk tooltip */}
                  <span className="absolute opacity-0 group-hover:opacity-100 translate-y-2 group-hover:-translate-y-7 transition-all duration-300 whitespace-nowrap text-[10px] font-mono font-semibold px-2.5 py-1 rounded bg-[#0B1220]/95 border border-[#00FF88]/30 text-[#00FF88] shadow-[0_0_15px_rgba(0,255,136,0.15)] pointer-events-none left-1/2 -translate-x-1/2 z-20">
                    {label}
                  </span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Profile Photo Container ── */}
          <div className="md:col-span-5 flex items-center justify-center relative select-none">
            {/* Simple and attractive profile image card with no laggy animations */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-[360px] md:max-w-[400px] aspect-square rounded-2xl p-1 bg-gradient-to-br from-[#00FF88]/20 via-transparent to-[#22d3ee]/20 shadow-[0_0_40px_rgba(0,255,136,0.15)] group cursor-pointer"
            >
              <div className="w-full h-full rounded-xl overflow-hidden bg-[#0B1220] relative">
                <img
                  src={profileImg}
                  alt="Tarapara Yash"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  fetchpriority="high"
                  decoding="async"
                />
              </div>

              {/* Static availability badge at the bottom right */}
              <div className="absolute -bottom-3 -right-3 flex items-center gap-1.5 px-3 py-1.5 bg-[#050816] border border-[#00FF88]/30 rounded-lg text-[10px] font-mono tracking-widest text-[#00FF88] uppercase select-none pointer-events-none shadow-lg">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF88] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00FF88]"></span>
                </span>
                <span>AVAILABLE FOR PROJECTS</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

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
