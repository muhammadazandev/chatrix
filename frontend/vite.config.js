import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  server: {
    hmr: {
      overlay: true, // Show errors
      port: 5000,
    },
    watch: {
      ignored: ["**/node_modules/**", "**/.git/**"],
    },
  },
  clearScreen: false, // Show full logs
  build: {
    sourcemap: true,
  },
});
