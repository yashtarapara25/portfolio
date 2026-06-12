import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, fadeUp } from "@/lib/motions";
import { useSiteSettings } from "@/hooks/use-portfolio-data";
import {
  Send, Mail, Phone, MapPin, MessageSquare, Sparkles,
  Radio, Terminal, Lock, CheckCircle2, Zap
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function Contact() {
  const { settings, loading: settingsLoading } = useSiteSettings();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: err } = await (supabase as any).from("contact_messages").insert([
      { name: form.name, email: form.email, message: form.message, read: false },
    ]);
    setSubmitting(false);
    if (err) { setError("Transmission failed. Please retry."); return; }
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 5000);
  };

  const contactItems = settingsLoading ? [] : [
    settings.email && {
      href: `mailto:${settings.email}`,
      icon: Mail,
      label: "EMAIL_ADDR",
      value: settings.email,
      tag: "CHANNEL_01",
    },
    settings.phone && {
      href: `tel:${settings.phone}`,
      icon: Phone,
      label: "COMM_LINE",
      value: settings.phone,
      tag: "CHANNEL_02",
    },
    settings.location && {
      href: undefined,
      icon: MapPin,
      label: "GEO_NODE",
      value: settings.location,
      tag: "CHANNEL_03",
    },
  ].filter(Boolean) as Array<{
    href: string | undefined;
    icon: typeof Mail;
    label: string;
    value: string;
    tag: string;
  }>;

  const fieldClass = (field: string) =>
    `w-full px-4 py-3.5 rounded-lg bg-[#050d1a]/60 border text-white text-sm placeholder:text-zinc-600 focus:outline-none transition-all duration-300 font-mono ${
      focusedField === field
        ? "border-[#00FF88]/50 shadow-[0_0_20px_rgba(0,255,136,0.08),inset_0_0_20px_rgba(0,255,136,0.02)] bg-[#050d1a]/90"
        : "border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.14)]"
    }`;

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      {/* Background ambiance */}
      <div className="absolute inset-0 pointer-events-none">
      </div>

      <div className="container max-w-6xl mx-auto relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20px" }}
        >
          {/* ── Section Header ───────────────────────────────── */}
          <motion.div variants={fadeUp} className="mb-16">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[#00FF88]"><Radio size={15} /></span>
              <p className="font-mono text-xs text-zinc-400 tracking-widest uppercase">
                Open Transmission Channel
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <h2 className="text-3xl sm:text-5xl font-bold font-space tracking-tight text-white">
                Initiate <span className="text-[#00FF88]">Contact</span>
              </h2>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00FF88]/20 bg-[#00FF88]/5 w-fit">
                <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
                <span className="font-mono text-[10px] text-white uppercase tracking-widest">
                  Channel Open · Ready to Receive
                </span>
              </div>
            </div>
            <div className="mt-4 h-px w-full bg-[rgba(255,255,255,0.06)] relative">
              <div className="absolute top-0 left-0 h-px w-32 bg-gradient-to-r from-[#00FF88] to-transparent" />
            </div>
          </motion.div>

          {/* ── Main Two-Column Layout ───────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

            {/* ── LEFT: Contact Dossier Panel ─────────────────── */}
            <motion.div variants={fadeUp} className="lg:col-span-2 flex flex-col gap-4">

              {/* Dossier header card */}
              <div className="relative rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#080f1e]/70 backdrop-blur-xl overflow-hidden p-6">
                {/* Corner brackets */}
                <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-[#00FF88]/40" />
                <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[#00FF88]/40" />
                <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-[#00FF88]/40" />
                <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-[#00FF88]/40" />

                {/* Scanning sweep — CSS transform (GPU, zero layout cost) */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
                  <div className="hud-scan-slow" />
                </div>

                {/* Status header */}
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-[rgba(255,255,255,0.05)]">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] text-[#00FF88] animate-pulse">●</span>
                    <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
                      SYS // CONTACT_DOSSIER
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-zinc-700" />
                    <div className="w-2 h-2 rounded-full bg-[#00FF88]/40" />
                    <div className="w-2 h-2 rounded-full bg-[#00FF88]" />
                  </div>
                </div>

                {/* Availability */}
                <div className="mb-5">
                  <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest mb-2">Current Status</p>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[#00FF88]/5 border border-[#00FF88]/15">
                    <div className="relative">
                      <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-[#00FF88] opacity-50" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-[#00FF88]" />
                    </div>
                    <div>
                      <p className="font-mono text-xs font-bold text-white">AVAILABLE FOR OPPORTUNITIES</p>
                      <p className="font-mono text-[9px] text-zinc-500 mt-0.5">Open to freelance & full-time roles</p>
                    </div>
                  </div>
                </div>

                {/* Contact channels */}
                {contactItems.length > 0 && (
                  <div className="space-y-2.5">
                    <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest mb-2.5">
                      Comm Channels
                    </p>
                    {contactItems.map(({ href, icon: Icon, label, value, tag }) => {
                      const Wrapper = href ? "a" : "div";
                      return (
                        <Wrapper
                          key={label}
                          {...(href ? { href } : {})}
                          className="flex items-center gap-3.5 p-3.5 rounded-xl border border-[rgba(255,255,255,0.05)] bg-[#050d1a]/40 hover:border-[#00FF88]/25 hover:bg-[#00FF88]/[0.03] transition-all duration-300 group cursor-pointer"
                        >
                          <div className="w-9 h-9 rounded-lg border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)] flex items-center justify-center text-zinc-400 group-hover:text-[#00FF88] group-hover:border-[#00FF88]/25 transition-all duration-300 flex-shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
                            <Icon size={16} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-mono text-[9px] text-[#00FF88]/70 uppercase tracking-widest font-semibold">{label}</p>
                              <span className="font-mono text-[8px] text-zinc-500 border border-[rgba(255,255,255,0.06)] bg-white/[0.01] px-1.5 py-0.5 rounded">{tag}</span>
                            </div>
                            <p className="font-mono text-sm sm:text-base text-white font-bold group-hover:text-[#00FF88] transition-colors truncate mt-1">
                              {value}
                            </p>
                          </div>
                        </Wrapper>
                      );
                    })}
                  </div>
                )}

                {/* System metrics */}
                <div className="mt-5 pt-4 border-t border-[rgba(255,255,255,0.04)] grid grid-cols-3 gap-3">
                  {[
                    { label: "RESP_TIME", val: "< 24h" },
                    { label: "COMM_TYPE", val: "DIRECT" },
                    { label: "NODE_STAT", val: "ONLINE" },
                  ].map(({ label, val }) => (
                    <div key={label} className="text-center">
                      <p className="font-mono text-[7px] text-zinc-600 uppercase tracking-wider">{label}</p>
                      <p className="font-mono text-[10px] text-[#00FF88] font-bold mt-0.5">{val}</p>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>

            {/* ── RIGHT: Encrypted Comm Form ───────────────────── */}
            <motion.div variants={fadeUp} className="lg:col-span-3">
              <div className="relative rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#080f1e]/70 backdrop-blur-xl overflow-hidden">

                {/* Scanning sweep — CSS transform (GPU, zero layout cost) */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
                  <div className="hud-scan-slow hud-scan-delay" />
                </div>

                {/* Form chrome top bar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.05)] bg-[#050d1a]/50">
                  <div className="flex items-center gap-2">
                    <Terminal size={13} className="text-[#00FF88]" />
                    <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
                      TRANSMISSION_CHANNEL // MSG_COMPOSER
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[8px] text-[#00FF88]/60 uppercase tracking-wider">Online</span>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <AnimatePresence mode="wait">
                    {sent ? (
                      /* ── Success State ── */
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex flex-col items-center justify-center py-16 gap-5 text-center"
                      >
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full bg-[#00FF88]/10 border border-[#00FF88]/30 flex items-center justify-center">
                            <CheckCircle2 size={28} className="text-[#00FF88]" />
                          </div>
                          <motion.div
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 rounded-full border border-[#00FF88]/30"
                          />
                        </div>
                        <div>
                          <p className="font-mono text-[10px] text-[#00FF88] uppercase tracking-widest mb-2">
                            TRANSMISSION_COMPLETE
                          </p>
                          <h3 className="text-xl font-bold font-space text-white mb-2">Message Received!</h3>
                          <p className="font-space text-sm text-zinc-400 max-w-xs">
                            Your message has been successfully delivered. I'll respond within 24 hours.
                          </p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00FF88]/5 border border-[#00FF88]/15">
                          <Sparkles size={12} className="text-[#00FF88]" />
                          <span className="font-mono text-[10px] text-white">MSG_ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
                        </div>
                      </motion.div>
                    ) : (
                      /* ── Form State ── */
                      <motion.form
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={handleSubmit}
                        className="space-y-5"
                      >
                        {/* Row: Name + Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                              <span className="text-[#00FF88]">//</span> Sender_Name
                            </label>
                            <input
                              type="text"
                              placeholder="Your full name"
                              required
                              maxLength={100}
                              value={form.name}
                              onChange={(e) => setForm({ ...form, name: e.target.value })}
                              onFocus={() => setFocusedField("name")}
                              onBlur={() => setFocusedField(null)}
                              className={fieldClass("name")}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                              <span className="text-[#00FF88]">//</span> Reply_Address
                            </label>
                            <input
                              type="email"
                              placeholder="your@email.com"
                              required
                              maxLength={255}
                              value={form.email}
                              onChange={(e) => setForm({ ...form, email: e.target.value })}
                              onFocus={() => setFocusedField("email")}
                              onBlur={() => setFocusedField(null)}
                              className={fieldClass("email")}
                            />
                          </div>
                        </div>

                        {/* Message */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                              <span className="text-[#00FF88]">//</span> Message_Payload
                            </label>
                            <span className="font-mono text-[9px] text-zinc-600">
                              {form.message.length} / 1000
                            </span>
                          </div>
                          <textarea
                            placeholder="Describe your project, idea, or opportunity..."
                            rows={7}
                            required
                            maxLength={1000}
                            value={form.message}
                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                            onFocus={() => setFocusedField("message")}
                            onBlur={() => setFocusedField(null)}
                            className={`${fieldClass("message")} resize-none`}
                          />
                        </div>

                        {/* Metadata row */}
                        <div className="flex flex-wrap items-center gap-3 py-3 px-4 rounded-lg bg-[#050d1a]/50 border border-[rgba(255,255,255,0.04)]">
                          {[
                            { icon: Mail, text: "Direct Delivery" },
                            { icon: Zap, text: "< 24h Response" },
                            { icon: MessageSquare, text: "Direct to Inbox" },
                          ].map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-center gap-1.5 text-zinc-600">
                              <Icon size={10} className="text-[#00FF88]/50" />
                              <span className="font-mono text-[9px] uppercase tracking-wide">{text}</span>
                            </div>
                          ))}
                        </div>

                        {/* Error */}
                        {error && (
                          <motion.p
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xs text-red-400 font-mono border border-red-500/20 bg-red-500/5 px-3 py-2 rounded-lg"
                          >
                            ⚠ {error}
                          </motion.p>
                        )}

                        {/* Submit */}
                        <motion.button
                          type="submit"
                          disabled={submitting}
                          whileHover={!submitting ? { scale: 1.01, boxShadow: "0 0 30px rgba(0,255,136,0.25)" } : {}}
                          whileTap={!submitting ? { scale: 0.99 } : {}}
                          className="w-full relative overflow-hidden rounded-xl py-4 px-6 font-bold font-space text-sm flex items-center justify-center gap-2.5 transition-all duration-300 bg-[#00FF88] text-[#050816] disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {/* Shimmer */}
                          {!submitting && (
                            <motion.div
                              animate={{ x: ["-100%", "200%"] }}
                              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", repeatDelay: 1 }}
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
                            />
                          )}
                          <span className="relative z-10 flex items-center gap-2.5">
                            {submitting ? (
                              <>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                  className="w-4 h-4 border-2 border-[#050816]/30 border-t-[#050816] rounded-full"
                                />
                                <span>Transmitting...</span>
                              </>
                            ) : (
                              <>
                                <Send size={15} />
                                <span>Send Message</span>
                              </>
                            )}
                          </span>
                        </motion.button>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
