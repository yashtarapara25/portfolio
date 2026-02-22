import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "@/lib/motions";
import { useSiteSettings } from "@/hooks/use-portfolio-data";
import { Send, Mail, Phone, MapPin, MessageCircle, Sparkles } from "lucide-react";
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
    if (err) { setError("Failed to send. Please try again."); return; }
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };



  const contactItems = [
    settings.email && {
      href: `mailto:${settings.email}`,
      icon: Mail,
      label: "EMAIL",
      value: settings.email,
      gradient: "from-purple-500 to-pink-500",
      shadow: "shadow-purple-500/30",
      border: "border-purple-500/20 hover:border-purple-500/50",
      bg: "bg-purple-500/5 hover:bg-purple-500/10",
    },
    settings.phone && {
      href: `tel:${settings.phone}`,
      icon: Phone,
      label: "PHONE",
      value: settings.phone,
      gradient: "from-blue-500 to-cyan-500",
      shadow: "shadow-blue-500/30",
      border: "border-blue-500/20 hover:border-blue-500/50",
      bg: "bg-blue-500/5 hover:bg-blue-500/10",
    },
    settings.location && {
      href: undefined,
      icon: MapPin,
      label: "LOCATION",
      value: settings.location,
      gradient: "from-cyan-500 to-teal-500",
      shadow: "shadow-cyan-500/30",
      border: "border-cyan-500/20 hover:border-cyan-500/50",
      bg: "bg-cyan-500/5 hover:bg-cyan-500/10",
    },
  ].filter(Boolean) as NonNullable<ReturnType<typeof contactItems.find>>[];

  const inputClass = (field: string) =>
    `w-full px-4 py-3.5 rounded-xl bg-slate-800/50 border text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none transition-all duration-300 font-space ${focusedField === field
      ? "border-cyan-400/70 shadow-[0_0_20px_rgba(34,211,238,0.2)] bg-slate-800/80"
      : "border-cyan-500/20 hover:border-cyan-500/40"
    }`;

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
      <div className="absolute inset-0 grid-pattern opacity-15 pointer-events-none" />
      <div className="absolute top-1/4 -right-32 w-72 h-72 bg-purple-500/8 rounded-full blur-3xl animate-blob pointer-events-none" />
      <div className="absolute -bottom-16 left-1/4 w-72 h-72 bg-cyan-500/8 rounded-full blur-3xl animate-blob animation-delay-4000 pointer-events-none" />

      <div className="container max-w-4xl mx-auto relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="mb-14 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <motion.span
                animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="text-purple-400"
              >
                <MessageCircle size={18} />
              </motion.span>
              <p className="font-display text-sm text-purple-400 tracking-widest uppercase">
                // get in touch
              </p>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold font-orbitron leading-tight mb-4">
              <span className="text-gradient-animated">Let's Connect</span>
            </h2>

            <motion.div
              className="mx-auto h-0.5 bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 rounded-full"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              style={{ width: "140px" }}
            />

            <p className="text-muted-foreground mt-5 max-w-2xl mx-auto font-space leading-relaxed">
              I'm always interested in hearing about new projects, opportunities, or just connecting with fellow developers and researchers.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact info cards */}
            <motion.div variants={fadeUp} className="space-y-4">
              <h3 className="text-base font-bold text-cyan-300 mb-5 font-rajdhani tracking-widest uppercase">
                Quick Links
              </h3>

              {contactItems.map(({ href, icon: Icon, label, value, gradient, shadow, border, bg }, i) => {
                const Tag = href ? motion.a : motion.div;
                return (
                  <Tag
                    key={label}
                    {...(href ? { href } : {})}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ x: 10, scale: 1.02 }}
                    className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer group ${border} ${bg}`}
                  >
                    <motion.div
                      className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg ${shadow}`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon size={20} className="text-white" />
                    </motion.div>
                    <div>
                      <p className="text-xs text-muted-foreground font-bold mb-1 font-display tracking-widest">
                        {label}
                      </p>
                      <p className="text-sm font-space text-cyan-300 group-hover:text-cyan-200 transition-colors">
                        {value}
                      </p>
                    </div>
                  </Tag>
                );
              })}
            </motion.div>

            {/* Contact form */}
            <motion.form
              variants={fadeUp}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Name */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <input
                  type="text"
                  placeholder="Your Name"
                  required maxLength={100}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  className={inputClass("name")}
                />
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
              >
                <input
                  type="email"
                  placeholder="Your Email"
                  required maxLength={255}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className={inputClass("email")}
                />
              </motion.div>

              {/* Message */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <textarea
                  placeholder="Your Message"
                  rows={5}
                  required maxLength={1000}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  onFocus={() => setFocusedField("message")}
                  onBlur={() => setFocusedField(null)}
                  className={`${inputClass("message")} resize-none`}
                />
              </motion.div>

              {/* Submit */}
              <motion.button
                type="submit"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25 }}
                whileHover={{ scale: 1.03, boxShadow: "0 0 35px rgba(34,211,238,0.5)" }}
                whileTap={{ scale: 0.97 }}
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm hover:shadow-2xl transition-all relative overflow-hidden group font-space"
              >
                <span className="relative z-10 flex items-center gap-2.5">
                  {sent ? (
                    <>
                      <motion.span
                        animate={{ scale: [1, 1.4, 1], rotate: [0, 15, 0] }}
                        transition={{ duration: 0.6 }}
                      >
                        <Sparkles size={16} />
                      </motion.span>
                      Sent Successfully!
                    </>
                  ) : (
                    <>
                      Send Message
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <Send size={16} />
                      </motion.span>
                    </>
                  )}
                </span>

                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Shimmer sweep */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </motion.button>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
