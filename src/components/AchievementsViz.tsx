import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motions";
import { useAchievements } from "@/hooks/use-portfolio-data";
import { ExternalLink, Award } from "lucide-react";

export default function AchievementsViz() {
    const { achievements, loading } = useAchievements();

    if (loading || achievements.length === 0) return null;

    return (
        <section className="py-24 relative max-w-6xl mx-auto px-4 z-10" id="certificates">
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
            >
                <motion.div variants={fadeUp} className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-4 font-space">
                        <Award size={14} />
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Certifications</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white font-orbitron mb-4">
                        Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Achievements</span>
                    </h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {achievements.map((item) => (
                        <motion.div
                            key={item.id}
                            variants={fadeUp}
                            whileHover={{ y: -5 }}
                            className="glass-card rounded-2xl p-8 border border-white/5 flex flex-col h-full bg-[#0a0f1d]/40 hover:bg-[#0a0f1d]/60 hover:border-cyan-500/30 transition-all duration-500 group/card"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover/card:scale-110 transition-transform">
                                    <Award size={24} />
                                </div>
                                <span className="text-[10px] font-space font-bold px-3 py-1 bg-white/5 text-slate-400 rounded-full border border-white/5 uppercase tracking-widest">
                                    {item.date}
                                </span>
                            </div>

                            <div className="flex-1 mb-8">
                                <h3 className="text-xl font-bold font-space text-white mb-2 leading-tight group-hover/card:text-cyan-300 transition-colors">
                                    {item.title}
                                </h3>
                                <div className="flex items-center gap-2 mb-4 opacity-80">
                                    <div className="w-1 h-4 bg-cyan-500 rounded-full" />
                                    <p className="text-sm font-bold text-cyan-400 font-space tracking-wide">
                                        {item.issuer}
                                    </p>
                                </div>
                                {item.description && (
                                    <p className="text-sm text-slate-400 font-space leading-relaxed line-clamp-4">
                                        {item.description}
                                    </p>
                                )}
                            </div>

                            <div className="pt-6 border-t border-white/5">
                                {item.image_url ? (
                                    <a
                                        href={item.image_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-xs font-bold font-space text-cyan-400 hover:text-cyan-300 transition-all group/link"
                                    >
                                        <span className="relative">
                                            View Certificate
                                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all group-hover/link:w-full" />
                                        </span>
                                        <ExternalLink size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                    </a>
                                ) : (
                                    <span className="text-xs font-space text-slate-500 italic">Credential details on request</span>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
