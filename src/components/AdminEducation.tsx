import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAdmin } from "@/hooks/use-admin";
import type { Tables } from "@/integrations/supabase";
import { Plus, Delete, Edit, ArrowLeft } from "lucide-react";

type Education = Tables<"education">;

export default function AdminEducation() {
  const { isAdmin, loading } = useAdmin();
  const navigate = useNavigate();
  const [educations, setEducations] = useState<Education[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    year: new Date().getFullYear().toString(),
    institution: "",
    degree: "",
    summary: "",
    sort_order: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [loadingEducations, setLoadingEducations] = useState(true);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/admin/login");
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    fetchEducations();
  }, []);

  const fetchEducations = async () => {
    try {
      const { data, error } = await supabase
        .from("education")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setEducations(data || []);
    } catch (err) {
      console.error("Error fetching educations:", err);
    } finally {
      setLoadingEducations(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from("education")
          .update(formData)
          .eq("id", editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("education")
          .insert([formData]);

        if (error) throw error;
      }

      setFormData({
        year: new Date().getFullYear().toString(),
        institution: "",
        degree: "",
        summary: "",
        sort_order: 0,
      });
      setEditingId(null);
      setShowForm(false);
      fetchEducations();
    } catch (err) {
      console.error("Error saving education:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (education: Education) => {
    setFormData({
      year: education.year,
      institution: education.institution,
      degree: education.degree || "",
      summary: education.summary || "",
      sort_order: education.sort_order ?? 0,
    });
    setEditingId(education.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education entry?"))
      return;

    try {
      const { error } = await supabase
        .from("education")
        .delete()
        .eq("id", id);

      if (error) throw error;
      fetchEducations();
    } catch (err) {
      console.error("Error deleting education:", err);
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
              Manage <span className="text-[#00FF88] text-gradient">Education</span>
            </h1>
          </div>
          <Button
            onClick={() => {
              setFormData({
                year: new Date().getFullYear().toString(),
                institution: "",
                degree: "",
                summary: "",
                sort_order: 0,
              });
              setEditingId(null);
              setShowForm(true);
            }}
            className="gap-1.5 bg-[#00FF88]/10 border border-[#00FF88]/30 hover:border-[#00FF88] text-[#00FF88] hover:bg-[#00FF88]/20 transition-all font-mono text-xs uppercase font-bold tracking-wider"
          >
            <Plus size={14} />
            Add Education
          </Button>
        </div>
      </nav>

      <div className="container max-w-6xl mx-auto py-8 px-4 relative z-10">
        {showForm && (
          <div className="bg-[#0b1120]/45 backdrop-blur-xl border border-[rgba(255,255,255,0.07)] rounded-2xl p-6 mb-8 relative overflow-hidden shadow-2xl">
            {/* Corner Brackets */}
            <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#00FF88]/20 pointer-events-none" />
            <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#00FF88]/20 pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-[#00FF88]/20 pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-[#00FF88]/20 pointer-events-none" />

            <h2 className="text-xl font-bold font-space text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" />
              {editingId ? "Modify Education Entry" : "Register New Academic Node"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Year Range
                  </label>
                  <Input
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: e.target.value })
                    }
                    className="bg-[#050816]/50 border-[rgba(255,255,255,0.1)] focus:border-[#00FF88]/40 focus:ring-1 focus:ring-[#00FF88]/20 text-zinc-300 font-mono text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Institution
                  </label>
                  <Input
                    value={formData.institution}
                    onChange={(e) =>
                      setFormData({ ...formData, institution: e.target.value })
                    }
                    className="bg-[#050816]/50 border-[rgba(255,255,255,0.1)] focus:border-[#00FF88]/40 focus:ring-1 focus:ring-[#00FF88]/20 text-zinc-300 font-mono text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Order index <span className="text-zinc-600">(lower = first)</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) =>
                      setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })
                    }
                    className="bg-[#050816]/50 border-[rgba(255,255,255,0.1)] focus:border-[#00FF88]/40 focus:ring-1 focus:ring-[#00FF88]/20 text-zinc-300 font-mono text-sm"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Degree / Qualification
                </label>
                <Input
                  value={formData.degree}
                  onChange={(e) =>
                    setFormData({ ...formData, degree: e.target.value })
                  }
                  className="bg-[#050816]/50 border-[rgba(255,255,255,0.1)] focus:border-[#00FF88]/40 focus:ring-1 focus:ring-[#00FF88]/20 text-zinc-300 font-mono text-sm"
                  placeholder="e.g. Bachelor of Technology in Computer Engineering"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Dossier Summary
                </label>
                <Textarea
                  value={formData.summary}
                  onChange={(e) =>
                    setFormData({ ...formData, summary: e.target.value })
                  }
                  className="bg-[#050816]/50 border-[rgba(255,255,255,0.1)] focus:border-[#00FF88]/40 focus:ring-1 focus:ring-[#00FF88]/20 text-zinc-300 font-mono text-sm min-h-[80px]"
                  placeholder="Brief description of your academic details, scores, projects..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#00FF88]/10 border border-[#00FF88]/30 hover:border-[#00FF88] text-[#00FF88] hover:bg-[#00FF88]/20 transition-all font-mono text-xs uppercase font-bold tracking-wider"
                >
                  {submitting ? "Processing..." : "Commit Entry"}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="bg-transparent border border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 hover:bg-white/5 font-mono text-xs uppercase"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" />
            <h2 className="text-xl font-bold font-space text-white tracking-wide">
              {loadingEducations
                ? "Scanning Registry..."
                : `Academic Registry Entries (${educations.length})`}
            </h2>
          </div>

          <div className="space-y-4">
            {educations.map((education) => (
              <div
                key={education.id}
                className="bg-[#0b1120]/45 backdrop-blur-xl border border-[rgba(255,255,255,0.06)] hover:border-[#00FF88]/20 rounded-xl p-5 transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row justify-between items-start gap-4"
              >
                {/* Accent Brackets */}
                <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[#00FF88]/20 pointer-events-none" />
                <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[#00FF88]/20 pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-[#00FF88]/20 pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-[#00FF88]/20 pointer-events-none" />

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-lg font-bold text-white font-space leading-tight">
                      {education.degree || "Degree Unlisted"}
                    </h3>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-[#00FF88]/20 bg-[#00FF88]/5 text-white">
                      {education.year}
                    </span>
                    {education.sort_order !== null && (
                      <span className="text-[9px] font-mono text-zinc-500 border border-zinc-800 px-1.5 py-0.5 rounded">
                        ORDER: {education.sort_order}
                      </span>
                    )}
                  </div>
                  <p className="text-[#00FF88] text-xs font-mono font-semibold uppercase tracking-wider mt-1.5">
                    {education.institution}
                  </p>
                  {education.summary && (
                    <p className="text-sm text-zinc-400 mt-2.5 leading-relaxed bg-[#050816]/30 p-3 rounded-lg border border-[rgba(255,255,255,0.03)] font-sans">
                      {education.summary}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 shrink-0 self-end md:self-start">
                  <Button
                    onClick={() => handleEdit(education)}
                    className="bg-transparent border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-white/5 p-2 h-8 w-8"
                    size="sm"
                  >
                    <Edit size={13} />
                  </Button>
                  <Button
                    onClick={() => handleDelete(education.id)}
                    className="bg-transparent border border-red-500/20 text-red-400 hover:text-white hover:border-red-500 hover:bg-red-500/10 p-2 h-8 w-8"
                    size="sm"
                  >
                    <Delete size={13} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
