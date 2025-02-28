import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      filename: "bundle-analysis.html", // Output file
      open: true, // Open report automatically
      gzipSize: true, // Show gzipped size
      brotliSize: true, // Show brotli compressed size
    }),
  ],
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    allowedHosts: [
      "3fe2-2401-4900-4ff0-fd79-486c-12ce-4ecc-ec33.ngrok-free.app",
      "localhost",
      "127.0.0.1",
    ],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "zustand", "supabase-js"],
        },
      },
    },
  },
});
