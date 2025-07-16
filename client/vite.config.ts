import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
        },
      },
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/generative": {
        target: "http://localhost:4001/api/v1",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    port: 3001,
  },
});
