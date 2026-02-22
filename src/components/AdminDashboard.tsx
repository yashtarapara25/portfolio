import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/hooks/use-admin";
import { LogOut, Users, BookOpen, GraduationCap, Settings, Mail } from "lucide-react";

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
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <nav className="bg-gray-900 border-b border-gray-700 p-4">
        <div className="container max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-cyan-400">Admin Panel</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">{user.email}</span>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container max-w-6xl mx-auto py-12 px-4">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-white mb-2">Welcome</h2>
          <p className="text-gray-400">Manage your portfolio content</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.title}
                onClick={item.onClick}
                className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-6 text-left transition-all duration-300 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/10"
              >
                <Icon className="text-cyan-400 mb-4" size={32} />
                <h3 className="text-xl font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
