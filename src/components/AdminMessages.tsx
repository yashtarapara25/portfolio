import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/hooks/use-admin";
import { ArrowLeft, Mail, Trash2, Eye, EyeOff, RefreshCw, Inbox, Wifi } from "lucide-react";

type Message = {
    id: string;
    name: string;
    email: string;
    message: string;
    read: boolean;
    created_at: string;
};

export default function AdminMessages() {
    const { isAdmin, loading } = useAdmin();
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([]);
    const [fetching, setFetching] = useState(true);
    const [expanded, setExpanded] = useState<string | null>(null);

    useEffect(() => {
        if (!loading && !isAdmin) navigate("/admin/login");
    }, [isAdmin, loading, navigate]);

    // 🔴 LIVE: Subscribe to new contact_messages via Supabase Realtime
    const [liveConnected, setLiveConnected] = useState(false);
    const toastRef = useRef<string | null>(null);

    useEffect(() => {
        fetchMessages();

        const channel = supabase
            .channel("admin-messages-live")
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "contact_messages" }, (payload: any) => {
                // Prepend new message to top of list instantly
                setMessages((prev) => [payload.new as Message, ...prev]);
                toastRef.current = payload.new?.name;
            })
            .on("postgres_changes", { event: "UPDATE", schema: "public", table: "contact_messages" }, () => {
                fetchMessages();
            })
            .subscribe((status) => {
                setLiveConnected(status === "SUBSCRIBED");
            });

        return () => { supabase.removeChannel(channel); };
    }, []);

    const fetchMessages = async () => {
        setFetching(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
            .from("contact_messages")
            .select("*")
            .order("created_at", { ascending: false });
        if (!error && data) setMessages(data as Message[]);
        setFetching(false);
    };

    const markRead = async (id: string, read: boolean) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any).from("contact_messages").update({ read }).eq("id", id);
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read } : m)));
    };

    const deleteMsg = async (id: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any).from("contact_messages").delete().eq("id", id);
        setMessages((prev) => prev.filter((m) => m.id !== id));
    };

    const unread = messages.filter((m) => !m.read).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-300">Loading...</p>
            </div>
        );
    }

    if (!isAdmin) return null;

    return (
        <div className="min-h-screen bg-[#050816] relative overflow-hidden text-zinc-300 font-sans pb-12">
            {/* Background glow and grid overlay */}
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
                        <h1 className="text-xl font-bold font-space text-white tracking-wide flex items-center gap-2">
                            <Mail size={18} className="text-[#00FF88]" />
                            <span>Messages</span>
                            {unread > 0 && (
                                <span className="ml-2 px-2 py-0.5 text-[10px] rounded-full bg-[#00FF88] text-black font-bold font-mono">
                                    {unread} NEW
                                </span>
                            )}
                            <span
                                title={liveConnected ? "Live telemetry connection online" : "Establishing telemetry channel..."}
                                className={`flex items-center gap-1.5 ml-2 text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border transition-all ${
                                    liveConnected
                                        ? "text-[#00FF88] border-[#00FF88]/30 bg-[#00FF88]/10"
                                        : "text-zinc-500 border-zinc-800 bg-zinc-900/50 animate-pulse"
                                }`}
                            >
                                <Wifi size={10} className={liveConnected ? "animate-pulse" : ""} />
                                {liveConnected ? "Live" : "Syncing"}
                            </span>
                        </h1>
                    </div>
                    <Button 
                        onClick={fetchMessages} 
                        className="bg-[#00FF88]/10 border border-[#00FF88]/30 hover:border-[#00FF88] text-[#00FF88] hover:bg-[#00FF88]/20 transition-all font-mono text-xs uppercase font-bold tracking-wider" 
                        size="sm" 
                        disabled={fetching}
                    >
                        <RefreshCw size={14} className={`mr-1.5 ${fetching ? "animate-spin" : ""}`} />
                        Sync
                    </Button>
                </div>
            </nav>

            <div className="container max-w-4xl mx-auto py-12 px-4 relative z-10">
                {fetching ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-[#0b1120]/45 backdrop-blur-xl border border-[rgba(255,255,255,0.07)] rounded-xl p-5 animate-pulse relative overflow-hidden">
                                <div className="absolute top-3 left-3 w-2 h-2 border-t border-l border-[#00FF88]/20" />
                                <div className="absolute top-3 right-3 w-2 h-2 border-t border-r border-[#00FF88]/20" />
                                <div className="absolute bottom-3 left-3 w-2 h-2 border-b border-l border-[#00FF88]/20" />
                                <div className="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-[#00FF88]/20" />
                                <div className="h-4 bg-zinc-800 rounded w-1/3 mb-3" />
                                <div className="h-3 bg-zinc-800 rounded w-1/4" />
                            </div>
                        ))}
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center py-20 text-zinc-500 bg-[#0b1120]/45 backdrop-blur-xl border border-[rgba(255,255,255,0.07)] rounded-2xl relative overflow-hidden">
                        <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#00FF88]/20" />
                        <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#00FF88]/20" />
                        <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-[#00FF88]/20" />
                        <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-[#00FF88]/20" />
                        <Inbox size={48} className="mx-auto mb-4 opacity-20 text-[#00FF88]" />
                        <p className="text-lg font-space text-white">No communications detected</p>
                        <p className="text-xs font-mono text-zinc-500 mt-1 uppercase tracking-wider">inbox_empty_registry</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`bg-[#0b1120]/45 backdrop-blur-xl border transition-all rounded-xl relative overflow-hidden ${
                                    msg.read 
                                        ? "border-[rgba(255,255,255,0.06)] hover:border-[#00FF88]/25" 
                                        : "border-[#00FF88]/40 shadow-[0_0_15px_rgba(0,255,136,0.05)]"
                                }`}
                            >
                                {/* L-shaped corner indicators for unread or hover */}
                                <div className="absolute top-2.5 left-2.5 w-2 h-2 border-t border-l border-[#00FF88]/20 pointer-events-none" />
                                <div className="absolute top-2.5 right-2.5 w-2 h-2 border-t border-r border-[#00FF88]/20 pointer-events-none" />
                                <div className="absolute bottom-2.5 left-2.5 w-2 h-2 border-b border-l border-[#00FF88]/20 pointer-events-none" />
                                <div className="absolute bottom-2.5 right-2.5 w-2 h-2 border-b border-r border-[#00FF88]/20 pointer-events-none" />

                                {/* Header row */}
                                <div
                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-5 cursor-pointer gap-3"
                                    onClick={() => {
                                        setExpanded(expanded === msg.id ? null : msg.id);
                                        if (!msg.read) markRead(msg.id, true);
                                    }}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="flex-shrink-0 flex items-center justify-center">
                                            {!msg.read ? (
                                                <span className="w-2.5 h-2.5 rounded-full bg-[#00FF88] shadow-[0_0_8px_#00FF88]" />
                                            ) : (
                                                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className={`font-bold font-space truncate text-sm sm:text-base ${msg.read ? "text-zinc-300" : "text-white"}`}>
                                                {msg.name}
                                            </p>
                                            <p className="text-xs font-mono text-zinc-500 truncate">{msg.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0">
                                        <span className="text-xs font-mono text-zinc-500 bg-[#050816]/60 border border-[rgba(255,255,255,0.03)] px-2.5 py-1 rounded">
                                            {new Date(msg.created_at).toLocaleDateString("en-IN", {
                                                day: "numeric", month: "short", year: "numeric",
                                                hour: "2-digit", minute: "2-digit",
                                            })}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); markRead(msg.id, !msg.read); }}
                                                className="p-2 rounded border border-[rgba(255,255,255,0.05)] bg-[#050816]/40 hover:bg-[#00FF88]/10 text-zinc-400 hover:text-[#00FF88] hover:border-[#00FF88]/30 transition-all"
                                                title={msg.read ? "Mark unread" : "Mark read"}
                                            >
                                                {msg.read ? <EyeOff size={14} /> : <Eye size={14} />}
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); deleteMsg(msg.id); }}
                                                className="p-2 rounded border border-[rgba(255,255,255,0.05)] bg-[#050816]/40 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 hover:border-red-500/30 transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded message */}
                                {expanded === msg.id && (
                                    <div className="px-5 pb-5 border-t border-[rgba(255,255,255,0.05)] pt-4 bg-[#050816]/30">
                                        <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap font-sans bg-[#050816]/50 border border-[rgba(255,255,255,0.03)] rounded-lg p-4 mb-4">
                                            {msg.message}
                                        </p>
                                        <a
                                            href={`mailto:${msg.email}?subject=Re: Your message&body=Hi ${msg.name},`}
                                            className="inline-flex items-center gap-2 bg-[#00FF88]/10 border border-[#00FF88]/30 hover:border-[#00FF88] text-[#00FF88] hover:bg-[#00FF88]/20 px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all"
                                        >
                                            <Mail size={12} /> Reply via email
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
