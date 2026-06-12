import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "@/lib/motions";
import { useAchievements } from "@/hooks/use-portfolio-data";
import {
  Award,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Shield,
  BookOpen,
  Cpu,
  Globe,
  Code2,
  GraduationCap,
  BadgeCheck,
  Trophy,
  Medal,
  Star,
  Calendar,
  ImageOff,
  Download,
} from "lucide-react";

/* ─────────────────────────────────────────────────
   Extract Google Drive file ID from any share URL
───────────────────────────────────────────────── */
function extractDriveId(url: string): string | null {
  if (!url) return null;
  const m =
    url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return m?.[1] ?? null;
}

/* High-res Image Preview URL — used for the main card display */
function toPreviewImageUrl(url: string): string | null {
  const id = extractDriveId(url);
  if (id) return `https://drive.google.com/thumbnail?id=${id}&sz=w1200`;
  return url.startsWith("http") ? url : null;
}

/* Download URL — direct download for Google Drive files */
function toDownloadUrl(url: string): string | null {
  const id = extractDriveId(url);
  if (id) return `https://drive.google.com/uc?export=download&id=${id}`;
  return url.startsWith("http") ? url : null;
}

/* ─────────────────────────────────────────────────
   Smart icon for issuer
───────────────────────────────────────────────── */
function IssuerIcon({ issuer, size = 14 }: { issuer: string; size?: number }) {
  const l = issuer.toLowerCase();
  if (l.includes("google"))                                        return <Globe size={size} />;
  if (l.includes("microsoft") || l.includes("azure"))             return <Cpu size={size} />;
  if (l.includes("amazon") || l.includes("aws"))                  return <Shield size={size} />;
  if (l.includes("meta") || l.includes("facebook"))               return <Code2 size={size} />;
  if (l.includes("coursera") || l.includes("udemy") || l.includes("edx")) return <BookOpen size={size} />;
  if (l.includes("university") || l.includes("college") ||
      l.includes("institute") || l.includes("atmiya"))            return <GraduationCap size={size} />;
  if (l.includes("cisco"))                                         return <Shield size={size} />;
  if (l.includes("ibm"))                                           return <Cpu size={size} />;
  return <Award size={size} />;
}

/* Smart icon for certificate title */
function TitleIcon({ title, size = 20 }: { title: string; size?: number }) {
  const l = title.toLowerCase();
  if (l.includes("rank 1") || l.includes("1st") || l.includes("first")) return <Trophy size={size} />;
  if (l.includes("rank") || l.includes("position") || l.includes("2nd") || l.includes("3rd")) return <Medal size={size} />;
  if (l.includes("hackathon"))     return <Code2 size={size} />;
  if (l.includes("excellence"))    return <Star size={size} />;
  if (l.includes("cyber") || l.includes("security") || l.includes("defender")) return <Shield size={size} />;
  if (l.includes("volunteer"))     return <BadgeCheck size={size} />;
  if (l.includes("participation")) return <BadgeCheck size={size} />;
  return <Award size={size} />;
}

/* ─────────────────────────────────────────────── */

