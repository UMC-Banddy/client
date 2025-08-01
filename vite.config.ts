import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const plugins = [react(), svgr()];

  // PWA 설정 (개발 및 프로덕션 모두 활성화)
  plugins.push(
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        skipWaiting: true,
        clientsClaim: true,
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        globIgnores: ["**/guitar-boy-*.svg"],
        // Service Worker 파일명 명시적 설정
        swDest: "sw.js",
      },
      manifest: {
        name: "Banddy",
        short_name: "Banddy",
        description: "밴드 음악 커뮤니티",
        theme_color: "#ffffff",
        background_color: "#121212",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      // Service Worker 등록 방식 설정
      injectRegister: "auto",
      // 개발 환경에서도 PWA 활성화
      devOptions: {
        enabled: true,
        type: "module",
      },
    })
  );

  return {
    plugins,
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    define: {
      global: "globalThis",
    },
    build: {
      outDir: "dist",
      sourcemap: mode === "development",
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
            router: ["react-router-dom"],
            ui: ["@mui/material", "@emotion/react", "@emotion/styled"],
            state: ["valtio", "zustand"],
            websocket: ["@stomp/stompjs", "sockjs-client"],
          },
        },
      },
    },
    server: {
      port: 5173,
      host: true,
    },
    preview: {
      port: 4173,
      host: true,
    },
  };
});
