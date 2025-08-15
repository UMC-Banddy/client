import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
// import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiBase = env.VITE_API_BASE_URL || "https://banddy.site";
  const plugins = [react(), svgr()];

  // PWA 설정 임시 비활성화 (Service Worker 404 오류 해결을 위해)
  // plugins.push(
  //   VitePWA({
  //     registerType: "autoUpdate",
  //     includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
  //     workbox: {
  //       globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
  //       skipWaiting: true,
  //       clientsClaim: true,
  //       maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
  //       globIgnores: ["**/guitar-boy-*.svg"],
  //       // Service Worker 파일명 명시적 설정
  //       swDest: "sw.js",
  //     },
  //     manifest: {
  //       name: "Banddy",
  //       short_name: "Banddy",
  //       description: "밴드 음악 커뮤니티",
  //       theme_color: "#ffffff",
  //       background_color: "#121212",
  //       display: "standalone",
  //       start_url: "/",
  //       scope: "/",
  //       icons: [
  //         {
  //           src: "pwa-192x192.png",
  //           sizes: "192x192",
  //           type: "image/png",
  //         },
  //         {
  //           src: "pwa-512x512.png",
  //           sizes: "512x512",
  //           type: "image/png",
  //         },
  //         {
  //           src: "pwa-512x512.png",
  //           sizes: "512x512",
  //           type: "image/png",
  //           purpose: "any maskable",
  //         },
  //       ],
  //     },
  //     // Service Worker 등록 방식 설정
  //     injectRegister: "auto",
  //   })
  // );

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
      proxy: {
        "/api": {
          target: apiBase,
          changeOrigin: true,
          secure: false,
        },
        "/auth": {
          target: apiBase,
          changeOrigin: true,
          secure: false,
        },
        "/member": {
          target: apiBase,
          changeOrigin: true,
          secure: false,
        },
        "/ws": {
          target: apiBase,
          changeOrigin: true,
          ws: true,
          secure: false,
        },
        // 백엔드가 기대하는 경로에 맞춰 추가 프록시 설정
        "/member/login": {
          target: apiBase,
          changeOrigin: true,
          secure: false,
        },
        "/member/signup": {
          target: apiBase,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: {
      port: 4173,
      host: true,
    },
  };
});
