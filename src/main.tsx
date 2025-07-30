import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useRoutes } from "react-router-dom";
import "./index.css";
import routes from "@/app/router"; // 라우트 배열 import
import "@/shared/styles/fonts.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUser } from "@/features/setting/hooks/useUser";
import AuthProvider from "@/shared/components/AuthProvider";

// QueryClient 생성
const queryClient = new QueryClient();

function MainRoutes() {
  useUser(); // 유저 정보 불러오기 (로딩 트리거)
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
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <MainRoutes />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>
  );
}
