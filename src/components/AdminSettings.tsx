import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAdmin } from "@/hooks/use-admin";
import { ArrowLeft } from "lucide-react";

export default function AdminSettings() {
  const { isAdmin, loading } = useAdmin();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const defaultSettings = {
    site_title: "Your Name",
    site_description: "Full Stack Developer",
    email: "your.email@example.com",
    phone: "+1 (555) 123-4567",
    location: "City, Country",
    github_url: "",
    linkedin_url: "",
    monkeytype_url: "",
    resume_url: "",
  };

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/admin/login");
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value");

      if (error) throw error;

      const settingsMap = {
        ...defaultSettings,
      };

      data?.forEach(({ key, value }) => {
        settingsMap[key] = value || "";
      });

      setSettings(settingsMap);
    } catch (err) {
      console.error("Error fetching settings:", err);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      for (const [key, value] of Object.entries(settings)) {
        const { error: upsertError } = await supabase
          .from("site_settings")
          .upsert(
            { key, value, updated_at: new Date().toISOString() },
            { onConflict: "key" }
          );

        if (upsertError) throw upsertError;
      }

      setMessage("Settings saved successfully!");
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Error saving settings:", err);
      setMessage("Error saving settings");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-300">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#050816] relative overflow-hidden text-zinc-300 font-sans pb-12">
      {/* Background decoration */}
      <div className="absolute -left-12 -top-12 w-48 h-48 rounded-full bg-[#00FF88]/5 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

      <nav className="bg-[#050816]/90 backdrop-blur-xl border-b border-[#00FF88]/15 p-4 relative z-20">
        <div className="container max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/admin/dashboard")}
              className="bg-transparent border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-white/5 font-mono text-xs uppercase"
              size="sm"
            >
              <ArrowLeft size={14} className="mr-1.5" />
              Back
            </Button>
            <h1 className="text-xl font-bold font-space text-white tracking-wide">
              Site <span className="text-[#00FF88] text-gradient">Configuration</span>
            </h1>
          </div>
        </div>
      </nav>

      <div className="container max-w-2xl mx-auto py-8 px-4 relative z-10">
        <div className="bg-[#0b1120]/45 backdrop-blur-xl border border-[rgba(255,255,255,0.07)] rounded-2xl p-6 relative overflow-hidden shadow-2xl">
          {/* Corner Brackets */}
          <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#00FF88]/20 pointer-events-none" />
          <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#00FF88]/20 pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-[#00FF88]/20 pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-[#00FF88]/20 pointer-events-none" />

          {message && (
            <div
              className={`mb-5 p-4 rounded-xl font-mono text-xs border ${message.includes("successfully")
                ? "bg-[#00FF88]/10 border-[#00FF88]/30 text-[#00FF88] shadow-[0_0_10px_rgba(0,255,136,0.05)]"
                : "bg-red-500/10 border-red-500/30 text-red-400"
                }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold font-space text-white border-b border-[rgba(255,255,255,0.05)] pb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" />
                Primary Dossier Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Site Title / Name
                  </label>
                  <Input
                    value={settings.site_title || ""}
                    onChange={(e) =>
                      handleChange("site_title", e.target.value)
                    }
                    className="bg-[#050816]/50 border-[rgba(255,255,255,0.1)] focus:border-[#00FF88]/40 focus:ring-1 focus:ring-[#00FF88]/20 text-zinc-300 font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Site Description / Title
                  </label>
                  <Input
                    value={settings.site_description || ""}
                    onChange={(e) =>
                      handleChange("site_description", e.target.value)
                    }
                    className="bg-[#050816]/50 border-[rgba(255,255,255,0.1)] focus:border-[#00FF88]/40 focus:ring-1 focus:ring-[#00FF88]/20 text-zinc-300 font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Contact Email
                  </label>
                  <Input
                    type="email"
                    value={settings.email || ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="bg-[#050816]/50 border-[rgba(255,255,255,0.1)] focus:border-[#00FF88]/40 focus:ring-1 focus:ring-[#00FF88]/20 text-zinc-300 font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Contact Phone
                  </label>
                  <Input
                    value={settings.phone || ""}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="bg-[#050816]/50 border-[rgba(255,255,255,0.1)] focus:border-[#00FF88]/40 focus:ring-1 focus:ring-[#00FF88]/20 text-zinc-300 font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Contact Location
                  </label>
                  <Input
                    value={settings.location || ""}
                    onChange={(e) => handleChange("location", e.target.value)}
                    className="bg-[#050816]/50 border-[rgba(255,255,255,0.1)] focus:border-[#00FF88]/40 focus:ring-1 focus:ring-[#00FF88]/20 text-zinc-300 font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold font-space text-white border-b border-[rgba(255,255,255,0.05)] pb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" />
                Secure Connection Nodes (Socials)
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    GitHub URL
                  </label>
                  <Input
                    value={settings.github_url || ""}
                    onChange={(e) =>
                      handleChange("github_url", e.target.value)
                    }
                    className="bg-[#050816]/50 border-[rgba(255,255,255,0.1)] focus:border-[#00FF88]/40 focus:ring-1 focus:ring-[#00FF88]/20 text-zinc-300 font-mono text-sm"
                    placeholder="https://github.com/yourname"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    LinkedIn URL
                  </label>
                  <Input
                    value={settings.linkedin_url || ""}
                    onChange={(e) =>
                      handleChange("linkedin_url", e.target.value)
                    }
                    className="bg-[#050816]/50 border-[rgba(255,255,255,0.1)] focus:border-[#00FF88]/40 focus:ring-1 focus:ring-[#00FF88]/20 text-zinc-300 font-mono text-sm"
                    placeholder="https://linkedin.com/in/yourname"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    MonkeyType URL
                  </label>
                  <Input
                    value={settings.monkeytype_url || ""}
                    onChange={(e) =>
                      handleChange("monkeytype_url", e.target.value)
                    }
                    className="bg-[#050816]/50 border-[rgba(255,255,255,0.1)] focus:border-[#00FF88]/40 focus:ring-1 focus:ring-[#00FF88]/20 text-zinc-300 font-mono text-sm"
                    placeholder="https://monkeytype.com/profile/yourname"
                  />
                </div>
              </div>
            </div>

            {/* Resume */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold font-space text-white border-b border-[rgba(255,255,255,0.05)] pb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" />
                Curriculum Vitae Document
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Resume Direct Download URL
                  </label>
                  <Input
                    value={settings.resume_url || ""}
                    onChange={(e) =>
                      handleChange("resume_url", e.target.value)
                    }
                    className="bg-[#050816]/50 border-[rgba(255,255,255,0.1)] focus:border-[#00FF88]/40 focus:ring-1 focus:ring-[#00FF88]/20 text-zinc-300 font-mono text-sm"
                    placeholder="https://drive.google.com/uc?export=download&id=..."
                  />
                  <p className="text-[10px] font-mono text-zinc-600 mt-2 leading-relaxed">
                    Upload your PDF to Google Drive → Share link → paste the direct download URL here.
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#00FF88]/10 border border-[#00FF88]/30 hover:border-[#00FF88] text-[#00FF88] hover:bg-[#00FF88]/20 transition-all font-mono font-bold uppercase tracking-widest shadow-[0_0_12px_rgba(0,255,136,0.1)] py-5"
            >
              {submitting ? "Writing Configuration..." : "Commit Settings Configuration"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
