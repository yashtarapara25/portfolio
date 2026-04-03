import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Code2, Zap, Award } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-portfolio-data";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Education", href: "#education" },
];

/** Tracks whether the #skills section is currently visible on screen */
function useSkillsActive() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const el = document.getElementById("skills");
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsActive(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return isActive;
}

/** Certificate nav button — glows when Skills section is active */
function CertificatesNavItem({
  desktop,
  onClose,
}: {
  desktop: boolean;
  onClose?: () => void;
}) {
  const skillsActive = useSkillsActive();

  if (desktop) {
    return (
      <motion.a
        href="#achievements"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: navItems.length * 0.07 }}
        className="relative font-space"
      >
        <AnimatePresence mode="wait">
          {skillsActive ? (
            /* Highlighted pill when Skills is in view */
            <motion.span
              key="active"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(34,211,238,0.18), rgba(59,130,246,0.18))",
                border: "1px solid rgba(34,211,238,0.45)",
                color: "#67e8f9",
              }}
            >
              {/* Pulse ring */}
              <span className="relative flex">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-40" />
                <Award size={13} className="relative text-cyan-300" />
              </span>
              Certificates
              {/* Shimmer sweep */}
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"
                animate={{ x: ["-100%", "150%"] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
              />
            </motion.span>
          ) : (
            /* Normal state */
            <motion.span
              key="normal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-cyan-300 transition-colors duration-200 font-medium px-4 py-2 rounded-lg group"
              whileHover={{ backgroundColor: "rgba(34, 211, 238, 0.07)" } as any}
            >
              <Award size={13} className="opacity-70 group-hover:opacity-100" />
              Certificates
              {/* Animated underline */}
              <motion.span
                className="absolute bottom-1 left-4 right-4 h-px bg-gradient-to-r from-cyan-400 to-blue-500"
                initial={{ scaleX: 0, originX: "left" }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.25 }}
              />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.a>
    );
  }

  /* Mobile version */
  const skillsActive2 = skillsActive;
  return (
    <motion.a
      href="#achievements"
      onClick={onClose}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: navItems.length * 0.06 }}
      className={`text-sm py-3 px-4 rounded-lg font-space flex items-center gap-2 relative overflow-hidden transition-colors ${
        skillsActive2
          ? "text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 font-semibold"
          : "text-muted-foreground hover:text-cyan-300 hover:bg-cyan-500/10"
      }`}
    >
      {skillsActive2 ? (
        <>
          <span className="relative flex">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-40" />
            <Award size={15} className="relative text-cyan-300" />
          </span>
          Certificates
          {/* Shimmer */}
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent"
            animate={{ x: ["-100%", "150%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </>
      ) : (
        <>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Award size={15} className="opacity-60" />
          Certificates
        </>
      )}
    </motion.a>
  );
}

export default function Header() {
  const { settings } = useSiteSettings();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.2, 0.9, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? "bg-slate-900/85 backdrop-blur-xl border-b border-cyan-500/20 shadow-2xl shadow-cyan-500/5"
          : "bg-transparent"
        }`}
      style={{
        paddingTop: scrolled ? "10px" : "18px",
        paddingBottom: scrolled ? "10px" : "18px",
      }}
    >
      {/* Animated top border line */}
      {scrolled && (
        <motion.div
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}

      <div className="container flex items-center justify-between max-w-6xl mx-auto px-6">
        {/* Logo */}
        <motion.a
          href="#"
          className="font-display text-lg font-bold flex items-center gap-2 group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Spinning gradient icon */}
          <div className="relative w-9 h-9">
            <motion.div
              className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 animate-glow-pulse"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.7 }}
            />
            <div className="relative flex items-center justify-center w-full h-full">
              <Code2 size={18} className="text-white" />
            </div>
          </div>

          {/* Site title with shimmer on hover */}
          <span className="relative group-hover:text-shimmer transition-all duration-300 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-orbitron">
            {settings.site_title || "Portfolio"}
          </span>
        </motion.a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item, index) => (
            <motion.a
              key={item.href}
              href={item.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07 }}
              onHoverStart={() => setActiveLink(item.href)}
              onHoverEnd={() => setActiveLink("")}
              className="text-sm text-muted-foreground hover:text-cyan-300 transition-colors duration-200 font-medium px-4 py-2 rounded-lg relative group font-space"
              whileHover={{ backgroundColor: "rgba(34, 211, 238, 0.07)" }}
            >
              {item.label}

              {/* Animated underline */}
              <motion.span
                className="absolute bottom-1 left-4 right-4 h-px bg-gradient-to-r from-cyan-400 to-blue-500"
                initial={{ scaleX: 0, originX: "left" }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.25 }}
              />

              {/* Glow dot on hover */}
              {activeLink === item.href && (
                <motion.span
                  layoutId="navDot"
                  className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                />
              )}
            </motion.a>
          ))}

          {/* Certificates nav item — highlights when Skills section is visible */}
          <CertificatesNavItem desktop />

          {/* Contact — after Certificates */}
          <motion.a
            href="#contact"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (navItems.length + 1) * 0.07 }}
            onHoverStart={() => setActiveLink("#contact")}
            onHoverEnd={() => setActiveLink("")}
            className="text-sm text-muted-foreground hover:text-cyan-300 transition-colors duration-200 font-medium px-4 py-2 rounded-lg relative group font-space"
            whileHover={{ backgroundColor: "rgba(34, 211, 238, 0.07)" }}
          >
            Contact
            <motion.span
              className="absolute bottom-1 left-4 right-4 h-px bg-gradient-to-r from-cyan-400 to-blue-500"
              initial={{ scaleX: 0, originX: "left" }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.25 }}
            />
            {activeLink === "#contact" && (
              <motion.span
                layoutId="navDot"
                className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              />
            )}
          </motion.a>
        </nav>

        {/* CTA */}
        <motion.a
          href="#contact"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(34,211,238,0.5)" }}
          whileTap={{ scale: 0.95 }}
          className="hidden md:inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg transition-all font-space relative overflow-hidden group"
        >
          <motion.span
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Zap size={14} />
          </motion.span>
          Let's Talk
          {/* Shimmer sweep */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </motion.a>

        {/* Mobile toggle */}
        <motion.button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-foreground p-2 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Toggle menu"
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={mobileOpen ? "close" : "open"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-cyan-500/20 bg-slate-900/90 backdrop-blur-xl"
          >
            <div className="container max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className="text-sm text-muted-foreground hover:text-cyan-300 transition-colors py-3 px-4 rounded-lg hover:bg-cyan-500/10 relative group font-space flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {item.label}
                </motion.a>
              ))}

              {/* Certificates — mobile */}
              <CertificatesNavItem desktop={false} onClose={() => setMobileOpen(false)} />

              {/* Contact — after Certificates (mobile) */}
              <motion.a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (navItems.length + 1) * 0.06 }}
                className="text-sm text-muted-foreground hover:text-cyan-300 transition-colors py-3 px-4 rounded-lg hover:bg-cyan-500/10 relative group font-space flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                Contact
              </motion.a>

              <motion.a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navItems.length * 0.06 }}
                className="text-sm font-semibold px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white mt-2 text-center font-space"
              >
                Let's Talk
              </motion.a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
