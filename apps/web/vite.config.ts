// import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { resolve } from "path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/telegram-miniapp-bot/",
  plugins: [
    // Please make sure that '@tanstack/router-plugin' is passed before '@vitejs/plugin-react'
    react(),
    tailwindcss(),
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    basicSsl(),
    // tsconfigPaths(),
  ],
  build: {
    target: "esnext",
    copyPublicDir: true,
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        admin: resolve(__dirname, "404.html"),
      },
      // Making extra sure that the server is not bundled into the client
      external: ["@repo/server"],
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
        warn(warning);
      },
    },
  },
});
