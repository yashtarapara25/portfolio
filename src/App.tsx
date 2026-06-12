import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";


// ── Admin routes: lazy-loaded so they NEVER hit the main bundle ──────────────
// Each admin page is a separate JS chunk, loaded only when navigated to.
const AdminLogin      = lazy(() => import("./components/AdminLogin"));
const AdminDashboard  = lazy(() => import("./components/AdminDashboard"));
const AdminProjects   = lazy(() => import("./components/AdminProjects"));
const AdminSkills     = lazy(() => import("./components/AdminSkills"));
const AdminEducation  = lazy(() => import("./components/AdminEducation"));
const AdminAchievements = lazy(() => import("./components/AdminAchievements"));
const AdminSettings   = lazy(() => import("./components/AdminSettings"));
const AdminMessages   = lazy(() => import("./components/AdminMessages"));

// Simple fallback shown while admin chunks are loading
function AdminFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-muted-foreground font-space">Loading admin…</span>
      </div>
    </div>
  );
}

// QueryClient with staleTime so remounts don't re-fetch unnecessarily
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,      // treat data as fresh for 1 minute
      gcTime: 300_000,        // keep unused cache for 5 minutes
      refetchOnWindowFocus: false, // don't re-fetch when user alt-tabs back
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Routes>
          {/* ── Public ── */}
          <Route path="/" element={<Index />} />

          {/* ── Admin: each in its own lazy Suspense boundary ── */}
          <Route
            path="/admin/login"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminLogin />
              </Suspense>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <Suspense fallback={<AdminFallback />}>
                <ProtectedRoute><AdminDashboard /></ProtectedRoute>
              </Suspense>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <Suspense fallback={<AdminFallback />}>
                <ProtectedRoute><AdminProjects /></ProtectedRoute>
              </Suspense>
            }
          />
          <Route
            path="/admin/skills"
            element={
              <Suspense fallback={<AdminFallback />}>
                <ProtectedRoute><AdminSkills /></ProtectedRoute>
              </Suspense>
            }
          />
          <Route
            path="/admin/education"
            element={
              <Suspense fallback={<AdminFallback />}>
                <ProtectedRoute><AdminEducation /></ProtectedRoute>
              </Suspense>
            }
          />
          <Route
            path="/admin/achievements"
            element={
              <Suspense fallback={<AdminFallback />}>
                <ProtectedRoute><AdminAchievements /></ProtectedRoute>
              </Suspense>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <Suspense fallback={<AdminFallback />}>
                <ProtectedRoute><AdminSettings /></ProtectedRoute>
              </Suspense>
            }
          />
          <Route
            path="/admin/messages"
            element={
              <Suspense fallback={<AdminFallback />}>
                <ProtectedRoute><AdminMessages /></ProtectedRoute>
              </Suspense>
            }
          />

          {/* ── Catch-all ── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
