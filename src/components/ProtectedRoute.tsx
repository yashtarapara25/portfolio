import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

/**
 * ProtectedRoute — wraps admin pages.
 * - While checking auth: shows a minimal loading screen.
 * - If not logged in or not an admin: redirects to /admin/login.
 * - If authenticated admin: renders children.
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const location = useLocation();
    const [status, setStatus] = useState<"loading" | "authorized" | "unauthorized">("loading");

    useEffect(() => {
        let mounted = true;

        const check = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) { if (mounted) setStatus("unauthorized"); return; }

                const { data } = await supabase
                    .from("user_roles")
                    .select("role")
                    .eq("user_id", user.id)
                    .single();

                if (mounted) {
                    setStatus(data?.role === "admin" ? "authorized" : "unauthorized");
                }
            } catch {
                if (mounted) setStatus("unauthorized");
            }
        };

        check();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
            check();
        });

        return () => {
            mounted = false;
            subscription?.unsubscribe();
        };
    }, []);

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
                {/* Animated spinner */}
                <div className="relative w-14 h-14">
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20" />
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin" />
                    <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-blue-400 animate-spin" style={{ animationDuration: "1.5s", animationDirection: "reverse" }} />
                </div>
                <p className="text-cyan-400 text-sm font-display tracking-widest animate-pulse">
                    Checking authentication…
                </p>
            </div>
        );
    }

    if (status === "unauthorized") {
        // Preserve where the user wanted to go so we can redirect back after login
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}
