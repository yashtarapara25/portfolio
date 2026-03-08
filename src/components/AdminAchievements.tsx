import { useState } from "react";
import { useAchievements } from "@/hooks/use-portfolio-data";
import { supabase } from "@/integrations/supabase/client";
import { Save, Plus, Trash2, GripVertical, AlertCircle, Award } from "lucide-react";

export default function AdminAchievements() {
    const { achievements, loading } = useAchievements();
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAddAchievement = async () => {
        try {
            setIsSaving(true);
            setError(null);
            const newSortOrder = achievements.length;

            const { error: insertError } = await supabase.from("achievements").insert({
                title: "New Achievement",
                issuer: "Issuing Organization",
                date: new Date().getFullYear().toString(),
                description: "",
                image_url: "",
                credential_url: "",
                sort_order: newSortOrder,
            });

            if (insertError) throw insertError;
        } catch (err: any) {
            console.error("Supabase insert error:", err);
            setError(err?.message || err?.error_description || "Failed to add achievement");
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdateAchievement = async (id: string, field: string, value: string | number) => {
        try {
            setError(null);
            const { error: updateError } = await supabase
                .from("achievements")
                .update({ [field]: value })
                .eq("id", id);

            if (updateError) throw updateError;
        } catch (err: any) {
            console.error("Supabase update error:", err);
            setError(err?.message || err?.error_description || "Failed to update achievement");
        }
    };

    const handleDeleteAchievement = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this achievement?")) return;
        try {
            setError(null);
            const { error: deleteError } = await supabase
                .from("achievements")
                .delete()
                .eq("id", id);

            if (deleteError) throw deleteError;
        } catch (err: any) {
            console.error("Supabase delete error:", err);
            setError(err?.message || err?.error_description || "Failed to delete achievement");
        }
    };

    const handleDeleteAllAchievements = async () => {
        if (!window.confirm("Are you absolutely sure you want to delete ALL achievements? This cannot be undone.")) return;
        try {
            setIsSaving(true);
            setError(null);

            // Delete all by getting all IDs and deleting them or passing a filter that matches all
            const { error: deleteError } = await supabase
                .from("achievements")
                .delete()
                .neq("id", "00000000-0000-0000-0000-000000000000"); // Deletes everything

            if (deleteError) throw deleteError;

        } catch (err: any) {
            console.error("Supabase delete all error:", err);
            setError(err?.message || err?.error_description || "Failed to delete all achievements");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return <div className="text-slate-400 p-8 text-center bg-[#0a0f1d] rounded-2xl border border-white/5 animate-pulse">Loading achievements...</div>;
    }

    return (
        <div className="bg-[#0a0f1d] rounded-2xl border border-white/5 p-6 backdrop-blur-xl">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3 text-cyan-400">
                    <Award size={24} />
                    <h2 className="text-xl font-orbitron font-bold">Achievements & Certificates</h2>
                </div>
                <div className="flex items-center gap-3">
                    {achievements.length > 0 && (
                        <button
                            onClick={handleDeleteAllAchievements}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all duration-300 border border-red-500/20"
                        >
                            <Trash2 size={18} />
                            <span>Delete All</span>
                        </button>
                    )}
                    <button
                        onClick={handleAddAchievement}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 text-white rounded-xl transition-all duration-300 border border-white/10"
                    >
                        <Plus size={18} />
                        <span>Add Achievement</span>
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3">
                    <AlertCircle size={20} />
                    <p className="font-space text-sm">{error}</p>
                </div>
            )}

            <div className="space-y-4">
                {achievements.map((item) => (
                    <div key={item.id} className="p-5 rounded-xl border border-white/10 bg-white/5 flex gap-4 group hover:border-cyan-500/30 transition-colors">
                        <div className="mt-2 text-slate-500 cursor-grab active:cursor-grabbing">
                            <GripVertical size={20} />
                        </div>

                        <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-space font-medium text-slate-400 uppercase tracking-wider">Title</label>
                                    <input
                                        type="text"
                                        value={item.title}
                                        onChange={(e) => handleUpdateAchievement(item.id, "title", e.target.value)}
                                        className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white font-space focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-slate-600"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-space font-medium text-slate-400 uppercase tracking-wider">Issuer</label>
                                    <input
                                        type="text"
                                        value={item.issuer}
                                        onChange={(e) => handleUpdateAchievement(item.id, "issuer", e.target.value)}
                                        className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white font-space focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-slate-600"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-space font-medium text-slate-400 uppercase tracking-wider">Date (e.g. "Oct 2023")</label>
                                    <input
                                        type="text"
                                        value={item.date}
                                        onChange={(e) => handleUpdateAchievement(item.id, "date", e.target.value)}
                                        className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white font-space focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-slate-600"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-space font-medium text-slate-400 uppercase tracking-wider">Sort Order</label>
                                    <input
                                        type="number"
                                        value={item.sort_order || 0}
                                        onChange={(e) => handleUpdateAchievement(item.id, "sort_order", parseInt(e.target.value) || 0)}
                                        className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white font-space focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-slate-600"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-space font-medium text-slate-400 uppercase tracking-wider">Image / Icon URL (Optional)</label>
                                    <input
                                        type="text"
                                        value={item.image_url || ""}
                                        placeholder="https://example.com/badge.png"
                                        onChange={(e) => handleUpdateAchievement(item.id, "image_url", e.target.value)}
                                        className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white font-space focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-slate-600"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-space font-medium text-slate-400 uppercase tracking-wider">Credential URL (Optional)</label>
                                    <input
                                        type="text"
                                        value={item.credential_url || ""}
                                        placeholder="https://verify.com/credential/123"
                                        onChange={(e) => handleUpdateAchievement(item.id, "credential_url", e.target.value)}
                                        className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white font-space focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-slate-600"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-space font-medium text-slate-400 uppercase tracking-wider">Description (Optional)</label>
                                <textarea
                                    value={item.description || ""}
                                    rows={2}
                                    onChange={(e) => handleUpdateAchievement(item.id, "description", e.target.value)}
                                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white font-space focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-slate-600 resize-none"
                                />
                            </div>

                        </div>

                        <button
                            onClick={() => handleDeleteAchievement(item.id)}
                            className="p-2 text-slate-500 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors h-fit"
                            title="Delete Achievement"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}

                {achievements.length === 0 && (
                    <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
                        <p className="text-slate-500 font-space">No achievements added yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
