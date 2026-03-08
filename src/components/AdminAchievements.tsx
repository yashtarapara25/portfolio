import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAdmin } from "@/hooks/use-admin";
import type { Tables } from "@/integrations/supabase";
import { Plus, Trash2, Edit, ArrowLeft, Award, Image as ImageIcon, Link as LinkIcon } from "lucide-react";

type Achievement = Tables<"achievements">;

export default function AdminAchievements() {
    const { isAdmin, loading } = useAdmin();
    const navigate = useNavigate();
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        issuer: "",
        date: new Date().getFullYear().toString(),
        description: "",
        image_url: "",
        sort_order: 0,
    });
    const [submitting, setSubmitting] = useState(false);
    const [loadingAchievements, setLoadingAchievements] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        if (!loading && !isAdmin) {
            navigate("/admin/login");
        }
    }, [isAdmin, loading, navigate]);

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            const { data, error } = await supabase
                .from("achievements")
                .select("*")
                .order("sort_order", { ascending: true });

            if (error) throw error;
            setAchievements(data || []);
        } catch (err: any) {
            console.error("Error fetching achievements:", err);
            setErrorMsg(err?.message || "Failed to load achievements");
        } finally {
            setLoadingAchievements(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setErrorMsg(null);

        try {
            if (editingId) {
                const { error } = await supabase
                    .from("achievements")
                    .update(formData)
                    .eq("id", editingId);

                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from("achievements")
                    .insert([formData]);

                if (error) throw error;
            }

            setFormData({
                title: "",
                issuer: "",
                date: new Date().getFullYear().toString(),
                description: "",
                image_url: "",
                sort_order: achievements.length + 1,
            });
            setEditingId(null);
            setShowForm(false);
            fetchAchievements();
        } catch (err: any) {
            console.error("Error saving achievement:", err);
            setErrorMsg(err?.message || "Failed to save achievement");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (achievement: Achievement) => {
        setFormData({
            title: achievement.title,
            issuer: achievement.issuer,
            date: achievement.date,
            description: achievement.description || "",
            image_url: achievement.image_url || "",
            sort_order: achievement.sort_order || 0,
        });
        setEditingId(achievement.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this achievement?"))
            return;

        try {
            setErrorMsg(null);
            const { error } = await supabase
                .from("achievements")
                .delete()
                .eq("id", id);

            if (error) throw error;
            fetchAchievements();
        } catch (err: any) {
            console.error("Error deleting achievement:", err);
            setErrorMsg(err?.message || "Failed to delete achievement");
        }
    };

    const handleDeleteAll = async () => {
        if (!window.confirm("Are you absolutely sure you want to delete ALL achievements? This cannot be undone."))
            return;

        try {
            setErrorMsg(null);
            // Get all IDs first
            const { data, error: fetchError } = await supabase.from("achievements").select("id");
            if (fetchError) throw fetchError;

            if (data && data.length > 0) {
                const ids = data.map(d => d.id);
                const { error: deleteError } = await supabase
                    .from("achievements")
                    .delete()
                    .in("id", ids);

                if (deleteError) throw deleteError;
            }

            fetchAchievements();
        } catch (err: any) {
            console.error("Error deleting all achievements:", err);
            setErrorMsg(err?.message || "Failed to delete all achievements");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
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
                        <div className="flex items-center gap-2 text-cyan-400">
                            <Award size={24} />
                            <h1 className="text-2xl font-bold font-orbitron">Manage Achievements</h1>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {achievements.length > 0 && (
                            <Button
                                onClick={handleDeleteAll}
                                variant="destructive"
                                className="gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20"
                            >
                                <Trash2 size={16} />
                                Delete All
                            </Button>
                        )}
                        <Button
                            onClick={() => {
                                setFormData({
                                    title: "",
                                    issuer: "",
                                    date: new Date().getFullYear().toString(),
                                    description: "",
                                    image_url: "",
                                    sort_order: achievements.length + 1,
                                });
                                setEditingId(null);
                                setShowForm(true);
                            }}
                            className="gap-2 bg-cyan-600 hover:bg-cyan-700 text-white"
                        >
                            <Plus size={16} />
                            Add Achievement
                        </Button>
                    </div>
                </div>
            </nav>

            <div className="container max-w-6xl mx-auto py-8 px-4">
                {errorMsg && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                        {errorMsg}
                    </div>
                )}

                {showForm && (
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8 shadow-xl">
                        <h2 className="text-2xl font-bold text-white mb-6 font-orbitron">
                            {editingId ? "Edit Achievement" : "New Achievement"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Title
                                    </label>
                                    <Input
                                        value={formData.title}
                                        onChange={(e) =>
                                            setFormData({ ...formData, title: e.target.value })
                                        }
                                        className="bg-gray-700 border-gray-600 focus:border-cyan-500 text-white"
                                        placeholder="e.g. AWS Certified Solutions Architect"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Issuer / Organization
                                    </label>
                                    <Input
                                        value={formData.issuer}
                                        onChange={(e) =>
                                            setFormData({ ...formData, issuer: e.target.value })
                                        }
                                        className="bg-gray-700 border-gray-600 focus:border-cyan-500 text-white"
                                        placeholder="e.g. Amazon Web Services"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Date
                                    </label>
                                    <Input
                                        value={formData.date}
                                        onChange={(e) =>
                                            setFormData({ ...formData, date: e.target.value })
                                        }
                                        className="bg-gray-700 border-gray-600 focus:border-cyan-500 text-white"
                                        placeholder="e.g. Oct 2023"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Sort Order
                                    </label>
                                    <Input
                                        type="number"
                                        value={formData.sort_order}
                                        onChange={(e) =>
                                            setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })
                                        }
                                        className="bg-gray-700 border-gray-600 focus:border-cyan-500 text-white"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                        <LinkIcon size={14} /> Certificate Link (Image or PDF URL)
                                    </label>
                                    <Input
                                        value={formData.image_url}
                                        onChange={(e) =>
                                            setFormData({ ...formData, image_url: e.target.value })
                                        }
                                        className="bg-gray-700 border-gray-600 focus:border-cyan-500 text-white"
                                        placeholder="https://drive.google.com/..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Description (Optional)
                                </label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    className="bg-gray-700 border-gray-600 focus:border-cyan-500 min-h-[100px] text-white"
                                    placeholder="Brief description of the certification or what you learned..."
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-cyan-600 hover:bg-cyan-700 text-white"
                                >
                                    {submitting ? "Saving..." : "Save Achievement"}
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingId(null);
                                    }}
                                    variant="outline"
                                    className="bg-transparent text-gray-300 border-gray-600 hover:bg-gray-700"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white font-orbitron mb-6">
                        {loadingAchievements
                            ? "Loading..."
                            : `Current Achievements (${achievements.length})`}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {achievements.map((achievement) => (
                            <div
                                key={achievement.id}
                                className="bg-gray-800 rounded-xl border border-gray-700 flex flex-col overflow-hidden hover:border-cyan-500/50 transition-colors"
                            >
                                <div className="p-5 flex-1 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                                            <Award size={20} />
                                        </div>
                                        <span className="text-xs font-semibold px-2 py-1 bg-gray-700 text-gray-300 rounded-md">
                                            {achievement.date}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-white leading-tight mb-1">
                                            {achievement.title}
                                        </h3>
                                        <p className="text-cyan-400 text-sm font-medium">
                                            {achievement.issuer}
                                        </p>
                                    </div>

                                    {achievement.description && (
                                        <p className="text-gray-400 text-sm line-clamp-2">
                                            {achievement.description}
                                        </p>
                                    )}
                                </div>

                                <div className="bg-gray-900/50 p-3 border-t border-gray-700 flex justify-end gap-2">
                                    <Button
                                        onClick={() => handleEdit(achievement)}
                                        variant="ghost"
                                        size="sm"
                                        className="text-gray-300 hover:text-cyan-400 hover:bg-cyan-400/10 transition-colors"
                                    >
                                        <Edit size={16} className="mr-2" />
                                        Edit
                                    </Button>
                                    <Button
                                        onClick={() => handleDelete(achievement.id)}
                                        variant="ghost"
                                        size="sm"
                                        className="text-gray-300 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                                    >
                                        <Trash2 size={16} className="mr-2" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {!loadingAchievements && achievements.length === 0 && (
                        <div className="text-center py-16 border border-dashed border-gray-700 rounded-xl bg-gray-800/50">
                            <Award className="mx-auto text-gray-600 mb-4" size={48} />
                            <p className="text-gray-400 text-lg">No achievements added yet.</p>
                            <p className="text-gray-500 text-sm mt-2">Click "Add Achievement" to get started.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
