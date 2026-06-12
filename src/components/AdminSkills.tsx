import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdmin } from "@/hooks/use-admin";
import type { Tables } from "@/integrations/supabase";
import { Plus, Delete, Edit, ArrowLeft } from "lucide-react";

type Skill = Tables<"skills">;

const CATEGORIES = ["languages", "frameworks", "tools", "ai-ml"];

export default function AdminSkills() {
  const { isAdmin, loading } = useAdmin();
  const navigate = useNavigate();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    level: 80,
    category: "languages" as const,
  });
  const [submitting, setSubmitting] = useState(false);
  const [loadingSkills, setLoadingSkills] = useState(true);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/admin/login");
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("category", { ascending: true })
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setSkills(data || []);
    } catch (err) {
      console.error("Error fetching skills:", err);
    } finally {
      setLoadingSkills(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from("skills")
          .update(formData)
          .eq("id", editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("skills").insert([formData]);

        if (error) throw error;
      }

      setFormData({
        name: "",
        level: 80,
        category: "languages",
      });
      setEditingId(null);
      setShowForm(false);
      fetchSkills();
    } catch (err) {
      console.error("Error saving skill:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (skill: Skill) => {
    setFormData({
      name: skill.name,
      level: skill.level || 80,
      category: (skill.category as any) || "languages",
    });
    setEditingId(skill.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;

    try {
      const { error } = await supabase.from("skills").delete().eq("id", id);

      if (error) throw error;
      fetchSkills();
    } catch (err) {
      console.error("Error deleting skill:", err);
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

  const groupedSkills = CATEGORIES.reduce(
    (acc, category) => {
      acc[category] = skills.filter((s) => s.category === category);
      return acc;
    },
    {} as Record<string, Skill[]>
  );

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
              Manage <span className="text-[#00FF88] text-gradient">Skills</span>
            </h1>
          </div>
          <Button
            onClick={() => {
              setFormData({
                name: "",
                level: 80,
                category: "languages",
              });
              setEditingId(null);
              setShowForm(true);
            }}
            className="gap-1.5 bg-[#00FF88]/10 border border-[#00FF88]/30 hover:border-[#00FF88] text-[#00FF88] hover:bg-[#00FF88]/20 transition-all font-mono text-xs uppercase font-bold tracking-wider"
          >
            <Plus size={14} />
            Add Skill
          </Button>
        </div>
      </nav>

      <div className="container max-w-6xl mx-auto py-8 px-4 relative z-10">
        {showForm && (
          <div className="bg-[#0b1120]/45 backdrop-blur-xl border border-[rgba(255,255,255,0.07)] rounded-2xl p-6 mb-8 relative overflow-hidden">
            {/* Corner Brackets */}
            <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#00FF88]/20 pointer-events-none" />
            <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#00FF88]/20 pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-[#00FF88]/20 pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-[#00FF88]/20 pointer-events-none" />
            
            <h2 className="text-xl font-bold font-space text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" />
              {editingId ? "Modify Skill Entry" : "Register New Skill Module"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Name
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="bg-[#050816]/50 border-[rgba(255,255,255,0.1)] focus:border-[#00FF88]/40 focus:ring-1 focus:ring-[#00FF88]/20 text-zinc-300 font-mono text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Level ({formData.level}%)
                  </label>
                  <div className="flex items-center gap-3 py-1">
                    <Input
                      type="range"
                      min="1"
                      max="100"
                      value={formData.level}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          level: parseInt(e.target.value),
                        })
                      }
                      className="flex-1 accent-[#00FF88] h-1.5 bg-[#050816]/80 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as any,
                      })
                    }
                    className="w-full bg-[#050816]/50 border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 text-zinc-300 font-mono text-sm focus:border-[#00FF88]/40 focus:ring-1 focus:ring-[#00FF88]/20 focus:outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#0b1120] text-zinc-300">
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
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

        <div className="space-y-10">
          {CATEGORIES.map((category) => (
            <div key={category} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" />
                <h2 className="text-xl font-bold font-space text-white capitalize tracking-wide">
                  {category === "ai-ml" ? "AI / ML Focus" : `${category} Registry`} ({groupedSkills[category].length})
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupedSkills[category].map((skill) => (
                  <div
                    key={skill.id}
                    className="bg-[#0b1120]/45 backdrop-blur-xl border border-[rgba(255,255,255,0.06)] hover:border-[#00FF88]/20 rounded-xl p-4 transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Accent Brackets */}
                    <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[#00FF88]/20 pointer-events-none" />
                    <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[#00FF88]/20 pointer-events-none" />
                    <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-[#00FF88]/20 pointer-events-none" />
                    <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-[#00FF88]/20 pointer-events-none" />

                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-base font-bold text-white font-space">
                          {skill.name}
                        </h3>
                        <p className="text-xs font-mono text-zinc-500">
                          NODE_LEVEL: {skill.level}%
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEdit(skill)}
                          className="bg-transparent border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-white/5 p-2 h-8 w-8"
                          size="sm"
                        >
                          <Edit size={13} />
                        </Button>
                        <Button
                          onClick={() => handleDelete(skill.id)}
                          className="bg-transparent border border-red-500/20 text-red-400 hover:text-white hover:border-red-500 hover:bg-red-500/10 p-2 h-8 w-8"
                          size="sm"
                        >
                          <Delete size={13} />
                        </Button>
                      </div>
                    </div>

                    <div className="w-full bg-[#050816]/80 rounded-full h-1.5 overflow-hidden border border-white/[0.03]">
                      <div
                        className="bg-gradient-to-r from-[#00FF88] to-[#00FF88]/60 h-1.5 rounded-full shadow-[0_0_8px_#00FF88]"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
