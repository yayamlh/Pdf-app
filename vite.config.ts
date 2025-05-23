import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

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
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'react',
            'react-dom',
          ],
          'ui': [
            '@radix-ui',
            'lucide-react',
          ],
        },
      },
      external: [
        'pdfjs-dist',      // <<< --- Add this to tell Vite NOT to bundle pdfjs-dist
      ],
    },
  },
  optimizeDeps: {
    exclude: ['lovable-tagger', 'pdfjs-dist'], // <<< --- Also exclude from optimization
  },
}));
