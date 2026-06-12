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
        credential_url: "",
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
                credential_url: "",
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
            credential_url: achievement.credential_url || "",
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
        <div className="min-h-screen bg-[#050816] relative overflow-hidden text-zinc-300 font-sans pb-12">
            {/* Background decoration */}
            <div className="absolute -left-12 -top-12 w-48 h-48 rounded-full bg-[#00FF88]/5 blur-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

            <nav className="bg-[#050816]/90 backdrop-blur-xl border-b border-[#00FF88]/15 p-4 relative z-20">
                <div className="container max-w-6xl mx-auto flex justify-between items-center flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={() => navigate("/admin/dashboard")}
                            className="bg-transparent border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-white/5 font-mono text-xs uppercase"
                            size="sm"
                        >
                            <ArrowLeft size={14} className="mr-1.5" />
                            Back
                        </Button>
                        <div className="flex items-center gap-2 text-[#00FF88]">
                            <Award size={20} />
                            <h1 className="text-xl font-bold font-space text-white tracking-wide">
                              Manage <span className="text-[#00FF88] text-gradient">Achievements</span>
                            </h1>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {achievements.length > 0 && (
                            <Button
                                onClick={handleDeleteAll}
                                className="gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-mono text-xs uppercase"
                                size="sm"
                            >
                                <Trash2 size={14} />
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
                                    credential_url: "",
                                    sort_order: achievements.length + 1,
                                });
                                setEditingId(null);
                                setShowForm(true);
                            }}
                            className="gap-1.5 bg-[#00FF88]/10 border border-[#00FF88]/30 hover:border-[#00FF88] text-[#00FF88] hover:bg-[#00FF88]/20 transition-all font-mono text-xs uppercase font-bold tracking-wider"
                        >
                            <Plus size={14} />
                            Add Achievement
                        </Button>
                    </div>
                </div>
            </nav>

            <div className="container max-w-6xl mx-auto py-8 px-4 relative z-10">
                {errorMsg && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs">
                        {errorMsg}
                    </div>
                )}

                {showForm && (
                    <div className="bg-[#0b1120]/45 backdrop-blur-xl border border-[rgba(255,255,255,0.07)] rounded-2xl p-6 mb-8 relative overflow-hidden shadow-2xl">
                        {/* Corner Brackets */}
                        <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#00FF88]/20 pointer-events-none" />
                        <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#00FF88]/20 pointer-events-none" />
                        <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-[#00FF88]/20 pointer-events-none" />
                        <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-[#00FF88]/20 pointer-events-none" />

                        <h2 className="text-xl font-bold font-space text-white mb-6 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" />
                          {editingId ? "Modify Achievement Details" : "Register New Achievement"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
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
                                        placeholder="e.g. AWS Certified Solutions Architect"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                                        Issuer / Organization
                                    </label>
                                    <Input
                                        value={formData.issuer}
                                        onChange={(e) =>
                                            setFormData({ ...formData, issuer: e.target.value })
                                        }
                                        className="bg-[#050816]/50 border-[rgba(255,255,255,0.1)] focus:border-[#00FF88]/40 focus:ring-1 focus:ring-[#00FF88]/20 text-zinc-300 font-mono text-sm"
                                        placeholder="e.g. Amazon Web Services"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                                        Date
                                    </label>
                                    <Input
                                        value={formData.date}
                                        onChange={(e) =>
                                            setFormData({ ...formData, date: e.target.value })
                                        }
                                        className="bg-[#050816]/50 border-[rgba(255,255,255,0.1)] focus:border-[#00FF88]/40 focus:ring-1 focus:ring-[#00FF88]/20 text-zinc-300 font-mono text-sm"
                                        placeholder="e.g. Oct 2023"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                                        Sort Order
                                    </label>
                                    <Input
                                        type="number"
                                        value={formData.sort_order}
                                        onChange={(e) =>
                                            setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })
                                        }
                                        className="bg-[#050816]/50 border-[rgba(255,255,255,0.1)] focus:border-[#00FF88]/40 focus:ring-1 focus:ring-[#00FF88]/20 text-zinc-300 font-mono text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
                                        <ImageIcon size={12} className="text-[#00FF88]" /> Certificate URL (Drive link, image link, etc.)
                                    </label>
                                    <Input
                                        value={formData.image_url}
                                        onChange={(e) =>
                                            setFormData({ ...formData, image_url: e.target.value })
                                        }
                                        className="bg-[#050816]/50 border-[rgba(255,255,255,0.1)] focus:border-[#00FF88]/40 focus:ring-1 focus:ring-[#00FF88]/20 text-zinc-300 font-mono text-sm"
                                        placeholder="https://drive.google.com/..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
                                        <LinkIcon size={12} className="text-[#00FF88]" /> Verification Link (Optional)
                                    </label>
                                    <Input
                                        value={formData.credential_url}
                                        onChange={(e) =>
                                            setFormData({ ...formData, credential_url: e.target.value })
                                        }
                                        className="bg-[#050816]/50 border-[rgba(255,255,255,0.1)] focus:border-[#00FF88]/40 focus:ring-1 focus:ring-[#00FF88]/20 text-zinc-300 font-mono text-sm"
                                        placeholder="https://coursera.org/verify/..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                                    Description (Optional)
                                </label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    className="bg-[#050816]/50 border-[rgba(255,255,255,0.1)] focus:border-[#00FF88]/40 focus:ring-1 focus:ring-[#00FF88]/20 text-zinc-300 font-mono text-sm min-h-[80px]"
                                    placeholder="Brief description of the certification or what you learned..."
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
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" />
                      <h2 className="text-xl font-bold font-space text-white tracking-wide">
                          {loadingAchievements
                              ? "Scanning Registry..."
                              : `Achievements Database Registry (${achievements.length})`}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {achievements.map((achievement) => (
                            <div
                                key={achievement.id}
                                className="bg-[#0b1120]/45 backdrop-blur-xl border border-[rgba(255,255,255,0.06)] hover:border-[#00FF88]/20 rounded-xl flex flex-col overflow-hidden transition-all duration-300 relative"
                            >
                                {/* Accent Brackets */}
                                <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[#00FF88]/20 pointer-events-none" />
                                <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[#00FF88]/20 pointer-events-none" />
                                <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-[#00FF88]/20 pointer-events-none" />
                                <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-[#00FF88]/20 pointer-events-none" />

                                <div className="p-5 flex-1 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="p-2 rounded-lg bg-[#00FF88]/10 text-[#00FF88]">
                                            <Award size={18} />
                                        </div>
                                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-[#00FF88]/20 bg-[#00FF88]/5 text-white">
                                            {achievement.date}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="text-base font-bold text-white font-space leading-tight mb-1">
                                            {achievement.title}
                                        </h3>
                                        <p className="text-[#00FF88] text-xs font-mono font-semibold uppercase tracking-wider">
                                            {achievement.issuer}
                                        </p>
                                    </div>

                                    {achievement.description && (
                                        <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed">
                                            {achievement.description}
                                        </p>
                                    )}
                                </div>

                                <div className="bg-[#050816]/40 p-3 border-t border-[rgba(255,255,255,0.04)] flex justify-end gap-2">
                                    <Button
                                        onClick={() => handleEdit(achievement)}
                                        className="bg-transparent border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-white/5 p-2 h-8"
                                        size="sm"
                                    >
                                        <Edit size={13} className="mr-1" />
                                        Edit
                                    </Button>
                                    <Button
                                        onClick={() => handleDelete(achievement.id)}
                                        className="bg-transparent border border-red-500/20 text-red-400 hover:text-white hover:border-red-500 hover:bg-red-500/10 p-2 h-8"
                                        size="sm"
                                    >
                                        <Trash2 size={13} className="mr-1" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {!loadingAchievements && achievements.length === 0 && (
                        <div className="text-center py-16 border border-dashed border-zinc-800 rounded-xl bg-[#0b1120]/20">
                            <Award className="mx-auto text-zinc-700 mb-4" size={40} />
                            <p className="text-zinc-500 font-mono text-sm">NO ACHIEVEMENTS REGISTRY RECORDED.</p>
                            <p className="text-zinc-600 text-xs font-mono mt-1">Click "Add Achievement" to register an entry.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
