import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motions";
import { about } from "@/lib/data";
import { ArrowDown, Github, Linkedin, Sparkles, Download } from "lucide-react";

// MonkeyType — attractive monkey face icon, stroke-only, matches lucide-react style
function MonkeyTypeIcon({ size = 30 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left ear */}
      <circle cx="4.5" cy="11" r="2.2" />
      {/* Right ear */}
      <circle cx="19.5" cy="11" r="2.2" />
      {/* Inner left ear */}
      <circle cx="4.5" cy="11" r="0.9" strokeWidth="1" />
      {/* Inner right ear */}
      <circle cx="19.5" cy="11" r="0.9" strokeWidth="1" />
      {/* Head */}
      <circle cx="12" cy="11.5" r="7" />
      {/* Muzzle */}
      <ellipse cx="12" cy="14.2" rx="3" ry="2" />
      {/* Left eye */}
      <circle cx="9.5" cy="10" r="1" fill="currentColor" stroke="none" />
      {/* Right eye */}
      <circle cx="14.5" cy="10" r="1" fill="currentColor" stroke="none" />
      {/* Nose */}
      <path d="M11.2 13.5 Q12 14 12.8 13.5" strokeWidth="1.2" />
      {/* Smile */}
      <path d="M10 15.2 Q12 16.6 14 15.2" strokeWidth="1.2" />
    </svg>
  );
}
import heroBg from "@/assets/hero-bg.jpg";
import profileImg from "@/assets/profile.jpeg";
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
      download
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

  const ROLES = ["Data Analytics", "Data Scientist", "AI Engineer", "Web Developer"];
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
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover opacity-20"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 container max-w-6xl mx-auto px-6 pt-20 pb-20"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* ── LEFT: Text Content ── */}
          <motion.div>
            {/* Greeting */}
            <motion.div variants={fadeUp} className="flex items-center gap-2 mb-6">
              <motion.span
                animate={{ rotate: [0, 20, -20, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-2xl"
              >
                👋
              </motion.span>
              <p className="font-display text-sm text-cyan-400 tracking-wider">
                Hello, I'm
              </p>
            </motion.div>

            {/* Name — CSS steps() typing animation, perfectly smooth */}
            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold font-orbitron leading-tight mb-4"
            >
              <span className="block min-h-[1.2em]">
                <span
                  style={{
                    display: "inline-block",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    verticalAlign: "bottom",
                    animation: "typing-name 0.7s steps(13, end) forwards",
                    background: "linear-gradient(90deg, #22d3ee, #3b82f6, #a855f7, #ec4899, #3b82f6, #22d3ee)",
                    backgroundSize: "300% 100%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    animationName: "typing-name, name-gradient",
                    animationDuration: "0.7s, 4s",
                    animationTimingFunction: "steps(13, end), linear",
                    animationIterationCount: "1, infinite",
                    animationFillMode: "forwards, none",
                  }}
                >
                  Tarapara Yash
                </span>
              </span>

              {/* Roles — AnimatePresence word-swap, no setTimeout jitter */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.6 }}
                className="flex items-center gap-3 text-xl md:text-2xl lg:text-3xl mt-4 font-semibold min-h-[2.5rem] overflow-hidden"
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={roleIndex}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 font-space"
                  >
                    {ROLES[roleIndex]}
                  </motion.span>
                </AnimatePresence>
                <motion.span
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-cyan-400 flex-shrink-0"
                >
                  <Sparkles size={22} />
                </motion.span>
              </motion.div>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-base md:text-lg text-muted-foreground max-w-xl mt-8 leading-relaxed font-space"
            >
              {about.tagline}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mt-10">
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(34,197,221,0.6)" }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-2xl transition-all text-sm relative overflow-hidden group font-space"
              >
                <span className="relative z-10">View Projects</span>
                <motion.span
                  animate={{ y: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="relative z-10"
                >
                  <ArrowDown size={16} />
                </motion.span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.a>

              <ResumeButton />
            </motion.div>

            {/* Social Links */}
            <motion.div variants={fadeUp} className="flex items-center gap-8 mt-12">
              {[
                { icon: Github, href: settings.github_url || about.github, label: "GitHub" },
                { icon: Linkedin, href: settings.linkedin_url || about.linkedin, label: "LinkedIn" },
                { icon: MonkeyTypeIcon, href: settings.monkeytype_url || about.monkeytype, label: "MonkeyType" },
              ].map(({ icon: Icon, href, label }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  whileHover={{ scale: 1.2, color: "rgb(34,197,221)" }}
                  whileTap={{ scale: 0.9 }}
                  className="text-muted-foreground hover:text-cyan-400 transition-colors relative group"
                >
                  <Icon size={24} />
                  <motion.div
                    className="absolute inset-0 rounded-full border border-cyan-400"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileHover={{ scale: 1.7, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Profile image with orbiting code icons ── */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative h-96 md:h-full min-h-96 flex items-center justify-center"
          >
            {/* Pulsing background glow */}
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-blue-600/30 rounded-3xl blur-3xl"
            />

            {/* ─ Outer slow dashed orbit ring ─ */}
            <motion.div
              className="absolute rounded-full border border-dashed border-cyan-400/20"
              style={{ width: 400, height: 400 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />

            {/* ─ Middle counter-rotating ring ─ */}
            <motion.div
              className="absolute rounded-full border-2 border-dashed border-purple-500/25"
              style={{ width: 350, height: 350 }}
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />

            {/* ─ Orbiting code icons ─ */}
            <div className="absolute" style={{ width: 0, height: 0, top: "50%", left: "50%" }}>
              {CODE_ICONS.map((icon, i) => (
                <OrbitIcon
                  key={icon.label + i}
                  label={icon.label}
                  color={icon.color}
                  index={i}
                  total={CODE_ICONS.length}
                  radius={185}
                />
              ))}
            </div>

            {/* Profile frame */}
            <div className="relative w-72 h-80 md:w-80 md:h-96 group z-10">

              {/* === LAYER 1: outer aura glow (pulse) === */}
              <motion.div
                className="absolute -inset-6 rounded-3xl blur-2xl"
                style={{ background: "radial-gradient(ellipse, #22d3ee30 0%, #a855f730 50%, transparent 75%)" }}
                animate={{ opacity: [0.4, 0.9, 0.4], scale: [0.97, 1.04, 0.97] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* === LAYER 2: fast RGB spinning conic border === */}
              <motion.div
                className="absolute -inset-[3px] rounded-[22px]"
                style={{
                  background: "conic-gradient(from 0deg, #22d3ee, #3b82f6, #a855f7, #ec4899, #f59e0b, #10b981, #22d3ee)",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />

              {/* === LAYER 3: blurred glow copy of the conic === */}
              <motion.div
                className="absolute -inset-4 rounded-3xl blur-xl opacity-60"
                style={{
                  background: "conic-gradient(from 0deg, #22d3ee, #3b82f6, #a855f7, #ec4899, #f59e0b, #10b981, #22d3ee)",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />

              {/* === LAYER 4: counter-rotating dashed electric arcs === */}
              <motion.div
                className="absolute -inset-[6px] rounded-[26px] border-2 border-dashed border-cyan-400/40"
                animate={{ rotate: -360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />

              {/* === LAYER 5: scanner sweep (diagonal shimmer) === */}
              <motion.div
                className="absolute inset-0 rounded-2xl overflow-hidden z-20 pointer-events-none"
              >
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(105deg, transparent 30%, rgba(34,211,238,0.18) 50%, transparent 70%)",
                  }}
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
                />
              </motion.div>

              {/* === LAYER 6: corner spark dots === */}
              {[
                { top: "-8px", left: "-8px", color: "#22d3ee" },
                { top: "-8px", right: "-8px", color: "#a855f7" },
                { bottom: "-8px", left: "-8px", color: "#ec4899" },
                { bottom: "-8px", right: "-8px", color: "#3b82f6" },
              ].map((pos, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3.5 h-3.5 rounded-full z-30"
                  style={{ ...pos, background: pos.color, boxShadow: `0 0 10px 3px ${pos.color}` }}
                  animate={{ scale: [1, 1.8, 1], opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.35 }}
                />
              ))}

              {/* Inner card */}
              <div className="absolute inset-[3px] bg-slate-900 rounded-2xl overflow-hidden z-10">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  whileHover={{ scale: 1.02 }}
                  className="w-full h-full relative overflow-hidden"
                >
                  <img
                    src={profileImage}
                    alt="Tarapara Yash"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:brightness-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  {/* Hover shine */}
                  <motion.div
                    className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%", transition: { duration: 0.8 } }}
                  />
                </motion.div>
              </div>

              {/* Corner accents (stay static, give a UI frame feel) */}
              <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-cyan-400 rounded-tl-lg z-20" />
              <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-blue-500 rounded-br-lg z-20" />
            </div>

            {/* Available badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -bottom-4 right-8 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-full font-semibold text-sm shadow-lg shadow-cyan-500/50 z-20"
            >
              Available for Projects
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
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-cyan-400/50 flex justify-center pt-2 hover:border-cyan-400 transition-colors"
        >
          <motion.div
            animate={{ scaleY: [0.2, 1, 0.2] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="w-1.5 h-2 rounded-full bg-gradient-to-b from-cyan-400 to-transparent"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
