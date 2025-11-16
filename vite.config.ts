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
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    cssCodeSplit: true,
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React vendors
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'react-vendor';
          }
          
          // Radix UI components
          if (id.includes('@radix-ui')) {
            return 'radix-ui';
          }
          
          // Video libraries
          if (id.includes('hls.js')) {
            return 'video';
          }
          
          // Form libraries
          if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
            return 'forms';
          }
          
          // Charts
          if (id.includes('recharts')) {
            return 'charts';
          }
          
          // Split CSS by page for better caching
          if (id.includes('src/styles/common.css')) {
            return 'common-styles';
          }
          if (id.includes('src/styles/pages/reviews')) {
            return 'reviews-styles';
          }
          if (id.includes('src/styles/pages/treatments')) {
            return 'treatments-styles';
          }
          if (id.includes('src/styles/pages/booking')) {
            return 'booking-styles';
          }
        },
        
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return `assets/[name]-[hash][extname]`;
          
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          
          // Separate CSS with stable naming for caching
          if (ext === 'css') {
            if (assetInfo.name.includes('common')) {
              return `assets/css/common-[hash].css`;
            }
            if (assetInfo.name.includes('reviews')) {
              return `assets/css/reviews-[hash].css`;
            }
            if (assetInfo.name.includes('treatments')) {
              return `assets/css/treatments-[hash].css`;
            }
            if (assetInfo.name.includes('booking')) {
              return `assets/css/booking-[hash].css`;
            }
            return `assets/css/[name]-[hash].css`;
          }
          
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          } else if (/woff2?|ttf|eot/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
        pure_funcs: mode === 'production' ? ['console.log', 'console.info', 'console.debug'] : [],
      },
      mangle: {
        safari10: true,
      },
    },
  },
}));
