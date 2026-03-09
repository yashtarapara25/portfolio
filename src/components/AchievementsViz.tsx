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
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-4 animate-pulse">
                        <Award size={16} />
                        <span className="text-sm font-space font-medium tracking-wider uppercase">Certifications</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white font-orbitron mb-4">
                        Licenses & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Awards</span>
                    </h2>
                    <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {achievements.map((item, index) => (
                        <motion.article
                            key={item.id}
                            variants={fadeUp}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            whileHover={{ y: -10, transition: { type: "spring", stiffness: 300 } }}
                            className="group relative rounded-2xl overflow-hidden bg-slate-900/50 backdrop-blur-sm h-full flex flex-col cursor-pointer"
                        >
                            {/* Spinning gradient border effect */}
                            <motion.div
                                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                style={{
                                    padding: "1px",
                                    background: "linear-gradient(90deg, #22d3ee, #3b82f6, #a855f7, #ec4899, #22d3ee)",
                                    backgroundSize: "300% 300%",
                                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                                    WebkitMaskComposite: "xor",
                                    maskComposite: "exclude",
                                }}
                                animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
                                transition={{ duration: 1.5, ease: "linear" }}
                            />

                            {/* Inner card */}
                            <div className="relative h-full flex flex-col rounded-2xl overflow-hidden border border-cyan-500/15 group-hover:border-transparent transition-colors duration-500 p-6 z-10">
                                {/* Hover glow overlay */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-purple-600/10 pointer-events-none -z-10"
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                    transition={{ duration: 0.4 }}
                                />

                                <div className="flex justify-between items-start mb-6 align-top">
                                    <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 shadow-lg shadow-black/20 group-hover:border-cyan-500/50 transition-colors">
                                        <Award size={24} className="text-cyan-400" />
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400 mb-2 leading-snug group-hover:from-cyan-200 group-hover:to-purple-400 transition-all duration-300">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm font-space text-cyan-400/80 mb-4 uppercase tracking-wider font-semibold">
                                        {item.issuer}
                                    </p>
                                    {item.description && (
                                        <p className="text-slate-400 font-space text-sm leading-relaxed mb-4">
                                            {item.description}
                                        </p>
                                    )}
                                </div>

                                <div className="mt-auto pt-4 border-t border-cyan-500/15 flex flex-wrap gap-4 items-center justify-between">
                                    <span className="text-xs font-space font-medium text-slate-400 px-3 py-1 bg-cyan-500/10 rounded-full border border-cyan-500/20 whitespace-nowrap">
                                        Issued {item.date}
                                    </span>
                                    {item.image_url && (
                                        <a
                                            href={item.image_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-200 font-space relative group/link"
                                        >
                                            <ExternalLink size={13} />
                                            <span>Show Certificate</span>
                                            <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-cyan-400 to-blue-500 group-hover/link:w-full transition-all duration-300" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
