import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useRoutes } from "react-router-dom";
import "./index.css";
import routes from "@/app/router"; // 라우트 배열 import
import "@/shared/styles/fonts.css";

function MainRoutes() {
  return useRoutes(routes);
}

interface ReactRootContainer {
  unmount: () => void;
}

interface ExtendedHTMLElement extends HTMLElement {
  _reactRootContainer?: ReactRootContainer;
}

const container = document.getElementById("root");
if (container) {
  // 기존 root가 있으면 제거
  const extendedContainer = container as ExtendedHTMLElement;
  if (extendedContainer._reactRootContainer) {
    extendedContainer._reactRootContainer.unmount();
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
