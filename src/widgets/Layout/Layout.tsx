import { Outlet, useLocation } from "react-router-dom";
import BottomBar from "@/widgets/Layout/BottomBar";
import Header from "./Header";

export default function Layout() {
  const location = useLocation();
  const hideBottomBar = [
    "/login",
    "/signup",
    "/signup/verify",
    "/signup/password",
    "/signup/nickname",
    "/signup/profile",
    "/signup/complete",
    "/home/chat",
    "/home/chat-demo",
    "/profile-detail",
    "/pre-test",
    "/chat-demo",
    "/home/private-chat",
  ].some((path) => location.pathname.startsWith(path));
  const hideHeader =
    [
      "/my/notifications/",
      "/profile-detail",
      "/pre-test",
      "/home/chat",
      "/home/chat-demo",
      "/my/setting",
      "/chat-demo",
      "/login",
      "/home/private-chat",
    ].some((path) => location.pathname.startsWith(path)) ||
    location.pathname === "/my";

  const isPretestPage = location.pathname.startsWith("/pre-test");
  const isFullScreenPage = hideBottomBar || isPretestPage;

  return (
    <div className="relative min-h-[100dvh] flex flex-col overflow-hidden w-full bg-[radial-gradient(ellipse_at_center,_#2a2a2a_20%,_#1c1c1c_80%)]">
      {!hideHeader && <Header />}
      <main
        className={`flex-1 flex flex-col w-full ${
          isFullScreenPage
            ? "h-full"
            : "max-w-md mx-auto items-center justify-center gap-y-8"
        }`}
        style={{
          paddingBottom: isFullScreenPage
            ? "0px"
            : "calc(64px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <Outlet />
      </main>
      {!hideBottomBar && <BottomBar />}
    </div>
  );
}
