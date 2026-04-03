import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Code2, Zap, Award } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-portfolio-data";

// Nav order: About → Projects → Skills → Certificates → Education → Contact
const allNavItems = [
  { label: "About",        href: "#about",        sectionId: "about" },
  { label: "Projects",     href: "#projects",     sectionId: "projects" },
  { label: "Skills",       href: "#skills",       sectionId: "skills" },
  { label: "Certificates", href: "#achievements", sectionId: "achievements", icon: Award },
  { label: "Education",    href: "#education",    sectionId: "education" },
  { label: "Contact",      href: "#contact",      sectionId: "contact" },
];

/**
 * Scroll-spy — returns the sectionId whose top edge is currently
 * closest to 40% from the top of the viewport. One winner at a time.
 */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState("");

  useEffect(() => {
    const getCurrent = () => {
      const threshold = window.innerHeight * 0.4; // 40% down the viewport
      let best = "";
      let bestDist = Infinity;

      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top;
        // Only consider sections that have entered the viewport (top <= threshold)
        if (top <= threshold) {
          const dist = Math.abs(top - threshold);
          if (dist < bestDist) {
            bestDist = dist;
            best = id;
          }
        }
      });

      setActive(best);
    };

    window.addEventListener("scroll", getCurrent, { passive: true });
    getCurrent(); // run once on mount
    return () => window.removeEventListener("scroll", getCurrent);
  }, [ids.join(",")]);

  return active;
}

export default function Header() {
  const { settings } = useSiteSettings();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sectionIds = allNavItems.map((i) => i.sectionId);
  const activeSection = useActiveSection(sectionIds);

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-slate-900/85 backdrop-blur-xl border-b border-cyan-500/20 shadow-2xl shadow-cyan-500/5"
          : "bg-transparent"
      }`}
      style={{
        paddingTop: scrolled ? "10px" : "18px",
        paddingBottom: scrolled ? "10px" : "18px",
      }}
    >
      {/* Animated top border */}
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
          <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-orbitron">
            {settings.site_title || "Portfolio"}
          </span>
        </motion.a>

        {/* ── Desktop nav ── */}
        <nav className="hidden md:flex items-center gap-1">
          {allNavItems.map((item, index) => {
            const isActive = activeSection === item.sectionId;
            const Icon = item.icon;

            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg relative group font-space transition-colors duration-200 ${
                  isActive
                    ? "text-cyan-300 font-semibold"
                    : "text-muted-foreground hover:text-cyan-300"
                }`}
              >
                {Icon && (
                  <Icon
                    size={13}
                    className={`shrink-0 transition-opacity duration-200 ${
                      isActive ? "opacity-100 text-cyan-300" : "opacity-50 group-hover:opacity-100"
                    }`}
                  />
                )}
                {item.label}
                {/* Active underline indicator */}
                <span
                  className={`absolute bottom-1 left-4 right-4 h-px rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 origin-left ${
                    isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                  }`}
                />
              </a>
            );
          })}
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

      {/* ── Mobile nav ── */}
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
              {allNavItems.map((item, index) => {
                const isActive = activeSection === item.sectionId;
                const Icon = item.icon;

                return (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.06 }}
                    className={`text-sm py-3 px-4 rounded-lg font-space flex items-center gap-2 transition-colors duration-200 ${
                      isActive
                        ? "text-cyan-300 font-semibold"
                        : "text-muted-foreground hover:text-cyan-300 hover:bg-cyan-500/10"
                    }`}
                  >
                    {Icon ? (
                      <Icon
                        size={14}
                        className={`shrink-0 ${
                          isActive ? "text-cyan-300" : "opacity-50"
                        }`}
                      />
                    ) : (
                      <span
                        className={`w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 transition-opacity ${
                          isActive ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    )}
                    {item.label}
                  </motion.a>
                );
              })}

              <motion.a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: allNavItems.length * 0.06 }}
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
