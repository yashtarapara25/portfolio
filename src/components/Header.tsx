import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-portfolio-data";
import profileImg from "@/assets/profile-portrait.jpg";

// Nav order: About → Projects → Skills → Certificates → Education
const allNavItems = [
  { label: "About",        href: "#about",        sectionId: "about" },
  { label: "Projects",     href: "#projects",     sectionId: "projects" },
  { label: "Skills",       href: "#skills",       sectionId: "skills" },
  { label: "Certificates", href: "#achievements", sectionId: "achievements" },
  { label: "Education",    href: "#education",    sectionId: "education" },
];

/**
 * Scroll-spy — iterates sections in page order and picks the LAST one
 * whose top (in document coordinates) is at or above the current scroll
 * position + a small offset. Reliable for any section size.
 */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState("");

  useEffect(() => {
    const getCurrent = () => {
      // Offset: activate a section when it reaches 35% from the top of the viewport
      const offset = window.innerHeight * 0.35;
      const scrollY = window.scrollY + offset;

      let best = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        // Absolute top of section from document top
        const sectionTop = el.getBoundingClientRect().top + window.scrollY;
        if (sectionTop <= scrollY) {
          best = id; // keep updating — last one wins
        }
      }
      setActive(best);
    };

    window.addEventListener("scroll", getCurrent, { passive: true });
    getCurrent(); // run on mount too
    return () => window.removeEventListener("scroll", getCurrent);
  }, [ids.join(",")]);

  return active;
}


/** Smooth-scroll to a section by id, with fallback retry for lazy-loaded sections */
function scrollToSection(sectionId: string) {
  const attempt = (retries: number) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const headerOffset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: "smooth" });
    } else if (retries > 0) {
      // Section may be lazy-loaded — retry after a short wait
      setTimeout(() => attempt(retries - 1), 150);
    }
  };
  attempt(5);
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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#050816]/90 backdrop-blur-xl border-b border-[#00FF88]/10 shadow-2xl shadow-[#00FF88]/2"
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
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF88]/30 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}

      <div className="container flex items-center justify-between max-w-6xl mx-auto px-6">
        {/* Logo */}
        <motion.a
          href="#"
          className="font-space text-base md:text-lg font-bold flex items-center gap-2 group pointer-events-auto"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-[#00FF88]/40 shadow-[0_0_10px_rgba(0,255,136,0.2)] group-hover:border-[#00FF88]/80 transition-all duration-300 flex-shrink-0">
            <img src={profileImg} alt="Tarapara Yash" className="w-full h-full object-cover object-top" />
          </div>
          <span className="text-white font-space tracking-tight">
            Tarapara Yash Portfolio
          </span>
        </motion.a>

        {/* ── Desktop nav ── */}
        <nav className="hidden md:flex items-center gap-1">
          {allNavItems.map((item) => {
            const isActive = activeSection === item.sectionId;

            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => { e.preventDefault(); scrollToSection(item.sectionId); }}
                className={`text-xs font-semibold tracking-wider px-4 py-2 rounded-lg relative group font-space transition-colors duration-200 uppercase cursor-pointer ${
                  isActive
                    ? "text-[#00FF88]"
                    : "text-zinc-400 hover:text-[#00FF88]"
                }`}
              >
                {item.label}
                {/* Active underline indicator */}
                <span
                  className={`absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-[#00FF88] transition-all duration-300 origin-left ${
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
          onClick={(e) => { e.preventDefault(); scrollToSection("contact"); }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hidden md:inline-flex items-center gap-2 text-xs font-mono tracking-widest px-5 py-2.5 rounded-full border border-[#00FF88]/30 text-[#00FF88] bg-transparent hover:bg-[#00FF88]/5 hover:border-[#00FF88] transition-all duration-300 uppercase cursor-pointer"
        >
          <Zap size={12} className="text-[#00FF88]" />
          LET'S TALK
        </motion.a>

        {/* Mobile toggle */}
        <motion.button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
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
            className="md:hidden overflow-hidden border-t border-[#00FF88]/10 bg-[#050816]/95 backdrop-blur-xl"
          >
            <div className="container max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1">
              {allNavItems.map((item, index) => {
                const isActive = activeSection === item.sectionId;

                return (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => { e.preventDefault(); scrollToSection(item.sectionId); setMobileOpen(false); }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.06 }}
                    className={`text-xs py-3 px-4 rounded-lg font-space tracking-wider flex items-center gap-2 uppercase transition-colors duration-200 cursor-pointer ${
                      isActive
                        ? "text-white font-semibold bg-[#00FF88]/10"
                        : "text-zinc-400 hover:text-white hover:bg-[#00FF88]/10"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full bg-[#00FF88] shrink-0 transition-opacity ${
                        isActive ? "opacity-100 animate-pulse" : "opacity-0"
                      }`}
                    />
                    {item.label}
                  </motion.a>
                );
              })}

              <motion.a
                href="#contact"
                onClick={(e) => { e.preventDefault(); scrollToSection("contact"); setMobileOpen(false); }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: allNavItems.length * 0.06 }}
                className="text-xs font-bold tracking-widest px-4 py-3 rounded-xl border border-[#00FF88]/30 text-[#00FF88] hover:bg-[#00FF88]/5 bg-transparent mt-2 text-center font-mono uppercase cursor-pointer"
              >
                LET'S TALK
              </motion.a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
