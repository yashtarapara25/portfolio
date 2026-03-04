import { motion } from "framer-motion";
import { useSiteSettings } from "@/hooks/use-portfolio-data";
import { Github, Linkedin, Code2, Zap } from "lucide-react";

// MonkeyType — attractive monkey face icon, stroke-only, matches lucide-react style
function MonkeyTypeIcon({ size = 26 }: { size?: number }) {
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

export default function Footer() {
  const { settings } = useSiteSettings();

  const socialLinks = [
    { icon: Github, href: settings.github_url, label: "GitHub", color: "hover:text-white" },
    { icon: Linkedin, href: settings.linkedin_url, label: "LinkedIn", color: "hover:text-blue-400" },
    { icon: MonkeyTypeIcon, href: settings.monkeytype_url, label: "MonkeyType", color: "hover:text-yellow-400" },
  ].filter((link) => link.href);

  return (
    <footer className="relative overflow-hidden">
      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 to-slate-950/80 pointer-events-none" />

      {/* Decorative blob */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 container max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Left: Branding */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center md:items-start gap-2"
          >
            {/* Logo row */}
            <div className="flex items-center gap-2 mb-1">
              <motion.div
                className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Code2 size={14} className="text-white" />
              </motion.div>
              <span className="font-orbitron text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                {settings.site_title || "Portfolio"}
              </span>
            </div>

            <p className="text-xs text-muted-foreground font-space flex items-center gap-1.5">
              © {new Date().getFullYear()} · Tarapara Yash ·
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="text-cyan-400"
              >
                <Code2 size={12} />
              </motion.span>
              All rights reserved
            </p>
          </motion.div>

          {/* Center: Tech stack */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 text-xs text-muted-foreground font-space"
          >
            {[
              { label: "React", color: "text-cyan-400" },
              { label: "TypeScript", color: "text-blue-400" },
              { label: "Framer Motion", color: "text-purple-400" },
              { label: "Tailwind", color: "text-teal-400" },
            ].map(({ label, color }, i) => (
              <span key={label} className="flex items-center gap-2">
                {i > 0 && <span className="text-muted-foreground/30">·</span>}
                <motion.span
                  className={`${color} font-semibold`}
                  whileHover={{ scale: 1.15 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {label}
                </motion.span>
              </span>
            ))}
          </motion.div>

          {/* Right: Social links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            {socialLinks.map(({ icon: Icon, href, label, color }, index) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
                whileHover={{ scale: 1.25, y: -3 }}
                whileTap={{ scale: 0.9 }}
                className={`text-muted-foreground ${color} transition-all duration-200 relative group`}
              >
                <Icon size={20} />

                {/* Ripple ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border border-cyan-400"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileHover={{ scale: 1.8, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />

                {/* Tooltip */}
                <motion.span
                  initial={{ opacity: 0, y: 8 }}
                  whileHover={{ opacity: 1, y: -28 }}
                  transition={{ duration: 0.2 }}
                  className="absolute whitespace-nowrap text-xs font-semibold px-2 py-1 rounded-md bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 pointer-events-none left-1/2 -translate-x-1/2"
                >
                  {label}
                </motion.span>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom sparkle row */}
      <div className="relative z-10 text-center py-3 px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs text-muted-foreground/50 font-display flex items-center justify-center gap-1"
        >
          <Zap size={10} className="text-cyan-500" />
          Powered by curiosity and caffeine
          <Zap size={10} className="text-cyan-500" />
        </motion.p>
      </div>
    </footer>
  );
}
