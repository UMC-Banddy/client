import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useRoutes } from "react-router-dom";
import "./index.css";
import routes from "@/app/router"; // 라우트 배열 import
import "@/shared/styles/fonts.css";

function MainRoutes() {
  return useRoutes(routes);
}

const container = document.getElementById("root");
if (container) {
  // 기존 root가 있으면 제거
  if ((container as any)._reactRootContainer) {
    (container as any)._reactRootContainer.unmount();
  }

  const root = createRoot(container);
  root.render(
    <StrictMode>
      <BrowserRouter>
        <MainRoutes />
      </BrowserRouter>
    </StrictMode>
  );
}
