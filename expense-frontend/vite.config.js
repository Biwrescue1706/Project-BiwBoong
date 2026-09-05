import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",

      devOptions: {
        enabled: true,
      },

      manifest: {
        name: "ระบบบันทึกรายรับรายจ่าย",
        short_name: "รายรับรายจ่าย",
        description: "ระบบบันทึกรายรับรายจ่าย",

        lang: "th",

        start_url: "/",
        scope: "/",
        display: "standalone",

        background_color: "#ffffff",
        theme_color: "#4CAF50",

        icons: [
          {
            src: "/BiwBoong192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/BiwBoong512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },

      workbox: {
        cleanupOutdatedCaches: true,
      },
    }),
  ],
});