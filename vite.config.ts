import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Target modern browsers — enables native ESM, smaller output
    target: "esnext",

    // Enable source maps for production debugging (disable if not needed)
    sourcemap: false,

    // Raise the chunk warning threshold to 600kb since we split aggressively
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        /**
         * Manual chunk splitting strategy:
         *
         * 1. vendor-react:   react + react-dom + react-router-dom (critical path)
         * 2. vendor-motion:  framer-motion (heavy, but needed on hero)
         * 3. vendor-ui:      all Radix UI components (admin + UI lib)
         * 4. vendor-query:   TanStack Query + supabase client
         * 5. vendor-charts:  recharts (admin only)
         * 6. Each admin page becomes its own chunk (via lazy imports in App.tsx)
         * 7. Each portfolio section becomes its own chunk (via lazy imports in Index.tsx)
         *
         * Result: browsers cache each chunk independently.
         * A content update only invalidates the changed chunk.
         */
        manualChunks(id: string) {
          // Core React runtime — always needed
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/") || id.includes("node_modules/react-router-dom/") || id.includes("node_modules/scheduler/")) {
            return "vendor-react";
          }

          // Framer Motion — large but needed for Hero animations
          if (id.includes("node_modules/framer-motion/")) {
            return "vendor-motion";
          }

          // All Radix UI components grouped together
          if (id.includes("node_modules/@radix-ui/")) {
            return "vendor-ui";
          }

          // Supabase + TanStack Query (data layer)
          if (id.includes("node_modules/@supabase/") || id.includes("node_modules/@tanstack/")) {
            return "vendor-query";
          }

          // Recharts — only used in admin (lazy-loaded already)
          if (id.includes("node_modules/recharts/") || id.includes("node_modules/d3-")) {
            return "vendor-charts";
          }

          // Lucide icons — medium sized, shared
          if (id.includes("node_modules/lucide-react/")) {
            return "vendor-icons";
          }

          // Everything else in node_modules → vendor-misc
          if (id.includes("node_modules/")) {
            return "vendor-misc";
          }
        },
      },
    },
  },
});
