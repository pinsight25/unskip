import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Simplified output to prevent 404s
        chunkFileNames: '[name]-[hash].js',
        entryFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash][extname]'
      }
    },
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1000, // Increase limit to 1MB
    // Enable source maps for debugging (disabled in production for smaller bundles)
    sourcemap: mode === 'development',
    // Optimize minification
    minify: 'esbuild', // Use esbuild instead of terser
    // Ensure proper module resolution
    target: 'esnext',
    modulePreload: false, // Disable module preload to prevent 404s
  },
  // Remove optimizeDeps to avoid React hook conflicts
}));
