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
              Manage Education
            </h1>
          </div>
          <Button
            onClick={() => {
              setFormData({
                year: new Date().getFullYear().toString(),
                institution: "",
                degree: "",
                summary: "",
              });
              setEditingId(null);
              setShowForm(true);
            }}
            className="gap-2 bg-cyan-600 hover:bg-cyan-700"
          >
            <Plus size={16} />
            Add Education
          </Button>
        </div>
      </nav>

      <div className="container max-w-6xl mx-auto py-8 px-4">
        {showForm && (
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              {editingId ? "Edit Education" : "New Education"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Year
                  </label>
                  <Input
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: e.target.value })
                    }
                    className="bg-gray-700 border-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Institution
                  </label>
                  <Input
                    value={formData.institution}
                    onChange={(e) =>
                      setFormData({ ...formData, institution: e.target.value })
                    }
                    className="bg-gray-700 border-gray-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Degree
                </label>
                <Input
                  value={formData.degree}
                  onChange={(e) =>
                    setFormData({ ...formData, degree: e.target.value })
                  }
                  className="bg-gray-700 border-gray-600"
                  placeholder="B.S. Computer Science"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Summary
                </label>
                <Textarea
                  value={formData.summary}
                  onChange={(e) =>
                    setFormData({ ...formData, summary: e.target.value })
                  }
                  className="bg-gray-700 border-gray-600"
                  placeholder="Brief description of your education..."
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  {submitting ? "Saving..." : "Save Education"}
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
            {loadingEducations
              ? "Loading..."
              : `Education Entries (${educations.length})`}
          </h2>

          {educations.map((education) => (
            <div
              key={education.id}
              className="bg-gray-800 rounded-lg border border-gray-700 p-4 flex justify-between items-start"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">
                    {education.degree}
                  </h3>
                  <span className="text-sm bg-cyan-600/20 text-cyan-400 px-2 py-1 rounded">
                    {education.year}
                  </span>
                </div>
                <p className="text-gray-400 mt-1">{education.institution}</p>
                {education.summary && (
                  <p className="text-gray-300 mt-2">{education.summary}</p>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleEdit(education)}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Edit size={16} />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(education.id)}
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
