import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "localhost",
    port: 3001,
    proxy: {
      // Proxy requests starting with / to the backend server
      "/api": {
        target: "http://localhost:1122", // Replace with your backend server address
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ""), // Optionally remove /api prefix
      },
    },
  },
});
