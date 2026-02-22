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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <nav className="bg-gray-900 border-b border-gray-700 p-4">
        <div className="container max-w-6xl mx-auto flex justify-between items-center">
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
              Manage Projects
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
            className="gap-2 bg-cyan-600 hover:bg-cyan-700"
          >
            <Plus size={16} />
            Add Project
          </Button>
        </div>
      </nav>

      <div className="container max-w-6xl mx-auto py-8 px-4">
        {showForm && (
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              {editingId ? "Edit Project" : "New Project"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="bg-gray-700 border-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Slug
                  </label>
                  <Input
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    className="bg-gray-700 border-gray-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Short Description
                </label>
                <Textarea
                  value={formData.short_desc}
                  onChange={(e) =>
                    setFormData({ ...formData, short_desc: e.target.value })
                  }
                  className="bg-gray-700 border-gray-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Technologies (comma-separated)
                  </label>
                  <Input
                    value={formData.tech}
                    onChange={(e) =>
                      setFormData({ ...formData, tech: e.target.value })
                    }
                    className="bg-gray-700 border-gray-600"
                    placeholder="React, TypeScript, Node.js"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Image URL
                  </label>
                  <Input
                    value={formData.image_url}
                    onChange={(e) =>
                      setFormData({ ...formData, image_url: e.target.value })
                    }
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Demo URL
                  </label>
                  <Input
                    value={formData.demo_url}
                    onChange={(e) =>
                      setFormData({ ...formData, demo_url: e.target.value })
                    }
                    className="bg-gray-700 border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Repo URL
                  </label>
                  <Input
                    value={formData.repo_url}
                    onChange={(e) =>
                      setFormData({ ...formData, repo_url: e.target.value })
                    }
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="rounded"
                />
                <label htmlFor="featured" className="text-sm text-gray-300">
                  Featured
                </label>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  {submitting ? "Saving..." : "Save Project"}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">
            {loadingProjects ? "Loading..." : `Projects (${projects.length})`}
          </h2>

          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-gray-800 rounded-lg border border-gray-700 p-4 flex justify-between items-start"
            >
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">{project.title}</h3>
                <p className="text-gray-400 mt-2">{project.short_desc}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {project.tech?.map((t) => (
                    <span
                      key={t}
                      className="text-xs bg-cyan-600/20 text-cyan-400 px-2 py-1 rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                {project.featured && (
                  <span className="text-xs bg-yellow-600/20 text-yellow-400 px-2 py-1 rounded mt-2 inline-block">
                    Featured
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleEdit(project)}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Edit size={16} />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(project.id)}
                  variant="outline"
                  size="sm"
                  className="gap-2 text-red-400 hover:text-red-400"
                >
                  <Delete size={16} />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
