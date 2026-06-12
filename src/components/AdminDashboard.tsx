import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/hooks/use-admin";
import { LogOut, Users, BookOpen, GraduationCap, Settings, Mail, Award } from "lucide-react";

export default function AdminDashboard() {
  const { user, isAdmin, loading } = useAdmin();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-300">Loading...</p>
      </div>
    );
  }

  if (!isAdmin || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-400">Unauthorized access</p>
      </div>
    );
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const menuItems = [
    {
      icon: Users,
      title: "Projects",
      description: "Manage your projects",
      onClick: () => navigate("/admin/projects"),
    },
    {
      icon: BookOpen,
      title: "Skills",
      description: "Manage your skills",
      onClick: () => navigate("/admin/skills"),
    },
    {
      icon: GraduationCap,
      title: "Education",
      description: "Manage your education",
      onClick: () => navigate("/admin/education"),
    },
    {
      icon: Settings,
      title: "Settings",
      description: "Site configuration",
      onClick: () => navigate("/admin/settings"),
    },
    {
      icon: Mail,
      title: "Messages",
      description: "View contact form submissions",
      onClick: () => navigate("/admin/messages"),
    },
    {
      icon: Award,
      title: "Achievements",
      description: "Manage certificates & awards",
      onClick: () => navigate("/admin/achievements"),
    },
  ];

  return (
    <div className="min-h-screen bg-[#050816] relative overflow-hidden text-zinc-300 font-sans">
      {/* Background glow and grid overlay */}
      <div className="absolute -left-12 -top-12 w-48 h-48 rounded-full bg-[#00FF88]/5 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

      <nav className="bg-[#050816]/90 backdrop-blur-xl border-b border-[#00FF88]/15 p-4 relative z-20">
        <div className="container max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
            <h1 className="text-xl font-bold font-space text-white tracking-wide">
              Admin <span className="text-[#00FF88] text-gradient">Console</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-zinc-500 hidden sm:inline">{user.email}</span>
            <Button
              onClick={handleLogout}
              className="gap-2 bg-[#00FF88]/10 border border-[#00FF88]/30 hover:border-[#00FF88] text-[#00FF88] hover:bg-[#00FF88]/20 transition-all font-mono text-xs uppercase font-bold tracking-wider"
            >
              <LogOut size={14} />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container max-w-6xl mx-auto py-12 px-6 relative z-10">
        <div className="mb-10 border-b border-[rgba(255,255,255,0.05)] pb-6">
          <h2 className="text-3xl sm:text-4xl font-bold font-space text-white mb-1">
            System <span className="text-[#00FF88] text-gradient">Registry Control</span>
          </h2>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
            SYS_ADMIN // CONSOLE_SYSTEMS_ONLINE
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.title}
                onClick={item.onClick}
                className="group relative bg-[#0b1120]/45 backdrop-blur-xl border border-[rgba(255,255,255,0.06)] hover:border-[#00FF88]/30 rounded-2xl p-6 text-left transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,255,136,0.06)] overflow-hidden cursor-pointer flex flex-col justify-between min-h-[150px] relative"
              >
                {/* L-shaped corner indicators */}
                <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#00FF88]/20 group-hover:border-[#00FF88]/60 transition-colors pointer-events-none" />
                <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#00FF88]/20 group-hover:border-[#00FF88]/60 transition-colors pointer-events-none" />
                <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-[#00FF88]/20 group-hover:border-[#00FF88]/60 transition-colors pointer-events-none" />
                <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-[#00FF88]/20 group-hover:border-[#00FF88]/60 transition-colors pointer-events-none" />
                
                {/* Scanning sweep */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                  <div className="hud-scan opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div>
                  <Icon className="text-[#00FF88]/70 group-hover:text-[#00FF88] transition-colors mb-4 group-hover:scale-105 duration-300" size={26} />
                  <h3 className="text-lg font-bold font-space text-white mb-1 group-hover:text-[#00FF88] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-zinc-500 font-sans text-xs leading-relaxed group-hover:text-zinc-400 transition-colors">
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
