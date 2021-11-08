import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000,
    fs: {
      strict: false,
    },
  },
  build: {
    target: "chrome96",
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    brotliSize: true,
    sourcemap: false,
    minify: false,
    rollupOptions: {
      input: {
        "tab-manager": path.resolve(__dirname, "tab-manager.html"),
      },
      treeshake: "recommended",
      external: ["react", "react-dom"],
      output: {
        format: "cjs",
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
        // manualChunks: {
        //   lib: ["react", "react-dom", "react-beautiful-dnd"],
        // },
        manualChunks: () => "everything.js",
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@web": path.resolve(__dirname, ".."),
    },
  },
});
