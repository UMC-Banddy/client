import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useRoutes } from "react-router-dom";
import "./index.css";
import routes from "@/app/router"; // 라우트 배열 import
import "@/shared/styles/fonts.css";

// sockjs-client의 global 오류 해결
if (typeof global === "undefined") {
  (window as any).global = window;
}

function MainRoutes() {
  return useRoutes(routes);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <MainRoutes />
    </BrowserRouter>
  </StrictMode>
);
