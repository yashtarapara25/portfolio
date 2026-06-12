import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      // Check if user is admin
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        if (data?.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          setError("You do not have admin access");
          await supabase.auth.signOut();
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow & grid decoration */}
      <div className="absolute -left-12 -top-12 w-48 h-48 rounded-full bg-[#00FF88]/5 blur-3xl pointer-events-none" />
      <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-[#00FF88]/5 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      <div className="bg-[#0B1220]/45 backdrop-blur-xl border border-[rgba(255,255,255,0.07)] rounded-2xl p-8 w-full max-w-md relative overflow-hidden shadow-2xl">
        {/* Corner Brackets */}
        <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#00FF88]/30 pointer-events-none" />
        <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#00FF88]/30 pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#00FF88]/30 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#00FF88]/30 pointer-events-none" />
        
        {/* Scanning Sweep */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="hud-scan-slow" />
        </div>

        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold font-space text-white mb-1.5">
            Admin <span className="text-[#00FF88] text-gradient">Login</span>
          </h1>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mb-6">
            SYS_LOG // SECURITY_GATEWAY
          </p>
        </div>

        {error && (
          <Alert className="mb-4 bg-red-500/10 border-red-500/30 text-red-400 font-mono text-xs">
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Email Address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#050816]/50 border-[rgba(255,255,255,0.1)] focus:border-[#00FF88]/40 focus:ring-1 focus:ring-[#00FF88]/20 text-zinc-300 font-mono text-sm placeholder-zinc-700"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Security Key
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#050816]/50 border-[rgba(255,255,255,0.1)] focus:border-[#00FF88]/40 focus:ring-1 focus:ring-[#00FF88]/20 text-zinc-300 font-mono text-sm placeholder-zinc-700"
              placeholder="••••••••"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00FF88]/10 border border-[#00FF88]/30 hover:border-[#00FF88] text-[#00FF88] hover:bg-[#00FF88]/20 transition-all font-mono font-bold uppercase tracking-widest shadow-[0_0_12px_rgba(0,255,136,0.1)] py-5"
          >
            {loading ? "Authenticating..." : "Establish Session"}
          </Button>
        </form>
      </div>
    </div>
  );
}
