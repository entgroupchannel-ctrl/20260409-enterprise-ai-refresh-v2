import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        // Split heavy vendor libraries into their own chunks so they cache
        // separately and don't re-download on every app deploy.
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/scheduler/')) {
            return 'vendor-react';
          }
          if (id.includes('/react-router') || id.includes('/@remix-run/router')) {
            return 'vendor-router';
          }
          if (id.includes('/@tanstack/')) {
            return 'vendor-query';
          }
          if (id.includes('/@supabase/') || id.includes('/@supabase-')) {
            return 'vendor-supabase';
          }
          if (id.includes('/@radix-ui/')) {
            return 'vendor-radix';
          }
          if (id.includes('/lucide-react/')) {
            return 'vendor-icons';
          }
          if (id.includes('/recharts/') || id.includes('/d3-')) {
            return 'vendor-charts';
          }
          if (id.includes('/framer-motion/')) {
            return 'vendor-motion';
          }
          if (
            id.includes('/jspdf') ||
            id.includes('/html2canvas') ||
            id.includes('/xlsx') ||
            id.includes('/docx')
          ) {
            return 'vendor-docs';
          }
          return 'vendor';
        },
      },
    },
  },
}));
