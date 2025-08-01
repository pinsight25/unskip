import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
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
    // Optimize chunk splitting for better performance
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching and loading
        manualChunks: (id) => {
          // Vendor chunks - third-party libraries
          if (id.includes('node_modules')) {
            if (id.includes('react') && !id.includes('react-router')) {
              return 'vendor-react';
            }
            if (id.includes('react-router')) {
              return 'vendor-router';
            }
            if (id.includes('@tanstack/react-query')) {
              return 'vendor-query';
            }
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            if (id.includes('@radix-ui') || id.includes('lucide-react') || 
                id.includes('class-variance-authority') || id.includes('clsx') || 
                id.includes('tailwind-merge')) {
              return 'vendor-ui';
            }
            if (id.includes('date-fns') || id.includes('react-hook-form') || 
                id.includes('@hookform/resolvers') || id.includes('zod')) {
              return 'vendor-utils';
            }
            // Other node_modules go to vendor chunk
            return 'vendor';
          }
          
          // Feature-based chunks
          if (id.includes('src/pages/Chat') || id.includes('src/hooks/useMessages') || 
              id.includes('src/hooks/useChatManager')) {
            return 'feature-chat';
          }
          if (id.includes('src/pages/CarDetail') || id.includes('src/pages/SellCar') || 
              id.includes('src/hooks/useCarQueries') || id.includes('src/hooks/useSellCarForm')) {
            return 'feature-car';
          }
          if (id.includes('src/pages/Dealer') || id.includes('src/hooks/queries/useDealers')) {
            return 'feature-dealer';
          }
          if (id.includes('src/pages/Accessory') || id.includes('src/hooks/queries/useAccessories')) {
            return 'feature-accessory';
          }
          if (id.includes('src/pages/Profile') || id.includes('src/hooks/useProfile')) {
            return 'feature-profile';
          }
          
          // Default chunk
          return undefined;
        },
        // Optimize chunk naming for better caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `js/[name]-[hash].js`;
        },
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        }
      }
    },
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1000, // Increase limit to 1MB
    // Enable source maps for debugging (disabled in production for smaller bundles)
    sourcemap: mode === 'development',
    // Optimize minification
    minify: 'esbuild', // Use esbuild instead of terser
  },
  // Optimize dependencies pre-bundling
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      '@supabase/supabase-js',
      'lucide-react'
    ],
    exclude: [
      // Exclude large dependencies that should be loaded separately
    ]
  }
}));
