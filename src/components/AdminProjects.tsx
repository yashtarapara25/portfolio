import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAdmin } from "@/hooks/use-admin";
import type { Tables } from "@/integrations/supabase";
import { Plus, Delete, Edit, ArrowLeft } from "lucide-react";

type Project = Tables<"projects">;

export default function AdminProjects() {
  const { isAdmin, loading } = useAdmin();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    short_desc: "",
    tech: "",
    image_url: "",
    demo_url: "",
    repo_url: "",
    featured: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/admin/login");
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const projectData = {
        title: formData.title,
        slug: formData.slug,
        short_desc: formData.short_desc,
        tech: formData.tech.split(",").map((t) => t.trim()),
        image_url: formData.image_url,
        demo_url: formData.demo_url || null,
        repo_url: formData.repo_url || null,
        featured: formData.featured,
      };

      if (editingId) {
        const { error } = await supabase
          .from("projects")
          .update(projectData)
          .eq("id", editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("projects")
          .insert([projectData]);

        if (error) throw error;
      }

      setFormData({
        title: "",
        slug: "",
        short_desc: "",
        tech: "",
        image_url: "",
        demo_url: "",
        repo_url: "",
        featured: false,
      });
      setEditingId(null);
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      console.error("Error saving project:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      slug: project.slug,
      short_desc: project.short_desc,
      tech: project.tech?.join(", ") || "",
      image_url: project.image_url || "",
      demo_url: project.demo_url || "",
      repo_url: project.repo_url || "",
      featured: project.featured || false,
    });
    setEditingId(project.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);

      if (error) throw error;
      fetchProjects();
    } catch (err) {
      console.error("Error deleting project:", err);
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
              Manage <span className="text-[#00FF88] text-gradient">Projects</span>
            </h1>
          </div>
          <Button
            onClick={() => {
              setFormData({
                title: "",
                slug: "",
                short_desc: "",
                tech: "",
                image_url: "",
                demo_url: "",
                repo_url: "",
                featured: false,
              });
              setEditingId(null);
              setShowForm(true);
            }}
            className="gap-1.5 bg-[#00FF88]/10 border border-[#00FF88]/30 hover:border-[#00FF88] text-[#00FF88] hover:bg-[#00FF88]/20 transition-all font-mono text-xs uppercase font-bold tracking-wider"
          >
            <Plus size={14} />
            Add Project
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
              {editingId ? "Modify Project Dossier" : "Register New Project Module"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Title
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="bg-[#050816]/50 border-[rgba(255,255,255,0.1)] focus:border-[#00FF88]/40 focus:ring-1 focus:ring-[#00FF88]/20 text-zinc-300 font-mono text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Slug
                  </label>
                  <Input
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    className="bg-[#050816]/50 border-[rgba(255,255,255,0.1)] focus:border-[#00FF88]/40 focus:ring-1 focus:ring-[#00FF88]/20 text-zinc-300 font-mono text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Short Description
                </label>
                <Textarea
                  value={formData.short_desc}
                  onChange={(e) =>
                    setFormData({ ...formData, short_desc: e.target.value })
                  }
                  className="bg-[#050816]/50 border-[rgba(255,255,255,0.1)] focus:border-[#00FF88]/40 focus:ring-1 focus:ring-[#00FF88]/20 text-zinc-300 font-mono text-sm min-h-[80px]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Technologies (comma-separated)
                  </label>
                  <Input
                    value={formData.tech}
                    onChange={(e) =>
                      setFormData({ ...formData, tech: e.target.value })
                    }
                    className="bg-[#050816]/50 border-[rgba(255,255,255,0.1)] focus:border-[#00FF88]/40 focus:ring-1 focus:ring-[#00FF88]/20 text-zinc-300 font-mono text-sm"
                    placeholder="React, TypeScript, Node.js"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Image URL
                  </label>
                  <Input
                    value={formData.image_url}
                    onChange={(e) =>
                      setFormData({ ...formData, image_url: e.target.value })
                    }
                    className="bg-[#050816]/50 border-[rgba(255,255,255,0.1)] focus:border-[#00FF88]/40 focus:ring-1 focus:ring-[#00FF88]/20 text-zinc-300 font-mono text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Demo URL
                  </label>
                  <Input
                    value={formData.demo_url}
                    onChange={(e) =>
                      setFormData({ ...formData, demo_url: e.target.value })
                    }
                    className="bg-[#050816]/50 border-[rgba(255,255,255,0.1)] focus:border-[#00FF88]/40 focus:ring-1 focus:ring-[#00FF88]/20 text-zinc-300 font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Repo URL
                  </label>
                  <Input
                    value={formData.repo_url}
                    onChange={(e) =>
                      setFormData({ ...formData, repo_url: e.target.value })
                    }
                    className="bg-[#050816]/50 border-[rgba(255,255,255,0.1)] focus:border-[#00FF88]/40 focus:ring-1 focus:ring-[#00FF88]/20 text-zinc-300 font-mono text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="rounded bg-[#050816]/50 border-[rgba(255,255,255,0.1)] text-[#00FF88] focus:ring-[#00FF88]/30 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="featured" className="text-xs font-mono uppercase tracking-wider text-zinc-400 cursor-pointer">
                  Featured Project Badge
                </label>
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
              {loadingProjects ? "Scanning Repository..." : `Project Dossier Registry (${projects.length})`}
            </h2>
          </div>

          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-[#0b1120]/45 backdrop-blur-xl border border-[rgba(255,255,255,0.06)] hover:border-[#00FF88]/20 rounded-xl p-5 transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row justify-between items-start gap-4"
              >
                {/* Accent Brackets */}
                <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[#00FF88]/20 pointer-events-none" />
                <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[#00FF88]/20 pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-[#00FF88]/20 pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-[#00FF88]/20 pointer-events-none" />

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-bold text-white font-space leading-tight">{project.title}</h3>
                    {project.featured && (
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/20">
                        FEATURED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 mt-2 font-mono uppercase tracking-wider">SLUG: {project.slug}</p>
                  <p className="text-sm text-zinc-400 mt-2 line-clamp-2">{project.short_desc}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {project.tech?.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono px-2 py-0.5 rounded border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] text-zinc-400 hover:border-[#00FF88]/25 hover:text-white transition-colors cursor-default"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 shrink-0 self-end md:self-start">
                  <Button
                    onClick={() => handleEdit(project)}
                    className="bg-transparent border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-white/5 p-2 h-8 w-8"
                    size="sm"
                  >
                    <Edit size={13} />
                  </Button>
                  <Button
                    onClick={() => handleDelete(project.id)}
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
