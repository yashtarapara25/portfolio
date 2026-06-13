import { motion } from "framer-motion";
import { useSiteSettings } from "@/hooks/use-portfolio-data";
import { about } from "@/lib/data";
import { Github, Linkedin, Code, Zap, Keyboard } from "lucide-react";
import profileImg from "@/assets/profile-portrait.jpg";

export default function Footer() {
  const { settings } = useSiteSettings();

  const socialLinks = [
    { icon: Github, href: settings.github_url || about.github, label: "GitHub" },
    { icon: Linkedin, href: settings.linkedin_url || about.linkedin, label: "LinkedIn" },
    { icon: Keyboard, href: settings.monkeytype_url || about.monkeytype, label: "MonkeyType" },
  ].filter((link) => link.href);

  return (
    <footer className="relative overflow-hidden bg-[#060913] border-t border-[rgba(255,255,255,0.06)]">
      {/* Laser line divider */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00FF88]/40 to-transparent z-10" />

      <div className="relative z-10 container max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Left: Cyber Logo & Copyright */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center md:items-start gap-2.5"
          >
            {/* Logo */}
            <div className="flex items-center gap-2 mb-0.5">
              <div className="relative w-6 h-6 rounded-full overflow-hidden border border-[#00FF88]/30 shadow-[0_0_8px_rgba(0,255,136,0.1)] flex-shrink-0">
                <img src={profileImg} alt="Tarapara Yash" className="w-full h-full object-cover object-top" />
              </div>
              <span className="font-space text-sm font-bold text-white tracking-tight">
                {settings.site_title?.replace("Yash Tarapara", "Tarapara Yash") || "Tarapara Yash Portfolio"}
              </span>
            </div>

            <p className="text-[11px] font-mono text-zinc-500 flex items-center gap-1.5 uppercase tracking-wider">
              © {new Date().getFullYear()} · Tarapara Yash ·
              <motion.span
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
                className="text-[#00FF88]"
              >
                <Code size={11} />
              </motion.span>
              All systems nominal
            </p>
          </motion.div>

          {/* Center: System Built-With HUD Badges */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-2 font-mono text-[9px]"
          >
            {[
              { label: "REACT", color: "text-[#22d3ee] border-[#22d3ee]/20 bg-[#22d3ee]/5" },
              { label: "TYPESCRIPT", color: "text-[#3b82f6] border-[#3b82f6]/20 bg-[#3b82f6]/5" },
              { label: "FRAMER MOTION", color: "text-[#a855f7] border-[#a855f7]/20 bg-[#a855f7]/5" },
              { label: "TAILWIND CSS", color: "text-[#00FF88] border-[#00FF88]/20 bg-[#00FF88]/5" },
            ].map(({ label, color }) => (
              <span
                key={label}
                className={`px-2 py-0.5 rounded border font-semibold select-none ${color}`}
              >
                {label}
              </span>
            ))}
          </motion.div>

          {/* Right: High-tech Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3.5"
          >
            {socialLinks.map(({ icon: Icon, href, label }, index) => (
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
          </motion.div>
        </div>

        {/* Bottom system status telemetry */}
        <div className="mt-8 pt-4 border-t border-[rgba(255,255,255,0.04)] text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[9px] font-mono uppercase tracking-[0.15em] text-zinc-600 flex items-center justify-center gap-2"
          >
            <Zap size={9} className="text-[#00FF88] animate-pulse" />
            SYS_STATUS: ONLINE // SECURITY_CONTEXT: SECURE // PORTFOLIO_V3.0
            <Zap size={9} className="text-[#00FF88] animate-pulse" />
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
