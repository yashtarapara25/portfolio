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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
            <nav className="bg-gray-900 border-b border-gray-700 p-4">
                <div className="container max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button onClick={() => navigate("/admin/dashboard")} variant="ghost" size="sm">
                            <ArrowLeft size={16} className="mr-2" /> Back
                        </Button>
                        <h1 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
                            <Mail size={22} /> Messages
                            {unread > 0 && (
                                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-cyan-500 text-black font-bold">
                                    {unread} new
                                </span>
                            )}
                            <span
                                title={liveConnected ? "Live inbox connected" : "Connecting to live inbox…"}
                                className={`flex items-center gap-1 ml-1 text-xs font-medium px-2 py-0.5 rounded-full border transition-all ${liveConnected
                                        ? "text-green-400 border-green-500/30 bg-green-500/10"
                                        : "text-gray-500 border-gray-600/30 bg-gray-700/20"
                                    }`}
                            >
                                <Wifi size={10} /> {liveConnected ? "Live" : "…"}
                            </span>
                        </h1>
                    </div>
                    <Button onClick={fetchMessages} variant="ghost" size="sm" disabled={fetching}>
                        <RefreshCw size={16} className={fetching ? "animate-spin" : ""} />
                    </Button>
                </div>
            </nav>

            <div className="container max-w-4xl mx-auto py-8 px-4">
                {fetching ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-gray-800 rounded-lg border border-gray-700 p-5 animate-pulse">
                                <div className="h-4 bg-gray-700 rounded w-1/3 mb-2" />
                                <div className="h-3 bg-gray-700 rounded w-1/4" />
                            </div>
                        ))}
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <Inbox size={48} className="mx-auto mb-4 opacity-30" />
                        <p className="text-lg">No messages yet</p>
                        <p className="text-sm mt-1">Messages from your contact form will appear here</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`bg-gray-800 rounded-lg border transition-all ${msg.read ? "border-gray-700" : "border-cyan-500/50 shadow-[0_0_12px_rgba(34,211,238,0.1)]"
                                    }`}
                            >
                                {/* Header row */}
                                <div
                                    className="flex items-center justify-between p-4 cursor-pointer"
                                    onClick={() => {
                                        setExpanded(expanded === msg.id ? null : msg.id);
                                        if (!msg.read) markRead(msg.id, true);
                                    }}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        {!msg.read && (
                                            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-cyan-400" />
                                        )}
                                        <div className="min-w-0">
                                            <p className={`font-semibold truncate ${msg.read ? "text-gray-300" : "text-white"}`}>
                                                {msg.name}
                                            </p>
                                            <p className="text-xs text-gray-500">{msg.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                                        <span className="text-xs text-gray-500">
                                            {new Date(msg.created_at).toLocaleDateString("en-IN", {
                                                day: "numeric", month: "short", year: "numeric",
                                                hour: "2-digit", minute: "2-digit",
                                            })}
                                        </span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); markRead(msg.id, !msg.read); }}
                                            className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-cyan-400 transition-colors"
                                            title={msg.read ? "Mark unread" : "Mark read"}
                                        >
                                            {msg.read ? <EyeOff size={14} /> : <Eye size={14} />}
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); deleteMsg(msg.id); }}
                                            className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-red-400 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded message */}
                                {expanded === msg.id && (
                                    <div className="px-4 pb-4 border-t border-gray-700 pt-3">
                                        <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                                        <a
                                            href={`mailto:${msg.email}?subject=Re: Your message&body=Hi ${msg.name},`}
                                            className="mt-3 inline-flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
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
