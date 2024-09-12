import { defineConfig } from "vite";
import path from "path";
import postcss from "rollup-plugin-postcss";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./app"),
    },
  },
  publicDir: "public",
  build: {
    outDir: "dist",
    assetsDir: "./",
    minify: "terser",
    cssCodeSplit: false,
    emptyOutDir: true,
    terserOptions: {
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      input: {
        main: "app/index.js",
      },

      output: {
        chunkFileNames: "[name].js",
        entryFileNames: "[name].js",
        format: "es",
        inlineDynamicImports: false,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name == "style.css") return "main.css";
          return assetInfo.name;
        },
      },
    },
  },
  plugins: [
    require("cssnano")({
      preset: "default",
    }),
  ],
  css: {
    preprocessorOptions: {},
  },
  server: {
    port: 5000,
    open: true,
  },
});
