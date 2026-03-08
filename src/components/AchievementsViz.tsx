import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motions";
import { useAchievements } from "@/hooks/use-portfolio-data";
import { ExternalLink, Award } from "lucide-react";

export default function AchievementsViz() {
    const { achievements, loading } = useAchievements();

    if (loading || achievements.length === 0) return null;

    return (
        <section className="py-20 relative max-w-6xl mx-auto px-4 z-10" id="achievements">
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
            >
                <motion.div variants={fadeUp} className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-500/20 text-orange-400 mb-4 animate-pulse">
                        <Award size={16} />
                        <span className="text-sm font-space font-medium tracking-wider uppercase">Certifications</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white font-orbitron mb-4">
                        Licenses & <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">Awards</span>
                    </h2>
                    <div className="h-1 w-24 bg-gradient-to-r from-orange-400 to-pink-500 mx-auto rounded-full" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {achievements.map((item, index) => (
                        <motion.a
                            href={item.credential_url || "#"}
                            target={item.credential_url ? "_blank" : "_self"}
                            rel="noopener noreferrer"
                            key={item.id}
                            variants={fadeUp}
                            whileHover={{
                                y: -8,
                                scale: 1.02,
                                boxShadow: "0 20px 40px -15px rgba(249,115,22,0.25)",
                                borderColor: "rgba(249,115,22,0.3)"
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className={`glass-card rounded-2xl p-6 border border-white/5 transition-all duration-300 relative group/card flex flex-col h-full bg-[#0a0f1d]/80 ${!item.credential_url && "cursor-default"}`}
                        >
                            {/* Glowing ambient background on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-pink-500/0 to-orange-500/0 group-hover/card:from-orange-500/5 group-hover/card:to-pink-500/5 transition-all duration-500 rounded-2xl pointer-events-none" />

                            <div className="flex justify-between items-start mb-6 align-top">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/10 to-pink-500/10 border border-orange-500/20 shadow-lg shadow-black/20 group-hover/card:border-orange-500/50 transition-colors">
                                    <Award size={24} className="text-orange-400" />
                                </div>
                                {item.credential_url && (
                                    <div className="text-slate-500 group-hover/card:text-orange-400 transition-colors">
                                        <ExternalLink size={20} />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1">
                                <h3 className="text-xl font-bold font-orbitron text-white mb-2 group-hover/card:text-orange-300 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-sm font-space text-orange-400/80 mb-4 uppercase tracking-wider font-semibold">
                                    {item.issuer}
                                </p>
                                {item.description && (
                                    <p className="text-slate-400 font-space text-sm leading-relaxed mb-4">
                                        {item.description}
                                    </p>
                                )}
                            </div>

                            <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                                <span className="text-xs font-space font-medium text-slate-500 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                                    Issued {item.date}
                                </span>
                                {item.image_url && (
                                    <img src={item.image_url} alt="Badge" className="h-8 w-8 object-contain opacity-80 group-hover/card:opacity-100 transition-opacity" />
                                )}
                            </div>
                        </motion.a>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
