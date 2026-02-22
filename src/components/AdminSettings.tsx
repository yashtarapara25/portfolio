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
    twitter_url: "",
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <nav className="bg-gray-900 border-b border-gray-700 p-4">
        <div className="container max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/admin/dashboard")}
              variant="ghost"
              size="sm"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-cyan-400">
              Site Settings
            </h1>
          </div>
        </div>
      </nav>

      <div className="container max-w-2xl mx-auto py-8 px-4">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          {message && (
            <div
              className={`mb-4 p-4 rounded ${message.includes("successfully")
                  ? "bg-green-500/10 border border-green-500/50 text-green-400"
                  : "bg-red-500/10 border border-red-500/50 text-red-400"
                }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">
                Basic Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Site Title / Name
                  </label>
                  <Input
                    value={settings.site_title || ""}
                    onChange={(e) =>
                      handleChange("site_title", e.target.value)
                    }
                    className="bg-gray-700 border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Site Description / Title
                  </label>
                  <Input
                    value={settings.site_description || ""}
                    onChange={(e) =>
                      handleChange("site_description", e.target.value)
                    }
                    className="bg-gray-700 border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={settings.email || ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone
                  </label>
                  <Input
                    value={settings.phone || ""}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location
                  </label>
                  <Input
                    value={settings.location || ""}
                    onChange={(e) => handleChange("location", e.target.value)}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">
                Social Links
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    GitHub URL
                  </label>
                  <Input
                    value={settings.github_url || ""}
                    onChange={(e) =>
                      handleChange("github_url", e.target.value)
                    }
                    className="bg-gray-700 border-gray-600"
                    placeholder="https://github.com/yourname"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    LinkedIn URL
                  </label>
                  <Input
                    value={settings.linkedin_url || ""}
                    onChange={(e) =>
                      handleChange("linkedin_url", e.target.value)
                    }
                    className="bg-gray-700 border-gray-600"
                    placeholder="https://linkedin.com/in/yourname"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Twitter URL
                  </label>
                  <Input
                    value={settings.twitter_url || ""}
                    onChange={(e) =>
                      handleChange("twitter_url", e.target.value)
                    }
                    className="bg-gray-700 border-gray-600"
                    placeholder="https://twitter.com/yourname"
                  />
                </div>
              </div>
            </div>

            {/* Resume */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">
                Resume
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Resume URL
                  </label>
                  <Input
                    value={settings.resume_url || ""}
                    onChange={(e) =>
                      handleChange("resume_url", e.target.value)
                    }
                    className="bg-gray-700 border-gray-600"
                    placeholder="https://drive.google.com/uc?export=download&id=..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload your PDF to Google Drive → Share → Copy link → paste the direct download URL here.
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-cyan-600 hover:bg-cyan-700"
            >
              {submitting ? "Saving..." : "Save Settings"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
