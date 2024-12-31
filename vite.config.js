import { defineConfig } from "vite";
import path from "path";
import { nodePolyfills } from "vite-plugin-node-polyfills";

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
    nodePolyfills(),
  ],
  css: {
    preprocessorOptions: {},
  },
  server: {
    port: 5000,
    open: true,
  },
  define: {
    "process.env": {
      VITE_AIRTABLE_PAT: JSON.stringify(process.env.VITE_AIRTABLE_PAT),
      VITE_AIRTABLE_BASE_ID: JSON.stringify(process.env.VITE_AIRTABLE_BASE_ID),
      VITE_SPOTIFY_REFRESH_TOKEN: JSON.stringify(
        process.env.VITE_SPOTIFY_REFRESH_TOKEN
      ),
      VITE_SPOTIFY_CLIENT_ID: JSON.stringify(
        process.env.VITE_SPOTIFY_CLIENT_ID
      ),
      VITE_SPOTIFY_CLIENT_SECRET: JSON.stringify(
        process.env.VITE_SPOTIFY_CLIENT_SECRET
      ),
      VITE_AIRTABLE_TOKEN_ID: JSON.stringify(
        process.env.VITE_AIRTABLE_TOKEN_ID
      ),
    },
  },
});