export default function AchievementsViz() {
  const { achievements: rawAchievements, loading } = useAchievements();
  const [selected, setSelected]  = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Filter out the verification link for the 6th certificate (Cyber Treasure Hunt)
  const achievements = rawAchievements.map(ach => {
    if (ach.id === '9ddc14f9-a3e3-4506-8db3-e8de2350a278') {
      return { ...ach, credential_url: null };
    }
    return ach;
  });

  const prev = () => setSelected(p => (p - 1 + achievements.length) % achievements.length);
  const next = () => setSelected(p => (p + 1) % achievements.length);

  /* Keyboard Navigation */
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [achievements.length]);

  const active = achievements[selected];

  // Automatically handle viewMode removed since we direct users to downloads

  const handleImageError = (id: string) => {
    setImageErrors(p => ({ ...p, [id]: true }));
  };

  if (loading || achievements.length === 0) return null;

  const currentHasImageError = imageErrors[active.id] || false;

  return (
    <section className="py-24 relative max-w-6xl mx-auto px-6 z-10" id="achievements">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-20px" }}
        className="space-y-12"
      >

        {/* ══ Section Header ══ */}
        <motion.div variants={fadeUp} className="border-b border-[rgba(255,255,255,0.05)] pb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[#00FF88]"><Award size={16} /></span>
            <p className="font-mono text-xs text-zinc-400 tracking-widest uppercase">
              Certifications &amp; Credentials
            </p>
          </div>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <h2 className="text-3xl sm:text-5xl font-bold text-white font-space tracking-tight">
              Certificates &amp;{" "}
              <span className="text-[#00FF88] text-gradient">Badges</span>
            </h2>
            <span className="font-mono text-xs text-zinc-500 border border-[rgba(255,255,255,0.07)] px-3 py-1 rounded-full">
              {achievements.length} credential{achievements.length !== 1 ? "s" : ""}
            </span>
          </div>
        </motion.div>

        {/* ══ Card Layout ══ */}
        <motion.div
          variants={fadeUp}
          className="w-full"
        >
          {/* ════════════════════════════════
              Unified Certificate Card (Full Width Split Layout)
          ════════════════════════════════ */}
          <div className="relative rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#0b1120] p-5 md:p-6 flex flex-col gap-6 overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute -left-12 -top-12 w-36 h-36 rounded-full bg-[#00FF88]/5 blur-3xl pointer-events-none" />

            {/* Card Header: Icon + Title & Navigation */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[rgba(255,255,255,0.05)] pb-5 z-10">
              
              {/* Left Details: Icon, Title & Meta */}
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-[#00FF88]/8 border border-[#00FF88]/20 flex items-center justify-center text-[#00FF88] shadow-[0_0_12px_rgba(0,255,136,0.05)]">
                  <TitleIcon title={active.title} size={22} />
                </div>
                
                <div className="min-w-0">
                  <h3 className="text-lg md:text-xl font-bold font-space text-white leading-tight">
                    {active.title}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2">
                    <span className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
                      <span className="text-[#00FF88]/70">
                        <IssuerIcon issuer={active.issuer} size={12} />
                      </span>
                      {active.issuer}
                    </span>
                    
                    <span className="w-1 h-1 rounded-full bg-zinc-700 hidden xs:inline-block" />
                    
                    <span className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
                      <Calendar size={11} className="text-zinc-500" />
                      {active.date}
                    </span>

                    {active.credential_url && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-zinc-700 hidden xs:inline-block" />
                        <a
                          href={active.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-[#00FF88] hover:underline"
                        >
                          <ExternalLink size={10} /> Verify Link
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Prev/Next Navigation */}
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 bg-black/20 p-1 rounded-xl border border-[rgba(255,255,255,0.04)]">
                <button
                  onClick={prev}
                  className="p-2 rounded-lg border border-[rgba(255,255,255,0.05)] text-zinc-400 hover:text-white hover:bg-white/5 hover:border-[rgba(255,255,255,0.15)] transition-all"
                  aria-label="Previous"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-mono text-zinc-500 min-w-[50px] text-center">
                  {String(selected + 1).padStart(2, "0")} / {String(achievements.length).padStart(2, "0")}
                </span>
                <button
                  onClick={next}
                  className="p-2 rounded-lg border border-[rgba(255,255,255,0.05)] text-zinc-400 hover:text-white hover:bg-white/5 hover:border-[rgba(255,255,255,0.15)] transition-all"
                  aria-label="Next"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Card Body: Grid Split (Image Left, Description/Meta Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-6 items-stretch min-h-[380px] z-10">
              
              {/* Left Column: Certificate Preview Display */}
              <div className="relative rounded-xl overflow-hidden border border-[rgba(255,255,255,0.05)] bg-[#060913] flex items-center justify-center min-h-[320px] lg:min-h-[360px] xl:min-h-[400px]">
                {/* Dynamic Sliding Laser Border Tracers */}
                <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none z-10">
                  {/* Top sliding bar */}
                  <motion.div
                    className="absolute top-0 h-[1.5px] bg-[#00FF88] shadow-[0_0_8px_#00FF88] rounded-full w-[25%]"
                    animate={{
                      left: ["0%", "75%", "0%"]
                    }}
                    transition={{
                      duration: 4.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  {/* Bottom sliding bar */}
                  <motion.div
                    className="absolute bottom-0 h-[1.5px] bg-[#00FF88] shadow-[0_0_8px_#00FF88] rounded-full w-[25%]"
                    animate={{
                      left: ["75%", "0%", "75%"]
                    }}
                    transition={{
                      duration: 4.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  {/* Left sliding bar */}
                  <motion.div
                    className="absolute left-0 w-[1.5px] bg-[#00FF88] shadow-[0_0_8px_#00FF88] rounded-full h-[25%]"
                    animate={{
                      top: ["0%", "75%", "0%"]
                    }}
                    transition={{
                      duration: 4.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  {/* Right sliding bar */}
                  <motion.div
                    className="absolute right-0 w-[1.5px] bg-[#00FF88] shadow-[0_0_8px_#00FF88] rounded-full h-[25%]"
                    animate={{
                      top: ["75%", "0%", "75%"]
                    }}
                    transition={{
                      duration: 4.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>

                {/* HUD corner frame accents with pulsing scale and glow */}
                {["top-3 left-3 border-t-2 border-l-2", "top-3 right-3 border-t-2 border-r-2", "bottom-3 left-3 border-b-2 border-l-2", "bottom-3 right-3 border-b-2 border-r-2"].map(c => (
                  <motion.div
                    key={c}
                    className={`absolute w-3.5 h-3.5 ${c} border-[#00FF88] pointer-events-none z-10`}
                    animate={{
                      opacity: [0.25, 0.9, 0.25],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                ))}

                {/* Top neon light line */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00FF88]/30 to-transparent z-10" />

                {/* Download Button (only if active has image_url) */}
                {active.image_url && (
                  <div className="absolute top-4 right-4 z-20">
                    <a
                      href={toDownloadUrl(active.image_url) || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-[#030712]/80 backdrop-blur-md border border-[#00FF88]/30 hover:border-[#00FF88] text-xs font-mono text-[#00FF88] hover:bg-[#00FF88]/10 hover:shadow-[0_0_12px_rgba(0,255,136,0.15)] flex items-center gap-1.5 transition-all duration-300 font-semibold uppercase tracking-wider"
                    >
                      <Download size={12} />
                      Download
                    </a>
                  </div>
                )}

                {active.image_url && !currentHasImageError ? (
                  <div className="w-full h-full flex items-center justify-center relative min-h-[320px]">
                    {/* Parallel Preloaded stack for instant switching */}
                    <div className="absolute inset-0 w-full h-full">
                      {achievements.map((item, idx) => {
                        const isActive = idx === selected;
                        const previewImg = item.image_url ? toPreviewImageUrl(item.image_url) : null;
                        if (!previewImg || imageErrors[item.id]) return null;

                        return (
                          <div
                            key={item.id}
                            className={`absolute inset-0 flex items-center justify-center p-3 transition-all duration-300 ${
                              isActive
                                ? "opacity-100 scale-100 pointer-events-auto z-10"
                                : "opacity-0 scale-95 pointer-events-none z-0"
                            }`}
                          >
                            <img
                              src={previewImg}
                              alt={item.title}
                              onError={() => handleImageError(item.id)}
                              className="max-h-[340px] max-w-full object-contain rounded border border-white/[0.03] shadow-2xl"
                              loading="eager"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-4 p-8 text-center min-h-[320px] z-20">
                    <div className="w-14 h-14 rounded-full bg-[#0c1220] border border-[rgba(255,255,255,0.06)] flex items-center justify-center">
                      <ImageOff size={24} className="text-zinc-600" />
                    </div>
                    <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                      {currentHasImageError ? "Preview Image Unreachable" : "No Certificate Document"}
                    </p>
                    {active.image_url && (
                      <a
                        href={toDownloadUrl(active.image_url) || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 px-4 py-2 rounded-xl bg-[#00FF88]/10 border border-[#00FF88]/30 hover:border-[#00FF88] text-xs font-mono text-white hover:bg-[#00FF88]/20 flex items-center gap-2 transition-all font-semibold uppercase tracking-wider"
                      >
                        <Download size={14} className="text-[#00FF88]" />
                        Download Certificate
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Styled Details and Description Panel */}
              <div className="flex flex-col gap-4 justify-between bg-black/15 rounded-xl border border-[rgba(255,255,255,0.03)] p-4 md:p-5">
                
                {/* Description Body */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.05)] pb-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" />
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-semibold">
                      Credential Description
                    </span>
                  </div>
                  
                  {active.description ? (
                    <p className="text-xs md:text-sm text-zinc-400 font-sans leading-relaxed">
                      {active.description}
                    </p>
                  ) : (
                    <p className="text-xs font-mono text-zinc-600 italic">
                      No additional description provided for this credential node.
                    </p>
                  )}
                </div>

                {/* Technical Dossier Metadata Row */}
                <div className="flex flex-col gap-2 border-t border-[rgba(255,255,255,0.05)] pt-3.5 text-xs font-mono text-zinc-500">
                  <div className="flex justify-between items-center gap-4">
                    <span>ISSUING ORG:</span>
                    <span className="text-zinc-300 font-semibold">{active.issuer}</span>
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    <span>ISSUE DATE:</span>
                    <span className="text-zinc-300 font-semibold">{active.date}</span>
                  </div>
                  {active.credential_url && (
                    <div className="flex justify-between items-center gap-4 pt-1.5 border-t border-[rgba(255,255,255,0.03)]">
                      <span>VERIFICATION:</span>
                      <a
                        href={active.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#00FF88] hover:underline flex items-center gap-1 font-semibold"
                      >
                        ONLINE SECURE <ExternalLink size={10} />
                      </a>
                    </div>
                  )}
                  {active.image_url && (
                    <div className="flex justify-between items-center gap-4 pt-1.5 border-t border-[rgba(255,255,255,0.03)]">
                      <span>DOWNLOAD:</span>
                      <a
                        href={toDownloadUrl(active.image_url) || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#00FF88] hover:underline flex items-center gap-1 font-semibold"
                      >
                        GET FILE <Download size={10} />
                      </a>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Pagination Indicators Footer */}
            <div className="border-t border-[rgba(255,255,255,0.05)] pt-4 flex items-center justify-between z-10">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Showing credential {String(selected + 1).padStart(2, '0')} of {String(achievements.length).padStart(2, '0')}
              </span>
              
              <div className="flex flex-wrap items-center justify-end gap-1.5 max-w-[200px] sm:max-w-none">
                {achievements.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelected(i)}
                    className={`rounded-full transition-all duration-300 ${
                      i === selected ? "w-6 h-1.5 bg-[#00FF88]" : "w-1.5 h-1.5 bg-zinc-700 hover:bg-zinc-500"
                    }`}
                    aria-label={`Go to certificate ${i + 1}`}
                  />
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
