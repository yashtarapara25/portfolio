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
            <h1 className="text-2xl font-bold text-cyan-400">Manage Skills</h1>
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
            className="gap-2 bg-cyan-600 hover:bg-cyan-700"
          >
            <Plus size={16} />
            Add Skill
          </Button>
        </div>
      </nav>

      <div className="container max-w-6xl mx-auto py-8 px-4">
        {showForm && (
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              {editingId ? "Edit Skill" : "New Skill"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="bg-gray-700 border-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Level ({formData.level}/100)
                  </label>
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
                    className="bg-gray-700 border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
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
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  {submitting ? "Saving..." : "Save Skill"}
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

        <div className="space-y-8">
          {CATEGORIES.map((category) => (
            <div key={category}>
              <h2 className="text-2xl font-bold text-white mb-4 capitalize">
                {category === "ai-ml" ? "AI/ML" : category}s ({" "}
                {groupedSkills[category].length})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupedSkills[category].map((skill) => (
                  <div
                    key={skill.id}
                    className="bg-gray-800 rounded-lg border border-gray-700 p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {skill.name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          Level: {skill.level}/100
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEdit(skill)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          onClick={() => handleDelete(skill.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-400 hover:text-red-400"
                        >
                          <Delete size={16} />
                        </Button>
                      </div>
                    </div>

                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-cyan-600 h-2 rounded-full"
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
