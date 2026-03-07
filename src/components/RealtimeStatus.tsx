/**
 * RealtimeStatus — floating "● LIVE" badge
 * Shows WebSocket connection state in the bottom-right corner.
 * Green pulsing dot when connected, grey when reconnecting.
 */
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type ConnectionStatus = "CONNECTING" | "OPEN" | "CLOSED" | "CHANNEL_ERROR";

interface RealtimeStatusProps {
    /** Show only in dev/test; hide in production. Default: always show. */
    devOnly?: boolean;
}

export default function RealtimeStatus({ devOnly = false }: RealtimeStatusProps) {
    const [status, setStatus] = useState<ConnectionStatus>("CONNECTING");

    useEffect(() => {
        if (devOnly && import.meta.env.PROD) return;

        // Subscribe to a heartbeat channel to monitor WebSocket health
        const channel = supabase
            .channel("__realtime-health__")
            .subscribe((channelStatus) => {
                if (channelStatus === "SUBSCRIBED") setStatus("OPEN");
                else if (channelStatus === "CHANNEL_ERROR") setStatus("CHANNEL_ERROR");
                else if (channelStatus === "CLOSED") setStatus("CLOSED");
                else setStatus("CONNECTING");
            });

        return () => { supabase.removeChannel(channel); };
    }, [devOnly]);

    if (devOnly && import.meta.env.PROD) return null;

    const isLive = status === "OPEN";

    return (
        <div
            title={`Realtime: ${status}`}
            style={{
                position: "fixed",
                bottom: "1rem",
                right: "1rem",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "5px 10px",
                borderRadius: "999px",
                background: isLive
                    ? "rgba(0, 200, 120, 0.12)"
                    : "rgba(120, 120, 120, 0.12)",
                border: `1px solid ${isLive ? "rgba(0, 200, 120, 0.35)" : "rgba(150,150,150,0.25)"}`,
                backdropFilter: "blur(8px)",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.04em",
                color: isLive ? "#00c878" : "#888",
                userSelect: "none",
                cursor: "default",
                transition: "all 0.4s ease",
            }}
        >
            <span
                style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: isLive ? "#00c878" : "#888",
                    display: "inline-block",
                    animation: isLive ? "rsPulse 1.8s ease-in-out infinite" : "none",
                }}
            />
            {isLive ? "LIVE" : status === "CONNECTING" ? "Connecting…" : "Reconnecting…"}
            <style>{`
        @keyframes rsPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.4); }
        }
      `}</style>
        </div>
    );
}
