import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Fuerza a Vite a usar una única instancia de React
      react: path.resolve("./node_modules/react"),
    },
  },
  // Opcional: Obliga a re-optimizar la librería
  optimizeDeps: {
    include: ["@react-pdf/renderer"],
  },
});
